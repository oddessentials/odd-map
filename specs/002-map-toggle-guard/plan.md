# Implementation Plan: Map Toggle Edge Case Guards

**Branch**: `002-map-toggle-guard` | **Date**: 2026-02-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-map-toggle-guard/spec.md`

## Summary

Add guards to prevent race conditions and visual glitches when toggling between 2D/3D map modes. The implementation will:

1. Disable the toggle button during transitions to prevent rapid-click queueing
2. Cancel in-progress camera animations before map disposal
3. Ensure selection state is preserved even when animations are interrupted

## Technical Context

**Language/Version**: TypeScript 5.x (ES2022 target), JavaScript (map-3d.js)
**Primary Dependencies**: Three.js (3D rendering), Vite (bundler)
**Storage**: N/A (no persistence changes)
**Testing**: Vitest (118 existing tests)
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Web application (frontend-only static site)
**Performance Goals**: 60 fps rendering, <2s toggle transition
**Constraints**: No runtime API calls (Zero Runtime Backend principle)
**Scale/Scope**: Single toggle button, single App controller, single Map3D component

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status  | Notes                                  |
| ------------------------------------ | ------- | -------------------------------------- |
| I. Deterministic Data Pipeline       | ✅ N/A  | No data changes                        |
| II. Build-Time Coordinate Resolution | ✅ N/A  | No coordinate changes                  |
| III. Enterprise Testing Standards    | ✅ PASS | Will add tests for toggle guards       |
| IV. Performance Budgets              | ✅ PASS | Animation cancellation improves perf   |
| V. Accessibility First               | ✅ PASS | Button disabled state has ARIA support |
| VI. Zero Runtime Backend             | ✅ PASS | No API calls added                     |

**Architectural Invariants:**

- #5 Shared Application State: Selection preservation maintains this
- #4 Single Marker State Update Function: No changes to marker updates
- Camera animation guard (IV): Enhanced by this feature

**Gate Result: PASS** - No violations, proceed with implementation.

## Project Structure

### Documentation (this feature)

```text
specs/002-map-toggle-guard/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── app.ts               # App controller - toggleMapMode() changes
├── components/
│   ├── map-3d.js        # Map3D - animation cancellation
│   └── map-svg.ts       # MapSvg - no changes needed
└── styles/
    └── main.css         # Toggle button disabled styles

tests/
├── view-switching.test.ts    # Existing - add toggle guard tests
└── toggle-guard.test.ts      # New - dedicated toggle edge case tests
```

**Structure Decision**: Single project structure. Changes limited to App controller (toggle flow) and Map3D component (animation cancellation). CSS updates for visual feedback.

## Complexity Tracking

No violations to justify - implementation aligns with all constitutional principles.
