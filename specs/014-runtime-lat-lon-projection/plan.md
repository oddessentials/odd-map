# Implementation Plan: Runtime Lat/Lon Projection

**Branch**: `014-runtime-lat-lon-projection` | **Date**: 2026-02-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/014-runtime-lat-lon-projection/spec.md`

## Summary

Replace pre-computed `svgX`/`svgY` coordinates with runtime geographic projection from lat/lon in the 2D SVG rendering mode. Introduce a `configVersion: 2` schema with a discriminated union for backwards compatibility. Provide a migration script to convert all 4 existing v1 configs. Only the SVG code path changes — 3D globe, MapLibre, and Apple MapKit already use lat/lon natively and are untouched.

## Technical Context

**Language/Version**: TypeScript 5.7 (ES2022 target), JavaScript (map-3d.js)
**Primary Dependencies**: Vite 7.3.1, Zod ^4.3.5, d3-geo ^3.1.1 (move from devDependencies to dependencies), Three.js ^0.182.0
**Storage**: Static JSON config files in `config/` directory
**Testing**: Vitest 4.0.17 (42 test files, ~456 tests currently)
**Target Platform**: Browser (static site, GitHub Pages deployment)
**Project Type**: Single web application (no backend)
**Performance Goals**: <=20KB gzipped for d3-geo lazy-loaded chunk; O(1) marker position lookup after initialization; zero impact on 3D/tile map modes
**Constraints**: Zero runtime backend (Constitution VI); all data bundled in static build; no visual regression in any rendering mode
**Scale/Scope**: 4 client configs (2 calibrated, 2 hand-placed), 2-23 offices per config, 960x600 SVG viewBox

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| #   | Principle                        | Status        | Notes                                                                                                                                        |
| --- | -------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| I   | Deterministic Data Pipeline      | **VIOLATION** | "No client-side projection recalculation" — this feature introduces runtime projection. See Complexity Tracking.                             |
| II  | Build-Time Coordinate Resolution | **VIOLATION** | "2D coordinates: SVG positions from config with O(1) lookup" — runtime projection replaces pre-computed SVG coords. See Complexity Tracking. |
| III | Enterprise Testing Standards     | PASS          | New projection module will have dedicated test file with golden reference coordinates. >=95% coverage target (SC-007).                       |
| IV  | Performance Budgets              | PASS          | d3-geo lazy-loaded only for SVG mode. No impact on 3D rendering budgets.                                                                     |
| V   | Accessibility First              | PASS          | No UI changes. Marker placement method changes but rendered output is identical.                                                             |
| VI  | Zero Runtime Backend             | PASS          | No network requests. d3-geo is bundled, projection runs client-side from bundled config data.                                                |

## Project Structure

### Documentation (this feature)

```text
specs/014-runtime-lat-lon-projection/
├── plan.md              # This file
├── research.md          # Phase 0: projection accuracy verification
├── data-model.md        # Phase 1: v1/v2 schema definitions
├── quickstart.md        # Phase 1: developer onboarding for v2 configs
├── contracts/           # Phase 1: module interface contracts
│   ├── projection-module.md
│   ├── schema-v2.md
│   └── migration-script.md
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── lib/
│   ├── map-config.schema.ts      # MODIFY: Add v2 schema, discriminated union
│   ├── projection.ts             # MODIFY: Add v2 code path to initProjection()
│   ├── svg-projection.ts         # NEW: Pure projectToSvg() function + d3-geo lazy load
│   └── client-registry.ts        # NO CHANGE (configs loaded the same way)
├── components/
│   ├── map-svg.ts                # NO CHANGE (consumes getMarkerPosition() — unchanged API)
│   ├── map-3d.js                 # NO CHANGE (FR-007)
│   └── map-providers/
│       ├── maplibre-provider.ts  # NO CHANGE (FR-007)
│       └── apple-provider.ts     # NO CHANGE (FR-007)

scripts/
└── migrate-to-v2.ts              # NEW: v1→v2 migration script with least-squares fitting

config/
├── *-map-config.json             # MIGRATE: All 4 configs converted to v2 (v1 preserved in git)

tests/
├── svg-projection.test.ts        # NEW: projectToSvg() unit tests with golden references
├── schema-v2.test.ts             # NEW: v2 schema parsing, discriminated union tests
├── migration.test.ts             # NEW: Migration script accuracy tests
├── projection.test.ts            # MODIFY: Re-enable for v2 runtime projection path
└── coordinate-storage.test.ts    # MODIFY: Add v2 coordMap construction tests
```

## Complexity Tracking

> **Constitution violations requiring justification**

| Violation                                                                  | Why Needed                                                                                                                                                                                                                                                                                                                                                                 | Simpler Alternative Rejected Because                                                                                                                                                                                                                        |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Principle I: "No client-side projection recalculation"                     | Runtime projection is the core deliverable. The current build-time pipeline (svgX/svgY from calibration scripts) cannot be replicated by external tools like odd-logistics. This blocks the entire odd-logistics companion app from generating complete configs.                                                                                                           | **Keep build-time pipeline**: Rejected because it perpetuates the SVG coordinate coupling that makes external config generation impossible. The calibration pipeline requires the SVG asset, d3-geo, and repo-specific scripts — it cannot be externalized. |
| Principle II: "2D coordinates: SVG positions from config with O(1) lookup" | O(1) lookup is preserved — `getMarkerPosition()` signature and return type are unchanged. The `coordMap` is still built at init time (not per-render). The difference is that coordMap entries come from `projectToSvg(lat, lon, params)` instead of `config.svgX/svgY`. Initialization adds one `geoAlbersUsa()` call per office (~13 offices max currently, <1ms total). | **Pre-compute in migration only**: Rejected because it defeats the purpose — odd-logistics would still need to run the projection pipeline to generate configs, re-introducing the coupling this feature eliminates.                                        |

**Constitution amendment recommended**: After this feature ships and stabilizes, Principles I and II should be updated via a MINOR version amendment:

- Principle I: Replace "No client-side projection recalculation" with "Projection computation MUST occur at initialization time, not per-render. Results MUST be cached for O(1) access."
- Principle II: Replace "SVG positions from config" with "SVG positions resolved at initialization from lat/lon + projection params, cached for O(1) lookup by officeCode."

---

## Phase 0: Research

_Resolve unknowns before design. Each item must result in a concrete answer._
_Full results with data tables in [research.md](./research.md)._

### R-001: Projection Accuracy Verification (USG) — PASS

The calibrated params (`scale: 1276, translate: [479, 299]`) reproduce all 13 USG office coordinates with max delta of **0.0053px**. Runtime projection will be pixel-perfect for USG.

### R-002: Oddessentials Projection Parity — FAIL (stale calibration)

Despite declaring the same projection params as USG, all 5 oddessentials offices show **10–65px drift**. The svgX/svgY values were hand-adjusted after initial calibration. This triggers edge case EC-05.

**Impact**: Oddessentials must be treated as a hand-placed config during migration. Only 1 of 4 configs (USG) is truly calibrated.

**Revised categorization**:
| Config | Type | Max Drift | Migration Strategy |
|--------|------|-----------|-------------------|
| usg | Calibrated | 0.005px | Clean v2, no overrides |
| oddessentials | Stale calibration | 65.25px | svgOverride for all 5 offices |
| acme | Hand-placed | 64.74px | svgOverride for all 3 offices |
| demo | Hand-placed | 114.43px | svgOverride for all 2 offices |

### R-003: Hand-Placed Config Drift Analysis — Confirmed

Acme: 52–65px drift. Demo: 52–114px drift. All offices in both configs need `svgOverride`.

### R-004: d3-geo Bundle Size — Estimated ~15KB gzipped

Not yet measured via Vite build (deferred to implementation). Published package is 93KB minified; tree-shaking to `geoAlbersUsa` subset expected <=20KB gzipped (SC-002 budget).

### R-005: latLonTo3D Dead Code — Confirmed Dead

`latLonTo3D()` is exported but never imported or called anywhere. `map-3d.js` uses its own independent `latLonToGlobe()` function. Remove during this feature.

---

### Constitution Re-Check (Post-Research)

Research confirms the constitution violations are justified and scoped:

| #      | Principle                        | Post-Research Status                                                                           |
| ------ | -------------------------------- | ---------------------------------------------------------------------------------------------- |
| I      | Deterministic Data Pipeline      | **VIOLATION — justified**. Projection runs once at init, results cached. Not per-render.       |
| II     | Build-Time Coordinate Resolution | **VIOLATION — justified**. O(1) lookup preserved. Only the source of coordMap entries changes. |
| III–VI | All other principles             | PASS (unchanged)                                                                               |

No new violations discovered. The oddessentials finding (stale calibration) doesn't introduce new constitution concerns — it just means more configs need `svgOverride`.

## Phase 1: Design

### Data Model

_Defined in [data-model.md](./data-model.md)._

**Key entities**:

1. **MapConfigV1** (existing) — `configVersion: 1`, coordinates with required `svgX`/`svgY`
2. **MapConfigV2** (new) — `configVersion: 2`, coordinates with required `lat`/`lon`, optional `svgOverride: { x, y }`, required `projection: { type, scale, translate }`
3. **MapConfig** (union) — `MapConfigV1 | MapConfigV2`, discriminated on `configVersion`
4. **ProjectionParams** — `{ type: "geoAlbersUsa", scale: number, translate: [number, number] }`
5. **SvgOverride** — `{ x: number, y: number }` for hand-placed coordinate bypass

### Contracts

_Defined in [contracts/](./contracts/)._

**projection-module.md**: `projectToSvg(lat, lon, params) → { x, y }` — pure function, lazy-loads d3-geo, throws on null projection (EC-01).

**schema-v2.md**: Zod schema with discriminated union. V1 parsing unchanged. V2 parsing validates projection params and optional svgOverride per coordinate.

**migration-script.md**: CLI script interface — accepts v1 config path, outputs v2 config. Modes: `--verify` (dry run with diff report), `--apply` (write output), `--infer-projection` (least-squares for hand-placed configs).

### Integration Points

| Boundary                                 | Direction                         | Contract                                                  |
| ---------------------------------------- | --------------------------------- | --------------------------------------------------------- |
| `map-config.schema.ts` → `projection.ts` | Schema provides typed config      | `MapConfig` union type, `configVersion` discriminant      |
| `projection.ts` → `svg-projection.ts`    | Init calls projection for v2      | `projectToSvg(lat, lon, params): { x, y }`                |
| `projection.ts` → `map-svg.ts`           | Marker positions via existing API | `getMarkerPosition(officeCode): { x, y }` — **unchanged** |
| `migration-script` → `config/*.json`     | Script reads v1, writes v2        | File I/O, Zod validation both directions                  |

### Quickstart

_Defined in [quickstart.md](./quickstart.md)._

Covers: creating a v2 config from scratch, migrating an existing v1 config, verifying projection accuracy, adding svgOverride for specific offices.
