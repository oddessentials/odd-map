/**
 * Unit Tests - Coordinate Projection (T012)
 *
 * Tests initProjection() and getMarkerPosition() for both v1 and v2 configs.
 * V2 exercises the runtime lat/lon → SVG pipeline via projectAllToSvg().
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { initProjection, getMarkerPosition, __clearAllClients } from '../src/lib/projection';
import { MapConfigV2Schema, SvgOverrideSchema } from '../src/lib/map-config.schema';

// ─── Fixtures ─────────────────────────────────────────────────────

const VALID_HASH = '0a59d058bfe5150fb4b135bf00c1daa5c4196a8a98ec01afe77d286eb0d5f16a';

const V2_CONFIG = {
  configVersion: 2,
  mapId: 'usa-regions',
  clientId: 'v2test',
  mapAssetHash: VALID_HASH,
  viewBox: { x: 0, y: 0, width: 960, height: 600 },
  projection: { type: 'geoAlbersUsa', scale: 1276, translate: [479, 299] },
  coordinates: [
    { officeCode: 'V2 PA1', lat: 40.2628, lon: -80.1631 },
    { officeCode: 'V2 MA1', lat: 42.3554, lon: -71.064 },
    { officeCode: 'V2 FL1', lat: 28.0787, lon: -82.5169 },
  ],
};

const V2_CONFIG_WITH_OVERRIDE = {
  ...V2_CONFIG,
  clientId: 'v2override',
  coordinates: [
    { officeCode: 'V2O NY1', lat: 40.7128, lon: -74.006, svgOverride: { x: 862.15, y: 218.42 } },
    { officeCode: 'V2O PA1', lat: 40.2628, lon: -80.1631 },
  ],
};

const V2_CONFIG_EMPTY = {
  ...V2_CONFIG,
  clientId: 'v2empty',
  coordinates: [],
};

// Load fixture from tests/fixtures/v2-mixed-override.json
const V2_MIXED_FIXTURE = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'fixtures', 'v2-mixed-override.json'), 'utf-8')
);

// Golden references: expected outputs from d3-geo geoAlbersUsa with scale=1276, translate=[479,299]
const GOLDEN_REFS: Record<string, { x: number; y: number }> = {
  'V2 PA1': { x: 754.84, y: 241.73 },
  'V2 MA1': { x: 892.35, y: 163.75 },
  'V2 FL1': { x: 754.27, y: 518.08 },
};

const TOLERANCE = 0.5; // FR-006: within 0.5px of expected

// ─── Mock client-registry to return v2 configs ────────────────────

vi.mock('../src/lib/client-registry.js', async (importOriginal) => {
  const original = await importOriginal<typeof import('../src/lib/client-registry.js')>();
  return {
    ...original,
    getConfigForClient: vi.fn(async (clientId: string) => {
      if (clientId === 'v2test') return V2_CONFIG;
      if (clientId === 'v2override') return V2_CONFIG_WITH_OVERRIDE;
      if (clientId === 'v2empty') return V2_CONFIG_EMPTY;
      if (clientId === 'v2mixed') return V2_MIXED_FIXTURE;
      // Fall through to original for real clients (v1 regression tests)
      return original.getConfigForClient(clientId);
    }),
  };
});

// ─── Tests ────────────────────────────────────────────────────────

describe('USG projection (post-migration regression)', () => {
  beforeEach(() => {
    __clearAllClients();
  });

  it('usg v2 config produces same coordinates as original v1 golden refs', async () => {
    await initProjection('usg');

    // These golden references match the original v1 svgX/svgY values
    // V2 runtime projection with scale=1276, translate=[479,299] reproduces them within 0.5px
    const pa1 = getMarkerPosition('USG PA1');
    expect(Math.abs(pa1.x - 754.84)).toBeLessThan(0.5);
    expect(Math.abs(pa1.y - 241.73)).toBeLessThan(0.5);

    const ma1 = getMarkerPosition('USG MA1');
    expect(Math.abs(ma1.x - 892.35)).toBeLessThan(0.5);
    expect(Math.abs(ma1.y - 163.75)).toBeLessThan(0.5);
  });
});

describe('V2 initProjection', () => {
  beforeEach(() => {
    __clearAllClients();
  });

  it('initializes v2 config and builds coordMap via projection', async () => {
    await initProjection('v2test');

    // Should not throw — config was loaded and projected
    const pa1 = getMarkerPosition('V2 PA1');
    expect(pa1).toBeDefined();
    expect(typeof pa1.x).toBe('number');
    expect(typeof pa1.y).toBe('number');
  });

  it('getMarkerPosition returns projected coords for v2 config', async () => {
    await initProjection('v2test');

    for (const [officeCode, expected] of Object.entries(GOLDEN_REFS)) {
      const actual = getMarkerPosition(officeCode);
      expect(actual).toBeDefined();
      expect(actual.x).toBeCloseTo(expected.x, 0);
      expect(actual.y).toBeCloseTo(expected.y, 0);
    }
  });

  it('v2 coordMap entries within 0.5px of expected (FR-006)', async () => {
    await initProjection('v2test');

    for (const [officeCode, expected] of Object.entries(GOLDEN_REFS)) {
      const actual = getMarkerPosition(officeCode);
      expect(Math.abs(actual.x - expected.x)).toBeLessThan(TOLERANCE);
      expect(Math.abs(actual.y - expected.y)).toBeLessThan(TOLERANCE);
    }
  });

  it('v2 with svgOverride uses override coordinates verbatim', async () => {
    await initProjection('v2override');

    const overridden = getMarkerPosition('V2O NY1');
    expect(overridden.x).toBe(862.15);
    expect(overridden.y).toBe(218.42);

    // Non-overridden coord should be projected
    const projected = getMarkerPosition('V2O PA1');
    expect(Math.abs(projected.x - 754.84)).toBeLessThan(TOLERANCE);
    expect(Math.abs(projected.y - 241.73)).toBeLessThan(TOLERANCE);
  });

  it('zero-office v2 config handled gracefully (EC-04)', async () => {
    await initProjection('v2empty');

    // Should not throw during init — just have an empty coordMap
    expect(() => getMarkerPosition('NONEXISTENT')).toThrow(/MISSING COORDINATE/);
  });

  it('throws for missing office in v2 config', async () => {
    await initProjection('v2test');

    expect(() => getMarkerPosition('NONEXISTENT')).toThrow(/MISSING COORDINATE/);
  });
});

describe('V2 fixture: mixed svgOverride (T021)', () => {
  beforeEach(() => {
    __clearAllClients();
  });

  it('fixture file is valid v2 config', () => {
    const result = MapConfigV2Schema.safeParse(V2_MIXED_FIXTURE);
    expect(result.success).toBe(true);
  });

  it('override offices use exact svgOverride coordinates', async () => {
    await initProjection('v2mixed');

    const pa1 = getMarkerPosition('MIX PA1');
    expect(pa1.x).toBe(760.0);
    expect(pa1.y).toBe(245.0);

    const ny1 = getMarkerPosition('MIX NY1');
    expect(ny1.x).toBe(850.0);
    expect(ny1.y).toBe(215.0);
  });

  it('non-override offices use runtime projection', async () => {
    await initProjection('v2mixed');

    const fl1 = getMarkerPosition('MIX FL1');
    expect(Math.abs(fl1.x - 754.27)).toBeLessThan(TOLERANCE);
    expect(Math.abs(fl1.y - 518.08)).toBeLessThan(TOLERANCE);

    const il1 = getMarkerPosition('MIX IL1');
    expect(Math.abs(il1.x - 626.93)).toBeLessThan(TOLERANCE);
    expect(Math.abs(il1.y - 221.51)).toBeLessThan(TOLERANCE);
  });

  it('getMarkerPosition returns correct values for all 4 offices', async () => {
    await initProjection('v2mixed');

    // All four should be accessible
    expect(() => getMarkerPosition('MIX PA1')).not.toThrow();
    expect(() => getMarkerPosition('MIX NY1')).not.toThrow();
    expect(() => getMarkerPosition('MIX FL1')).not.toThrow();
    expect(() => getMarkerPosition('MIX IL1')).not.toThrow();
  });
});

describe('SvgOverride schema validation (T022)', () => {
  it('accepts valid svgOverride', () => {
    const result = SvgOverrideSchema.safeParse({ x: 100, y: 200 });
    expect(result.success).toBe(true);
  });

  it('rejects svgOverride missing x', () => {
    const result = SvgOverrideSchema.safeParse({ y: 200 });
    expect(result.success).toBe(false);
  });

  it('rejects svgOverride missing y', () => {
    const result = SvgOverrideSchema.safeParse({ x: 100 });
    expect(result.success).toBe(false);
  });

  it('rejects svgOverride with non-numeric values', () => {
    const result = SvgOverrideSchema.safeParse({ x: 'foo', y: 'bar' });
    expect(result.success).toBe(false);
  });
});
