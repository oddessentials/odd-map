# Feature Specification: Globe Rotation Toggle

**Feature Branch**: `003-globe-rotation-toggle`
**Created**: 2026-02-05
**Status**: Draft
**Input**: User description: "Make the 3d globe never spin default. Then, add a rotate or spin icon the user can click to animate it."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Static Globe by Default (Priority: P1)

When users first load the 3D map view, the globe should be stationary rather than continuously spinning. This provides a stable, professional viewing experience that doesn't distract from the map content (office locations, regions).

**Why this priority**: This is the foundational change - without disabling default rotation, the toggle button would have no effect on first load. Users expect interactive maps to be stable until they interact with them.

**Independent Test**: Load the 3D map view and observe that the globe remains stationary. User can still manually rotate via drag interaction.

**Acceptance Scenarios**:

1. **Given** the application loads with 3D view, **When** the page finishes loading, **Then** the globe is stationary (not auto-rotating)
2. **Given** the globe is stationary, **When** the user drags on the globe, **Then** the globe rotates following the user's drag gesture (manual rotation still works)
3. **Given** the globe is stationary, **When** the user selects a region or office, **Then** the camera animates to the selection (selection animations still work)

---

### User Story 2 - Spin Toggle Button (Priority: P2)

Users can click a spin/rotate button to start or stop the globe's automatic rotation animation. This gives users control over whether they want the ambient spinning effect.

**Why this priority**: This builds on US1 by adding user control. Once the globe is static by default, users need a way to enable spinning if desired.

**Independent Test**: Click the spin button and verify the globe starts rotating; click again and verify it stops.

**Acceptance Scenarios**:

1. **Given** the globe is stationary, **When** the user clicks the spin button, **Then** the globe begins continuous auto-rotation
2. **Given** the globe is auto-rotating, **When** the user clicks the spin button, **Then** the globe stops rotating and becomes stationary
3. **Given** the globe is auto-rotating, **When** the user clicks the spin button, **Then** the button visual state updates to reflect the stopped state
4. **Given** the globe is stationary, **When** the user clicks the spin button, **Then** the button visual state updates to reflect the spinning state

---

### User Story 3 - Spin Button Visual Design (Priority: P3)

The spin button should have clear visual iconography (rotate/spin icon) and appropriate styling that matches the existing UI (similar to the 2D/3D toggle button).

**Why this priority**: Visual polish is important but secondary to core functionality. The button must work first, then look good.

**Independent Test**: Inspect the spin button and verify it has an appropriate icon, matches UI styling, and has proper hover/active states.

**Acceptance Scenarios**:

1. **Given** the 3D view is active, **When** the user views the controls, **Then** a spin button with a rotation icon is visible
2. **Given** the spin button is visible, **When** the user hovers over it, **Then** appropriate hover styling is applied
3. **Given** the spin button is visible, **When** auto-rotation is active, **Then** the button indicates the active state (e.g., different icon or highlighted appearance)

---

### Edge Cases

- What happens when the user switches from 3D to 2D and back while spinning was enabled? (Spin state should reset to default off)
- What happens when the user selects a region/office while auto-rotation is active? (Auto-rotation should pause during camera animation, then resume if it was active)
- What happens if the user drags the globe while auto-rotation is active? (Auto-rotation should stop when user initiates manual interaction)
- Should the spin button be visible in 2D mode? (No, it should only appear when 3D mode is active)

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST initialize the 3D globe with auto-rotation disabled by default
- **FR-002**: System MUST display a spin toggle button when the 3D map view is active
- **FR-003**: System MUST hide the spin toggle button when the 2D map view is active
- **FR-004**: Users MUST be able to start auto-rotation by clicking the spin button when rotation is stopped
- **FR-005**: Users MUST be able to stop auto-rotation by clicking the spin button when rotation is active
- **FR-006**: System MUST update the spin button visual state to reflect current rotation status
- **FR-007**: System MUST stop auto-rotation when the user initiates manual drag interaction on the globe
- **FR-008**: System MUST pause auto-rotation during camera animations (region/office selection) and resume after if it was active
- **FR-009**: System MUST reset auto-rotation state to off when switching between 2D and 3D views

### Key Entities

- **AutoRotation State**: Boolean flag tracking whether auto-rotation is enabled; persists during the 3D session but resets on view switch
- **Spin Toggle Button**: UI control element that toggles auto-rotation; only visible in 3D mode; shows active/inactive state

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Globe is stationary on 100% of initial 3D view loads (no automatic spinning)
- **SC-002**: Users can toggle auto-rotation on/off with a single click
- **SC-003**: Spin button state accurately reflects rotation state at all times
- **SC-004**: Manual drag interaction immediately stops any active auto-rotation
- **SC-005**: All existing map functionality (region selection, office selection, view switching) continues to work correctly

## Assumptions

- The existing `autoRotate` property in Map3D can be leveraged for controlling rotation state
- The spin button will be placed near the existing 2D/3D toggle button for consistency
- A standard rotation/sync icon (e.g., circular arrows) will be used for the button
- The rotation speed when enabled will match the existing auto-rotation speed in the codebase
