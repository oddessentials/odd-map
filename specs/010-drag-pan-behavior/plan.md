# Implementation Plan: Drag/Touch Pan Behavior for 2D Zoom and 3D Globe Rotation

**Branch**: `010-drag-pan-behavior` | **Date**: 2026-02-06 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/010-drag-pan-behavior/spec.md`

## Summary

Add click-and-drag (desktop) and touch-and-drag (mobile) interactions to both map components: vertical drag zooms in/out on the 2D SVG map centered on the initial press point, and horizontal drag rotates the 3D globe left/right. Both must coexist with existing scroll-wheel behaviors (feature 009), distinguish short clicks from drag gestures, and support touch devices.

## Technical Context

**Language/Version**: TypeScript 5.7 (ES2022 target), JavaScript (map-3d.js)
**Primary Dependencies**: Three.js 0.182, Vite 7.3.1, Vitest 4.0.17
**Storage**: N/A — UI state only, no persistence
**Testing**: Vitest 4.0.17 (24 existing test files, 341 tests)
**Target Platform**: Modern desktop + mobile browsers (Chrome, Firefox, Edge, Safari on desktop and mobile)
**Project Type**: Single static web application
**Performance Goals**: 60 fps rendering, <50ms perceived input latency for drag, throttled expensive updates at 250ms
**Constraints**: No runtime backend, static delivery, < 50 draw calls, < 2000 vertices
**Scale/Scope**: Two map components (map-svg.ts, map-3d.js), one app orchestrator (app.ts)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status | Notes                                                                                                                                                 |
| ------------------------------------ | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Deterministic Data Pipeline       | PASS   | No data pipeline changes. Coordinates remain build-time immutable.                                                                                    |
| II. Build-Time Coordinate Resolution | PASS   | No coordinate changes. Zoom and rotation operate on existing viewBox/globeGroup.                                                                      |
| III. Enterprise Testing Standards    | PASS   | New drag behavior will have dedicated unit tests. Pure math functions testable without DOM/WebGL.                                                     |
| IV. Performance Budgets              | PASS   | Pointer handlers use O(1) arithmetic. No new draw calls, vertices, or post-processing. Expensive updates remain throttled at 250ms.                   |
| V. Accessibility First               | PASS   | Drag is a progressive enhancement layer. Existing keyboard navigation and ARIA labels are unaffected. Click-to-select preserved via drag threshold.   |
| VI. Zero Runtime Backend             | PASS   | No network requests. Pure client-side event handling.                                                                                                 |
| Invariant 3 (Raycasting Isolation)   | PASS   | Drag does not interact with raycasting. Globe surface still never triggers selection. Drag gesture suppresses click-based selection beyond threshold. |
| Invariant 4 (Single Marker State)    | PASS   | Marker state update path unchanged.                                                                                                                   |
| Invariant 8 (No Post-Processing)     | PASS   | No new rendering effects.                                                                                                                             |
| Invariant 9 (Region-First)           | PASS   | Short clicks still trigger region selection. Drag threshold preserves existing click behavior.                                                        |
| Invariant 12 (Performance Budget)    | PASS   | No new draw calls. Pointer handlers are lightweight arithmetic only.                                                                                  |

**Gate Result**: PASS — no violations. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/010-drag-pan-behavior/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── map-svg.ts       # MODIFY: Add pointer event listeners, drag-to-zoom logic, click/drag discrimination
│   └── map-3d.js        # MODIFY: Add pointer event listeners, drag-to-rotate logic, auto-rotation pause/resume
├── app.ts               # NO CHANGE: MapComponent interface unchanged
└── styles/
    └── app.css           # POSSIBLY: cursor style during drag (grab/grabbing)

tests/
├── drag-zoom-2d.test.ts      # NEW: Unit tests for 2D drag-zoom math
├── drag-rotate-3d.test.ts    # NEW: Unit tests for 3D drag-rotation math
├── scroll-zoom-2d.test.ts    # NO CHANGE: Existing scroll-wheel tests
└── scroll-rotate-3d.test.ts  # NO CHANGE: Existing scroll-wheel tests
```

**Structure Decision**: Single project. Changes are localized to two existing component files plus two new test files. No new source directories, no new dependencies, no architectural changes.

## Phase 0: Research Findings

No NEEDS CLARIFICATION items in the Technical Context. All decisions documented in [research.md](research.md).

### Key Design Decisions

**Decision 1: Pointer Events API**

- Use the Pointer Events API (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`) — unified API that handles both mouse and touch input
- Check `event.isPrimary` to filter to single-pointer only (ignores multi-touch)
- Check `event.button === 0` on `pointerdown` to filter to primary button only (ignores right-click)
- Register with `{ passive: false }` where `preventDefault()` is needed (to suppress touch scrolling)

**Decision 2: Click vs. Drag Discrimination**

- Track the starting pointer position on `pointerdown`
- On each `pointermove`, compute the Euclidean distance from start
- If distance exceeds a threshold (5 pixels), enter "drag mode" and suppress subsequent click events
- If `pointerup` fires before threshold is reached, allow the normal click handler to fire
- The 5px threshold is small enough to not delay intentional drags, but large enough to account for finger/hand tremor

**Decision 3: 2D Drag-Zoom — Vertical Drag Maps to Zoom Factor**

- Drag-zoom reuses the existing `computeZoomedViewBox()` pure function from feature 009
- Each pixel of vertical drag movement computes a cumulative zoom factor applied to the starting viewBox
- Drag up (negative deltaY from start) → zoom in (factor < 1.0); drag down (positive deltaY) → zoom out (factor > 1.0)
- Sensitivity: each pixel of vertical movement corresponds to ~0.5% zoom change (0.005 per pixel), so a 200px drag achieves ~2.7x zoom
- Zoom is centered on the initial pointer press position (SVG coordinates computed once at drag start), matching the cursor-relative pattern from scroll-wheel
- Animation cancellation: cancel any in-progress `animateViewBox()` on drag start

**Decision 4: 3D Drag-Rotation — Horizontal Drag Maps to Rotation Delta**

- Horizontal drag modifies `globeGroup.rotation.y` directly, same axis as scroll-wheel and auto-rotation
- Delta: convert horizontal pixel movement to radians. Sensitivity: ~0.005 rad/pixel, so dragging 300px (roughly globe width) achieves ~1.5 rad (~86°). Full 360° requires ~1257px total cumulative drag, achievable with multiple sweeps or a single fast drag across the viewport
- Auto-rotation pauses on `pointerdown` if enabled, resumes on `pointerup`/`pointercancel`
- During camera animation (`this.animating === true`), drag rotation takes precedence and cancels the animation

**Decision 5: Touch Support**

- Pointer Events API handles touch natively — `pointerdown` fires for touch start, `pointermove` for touch move, `pointerup` for touch end
- `event.isPrimary` ensures only the first finger is tracked (multi-touch ignored per spec)
- `touch-action: none` CSS on map containers prevents browser default touch behaviors (scroll, pinch-zoom) that would conflict with drag handling
- `pointercancel` handles edge cases where the browser cancels the pointer (e.g., system gesture override)

**Decision 6: Pointer Capture**

- Call `element.setPointerCapture(event.pointerId)` on `pointerdown` to ensure `pointermove` and `pointerup` events continue to fire even if the pointer leaves the element boundary
- This handles the edge case of the user dragging fast and overshooting the container bounds
- `releasePointerCapture()` is called automatically on `pointerup`, or explicitly on cleanup
- Alternative: listening on `document` for move/up events (rejected — pointer capture is the modern, cleaner approach)

**Decision 7: Interaction with Existing Scroll-Wheel Behavior**

- Scroll-wheel zoom (2D) and scroll-wheel rotation (3D) from feature 009 remain fully functional
- Both input methods operate on the same state (`currentViewBox` for 2D, `globeGroup.rotation.y` for 3D) and coexist naturally
- If scroll-wheel fires during an active drag, the scroll-wheel effect is applied on top of the drag state (both are additive)

## Phase 1: Design

### 2D SVG Drag-Zoom Design

**New state in `MapSvg`:**

- `private isDragging: boolean` — whether a drag gesture is in progress
- `private dragStartY: number` — screen Y coordinate at drag start
- `private dragStartViewBox: ViewBoxRect` — viewBox snapshot at drag start
- `private dragAnchorSVG: { x: number; y: number }` — cursor position in SVG coordinates at drag start (zoom center)
- `private boundPointerDown: (e: PointerEvent) => void` — bound handler reference
- `private boundPointerMove: (e: PointerEvent) => void` — bound handler reference
- `private boundPointerUp: (e: PointerEvent) => void` — bound handler reference

**New pure function: `computeDragZoomedViewBox(startViewBox, anchorSVG, dragDeltaY): ViewBoxRect`**

This is the core testable function:

1. Compute cumulative zoom factor from drag distance: `factor = Math.pow(1.005, dragDeltaY)` (positive deltaY = drag down = zoom out; the exponent naturally maps drag distance to multiplicative scaling)
2. Apply factor to starting viewBox dimensions: `newW = startViewBox.w * factor`, `newH = startViewBox.h * factor`
3. Keep anchor point stationary: `newX = anchorSVG.x - (anchorSVG.x - startViewBox.x) * (newW / startViewBox.w)`, `newY = anchorSVG.y - (anchorSVG.y - startViewBox.y) * (newH / startViewBox.h)`
4. Clamp: `newW` between MIN_VIEWBOX_WIDTH (60) and MAX_VIEWBOX_WIDTH (960), `newH` proportionally
5. Return new `{ x, y, w, h }`

**Event handlers:**

`handlePointerDown(event: PointerEvent)`:

1. Guard: `if (!event.isPrimary || event.button !== 0) return` — primary pointer, left button only
2. Store `dragStartY = event.clientY`
3. Store `dragStartViewBox = { ...this.currentViewBox }`
4. Compute and store `dragAnchorSVG` (SVG coordinates of press point using `getScreenCTM().inverse()`)
5. Set `isDragging = false` (not yet — waiting for threshold)
6. Call `this.container.setPointerCapture(event.pointerId)`
7. Cancel any in-progress `animateViewBox()` animation

`handlePointerMove(event: PointerEvent)`:

1. Guard: `if (!event.isPrimary || this.dragStartY === null) return`
2. Compute delta: `deltaY = event.clientY - this.dragStartY`
3. If not yet dragging: check `Math.abs(deltaY) > DRAG_THRESHOLD` (5px). If not, return early
4. If threshold crossed: set `isDragging = true`
5. Call `computeDragZoomedViewBox(this.dragStartViewBox, this.dragAnchorSVG, deltaY)`
6. Apply result to SVG viewBox attribute and update `this.currentViewBox`

`handlePointerUp(event: PointerEvent)`:

1. Guard: `if (!event.isPrimary) return`
2. If `isDragging` was true: the gesture was a drag (click handlers are suppressed)
3. Reset drag state: `isDragging = false`, `dragStartY = null`
4. Pointer capture is released automatically

**Click suppression:**

- Add a `click` event listener on the container that calls `event.stopPropagation()` if `isDragging` was true during the preceding pointer sequence
- Use a flag `wasDragging` set in `handlePointerUp` and cleared after the next `click` event fires
- This prevents region/marker click handlers from firing after a drag gesture

### 3D Globe Drag-Rotation Design

**New state in `Map3D`:**

- `isDragging: boolean` — whether a drag gesture is in progress
- `dragStartX: number | null` — screen X coordinate at drag start
- `previousX: number` — last known X for incremental delta computation
- `autoRotateWasEnabled: boolean` — whether auto-rotation was on before drag started
- `_boundPointerDown`, `_boundPointerMove`, `_boundPointerUp`, `_boundPointerCancel` — bound handler references

**New pure function: `computeDragRotationDelta(deltaX): number`**

This is the core testable function:

1. Convert horizontal pixel delta to radians: `return deltaX * DRAG_ROTATION_SENSITIVITY` (e.g., 0.005 rad/pixel)
2. Positive deltaX (drag right) → negative rotation (globe turns right); negative deltaX (drag left) → positive rotation (globe turns left)
3. So: `return -deltaX * DRAG_ROTATION_SENSITIVITY`

**Event handlers:**

`handlePointerDown(event)`:

1. Guard: `if (!event.isPrimary || event.button !== 0) return`
2. Store `dragStartX = event.clientX`, `previousX = event.clientX`
3. Set `isDragging = false`
4. Store `autoRotateWasEnabled = this.autoRotate`
5. Call `this.container.setPointerCapture(event.pointerId)`

`handlePointerMove(event)`:

1. Guard: `if (!event.isPrimary || this.dragStartX === null) return`
2. Compute total delta: `totalDeltaX = event.clientX - this.dragStartX`
3. If not yet dragging: check `Math.abs(totalDeltaX) > DRAG_THRESHOLD`. If not, return early
4. If threshold just crossed: set `isDragging = true`, pause auto-rotation (`this.autoRotate = false`)
5. Compute incremental delta: `incrementalDeltaX = event.clientX - this.previousX`
6. Update `this.previousX = event.clientX`
7. Apply: `this.globeGroup.rotation.y += computeDragRotationDelta(incrementalDeltaX)`

`handlePointerUp(event)`:

1. Guard: `if (!event.isPrimary) return`
2. If `isDragging` was true and `autoRotateWasEnabled` was true: resume auto-rotation (`this.autoRotate = true`)
3. Reset drag state

**Click suppression (same pattern as 2D):**

- The existing `onClick` handler checks `this.hoveredMesh` before firing selection. During a drag, `mousemove` continues to update hover state, but the drag flag can be checked to suppress selection.
- Add guard in `onClick`: `if (this.wasDragging) { this.wasDragging = false; return; }`

### Event Registration & Cleanup

**Both components:**

- Register `pointerdown` on `this.container`
- Register `pointermove` on `this.container` (pointer capture ensures events arrive even when pointer is outside)
- Register `pointerup` and `pointercancel` on `this.container`
- Use `{ passive: false }` on `pointermove` to enable `preventDefault()` for touch scroll suppression
- Store all handler references for cleanup in `dispose()`
- Add CSS `touch-action: none` on map containers to prevent browser default touch gestures

### Cursor Feedback

- On `pointerdown` over a map: set `cursor: grabbing` on the container
- On `pointerup`: restore `cursor: grab` (if hovering over map) or default cursor
- On map container hover (when not dragging): set `cursor: grab` to indicate draggability

### Test Strategy

**`tests/drag-zoom-2d.test.ts`:**

- Test `computeDragZoomedViewBox()` pure function:
  - Drag up (negative deltaY) → zoom in (smaller viewBox)
  - Drag down (positive deltaY) → zoom out (larger viewBox)
  - Anchor point stays stationary (cursor-relative)
  - Zoom clamping at min/max
  - Proportionality: larger drag = more zoom
  - Aspect ratio preservation through drag range
  - Zero drag delta → no viewBox change
  - Edge: anchor at corner vs center of map

**`tests/drag-rotate-3d.test.ts`:**

- Test `computeDragRotationDelta()` pure function:
  - Drag left (negative deltaX) → positive rotation (globe turns left)
  - Drag right (positive deltaX) → negative rotation (globe turns right)
  - Proportionality: larger drag = more rotation
  - Zero delta → zero rotation
  - Full-width drag achieves meaningful rotation
  - Sensitivity constant validation

All tests are pure math/logic — no DOM, Pointer Events, or WebGL context required.

## Constitution Re-Check (Post-Design)

| Principle                         | Status | Notes                                                                                                                                              |
| --------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| III. Enterprise Testing Standards | PASS   | Two new test files covering drag-zoom math and drag-rotation math. Pure functions, non-DOM, non-WebGL.                                             |
| IV. Performance Budgets           | PASS   | No new draw calls. Pointer handlers are O(1) arithmetic. ViewBox updates are DOM attribute changes. Globe rotation is a single property mutation.  |
| V. Accessibility First            | PASS   | Drag is progressive enhancement. Keyboard nav unaffected. All existing ARIA labels preserved. Click-to-select preserved via 5px drag threshold.    |
| Invariant 9 (Region-First)        | PASS   | Short clicks (< 5px movement) still trigger region selection. Drag threshold ensures existing click behavior is preserved with no false positives. |
| All other principles              | PASS   | Unchanged from initial check.                                                                                                                      |

**Post-Design Gate Result**: PASS — ready for task generation.
