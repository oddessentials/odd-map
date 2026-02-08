/**
 * Client Configuration Loader
 *
 * Loads, validates, and provides access to the active client's configuration.
 * Single entry point for all client-specific data in the application.
 *
 * Accessor functions return types from types/index.ts (Office, Region, etc.)
 * to enforce a single type hierarchy at compile time.
 */

import type { Office, OfficeWithRegion, Personnel, Region } from '../types/index.js';
import {
  ClientConfigSchema,
  MAX_SUPPORTED_SCHEMA_VERSION,
  type ValidatedClientConfig,
  formatValidationErrors,
} from './client-config.schema.js';
import { getClientConfigForClient } from './client-registry.js';

let activeConfig: ValidatedClientConfig | null = null;

// Memoization caches — invalidated when config changes
let cachedOffices: OfficeWithRegion[] | null = null;
let cachedRegions: Region[] | null = null;
let cachedRegionMap: Map<string, Region> | null = null;

function invalidateCaches(): void {
  cachedOffices = null;
  cachedRegions = null;
  cachedRegionMap = null;
}

/**
 * Load and validate the client configuration for the given client ID.
 * Caches the loaded config for the session (one client per page load).
 *
 * @throws Error with descriptive message on validation failure
 */
export async function loadClientConfig(clientId: string): Promise<ValidatedClientConfig> {
  const rawConfig = await getClientConfigForClient(clientId);

  // Pre-check schema version for a descriptive error before full Zod validation
  const raw = rawConfig as Record<string, unknown>;
  if (typeof raw.schemaVersion === 'number' && raw.schemaVersion > MAX_SUPPORTED_SCHEMA_VERSION) {
    throw new Error(
      `Configuration schema version ${raw.schemaVersion} is not supported. ` +
        `Maximum supported: ${MAX_SUPPORTED_SCHEMA_VERSION}.`
    );
  }

  const result = ClientConfigSchema.safeParse(rawConfig);
  if (!result.success) {
    const messages = formatValidationErrors(result.error);
    throw new Error(`Client config validation failed for "${clientId}":\n${messages.join('\n')}`);
  }

  activeConfig = result.data;
  invalidateCaches();
  return activeConfig;
}

/**
 * Get the previously loaded client config.
 * @throws Error if called before loadClientConfig()
 */
export function getActiveConfig(): ValidatedClientConfig {
  if (!activeConfig) {
    throw new Error('Client config not loaded. Call loadClientConfig() first.');
  }
  return activeConfig;
}

/**
 * Get all offices from the active config as a flat array with regionName attached.
 * Memoized — result is cached until config changes.
 */
export function getClientOffices(): OfficeWithRegion[] {
  if (cachedOffices) return cachedOffices;

  const config = getActiveConfig();
  cachedOffices = config.offices.map((office) => ({
    ...office,
    regionName: office.region,
  }));
  return cachedOffices;
}

/**
 * Reconstruct region objects from the active config by grouping
 * offices and personnel by region name.
 * Memoized — result is cached until config changes.
 */
export function getClientRegions(): Region[] {
  if (cachedRegions) return cachedRegions;

  const config = getActiveConfig();

  const regionMap = new Map<string, { offices: Office[]; personnel: Personnel[] }>();

  for (const office of config.offices) {
    if (!regionMap.has(office.region)) {
      regionMap.set(office.region, { offices: [], personnel: [] });
    }
    regionMap.get(office.region)!.offices.push(office);
  }

  if (config.regionalPersonnel) {
    for (const [regionName, personnel] of Object.entries(config.regionalPersonnel)) {
      if (!regionMap.has(regionName)) {
        regionMap.set(regionName, { offices: [], personnel: [] });
      }
      regionMap.get(regionName)!.personnel = personnel;
    }
  }

  cachedRegions = Array.from(regionMap.entries()).map(([name, data]) => ({
    name,
    offices: data.offices,
    personnel: data.personnel,
  }));
  return cachedRegions;
}

/**
 * Get a single region by name.
 * Uses a memoized Map for O(1) lookup instead of linear scan.
 */
export function getClientRegion(regionName: string): Region | undefined {
  if (!cachedRegionMap) {
    cachedRegionMap = new Map(getClientRegions().map((r) => [r.name, r]));
  }
  return cachedRegionMap.get(regionName);
}

/**
 * Get offices filtered by region name.
 * Replaces getOfficesByRegion() from locations.js.
 */
export function getOfficesByRegion(regionName: string): Office[] {
  const config = getActiveConfig();
  return config.offices.filter((o) => o.region === regionName);
}

/**
 * Get map provider configuration from the active client config.
 * Returns defaults (MapLibre, zoom 15) when mapProvider is not configured.
 */
export function getMapProviderConfig(): {
  provider: 'maplibre' | 'apple';
  tileStyleUrl?: string;
  appleMapToken?: string;
  defaultZoom: number;
} {
  const config = getActiveConfig();
  const mp = config.theme?.mapProvider;
  return {
    provider: mp?.provider ?? 'maplibre',
    tileStyleUrl: mp?.tileStyleUrl,
    appleMapToken: mp?.appleMapToken,
    defaultZoom: mp?.defaultZoom ?? 15,
  };
}

/**
 * Cross-validate that each office's region field matches a known region
 * from the map config. Emits console warnings for mismatches.
 */
export function validateRegionReferences(mapConfigRegionNames: string[]): void {
  const config = getActiveConfig();
  const validRegions = new Set(mapConfigRegionNames);

  for (const office of config.offices) {
    if (!validRegions.has(office.region)) {
      console.warn(`Office "${office.officeCode}" references unknown region "${office.region}".`);
    }
  }
}

/**
 * FOR TESTING: Reset the cached config
 */
export function __resetConfig(): void {
  activeConfig = null;
  invalidateCaches();
}
