# Quickstart: Fix Marker Highlighting & Panel State Management

**Branch**: `011-fix-marker-panel-state`
**Date**: 2026-02-07

## What This Feature Does

Fixes four interrelated bugs in the map's selection and panel state management:

1. **Close button resets fully**: Clicking X dismisses any selection completely — zooms out, resets both panels, lights up all markers.
2. **Selected marker visually distinguished**: When an office is selected, same-region markers appear subdued (~60% opacity) so the selected marker stands out.
3. **Panel office list routes through app**: Clicking an office name in the panel's region list properly updates map, markers, and URL — not just the panel.
4. **No hashchange re-entrancy**: Region/office selections update the URL without triggering redundant re-processing.

## Files Changed

| File                              | Change                                                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `src/app.ts`                      | Simplify `handlePanelClose` to call `handleReset`; use `replaceState` for hash; pass `onOfficeClick` to panel |
| `src/lib/marker-state.ts`         | Add `subdued` field to `MarkerVisualState`; compute subdued state in `computeMarkerStates`                    |
| `src/components/details-panel.js` | Accept `onOfficeClick` callback; use it in `showRegion` office-btn handlers                                   |
| `src/components/map-svg.ts`       | Toggle `marker--subdued` CSS class in `updateMarkerStates`                                                    |
| `src/components/map-3d.js`        | Apply subdued opacity (0.6) in `updateMarkerStates`                                                           |
| `src/styles/app.css`              | Add `.marker--subdued` CSS class                                                                              |
| `tests/close-button.test.ts`      | Update to test direct-reset behavior                                                                          |
| `tests/marker-state.test.ts`      | Add tests for subdued state computation                                                                       |

## How to Test

```bash
# Run all tests
npm test

# Run specific test files
npx vitest tests/close-button.test.ts
npx vitest tests/marker-state.test.ts
```

### Manual Testing Checklist

1. Click a marker → right panel shows office details, marker highlighted
2. Click X → both panels reset, map zooms out, all markers full opacity
3. Select a region → click an office in the panel list → map zooms, marker highlighted, panel shows office
4. Click X after panel-list selection → full reset (same as step 2)
5. Select an office → zoom all the way out → only selected marker bright, same-region subdued, others dimmed
6. Click X at full zoom → clean reset, no confusing zoom-into-region
7. Navigate via URL hash (`#office=XYZ`) → correct state loads
8. Browser back/forward → correct state transitions
