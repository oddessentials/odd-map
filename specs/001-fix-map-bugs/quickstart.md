# Quickstart: Fix Critical 3D/2D Map Visualization Bugs

**Feature**: 001-fix-map-bugs
**Date**: 2026-02-05

## Prerequisites

- Node.js 18+
- npm 9+
- Git

## Setup

```bash
# Clone and checkout feature branch
git checkout 001-fix-map-bugs

# Install dependencies
npm install

# Verify current state (should show failing behavior)
npm run dev
```

## Reproducing the Bugs

### Bug #1: Pin Disappearance on View Toggle

1. Open http://localhost:5173
2. Click on any region (e.g., "Northeast Region")
3. Verify pins are visible
4. Click the 2D/3D toggle button in the corner
5. **BUG**: Pins disappear and don't reappear

### Bug #2: Pins in Ocean (3D view)

1. Open http://localhost:5173
2. Click the toggle to switch to 3D globe view
3. **BUG**: Office pins appear clustered over the Pacific Ocean instead of over the USA

### Bug #3: Pin Flickering (3D view)

1. Open http://localhost:5173
2. Switch to 3D globe view
3. Let the globe auto-rotate
4. **BUG**: Pins near the edge of the visible hemisphere flicker rapidly

## Running Tests

```bash
# Run all tests
npm test

# Run specific test files
npm test -- view-switching
npm test -- projection-3d
npm test -- scene-graph-parenting

# Run with coverage
npm run test:coverage

# Run full CI suite (includes verification)
npm run test:ci
```

## Development Workflow

### Making Changes

1. **Bug #1 (Race Condition)**: Edit `src/components/map-svg.ts` and `src/app.ts`
2. **Bug #2 (Texture Offset)**: Edit `src/components/map-3d.js` line 60
3. **Bug #3 (Flickering)**: Edit `src/components/map-3d.js` in `updateExpensiveMarkerStates()`

### Testing Changes

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Format check
npm run format:check

# Quick verification
npm run verify:quick

# Full verification (before commit)
npm run verify
```

### Manual Testing Checklist

- [ ] Select region in 2D view, toggle to 3D, pins remain visible
- [ ] Select region in 3D view, toggle to 2D, pins remain visible
- [ ] Select office in 2D view, toggle to 3D, same office highlighted
- [ ] In 3D view, all pins appear over US landmass (not ocean)
- [ ] In 3D view with auto-rotate, no pin flickering at visibility edge
- [ ] Toggle rapidly between 2D/3D - no crashes or console errors

## File Locations

| Component           | File                           | Key Functions                                                        |
| ------------------- | ------------------------------ | -------------------------------------------------------------------- |
| 2D Map              | `src/components/map-svg.ts`    | `init()`, `addMarkers()`, `selectRegion()`, `showMarkersForRegion()` |
| 3D Map              | `src/components/map-3d.js`     | `createMarkers()`, `updateExpensiveMarkerStates()`                   |
| App Controller      | `src/app.ts`                   | `toggleMapMode()`, `initMap()`                                       |
| View Tests          | `tests/view-switching.test.ts` | State preservation tests                                             |
| 3D Projection Tests | `tests/projection-3d.test.ts`  | Coordinate conversion tests                                          |

## Debugging Tips

### Console Logging

Add temporary logs to trace execution:

```typescript
// In map-svg.ts
console.log('📍 addMarkers() complete, marker count:', successCount);
console.log('🎯 selectRegion() called, markersReady:', this.markersReady);

// In map-3d.js
console.log('🌍 Texture offset applied:', TEXTURE_LONGITUDE_OFFSET_DEG);
console.log('👁️ Marker visibility:', marker.userData.office.office_code, marker.visible);
```

### Browser DevTools

1. Open DevTools → Console to see errors
2. Use Performance tab to profile 3D rendering
3. Check Network tab to verify texture loading

## Expected Outcomes After Fixes

1. **View Toggle**: Pins remain visible across 2D↔3D transitions
2. **Pin Location**: All pins appear over continental USA
3. **Pin Stability**: No flickering during globe rotation
4. **Tests**: All existing tests pass + new regression tests added
