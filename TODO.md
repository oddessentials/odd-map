# odd-map — Backlog

**Last reviewed:** 2026-02-08

---

## SVG Coordinate Coupling (First-Class Concern)

The odd-logistics research team uncovered a structural problem in odd-map's architecture that blocks external tooling and complicates the client onboarding pipeline. This must be addressed as a first-class concern.

### The Problem

odd-map does not use lat/lon coordinates for rendering. It uses pre-computed SVG pixel coordinates (`svgX`/`svgY`) that are tightly coupled to:

1. **A specific SVG file** (`usa-regions.svg`) with a fixed `viewBox` of 960x600
2. **A calibrated D3 `geoAlbersUsa` projection** with brute-force-fitted parameters (`scale: 1276, translate: [479, 299]`)
3. **A SHA-256 hash** (`mapAssetHash`) of the SVG file baked into every map config
4. **SVG path element IDs** (`svgPathId: "region-{clientId}-{regionId}"`) referencing specific `<path>` elements inside the SVG

The `latLonToSvg()` function in `src/lib/projection.ts` is deprecated and throws an error. The only way to produce valid `svgX`/`svgY` values is to run `scripts/recapture-coordinates.ts`, which performs a brute-force grid search over D3 projection parameters against the SVG's path bounding boxes. This process cannot run outside the odd-map repo because it requires the SVG asset and the D3-geo calibration pipeline.

### Why This Matters

- **No external tool can generate a valid map config.** The companion app (odd-logistics) cannot produce `*-map-config.json` files because it has no access to the SVG asset or the projection calibration pipeline. It is limited to generating `*-client.json` only.
- **Client onboarding requires running scripts inside the repo.** Every new client needs someone to run the coordinate projection scripts manually — there is no self-service path.
- **The SVG-to-pixel pipeline is fragile.** Any change to the SVG file (new regions, resized viewBox, redrawn paths) invalidates all existing `svgX`/`svgY` coordinates and requires recalibration of every client's map config.
- **Two config files with cross-references.** The client config and map config share `officeCode` and region names but live in separate files with no compile-time contract. A typo in one breaks the other at runtime.

### Resolution Path

Eliminate the SVG pixel coordinate system in favor of runtime lat/lon projection.

#### Option A: Runtime Projection (Recommended)

Replace pre-computed `svgX`/`svgY` with runtime projection from lat/lon to screen coordinates. The map config would store only lat/lon per office. The rendering layer (Three.js globe, MapLibre flat map, or SVG overlay) would project lat/lon to pixel positions at render time.

**Impact:**

- `svgX`/`svgY` fields removed from map config schema
- `mapAssetHash` no longer needed (no integrity check against a specific SVG)
- `svgPathId` replaced by region boundary data (GeoJSON polygons or similar)
- `scripts/recapture-coordinates.ts` and `scripts/analyze-svg-projection.ts` retired
- External tools (odd-logistics) can generate complete configs with just lat/lon
- Client onboarding becomes self-service

**Files affected:**

- `src/lib/map-config.schema.ts` — remove `svgX`/`svgY` from `OfficeCoordinateSchema`, remove `mapAssetHash`
- `src/lib/projection.ts` — implement runtime lat/lon-to-pixel projection (un-deprecate and fix `latLonToSvg`)
- `src/map-3d.js` — update marker placement to use runtime projection instead of pre-computed SVG coords
- `scripts/recapture-coordinates.ts` — retire or convert to a migration script
- `scripts/analyze-svg-projection.ts` — retire
- `config/*-map-config.json` — migrate all existing configs (remove svgX/svgY, keep lat/lon)
- `tests/` — update schema tests, add projection accuracy tests

#### Option B: Embedded Projection Library

Bundle `d3-geo` in odd-logistics and replicate the calibration pipeline client-side. Users would upload the SVG file, odd-logistics would hash it, calibrate the projection, and compute `svgX`/`svgY`.

**Downsides:** Shifts complexity to the companion app instead of fixing the root cause. The SVG coupling remains. Not recommended.

#### Option C: CLI Bridge

Build a CLI tool that takes a client config (with lat/lon) and produces the map config by running the existing projection scripts. Ships as a separate npm package or script.

**Downsides:** Still requires the SVG asset and D3 calibration. Doesn't fix the fragility. Acceptable as a short-term bridge while Option A is implemented.

### Recommended Sequence

1. **Now:** Ship odd-logistics MVP generating client config only (lat/lon coordinates included)
2. **Next:** Implement Option A in odd-map — runtime projection, eliminate svgX/svgY
3. **Then:** Update odd-logistics to generate complete configs (both client + map config)

---

## Production Readiness

### 1. Client Onboarding Guide

Create a dedicated `docs/CLIENT_ONBOARDING.md` covering the full end-to-end workflow for adding a new client: SVG region prep, config file structure, coordinate capture, theme customisation, verification checklist, and deployment steps. The README covers the basics — this would be the comprehensive reference for implementation teams.

**Note:** This guide will need a major revision once the SVG coordinate coupling (above) is resolved. Consider deferring until runtime projection is in place.

**Files:** `docs/CLIENT_ONBOARDING.md` (new)

### 2. Schema Migration Strategy

The config loader already validates `schemaVersion` and rejects unsupported versions (`client-config.ts`). Document the formal migration path: version bump process, migration function pattern, backwards-compatibility policy, and rollback procedure. Create `docs/SCHEMA_MIGRATION.md`.

**Note:** The runtime projection change (above) will be a schema version bump (`schemaVersion: 2`). This migration strategy should be in place before that work begins.

**Files:** `docs/SCHEMA_MIGRATION.md` (new)

### 3. Error Monitoring Integration

Add structured error tracking hooks for production observability. The app already renders inline error UI for all config failure modes (`app.ts`) — this item is about adding integration points (Sentry, Datadog, or similar) for `initProjection()` failures, config validation errors, and map provider load failures.

**Files:** `src/lib/error-tracking.ts` (new), integration in `src/app.ts`

---

## Quality Assurance

### 4. E2E Testing

Add Playwright tests covering the critical user paths: page load, region click, office drill-down, map mode switching, and client switching via URL parameter. Current coverage is 456 unit tests across 31 suites — E2E would validate the full integration.

**Files:** `e2e/` (new directory), `playwright.config.ts` (new)

### 5. Formal Accessibility Audit

Run axe-core automated scan and perform manual screen reader testing (NVDA/VoiceOver). The app already has ARIA labels, keyboard navigation, focus management, and `prefers-reduced-motion` support. This audit would identify any remaining WCAG 2.1 AA gaps and document compliance status.

### 6. Performance Benchmarking

Benchmark with a synthetic large-client config (100+ offices across 10+ regions) to establish baseline metrics for initial load, map mode switching, and region drill-down. Useful for setting SLA targets and identifying bottlenecks before scaling to larger clients.
