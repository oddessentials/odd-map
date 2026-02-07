# Research: Drag/Touch Pan Behavior for 2D Zoom and 3D Globe Rotation

**Feature**: 010-drag-pan-behavior
**Date**: 2026-02-06

## Research Tasks

### R1: Pointer Events API — Unified Mouse + Touch Input

**Decision**: Use the Pointer Events API (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`) instead of separate mouse and touch event listeners.

**Rationale**: Pointer Events provide a single, unified abstraction over mouse, touch, and stylus input. All modern browsers support them (Chrome 55+, Firefox 59+, Safari 13+, Edge 12+). Using Pointer Events eliminates the need for duplicate mouse/touch event handlers and avoids the 300ms touch delay that plagues older `click` event handling on mobile. Key advantages:

- `event.isPrimary` easily filters to single-pointer only (handles multi-touch rejection for free)
- `event.button === 0` filters to primary button (rejects right-click)
- `event.pointerType` can distinguish "mouse", "touch", "pen" if needed (not required for this feature)
- Pointer capture (`setPointerCapture`) provides clean drag-beyond-boundary handling

**Alternatives considered**:

- Separate `mousedown`/`touchstart` + `mousemove`/`touchmove` + `mouseup`/`touchend` (rejected): Requires duplicate code paths, introduces event ordering bugs (e.g., `touchstart` fires before synthetic `mousedown` on mobile), and doesn't provide pointer capture.
- Only `mousedown`/`mousemove`/`mouseup` (rejected): Does not support touch devices at all, which is a hard requirement (FR-010).

### R2: Click vs. Drag Discrimination — Threshold-Based Approach

**Decision**: Use a 5-pixel Euclidean distance threshold to distinguish a click/tap from a drag gesture.

**Rationale**: On `pointerdown`, record the starting position. On each `pointermove`, compute the distance from start. If the distance exceeds 5 pixels, enter "drag mode" and suppress the subsequent `click` event. The 5px threshold is:

- **Small enough** that intentional drags are recognized almost immediately (first 5px of movement, typically <50ms at normal drag speed)
- **Large enough** to absorb finger tremor on touchscreens (typical touch jitter is 2-3px) and minor mouse movement during a click
- **Consistent with industry standards**: Google Maps uses ~3-5px, Leaflet uses 3px, macOS uses 5px for drag detection

For the 2D map, only vertical distance (`Math.abs(deltaY)`) is checked since horizontal movement is irrelevant to zoom. For the 3D globe, only horizontal distance (`Math.abs(deltaX)`) is checked since vertical movement is irrelevant to rotation.

**Alternatives considered**:

- Time-based threshold (e.g., 200ms hold = drag) (rejected): Adds perceived latency. Users expect drag response immediately on movement, not after a delay.
- Combined distance + time (rejected): Over-engineered. Distance-only is simpler and matches user expectations across all platforms.
- Zero-threshold with immediate drag (rejected): Any finger tremor would trigger drag mode, making it impossible to tap/click to select.

### R3: Pointer Capture for Drag Continuation Beyond Boundaries

**Decision**: Use `element.setPointerCapture(pointerId)` on `pointerdown` to ensure pointer events continue firing on the element even when the pointer moves outside its bounds.

**Rationale**: During a drag, users frequently overshoot the map container boundary, especially on mobile where the map may not fill the full viewport. Without pointer capture, `pointermove` events would stop firing when the pointer leaves the element, causing the drag to "stick" in a broken state. `setPointerCapture`:

- Redirects all subsequent `pointermove` and `pointerup` events to the capturing element
- Automatically releases capture on `pointerup` (no manual cleanup needed)
- Also fires `lostpointercapture` event if capture is broken by the browser (e.g., system gesture)
- Well-supported: all browsers that support Pointer Events also support pointer capture

**Alternatives considered**:

- Listening on `document` for `mousemove`/`mouseup` (rejected): Doesn't work with Pointer Events without additional plumbing. Pointer capture is the idiomatic solution.
- Clipping drag to container bounds and ignoring out-of-bounds (rejected): Poor UX — drag "stops" unexpectedly.

### R4: 2D Drag-Zoom — Exponential Factor Mapping

**Decision**: Map vertical drag distance to zoom factor using `Math.pow(1.005, deltaY)`, where `deltaY` is the pixel distance from the drag start (positive = down = zoom out, negative = up = zoom in).

**Rationale**: An exponential mapping provides a natural zoom feel:

- **Symmetry**: Dragging 100px up then 100px back down returns to the original zoom (multiplicative inverse: `1.005^(-100) * 1.005^(100) = 1`)
- **Proportional speed**: At high zoom levels, the same drag distance produces a smaller absolute change (fine control). At low zoom levels, the same drag distance produces a larger absolute change (coarse navigation). This matches user expectations for zoom controls.
- **Sensitivity**: At 0.5% per pixel (base 1.005), a 100px drag achieves ~1.65x zoom. A 200px drag achieves ~2.72x zoom. A 500px drag (full vertical swipe on many screens) achieves ~12.2x zoom, comfortably covering the full MIN_VIEWBOX_WIDTH (60) to MAX_VIEWBOX_WIDTH (960) range (~16x).
- **SC-001 compliance**: Full zoom range achievable in a single 500px drag (~1-2 seconds of movement), well within the 3-second target.

**Alternatives considered**:

- Linear mapping (rejected): Zoom speed is constant regardless of current zoom level, which feels too fast at high zoom and too slow at low zoom.
- Per-pixel discrete steps reusing `computeZoomedViewBox()` from scroll-wheel (rejected): This function was designed for discrete ±1 tick inputs. Calling it on every `pointermove` pixel would accumulate rounding errors and make the zoom feel jumpy. A single cumulative factor from drag start is smoother.

### R5: 3D Drag-Rotation — Linear Pixel-to-Radian Mapping

**Decision**: Map horizontal drag distance to rotation using a linear factor: `deltaRadians = -deltaX * 0.005`. Negative sign because dragging left (negative deltaX) should rotate the globe left (positive Y rotation in Three.js).

**Rationale**: Linear mapping is appropriate for rotation (unlike zoom) because:

- **No scaling effect**: Rotation doesn't have the "compounding" property of zoom. Rotating 10° more always looks the same regardless of current rotation. Linear is the natural choice.
- **Sensitivity**: At 0.005 rad/pixel, a 300px drag (roughly globe width in a typical viewport) achieves 1.5 rad (~86°). A 628px drag achieves π radians (180°). Full 360° requires ~1257px of cumulative drag, achievable with 2-3 back-and-forth sweeps.
- **SC-002 compliance**: A single full-width drag across the globe area (~400-500px) covers ~2.0-2.5 rad (~115-143°). Multiple sweeps or faster drags achieve 360° comfortably.
- **Incremental application**: Unlike 2D zoom (which computes from start), rotation applies incrementally (`event.clientX - previousX` per move event). This prevents the "snap" effect that would occur if rotation reset to an absolute value on each move.

**Alternatives considered**:

- Exponential mapping (rejected): No benefit for rotation, would feel inconsistent.
- Cumulative from start (rejected for 3D): Would cause visual jumps when the user reverses drag direction mid-gesture. Incremental application is smoother.

### R6: Touch Scroll Prevention — `touch-action: none`

**Decision**: Add `touch-action: none` CSS property on map container elements to prevent default browser touch behaviors (scrolling, pinch-zoom, etc.) within the map area.

**Rationale**: On touch devices, browsers default to scrolling or zooming the page when the user touches and drags. The `touch-action: none` CSS property tells the browser to never claim the touch gesture for default behaviors within the element, allowing our Pointer Events handlers full control. This is more reliable than calling `event.preventDefault()` on every `pointermove` because:

- It works at the compositor level (no JavaScript execution needed to prevent default behavior)
- It avoids the "intervention" warnings Chrome shows when `preventDefault()` is called on passive touch events
- It's set once (declarative) rather than per-event (imperative)

The property only affects the map container — page scrolling outside the map continues normally.

**Alternatives considered**:

- `event.preventDefault()` on every `pointermove` with `{ passive: false }` (rejected as primary approach): Works but requires the browser to wait for JavaScript execution before deciding to scroll, which can cause scroll jank on older devices. Fine as a fallback but `touch-action` is the primary solution.
- `touch-action: pan-y` on 2D map / `touch-action: pan-x` on 3D map (rejected): Would allow orthogonal scrolling, but since both maps use drag for their respective axes, any default touch behavior within the map area would conflict.

### R7: Auto-Rotation Pause/Resume During 3D Drag

**Decision**: Pause auto-rotation when drag starts (threshold crossed), resume when drag ends (pointer up), only if auto-rotation was enabled before the drag.

**Rationale**: The spec (FR-009) requires that drag-rotation pauses auto-rotation during the gesture and resumes it on release. The implementation stores `autoRotateWasEnabled = this.autoRotate` on `pointerdown`, then:

- On drag threshold crossed: `this.autoRotate = false` (stops the `animate()` loop from adding rotation)
- On `pointerup`: if `autoRotateWasEnabled` was true, `this.autoRotate = true` (resumes)
- If the user toggled auto-rotation OFF via the UI button during the drag, `autoRotateWasEnabled` still reflects the pre-drag state, so it would incorrectly resume. To handle this: only resume if `this.userWantsAutoRotate` is still true at `pointerup` time.

This matches the existing pattern where `animateToTarget()` stores and restores auto-rotation state.

**Alternatives considered**:

- Always resume auto-rotation after drag (rejected): If the user disabled auto-rotation before dragging, it would re-enable unexpectedly.
- Never resume (rejected): Violates FR-009 — the user would have to manually re-enable auto-rotation after every drag.
