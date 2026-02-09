# Contract: SVG Projection Module

**File**: `src/lib/svg-projection.ts` (new)
**Feature**: 014-runtime-lat-lon-projection

## Purpose

Pure geographic projection function that converts lat/lon coordinates to SVG pixel positions using D3's `geoAlbersUsa` projection. Lazy-loads d3-geo via dynamic import to avoid penalizing 3D and tile map modes.

## Public API

### `projectToSvg(lat, lon, params)`

```typescript
export async function projectToSvg(
  lat: number,
  lon: number,
  params: ProjectionParams
): Promise<{ x: number; y: number }>;
```

**Parameters**:

- `lat`: Latitude in decimal degrees (e.g., 40.2628)
- `lon`: Longitude in decimal degrees (e.g., -80.1631)
- `params`: Projection configuration `{ type: "geoAlbersUsa", scale: number, translate: [number, number] }`

**Returns**: `{ x: number; y: number }` in SVG viewBox coordinate space

**Throws**:

- `ProjectionError` when `geoAlbersUsa` returns `null` (coordinates outside all projection insets — EC-01)
- Error message must include the lat/lon values and a human-readable explanation

**Purity**: No side effects, no global state. The d3-geo library is lazily loaded on first call and cached internally.

### `projectAllToSvg(coordinates, params)`

```typescript
export async function projectAllToSvg(
  coordinates: Array<{
    officeCode: string;
    lat: number;
    lon: number;
    svgOverride?: { x: number; y: number };
  }>,
  params: ProjectionParams
): Promise<Map<string, { x: number; y: number }>>;
```

**Purpose**: Batch projection for use during `initProjection()`. Projects all coordinates, applying `svgOverride` where present.

**Returns**: Map keyed by normalized officeCode with `{ x, y }` values.

**Throws**: `ProjectionError` if any coordinate without `svgOverride` projects to `null`.

## Internal Details

### Lazy Loading

```typescript
let cachedProjection: ((coords: [number, number]) => [number, number] | null) | null = null;

async function getProjection(params: ProjectionParams) {
  if (!cachedProjection) {
    const { geoAlbersUsa } = await import('d3-geo');
    // Cache is per-params — if params change, rebuild
  }
  return geoAlbersUsa().scale(params.scale).translate(params.translate);
}
```

**Note**: The projection function itself is cheap to create (~0.01ms). The expensive part is the dynamic import. The module caches the imported `geoAlbersUsa` constructor, not the configured projection instance, since different clients may have different params.

### Error Type

```typescript
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
```

## Constraints

- FR-001: Function must be pure (no side effects, no global state)
- FR-008: Must throw descriptive error, not return NaN/undefined, when projection returns null
- SC-002: d3-geo chunk must be <=20KB gzipped
- Constitution VI: No network requests — d3-geo is bundled by Vite

## Test Contract

| Test Case                  | Input                                                      | Expected Output                                |
| -------------------------- | ---------------------------------------------------------- | ---------------------------------------------- |
| Known coordinate (USG PA1) | lat=40.2628, lon=-80.1631, scale=1276, translate=[479,299] | Within 0.5px of {x: 754.84, y: 241.73}         |
| Null projection (Guam)     | lat=13.4443, lon=144.7937                                  | Throws ProjectionError                         |
| Alaska office              | lat=61.2181, lon=-149.9003                                 | Returns valid {x, y} (Alaska inset)            |
| Hawaii office              | lat=21.3069, lon=-157.8583                                 | Returns valid {x, y} (Hawaii inset)            |
| Batch with svgOverride     | [{..., svgOverride: {x:465, y:380}}, {...}]                | Override used for first, projection for second |
