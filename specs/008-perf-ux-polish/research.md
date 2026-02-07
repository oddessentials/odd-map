# Research: 008-perf-ux-polish

**Date**: 2026-02-06
**Branch**: `008-perf-ux-polish`

## R1: 2D Marker Opacity / Translucency Root Cause

### Decision

The marker translucency is caused by `transition: all 0.2s ease` on `.marker` (app.css:875). This transitions **every** CSS property — including opacity — over 200ms. When `.marker--dimmed` is toggled (which sets `opacity: 0.3`), the browser smoothly animates the opacity change, creating a visible fade effect that makes markers appear broken or slow.

### Root Cause Trace

1. `computeMarkerStates()` in `marker-state.ts:54` sets `dimmed: true` when `selectedRegion !== null && office.regionName !== selectedRegion`
2. `updateMarkerStates()` in `map-svg.ts:425` toggles `.marker--dimmed` class via `classList.toggle()`
3. `.marker--dimmed` in `app.css:906-909` sets `opacity: 0.3; pointer-events: none;`
4. `.marker` in `app.css:875` has `transition: all 0.2s ease` which animates the opacity change over 200ms
5. Additionally, `ensureMarkersVisible()` in `map-svg.ts:372` sets `markerGroup.style.opacity = '1'` on the parent group element — this inline style on the group could interact with the class-based opacity on the child `.marker` element

### Fix

Replace `transition: all 0.2s ease` with explicit property transitions:

```css
transition:
  fill 0.2s ease,
  filter 0.2s ease,
  stroke-width 0.2s ease;
```

This preserves the smooth hover color change and shadow effects while making opacity changes (dimming) instant — which is the desired behavior since dimming should feel like a state change, not an animation.

### Alternatives Considered

- **Remove `.marker--dimmed` opacity entirely**: Rejected — dimming provides useful visual feedback
- **Add `transition: opacity 0s` override in `.marker--dimmed`**: Rejected — fragile, relies on specificity ordering
- **Use `visibility: hidden` instead of opacity**: Rejected — loses the intentional 30% translucent effect for out-of-region markers

---

## R2: Mobile Layout Issues

### Decision

The mobile layout has multiple compounding problems that make the 2D map barely usable on iPhone Pro. The fix requires restructuring the mobile grid layout, improving touch target sizing, and rethinking the region list placement.

### Root Cause Analysis

**Layout structure (app.css:748-792, 768px breakpoint):**

- Grid changes from `280px 1fr 400px` (3-column) to `1fr` (single column)
- Map section gets `order: 1` with `min-height: 400px`
- Region list (sidebar-left) gets `order: 2` — moved below the map, requiring scroll to reach
- Details panel (sidebar-right) becomes `position: fixed` bottom sheet with `max-height: 50vh`

**iPhone Pro viewport (430×932px):**

- Header: 56px (tokens.css responsive override)
- Map section: 400px minimum
- Remaining for region list: ~476px — pushed below fold
- When bottom sheet opens: covers 466px (50vh), leaving only ~410px visible

**SVG sizing:**

- SVG viewBox is `0 0 960 600` (16:10 aspect ratio)
- Container uses `width: 100%; height: 100%` — SVG fills available space
- On narrow portrait device, map becomes very wide relative to height, markers cluster tightly

**Touch targets:**

- No `touch-action` CSS property set on map container
- Browser pinch-zoom may conflict with viewBox-based zoom
- Marker SVG paths are small (~8×12 SVG units) — may be too small to tap reliably after zoom

**Navigation issues:**

- Region list below map means users must scroll past the map to find regions
- No compact region selector (e.g., dropdown or horizontal scroll) for mobile
- Breadcrumb in header is the only navigation context on mobile

### Fix Strategy

1. Add `touch-action: manipulation` on map container to prevent double-tap zoom conflict
2. Restructure mobile layout: region list as a compact horizontal strip above the map (or collapsible)
3. Ensure map section uses `flex: 1` to fill available vertical space rather than fixed min-height
4. Reduce bottom sheet max-height or add swipe-to-dismiss gesture
5. Ensure markers have adequate touch targets (at minimum via larger hit areas on the marker group)

### Alternatives Considered

- **Keep region list below map**: Rejected — forces scroll to navigate, poor UX
- **Hide region list entirely on mobile**: Rejected — removes primary navigation
- **Use a full-screen modal for region selection**: Rejected — overengineered for 5-6 regions

---

## R3: Close Button Behavior

### Decision

The details panel close button incorrectly triggers a full application reset (`handleReset()`) instead of just dismissing the panel. The office modal close button works correctly.

### Root Cause Trace

**Details Panel (BROKEN):**

1. `details-panel.js:53-55` — Close button calls `this.options.onClose()`
2. `app.ts:176` — `onClose` callback is `() => this.handleReset()`
3. `app.ts:420-436` — `handleReset()` sets state to `USA_VIEW`, clears `selectedRegion` and `selectedOffice`, resets map, clears URL hash, shows placeholder in panel

**Office Modal (CORRECT):**

1. `office-modal.js:152-153` — Close button calls `this.close()`
2. `office-modal.js:227-253` — `close()` removes DOM elements, restores focus, does NOT call back to app.ts
3. Globe state is unaffected — no state machine transition occurs

### Fix

Replace the `onClose` callback with a new `handlePanelClose()` method that navigates back one level in the state hierarchy, matching the Escape key behavior:

```typescript
private handlePanelClose(): void {
  if (this.state === States.LOCATION_VIEW && this.selectedRegion) {
    this.handleRegionClick(this.selectedRegion.name);  // Back to REGION_VIEW
  } else if (this.state === States.REGION_VIEW) {
    this.handleReset();  // Back to USA_VIEW
  }
}
```

This is consistent with the Escape key handler (`app.ts:465-478`) which already implements this back-one-level pattern.

### Alternatives Considered

- **Just hide panel, no state change**: Rejected — leaves app in ambiguous state where panel is hidden but region/office are still "selected"
- **Always go to USA_VIEW**: Current behavior — rejected because it's confusing to users
- **Remove close button entirely**: Rejected — users expect dismiss controls on panels

---

## R4: CSS `transition: all` Best Practices

### Decision

The `transition: all` shorthand is an anti-pattern for performance and correctness. It should be replaced with explicit property transitions throughout the marker styling.

### Rationale

- `transition: all` transitions every CSS property that changes, including layout-triggering properties
- It causes unintended visual artifacts when classes toggle properties that shouldn't animate (like opacity for dimming)
- Explicit transitions are more performant — the browser can optimize for known properties
- MDN and CSS performance guides recommend listing specific properties

### Impact

Only the `.marker` rule needs this change. No other elements in the app use `transition: all` in a problematic way.

---

## R5: 3D Globe Non-Regression Verification

### Decision

No changes to 3D globe rendering, animation, or interaction code. The only 3D-adjacent change is to the office modal close button behavior, which is already working correctly (R3 confirms). No action needed for the 3D globe.

### Rationale

- Globe rendering logic (`map-3d.js`) is not touched by any fix in this feature
- Office modal (`office-modal.js`) close behavior is already correct — no changes needed
- The `handlePanelClose()` fix in `app.ts` only affects the details panel callback, not the modal
- All existing 3D optimizations (backface culling, throttled updates, object pooling, hysteresis) remain untouched
