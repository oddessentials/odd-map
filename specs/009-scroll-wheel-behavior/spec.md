# Feature Specification: Scroll-Wheel Behavior Enhancements

**Feature Branch**: `009-scroll-wheel-behavior`
**Created**: 2026-02-06
**Status**: Draft
**Input**: User description: "Mouse scroll-wheel behavior enhancements are required for the 2d and 3d map. 2d map must zoom in and out when the user uses the scroll wheel over the map. 3d map must cause globe to spin left or right when the user scrolls the wheel up or down over the globe."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Scroll-Wheel Zoom on 2D Map (Priority: P1)

A user viewing the 2D SVG map wants to zoom in to examine a specific region more closely, or zoom out to see the full map. They position their mouse cursor over the map area and scroll their mouse wheel. Scrolling up zooms in toward the cursor position, and scrolling down zooms out away from the cursor position. The zoom is smooth, incremental, and centered on the cursor's location on the map.

**Why this priority**: Scroll-wheel zoom is the most universally expected map interaction pattern. Users instinctively try to scroll-zoom on any map interface, and the absence of this behavior feels broken. This is the highest-value enhancement because it directly impacts the most common exploration workflow.

**Independent Test**: Can be fully tested by hovering over the 2D map and scrolling the mouse wheel up and down. Delivers immediate value by enabling intuitive spatial exploration.

**Acceptance Scenarios**:

1. **Given** the 2D map is displayed at its default view, **When** the user scrolls the mouse wheel up while the cursor is over the map, **Then** the map zooms in toward the cursor position with a smooth transition
2. **Given** the 2D map is zoomed in, **When** the user scrolls the mouse wheel down while the cursor is over the map, **Then** the map zooms out away from the cursor position with a smooth transition
3. **Given** the 2D map is at maximum zoom, **When** the user scrolls the mouse wheel up, **Then** the zoom level does not change (clamped at maximum)
4. **Given** the 2D map is at minimum zoom (full view), **When** the user scrolls the mouse wheel down, **Then** the zoom level does not change (clamped at minimum)
5. **Given** the user's cursor is outside the map area, **When** the user scrolls the mouse wheel, **Then** the page scrolls normally and the map is unaffected

---

### User Story 2 - Scroll-Wheel Globe Spin on 3D Map (Priority: P1)

A user viewing the 3D globe wants to manually rotate the globe to explore different areas. They position their mouse cursor over the globe and scroll their mouse wheel. Scrolling up causes the globe to spin in one direction (left), and scrolling down causes it to spin in the opposite direction (right). The rotation is smooth and proportional to the scroll amount.

**Why this priority**: This is co-equal with the 2D zoom as it fulfills the other half of the feature request. Globe rotation via scroll wheel provides an intuitive manual control mechanism that complements the existing auto-rotation toggle, giving users direct control over what part of the globe they see.

**Independent Test**: Can be fully tested by hovering over the 3D globe and scrolling the mouse wheel up and down. Delivers immediate value by enabling manual globe exploration.

**Acceptance Scenarios**:

1. **Given** the 3D globe is displayed, **When** the user scrolls the mouse wheel up while the cursor is over the globe, **Then** the globe rotates to the left with a smooth animation
2. **Given** the 3D globe is displayed, **When** the user scrolls the mouse wheel down while the cursor is over the globe, **Then** the globe rotates to the right with a smooth animation
3. **Given** the globe is auto-rotating, **When** the user scrolls the mouse wheel over the globe, **Then** the manual scroll rotation is applied on top of the auto-rotation
4. **Given** the user's cursor is outside the 3D map area, **When** the user scrolls the mouse wheel, **Then** the page scrolls normally and the globe is unaffected

---

### User Story 3 - Consistent Scroll Prevention (Priority: P2)

When a user is interacting with either map via scroll wheel, the underlying page must not scroll simultaneously. This prevents the jarring experience of the page jumping while the user is trying to zoom or rotate the map.

**Why this priority**: This is essential for a polished user experience but is a supporting behavior rather than a primary feature. Without scroll prevention the map interactions would feel broken, but this story exists to ensure it is explicitly tested.

**Independent Test**: Can be tested by scrolling over either map and verifying the page does not scroll while the map responds to the scroll input.

**Acceptance Scenarios**:

1. **Given** the cursor is over the 2D map, **When** the user scrolls the mouse wheel, **Then** the page does not scroll and the map zooms instead
2. **Given** the cursor is over the 3D globe, **When** the user scrolls the mouse wheel, **Then** the page does not scroll and the globe rotates instead
3. **Given** the cursor moves from the map area to outside the map, **When** the user scrolls the mouse wheel, **Then** normal page scrolling resumes

---

### Edge Cases

- What happens when the user scrolls very rapidly (many wheel events in quick succession)? The system should handle rapid input gracefully without lag or visual jitter.
- What happens on a trackpad with continuous/momentum scrolling? The behavior should feel natural and proportional, not overly sensitive.
- What happens when the user scrolls while a region/office zoom animation is in progress on the 2D map? The scroll-zoom should either queue after or override the animation smoothly.
- What happens when the user scrolls while a camera animation is in progress on the 3D globe? The manual rotation should either queue after or blend with the animation.
- What happens on touch devices that generate synthetic wheel events from pinch gestures? The existing `touch-action: manipulation` should continue to prevent conflicts.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The 2D map MUST zoom in when the user scrolls the mouse wheel up (or forward) while the cursor is positioned over the map
- **FR-002**: The 2D map MUST zoom out when the user scrolls the mouse wheel down (or backward) while the cursor is positioned over the map
- **FR-003**: The 2D zoom MUST be centered on the cursor's position on the map, not the center of the viewport
- **FR-004**: The 2D zoom level MUST be clamped between a minimum (full map view) and a maximum (closest zoom) to prevent over-zooming or negative zoom
- **FR-005**: The 2D zoom MUST apply smoothly with each scroll increment, providing a fluid visual transition
- **FR-006**: The 3D globe MUST rotate to the left when the user scrolls the mouse wheel up (or forward) while the cursor is over the globe
- **FR-007**: The 3D globe MUST rotate to the right when the user scrolls the mouse wheel down (or backward) while the cursor is over the globe
- **FR-008**: The 3D globe rotation amount MUST be proportional to the scroll delta, providing fine-grained control
- **FR-009**: The 3D scroll-wheel rotation MUST coexist with the existing auto-rotation toggle without conflict
- **FR-010**: Both maps MUST prevent default page scrolling when the cursor is over the map and a scroll event occurs
- **FR-011**: Both maps MUST NOT interfere with normal page scrolling when the cursor is outside the map area
- **FR-012**: Both maps MUST handle rapid successive scroll events without visual jitter or performance degradation

## Assumptions

- "Scroll up" and "scroll down" refer to the standard mouse wheel directions (up = forward/away from user, down = backward/toward user). Trackpad two-finger scroll follows the same convention.
- The zoom center on the 2D map is cursor-relative (zoom toward/away from where the cursor is pointing), which is the standard behavior users expect from map interfaces.
- Globe "left" and "right" rotation refers to horizontal (longitudinal) rotation around the globe's vertical axis, which is the most useful axis for exploring a globe focused on the USA.
- Rotation speed and zoom step sizes will use sensible defaults tuned during implementation. No specific numeric targets are prescribed.
- Existing click-to-zoom and click-to-select behaviors on both maps remain fully functional and unaffected.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can zoom in and out of the 2D map using only the scroll wheel, reaching both maximum and minimum zoom levels within 5 seconds of continuous scrolling
- **SC-002**: Users can rotate the 3D globe a full 360 degrees using only the scroll wheel within 10 seconds of continuous scrolling
- **SC-003**: Scroll-wheel interactions feel responsive with no perceptible delay between scroll input and visual feedback (under 100ms perceived latency)
- **SC-004**: Page scrolling is completely suppressed while the cursor is over either map during scroll-wheel use
- **SC-005**: All existing map interactions (click-to-select regions, click-to-select offices, keyboard navigation, auto-rotation toggle) continue to function correctly after scroll-wheel behavior is added
- **SC-006**: Scroll-wheel behavior works consistently across modern desktop browsers (Chrome, Firefox, Edge, Safari)
