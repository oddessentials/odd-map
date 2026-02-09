/**
 * Schema V2 Tests (T007)
 *
 * Comprehensive tests for the v2 map config schema and discriminated union:
 * - Valid v1 config parsing (real config files)
 * - Valid v2 config parsing
 * - v2 with svgOverride
 * - v2 missing projection (ZodError)
 * - Unknown configVersion (ZodError)
 * - v2 with extra svgX/svgY fields stripped
 * - Type narrowing on configVersion discriminant
 * - All 4 existing configs parse as v1
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ZodError } from 'zod';
import {
  MapConfigSchema,
  MapConfigV1Schema,
  MapConfigV2Schema,
  OfficeCoordinateV1Schema,
  OfficeCoordinateV2Schema,
  OfficeCoordinateSchema,
  ProjectionParamsSchema,
  SvgOverrideSchema,
  type MapConfig,
  type MapConfigV1,
  type MapConfigV2,
  type ProjectionParams,
  type SvgOverride,
} from '../src/lib/map-config.schema';

// ─── Helpers ──────────────────────────────────────────────────────

function loadRawMapConfig(clientId: string): Record<string, unknown> {
  const path = join(__dirname, '..', 'config', `${clientId}-map-config.json`);
  return JSON.parse(readFileSync(path, 'utf-8'));
}

const VALID_HASH = '0a59d058bfe5150fb4b135bf00c1daa5c4196a8a98ec01afe77d286eb0d5f16a';

function makeV2Config(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    configVersion: 2,
    mapId: 'usa-regions',
    clientId: 'test',
    mapAssetHash: VALID_HASH,
    viewBox: { x: 0, y: 0, width: 960, height: 600 },
    projection: { type: 'geoAlbersUsa', scale: 1276, translate: [479, 299] },
    coordinates: [{ officeCode: 'TEST NY1', lat: 40.7128, lon: -74.006 }],
    ...overrides,
  };
}

// ─── Sub-schema tests ─────────────────────────────────────────────

describe('ProjectionParamsSchema', () => {
  it('parses valid projection params', () => {
    const result = ProjectionParamsSchema.parse({
      type: 'geoAlbersUsa',
      scale: 1276,
      translate: [479, 299],
    });
    expect(result.type).toBe('geoAlbersUsa');
    expect(result.scale).toBe(1276);
    expect(result.translate).toEqual([479, 299]);
  });

  it('rejects non-positive scale', () => {
    expect(() =>
      ProjectionParamsSchema.parse({
        type: 'geoAlbersUsa',
        scale: 0,
        translate: [479, 299],
      })
    ).toThrow();
  });

  it('rejects invalid projection type', () => {
    expect(() =>
      ProjectionParamsSchema.parse({
        type: 'mercator',
        scale: 1276,
        translate: [479, 299],
      })
    ).toThrow();
  });
});

describe('SvgOverrideSchema', () => {
  it('parses valid override', () => {
    const result = SvgOverrideSchema.parse({ x: 100.5, y: 200.3 });
    expect(result).toEqual({ x: 100.5, y: 200.3 });
  });
});

describe('OfficeCoordinateV2Schema', () => {
  it('parses without svgOverride', () => {
    const result = OfficeCoordinateV2Schema.parse({
      officeCode: 'test ny1',
      lat: 40.7128,
      lon: -74.006,
    });
    expect(result.officeCode).toBe('TEST NY1');
    expect(result.svgOverride).toBeUndefined();
  });

  it('parses with svgOverride', () => {
    const result = OfficeCoordinateV2Schema.parse({
      officeCode: 'test ny1',
      lat: 40.7128,
      lon: -74.006,
      svgOverride: { x: 862.15, y: 218.42 },
    });
    expect(result.svgOverride).toEqual({ x: 862.15, y: 218.42 });
  });
});

// ─── Backwards-compatible alias ───────────────────────────────────

describe('OfficeCoordinateSchema alias', () => {
  it('is the same as OfficeCoordinateV1Schema', () => {
    expect(OfficeCoordinateSchema).toBe(OfficeCoordinateV1Schema);
  });
});

// ─── V1 config parsing (inline fixtures — on-disk configs are now v2) ────

describe('MapConfigV1Schema', () => {
  const V1_USG_FIXTURE = {
    configVersion: 1,
    mapId: 'usa-regions',
    clientId: 'usg-v1-fixture',
    mapAssetHash: VALID_HASH,
    viewBox: { x: 0, y: 0, width: 960, height: 600 },
    projection: { type: 'geoAlbersUsa', scale: 1276, translate: [479, 299] },
    coordinates: [
      { officeCode: 'USG PA1', lat: 40.2628, lon: -80.1631, svgX: 754.84, svgY: 241.73 },
    ],
  };

  const V1_ACME_FIXTURE = {
    configVersion: 1,
    mapId: 'usa-regions',
    clientId: 'acme-v1-fixture',
    mapAssetHash: VALID_HASH,
    viewBox: { x: 0, y: 0, width: 960, height: 600 },
    coordinates: [{ officeCode: 'ACME TX1', lat: 32.7767, lon: -96.797, svgX: 465, svgY: 380 }],
  };

  it('parses valid v1 config', () => {
    const result = MapConfigV1Schema.parse(V1_USG_FIXTURE);
    expect(result.configVersion).toBe(1);
    expect(result.clientId).toBe('usg-v1-fixture');
    expect(result.coordinates.length).toBeGreaterThan(0);
    expect(result.coordinates[0].svgX).toBeTypeOf('number');
    expect(result.coordinates[0].svgY).toBeTypeOf('number');
  });

  it('preserves optional projection in v1', () => {
    const result = MapConfigV1Schema.parse(V1_USG_FIXTURE);
    expect(result.projection).toBeDefined();
    expect(result.projection!.type).toBe('geoAlbersUsa');
    expect(result.projection!.scale).toBe(1276);
  });

  it('parses v1 config without projection', () => {
    const result = MapConfigV1Schema.parse(V1_ACME_FIXTURE);
    expect(result.configVersion).toBe(1);
    expect(result.projection).toBeUndefined();
  });
});

// ─── V2 config parsing ───────────────────────────────────────────

describe('MapConfigV2Schema', () => {
  it('parses valid v2 config', () => {
    const raw = makeV2Config();
    const result = MapConfigV2Schema.parse(raw);
    expect(result.configVersion).toBe(2);
    expect(result.projection.type).toBe('geoAlbersUsa');
    expect(result.coordinates[0].officeCode).toBe('TEST NY1');
  });

  it('parses v2 with svgOverride on coordinates', () => {
    const raw = makeV2Config({
      coordinates: [
        {
          officeCode: 'TEST NY1',
          lat: 40.7128,
          lon: -74.006,
          svgOverride: { x: 862.15, y: 218.42 },
        },
      ],
    });
    const result = MapConfigV2Schema.parse(raw);
    expect(result.coordinates[0].svgOverride).toEqual({ x: 862.15, y: 218.42 });
  });

  it('rejects v2 missing required projection', () => {
    const raw = makeV2Config();
    delete (raw as Record<string, unknown>).projection;
    expect(() => MapConfigV2Schema.parse(raw)).toThrow(ZodError);
  });

  it('strips extra svgX/svgY fields from v2 coordinates', () => {
    const raw = makeV2Config({
      coordinates: [
        {
          officeCode: 'TEST NY1',
          lat: 40.7128,
          lon: -74.006,
          svgX: 862.15,
          svgY: 218.42,
        },
      ],
    });
    const result = MapConfigV2Schema.parse(raw);
    // svgX and svgY are not in the v2 coordinate schema
    expect('svgX' in result.coordinates[0]).toBe(false);
    expect('svgY' in result.coordinates[0]).toBe(false);
  });
});

// ─── Discriminated union ──────────────────────────────────────────

describe('MapConfigSchema (discriminated union)', () => {
  it('parses v1 config via union', () => {
    const v1Fixture = {
      configVersion: 1,
      mapId: 'usa-regions',
      clientId: 'union-v1',
      mapAssetHash: VALID_HASH,
      viewBox: { x: 0, y: 0, width: 960, height: 600 },
      coordinates: [
        { officeCode: 'TEST PA1', lat: 40.2628, lon: -80.1631, svgX: 754.84, svgY: 241.73 },
      ],
    };
    const result = MapConfigSchema.parse(v1Fixture);
    expect(result.configVersion).toBe(1);
  });

  it('parses v2 config via union (on-disk configs)', () => {
    const raw = loadRawMapConfig('usg');
    const result = MapConfigSchema.parse(raw);
    expect(result.configVersion).toBe(2);
  });

  it('rejects unknown configVersion', () => {
    const raw = makeV2Config({ configVersion: 99 });
    expect(() => MapConfigSchema.parse(raw)).toThrow(ZodError);
  });

  it('narrows type on configVersion discriminant', () => {
    const raw = loadRawMapConfig('usg');
    const result: MapConfig = MapConfigSchema.parse(raw);

    if (result.configVersion === 1) {
      // TypeScript should narrow to MapConfigV1 — svgX accessible
      const firstCoord = result.coordinates[0];
      expect(firstCoord.svgX).toBeTypeOf('number');
      expect(firstCoord.svgY).toBeTypeOf('number');
    } else {
      // TypeScript should narrow to MapConfigV2 — projection required
      expect(result.projection.type).toBe('geoAlbersUsa');
    }
  });

  it('narrows v2 type correctly', () => {
    const raw = makeV2Config();
    const result: MapConfig = MapConfigSchema.parse(raw);

    if (result.configVersion === 2) {
      expect(result.projection.type).toBe('geoAlbersUsa');
      expect('svgX' in result.coordinates[0]).toBe(false);
    } else {
      throw new Error('Expected configVersion 2');
    }
  });
});

// ─── All 4 existing configs parse as v2 (post-migration) ────────────

describe('All existing configs parse as v2', () => {
  const clients = ['usg', 'oddessentials', 'acme', 'demo'] as const;

  for (const clientId of clients) {
    it(`${clientId}-map-config.json parses as v2`, () => {
      const raw = loadRawMapConfig(clientId);
      const result = MapConfigSchema.parse(raw);
      expect(result.configVersion).toBe(2);
    });
  }
});

// ─── Type exports exist ───────────────────────────────────────────

describe('Type exports', () => {
  it('exports ProjectionParams type', () => {
    const p: ProjectionParams = { type: 'geoAlbersUsa', scale: 1276, translate: [479, 299] };
    expect(p.type).toBe('geoAlbersUsa');
  });

  it('exports SvgOverride type', () => {
    const s: SvgOverride = { x: 100, y: 200 };
    expect(s.x).toBe(100);
  });

  it('exports MapConfigV1 and MapConfigV2 types', () => {
    // Type-level check: these should compile without error
    const _v1: MapConfigV1 | null = null;
    const _v2: MapConfigV2 | null = null;
    expect(_v1).toBeNull();
    expect(_v2).toBeNull();
  });
});
