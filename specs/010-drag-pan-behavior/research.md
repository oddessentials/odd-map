# Research: Drag Pan & Rotate Behavior

**Feature Branch**: `010-drag-pan-behavior`
**Date**: 2026-02-07

## Research Tasks

### RT-1: SVG ViewBox Pan Mechanics

**Task**: Determine the best approach for panning a zoomed SVG map by translating the viewBox.

**Decision**: Direct viewBox origin translation with screen-to-SVG coordinate scaling.

**Rationale**: The SVG `viewBox` attribute controls the visible window into the SVG coordinate space. Panning is achieved by adjusting the origin (x, y) while keeping width and height constant. The conversion from screen pixels to SVG units is: `svgDelta = screenDelta * (viewBox.dimension / container.dimension)`. This approach is:

- Zero-cost in terms of rendering — only an attribute string changes, no reflow or repaint of SVG paths
- Naturally 1:1 with cursor movement at any zoom level (the scaling factor accounts for current zoom)
- Consistent with how scroll-wheel zoom already manipulates the viewBox

**Alternatives considered**:

- CSS transform translate on the SVG element: Would require tracking two coordinate systems and complicate scroll-wheel zoom interaction. Rejected.
- SVG `transform` attribute on a root `<g>` element: Would conflict with existing viewBox manipulation for zoom. Rejected.
- Modifying individual element positions: Completely impractical for a static SVG with hundreds of paths. Rejected.

### RT-2: Pan Boundary Clamping Strategy

**Task**: Determine how to prevent the user from panning beyond the map edges.

**Decision**: Arithmetic origin clamping with `Math.max(0, Math.min(MAP_WIDTH - viewBox.w, x))`.

**Rationale**: The viewBox origin (x, y) is clamped so the visible rectangle never extends outside [0, 0, MAP_WIDTH, MAP_HEIGHT]. When fully zoomed out, `MAP_WIDTH - viewBox.w === 0`, so x is clamped to 0, naturally disabling pan. This is simple, correct, and performant.

**Alternatives considered**:

- Using the existing `clampBounds()` utility: It clamps a bounding box (region bounds with padding), not a viewBox origin. The signature doesn't match the pan use case. Would require awkward adaptation. Rejected.
- Elastic/rubber-band effect at boundaries: Adds complexity (animation, snap-back) for minimal UX benefit on a data map. Not requested. Rejected.

### RT-3: 3D Globe Drag Threshold with Vertical Component

**Task**: Research whether the 3D globe's drag threshold should account for vertical movement.

**Decision**: Change threshold from `Math.abs(totalDeltaX)` to `Math.hypot(totalDeltaX, totalDeltaY)`.

**Rationale**: A user dragging vertically on the globe currently doesn't cross the threshold (since only X is measured). This means the `wasDragging` flag isn't set, and a vertical drag ending on a clickable element could trigger an unintended selection. By using the 2D distance (`Math.hypot`), any sufficiently large drag — horizontal, vertical, or diagonal — activates drag mode and suppresses the subsequent click. However, only the horizontal component is fed to `computeDragRotationDelta()`, so vertical-only drags produce zero rotation as specified.

**Alternatives considered**:

- Keep horizontal-only threshold: Simpler, but creates an edge case where vertical drags don't suppress clicks. Rejected.
- Use `Math.max(Math.abs(dx), Math.abs(dy))` (Chebyshev distance): Works but is less standard than Euclidean distance for drag detection. Rejected.

### RT-4: Interaction Between Pan and Scroll-Wheel Zoom

**Task**: Verify that pan and scroll-wheel zoom don't conflict.

**Decision**: No special coordination needed — they are orthogonal operations.

**Rationale**: Scroll-wheel zoom modifies all four viewBox values (x, y, w, h) using `computeZoomedViewBox()`. Drag-pan modifies only x and y. Both read from and write to `this.currentViewBox`. Since pointer events and wheel events don't fire simultaneously (different input devices), there's no race condition. When a drag starts, `dragStartViewBox` captures the current state including any zoom level, so the pan math correctly scales to whatever zoom level is active.

**Alternatives considered**: None — the architecture naturally supports both operations on the same state without conflict.
