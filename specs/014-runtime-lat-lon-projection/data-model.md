# Data Model: Runtime Lat/Lon Projection

**Feature**: 014-runtime-lat-lon-projection
**Date**: 2026-02-08

## Schema Overview

This feature introduces a `configVersion: 2` schema variant alongside the existing v1 schema. Both are represented as a discriminated union on the `configVersion` field.

## Entity Definitions

### MapConfigV1 (existing, unchanged)

The current schema. No modifications whatsoever.

```typescript
// Existing — DO NOT MODIFY
const OfficeCoordinateV1Schema = z.object({
  officeCode: z.string().transform(normalizeOfficeCode),
  lat: z.number(), // Reference only in v1
  lon: z.number(), // Reference only in v1
  svgX: z.number().nonnegative(), // Required in v1
  svgY: z.number().nonnegative(), // Required in v1
});

const MapConfigV1Schema = z.object({
  configVersion: z.literal(1),
  mapId: z.string(),
  clientId: z.string(),
  mapAssetHash: z.string().regex(/^[a-f0-9]{64}$/),
  viewBox: ViewBoxSchema,
  coordinates: z.array(OfficeCoordinateV1Schema),
  pinAsset: z.string().optional(),
  regions: z.array(RegionSchema).optional(),
  projection: ProjectionParamsSchema.optional(), // Present in calibrated configs
});
```

### MapConfigV2 (new)

```typescript
const SvgOverrideSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const ProjectionParamsSchema = z.object({
  type: z.literal('geoAlbersUsa'),
  scale: z.number().positive(),
  translate: z.tuple([z.number(), z.number()]),
});

const OfficeCoordinateV2Schema = z.object({
  officeCode: z.string().transform(normalizeOfficeCode),
  lat: z.number(), // Required — used for runtime projection
  lon: z.number(), // Required — used for runtime projection
  svgOverride: SvgOverrideSchema.optional(), // Bypasses projection for this office
});
// NOTE: svgX and svgY are ABSENT — not optional, removed entirely

const MapConfigV2Schema = z.object({
  configVersion: z.literal(2),
  mapId: z.string(),
  clientId: z.string(),
  mapAssetHash: z.string().regex(/^[a-f0-9]{64}$/), // Retained (FR-009)
  viewBox: ViewBoxSchema, // Retained (FR-009)
  coordinates: z.array(OfficeCoordinateV2Schema),
  pinAsset: z.string().optional(), // Retained (FR-009)
  regions: z.array(RegionSchema).optional(), // Retained with svgPathId (FR-009)
  projection: ProjectionParamsSchema, // REQUIRED in v2 (not optional)
});
```

### MapConfig (discriminated union)

```typescript
const MapConfigSchema = z.discriminatedUnion('configVersion', [
  MapConfigV1Schema,
  MapConfigV2Schema,
]);

type MapConfig = z.infer<typeof MapConfigSchema>;
type MapConfigV1 = z.infer<typeof MapConfigV1Schema>;
type MapConfigV2 = z.infer<typeof MapConfigV2Schema>;
```

### Shared Sub-Schemas (unchanged)

```typescript
const ViewBoxSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
});

const RegionSchema = z.object({
  id: z.string().transform(normalizeRegionId),
  name: z.string(),
  svgPathId: z.string().transform(validateSvgPathId), // Retained (FR-009)
});
```

## Field Changes: v1 → v2

| Field                       | v1                  | v2                          | Notes                                       |
| --------------------------- | ------------------- | --------------------------- | ------------------------------------------- |
| `configVersion`             | `1` (literal)       | `2` (literal)               | Discriminant                                |
| `coordinates[].svgX`        | Required (nonneg)   | **Removed**                 | Replaced by runtime projection              |
| `coordinates[].svgY`        | Required (nonneg)   | **Removed**                 | Replaced by runtime projection              |
| `coordinates[].lat`         | Present (reference) | Required (projection input) | Semantic change: reference → functional     |
| `coordinates[].lon`         | Present (reference) | Required (projection input) | Semantic change: reference → functional     |
| `coordinates[].svgOverride` | N/A                 | Optional `{ x, y }`         | Bypasses projection for hand-placed offices |
| `projection`                | Optional (metadata) | **Required**                | Drives runtime projection in v2             |
| `mapAssetHash`              | Required            | Required                    | Unchanged (FR-009)                          |
| `viewBox`                   | Required            | Required                    | Unchanged (FR-009)                          |
| `regions`                   | Optional            | Optional                    | Unchanged, svgPathId retained (FR-009)      |
| `pinAsset`                  | Optional            | Optional                    | Unchanged (FR-009)                          |

## Runtime Data Flow

### v1 Path (unchanged)

```
Config JSON (v1)
  → Zod parse (MapConfigV1Schema)
  → Build coordMap: Map<officeCode, {x: svgX, y: svgY}>
  → getMarkerPosition(officeCode) → {x, y}
```

### v2 Path (new)

```
Config JSON (v2)
  → Zod parse (MapConfigV2Schema)
  → Lazy-load d3-geo
  → For each coordinate:
      if svgOverride present:
        coordMap.set(officeCode, svgOverride)
      else:
        {x, y} = projectToSvg(lat, lon, config.projection)
        coordMap.set(officeCode, {x, y})
  → getMarkerPosition(officeCode) → {x, y}  // Same API, same return type
```

### Key Invariant

`getMarkerPosition()` signature and return type `{ x: number; y: number }` are **identical** regardless of config version. Consumers (MapSvg, etc.) are unaware of which code path produced the coordinates.

## Example Config Files

### v2 Config (calibrated client — usg)

```json
{
  "configVersion": 2,
  "mapId": "usa-regions",
  "clientId": "usg",
  "mapAssetHash": "0a59d058bfe5150fb4b135bf00c1daa5c4196a8a98ec01afe77d286eb0d5f16a",
  "viewBox": { "x": 0, "y": 0, "width": 960, "height": 600 },
  "projection": {
    "type": "geoAlbersUsa",
    "scale": 1276,
    "translate": [479, 299]
  },
  "coordinates": [
    { "officeCode": "USG PA1", "lat": 40.2628, "lon": -80.1631 },
    { "officeCode": "USG PA2", "lat": 39.9512, "lon": -75.1645 }
  ],
  "regions": [
    { "id": "northeast", "name": "Northeast Region", "svgPathId": "region-usg-northeast-region" }
  ]
}
```

### v2 Config (hand-placed client — acme, with svgOverride)

```json
{
  "configVersion": 2,
  "mapId": "usa-regions",
  "clientId": "acme",
  "mapAssetHash": "0a59d058bfe5150fb4b135bf00c1daa5c4196a8a98ec01afe77d286eb0d5f16a",
  "viewBox": { "x": 0, "y": 0, "width": 960, "height": 600 },
  "projection": {
    "type": "geoAlbersUsa",
    "scale": 1276,
    "translate": [479, 299]
  },
  "coordinates": [
    {
      "officeCode": "ACME TX1",
      "lat": 32.7767,
      "lon": -96.797,
      "svgOverride": { "x": 465.0, "y": 380.0 }
    },
    {
      "officeCode": "ACME CA1",
      "lat": 34.0522,
      "lon": -118.2437,
      "svgOverride": { "x": 140.0, "y": 370.0 }
    }
  ],
  "regions": [{ "id": "south", "name": "South Region", "svgPathId": "region-acme-south-region" }]
}
```

## Migration Rules

| Source (v1)                       | Target (v2)             | Rule                                                 |
| --------------------------------- | ----------------------- | ---------------------------------------------------- |
| `configVersion: 1`                | `configVersion: 2`      | Literal change                                       |
| `coordinates[].svgX/svgY`         | (removed)               | Dropped from schema                                  |
| `coordinates[].lat/lon`           | `coordinates[].lat/lon` | Preserved as-is                                      |
| `projection` (if present)         | `projection` (required) | Promoted from optional to required                   |
| No `projection` field             | `projection` (inferred) | Least-squares fitting from svgX/svgY + lat/lon pairs |
| Office with >2px projection drift | `svgOverride: { x, y }` | Original svgX/svgY preserved as override             |
| `mapAssetHash`                    | `mapAssetHash`          | Unchanged                                            |
| `viewBox`                         | `viewBox`               | Unchanged                                            |
| `regions` + `svgPathId`           | `regions` + `svgPathId` | Unchanged (Phase 2 concern)                          |
