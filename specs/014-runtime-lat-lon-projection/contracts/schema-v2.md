# Contract: V2 Schema & Discriminated Union

**File**: `src/lib/map-config.schema.ts` (modify)
**Feature**: 014-runtime-lat-lon-projection

## Purpose

Extend the existing Zod schema to support both v1 and v2 map configs via a discriminated union on `configVersion`. The v1 schema and its behavior must remain completely unchanged.

## Schema Changes

### Before (current)

```typescript
export const MapConfigSchema = z.object({
  configVersion: z.literal(1),
  // ... fields
});
export type MapConfig = z.infer<typeof MapConfigSchema>;
```

### After

```typescript
// V1 schema — renamed but NOT modified
export const MapConfigV1Schema = z.object({
  configVersion: z.literal(1),
  // ... all existing fields unchanged
});

// V2 schema — new
export const MapConfigV2Schema = z.object({
  configVersion: z.literal(2),
  // ... v2 fields (see data-model.md)
});

// Union — new public API
export const MapConfigSchema = z.discriminatedUnion('configVersion', [
  MapConfigV1Schema,
  MapConfigV2Schema,
]);

// Types
export type MapConfigV1 = z.infer<typeof MapConfigV1Schema>;
export type MapConfigV2 = z.infer<typeof MapConfigV2Schema>;
export type MapConfig = z.infer<typeof MapConfigSchema>;
```

## Backwards Compatibility

| Aspect                                 | Guarantee                                              |
| -------------------------------------- | ------------------------------------------------------ |
| `MapConfigSchema.parse(v1Config)`      | Returns `MapConfigV1` — identical to current behavior  |
| `MapConfigSchema.parse(v2Config)`      | Returns `MapConfigV2` — new code path                  |
| `MapConfigSchema.parse(invalidConfig)` | Throws ZodError — unchanged                            |
| `type MapConfig`                       | Union type — consumers must narrow via `configVersion` |
| Existing imports of `MapConfigSchema`  | No breakage — same export name                         |
| Existing imports of `MapConfig` type   | Now a union — narrowing required in `projection.ts`    |

## Type Narrowing Pattern

```typescript
function handleConfig(config: MapConfig) {
  if (config.configVersion === 1) {
    // TypeScript narrows to MapConfigV1
    // config.coordinates[0].svgX exists
  } else {
    // TypeScript narrows to MapConfigV2
    // config.coordinates[0].svgOverride may exist
    // config.projection is required
  }
}
```

## New Sub-Schema Exports

```typescript
export const ProjectionParamsSchema = z.object({
  type: z.literal('geoAlbersUsa'),
  scale: z.number().positive(),
  translate: z.tuple([z.number(), z.number()]),
});

export const SvgOverrideSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export type ProjectionParams = z.infer<typeof ProjectionParamsSchema>;
export type SvgOverride = z.infer<typeof SvgOverrideSchema>;
```

## Constraints

- FR-002: v2 schema must require lat, lon, projection; svgOverride optional
- FR-003: Discriminated union on configVersion
- FR-009: mapAssetHash, viewBox, regions (with svgPathId), pinAsset unchanged

## Test Contract

| Test Case                   | Input                                                             | Expected                            |
| --------------------------- | ----------------------------------------------------------------- | ----------------------------------- |
| Parse valid v1 config       | `{ configVersion: 1, svgX: 100, svgY: 200, ... }`                 | Returns MapConfigV1                 |
| Parse valid v2 config       | `{ configVersion: 2, lat: 40, lon: -80, projection: {...}, ... }` | Returns MapConfigV2                 |
| Parse v2 with svgOverride   | `{ ..., svgOverride: { x: 465, y: 380 } }`                        | Override preserved                  |
| Parse v2 missing projection | `{ configVersion: 2, ... }` (no projection)                       | ZodError                            |
| Parse v2 with svgX/svgY     | `{ configVersion: 2, svgX: 100, ... }`                            | Extra fields stripped (Zod default) |
| Parse unknown version       | `{ configVersion: 3, ... }`                                       | ZodError (no matching discriminant) |
| Existing v1 configs pass    | All 4 JSON files from config/                                     | Parse successfully as v1            |
