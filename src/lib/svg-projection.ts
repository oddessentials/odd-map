import type { ProjectionParams } from './map-config.schema.js';

/**
 * Error thrown when geographic coordinates cannot be projected to SVG space.
 * Typically occurs for coordinates outside the continental US, Alaska, and Hawaii.
 */
export class ProjectionError extends Error {
  constructor(lat: number, lon: number) {
    super(
      `Cannot project coordinates [${lat}, ${lon}] to SVG position. ` +
        `The geoAlbersUsa projection returned null — these coordinates are outside ` +
        `the continental US, Alaska, and Hawaii insets. ` +
        `If this office needs a specific position, use svgOverride in the config.`
    );
    this.name = 'ProjectionError';
  }
}

// Cache the d3-geo module import (NOT the configured projection instance)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let geoAlbersUsaFactory: (() => any) | null = null;

/**
 * Project a single lat/lon coordinate to SVG pixel position.
 * Lazy-loads d3-geo on first call to avoid penalizing 3D/tile map modes.
 *
 * @param lat - Latitude in decimal degrees (e.g., 40.2628)
 * @param lon - Longitude in decimal degrees (e.g., -80.1631)
 * @param params - Projection parameters (type, scale, translate)
 * @returns {x, y} in SVG viewBox coordinate space
 * @throws ProjectionError if geoAlbersUsa returns null (EC-01)
 */
export async function projectToSvg(
  lat: number,
  lon: number,
  params: ProjectionParams
): Promise<{ x: number; y: number }> {
  if (!geoAlbersUsaFactory) {
    const d3Geo = await import('d3-geo');
    geoAlbersUsaFactory = d3Geo.geoAlbersUsa;
  }

  const projection = geoAlbersUsaFactory().scale(params.scale).translate(params.translate);

  // d3-geo takes [longitude, latitude] — note the order
  const result = projection([lon, lat]);

  if (!result) {
    throw new ProjectionError(lat, lon);
  }

  return { x: result[0], y: result[1] };
}

/**
 * Batch-project all coordinates, applying svgOverride where present.
 * Used by initProjection() for v2 configs.
 */
export async function projectAllToSvg(
  coordinates: Array<{
    officeCode: string;
    lat: number;
    lon: number;
    svgOverride?: { x: number; y: number };
  }>,
  params: ProjectionParams
): Promise<Map<string, { x: number; y: number }>> {
  const result = new Map<string, { x: number; y: number }>();

  for (const coord of coordinates) {
    if (coord.svgOverride) {
      // Use override directly — bypasses projection
      result.set(coord.officeCode, coord.svgOverride);
    } else {
      // Project from lat/lon
      const position = await projectToSvg(coord.lat, coord.lon, params);
      result.set(coord.officeCode, position);
    }
  }

  return result;
}
