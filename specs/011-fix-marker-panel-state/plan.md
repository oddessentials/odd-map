# Implementation Plan: Fix Marker Highlighting & Panel State Management

**Branch**: `011-fix-marker-panel-state` | **Date**: 2026-02-07 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/011-fix-marker-panel-state/spec.md`

## Summary

Fix four interrelated bugs in the map's marker/panel state management: (1) close button directly resets to USA_VIEW instead of hierarchical back-navigation, (2) add "subdued" visual tier for same-region non-selected markers during office selection, (3) route panel office-list clicks through the app state machine, (4) prevent hashchange re-entrancy by using `history.replaceState` instead of direct hash assignment.

## Technical Context

**Language/Version**: TypeScript 5.7 (ES2022 target), JavaScript (map-3d.js)
**Primary Dependencies**: Three.js 0.182, Vite 7.3.1
**Storage**: N/A — UI state only, no persistence
**Testing**: Vitest 4.0.17
**Target Platform**: Modern browsers (desktop + mobile)
**Project Type**: Single project (static web app)
**Performance Goals**: 60fps rendering, no perceptible delay on state transitions
**Constraints**: No runtime API calls, offline-capable static deployment
**Scale/Scope**: ~8 files modified, ~4 test files updated/created

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status | Notes                                                                                  |
| ------------------------------------ | ------ | -------------------------------------------------------------------------------------- |
| I. Deterministic Data Pipeline       | PASS   | No data pipeline changes                                                               |
| II. Build-Time Coordinate Resolution | PASS   | No coordinate changes                                                                  |
| III. Enterprise Testing Standards    | PASS   | Tests updated for new behavior; existing baseline maintained                           |
| IV. Performance Budgets              | PASS   | No rendering changes; CSS opacity is GPU-composited                                    |
| V. Accessibility First               | PASS   | Close button behavior simplified (more intuitive); subdued markers keep pointer-events |
| VI. Zero Runtime Backend             | PASS   | No backend or API changes                                                              |

**Architectural Invariants:**

| Invariant                              | Status     | Notes                                                                          |
| -------------------------------------- | ---------- | ------------------------------------------------------------------------------ |
| 4. Single Marker State Update Function | PASS       | `computeMarkerStates` extended with `subdued` field; remains centralized       |
| 5. Shared Application State            | PASS (fix) | Panel office-btn bypass VIOLATES this invariant today; fix restores compliance |
| 6. Three Mandatory UI Modes            | PASS       | Close button now maps both LOCATION_VIEW and REGION_VIEW to USA_VIEW           |

**Post-design re-check**: All principles pass. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/011-fix-marker-panel-state/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── quickstart.md        # Phase 1 output
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── app.ts                        # State machine: handlePanelClose, hash management
├── lib/
│   └── marker-state.ts           # Centralized marker state computation
├── components/
│   ├── details-panel.js          # Right panel: onOfficeClick callback
│   ├── map-svg.ts                # 2D renderer: subdued CSS class toggle
│   └── map-3d.js                 # 3D renderer: subdued opacity handling
└── styles/
    └── app.css                   # .marker--subdued CSS class

tests/
├── close-button.test.ts          # Updated: direct-reset behavior
└── marker-state.test.ts          # Updated: subdued state tests
```

**Structure Decision**: Single project structure. All changes are in existing files within `src/` and `tests/`. No new files or directories needed (except `data-model.md` is omitted — no data model changes).

## Implementation Details

### Change 1: Close Button → Direct Reset (FR-001 through FR-006)

**File**: `src/app.ts`

**Current** (`handlePanelClose`, line 420):

```typescript
private handlePanelClose(): void {
  if (this.state === States.LOCATION_VIEW && this.selectedRegion) {
    this.handleRegionClick(this.selectedRegion.name);
  } else if (this.state === States.REGION_VIEW) {
    this.handleReset();
  }
}
```

**New**:

```typescript
private handlePanelClose(): void {
  if (this.state !== States.USA_VIEW) {
    this.handleReset();
  }
}
```

This calls `handleReset()` from either LOCATION_VIEW or REGION_VIEW. `handleReset` already does everything needed: clears state, clears hash, resets map (zooms out), resets both panels, dispatches marker states.

**Note**: The Escape key handler (`handleKeydown`, line 473) retains its existing hierarchical behavior. The spec does not require changing it; it is a separate interaction pattern (progressive undo) that may be revisited in a future feature.

### Change 2: Subdued Marker State (FR-007)

**File**: `src/lib/marker-state.ts`

Add `subdued` to `MarkerVisualState` interface (line 36):

```typescript
export interface MarkerVisualState {
  officeCode: string;
  regionName: string;
  visible: boolean;
  selected: boolean;
  highlighted: boolean;
  dimmed: boolean;
  subdued: boolean; // NEW
}
```

Update `computeMarkerStates` (line 48):

```typescript
return allOffices.map((office) => ({
  officeCode: office.officeCode,
  regionName: office.regionName,
  visible: true,
  selected: office.officeCode === selectedOfficeCode,
  highlighted: office.officeCode === hoveredOfficeCode,
  dimmed: selectedRegion !== null && office.regionName !== selectedRegion,
  subdued:
    selectedOfficeCode !== null &&
    selectedRegion !== null &&
    office.regionName === selectedRegion &&
    office.officeCode !== selectedOfficeCode,
}));
```

Logic: `subdued` is true when an office IS selected AND this marker is in the same region but is NOT the selected office. Mutually exclusive with `dimmed` (which is for out-of-region markers).

**File**: `src/styles/app.css`

Add after `.marker--dimmed` (line 961):

```css
.marker--subdued {
  opacity: 0.55;
}
```

Note: `pointer-events` is NOT disabled for subdued markers — users can still click them to switch selection.

**File**: `src/components/map-svg.ts`

Add CSS class toggle in `updateMarkerStates` (line 700, after dimmed toggle):

```typescript
marker.classList.toggle('marker--subdued', state.subdued);
```

**File**: `src/components/map-3d.js`

Add subdued handling in `updateMarkerStates` (after the dimmed block):

```javascript
if (state.subdued) {
  marker.children.forEach((child) => {
    if (child.material && !child.userData.isGlow) {
      child.material.transparent = true;
      child.material.opacity = 0.55;
    }
    if (child.userData.isGlow) {
      child.material.opacity = 0;
    }
  });
  continue;
}
```

### Change 3: Panel Office-Btn Routing (FR-008)

**File**: `src/components/details-panel.js`

Update constructor options (line 14):

```javascript
this.options = {
  onClose: options.onClose || (() => {}),
  onOfficeClick: options.onOfficeClick || null, // NEW
};
```

Update `showRegion` office-btn handlers (line 118):

```javascript
// Current (direct panel call):
this.showOffice(office, region);

// New (route through app if callback exists):
if (this.options.onOfficeClick) {
  this.options.onOfficeClick(office, region);
} else {
  this.showOffice(office, region);
}
```

**File**: `src/app.ts`

Update DetailsPanel instantiation (line 175):

```typescript
this.panel = new DetailsPanel(this.panelContainer, {
  onClose: () => this.handlePanelClose(),
  onOfficeClick: (office: Office, region: Region) => this.handleOfficeClick(office, region),
});
```

### Change 4: hashchange Re-entrancy Prevention (FR-009, FR-010)

**File**: `src/app.ts`

In `handleRegionClick` (line 376), replace:

```typescript
window.location.hash = `region=${encodeURIComponent(regionName)}`;
```

with:

```typescript
history.replaceState(null, '', `#region=${encodeURIComponent(regionName)}`);
```

In `handleOfficeClick` (line 409), replace:

```typescript
window.location.hash = `office=${encodeURIComponent(office.officeCode)}`;
```

with:

```typescript
history.replaceState(null, '', `#office=${encodeURIComponent(office.officeCode)}`);
```

`replaceState` updates the URL bar without triggering `hashchange`, preventing re-entrancy. Browser back/forward buttons still trigger `hashchange` from the browser's navigation machinery, so deep-linking continues to work.

**Trade-off**: `replaceState` does not create new browser history entries. This means clicking three different offices won't create three back-button entries. This is acceptable because:

- The reset button and X button provide explicit navigation
- Hash-based history in SPAs is fragile anyway
- Users don't expect back-button granularity within embedded map widgets

### Test Updates (FR-011)

**File**: `tests/close-button.test.ts`

Update test expectations:

- LOCATION_VIEW → X click → `handleReset` called (was: `handleRegionClick`)
- REGION_VIEW → X click → `handleReset` called (unchanged)
- USA_VIEW → X click → no-op (unchanged)
- Remove "LOCATION_VIEW without selectedRegion" edge case (no longer needed — all non-USA states call handleReset)

**File**: `tests/marker-state.test.ts`

Add new test cases:

- When an office is selected, same-region non-selected markers have `subdued: true`
- When an office is selected, the selected marker has `subdued: false`
- When an office is selected, out-of-region markers have `subdued: false` (dimmed instead)
- When no office is selected (region view), all markers have `subdued: false`
- When nothing is selected (USA view), all markers have `subdued: false`

## Complexity Tracking

> No constitution violations. Table intentionally empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| (none)    |            |                                      |
