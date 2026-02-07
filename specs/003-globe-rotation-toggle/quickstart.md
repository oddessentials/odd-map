# Quickstart: Globe Rotation Toggle

**Feature**: 003-globe-rotation-toggle
**Date**: 2026-02-05

## Prerequisites

- Node.js 18+
- npm 9+
- Modern browser with WebGL support

## Setup

```bash
# Clone and checkout feature branch
git checkout 003-globe-rotation-toggle

# Install dependencies
npm install

# Start dev server
npm run dev
```

## Testing

### Run All Tests

```bash
npm test
```

### Run Feature-Specific Tests

```bash
npm test -- spin-toggle
```

### Manual Testing Checklist

1. **Static Globe by Default (US1)**
   - [ ] Open app in 3D mode
   - [ ] Verify globe is NOT spinning on load
   - [ ] Verify manual drag rotation still works
   - [ ] Verify region/office selection still animates

2. **Spin Toggle Button (US2)**
   - [ ] Locate spin button (↻) in header controls
   - [ ] Click button → globe starts spinning
   - [ ] Click button again → globe stops spinning
   - [ ] Verify button visual state matches rotation state

3. **Edge Cases**
   - [ ] Enable spin → switch to 2D → switch back to 3D → verify spin is OFF
   - [ ] Enable spin → select region → verify spin stops during animation
   - [ ] Enable spin → drag globe → verify spin stops
   - [ ] In 2D mode → verify spin button is hidden

## Key Files

| File                         | Purpose                                          |
| ---------------------------- | ------------------------------------------------ |
| `src/components/map-3d.js`   | Auto-rotation logic, `toggleAutoRotate()` method |
| `src/components/map-3d.d.ts` | Type declarations                                |
| `src/app.ts`                 | Spin button handler, visibility logic            |
| `src/index.html`             | Spin button markup                               |
| `src/styles/app.css`         | Spin button styles                               |
| `tests/spin-toggle.test.ts`  | Unit tests                                       |

## Validation Commands

```bash
# Full verification suite
npm run verify

# Individual checks
npm run typecheck
npm run lint
npm run format:check
npm test
```

## Expected Test Count

Before: ~133 tests
After: ~140 tests (adds ~7 tests for spin toggle)
