# Quickstart: Drag Pan & Rotate Behavior

**Branch**: `010-drag-pan-behavior`

## What This Feature Does

Replaces the existing drag-to-zoom gesture on the 2D SVG map with drag-to-pan (Google Maps-style panning), and confirms that the 3D globe's drag-rotate gesture responds only to horizontal movement.

## Key Files

| File                           | Action | Purpose                                                |
| ------------------------------ | ------ | ------------------------------------------------------ |
| `src/components/map-svg.ts`    | MODIFY | Replace drag-zoom with drag-pan logic                  |
| `src/components/map-3d.js`     | MODIFY | Update drag threshold to include vertical movement     |
| `tests/drag-pan-2d.test.ts`    | NEW    | Unit tests for 2D pan math                             |
| `tests/drag-rotate-3d.test.ts` | MODIFY | Add test confirming vertical drag produces no rotation |
| `tests/drag-zoom-2d.test.ts`   | DELETE | Tests for removed drag-zoom function                   |

## Core Concept

### 2D Pan Math

The new `computeDragPannedViewBox()` pure function:

1. Takes: start viewBox, screen pixel delta, container dimensions
2. Converts pixel delta to SVG coordinate delta: `svgDelta = screenDelta * (viewBox.w / containerWidth)`
3. Translates viewBox origin: `newX = startX - svgDeltaX` (subtracting makes map follow cursor)
4. Clamps to boundaries: `newX = clamp(newX, 0, MAP_WIDTH - viewBox.w)`
5. Returns new viewBox with same width/height (pan doesn't zoom)

### 3D Horizontal-Only Rotation

The existing `computeDragRotationDelta(deltaX)` is unchanged. The only modification is the drag threshold check: `Math.hypot(dx, dy)` instead of `Math.abs(dx)`, so vertical drags activate drag mode (for click suppression) but produce zero rotation.

## Running Tests

```bash
npm test
```

Tests are pure math — no DOM or WebGL context required.

## Relevant Prior Art

- `computeZoomedViewBox()` — scroll-wheel zoom, same viewBox manipulation pattern
- `computeDragRotationDelta()` — existing drag rotation, stays unchanged
- `specs/009-scroll-wheel-behavior/` — previous feature that added scroll-wheel interactions
