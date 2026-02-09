# Quickstart: V2 Map Configs with Runtime Projection

**Feature**: 014-runtime-lat-lon-projection
**Date**: 2026-02-08

## What Changed

V2 map configs eliminate `svgX`/`svgY` from office coordinates. Instead, the app projects lat/lon to SVG positions at runtime using D3's `geoAlbersUsa` projection with per-config parameters.

**Before (v1)**: You need svgX/svgY computed by calibration scripts.
**After (v2)**: You only need lat/lon. The app does the math.

## Creating a New V2 Config

### 1. Start with the template

```json
{
  "configVersion": 2,
  "mapId": "usa-regions",
  "clientId": "your-client-id",
  "mapAssetHash": "0a59d058bfe5150fb4b135bf00c1daa5c4196a8a98ec01afe77d286eb0d5f16a",
  "viewBox": { "x": 0, "y": 0, "width": 960, "height": 600 },
  "projection": {
    "type": "geoAlbersUsa",
    "scale": 1276,
    "translate": [479, 299]
  },
  "coordinates": [],
  "regions": []
}
```

### 2. Add offices with lat/lon only

```json
"coordinates": [
  { "officeCode": "CLIENT NY1", "lat": 40.7128, "lon": -74.006 },
  { "officeCode": "CLIENT CA1", "lat": 34.0522, "lon": -118.2437 },
  { "officeCode": "CLIENT TX1", "lat": 32.7767, "lon": -96.797 }
]
```

No `svgX`/`svgY` needed. The projection params handle the conversion at runtime.

### 3. Add regions (same as v1)

```json
"regions": [
  { "id": "northeast", "name": "Northeast", "svgPathId": "region-clientid-northeast" }
]
```

### 4. Register the client

Add entries to `src/lib/client-registry.ts` import maps and the appropriate `config/clients.*.json` registry file.

### 5. Verify

```bash
npm test                    # All tests pass
npm run verify:all-clients  # Config validation
```

## Migrating an Existing V1 Config

### Calibrated config (has projection field)

```bash
# Preview changes
npx tsx scripts/migrate-to-v2.ts config/usg-map-config.json --verify

# Apply migration
npx tsx scripts/migrate-to-v2.ts config/usg-map-config.json --apply
```

### Hand-placed config (no projection field)

```bash
# Infer projection params and identify overrides
npx tsx scripts/migrate-to-v2.ts config/acme-map-config.json --infer-projection --verify

# Apply with inferred params
npx tsx scripts/migrate-to-v2.ts config/acme-map-config.json --infer-projection --apply
```

### Without inference (all offices get svgOverride)

```bash
npx tsx scripts/migrate-to-v2.ts config/acme-map-config.json --apply
```

## Using svgOverride

For offices that need hand-tuned positions (when the projection doesn't place them correctly):

```json
{
  "officeCode": "ACME TX1",
  "lat": 32.7767,
  "lon": -96.797,
  "svgOverride": { "x": 465.0, "y": 380.0 }
}
```

The `svgOverride` position is used in SVG mode instead of the runtime projection result. The lat/lon is still required (used by 3D globe and tile map modes).

## Projection Parameters

The standard projection params for the current `usa-regions.svg` asset:

```json
{
  "type": "geoAlbersUsa",
  "scale": 1276,
  "translate": [479, 299]
}
```

These values are calibrated to the 960x600 viewBox. If the SVG asset changes, these must be recalibrated using the existing `scripts/recapture-coordinates.ts` pipeline.

## What Stays the Same

- `getMarkerPosition(officeCode)` API is unchanged
- `mapAssetHash` still validates the SVG asset
- `viewBox` is the same
- `regions` with `svgPathId` are the same
- 3D globe and tile maps are completely unaffected
- All existing v1 configs continue to work without changes
