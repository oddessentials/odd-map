# Implementation Plan: Drag Pan & Rotate Behavior

**Branch**: `010-drag-pan-behavior` | **Date**: 2026-02-07 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/010-drag-pan-behavior/spec.md`

## Summary

Replace the existing drag-to-zoom behavior on the 2D SVG map with drag-to-pan (Google Maps-style panning), and confirm/restrict the existing drag-to-rotate behavior on the 3D globe to horizontal-only (left-right) drag input. Both changes reuse the existing pointer event infrastructure. The 2D change is the primary modification (new pan math replaces zoom math); the 3D change is a behavioral confirmation with minor adjustment to ignore vertical drag entirely.

## Technical Context

**Language/Version**: TypeScript 5.7 (ES2022 target), JavaScript (map-3d.js)
**Primary Dependencies**: Three.js 0.182, Vite 7.3.1, Vitest 4.0.17
**Storage**: N/A — UI state only, no persistence
**Testing**: Vitest 4.0.17 (existing drag-zoom-2d.test.ts and drag-rotate-3d.test.ts to be replaced/updated)
**Target Platform**: Modern desktop and mobile browsers (Chrome, Firefox, Edge, Safari)
**Project Type**: Single static web application
**Performance Goals**: 60 fps rendering, <100ms perceived input latency
**Constraints**: No runtime backend, static delivery, < 50 draw calls, < 2000 vertices
**Scale/Scope**: Two map components (map-svg.ts, map-3d.js), two test files to modify/replace

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status | Notes                                                                                                                             |
| ------------------------------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------- |
| I. Deterministic Data Pipeline       | PASS   | No data pipeline changes. Coordinates remain build-time immutable.                                                                |
| II. Build-Time Coordinate Resolution | PASS   | No coordinate changes. Pan and rotation operate on existing viewBox/globeGroup.                                                   |
| III. Enterprise Testing Standards    | PASS   | Existing drag test files will be updated to test new pan/rotate math. No WebGL context required.                                  |
| IV. Performance Budgets              | PASS   | Pan is lightweight viewBox arithmetic. No new draw calls, vertices, or post-processing. Expensive updates remain throttled.       |
| V. Accessibility First               | PASS   | Drag is an enhancement layer (mouse/touch-only). Keyboard navigation and ARIA labels are unaffected. No accessibility regression. |
| VI. Zero Runtime Backend             | PASS   | No network requests. Pure client-side event handling.                                                                             |
| Invariant 3 (Raycasting Isolation)   | PASS   | Drag does not interact with raycasting. Globe surface still never triggers selection.                                             |
| Invariant 4 (Single Marker State)    | PASS   | Marker state update path unchanged.                                                                                               |
| Invariant 8 (No Post-Processing)     | PASS   | No new rendering effects.                                                                                                         |
| Invariant 12 (Performance Budget)    | PASS   | No new draw calls. Pointer handlers are lightweight arithmetic only.                                                              |

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
│   ├── map-svg.ts       # MODIFY: Replace drag-zoom with drag-pan logic
│   └── map-3d.js        # MODIFY: Restrict drag-rotate to horizontal-only
└── lib/
    └── bounds-clamping.ts  # NO CHANGE: Existing, but useful context for boundary clamping

tests/
├── drag-pan-2d.test.ts      # NEW: Unit tests for 2D pan math (replaces drag-zoom-2d.test.ts)
├── drag-rotate-3d.test.ts   # MODIFY: Update tests to verify vertical drag is ignored
├── drag-zoom-2d.test.ts     # DELETE: Replaced by drag-pan-2d.test.ts (drag-zoom removed)
```

**Structure Decision**: Single project. Changes are localized to two existing component files, one new test file replacing an old one, and one modified test file. No new source directories, no new dependencies, no architectural changes.

## Phase 0: Research Findings

No NEEDS CLARIFICATION items in the Technical Context. All decisions documented in [research.md](research.md).

### Key Design Decisions

**Decision 1: 2D Pan — ViewBox Translation (replaces ViewBox Scaling)**

- Pan operates by translating the SVG `viewBox` origin (x, y), keeping width/height unchanged
- Screen-to-SVG coordinate conversion needed: pixel drag delta must be scaled to viewBox coordinate delta
- Conversion factor: `svgDeltaX = screenDeltaX * (viewBox.w / containerWidth)`, same for Y
- This gives exact 1:1 cursor-to-map correspondence regardless of zoom level
- Direction: subtracting the SVG delta from viewBox origin makes the map follow the cursor (natural panning)
- Decision rationale: ViewBox translation is the simplest and most performant pan approach — no reflow, no recomputation of SVG paths, just an attribute change

**Decision 2: 2D Pan — Boundary Clamping**

- The viewBox origin (x, y) must be clamped so the viewBox never extends outside [0, 0, MAP_WIDTH, MAP_HEIGHT]
- Clamping formula: `x = clamp(x, 0, MAP_WIDTH - viewBox.w)`, `y = clamp(y, 0, MAP_HEIGHT - viewBox.h)`
- When fully zoomed out (viewBox.w === MAP_WIDTH), `MAP_WIDTH - viewBox.w === 0` so x is clamped to 0 — effectively disabling pan
- This naturally handles the edge case where the map is fully zoomed out
- Decision rationale: Simple arithmetic clamping is sufficient — no need for the clampBounds utility since we're clamping origin, not a bounding box

**Decision 3: 2D Pan — Pure Function Design**

- Extract pan math into a pure function `computeDragPannedViewBox(startViewBox, screenDelta, containerSize)` for testability
- This mirrors the established pattern of `computeDragZoomedViewBox()` and `computeZoomedViewBox()`
- The function receives the start viewBox, the cumulative screen delta (pixels), and container dimensions
- Returns a new ViewBoxRect with translated and clamped origin

**Decision 4: 2D State Changes — Remove Drag-Zoom State**

- Remove `computeDragZoomedViewBox()` export (replaced by `computeDragPannedViewBox()`)
- Remove `DRAG_ZOOM_SENSITIVITY` constant
- Change drag state variables:
  - Remove: `dragStartY`, `dragAnchorSVG`
  - Add: `dragStartX`, `dragStartScreenPos: { x: number; y: number }`
  - Keep: `dragStartViewBox`, `isDragging`, `wasDragging`
- Threshold check changes from `Math.abs(deltaY)` to `Math.hypot(deltaX, deltaY)` (2D movement for pan)

**Decision 5: 3D Globe — Horizontal-Only Drag Rotation**

- The current implementation already only uses horizontal drag (`deltaX`) for rotation via `computeDragRotationDelta(deltaX)`
- The threshold check currently uses only `Math.abs(totalDeltaX)` — this means a purely vertical drag doesn't trigger rotation
- However, a diagonal drag currently passes the threshold via X alone. The current behavior is correct for horizontal-only: only the X component contributes to rotation, Y is already ignored
- The threshold should be changed to use `Math.hypot(totalDeltaX, totalDeltaY)` so that a mostly-vertical drag still activates the drag state (for click suppression), but only the X component produces rotation
- This ensures the `wasDragging` flag gets set properly even for vertical drags (preventing accidental clicks)

**Decision 6: Removal of `computeDragZoomedViewBox` Function and Tests**

- The `computeDragZoomedViewBox()` function in `map-svg.ts` is being fully replaced by `computeDragPannedViewBox()`
- The entire `drag-zoom-2d.test.ts` test file tests the removed function and should be deleted
- A new `drag-pan-2d.test.ts` test file replaces it with tests for the new pan math
- The function export is removed cleanly — no backward compatibility shim needed

**Decision 7: Interaction with Scroll-Wheel Zoom**

- Scroll-wheel zoom (`computeZoomedViewBox`) remains unchanged — it modifies viewBox origin AND dimensions
- Drag-pan modifies viewBox origin ONLY — the two behaviors are orthogonal
- After a scroll-wheel zoom changes the viewBox size, drag-pan operates correctly with the new smaller/larger viewBox
- When a drag starts, `dragStartViewBox` captures the current viewBox including any zoom state

**Decision 8: Interaction with Click-Based ViewBox Animations**

- When a drag starts (`handlePointerDown`), any in-progress `animateViewBox()` animation is cancelled — this is unchanged from current behavior
- After pan modifies the viewBox, clicking a region or office will animate from the panned position to the target — no special handling needed

## Phase 1: Design

### 2D SVG Drag-Pan Design

**New pure function: `computeDragPannedViewBox()`**

```typescript
export function computeDragPannedViewBox(
  startViewBox: ViewBoxRect,
  screenDelta: { dx: number; dy: number },
  containerSize: { width: number; height: number }
): ViewBoxRect;
```

Algorithm:

1. Convert screen pixel delta to SVG coordinate delta:
   - `svgDeltaX = screenDelta.dx * (startViewBox.w / containerSize.width)`
   - `svgDeltaY = screenDelta.dy * (startViewBox.h / containerSize.height)`
2. Translate origin (subtract because dragging left should reveal right content):
   - `newX = startViewBox.x - svgDeltaX`
   - `newY = startViewBox.y - svgDeltaY`
3. Clamp origin to map boundaries:
   - `newX = clamp(newX, 0, MAP_WIDTH - startViewBox.w)`
   - `newY = clamp(newY, 0, MAP_HEIGHT - startViewBox.h)`
4. Return `{ x: newX, y: newY, w: startViewBox.w, h: startViewBox.h }`

Width and height are unchanged (pan does not zoom).

**State changes in `MapSvg`:**

Remove:

- `dragStartY: number | null`
- `dragAnchorSVG: { x: number; y: number } | null`
- `DRAG_ZOOM_SENSITIVITY` constant

Add:

- `dragStartScreenPos: { x: number; y: number } | null`

Keep unchanged:

- `dragStartViewBox: ViewBoxRect | null`
- `isDragging: boolean`
- `wasDragging: boolean`
- `boundPointerDown`, `boundPointerMove`, `boundPointerUp`, `boundClickCapture`

**Modified handler: `handlePointerDown()`**

1. Guard: only primary pointer, button 0
2. Store `dragStartScreenPos = { x: event.clientX, y: event.clientY }`
3. Store `dragStartViewBox = { ...this.currentViewBox }`
4. Remove: SVG anchor point computation (no longer needed — pan doesn't need an SVG-space anchor)
5. Set `isDragging = false`
6. Set pointer capture
7. Cancel any in-progress viewBox animation

**Modified handler: `handlePointerMove()`**

1. Guard: only primary pointer, `dragStartScreenPos !== null`
2. Compute `deltaX = event.clientX - dragStartScreenPos.x`, `deltaY = event.clientY - dragStartScreenPos.y`
3. Threshold check: `Math.hypot(deltaX, deltaY) <= DRAG_THRESHOLD` → skip
4. If first crossing threshold: set `isDragging = true`, set cursor to `'grabbing'`
5. Compute new viewBox: `computeDragPannedViewBox(dragStartViewBox, { dx: deltaX, dy: deltaY }, { width: container.clientWidth, height: container.clientHeight })`
6. Apply immediately to SVG and `currentViewBox`

**Modified handler: `handlePointerUp()`**

No changes needed — logic is identical (set `wasDragging`, reset drag state, restore cursor).

### 3D Globe Drag-Rotate Design (Horizontal-Only)

**Changes to `handlePointerDown()`:**

- Add: Store `dragStartY = event.clientY` alongside existing `dragStartX = event.clientX`
- Keep all other existing logic

**Changes to `handlePointerMove()`:**

- Change threshold check from `Math.abs(totalDeltaX) <= DRAG_THRESHOLD` to `Math.hypot(totalDeltaX, totalDeltaY) <= DRAG_THRESHOLD`
  - where `totalDeltaY = event.clientY - this.dragStartY`
- Keep rotation computation using only X delta (already correct): `computeDragRotationDelta(incrementalDeltaX)`
- The vertical component is used only for threshold detection, never for rotation
- This ensures a vertical drag still activates drag mode (for click suppression) but produces zero rotation

**No changes to `computeDragRotationDelta()`:**

The pure function already takes only `deltaX` and returns horizontal rotation. It is correct as-is.

### Test Strategy

**`tests/drag-pan-2d.test.ts` (NEW — replaces `drag-zoom-2d.test.ts`):**

Tests for `computeDragPannedViewBox()`:

- Dragging left moves viewBox origin right (reveals content to right)
- Dragging right moves viewBox origin left (reveals content to left)
- Dragging up moves viewBox origin down (reveals content below)
- Dragging down moves viewBox origin up (reveals content above)
- Zero delta produces no change
- Pan amount is proportional to drag distance
- Pan amount scales correctly with zoom level (smaller viewBox = less SVG movement per pixel)
- Diagonal drag moves both x and y
- Clamping: origin cannot go negative (left/top boundary)
- Clamping: origin cannot exceed MAP_WIDTH - viewBox.w (right boundary)
- Clamping: origin cannot exceed MAP_HEIGHT - viewBox.h (bottom boundary)
- Fully zoomed out (viewBox.w === MAP_WIDTH): pan has no effect (clamped to 0,0)
- Width and height are never modified by pan
- Aspect ratio is preserved (width/height unchanged)

**`tests/drag-rotate-3d.test.ts` (MODIFY):**

Existing tests remain valid. Add:

- Vertical-only drag produces zero rotation (computeDragRotationDelta(0) === 0)
- This test already implicitly exists ("zero deltaX returns exactly zero rotation") — confirm it covers the vertical-only drag scenario with a named test

**`tests/drag-zoom-2d.test.ts` (DELETE):**

- Entire file removed — tests the now-removed `computeDragZoomedViewBox()` function

### Event Registration & Cleanup

Both components: no changes to event registration or cleanup patterns. The same `pointerdown`/`pointermove`/`pointerup`/`pointercancel`/click-capture listeners are used. `dispose()` cleanup is unchanged.

## Constitution Re-Check (Post-Design)

| Principle                         | Status | Notes                                                                                                                                |
| --------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| III. Enterprise Testing Standards | PASS   | One new test file (drag-pan-2d), one updated (drag-rotate-3d), one removed (drag-zoom-2d). Net test coverage maintained or improved. |
| IV. Performance Budgets           | PASS   | Pan is O(1) viewBox arithmetic. No new draw calls. No DOM reflow.                                                                    |
| V. Accessibility First            | PASS   | Drag is progressive enhancement. Keyboard nav unaffected. All existing ARIA labels preserved.                                        |
| All other principles              | PASS   | Unchanged from initial check.                                                                                                        |

**Post-Design Gate Result**: PASS — ready for task generation.
