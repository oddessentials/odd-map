# Quickstart: 009-scroll-wheel-behavior

## Overview

This feature adds mouse scroll-wheel interactions to both map components:

- **2D SVG map**: Scroll-wheel zooms in/out centered on cursor position
- **3D globe**: Scroll-wheel rotates globe left/right (horizontal spin)

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
npx vitest run tests/scroll-zoom-2d.test.ts
npx vitest run tests/scroll-rotate-3d.test.ts

# Type check
npm run typecheck

# Lint
npm run lint
```

## Files to Modify

| File                        | Change                                                       |
| --------------------------- | ------------------------------------------------------------ |
| `src/components/map-svg.ts` | Add `wheel` event listener and cursor-relative zoom logic    |
| `src/components/map-3d.js`  | Add `wheel` event listener and scroll-driven Y-axis rotation |

## Files to Create

| File                             | Purpose                                       |
| -------------------------------- | --------------------------------------------- |
| `tests/scroll-zoom-2d.test.ts`   | Unit tests for 2D viewBox zoom calculations   |
| `tests/scroll-rotate-3d.test.ts` | Unit tests for 3D rotation delta calculations |

## Key Implementation Notes

1. **Wheel event registration**: Use `{ passive: false }` to allow `preventDefault()`
2. **2D zoom math**: Use `SVGSVGElement.createSVGPoint()` + `getScreenCTM().inverse()` for cursor-to-SVG coordinate transform
3. **3D rotation**: Modify `globeGroup.rotation.y` directly — same axis as existing auto-rotation
4. **Cleanup**: Remove wheel listeners in `dispose()` methods to prevent memory leaks
5. **Testing**: All tests are pure math/logic — no DOM or WebGL context required

## Testing Checklist

- [ ] 2D: Scroll-up zooms in toward cursor
- [ ] 2D: Scroll-down zooms out from cursor
- [ ] 2D: Zoom clamps at minimum (full 960x600 view)
- [ ] 2D: Zoom clamps at maximum (~60px viewBox width)
- [ ] 2D: Page does not scroll while cursor is over map
- [ ] 3D: Scroll-up rotates globe left
- [ ] 3D: Scroll-down rotates globe right
- [ ] 3D: Rotation works alongside auto-rotation toggle
- [ ] 3D: Page does not scroll while cursor is over globe
- [ ] Both: Scrolling outside map area scrolls page normally
- [ ] Both: Rapid scrolling is smooth without jitter
- [ ] Existing click-to-select, keyboard nav, and auto-rotation still work
