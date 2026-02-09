/**
 * Coordinate Projection Functions
 *
 * Production-grade coordinate mapping with client isolation.
 * Supports multiple clients without state leakage.
 */

import { MapConfigSchema, type MapConfig } from './map-config.schema.js';
import { normalizeOfficeCode, normalizeClientId } from './normalization.js';
import { getConfigForClient } from './client-registry.js';

// Client-keyed state to prevent cross-tenant leakage
interface ClientState {
  config: MapConfig;
  coordMap: Map<string, { x: number; y: number }>;
}

const clientStates = new Map<string, ClientState>();
let currentClientId: string | null = null;

// Cache in-flight initialization promises per client to prevent race conditions
const initializationPromises = new Map<string, Promise<void>>();

/**
 * Initialize projection system for a specific client.
 * MUST be called before using getMarkerPosition().
 * Safe to call multiple times - will reinitialize if client changes.
 * Concurrent calls for the same client share the same initialization promise.
 *
 * @param clientId - Client ID (required) - must exist in registry
 */
export async function initProjection(clientId: string): Promise<void> {
  const normalizedClientId = normalizeClientId(clientId);

  // Check if already initialized
  if (clientStates.has(normalizedClientId)) {
    currentClientId = normalizedClientId;
    console.log(`✅ Projection already initialized for client: ${normalizedClientId}`);
    return;
  }

  // Check if currently initializing - return existing promise to prevent race
  const existingPromise = initializationPromises.get(normalizedClientId);
  if (existingPromise) {
    console.log(`⏳ Waiting for in-flight initialization: ${normalizedClientId}`);
    return existingPromise;
  }

  // Create new initialization promise
  const initPromise = (async () => {
    try {
      // Dynamic config loading via registry
      const config = await getConfigForClient(normalizedClientId);
      const validatedConfig = MapConfigSchema.parse(config);

      // Verify clientId matches between request and config
      if (normalizeClientId(validatedConfig.clientId) !== normalizedClientId) {
        throw new Error(
          `Config clientId mismatch: requested "${normalizedClientId}", ` +
            `config declares "${validatedConfig.clientId}"`
        );
      }

      // Optional runtime integrity check (ENV-guarded)
      if (import.meta.env.VITE_VERIFY_RUNTIME_INTEGRITY === 'true') {
        console.log('🔍 Verifying runtime integrity...');
        const { verifyRuntimeIntegrity } = await import('./runtime-integrity.js');
        const integrity = await verifyRuntimeIntegrity(validatedConfig);

        if (!integrity.valid) {
          const errorMsg = `🚨 RUNTIME INTEGRITY FAILURE\n${integrity.errors.join('\n')}`;
          console.error(errorMsg);

          // In production, fail hard
          if (import.meta.env.PROD) {
            throw new Error(errorMsg);
          }
        } else {
          console.log('✅ Runtime integrity verified');
        }
      }

      // Build lookup map for O(1) access by normalized office code
      let coordMap: Map<string, { x: number; y: number }>;
      if (validatedConfig.configVersion === 1) {
        coordMap = new Map(
          validatedConfig.coordinates.map((c) => [c.officeCode, { x: c.svgX, y: c.svgY }])
        );
      } else {
        // V2 config: project lat/lon → SVG via d3-geo (lazy-loaded inside svg-projection)
        const { projectAllToSvg } = await import('./svg-projection.js');
        coordMap = await projectAllToSvg(validatedConfig.coordinates, validatedConfig.projection);
      }

      // Store client-specific state
      clientStates.set(normalizedClientId, {
        config: validatedConfig,
        coordMap,
      });

      currentClientId = normalizedClientId;

      console.log(
        `✅ Projection initialized for client: ${normalizedClientId} (${coordMap.size} offices)`
      );
    } catch (err) {
      console.error(`Failed to initialize projection for client "${normalizedClientId}":`, err);
      throw err;
    }
  })();

  // Cache the promise
  initializationPromises.set(normalizedClientId, initPromise);

  try {
    await initPromise;
  } finally {
    // Clean up promise cache after completion
    initializationPromises.delete(normalizedClientId);
  }
}

/**
 * Switch to a different client's projection state.
 * Throws if client not initialized.
 */
export function switchClient(clientId: string): void {
  const normalizedClientId = normalizeClientId(clientId);

  if (!clientStates.has(normalizedClientId)) {
    throw new Error(`Client "${clientId}" not initialized. Call initProjection() first.`);
  }

  currentClientId = normalizedClientId;

  console.log(`✅ Switched to client: ${normalizedClientId}`);
}

/**
 * Get current client ID.
 */
export function getCurrentClientId(): string | null {
  return currentClientId;
}

function ensureInitialized() {
  if (!currentClientId || !clientStates.has(currentClientId)) {
    throw new Error('Projection not initialized. Call initProjection() first.');
  }
}

/**
 * PRIMARY API: Get marker position by office code.
 * FAILS LOUDLY if office has no coordinate mapping.
 *
 * @param officeCode - Office identifier (will be normalized: trim + uppercase)
 * @returns {x, y} coordinates in SVG viewBox units
 * @throws Error if coordinate mapping is missing
 */
export function getMarkerPosition(officeCode: string): { x: number; y: number } {
  ensureInitialized();

  const state = clientStates.get(currentClientId!)!;
  const normalized = normalizeOfficeCode(officeCode);
  const position = state.coordMap.get(normalized);

  if (!position) {
    throw new Error(
      `🚨 MISSING COORDINATE: Office "${officeCode}" (normalized: "${normalized}") has no coordinate mapping. ` +
        `Add to config/usg-map-config.json via coordinate-capture tool. ` +
        `(Client: ${currentClientId})`
    );
  }

  return position;
}

/**
 * FOR TESTING: Clear all client states
 */
export function __clearAllClients() {
  clientStates.clear();
  currentClientId = null;
}
