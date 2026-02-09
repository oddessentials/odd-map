/**
 * Unit Tests - SVG Projection Module
 *
 * Tests runtime lat/lon → SVG coordinate projection using d3-geo geoAlbersUsa.
 * Golden references from research.md with scale=1276, translate=[479,299].
 */

import { describe, it, expect } from 'vitest';
import { projectToSvg, projectAllToSvg, ProjectionError } from '../src/lib/svg-projection';

const DEFAULT_PARAMS = {
  type: 'geoAlbersUsa' as const,
  scale: 1276,
  translate: [479, 299] as [number, number],
};

// Tolerance: spec threshold is 0.5px (actual drift is <0.01px)
const TOLERANCE = 0.5;

describe('projectToSvg', () => {
  describe('golden reference projections (USG offices)', () => {
    // Golden references from usg-map-config.json — actual lat/lon and svgX/svgY values
    // Verified: geoAlbersUsa().scale(1276).translate([479,299]) reproduces all 13 within 0.006px
    const goldenRefs = [
      { name: 'USG PA1', lat: 40.2628, lon: -80.1631, expected: { x: 754.84, y: 241.73 } },
      { name: 'USG PA2', lat: 39.9512, lon: -75.1645, expected: { x: 838.98, y: 232.42 } },
      { name: 'USG MA1', lat: 42.3554, lon: -71.064, expected: { x: 892.35, y: 163.75 } },
      { name: 'USG FL1', lat: 28.0787, lon: -82.5169, expected: { x: 754.27, y: 518.08 } },
      { name: 'USG GA1', lat: 34.0754, lon: -84.2941, expected: { x: 703.08, y: 389.79 } },
      { name: 'USG LA1', lat: 30.4754, lon: -90.0829, expected: { x: 602.59, y: 480.03 } },
      { name: 'USG TX1', lat: 32.7357, lon: -97.1081, expected: { x: 468.69, y: 432.89 } },
      { name: 'USG TX2', lat: 29.8649, lon: -95.4962, expected: { x: 499.05, y: 497.15 } },
      { name: 'USG CA1', lat: 33.6407, lon: -117.7448, expected: { x: 92.51, y: 367.13 } },
      { name: 'USG US1', lat: 48.2766, lon: -116.5535, expected: { x: 184.2, y: 51.96 } },
      { name: 'USG MN1', lat: 45.0567, lon: -93.1414, expected: { x: 534.24, y: 155.84 } },
      { name: 'USG MI1', lat: 42.5803, lon: -83.1431, expected: { x: 698.21, y: 197.74 } },
      { name: 'USG IL1', lat: 41.8807, lon: -87.6298, expected: { x: 626.93, y: 221.51 } },
    ];

    for (const ref of goldenRefs) {
      it(`projects ${ref.name} (${ref.lat}, ${ref.lon}) within ${TOLERANCE}px`, async () => {
        const result = await projectToSvg(ref.lat, ref.lon, DEFAULT_PARAMS);

        expect(result.x).toBeCloseTo(ref.expected.x, 0);
        expect(result.y).toBeCloseTo(ref.expected.y, 0);

        // Strict tolerance check
        expect(Math.abs(result.x - ref.expected.x)).toBeLessThan(TOLERANCE);
        expect(Math.abs(result.y - ref.expected.y)).toBeLessThan(TOLERANCE);
      });
    }
  });

  it('throws ProjectionError for coordinates outside US (Guam)', async () => {
    await expect(projectToSvg(13.4443, 144.7937, DEFAULT_PARAMS)).rejects.toThrow(ProjectionError);
  });

  it('projects Alaska inset coordinates', async () => {
    const result = await projectToSvg(61.2181, -149.9003, DEFAULT_PARAMS);

    expect(result.x).toBeGreaterThan(0);
    expect(result.y).toBeGreaterThan(0);
    expect(typeof result.x).toBe('number');
    expect(typeof result.y).toBe('number');
  });

  it('projects Hawaii inset coordinates', async () => {
    const result = await projectToSvg(21.3069, -157.8583, DEFAULT_PARAMS);

    expect(result.x).toBeGreaterThan(0);
    expect(result.y).toBeGreaterThan(0);
    expect(typeof result.x).toBe('number');
    expect(typeof result.y).toBe('number');
  });

  it('returns consistent results for same input (purity)', async () => {
    const first = await projectToSvg(40.2628, -80.1631, DEFAULT_PARAMS);
    const second = await projectToSvg(40.2628, -80.1631, DEFAULT_PARAMS);

    expect(first.x).toBe(second.x);
    expect(first.y).toBe(second.y);
  });
});

describe('ProjectionError', () => {
  it('has correct name property', () => {
    const error = new ProjectionError(13.4443, 144.7937);
    expect(error.name).toBe('ProjectionError');
  });

  it('includes coordinates in message', () => {
    const error = new ProjectionError(13.4443, 144.7937);
    expect(error.message).toContain('13.4443');
    expect(error.message).toContain('144.7937');
  });

  it('mentions svgOverride as workaround', () => {
    const error = new ProjectionError(13.4443, 144.7937);
    expect(error.message).toContain('svgOverride');
  });

  it('is an instance of Error', () => {
    const error = new ProjectionError(0, 0);
    expect(error).toBeInstanceOf(Error);
  });
});

describe('projectAllToSvg', () => {
  it('batch-projects coordinates with svgOverride bypass', async () => {
    const coordinates = [
      { officeCode: 'USG PA1', lat: 40.2628, lon: -80.1631 },
      { officeCode: 'USG OVERRIDE', lat: 0, lon: 0, svgOverride: { x: 100, y: 200 } },
    ];

    const result = await projectAllToSvg(coordinates, DEFAULT_PARAMS);

    expect(result.size).toBe(2);

    // Projected coordinate
    const pa1 = result.get('USG PA1')!;
    expect(pa1).toBeDefined();
    expect(Math.abs(pa1.x - 754.84)).toBeLessThan(TOLERANCE);
    expect(Math.abs(pa1.y - 241.73)).toBeLessThan(TOLERANCE);

    // Override coordinate — used verbatim
    const override = result.get('USG OVERRIDE')!;
    expect(override).toBeDefined();
    expect(override.x).toBe(100);
    expect(override.y).toBe(200);
  });

  it('returns empty map for empty input', async () => {
    const result = await projectAllToSvg([], DEFAULT_PARAMS);
    expect(result.size).toBe(0);
  });

  it('handles mixed batch with multiple overrides and projected offices', async () => {
    const coordinates = [
      { officeCode: 'MIX PA1', lat: 40.2628, lon: -80.1631, svgOverride: { x: 760, y: 245 } },
      { officeCode: 'MIX NY1', lat: 40.7128, lon: -74.006, svgOverride: { x: 850, y: 215 } },
      { officeCode: 'MIX FL1', lat: 28.0787, lon: -82.5169 },
      { officeCode: 'MIX IL1', lat: 41.8781, lon: -87.6298 },
    ];

    const result = await projectAllToSvg(coordinates, DEFAULT_PARAMS);

    expect(result.size).toBe(4);

    // Override offices use exact coordinates
    expect(result.get('MIX PA1')).toEqual({ x: 760, y: 245 });
    expect(result.get('MIX NY1')).toEqual({ x: 850, y: 215 });

    // Projected offices are computed from lat/lon
    const fl1 = result.get('MIX FL1')!;
    expect(Math.abs(fl1.x - 754.27)).toBeLessThan(TOLERANCE);
    expect(Math.abs(fl1.y - 518.08)).toBeLessThan(TOLERANCE);

    const il1 = result.get('MIX IL1')!;
    expect(Math.abs(il1.x - 626.93)).toBeLessThan(TOLERANCE);
    expect(Math.abs(il1.y - 221.51)).toBeLessThan(TOLERANCE);
  });

  it('override coordinates are used exactly (not re-projected)', async () => {
    const override = { x: 123.456, y: 789.012 };
    const coordinates = [{ officeCode: 'EXACT', lat: 0, lon: 0, svgOverride: override }];

    const result = await projectAllToSvg(coordinates, DEFAULT_PARAMS);
    const pos = result.get('EXACT')!;
    expect(pos.x).toBe(123.456);
    expect(pos.y).toBe(789.012);
  });
});
