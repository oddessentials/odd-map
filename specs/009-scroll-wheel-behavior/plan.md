# Implementation Plan: Scroll-Wheel Behavior Enhancements

**Branch**: `009-scroll-wheel-behavior` | **Date**: 2026-02-06 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/009-scroll-wheel-behavior/spec.md`

## Summary

Add mouse scroll-wheel interactions to both map components: cursor-relative zoom in/out on the 2D SVG map, and horizontal globe rotation (spin left/right) on the 3D globe. Both must suppress default page scrolling when the cursor is over the map and handle rapid input without jitter.

## Technical Context

**Language/Version**: TypeScript 5.7 (ES2022 target), JavaScript (map-3d.js)
**Primary Dependencies**: Three.js 0.182, Vite 7.3.1, Vitest 4.0.17
**Storage**: N/A — UI state only, no persistence
**Testing**: Vitest 4.0.17 (23 existing test files, 74+ tests)
**Target Platform**: Modern desktop browsers (Chrome, Firefox, Edge, Safari)
**Project Type**: Single static web application
**Performance Goals**: 60 fps rendering, <100ms perceived input latency, throttled expensive updates at 250ms
**Constraints**: No runtime backend, static delivery, < 50 draw calls, < 2000 vertices
**Scale/Scope**: Two map components (map-svg.ts, map-3d.js), one app orchestrator (app.ts)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle | Status | Notes |
| --------- | ------ | ----- |
| I. Deterministic Data Pipeline | PASS | No data pipeline changes. Coordinates remain build-time immutable. |
| II. Build-Time Coordinate Resolution | PASS | No coordinate changes. Zoom and rotation operate on existing viewBox/globeGroup. |
| III. Enterprise Testing Standards | PASS | New scroll behavior will have dedicated unit tests. No WebGL context required for rotation math tests. |
| IV. Performance Budgets | PASS | Wheel handler uses passive event patterns. No new draw calls, vertices, or post-processing. Expensive updates remain throttled at 250ms. |
| V. Accessibility First | PASS | Scroll-wheel is an enhancement layer (mouse-only). Existing keyboard navigation and ARIA labels are unaffected. No accessibility regression. |
| VI. Zero Runtime Backend | PASS | No network requests. Pure client-side event handling. |
| Invariant 3 (Raycasting Isolation) | PASS | Scroll-wheel does not interact with raycasting. Globe surface still never triggers selection. |
| Invariant 4 (Single Marker State) | PASS | Marker state update path unchanged. |
| Invariant 8 (No Post-Processing) | PASS | No new rendering effects. |
| Invariant 12 (Performance Budget) | PASS | No new draw calls. Wheel handler is lightweight arithmetic only. |

**Gate Result**: PASS — no violations. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/009-scroll-wheel-behavior/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── map-svg.ts       # MODIFY: Add wheel event listener, cursor-relative zoom logic
│   └── map-3d.js        # MODIFY: Add wheel event listener, scroll-driven Y-axis rotation
├── app.ts               # NO CHANGE: MapComponent interface unchanged
└── styles/
    └── app.css           # POSSIBLY: Ensure `overflow: hidden` on map container during zoom

tests/
├── scroll-zoom-2d.test.ts    # NEW: Unit tests for 2D viewBox zoom math
└── scroll-rotate-3d.test.ts  # NEW: Unit tests for 3D rotation delta math
```

**Structure Decision**: Single project. Changes are localized to two existing component files plus two new test files. No new source directories, no new dependencies, no architectural changes.

## Phase 0: Research Findings

No NEEDS CLARIFICATION items in the Technical Context. All decisions documented in [research.md](research.md).

### Key Design Decisions

**Decision 1: Wheel Event API**
- Use the standard `wheel` event (not deprecated `mousewheel` or `DOMMouseScroll`)
- Normalize `event.deltaY` across browsers (Firefox uses line-based units, others use pixel-based)
- Register with `{ passive: false }` to allow `preventDefault()` for scroll suppression

**Decision 2: 2D Zoom — ViewBox Manipulation**
- Zoom operates directly on the SVG `viewBox` attribute, consistent with existing `animateViewBox()`
- Zoom factor: multiply/divide current viewBox dimensions by a fixed step (e.g., 0.9 per wheel tick for zoom-in)
- Cursor-relative zoom: compute cursor position in SVG coordinate space, then scale viewBox around that point
- Clamp: minimum viewBox = full map (0 0 960 600), maximum zoom = viewBox width ≥ ~60 (approx 16x zoom)
- No animation needed per tick — each wheel event applies an immediate, discrete viewBox change for responsiveness

**Decision 3: 3D Rotation — globeGroup.rotation.y**
- Scroll wheel modifies `globeGroup.rotation.y` directly, same axis as auto-rotation
- Delta: convert normalized wheel delta to radians (e.g., ±0.05 rad per tick)
- Coexists with auto-rotation: both are additive on the same `.rotation.y` property
- No animation frame needed per tick — rotation is applied synchronously and rendered in the next `animate()` frame

**Decision 4: Scroll Prevention**
- Call `event.preventDefault()` inside the wheel handler when cursor is over the map
- The `{ passive: false }` option is required for `preventDefault()` to work in modern browsers
- Handler is registered on the map container element, not the window

**Decision 5: Interaction with Existing Animations**
- 2D: If an `animateViewBox()` is in progress (region/office zoom), scroll-wheel zoom cancels the animation and applies from the current interpolated viewBox state
- 3D: If `animating` is true (camera lerp in progress), scroll rotation is still applied because it modifies `globeGroup.rotation.y` independently of camera position

## Phase 1: Design

### 2D SVG Scroll-Zoom Design

**New state in `MapSvg`:**
- `private currentViewBox: { x: number; y: number; w: number; h: number }` — tracks current viewBox numerically (avoids repeated string parsing)
- `private animationFrameId: number | null` — tracks active animation for cancellation

**New method: `handleWheel(event: WheelEvent): void`**
1. Call `event.preventDefault()` to suppress page scroll
2. Normalize `event.deltaY` to a direction sign (-1 or +1)
3. Compute zoom factor: `deltaY < 0 ? 0.9 : 1.1` (scroll up = zoom in = shrink viewBox)
4. Get cursor position in SVG coordinates using `svgElement.createSVGPoint()` + `getScreenCTM().inverse()`
5. Scale viewBox dimensions: `newW = currentW * factor`, `newH = currentH * factor`
6. Adjust viewBox origin to keep cursor point stationary: `newX = cursorX - (cursorX - currentX) * factor`, `newY = cursorY - (cursorY - currentY) * factor`
7. Clamp: `newW` between ~60 and 960, `newH` proportionally
8. Cancel any running `animateViewBox` animation
9. Apply new viewBox immediately via `setAttribute('viewBox', ...)`
10. Update `currentViewBox` state

**Integration with existing code:**
- `animateViewBox()` updated to set `currentViewBox` at each frame and on completion
- `animateViewBox()` stores its `requestAnimationFrame` ID for cancellation
- `reset()` restores `currentViewBox` to default `{ x: 0, y: 0, w: 960, h: 600 }`

### 3D Globe Scroll-Rotation Design

**New method in `Map3D`: `handleWheel(event: WheelEvent): void`**
1. Call `event.preventDefault()` to suppress page scroll
2. Normalize `event.deltaY` to a direction sign
3. Compute rotation delta: `sign * SCROLL_ROTATION_STEP` (e.g., 0.05 radians)
4. Apply: `this.globeGroup.rotation.y += delta`
5. No animation frame management needed — the continuous `animate()` loop renders changes

**Integration with existing code:**
- Auto-rotation in `animate()` continues to add `rotationSpeed` per frame — scroll rotation is additive and non-conflicting
- During camera animation (`this.animating === true`), scroll rotation is still applied (rotation and camera position are independent)

### Event Registration & Cleanup

**Both components:**
- Register `wheel` listener on `this.container` during initialization
- Use `{ passive: false }` to enable `preventDefault()`
- Store handler reference for cleanup in `dispose()`
- Remove listener in `dispose()` to prevent memory leaks

### Test Strategy

**`tests/scroll-zoom-2d.test.ts`:**
- Test viewBox zoom-in calculation (cursor at center)
- Test viewBox zoom-in calculation (cursor at edge)
- Test zoom-out calculation
- Test zoom clamping at minimum (full view)
- Test zoom clamping at maximum
- Test cursor-relative positioning (zoom point stays fixed)

**`tests/scroll-rotate-3d.test.ts`:**
- Test rotation delta for scroll-up (negative deltaY → positive rotation)
- Test rotation delta for scroll-down (positive deltaY → negative rotation)
- Test proportional delta (larger deltaY → larger rotation)
- Test rotation coexistence with auto-rotation

All tests are pure math/logic — no DOM or WebGL context required.

## Constitution Re-Check (Post-Design)

| Principle | Status | Notes |
| --------- | ------ | ----- |
| III. Enterprise Testing Standards | PASS | Two new test files covering zoom math and rotation math. Non-WebGL. |
| IV. Performance Budgets | PASS | No new draw calls. Wheel handler is O(1) arithmetic. ViewBox updates are DOM attribute changes (no reflow). Globe rotation is a single property mutation. |
| V. Accessibility First | PASS | Scroll-wheel is progressive enhancement. Keyboard nav unaffected. All existing ARIA labels preserved. |
| All other principles | PASS | Unchanged from initial check. |

**Post-Design Gate Result**: PASS — ready for task generation.
