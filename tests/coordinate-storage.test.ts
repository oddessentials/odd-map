/**
 * Unit Tests - Coordinate Storage and Projection
 *
 * Tests the direct coordinate storage system and projection script.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { getMarkerPosition, initProjection } from '../src/lib/projection';
import { loadClientConfig, getClientOffices } from '../src/lib/client-config';
import { readFileSync } from 'fs';

interface Coord {
  officeCode: string;
  svgX: number;
  svgY: number;
  lat: number;
  lon: number;
}

describe('Direct Coordinate Storage', () => {
  beforeAll(async () => {
    // Load client config and initialize projection
    await loadClientConfig('usg');
    await initProjection('usg');
  });
  it('all offices have stored SVG coordinates in config', () => {
    const config = JSON.parse(readFileSync('config/usg-map-config.json', 'utf8'));
    const offices = getClientOffices();

    expect(config.coordinates).toBeDefined();
    expect(config.coordinates.length).toBe(offices.length);

    // Verify each office has coordinates
    offices.forEach((office) => {
      const coord = config.coordinates.find((c: Coord) => c.officeCode === office.officeCode);
      expect(coord).toBeDefined();
      expect(coord.svgX).toBeGreaterThanOrEqual(0);
      expect(coord.svgY).toBeGreaterThanOrEqual(0);
      expect(coord.svgX).toBeLessThanOrEqual(960);
      expect(coord.svgY).toBeLessThanOrEqual(600);
    });
  });

  it('coordinates are within map viewBox bounds', () => {
    const config = JSON.parse(readFileSync('config/usg-map-config.json', 'utf8'));

    config.coordinates.forEach((coord: Coord) => {
      expect(coord.svgX).toBeGreaterThanOrEqual(config.viewBox.x);
      expect(coord.svgX).toBeLessThanOrEqual(config.viewBox.width);
      expect(coord.svgY).toBeGreaterThanOrEqual(config.viewBox.y);
      expect(coord.svgY).toBeLessThanOrEqual(config.viewBox.height);
    });
  });

  it('no duplicate coordinates', () => {
    const config = JSON.parse(readFileSync('config/usg-map-config.json', 'utf8'));
    const coordSet = new Set();

    config.coordinates.forEach((coord: Coord) => {
      const key = `${Math.round(coord.svgX)},${Math.round(coord.svgY)}`;
      expect(coordSet.has(key)).toBe(false);
      coordSet.add(key);
    });
  });

  it('getMarkerPosition returns coordinates for known offices', () => {
    const offices = getClientOffices();

    offices.forEach((office) => {
      const position = getMarkerPosition(office.officeCode);
      expect(position).toBeDefined();
      expect(position.x).toBeGreaterThanOrEqual(0);
      expect(position.y).toBeGreaterThanOrEqual(0);
    });
  });

  it('east coast offices are on right side of map', () => {
    // PA, MA, FL offices should have x > 600
    const eastCoastCodes = ['USG PA1', 'USG PA2', 'USG MA1', 'USG FL1', 'USG GA1'];

    eastCoastCodes.forEach((code) => {
      const pos = getMarkerPosition(code);
      expect(pos.x).toBeGreaterThan(600);
    });
  });

  it('west coast offices are on left side of map', () => {
    // CA, ID offices should have x < 300
    const westCoastCodes = ['USG CA1', 'USG US1'];

    westCoastCodes.forEach((code) => {
      const pos = getMarkerPosition(code);
      expect(pos.x).toBeLessThan(300);
    });
  });

  it('northern offices are near top of map', () => {
    // MN, ID offices should have y < 200
    const northernCodes = ['USG MN1', 'USG US1'];

    northernCodes.forEach((code) => {
      const pos = getMarkerPosition(code);
      expect(pos.y).toBeLessThan(200);
    });
  });

  it('southern offices are near bottom of map', () => {
    // FL, LA, TX offices should have y > 400
    const southernCodes = ['USG FL1', 'USG LA1', 'USG TX2'];

    southernCodes.forEach((code) => {
      const pos = getMarkerPosition(code);
      expect(pos.y).toBeGreaterThan(400);
    });
  });

  it('coordinates match lat/lon source data', () => {
    const config = JSON.parse(readFileSync('config/usg-map-config.json', 'utf8'));
    const offices = getClientOffices();

    config.coordinates.forEach((coord: Coord) => {
      const office = offices.find((o) => o.officeCode === coord.officeCode);
      expect(office).toBeDefined();
      expect(coord.lat).toBe(office!.coordinates.lat);
      expect(coord.lon).toBe(office!.coordinates.lon);
    });
  });
});
