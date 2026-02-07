/**
 * Map Provider Factory
 *
 * Creates the appropriate map provider based on client configuration.
 * Defaults to MapLibre when no config is provided.
 * Falls back to MapLibre when Apple is requested but token is missing.
 */

import type { MapProvider, TileMapProvider, MapProviderConfig } from './types.js';
import { MapLibreProvider } from './maplibre-provider.js';
import { AppleProvider } from './apple-provider.js';

/** Default config when no mapProvider section exists in client config */
const DEFAULT_CONFIG: MapProviderConfig = {
  provider: 'maplibre',
  defaultZoom: 15,
};

/**
 * Create a map provider instance based on configuration.
 *
 * - Returns MapLibre provider by default (no config, or provider === 'maplibre')
 * - Returns Apple provider when provider === 'apple' and appleMapToken is present
 * - Falls back to MapLibre with console warning when Apple token is missing
 */
export function createMapProvider(config?: MapProviderConfig): MapProvider {
  const resolved = config ?? DEFAULT_CONFIG;

  if (resolved.provider === 'apple') {
    if (!resolved.appleMapToken) {
      console.warn(
        '[map-provider] Apple Maps provider requested but no appleMapToken provided. Falling back to MapLibre.'
      );
      return new MapLibreProvider(resolved.tileStyleUrl);
    }

    return new AppleProvider(resolved.appleMapToken);
  }

  return new MapLibreProvider(resolved.tileStyleUrl);
}

/**
 * Create a tile map provider (with clustering/multi-marker support).
 * Both MapLibre and Apple providers implement TileMapProvider.
 */
export function createTileMapProvider(config?: MapProviderConfig): TileMapProvider {
  return createMapProvider(config) as TileMapProvider;
}
