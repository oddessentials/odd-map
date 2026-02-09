# Tasks: Runtime Lat/Lon Projection

**Input**: Design documents from `/specs/014-runtime-lat-lon-projection/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Included per SC-007 (>=95% coverage of new projection module and v2 schema path) and Constitution Principle III (Enterprise Testing Standards).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup

**Purpose**: Dependency management and dead code removal

- [ ] T001 Move `d3-geo` from `devDependencies` to `dependencies` in `package.json` (keep `@types/d3-geo` in devDependencies)
- [ ] T002 Remove dead `latLonTo3D()` function and its unused `SVG_WIDTH`/`SVG_HEIGHT` dependency from `src/lib/projection.ts` (lines 195-215). Remove the `MAP_DIMENSIONS` export if only used by `latLonTo3D`. Verify `npm run typecheck` passes after removal.
- [ ] T003 Remove deprecated `latLonToSvg()` stub from `src/lib/projection.ts` (lines 187-189). This function throws unconditionally and will be replaced by the new `svg-projection.ts` module.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: V2 schema and projection module that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

### Schema (FR-002, FR-003, FR-009)

- [ ] T004 Add `ProjectionParamsSchema`, `SvgOverrideSchema`, and `OfficeCoordinateV2Schema` Zod schemas to `src/lib/map-config.schema.ts`. Export `ProjectionParams` and `SvgOverride` types. See `contracts/schema-v2.md` and `data-model.md` for exact field definitions.
- [ ] T005 Rename existing `MapConfigSchema` to `MapConfigV1Schema` and `OfficeCoordinateSchema` to `OfficeCoordinateV1Schema` in `src/lib/map-config.schema.ts`. Add `MapConfigV2Schema` with `configVersion: z.literal(2)`, required `projection`, and v2 coordinates. Create `MapConfigSchema` as `z.discriminatedUnion("configVersion", [MapConfigV1Schema, MapConfigV2Schema])`. Export `MapConfigV1`, `MapConfigV2`, and `MapConfig` types.
- [ ] T006 Fix all TypeScript compilation errors caused by the `MapConfig` union type change. Update `src/lib/projection.ts` to narrow on `configVersion` before accessing `svgX`/`svgY` (v1 path). Run `npm run typecheck` to verify zero errors.

### Schema Tests

- [ ] T007 [P] Create `tests/schema-v2.test.ts` with tests for: valid v1 config parsing (all 4 existing configs), valid v2 config parsing, v2 with svgOverride, v2 missing projection (ZodError), unknown configVersion (ZodError), v2 with extra svgX/svgY fields stripped, type narrowing on configVersion discriminant. See `contracts/schema-v2.md` test contract.

### Projection Module (FR-001, FR-008)

- [ ] T008 [P] Create `src/lib/svg-projection.ts` with `ProjectionError` class, `projectToSvg(lat, lon, params)` async function that lazy-loads `d3-geo` via dynamic import, creates `geoAlbersUsa().scale(params.scale).translate(params.translate)`, projects `[lon, lat]`, throws `ProjectionError` if result is null (EC-01). Cache the imported `geoAlbersUsa` constructor (not the configured instance). See `contracts/projection-module.md`.
- [ ] T009 Add `projectAllToSvg(coordinates, params)` batch function to `src/lib/svg-projection.ts` that iterates coordinates, applies `svgOverride` where present, calls `projectToSvg()` for the rest, returns `Map<string, { x, y }>` keyed by normalized officeCode.

### Projection Module Tests

- [ ] T010 [P] Create `tests/svg-projection.test.ts` with golden reference tests using USG coordinates from research.md (all 13 offices must project within 0.5px of stored values). Include tests for: null projection (Guam coordinates — throws ProjectionError), Alaska inset, Hawaii inset, batch projection with svgOverride bypass, function purity (no side effects). See `contracts/projection-module.md` test contract.

**Checkpoint**: Foundation ready — v2 schema parses correctly, projection module works in isolation, all existing tests still pass (`npm test`)

---

## Phase 3: User Story 1 — Runtime Coordinate Projection (Priority: P1) MVP

**Goal**: v2 configs with lat/lon compute SVG marker positions at runtime without svgX/svgY

**Independent Test**: Create a v2 config with only lat/lon coordinates (no svgX/svgY), load the app, verify markers render correctly in SVG mode within 0.5px of expected positions

### Implementation

- [ ] T011 [US1] Update `initProjection()` in `src/lib/projection.ts` to detect `configVersion === 2` after Zod parsing. For v2 configs: call `projectAllToSvg(config.coordinates, config.projection)` to build `coordMap`. For v1 configs: preserve existing behavior (build coordMap from `svgX`/`svgY`). The `getMarkerPosition()` function must remain unchanged — it reads from `coordMap` regardless of version. Preserve the `initializationPromises` caching behavior (EC-02).

### Tests

- [ ] T012 [P] [US1] Add tests to `tests/projection.test.ts` (re-enable/extend existing file) for: v2 config initialization via `initProjection()`, verify `getMarkerPosition()` returns projected coordinates for v2 configs, verify v2 coordMap entries match expected projection output within 0.5px (FR-006), verify zero-office v2 config is handled gracefully (EC-04).

**Checkpoint**: A v2 config with lat/lon + projection params can be loaded and markers render correctly in SVG mode. `getMarkerPosition()` works identically for v1 and v2 configs.

---

## Phase 4: User Story 2 — Backwards-Compatible Config Loading (Priority: P1)

**Goal**: Both v1 and v2 configs load and render correctly, including runtime switching between them

**Independent Test**: Load the app with each existing v1 config (usg, oddessentials, acme, demo) and verify all markers render in their current positions — zero visual regression

### Implementation

- [ ] T013 [US2] Verify `switchClient()` in `src/lib/projection.ts` works correctly when switching between v1 and v2 clients at runtime (EC-03). The function already switches `currentClientId` and updates `SVG_WIDTH`/`SVG_HEIGHT` — verify this works regardless of config version since `coordMap` entries are `{x, y}` in both cases. Add a guard if needed.

### Tests

- [ ] T014 [P] [US2] Add tests to `tests/client-isolation.test.ts` for: loading a v1 config followed by a v2 config, switching between v1 and v2 clients via `switchClient()`, verify `getMarkerPosition()` returns correct coordinates after switching, verify the `initializationPromises` cache handles mixed v1/v2 init calls (EC-02).
- [ ] T015 [P] [US2] Add regression test to `tests/coordinate-storage.test.ts` that loads all 4 existing v1 configs (usg, oddessentials, acme, demo) and verifies every stored coordinate is retrievable via `getMarkerPosition()` — ensures zero breakage from the discriminated union change.

**Checkpoint**: All 4 existing v1 configs still work exactly as before. A v2 config can be loaded alongside v1 configs. Switching between config versions at runtime works.

---

## Phase 5: User Story 3 — Config Migration Script (Priority: P1)

**Goal**: CLI script converts v1 configs to v2, verifying accuracy and preserving svgPathId

**Independent Test**: Run the migration script on each of the 4 existing v1 configs, verify the output passes v2 schema validation and produces correct marker positions

### Implementation

- [ ] T016 [US3] Create `scripts/migrate-to-v2.ts` with CLI argument parsing (`--verify`, `--apply`, `--output`, `--override-threshold`). Implement the calibrated config path: read v1 config, validate against `MapConfigV1Schema`, extract projection params, project each coordinate, compare to stored svgX/svgY, detect stale calibration (EC-05) if delta >1px, emit v2 config with `configVersion: 2` and svgX/svgY removed. Print diff report per `contracts/migration-script.md` format.
- [ ] T017 [US3] Add hand-placed config path to `scripts/migrate-to-v2.ts`: when no `projection` field exists and `--infer-projection` is NOT set, use default params (`scale: 1276, translate: [479, 299]`) and tag ALL offices with `svgOverride` preserving their original svgX/svgY values. Print warning that all offices use overrides.
- [ ] T018 [US3] Add svgPathId validation to `scripts/migrate-to-v2.ts`: after migration, check each region's `svgPathId` against the SVG file (`src/assets/usa-regions.svg`). Print warning (not error) for any svgPathId that doesn't match an element ID in the SVG (FR-010). This is informational only — the migration still succeeds.
- [ ] T019 [US3] Add `migrate:verify` and `migrate:apply` npm scripts to `package.json` for convenience: `"migrate:verify": "npx tsx scripts/migrate-to-v2.ts"` and `"migrate:apply": "npx tsx scripts/migrate-to-v2.ts --apply"`.

### Tests

- [ ] T020 [P] [US3] Create `tests/migration.test.ts` with tests for: migrate USG config (calibrated — no svgOverride, all deltas <=0.5px), migrate oddessentials config (stale calibration detected — EC-05 warning, svgOverride applied), migrate acme config without `--infer-projection` (all offices get svgOverride), verify mode (no file written), round-trip validation (migrated output parses with `MapConfigV2Schema`), svgPathId preservation (regions unchanged), exit codes (0 for success, 2 for calibration warning).

**Checkpoint**: All 4 configs migrate successfully. USG gets clean v2 (no overrides). Oddessentials, acme, demo get svgOverride for all offices. All migrated configs pass v2 schema validation.

---

## Phase 6: User Story 4 — Manual Coordinate Override (Priority: P2)

**Goal**: `svgOverride` in v2 configs bypasses runtime projection for specific offices

**Independent Test**: Create a v2 config where one office has `svgOverride: { x: 465, y: 140 }` and verify that office uses the override while others use runtime projection

### Implementation

- [ ] T021 [US4] Verify `svgOverride` handling is already correct in the `projectAllToSvg()` batch function (T009) and `initProjection()` v2 path (T011). Create a v2 test fixture config in `tests/fixtures/` with mixed offices (some with svgOverride, some without) and verify the override position is used for tagged offices while projection is used for others.

### Tests

- [ ] T022 [P] [US4] Add tests to `tests/svg-projection.test.ts` for: v2 config with mixed svgOverride and projected offices, verify override coordinates are used exactly (not re-projected), verify projected coordinates for non-override offices, verify empty svgOverride object is treated as invalid (Zod validation).

**Checkpoint**: svgOverride bypass works correctly. Mixed configs (some overrides, some projected) produce correct coordMap entries.

---

## Phase 7: User Story 5 — Projection Parameter Inference (Priority: P2)

**Goal**: Migration script computes best-fit projection params for hand-placed configs via least-squares fitting

**Independent Test**: Run the migration script on the acme v1 config with `--infer-projection`, add a new office with only lat/lon to the v2 output, verify the projected position is reasonable

### Implementation

- [ ] T023 [US5] Add `--infer-projection` flag handling to `scripts/migrate-to-v2.ts`. Implement least-squares fitting: coarse search over scale (1200-1400, step 1), translateX (450-510, step 1), translateY (270-330, step 1), then refine ±5 at step 0.1. Objective: minimize sum of squared errors between projected and stored svgX/svgY. Report per-office residual error. Tag offices with residual >threshold as `svgOverride`. Embed inferred params in v2 config. See `contracts/migration-script.md` for algorithm details.

### Tests

- [ ] T024 [P] [US5] Add tests to `tests/migration.test.ts` for: `--infer-projection` on acme config (infer params, report residuals, tag high-drift offices), `--infer-projection` on demo config, verify inferred params produce reasonable projections for new coordinates not in the original config, verify `--override-threshold` flag adjusts the svgOverride cutoff.

**Checkpoint**: Hand-placed configs get inferred projection params. Offices with high residual error get svgOverride. New offices added to the v2 config with only lat/lon get reasonable projected positions.

---

## Phase 8: Config Migration & Validation

**Purpose**: Migrate all 4 configs and verify the full system works end-to-end

- [ ] T025 Run `scripts/migrate-to-v2.ts` on `config/usg-map-config.json` with `--apply`. Verify the output is a valid v2 config with no svgOverride entries and all coordinates projecting within 0.5px of original svgX/svgY values.
- [ ] T026 Run `scripts/migrate-to-v2.ts` on `config/oddessentials-map-config.json` with `--apply`. Verify the output detects stale calibration (EC-05) and applies svgOverride for all 5 offices.
- [ ] T027 [P] Run `scripts/migrate-to-v2.ts` on `config/acme-map-config.json` with `--apply`. Verify all 3 offices get svgOverride.
- [ ] T028 [P] Run `scripts/migrate-to-v2.ts` on `config/demo-map-config.json` with `--apply`. Verify both offices get svgOverride.
- [ ] T029 Run `npm test` after all 4 configs are migrated. All existing tests must pass. All new tests must pass. Verify `npm run typecheck` and `npm run lint` also pass.
- [ ] T030 Run `npm run verify:all-clients` after migration to confirm all config validation scripts still pass with v2 configs.

**Checkpoint**: All 4 configs are v2. The entire test suite passes. No visual regression in any rendering mode.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Bundle size verification, cleanup, and SC-003 compliance

- [ ] T031 Run `npm run build` and measure the d3-geo lazy-loaded chunk size. Verify it is <=20KB gzipped (SC-002). If over budget, investigate tree-shaking — ensure only `geoAlbersUsa` is imported, not the full d3-geo package.
- [ ] T032 Verify SC-003: confirm zero diff on `src/components/map-3d.js`, `src/lib/map-providers/maplibre-provider.ts`, and `src/lib/map-providers/apple-provider.ts` by running `git diff main -- src/components/map-3d.js src/lib/map-providers/`.
- [ ] T033 Run `npm run test:coverage` and verify >=95% coverage of `src/lib/svg-projection.ts` and the v2 schema parsing path in `src/lib/map-config.schema.ts` (SC-007).
- [ ] T034 Update `scripts/verify-config-files.ts` if needed to handle v2 configs in config validation. Verify `npm run verify:config` passes with migrated configs.
- [ ] T035 Clean up any remaining references to the old `OfficeCoordinateSchema` name in test files and scripts. Ensure all imports reference the renamed `OfficeCoordinateV1Schema` or the union `MapConfigSchema`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001 for d3-geo, T002-T003 for clean projection.ts)
- **US1 (Phase 3)**: Depends on Foundational (T004-T010 complete)
- **US2 (Phase 4)**: Depends on Foundational (T004-T010 complete). Can run in parallel with US1.
- **US3 (Phase 5)**: Depends on Foundational (T004-T010 complete). Can run in parallel with US1/US2.
- **US4 (Phase 6)**: Depends on US1 (T011 — svgOverride wired into initProjection)
- **US5 (Phase 7)**: Depends on US3 (T016-T017 — migration script base exists)
- **Migration (Phase 8)**: Depends on US1, US3, US4, US5 (all implementation complete)
- **Polish (Phase 9)**: Depends on Migration (Phase 8)

### User Story Dependencies

- **US1 (Runtime Projection)**: After Foundational — no story dependencies
- **US2 (Backwards Compat)**: After Foundational — no story dependencies. Can run in parallel with US1.
- **US3 (Migration Script)**: After Foundational — no story dependencies. Can run in parallel with US1/US2.
- **US4 (svgOverride)**: After US1 — depends on v2 initProjection path existing
- **US5 (Inference)**: After US3 — depends on migration script base existing

### Within Each User Story

- Tests can be written before or alongside implementation
- Schema changes before projection changes
- Core implementation before integration testing
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 2 (Foundational)**:

- T007 (schema tests) and T008 (projection module) and T010 (projection tests) can all run in parallel — different files

**Phase 3-5 (P1 stories after Foundational)**:

- US1 (T011-T012), US2 (T013-T015), and US3 (T016-T020) can all start in parallel after Foundational completes

**Phase 6-7 (P2 stories)**:

- US4 (T021-T022) and US5 (T023-T024) can run in parallel IF their dependencies are met

**Phase 8 (Migration)**:

- T027 (acme) and T028 (demo) can run in parallel — independent configs

---

## Parallel Example: Foundational Phase

```text
# These tasks work on different files and can run in parallel:
T007: Schema tests in tests/schema-v2.test.ts
T008: Projection module in src/lib/svg-projection.ts
T010: Projection tests in tests/svg-projection.test.ts
```

## Parallel Example: P1 User Stories

```text
# After Foundational phase completes, all three P1 stories can start:
US1 (T011-T012): Update initProjection() in src/lib/projection.ts
US2 (T013-T015): Verify switchClient() + regression tests
US3 (T016-T020): Create scripts/migrate-to-v2.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T010) — CRITICAL blocker
3. Complete Phase 3: User Story 1 (T011-T012)
4. **STOP and VALIDATE**: Create a test v2 config, load in browser, verify markers render correctly
5. All existing v1 configs must still work

### Incremental Delivery

1. Setup + Foundational → Schema and projection module ready
2. US1 (Runtime Projection) → v2 configs can be loaded → **MVP**
3. US2 (Backwards Compat) → v1/v2 switching verified → Confidence for migration
4. US3 (Migration Script) → Existing configs can be converted → Migration path exists
5. US4 (svgOverride) → Hand-placed configs work → Migration for all clients
6. US5 (Inference) → Best-fit params for hand-placed configs → Future-proofed
7. Migration (Phase 8) → All 4 configs converted → Feature complete
8. Polish (Phase 9) → Bundle size, coverage, cleanup → Ship-ready

### Parallel Team Strategy

With 2-3 developers after Foundational completes:

- **Developer A**: US1 (runtime projection) → US4 (svgOverride)
- **Developer B**: US3 (migration script) → US5 (inference)
- **Developer C**: US2 (backwards compat) → Phase 8 (migration execution)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- SC-003 (zero diff on 3D/tile files) is verified in Polish phase, not during implementation
- Research found oddessentials has stale calibration (EC-05) — migration script must handle this
- Only USG is truly calibrated; all other configs need svgOverride during migration
- Constitution violations (Principles I and II) are justified in plan.md Complexity Tracking table
