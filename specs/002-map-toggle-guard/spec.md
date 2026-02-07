# Feature Specification: Map Toggle Edge Case Guards

**Feature Branch**: `002-map-toggle-guard`
**Created**: 2026-02-05
**Status**: Draft
**Input**: User description: "Add guards for map mode toggle edge cases: block toggle during animation, disable button during transition"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Prevent Accidental Rapid Toggle (Priority: P1)

A user switching between 2D and 3D map views should not be able to cause performance issues or visual glitches by rapidly clicking the toggle button. The system should gracefully handle rapid input by disabling the toggle button during the transition.

**Why this priority**: Rapid toggling can cause queued initialization, memory pressure, and poor user experience. This is the most impactful edge case to address.

**Independent Test**: Can be fully tested by rapidly clicking the 2D/3D toggle button and observing that subsequent clicks are ignored until the transition completes.

**Acceptance Scenarios**:

1. **Given** the map is in 2D mode, **When** the user clicks the toggle button, **Then** the button becomes disabled immediately and shows a visual indicator of the transition in progress
2. **Given** the toggle button is disabled during transition, **When** the user clicks the button again, **Then** the click is ignored and no additional transition is queued
3. **Given** the map transition completes successfully, **When** the new map mode is fully initialized, **Then** the toggle button becomes enabled again
4. **Given** the map transition fails (e.g., WebGL unavailable), **When** the system falls back to 2D mode, **Then** the toggle button is re-enabled after fallback completes

---

### User Story 2 - Clean Animation Interruption (Priority: P2)

A user who toggles map modes while a camera animation is in progress should experience a clean transition without visual artifacts or errors. The current animation should be cancelled gracefully before the map is disposed.

**Why this priority**: Camera animations (zoom to region, zoom to office) are common user actions. Toggling during animation should not cause jarring visual experiences.

**Independent Test**: Can be tested by selecting a region (triggering camera animation), then immediately clicking the toggle button, and observing a clean transition without console errors or visual glitches.

**Acceptance Scenarios**:

1. **Given** a camera animation is in progress (zoom to region/office), **When** the user clicks the toggle button, **Then** the animation is cancelled immediately before map disposal begins
2. **Given** an animation was cancelled, **When** the new map mode initializes, **Then** the selection state (region/office) is correctly restored in the new map
3. **Given** the globe is auto-rotating, **When** the user toggles to 2D mode, **Then** the rotation stops cleanly without causing visual artifacts

---

### Edge Cases

- What happens when toggle is clicked during the brief moment between old map disposal and new map initialization? → Button remains disabled throughout
- What happens when WebGL becomes unavailable mid-transition (e.g., GPU context lost)? → Fallback to 2D gracefully, re-enable button
- What happens when the user navigates away from the page during transition? → No action needed (browser handles cleanup)
- What happens when toggle is triggered programmatically (not via button click)? → Same guards should apply

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST disable the map toggle button immediately when a transition begins
- **FR-002**: System MUST re-enable the toggle button only after the map is fully initialized and ready for interaction
- **FR-003**: System MUST cancel any in-progress camera animation before disposing of the map component
- **FR-004**: System MUST preserve selection state (region/office) across map mode transitions, even when an animation was interrupted
- **FR-005**: System MUST provide visual feedback during the transition (button appears disabled/grayed)
- **FR-006**: System MUST handle transition failures gracefully by re-enabling the toggle button after fallback completes
- **FR-007**: System MUST prevent multiple toggle operations from being queued (at most one transition at a time)

### Key Entities

- **Toggle Button**: UI control that initiates 2D/3D mode switch; has enabled/disabled states
- **Map Transition**: The process of disposing current map and initializing new map mode; has in-progress/complete states
- **Camera Animation**: The animated movement of the 3D camera to a target location; can be active or idle
- **Selection State**: Current region/office selection that must be preserved across transitions

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can toggle map modes without experiencing visual glitches or console errors
- **SC-002**: Rapid clicking on the toggle button (10+ clicks in 1 second) results in exactly one mode transition
- **SC-003**: Toggle button is re-enabled within 2 seconds of clicking, under normal conditions
- **SC-004**: Selection state is correctly preserved in 100% of toggle operations, including during interrupted animations
- **SC-005**: No memory leaks observed when toggling rapidly 20+ times (verified via DevTools memory snapshot)

## Assumptions

- The toggle button already exists in the UI and is functional
- Map disposal methods (`dispose()`) are already implemented and working
- Camera animation state is trackable via existing `animating` property on Map3D
- The existing `toggleMapMode()` method is the single entry point for mode switching
