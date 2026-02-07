# Feature Specification: Fix Marker Highlighting & Panel State Management

**Feature Branch**: `011-fix-marker-panel-state`
**Created**: 2026-02-07
**Status**: Draft
**Input**: User description: "Fix marker highlighting, close button behavior, hashchange re-entrancy, and panel office-btn state bypass"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Close Button Fully Dismisses Selection (Priority: P1)

A user has selected an office location on the map. The office details are displayed in the right panel. The user clicks the "X" close button on the right panel. Both sidebars reset to their fresh/default state, the map zooms out to the full USA view, and all location markers on the map return to their default (fully lit) appearance.

**Why this priority**: The close button is the primary way users dismiss a selection. When it appears non-responsive or requires multiple clicks, users lose trust in the interface. This is the most impactful user-facing bug.

**Independent Test**: Can be tested by selecting any office marker, then clicking the X button. The entire UI should reset to its initial state in a single click.

**Acceptance Scenarios**:

1. **Given** an office is selected (right panel shows office details, left panel shows region), **When** the user clicks the X close button, **Then** the right panel resets to the default "Select a Location" placeholder, the left panel resets to its default region list (no region highlighted), the map zooms out to the full USA view, and all markers display at full opacity.
2. **Given** a region is selected (right panel shows region info, left panel highlights the region), **When** the user clicks the X close button, **Then** both panels reset to their default state, the map zooms out, and all markers display at full opacity.
3. **Given** no selection is active (USA view), **When** the user clicks the X close button, **Then** nothing happens (no-op).
4. **Given** an office is selected and the user has manually zoomed out to the full map, **When** the user clicks X, **Then** the UI still fully resets (no confusing zoom-into-region animation).

---

### User Story 2 - Selected Office Marker Visually Distinguished (Priority: P2)

A user selects an office location on the map. The selected marker should be clearly visually distinguished from all other markers, including other markers in the same region. Non-selected same-region markers should appear subdued (but not fully dimmed like out-of-region markers) so the user can clearly identify which specific office is selected.

**Why this priority**: When all same-region markers appear identical except for a subtle color change on one, users cannot tell which office they selected. This creates confusion about the map's current state.

**Independent Test**: Can be tested by selecting any office marker and visually confirming that only the selected marker appears prominently highlighted, while same-region siblings are subdued and out-of-region markers are dimmed.

**Acceptance Scenarios**:

1. **Given** no selection is active (USA view), **When** looking at the map, **Then** all markers appear at full opacity with the default color.
2. **Given** a region is selected (region view), **When** looking at the map, **Then** all markers within the selected region appear at full opacity and out-of-region markers appear dimmed.
3. **Given** an office is selected (location view), **When** looking at the map, **Then** the selected marker appears with the accent highlight color, same-region non-selected markers appear subdued (reduced opacity but still visible), and out-of-region markers appear fully dimmed.
4. **Given** an office is selected and the user zooms all the way out, **When** looking at the full map, **Then** the selected marker is still clearly distinguishable from all other markers at a glance.

---

### User Story 3 - Panel Office List Buttons Maintain Consistent State (Priority: P3)

When viewing a region's details in the right panel, the panel displays a list of offices in that region. Clicking an office name in this list should behave identically to clicking the corresponding marker on the map: the app state, map view, marker highlighting, and panel content should all update consistently.

**Why this priority**: When panel office buttons update the panel display without updating the rest of the application, the map markers and app state become out of sync. This creates unpredictable behavior on subsequent interactions.

**Independent Test**: Can be tested by selecting a region, clicking an office name in the panel's office list, and verifying that the map zooms to the office, the correct marker is highlighted, and clicking X behaves correctly afterward.

**Acceptance Scenarios**:

1. **Given** a region is selected and the panel shows the region's office list, **When** the user clicks an office name in the panel, **Then** the app transitions to location view, the map zooms to the selected office, the correct marker is highlighted with accent color, same-region markers are subdued, and the panel shows full office details.
2. **Given** the user selected an office via the panel's office list, **When** the user clicks the X close button, **Then** the full reset behavior occurs (same as User Story 1).

---

### User Story 4 - No Redundant State Processing on Navigation (Priority: P4)

When the user interacts with the map (selecting regions, offices, or clicking close), each action should trigger state processing exactly once. The system should not redundantly re-process the same action due to URL hash change listeners re-firing the same handler.

**Why this priority**: While not directly user-visible, redundant processing causes mid-animation restarts (visual jank) and unnecessary DOM re-renders. Fixing this improves perceived responsiveness.

**Independent Test**: Can be tested by verifying that selecting a region or office triggers state update logic exactly once (no doubled animation or re-render).

**Acceptance Scenarios**:

1. **Given** the user clicks a region on the map, **When** the region click handler updates the URL hash, **Then** the hashchange listener does not redundantly re-invoke the same region click handler.
2. **Given** the user clicks an office marker, **When** the office click handler updates the URL hash, **Then** the hashchange listener does not redundantly re-invoke the same office click handler.
3. **Given** the user navigates via browser back/forward buttons, **When** the URL hash changes, **Then** the hashchange listener correctly processes the navigation as expected (deep-linking still works).

---

### Edge Cases

- What happens when the user rapidly clicks X multiple times? The system should handle this gracefully without animation conflicts or state corruption.
- What happens when the user selects an office, manually zooms out, then clicks X? The reset should zoom out to full view (not zoom into the region first).
- What happens when the user selects an office via the panel list, then switches between 2D and 3D mode? The state should remain consistent.
- What happens when the user navigates directly via URL hash (deep link) to an office? The state should initialize correctly with proper marker highlighting.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The close button MUST fully reset the application to USA view in a single click from any selection state (location view or region view).
- **FR-002**: The close button MUST reset the right panel to its default "Select a Location" placeholder content.
- **FR-003**: The close button MUST reset the left panel (region list) to its default state with no region highlighted.
- **FR-004**: The close button MUST zoom the map out to the full USA view.
- **FR-005**: The close button MUST clear all marker dimming so all markers appear at full opacity.
- **FR-006**: The close button MUST clear the URL hash.
- **FR-007**: When an office is selected, the marker state system MUST distinguish three visual tiers: selected marker (accent highlight), same-region non-selected markers (subdued), and out-of-region markers (fully dimmed).
- **FR-008**: Clicking an office name in the right panel's region office list MUST update the full application state (not just the panel display).
- **FR-009**: URL hash updates triggered by user interactions (clicks) MUST NOT cause the hashchange listener to redundantly re-invoke the same handler that set the hash.
- **FR-010**: The hashchange listener MUST continue to function correctly for browser back/forward navigation and deep-link URLs.
- **FR-011**: All existing tests MUST continue to pass (close-button tests will need to be updated to reflect the new single-step close behavior).

### Key Entities

- **Marker Visual State**: Represents a marker's appearance. Currently has three states (selected, normal, dimmed). Must be extended with a fourth state (subdued) for same-region non-selected markers during office selection.
- **Application State**: The state machine governing view transitions (USA_VIEW, REGION_VIEW, LOCATION_VIEW). The close button behavior changes from hierarchical back-navigation to direct reset.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can dismiss any selection (office or region) with a single click of the X button, returning to the full map view.
- **SC-002**: When an office is selected, the selected marker is visually distinguishable from all other markers at any zoom level within 1 second of glancing at the map.
- **SC-003**: Clicking an office in the panel's region list produces identical application behavior to clicking the same office's marker on the map.
- **SC-004**: No user interaction causes the same state handler to execute more than once per action.
- **SC-005**: All existing automated tests pass, with close-button tests updated to reflect the new single-step reset behavior.

## Assumptions

- The "subdued" visual state for same-region non-selected markers will use a moderate opacity reduction (e.g., 50-60%) to distinguish them from both fully-lit selected markers and fully-dimmed (30%) out-of-region markers.
- The existing Escape key shortcut (which calls handleReset) already implements the desired close behavior; the close button should mirror this.
- Deep-linking via URL hash must remain functional — the fix for hashchange re-entrancy must not break direct URL navigation.
- The 3D globe renderer should receive the same marker state updates (including the new subdued tier) as the 2D SVG renderer.
