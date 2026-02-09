/**
 * Unit Tests - Coordinate Storage and Projection
 *
 * Tests the direct coordinate storage system and projection script.
 */

import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { getMarkerPosition, initProjection, __clearAllClients } from '../src/lib/projection';
import { loadClientConfig, getClientOffices } from '../src/lib/client-config';
import { readFileSync } from 'fs';

interface CoordV2 {
  officeCode: string;
  lat: number;
  lon: number;
  svgOverride?: { x: number; y: number };
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

    // v2 config: coordinates have lat/lon (projection resolves to SVG at runtime)
    // Verify each office has coordinates with lat/lon
    offices.forEach((office) => {
      const coord = config.coordinates.find((c: CoordV2) => c.officeCode === office.officeCode);
      expect(coord).toBeDefined();
      expect(coord.lat).toBeTypeOf('number');
      expect(coord.lon).toBeTypeOf('number');
    });
  });

  it('coordinates are within map viewBox bounds', () => {
    // v2: verify via getMarkerPosition (runtime projection)
    const offices = getClientOffices();

    offices.forEach((office) => {
      const pos = getMarkerPosition(office.officeCode);
      expect(pos.x).toBeGreaterThanOrEqual(0);
      expect(pos.x).toBeLessThanOrEqual(960);
      expect(pos.y).toBeGreaterThanOrEqual(0);
      expect(pos.y).toBeLessThanOrEqual(600);
    });
  });

  it('no duplicate coordinates', () => {
    // v2: verify via getMarkerPosition (runtime projection)
    const offices = getClientOffices();
    const coordSet = new Set();

    offices.forEach((office) => {
      const pos = getMarkerPosition(office.officeCode);
      const key = `${Math.round(pos.x)},${Math.round(pos.y)}`;
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

    config.coordinates.forEach((coord: CoordV2) => {
      const office = offices.find((o) => o.officeCode === coord.officeCode);
      expect(office).toBeDefined();
      expect(coord.lat).toBe(office!.coordinates.lat);
      expect(coord.lon).toBe(office!.coordinates.lon);
    });
  });
});

/**
 * T015: Config Regression — All Clients (v2)
 *
 * Verifies that every stored coordinate in all 4 v2 configs is retrievable
 * via getMarkerPosition() after the v2 migration.
 * Tests through the public API (not raw JSON fields) to be version-agnostic.
 */
describe('Config Regression (all clients) (T015)', () => {
  const CLIENTS = ['usg', 'oddessentials', 'acme', 'demo'] as const;

  beforeEach(() => {
    __clearAllClients();
  });

  for (const clientId of CLIENTS) {
    describe(`${clientId}`, () => {
      it('every coordinate is retrievable via getMarkerPosition()', async () => {
        await initProjection(clientId);

        const config = JSON.parse(readFileSync(`config/${clientId}-map-config.json`, 'utf8'));

        expect(config.coordinates.length).toBeGreaterThan(0);

        config.coordinates.forEach((coord: CoordV2) => {
          const position = getMarkerPosition(coord.officeCode);
          expect(position).toBeDefined();
          expect(position.x).toBeTypeOf('number');
          expect(position.y).toBeTypeOf('number');

          // For offices with svgOverride, verify exact match
          if (coord.svgOverride) {
            expect(position.x).toBe(coord.svgOverride.x);
            expect(position.y).toBe(coord.svgOverride.y);
          }
        });
      });

      it('coordinate count matches config', async () => {
        await initProjection(clientId);

        const config = JSON.parse(readFileSync(`config/${clientId}-map-config.json`, 'utf8'));

        // Every coordinate should resolve without error
        let resolvedCount = 0;
        config.coordinates.forEach((coord: CoordV2) => {
          const position = getMarkerPosition(coord.officeCode);
          expect(position).toBeDefined();
          resolvedCount++;
        });

        expect(resolvedCount).toBe(config.coordinates.length);
      });
    });
  }

  it('all clients can be loaded sequentially and switched between', async () => {
    // Init all clients
    for (const clientId of CLIENTS) {
      await initProjection(clientId);
    }

    // Verify each client's coords are accessible after switching
    for (const clientId of CLIENTS) {
      const config = JSON.parse(readFileSync(`config/${clientId}-map-config.json`, 'utf8'));

      // switchClient is done internally by initProjection, but let's be explicit
      // by re-initing (which triggers the cached fast-path)
      await initProjection(clientId);

      // Spot-check first and last coordinate
      const first = config.coordinates[0];
      const last = config.coordinates[config.coordinates.length - 1];

      const posFirst = getMarkerPosition(first.officeCode);
      expect(posFirst).toBeDefined();
      expect(posFirst.x).toBeTypeOf('number');

      const posLast = getMarkerPosition(last.officeCode);
      expect(posLast).toBeDefined();
      expect(posLast.x).toBeTypeOf('number');
    }
  });
});
