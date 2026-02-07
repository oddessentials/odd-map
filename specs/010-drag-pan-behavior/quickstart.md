# Quickstart: 010-drag-pan-behavior

## Overview

This feature adds click-and-drag (desktop) and touch-and-drag (mobile) interactions to both map components:

- **2D SVG map**: Vertical drag zooms in/out centered on the initial press point
- **3D globe**: Horizontal drag rotates the globe left/right (horizontal spin)

## Prerequisites

- Node.js >= 22.0.0
- npm dependencies installed (`npm install`)

## Development

```bash
# Start dev server
npm run dev

# Run tests
npm test

# Run specific test files
npx vitest run tests/drag-zoom-2d.test.ts
npx vitest run tests/drag-rotate-3d.test.ts

# Type check
npm run typecheck

# Lint
npm run lint
```

## Files to Modify

| File                        | Change                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------- |
| `src/components/map-svg.ts` | Add pointer event listeners, `computeDragZoomedViewBox()`, click/drag discrimination  |
| `src/components/map-3d.js`  | Add pointer event listeners, `computeDragRotationDelta()`, auto-rotation pause/resume |
| `src/styles/app.css`        | Add `touch-action: none` and `cursor: grab`/`grabbing` on map containers              |

## Files to Create

| File                           | Purpose                                           |
| ------------------------------ | ------------------------------------------------- |
| `tests/drag-zoom-2d.test.ts`   | Unit tests for 2D drag-zoom math calculations     |
| `tests/drag-rotate-3d.test.ts` | Unit tests for 3D drag-rotation math calculations |

## Key Implementation Notes

1. **Pointer Events API**: Use `pointerdown`/`pointermove`/`pointerup`/`pointercancel` for unified mouse + touch support
2. **Click vs. drag discrimination**: 5px movement threshold — below = click (selection), above = drag (zoom/rotation)
3. **Pointer capture**: Call `setPointerCapture(pointerId)` on `pointerdown` to handle drag-beyond-boundary
4. **2D zoom math**: Exponential mapping `Math.pow(1.005, deltaY)` from drag start for smooth cursor-relative zoom
5. **3D rotation math**: Linear mapping `-deltaX * 0.005` applied incrementally per move event
6. **Touch support**: `touch-action: none` CSS on map containers prevents default browser gestures
7. **Auto-rotation**: Pause on drag start, resume on drag end (if it was enabled before)
8. **Cleanup**: Remove all pointer listeners in `dispose()` methods to prevent memory leaks
9. **Testing**: All tests are pure math/logic — no DOM, Pointer Events, or WebGL context required

## Testing Checklist

- [ ] 2D: Drag up zooms in toward initial press point
- [ ] 2D: Drag down zooms out from initial press point
- [ ] 2D: Zoom clamps at minimum (full 960x600 view)
- [ ] 2D: Zoom clamps at maximum (~60px viewBox width)
- [ ] 2D: Short click (< 5px movement) still triggers region/office selection
- [ ] 3D: Drag left rotates globe left
- [ ] 3D: Drag right rotates globe right
- [ ] 3D: Auto-rotation pauses during drag, resumes on release
- [ ] 3D: Short click still triggers region/office selection
- [ ] Both: Touch input (single finger) works identically to mouse drag
- [ ] Both: Right-click drag is ignored
- [ ] Both: Drag beyond container boundary continues working (pointer capture)
- [ ] Both: Page scrolling outside map area works normally
- [ ] Both: Existing scroll-wheel zoom/rotation still works
- [ ] Both: Existing keyboard navigation still works
