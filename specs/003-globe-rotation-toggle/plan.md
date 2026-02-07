# Implementation Plan: Globe Rotation Toggle

**Branch**: `003-globe-rotation-toggle` | **Date**: 2026-02-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-globe-rotation-toggle/spec.md`

## Summary

Disable the 3D globe's default auto-rotation behavior and add a spin toggle button that allows users to start/stop rotation on demand. This involves changing the `autoRotate` initialization from `true` to `false`, adding a spin button to the UI that mirrors the existing 2D/3D toggle pattern, and wiring the button click to toggle the `autoRotate` property.

## Technical Context

**Language/Version**: TypeScript 5.x (ES2022 target), JavaScript (map-3d.js)
**Primary Dependencies**: Three.js (3D rendering), Vite (bundler), Vitest (testing)
**Storage**: N/A (UI state only, no persistence)
**Testing**: Vitest
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Web application (single frontend project)
**Performance Goals**: 60 fps rendering (maintain existing performance)
**Constraints**: No runtime API calls, static delivery
**Scale/Scope**: Single button addition, minimal code changes

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status  | Notes                                          |
| ------------------------------------ | ------- | ---------------------------------------------- |
| I. Deterministic Data Pipeline       | ✅ PASS | No data changes - UI state only                |
| II. Build-Time Coordinate Resolution | ✅ PASS | No coordinate changes                          |
| III. Enterprise Testing Standards    | ✅ PASS | Will add tests for toggle behavior             |
| IV. Performance Budgets              | ✅ PASS | No new draw calls, same animation loop         |
| V. Accessibility First               | ✅ PASS | Button will have ARIA labels, keyboard support |
| VI. Zero Runtime Backend             | ✅ PASS | No API calls                                   |

**Invariants Check:**

- Shared Application State: Button state is local to 3D view, not shared (acceptable)
- Modal Accessibility: Not applicable (no modals)
- No Post-Processing Effects: Not applicable

All gates pass. No complexity tracking required.

## Project Structure

### Documentation (this feature)

```text
specs/003-globe-rotation-toggle/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (minimal)
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output (N/A - no API)
```

### Source Code (repository root)

```text
src/
├── index.html           # Add spin toggle button markup
├── app.ts               # Add spin button handler, visibility logic
├── components/
│   ├── map-3d.js        # Change autoRotate default, add toggleAutoRotate method
│   └── map-3d.d.ts      # Add type declaration for toggleAutoRotate
└── styles/
    └── app.css          # Add spin button styles

tests/
├── spin-toggle.test.ts  # New: Unit tests for spin toggle behavior
└── toggle-guard.test.ts # Existing: May need minor updates
```

**Structure Decision**: Single frontend project structure. No backend changes needed. Feature is purely UI/client-side.
