# Quickstart: Map Toggle Edge Case Guards

**Feature**: 002-map-toggle-guard
**Date**: 2026-02-05

## What This Feature Does

Adds guards to prevent race conditions when rapidly toggling between 2D and 3D map views:

1. **Disables toggle button** during transitions to prevent queueing
2. **Cancels camera animations** cleanly before map disposal
3. **Preserves selection state** even when animations are interrupted

## Files to Modify

| File                       | Changes                                                                           |
| -------------------------- | --------------------------------------------------------------------------------- |
| `src/app.ts`               | Add `transitioning` flag, guard `toggleMapMode()`, add `setToggleButtonEnabled()` |
| `src/components/map-3d.js` | Add `cancelAnimation()` method, update `dispose()` and animation loop             |
| `src/styles/main.css`      | Add `#map-toggle:disabled` styles                                                 |

## Files to Create

| File                         | Purpose                          |
| ---------------------------- | -------------------------------- |
| `tests/toggle-guard.test.ts` | Unit tests for toggle edge cases |

## Implementation Order

1. **Map3D animation cancellation** (P2 story, enables clean disposal)
   - Add `cancelAnimation()` method
   - Update `animateToTarget()` to check cancellation flag
   - Call `cancelAnimation()` from `dispose()`

2. **App toggle guard** (P1 story, main deliverable)
   - Add `transitioning` state
   - Add guard at start of `toggleMapMode()`
   - Add `setToggleButtonEnabled()` helper
   - Wrap toggle logic in try/finally

3. **CSS disabled styles** (visual feedback)
   - Add `#map-toggle:disabled` rule

4. **Tests** (validation)
   - Test rapid toggle blocked
   - Test button disabled during transition
   - Test animation cancelled on toggle

## Verification Commands

```bash
# Run all tests
npm test

# Run specific toggle tests
npm test -- toggle-guard

# Run verification suite
npm run verify
```

## Key Implementation Details

### Toggle Guard Pattern

```typescript
private async toggleMapMode(): Promise<void> {
  if (this.transitioning) return;
  this.transitioning = true;
  this.setToggleButtonEnabled(false);

  try {
    // existing toggle logic
  } finally {
    this.transitioning = false;
    this.setToggleButtonEnabled(true);
  }
}
```

### Animation Cancellation Pattern

```javascript
cancelAnimation() {
  this.animating = false;
}

// In animateToTarget RAF callback:
const animate = (currentTime) => {
  if (!this.animating) return; // Exit if cancelled
  // ... rest of animation
};
```

## Success Criteria Validation

| Criterion                           | How to Verify                                 |
| ----------------------------------- | --------------------------------------------- |
| SC-001: No glitches                 | Manual test: toggle during animation          |
| SC-002: Rapid clicks = 1 transition | Test: call toggleMapMode 10x rapidly          |
| SC-003: Re-enabled < 2s             | Test: measure time from click to enabled      |
| SC-004: Selection preserved         | Test: select region, toggle, verify selection |
| SC-005: No memory leaks             | DevTools: toggle 20x, check heap              |
