# Contract: Migration Script

**File**: `scripts/migrate-to-v2.ts` (new)
**Feature**: 014-runtime-lat-lon-projection

## Purpose

CLI script that converts v1 map config files to v2 format. Handles both calibrated configs (with projection params) and hand-placed configs (without projection params).

## CLI Interface

```
npx tsx scripts/migrate-to-v2.ts <config-path> [options]

Options:
  --verify              Dry run — print diff report without writing (default mode)
  --apply               Write the v2 config to disk (overwrites input file)
  --output <path>       Write v2 config to a different file
  --infer-projection    Compute best-fit projection params via least-squares (for hand-placed configs)
  --override-threshold  Max projection drift (px) before tagging as svgOverride (default: 2)
```

## Behavior by Config Type

### Calibrated Configs (have `projection` field)

1. Read v1 config, validate against `MapConfigV1Schema`
2. Extract existing `projection` params
3. For each coordinate: project `[lon, lat]` using stored params
4. Compare projected `{x, y}` to stored `svgX/svgY`
5. If all deltas <=1px: emit v2 config with projection params, no svgOverride
6. If any delta >1px: warn about drift, still emit but flag the discrepant offices
7. Remove `svgX`/`svgY` from coordinates
8. Set `configVersion: 2`
9. Print diff report

### Hand-Placed Configs (no `projection` field)

1. Read v1 config, validate against `MapConfigV1Schema`
2. If `--infer-projection` flag:
   a. Collect `{lat, lon, svgX, svgY}` pairs
   b. Run least-squares fitting to find optimal `scale` and `translate` for `geoAlbersUsa`
   c. Report per-office residual error
   d. Offices with residual >threshold get `svgOverride: { x: svgX, y: svgY }`
   e. Embed inferred params in v2 config
3. If no `--infer-projection` flag:
   a. Use default params (`scale: 1276, translate: [479, 299]`)
   b. Tag ALL offices with `svgOverride` (preserving exact positions)
   c. Print warning that all offices use overrides

### Output Format

```json
{
  "configVersion": 2,
  "mapId": "...",
  "clientId": "...",
  "mapAssetHash": "...",
  "viewBox": { "..." },
  "projection": { "type": "geoAlbersUsa", "scale": 1276, "translate": [479, 299] },
  "coordinates": [
    { "officeCode": "ACME TX1", "lat": 32.7767, "lon": -96.797, "svgOverride": { "x": 465.0, "y": 380.0 } }
  ],
  "regions": [ "..." ]
}
```

## Diff Report Format

```
=== Migration Report: acme-map-config.json ===
Config type: hand-placed (no projection field)
Projection params: inferred via least-squares (scale: 1280, translate: [481, 301])

Office          | v1 svgX  | v1 svgY  | v2 projX | v2 projY | Delta  | Action
ACME TX1        | 465.00   | 380.00   | 468.23   | 383.41   | 4.52px | svgOverride
ACME CA1        | 140.00   | 370.00   | 138.12   | 368.44   | 2.32px | svgOverride
ACME NY1        | 790.00   | 220.00   | 791.55   | 219.78   | 1.57px | projected

Summary: 2/3 offices use svgOverride, 1/3 use projection
Max drift: 4.52px (ACME TX1)
```

## Least-Squares Fitting Algorithm

For configs without projection params, the script infers optimal `scale` and `translate` by minimizing the sum of squared errors between projected and stored coordinates.

**Search space**:

- scale: 1200–1400 (step 1)
- translateX: 450–510 (step 1)
- translateY: 270–330 (step 1)

**Objective**: Minimize `Σ [(projX - svgX)² + (projY - svgY)²]` across all offices.

**Refinement**: After coarse search, refine with ±5 range at step 0.1.

This reuses the same approach as the existing `scripts/recapture-coordinates.ts` calibration pipeline.

## Constraints

- FR-005: Migration script for v1→v2 conversion
- FR-006: <=0.5px drift for calibrated clients
- FR-010: Warn (not fail) on svgPathId mismatch
- EC-05: Detect stale calibration params

## Exit Codes

| Code | Meaning                                                        |
| ---- | -------------------------------------------------------------- |
| 0    | Success — v2 config generated/written                          |
| 1    | Validation error — input is not valid v1                       |
| 2    | Projection accuracy warning — drift >1px for calibrated config |

## Test Contract

| Test Case                          | Input                                     | Expected                                   |
| ---------------------------------- | ----------------------------------------- | ------------------------------------------ |
| Migrate calibrated config          | usg-map-config.json                       | v2 with no svgOverride, all deltas <=0.5px |
| Migrate hand-placed config         | acme-map-config.json --infer-projection   | v2 with svgOverride for drifted offices    |
| Migrate without --infer-projection | acme-map-config.json                      | v2 with ALL offices using svgOverride      |
| Verify mode (default)              | Any config                                | Print report, do NOT write file            |
| Round-trip validation              | Migrate then parse with MapConfigV2Schema | Passes Zod validation                      |
| svgPathId warning                  | Config with non-existent svgPathId        | Warning printed, exit code 0               |
| Stale calibration detection        | Config where projection != svgX/svgY >1px | Warning printed, exit code 2               |
