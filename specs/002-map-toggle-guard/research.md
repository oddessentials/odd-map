# Research: Map Toggle Edge Case Guards

**Feature**: 002-map-toggle-guard
**Date**: 2026-02-05

## Current Implementation Analysis

### toggleMapMode() Flow

The current `App.toggleMapMode()` method in `src/app.ts:159-186`:

1. Captures selection state (regionName, officeCode)
2. Flips `use3D` flag
3. Awaits `initMap()` which disposes old map and creates new one
4. Updates toggle button text
5. Restores selection state

**Gap identified**: No guard prevents multiple invocations while transition is in progress.

### Animation State in Map3D

The `Map3D.animateToTarget()` method in `src/components/map-3d.js:708-739`:

1. Sets `this.animating = true` at start
2. Uses `requestAnimationFrame` loop for camera lerp
3. Sets `this.animating = false` on completion

**Gap identified**: No method to cancel animation mid-flight. The `animating` flag exists but isn't exposed for external cancellation.

---

## Research Topic 1: Button Disable Pattern for Async Operations

### Decision: Use `transitioning` state flag with immediate button disable

### Rationale

The standard pattern for preventing duplicate async operations is:

1. Set a flag at operation start
2. Check flag before allowing new operation
3. Clear flag on completion (success or failure)

For UI feedback, the button should be disabled via the `disabled` attribute, which:

- Prevents click events natively
- Provides visual feedback via CSS `:disabled` pseudo-class
- Supports ARIA via implicit `aria-disabled="true"`

### Implementation Approach

```typescript
// In App class
private transitioning: boolean = false;

private async toggleMapMode(): Promise<void> {
  if (this.transitioning) return; // Guard
  this.transitioning = true;
  this.setToggleButtonEnabled(false);

  try {
    // ... existing toggle logic
  } finally {
    this.transitioning = false;
    this.setToggleButtonEnabled(true);
  }
}

private setToggleButtonEnabled(enabled: boolean): void {
  if (this.mapToggleBtn) {
    (this.mapToggleBtn as HTMLButtonElement).disabled = !enabled;
  }
}
```

### Alternatives Considered

1. **Debounce/throttle**: Rejected - adds latency, doesn't prevent queueing during long transitions
2. **Remove click listener during transition**: Rejected - more complex, doesn't provide visual feedback
3. **CSS pointer-events: none**: Rejected - doesn't communicate disabled state to assistive technology

---

## Research Topic 2: Animation Cancellation in Three.js

### Decision: Add `cancelAnimation()` method to Map3D that clears animating flag and stops RAF loop

### Rationale

Three.js animations using `requestAnimationFrame` can be cancelled by:

1. Storing the RAF ID and calling `cancelAnimationFrame()`
2. Setting a flag that the animation loop checks

Since `animateToTarget()` uses an inline function reference, we need to track the RAF ID. However, for simplicity, we can add a cancellation flag.

### Implementation Approach

```javascript
// In Map3D class
cancelAnimation() {
  this.animating = false;
  // The next RAF callback will see animating=false and exit
}

// Update dispose() to call cancelAnimation() first
dispose() {
  this.cancelAnimation();
  // ... rest of disposal
}
```

The animation loop in `animateToTarget()` already checks `progress < 1` but doesn't check for external cancellation. We'll add a check:

```javascript
const animate = (currentTime) => {
  if (!this.animating) return; // Cancellation check
  // ... existing logic
};
```

### Alternatives Considered

1. **Store RAF ID and cancelAnimationFrame()**: Rejected - requires tracking ID, more complex
2. **Promise-based animation with AbortController**: Rejected - over-engineered for this use case
3. **Immediate camera position set**: Rejected - may cause jarring visual jump

---

## Research Topic 3: Selection State Preservation During Animation Interruption

### Decision: Capture selection state BEFORE any map operations, restore AFTER new map is ready

### Rationale

The current implementation already captures `wasRegionName` and `wasOfficeCode` before toggle. This pattern is correct. The key insight is that selection state is held in the App controller, not the Map component, so it survives the toggle.

**No changes needed** - existing implementation handles this correctly.

### Verification

From `src/app.ts:160-165`:

```typescript
const wasRegionName = this.selectedRegion?.name ?? null;
const wasOfficeCode = this.selectedOffice?.office_code ?? null;
const wasOffice = this.selectedOffice;
const wasRegion = this.selectedRegion;
```

These are captured before `initMap()` and restored after. Animation state in the old map is irrelevant since the map is disposed.

---

## Research Topic 4: CSS Disabled State Styling

### Decision: Use `:disabled` pseudo-class with opacity and cursor changes

### Rationale

Standard disabled button styling that meets accessibility requirements:

```css
#map-toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none; /* Backup for older browsers */
}
```

### Implementation Approach

Check if `src/styles/main.css` already has toggle button styles. If not, add the disabled state styling.

---

## Dependencies & Best Practices

### TypeScript Patterns

- Use `finally` block for cleanup to ensure flag is always cleared
- Cast button element to `HTMLButtonElement` for `disabled` property access

### Three.js Patterns

- Check `this.animating` flag at start of RAF callback for clean cancellation
- Call `cancelAnimation()` before `dispose()` to prevent orphaned RAF callbacks

### Testing Patterns

- Mock `requestAnimationFrame` for deterministic animation tests
- Test rapid-click scenario with multiple synchronous toggle calls
- Test toggle during animation by triggering selectRegion then immediate toggle

---

## Conclusion

All research complete. No NEEDS CLARIFICATION markers remain. Ready for Phase 1 design.
