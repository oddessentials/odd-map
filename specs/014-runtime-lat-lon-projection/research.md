# Research: Runtime Lat/Lon Projection

**Feature**: 014-runtime-lat-lon-projection
**Date**: 2026-02-08
**Status**: Complete

## R-001: Projection Accuracy Verification (USG)

**Question**: Do the existing calibrated projection params (`scale: 1276, translate: [479, 299]`) reproduce the svgX/svgY values in `usg-map-config.json` within the 0.5px tolerance?

**Answer**: **YES — PASS**

All 13 USG offices have sub-pixel drift. The stored svgX/svgY values are essentially exact matches to the `geoAlbersUsa().scale(1276).translate([479, 299])` projection output.

| Office  | Projected        | Stored           | Delta    |
| ------- | ---------------- | ---------------- | -------- |
| USG PA1 | [754.84, 241.73] | [754.84, 241.73] | 0.0016px |
| USG PA2 | [838.98, 232.42] | [838.98, 232.42] | 0.0052px |
| USG MA1 | [892.35, 163.75] | [892.35, 163.75] | 0.0053px |
| USG FL1 | [754.27, 518.08] | [754.27, 518.08] | 0.0050px |
| USG GA1 | [703.08, 389.79] | [703.08, 389.79] | 0.0030px |
| USG LA1 | [602.59, 480.03] | [602.59, 480.03] | 0.0029px |
| USG TX1 | [468.69, 432.89] | [468.69, 432.89] | 0.0033px |
| USG TX2 | [499.05, 497.15] | [499.05, 497.15] | 0.0036px |
| USG CA1 | [92.51, 367.13]  | [92.51, 367.13]  | 0.0034px |
| USG US1 | [184.20, 51.96]  | [184.20, 51.96]  | 0.0049px |
| USG MN1 | [534.24, 155.84] | [534.24, 155.84] | 0.0047px |
| USG MI1 | [698.21, 197.74] | [698.21, 197.74] | 0.0050px |
| USG IL1 | [626.93, 221.51] | [626.93, 221.51] | 0.0020px |

**Max delta**: 0.0053px | **Avg delta**: 0.0038px

**Conclusion**: The projection params were calibrated using this exact projection function, and the stored values are just the projection output rounded to 2 decimal places. Runtime projection will be pixel-perfect for USG.

---

## R-002: Oddessentials Projection Parity

**Question**: Does the oddessentials config produce accurate coordinates with its declared projection params?

**Answer**: **NO — FAIL (stale calibration detected)**

Despite declaring the same projection params as USG (`scale: 1276, translate: [479, 299]`), all 5 oddessentials offices show significant drift:

| Office | Projected        | Stored           | Delta   |
| ------ | ---------------- | ---------------- | ------- |
| OE NY1 | [854.16, 211.39] | [862.15, 218.42] | 10.64px |
| OE FL1 | [808.05, 561.60] | [790.33, 555.18] | 18.85px |
| OE OR1 | [78.43, 88.25]   | [102.47, 148.91] | 65.25px |
| OE WA1 | [96.32, 45.09]   | [108.22, 108.55] | 64.56px |
| OE AZ1 | [194.10, 392.01] | [200.84, 372.63] | 20.52px |

**Max delta**: 65.25px | **Avg delta**: 35.96px

**Root Cause**: The oddessentials config was likely created by hand-adjusting coordinates after an initial projection pass, or the projection field was copied from USG without recalibration. The svgX/svgY values do NOT match the declared params.

**Impact on plan**: This is edge case EC-05 (stale calibration). The oddessentials config must be treated as a **hand-placed config** during migration, not as a calibrated config. The migration script must:

1. Detect the mismatch (declared params don't match stored coords)
2. Warn about it
3. Either tag all offices with `svgOverride` or infer new projection params via least-squares

**Revised categorization**:

- **usg**: Truly calibrated (0.005px drift) — clean v2 migration, no overrides needed
- **oddessentials**: Stale calibration (10-65px drift) — needs svgOverride or re-inference
- **acme**: Hand-placed (52-65px drift from standard params) — needs svgOverride
- **demo**: Hand-placed (52-114px drift from standard params) — needs svgOverride

---

## R-003: Hand-Placed Config Drift Analysis

**Question**: How far are the hand-placed configs from standard projection output?

**Answer**: Significant drift, as expected.

### Acme (3 offices, no projection field)

| Office   | Projected        | Stored         | Delta   |
| -------- | ---------------- | -------------- | ------- |
| ACME TX1 | [474.49, 432.03] | [465.0, 380.0] | 52.89px |
| ACME CA1 | [85.71, 356.05]  | [140.0, 370.0] | 56.06px |
| ACME NY1 | [854.16, 211.39] | [790.0, 220.0] | 64.74px |

**Max delta**: 64.74px | **Avg delta**: 57.89px

### Demo (2 offices, no projection field)

| Office   | Projected        | Stored         | Delta    |
| -------- | ---------------- | -------------- | -------- |
| DEMO FL1 | [808.05, 561.60] | [715.0, 495.0] | 114.43px |
| DEMO WA1 | [96.32, 45.09]   | [110.0, 95.0]  | 51.75px  |

**Max delta**: 114.43px | **Avg delta**: 83.09px

**Conclusion**: Hand-placed configs have large drift. All offices in acme and demo must receive `svgOverride` to preserve their visual positions. The `--infer-projection` flag can attempt to find better-fitting params, but most offices will likely still need overrides given the magnitude of drift.

---

## R-004: d3-geo Bundle Size

**Question**: What is the actual gzipped size of the d3-geo chunk?

**Answer**: Not yet measured via Vite build. Estimated ~15KB gzipped based on published package statistics.

**Action**: Measure during implementation. The `d3-geo@3.1.1` package is 93KB minified. The `geoAlbersUsa` function and its dependencies (composite projection, conic equal-area for Alaska/Hawaii insets) are a subset. Vite tree-shaking should reduce this. Budget is <=20KB gzipped (SC-002).

**Note**: d3-geo is currently in `devDependencies`. Must be moved to `dependencies` for the runtime import.

---

## R-005: latLonTo3D Dead Code

**Question**: Is `latLonTo3D()` in `projection.ts` used anywhere?

**Answer**: **CONFIRMED DEAD CODE**

- Defined at `src/lib/projection.ts:195-205`
- Exported but never imported or called anywhere in the codebase
- `map-3d.js` uses its own `latLonToGlobe()` function (defined at line 167-176) which is completely independent
- `latLonToGlobe()` does pure spherical→Cartesian math, no D3 dependency

**Action**: Remove `latLonTo3D()` during this feature to simplify the projection module. This also removes the only internal dependency between the SVG coordinate path and the 3D coordinate path, which cleanly separates concerns.

---

## Summary of Impact on Plan

| Finding                          | Impact                                                            |
| -------------------------------- | ----------------------------------------------------------------- |
| USG projection: pixel-perfect    | No changes needed — v2 migration is clean                         |
| Oddessentials: stale calibration | Must be treated as hand-placed, needs svgOverride or re-inference |
| Acme/Demo: large drift           | All offices need svgOverride (confirmed expected behavior)        |
| d3-geo size: ~15KB est.          | Within SC-002 budget, measure during implementation               |
| latLonTo3D: dead code            | Remove during refactor to simplify projection module              |
| Config categorization revised    | Only 1 of 4 configs is truly calibrated (usg)                     |

### Spec Accuracy Check

The spec assumed "calibrated clients (usg, oddessentials)" would both have clean migrations. Research reveals only usg is truly calibrated. The migration script must handle oddessentials as a stale-calibration case (EC-05), detecting the mismatch and applying overrides.

This does NOT change the spec's functional requirements — EC-05 already covers this scenario. The migration script's `--verify` mode will catch this, and the oddessentials config will get `svgOverride` entries for its 5 offices.
