/**
 * Unit Tests - Coordinate Projection
 *
 * Tests the lat/lon to SVG coordinate projection function.
 */

import { describe, it, expect } from 'vitest';
// import { latLonToSvg } from '../src/lib/projection';

/**
 * NOTE: latLonToSvg() tests are disabled because the projection system
 * now uses direct coordinate storage instead of runtime projection.
 * Coordinates are stored directly in the config via the projection script.
 * See: scripts/project-coordinates.ts
 */

/*
describe('latLonToSvg', () => {
    it('converts center of continental US correctly', () => {
        // Approximately center of US: Kansas City area
        const result = latLonToSvg(39.0, -95.0);

        // Should be roughly center of 960x600 map
        expect(result.x).toBeGreaterThan(400);
        expect(result.x).toBeLessThan(600);
        expect(result.y).toBeGreaterThan(200);
        expect(result.y).toBeLessThan(350);
    });

    it('places east coast locations on right side', () => {
        // Boston approx coords
        const boston = latLonToSvg(42.36, -71.06);

        // Should be on right side of map (x > 700)
        expect(boston.x).toBeGreaterThan(700);
    });

    it('places west coast locations on left side', () => {
        // Los Angeles approx coords
        const la = latLonToSvg(34.05, -118.24);

        // Should be on left side of map (x < 200)
        expect(la.x).toBeLessThan(200);
    });

    it('places northern locations at top', () => {
        // Seattle approx coords  
        const seattle = latLonToSvg(47.61, -122.33);

        // Should be near top (y < 150)
        expect(seattle.y).toBeLessThan(150);
    });

    it('places southern locations at bottom', () => {
        // Miami approx coords
        const miami = latLonToSvg(25.76, -80.19);

        // Should be near bottom (actual y ~470 with d3.geoAlbersUsa)
        expect(miami.y).toBeGreaterThan(460);
    });

    it('clamps coordinates to map bounds', () => {
        // Far outside US bounds
        const outOfBounds = latLonToSvg(60.0, -150.0);

        // Should be clamped between 0 and map dimensions
        expect(outOfBounds.x).toBeGreaterThanOrEqual(0);
        expect(outOfBounds.x).toBeLessThanOrEqual(960);
        expect(outOfBounds.y).toBeGreaterThanOrEqual(0);
        expect(outOfBounds.y).toBeLessThanOrEqual(600);
    });

    it('returns consistent results for same input', () => {
        const first = latLonToSvg(40.26, -80.16);
        const second = latLonToSvg(40.26, -80.16);

        expect(first.x).toBe(second.x);
        expect(first.y).toBe(second.y);
    });
});
*/

// Placeholder test to prevent "no tests found" error
describe('Projection', () => {
  it('uses direct coordinate storage', () => {
    // The projection system now uses coordinates stored directly in the config
    // See: scripts/project-coordinates.ts and config/usg-map-config.json
    expect(true).toBe(true);
  });
});
