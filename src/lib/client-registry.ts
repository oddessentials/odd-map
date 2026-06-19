/**
 * Client Registry System - Production-Safe Multi-Tenant Config Loader
 *
 * Uses explicit import maps to ensure deterministic bundling and tree-shaking.
 * Production builds ONLY load clients from clients.prod.json.
 */

export interface ClientRegistry {
  clients: string[];
  fixtureClients?: string[];
  defaultClient?: string;
}

// Production client config import map - Vite eliminates test configs in prod builds.
// `acme` is the Google Maps showcase client; it ships in production/demo builds
// because it is listed in clients.prod.json and clients.demo.json.
const PROD_CLIENT_CONFIG_MAP: Record<string, () => Promise<unknown>> = {
  usg: () => import('../../config/usg-client.json'),
  oddessentials: () => import('../../config/oddessentials-client.json'),
  acme: () => import('../../config/acme-client.json'),
};

// Test client config import map - includes all clients including fixtures
const TEST_CLIENT_CONFIG_MAP: Record<string, () => Promise<unknown>> = {
  usg: () => import('../../config/usg-client.json'),
  oddessentials: () => import('../../config/oddessentials-client.json'),
  acme: () => import('../../config/acme-client.json'),
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

  // Object.hasOwn (not truthiness) so a client named after an inherited property
  // is treated as absent rather than matching a prototype member.
  if (!Object.hasOwn(importMap, clientId)) {
    throw new Error(
      `Client "${clientId}" is in registry but not in client config import map. ` +
        `This is a configuration error—add the client to the appropriate client config import map.`
    );
  }

  const importFn = importMap[clientId];
  const configModule = (await importFn()) as { default?: unknown };
  return configModule.default ?? configModule;
}

/**
 * Push a coverage error for each client in `clients` that has no OWN entry in
 * `map`. Clients listed in `skip` (e.g. fixture clients that legitimately have
 * no client config) are exempt. Uses Object.hasOwn so a client named after an
 * inherited Object property (e.g. "constructor", "toString") is correctly
 * treated as absent rather than matching a prototype member.
 */
function checkClientCoverage(
  clients: readonly string[],
  map: Record<string, unknown>,
  mapName: string,
  errors: string[],
  skip: readonly string[] = []
): void {
  for (const clientId of clients) {
    if (!Object.hasOwn(map, clientId) && !skip.includes(clientId)) {
      errors.push(`Client "${clientId}" in registry but missing from ${mapName}`);
    }
  }
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
  const fixtureClients = registry.fixtureClients ?? [];

  // Every registry client must resolve in the TEST client-config map,
  // except fixture-only clients that legitimately have no client config.
  checkClientCoverage(
    registry.clients,
    TEST_CLIENT_CONFIG_MAP,
    'TEST_CLIENT_CONFIG_MAP',
    errors,
    fixtureClients
  );

  // Verify the PROD client-config map is a subset of the TEST map (own keys only).
  for (const clientId of Object.keys(PROD_CLIENT_CONFIG_MAP)) {
    if (!Object.hasOwn(TEST_CLIENT_CONFIG_MAP, clientId)) {
      errors.push(
        `Client "${clientId}" in PROD_CLIENT_CONFIG_MAP but missing from TEST_CLIENT_CONFIG_MAP`
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Verify that every client in a registry resolves in the PRODUCTION import maps.
 *
 * Production builds — including the GitHub Pages demo, which builds in production
 * mode (`import.meta.env.PROD === true`) — only load clients present in the PROD
 * import maps. A client listed in such a registry but absent from these maps is
 * selectable in the UI yet unloadable, erroring at runtime ("in registry but not
 * in import map"). Run this against any registry consumed by a production build
 * (clients.prod.json and clients.demo.json) to catch that drift before release.
 */
export function validateProdImportMap(registry: ClientRegistry): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  checkClientCoverage(registry.clients, PROD_CLIENT_CONFIG_MAP, 'PROD_CLIENT_CONFIG_MAP', errors);

  // The default client must itself be a member of the registry. Otherwise the
  // default landing (no ?client=) resolves via getDefaultClient() to an id that
  // getClientConfigForClient rejects as "not found in registry" at runtime — a
  // green CI but a broken home page on the production/demo build.
  if (registry.defaultClient !== undefined && !registry.clients.includes(registry.defaultClient)) {
    errors.push(
      `defaultClient "${registry.defaultClient}" is not a member of the registry's clients array`
    );
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Get the user-selectable client IDs in the active registry.
 *
 * Fixture clients (used only as test fixtures) are excluded: they are
 * intentionally not wired into the client-config import maps, so offering them
 * via `?client=` would fail to load. They remain in `registry.clients` so tests
 * can still load them directly via getClientConfigForClient.
 */
export async function getAvailableClients(): Promise<string[]> {
  const registry = await getClientRegistry();
  const fixtureClients = registry.fixtureClients ?? [];
  return registry.clients.filter((clientId) => !fixtureClients.includes(clientId));
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
