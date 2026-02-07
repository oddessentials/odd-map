# Implementation Plan: Fix Critical 3D/2D Map Visualization Bugs

**Branch**: `001-fix-map-bugs` | **Date**: 2026-02-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-fix-map-bugs/spec.md`

## Summary

Fix three critical visualization bugs affecting the map component:

1. **Race condition bug**: Pins disappear on 3D→2D transition because `selectRegion()` is called before markers exist
2. **Texture offset bug**: 3D pins appear in the ocean due to `TEXTURE_LONGITUDE_OFFSET_DEG=0` when texture is Pacific-centered
3. **Flickering bug**: 3D pins flicker during rotation due to backface culling with no hysteresis buffer

All fixes are isolated to existing files with minimal code changes and no architectural impact.

## Technical Context

**Language/Version**: TypeScript 5.x (ES2022 target), JavaScript (map-3d.js)
**Primary Dependencies**: Three.js (3D rendering), Vite (bundler), Vitest (testing)
**Storage**: N/A (static site, build-time data)
**Testing**: Vitest with existing view-switching and projection tests
**Target Platform**: Web browsers (static site deployment)
**Project Type**: Single web application (frontend only)
**Performance Goals**: 60 fps rendering, 250ms throttle on expensive updates (per constitution)
**Constraints**: Zero runtime backend, offline-capable, no API calls
**Scale/Scope**: ~100 office markers, 6 regions

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status  | Notes                                                              |
| ------------------------------------ | ------- | ------------------------------------------------------------------ |
| I. Deterministic Data Pipeline       | ✅ PASS | No changes to data pipeline                                        |
| II. Build-Time Coordinate Resolution | ✅ PASS | Texture offset is build-time config; no runtime coordinate changes |
| III. Enterprise Testing Standards    | ✅ PASS | Will add tests for all three fixes using existing test patterns    |
| IV. Performance Budgets              | ✅ PASS | Hysteresis reduces computation; no new draw calls                  |
| V. Accessibility First               | ✅ PASS | No accessibility changes                                           |
| VI. Zero Runtime Backend             | ✅ PASS | No API calls added                                                 |

**Invariants Affected:**

- Invariant #4 (Single Marker State Update Function): Hysteresis added within existing `updateExpensiveMarkerStates()`
- Invariant #5 (Shared Application State): Race condition fix ensures state properly propagates

**Verdict**: All gates pass. No violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/001-fix-map-bugs/
├── plan.md              # This file
├── research.md          # Phase 0 output (bug analysis)
├── data-model.md        # Phase 1 output (state model)
├── quickstart.md        # Phase 1 output (testing guide)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (files to modify)

```text
src/components/
├── map-svg.ts            # Fix: Add markersReady signal + pending selection queue
└── map-3d.js             # Fix: Texture offset + hysteresis

tests/
├── view-switching.test.ts    # Add: Race condition regression tests (MapSvg queuing)
├── projection-3d.test.ts     # Add: Texture offset verification
└── scene-graph-parenting.test.ts  # Add: Hysteresis behavior tests
```

**Note**: `app.ts` does not require changes - the queuing pattern handles timing internally within MapSvg.

**Structure Decision**: Single frontend application. All changes are bug fixes within existing component files - no new modules or architectural changes needed.

## Complexity Tracking

> No violations - table not needed.

## Implementation Approach

### Bug #1: Race Condition (3D→2D Pin Disappearance)

**Root Cause**: `toggleMapMode()` calls `map.selectRegion()` immediately after creating MapSvg, but `MapSvg.init()` is async and markers may not exist yet.

**Fix Strategy**:

1. Add `markersReady` boolean flag to MapSvg (false until `addMarkers()` completes)
2. Add `pendingRegionSelection` string to queue selections arriving before markers exist
3. Update `selectRegion()` to check flag and queue if markers not ready
4. Update `addMarkers()` to set flag and process any pending selection

**Recommended Approach**: Queuing pattern - handles timing internally within MapSvg, no changes to app.ts needed

### Bug #2: Texture Offset (Pins in Ocean)

**Root Cause**: `TEXTURE_LONGITUDE_OFFSET_DEG = 0` but earth texture is Pacific-centered (180° offset needed)

**Fix Strategy**:

1. Change constant from `0` to `180` in `map-3d.js:60`
2. Verify with known coordinates (Irvine CA, Boston MA)
3. Add unit test to prevent regression

**Recommended Approach**: Single-line constant change + calibration test

### Bug #3: Flickering (Backface Culling)

**Root Cause**: Single threshold `dotProduct < 0.2` causes rapid toggling near visibility edge

**Fix Strategy**:

1. Implement hysteresis with separate show/hide thresholds
2. Hide threshold: 0.25 (more restrictive)
3. Show threshold: 0.15 (more permissive)
4. Buffer zone of 0.1 prevents rapid state changes

**Recommended Approach**: Add state-aware threshold logic in `updateExpensiveMarkerStates()`

## Testing Strategy

| Bug            | Test Type   | Test Location                   | Verification                                         |
| -------------- | ----------- | ------------------------------- | ---------------------------------------------------- |
| Race condition | Integration | `view-switching.test.ts`        | Mock timing, verify markers visible after toggle     |
| Texture offset | Unit        | `projection-3d.test.ts`         | Assert known coords produce expected globe positions |
| Flickering     | Unit        | `scene-graph-parenting.test.ts` | Verify hysteresis prevents rapid visibility changes  |

All tests follow existing patterns and require no WebGL context (per Constitution III).
