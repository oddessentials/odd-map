# Research: Fix Marker Highlighting & Panel State Management

**Feature**: 011-fix-marker-panel-state
**Date**: 2026-02-07

## Research Findings

### R1: Close Button → handleReset (direct reset)

**Decision**: Replace `handlePanelClose`'s hierarchical back-navigation with a direct call to `handleReset()` from any state.

**Rationale**: The current hierarchical approach (LOCATION_VIEW → REGION_VIEW → USA_VIEW) produces near-invisible visual transitions, especially at full zoom where marker dimming is identical between LOCATION_VIEW and REGION_VIEW. Users perceive the close button as broken because the first click's only visible change is one marker losing accent color. Calling `handleReset()` directly mirrors what the Reset button does and matches user expectation: X = dismiss everything.

**Alternatives considered**:

- Keep hierarchical but improve visual feedback: Rejected — doesn't solve the fundamental UX mismatch between user expectation (dismiss) and behavior (navigate back one level).
- Add a "close all" button alongside X: Rejected — unnecessary complexity; the X button universally means "dismiss."

**Scope note**: The Escape key handler (`handleKeydown`) currently uses the same hierarchical pattern (LOCATION_VIEW → handleRegionClick). This is a separate behavior from the close button; the spec does not require changing it. The Escape key's hierarchical behavior may be reconsidered in a future feature.

### R2: Subdued Marker State — Visual Tier Design

**Decision**: Add a `subdued` boolean to `MarkerVisualState`. In LOCATION_VIEW, same-region non-selected markers get `subdued: true`. Subdued markers render at ~60% opacity with pointer-events preserved (unlike dimmed markers at 30% opacity with pointer-events disabled).

**Rationale**: Three visual tiers needed:

1. **Selected** (accent color, full opacity) — the office the user clicked
2. **Subdued** (~60% opacity, clickable) — same-region siblings; visible but not competing for attention
3. **Dimmed** (30% opacity, non-interactive) — out-of-region markers

Subdued markers keep `pointer-events: auto` so users can click another office in the same region without first having to navigate to that region.

**Alternatives considered**:

- Just dim same-region markers the same as out-of-region (30%): Rejected — loses spatial context; users can't see what other offices are nearby.
- Use different color instead of opacity: Rejected — conflicts with theme system (color-primary is client-configurable).

**Implementation detail**: `subdued` is true when: `selectedOfficeCode !== null && office.regionName === selectedRegion && office.officeCode !== selectedOfficeCode`. It is mutually exclusive with `dimmed` (dimmed is out-of-region).

### R3: Panel Office-Btn Routing Through App State

**Decision**: Add an `onOfficeClick(office, region)` callback to the `DetailsPanel` options. The `showRegion` method's `.office-btn` click handlers will call this callback instead of directly calling `this.showOffice(office, region)`.

**Rationale**: Currently, clicking an office in the panel's region list calls `showOffice` directly on the panel, bypassing `app.handleOfficeClick`. This means:

- `app.state` stays `REGION_VIEW` while the panel shows office details
- Map doesn't zoom to the office
- Markers don't update
- URL hash doesn't update
- Subsequent close button behavior is wrong (resets instead of navigating)

Routing through the app ensures all state updates happen consistently.

**Alternatives considered**:

- Have the panel dispatch a custom DOM event: Rejected — adds unnecessary indirection; callback pattern matches existing `onClose`.
- Have the panel import and call app methods directly: Rejected — tight coupling; the panel should remain a presentational component.

### R4: hashchange Re-entrancy Prevention

**Decision**: Replace `window.location.hash = ...` with `history.replaceState(null, '', '#...')` in `handleRegionClick` and `handleOfficeClick`. `replaceState` updates the URL without triggering `hashchange`, preventing re-entrancy. Deep-linking via direct URL navigation and browser back/forward still work because those trigger `hashchange` from external sources.

**Rationale**: Currently, `handleRegionClick` sets `window.location.hash`, which fires the `hashchange` listener, which calls `handleRegionClick` again. This causes:

- Animation canceled and restarted mid-flight (visual jank)
- Panel HTML rebuilt redundantly
- Wasted computation

Using `replaceState` instead of direct hash assignment is the standard pattern for updating URL state from within the application without triggering own listeners.

**Alternatives considered**:

- Guard with a `_updatingHash` flag: Rejected — fragile; easy to forget to reset.
- Remove the hashchange listener entirely: Rejected — breaks deep-linking and browser back/forward.
- Use `pushState` instead of `replaceState`: Rejected — `pushState` creates new history entries for every click, polluting browser history. `replaceState` updates the current entry without adding stack entries. Note: `handleReset` already uses `pushState` to clear the hash, which is correct there (the user explicitly navigated away, so a history entry is appropriate).

**Key distinction**:

- `window.location.hash = 'x'` → triggers `hashchange` + creates history entry
- `history.pushState(null, '', '#x')` → does NOT trigger `hashchange` + creates history entry
- `history.replaceState(null, '', '#x')` → does NOT trigger `hashchange` + does NOT create history entry
