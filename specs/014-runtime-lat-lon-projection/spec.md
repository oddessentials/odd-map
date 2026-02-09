# Feature Specification: Runtime Lat/Lon Projection

**Feature Branch**: `014-runtime-lat-lon-projection`
**Created**: 2026-02-08
**Status**: Draft
**Input**: User description: "Plan an enterprise-grade, deterministic solution for the issue outlined in TODO.md to help enable our future project specified in SPEC.md."

## User Scenarios & Testing _(mandatory)_

### User Story 1 — Runtime Coordinate Projection (Priority: P1)

As a developer onboarding a new client, I want the system to compute SVG marker positions from lat/lon at runtime so that I only need to provide office lat/lon coordinates without running the manual SVG coordinate capture pipeline.

**Why this priority**: This is the core deliverable. It eliminates the svgX/svgY dependency that blocks odd-logistics from generating complete configs, and removes the most error-prone step from client onboarding (running calibration scripts).

**Independent Test**: Create a v2 config with only lat/lon coordinates and verify markers render correctly in SVG mode without any svgX/svgY values.

**Acceptance Scenarios**:

1. **Given** a v2 map config with `configVersion: 2`, lat/lon coordinates, and projection parameters, **When** the MapSvg component renders markers, **Then** each marker is positioned using runtime geographic projection and markers appear within 0.5px of their v1 svgX/svgY positions for clients that had calibrated projection parameters.

2. **Given** the 3D globe view is active with a v2 config, **When** the map renders, **Then** marker placement is identical to v1 behavior because the 3D globe already uses lat/lon natively via `latLonToGlobe()`.

3. **Given** a tile map view (MapLibre or Apple MapKit) is active with a v2 config, **When** the map renders, **Then** marker placement is identical to v1 behavior because tile map providers already use lat/lon natively.

---

### User Story 2 — Backwards-Compatible Config Loading (Priority: P1)

As a system operator, I want the app to accept both v1 and v2 map configs so that existing deployments continue to work without any config changes.

**Why this priority**: Breaking existing deployments is unacceptable. This must ship alongside runtime projection to ensure zero-regression.

**Independent Test**: Load the app with each existing v1 config (usg, oddessentials, acme, demo) and verify all markers render in their current positions.

**Acceptance Scenarios**:

1. **Given** a v1 config with `configVersion: 1` and svgX/svgY coordinates, **When** the app loads, **Then** it works exactly as it does today — no visual or behavioral changes.

2. **Given** a v2 config with `configVersion: 2` and lat/lon coordinates, **When** the app loads, **Then** runtime projection is used to compute SVG marker positions.

3. **Given** the app is running with a v1 client, **When** the user switches to a v2 client via URL parameter, **Then** the switch succeeds and markers render correctly under the v2 code path.

---

### User Story 3 — Config Migration Script (Priority: P1)

As a developer, I want a migration script that converts v1 configs to v2 so that I can upgrade existing clients with confidence.

**Why this priority**: Without migration tooling, the v2 schema has no adoption path. The script must validate accuracy to catch drift.

**Independent Test**: Run the migration script on each of the 4 existing v1 configs and verify the output passes v2 schema validation and produces correct marker positions.

**Acceptance Scenarios**:

1. **Given** a v1 config file for a calibrated client (usg, oddessentials) with a `projection` field, **When** I run the migration script, **Then** it produces a v2 config with svgX/svgY removed, projection params preserved, and a diff report showing <=0.5px drift for all offices.

2. **Given** a v1 config file for a hand-placed client (acme, demo) without a `projection` field, **When** I run the migration script, **Then** it computes best-fit projection parameters via least-squares, tags offices with >2px drift as `svgOverride`, and prints a report showing old vs new positions.

3. **Given** a v1 config with a `regions` array containing `svgPathId` references, **When** I run the migration script, **Then** the `svgPathId` fields are preserved (not removed — that is Phase 2 scope), and if any `svgPathId` does not match an element in the SVG, the script prints a warning.

---

### User Story 4 — Manual Coordinate Override (Priority: P2)

As a developer working with a client whose markers were hand-placed, I want to override the runtime projection for specific offices so that hand-tuned positions are preserved exactly.

**Why this priority**: Acme and demo configs have hand-placed coordinates that don't match any projection. Without an override mechanism, migration would shift their markers.

**Independent Test**: Create a v2 config where one office has `svgOverride: { x: 465, y: 140 }` and verify that office uses the override while others use runtime projection.

**Acceptance Scenarios**:

1. **Given** a v2 config where an office has `svgOverride: { x, y }` fields, **When** the MapSvg component renders that marker, **Then** the override position is used instead of the runtime projection result.

2. **Given** a v2 config where an office does NOT have `svgOverride`, **When** the MapSvg component renders that marker, **Then** the position is computed by runtime projection from lat/lon.

---

### User Story 5 — Projection Parameter Inference (Priority: P2)

As a developer migrating hand-placed configs, I want the migration script to compute best-fit projection parameters from existing svgX/svgY + lat/lon pairs so that future offices added to that client can be placed automatically.

**Why this priority**: Without inferred parameters, hand-placed clients remain stuck with manual coordinate entry for every new office.

**Independent Test**: Run the migration script on the acme v1 config, add a new office with only lat/lon to the v2 output, and verify the projected position is reasonable.

**Acceptance Scenarios**:

1. **Given** a v1 config without a `projection` field but with svgX/svgY + lat/lon pairs, **When** I run the migration script with `--infer-projection`, **Then** it performs least-squares fitting to determine optimal scale/translate params, reports max residual error per office, and embeds the inferred params in the v2 config.

2. **Given** inferred projection params where one office has >2px residual error, **When** the migration script generates the v2 config, **Then** that office gets `svgOverride` with its original svgX/svgY values.

---

### Edge Cases

- **EC-01**: Office coordinates outside the continental US (Alaska, Hawaii) — the geographic projection handles these via inset sub-projections. If coordinates are completely outside all insets (e.g., Puerto Rico, Guam), the projection returns `null`. The projection function must throw a descriptive error, not silently produce `NaN`.

- **EC-02**: Two calls to `initProjection()` racing for the same client — the existing `initializationPromises` cache prevents duplicate initialization. The v2 code path must preserve this caching behavior.

- **EC-03**: Switching between a v1 client and a v2 client at runtime — `switchClient()` must work regardless of config version since `getMarkerPosition()` returns `{x, y}` either way.

- **EC-04**: A v2 config with zero offices — `coordMap` is empty, no projection calls, no markers. The app must handle this gracefully (it already does for v1).

- **EC-05**: A v1 config where `projection` field params don't match the svgX/svgY values (stale calibration) — the migration script must detect and warn about this, not silently produce a mismatched v2 config.

- **EC-06**: The SVG asset is replaced with a different map — `mapAssetHash` still validates this. The projection params are tied to a specific SVG viewBox, so changing the SVG requires recalibrating params.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide a `projectToSvg(lat, lon, params)` function in a dedicated projection module that uses `geoAlbersUsa` with configurable scale and translate parameters. The function must be pure (no side effects, no global state). The geographic projection library must be lazy-loaded via dynamic import to avoid penalizing 3D and tile map modes that don't need it.

- **FR-002**: System MUST define a `configVersion: 2` schema variant for map configs. v2 coordinates contain `officeCode`, `lat` (required), `lon` (required), and `svgOverride?: { x: number, y: number }` (optional). v2 config requires `projection: { type: "geoAlbersUsa", scale: number, translate: [number, number] }`. v2 removes `svgX` and `svgY` as required fields from coordinates.

- **FR-003**: System MUST use a discriminated union on `configVersion` to accept both v1 and v2 map configs. Parsing a v1 config must return the existing type with no behavioral change. Parsing a v2 config must trigger the runtime projection code path.

- **FR-004**: System MUST update `initProjection()` to detect v2 configs. For v2: lazy-load the projection library, compute `coordMap` entries by projecting lat/lon through the config's projection params, apply `svgOverride` where present. For v1: behavior unchanged. The `getMarkerPosition()` signature and return type must not change.

- **FR-005**: System MUST provide a migration script that converts v1 map-config files to v2. For configs with a `projection` field, the script must verify each projected coordinate matches the original svgX/svgY within 1px tolerance. For configs without `projection`, the script must perform least-squares fitting and tag offices exceeding 2px drift with `svgOverride`.

- **FR-006**: Runtime-projected coordinates for calibrated clients (those with `projection` params in v1) MUST be within 0.5px of their v1 svgX/svgY values. This must be verified by a unit test using golden reference coordinates from the existing configs.

- **FR-007**: The refactor MUST NOT modify the 3D globe renderer, tile map component, MapLibre provider, or Apple MapKit provider. These components already use lat/lon natively and must remain untouched.

- **FR-008**: The `projectToSvg()` function MUST throw a descriptive error (not return NaN or undefined) when the geographic projection returns `null` for coordinates outside all projection insets.

- **FR-009**: v2 config MUST retain `mapAssetHash`, `viewBox`, `regions` (including `svgPathId`), and `pinAsset` fields unchanged from v1. Only `coordinates[]` and `projection` change structurally. svgPathId decoupling is out of scope for this feature.

- **FR-010**: The migration script MUST warn (not fail) when a config's `svgPathId` values do not match any element IDs in the SVG file.

### Key Entities

- **MapConfig (v2)**: Extends v1 with runtime projection params and optional per-office `svgOverride`. Removes `svgX`/`svgY` as required fields.
- **ProjectionParams**: Projection type, scale, and translate. Tied to the SVG asset's coordinate space.
- **SvgOverride**: Optional per-office `{ x, y }` allowing hand-placed coordinates to bypass runtime projection.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All existing markers render within 0.5px of their current screen positions after migration to v2 configs (for calibrated clients with projection params).
- **SC-002**: The SVG rendering mode adds no more than 20KB gzipped to the application bundle when the projection dependency is loaded.
- **SC-003**: Zero code changes to the 3D globe renderer, MapLibre provider, or Apple MapKit provider (verified by zero diff on those files).
- **SC-004**: All 4 existing client configs (usg, oddessentials, acme, demo) migrate successfully with the migration script (exit code 0, v2 schema validation passes).
- **SC-005**: A new client can be onboarded with only lat/lon coordinates (no svgX/svgY computation step), reducing onboarding from approximately 8 steps to approximately 5 steps.
- **SC-006**: No end-user visible change in any map rendering mode (3D, tile, SVG) after the refactor.
- **SC-007**: Test suite achieves >=95% coverage of the new projection module and the v2 schema parsing path.

### Assumptions

- The existing calibrated projection parameters (`scale: 1276, translate: [479, 299]`) are correct for the current SVG asset and will produce identical results when used at runtime.
- The `geoAlbersUsa` projection is the only projection type needed (no support for non-US maps in Phase 1).
- Hand-placed configs (acme, demo) are acceptable to migrate with `svgOverride` escape hatches rather than achieving exact projection accuracy.
- The SVG asset (`usa-regions.svg`) will not change during this refactor.
- `svgPathId` decoupling, config file merging, and MapSvg deprecation are all deferred to future phases.
