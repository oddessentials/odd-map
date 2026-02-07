/**
 * Client Registry System - Production-Safe Multi-Tenant Config Loader
 *
 * Uses explicit import maps to ensure deterministic bundling and tree-shaking.
 * Production builds ONLY load clients from clients.prod.json.
 */

import type { MapConfig } from './map-config.schema.js';

export interface ClientRegistry {
  clients: string[];
  configPath: string;
  clientConfigPath: string;
  fixtureClients?: string[];
  defaultClient?: string;
}

// Production-only import map - Vite eliminates test configs in prod builds
const PROD_CONFIG_IMPORT_MAP: Record<string, () => Promise<unknown>> = {
  usg: () => import('../../config/usg-map-config.json'),
  oddessentials: () => import('../../config/oddessentials-map-config.json'),
};

// Test import map - includes all clients including fixtures
const TEST_CONFIG_IMPORT_MAP: Record<string, () => Promise<unknown>> = {
  usg: () => import('../../config/usg-map-config.json'),
  oddessentials: () => import('../../config/oddessentials-map-config.json'),
  acme: () => import('../../config/acme-map-config.json'),
  demo: () => import('../../config/demo-map-config.json'),
};

// Production client config import map
const PROD_CLIENT_CONFIG_MAP: Record<string, () => Promise<unknown>> = {
  usg: () => import('../../config/usg-client.json'),
  oddessentials: () => import('../../config/oddessentials-client.json'),
};

// Test client config import map
const TEST_CLIENT_CONFIG_MAP: Record<string, () => Promise<unknown>> = {
  usg: () => import('../../config/usg-client.json'),
  oddessentials: () => import('../../config/oddessentials-client.json'),
};

let cachedRegistry: ClientRegistry | null = null;

/**
 * Get the active client registry based on build mode.
 * - VITE_CLIENT_REGISTRY=demo → clients.demo.json (GitHub Pages demo)
 * - Production (no override)  → clients.prod.json
 * - Development/test          → clients.test.json
 */
export async function getClientRegistry(): Promise<ClientRegistry> {
  if (cachedRegistry) return cachedRegistry;

  const registryOverride = import.meta.env.VITE_CLIENT_REGISTRY;

  if (registryOverride === 'demo') {
    const registry = await import('../../config/clients.demo.json');
    cachedRegistry = registry.default || registry;
  } else if (import.meta.env.PROD) {
    const registry = await import('../../config/clients.prod.json');
    cachedRegistry = registry.default || registry;
  } else {
    const registry = await import('../../config/clients.test.json');
    cachedRegistry = registry.default || registry;
  }

  return cachedRegistry;
}

/**
 * Get map config for a specific client from environment-appropriate import map
 * @throws Error if client not in registry or import map
 */
export async function getConfigForClient(clientId: string): Promise<MapConfig> {
  const registry = await getClientRegistry();

  // Verify client is in active registry
  if (!registry.clients.includes(clientId)) {
    throw new Error(
      `Client "${clientId}" not found in registry. ` +
        `Available clients: ${registry.clients.join(', ')}. ` +
        `(Mode: ${import.meta.env.PROD ? 'production' : 'development'})`
    );
  }

  // Select import map based on environment - Vite eliminates unused branch at build time
  const importMap = import.meta.env.PROD ? PROD_CONFIG_IMPORT_MAP : TEST_CONFIG_IMPORT_MAP;

  const importFn = importMap[clientId];
  if (!importFn) {
    throw new Error(
      `Client "${clientId}" is in registry but not in import map. ` +
        `This is a configuration error—add the client to the appropriate import map.`
    );
  }

  const configModule = (await importFn()) as { default?: MapConfig } & MapConfig;
  return (configModule.default ?? configModule) as MapConfig;
}

/**
 * Get client config JSON for a specific client from environment-appropriate import map
 * @throws Error if client not in registry or import map
 */
export async function getClientConfigForClient(clientId: string): Promise<unknown> {
  const registry = await getClientRegistry();

  if (!registry.clients.includes(clientId)) {
    throw new Error(
      `Client "${clientId}" not found in registry. ` +
        `Available clients: ${registry.clients.join(', ')}. ` +
        `(Mode: ${import.meta.env.PROD ? 'production' : 'development'})`
    );
  }

  const importMap = import.meta.env.PROD ? PROD_CLIENT_CONFIG_MAP : TEST_CLIENT_CONFIG_MAP;

  const importFn = importMap[clientId];
  if (!importFn) {
    throw new Error(
      `Client "${clientId}" is in registry but not in client config import map. ` +
        `This is a configuration error—add the client to the appropriate client config import map.`
    );
  }

  const configModule = (await importFn()) as { default?: unknown };
  return configModule.default ?? configModule;
}

/**
 * Verify all clients in registry have import map entries
 * Used by verification scripts to catch config/import-map drift
 */
export function validateImportMap(registry: ClientRegistry): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  registry.clients.forEach((clientId) => {
    // Test map config
    if (!TEST_CONFIG_IMPORT_MAP[clientId]) {
      errors.push(`Client "${clientId}" in registry but missing from TEST_CONFIG_IMPORT_MAP`);
    }
    // Test client config (only for clients that have client configs, not fixture-only clients)
    const fixtureClients = registry.fixtureClients ?? [];
    if (!TEST_CLIENT_CONFIG_MAP[clientId] && !fixtureClients.includes(clientId)) {
      errors.push(`Client "${clientId}" in registry but missing from TEST_CLIENT_CONFIG_MAP`);
    }
  });

  // Verify PROD maps are subsets of TEST maps
  for (const clientId of Object.keys(PROD_CONFIG_IMPORT_MAP)) {
    if (!TEST_CONFIG_IMPORT_MAP[clientId]) {
      errors.push(
        `Client "${clientId}" in PROD_CONFIG_IMPORT_MAP but missing from TEST_CONFIG_IMPORT_MAP`
      );
    }
  }
  for (const clientId of Object.keys(PROD_CLIENT_CONFIG_MAP)) {
    if (!TEST_CLIENT_CONFIG_MAP[clientId]) {
      errors.push(
        `Client "${clientId}" in PROD_CLIENT_CONFIG_MAP but missing from TEST_CLIENT_CONFIG_MAP`
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Get all available client IDs in the active registry
 */
export async function getAvailableClients(): Promise<string[]> {
  const registry = await getClientRegistry();
  return [...registry.clients];
}

/**
 * Get the default client ID from the active registry.
 * Uses the explicit `defaultClient` field when present (e.g., demo registry),
 * falls back to the first client in the array (existing behavior).
 */
export async function getDefaultClient(): Promise<string> {
  const registry = await getClientRegistry();
  return registry.defaultClient ?? registry.clients[0];
}
