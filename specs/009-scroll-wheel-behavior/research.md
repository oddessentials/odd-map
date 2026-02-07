# Research: Scroll-Wheel Behavior Enhancements

**Feature**: 009-scroll-wheel-behavior
**Date**: 2026-02-06

## Research Tasks

### R1: Wheel Event API — Cross-Browser Normalization

**Decision**: Use the standard `wheel` event with `deltaY` normalization.

**Rationale**: The `wheel` event is the modern standard (supported in all target browsers). The deprecated `mousewheel` (Chrome/Safari legacy) and `DOMMouseScroll` (Firefox legacy) events are unnecessary since all modern browsers support `wheel`. The key cross-browser concern is `deltaMode`:

- `WheelEvent.DOM_DELTA_PIXEL` (0) — Chrome, Edge, Safari: deltaY is in pixels (typically ±100–150)
- `WheelEvent.DOM_DELTA_LINE` (1) — Firefox: deltaY is in lines (typically ±3)
- `WheelEvent.DOM_DELTA_PAGE` (2) — Rare, some trackpad gestures

**Normalization approach**: Use `Math.sign(event.deltaY)` to extract direction only, ignoring magnitude. This gives consistent ±1 per tick across all browsers and input devices. Magnitude-based approaches (proportional zoom) introduce complexity with trackpad momentum scrolling.

**Alternatives considered**:

- Proportional delta (rejected): Trackpad momentum scrolling produces very large accumulated deltas, causing excessive zoom/rotation. Direction-only is safer.
- `deltaX` for horizontal rotation on 3D (rejected): User spec explicitly states scroll up/down → left/right, so `deltaY` is correct.

### R2: Cursor-Relative SVG Zoom — Coordinate Transform

**Decision**: Use `SVGSVGElement.createSVGPoint()` with `getScreenCTM().inverse()` for screen-to-SVG coordinate conversion.

**Rationale**: This is the standard SVG API for converting screen coordinates to SVG user space. It correctly accounts for any CSS transforms, scaling, and the current viewBox. The formula for cursor-relative zoom:

```
cursorSVG = screenToSVG(event.clientX, event.clientY)
newWidth = currentWidth * zoomFactor
newHeight = currentHeight * zoomFactor
newX = cursorSVG.x - (cursorSVG.x - currentX) * zoomFactor
newY = cursorSVG.y - (cursorSVG.y - currentY) * zoomFactor
```

This keeps the point under the cursor stationary while the rest of the map scales around it.

**Alternatives considered**:

- Center-based zoom (rejected): Spec FR-003 explicitly requires cursor-relative zoom. Center zoom is also a worse UX.
- Manual offset calculation with `getBoundingClientRect` (rejected): Doesn't account for viewBox scaling correctly; `getScreenCTM` is more accurate and handles all edge cases.

### R3: Passive Event Listeners and preventDefault

**Decision**: Register wheel handler with `{ passive: false }`.

**Rationale**: Modern browsers mark wheel/touch events as passive by default for performance (allows compositor-thread scrolling). To call `preventDefault()` (required to suppress page scrolling per FR-010), the handler must be registered with `{ passive: false }`. This is necessary and intentional — the handler is lightweight (O(1) math) so the performance impact is negligible.

**Alternatives considered**:

- CSS `overflow: hidden` on container (rejected): Doesn't prevent page scroll, only hides overflow on the container itself.
- CSS `overscroll-behavior: contain` (rejected): Only affects scroll chaining from scrollable elements, not the page scroll triggered by wheel events on non-scrollable content.

### R4: 3D Globe Rotation — Axis and Direction

**Decision**: Rotate `globeGroup.rotation.y` (Y-axis, vertical axis). Scroll-up (negative deltaY) → positive rotation (globe turns left/counterclockwise when viewed from above). Scroll-down (positive deltaY) → negative rotation (globe turns right/clockwise from above).

**Rationale**: The Y-axis is the natural vertical axis in the Three.js scene. The existing auto-rotation uses `this.globeGroup.rotation.y += this.rotationSpeed` where `rotationSpeed` is `0.0005` (positive = counterclockwise from above = leftward at the equator). For scroll-up = "left" as specified, we match this convention: `rotation.y += step` for scroll-up.

**Alternatives considered**:

- Camera orbit (rejected): Moving the camera around the globe conflicts with the existing `animateToTarget()` camera animation system. Rotating globeGroup is simpler and already proven by auto-rotation.
- Full quaternion rotation (rejected): Over-engineered for single-axis horizontal rotation. Euler Y-rotation is sufficient.

### R5: Animation Cancellation on 2D Map

**Decision**: Cancel in-progress `animateViewBox()` animations when the user starts scrolling to zoom.

**Rationale**: If the user is scrolling to zoom while a click-based zoom animation is playing, the animation would fight with the scroll input, causing visual jitter. Cancelling the animation immediately and applying the scroll-zoom from the current interpolated viewBox position provides clean handoff. The `animateViewBox()` function already uses `requestAnimationFrame`, so storing and cancelling the frame ID is straightforward.

**Alternatives considered**:

- Queuing scroll until animation completes (rejected): Feels unresponsive. User expects immediate scroll feedback.
- Blending both inputs (rejected): Complex and visually confusing. Clean cancellation is simpler and more predictable.

### R6: Zoom Factor and Rotation Step Tuning

**Decision**: Start with zoom factor of 0.9/1.1 per tick and rotation step of 0.05 radians per tick. These can be tuned during testing.

**Rationale**:

- **Zoom 0.9 per tick**: At this rate, 5 scroll ticks reaches ~0.59x (about 1.7x zoom). 15 ticks reaches ~0.21x (about 4.8x zoom). This provides good granularity without requiring excessive scrolling. Full zoom range (1x to 16x) requires ~28 ticks, well within the SC-001 target of 5 seconds.
- **Rotation 0.05 rad per tick**: At this rate, a full 360° (2π rad) requires ~126 ticks. With typical scroll rates of 15-20 ticks/second, this is about 6-8 seconds for a full revolution, meeting SC-002's 10-second target.

**Alternatives considered**:

- Larger steps (rejected): Feels jumpy, especially on trackpads.
- Configurable via client config (rejected): Over-engineered for this feature. Constants in code are sufficient and can be adjusted later if needed.
