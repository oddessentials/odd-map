# Review False Alarms

Findings from static analysis / code review that were triaged as non-issues.

## F1. `touch-action: none` and `cursor: grab` scoped to `.map-container`

**Claim**: These styles are applied globally to `body`, breaking page scrolling.

**Reality**: Both properties are scoped to `.map-container` (`src/styles/app.css`), which is a fixed-size element within the CSS grid layout. Page scrolling and touch interactions outside the map are unaffected.

## F2. `handleReset()` re-entrancy guard breadth

**Claim**: The re-entrancy guard is too broad and may mask legitimate nested resets.

**Reality**: The only re-entry path is `handleReset()` -> `map.reset()` -> `onReset` callback -> `handleReset()`. All callers (reset button, Escape key, panel close) are user-initiated and mutually exclusive. The `try/finally` properly resets the guard on exception. Narrowing the guard would add complexity without benefit.

## F3. `wasDragging` only cleared on click, not on `pointerdown`

**Claim**: `wasDragging` should be cleared on `pointerdown` to avoid stale state.

**Reality**: This is intentional. The flag suppresses the browser-synthesized click event after a drag gesture ends. It must persist through `pointerup` -> `click` to catch that event. Clearing on `pointerdown` would break suppression. In both 2D and 3D maps, `wasDragging` is set in `pointerup` (only when actually dragging) and cleared in the click handler after suppression -- the standard pattern.

## F4. `setPointerCapture` deferred to threshold crossing

**Claim**: Deferring `setPointerCapture` to threshold crossing may lose pointer events before the threshold is met.

**Reality**: This is the intentional design from the marker-click fix. Capturing immediately on `pointerdown` retargeted click events to the container, preventing marker clicks. Deferring capture to threshold crossing is the fix. Pre-threshold pointer loss (user moves pointer off container before 5px) is acceptable -- it cancels the potential drag, which is correct UX.

## F5. `SENSITIVITY` constant hardcoded in `drag-rotate-3d.test.ts`

**Claim**: The test hardcodes `0.005` to match `DRAG_ROTATION_SENSITIVITY` in `map-3d.js` and should import it.

**Reality**: The tests use property-based assertions (sign, proportionality, linearity). The constant is only used to set up expected values. Exporting internal constants couples the public API to test needs. If sensitivity is tuned, the tests should intentionally be updated to reflect new expected behavior -- a silent pass would be worse.

## F6. innerHTML XSS concerns

Security item -- excluded from this triage per scope agreement. Note: the codebase already uses `escapeHtml()` for user-controlled data and `textContent` for dynamic strings.

## F7. Console.log format string injection

Security item -- excluded from this triage per scope agreement.
