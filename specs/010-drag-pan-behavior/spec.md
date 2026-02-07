# Feature Specification: Drag/Touch Pan Behavior for 2D Zoom and 3D Globe Rotation

**Feature Branch**: `010-drag-pan-behavior`
**Created**: 2026-02-06
**Status**: Draft
**Input**: User description: "Click and hold (drag) or touch and hold (mobile) are required for the 2d and 3d map. 2d map must zoom in and out when the user holds and drags on the map. 3d map must cause globe to spin left or right when the user holds and drags over the globe."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Drag-to-Zoom on 2D Map (Priority: P1)

A user viewing the 2D SVG map wants to zoom in or out by clicking and dragging (desktop) or touching and dragging (mobile). They press and hold on the map, then drag vertically — dragging upward zooms in toward the initial press point, and dragging downward zooms out away from the initial press point. The zoom is smooth and proportional to the drag distance, and is centered on the point where the user initially pressed down.

**Why this priority**: Drag-to-zoom is the primary interaction for this feature on the 2D map. It enables intuitive exploration on both desktop and mobile devices, filling a critical interaction gap that scroll-wheel zoom alone cannot address (mobile devices have no scroll wheel). This is the highest-value enhancement because it enables the most common map exploration workflow on touch devices.

**Independent Test**: Can be fully tested by clicking/tapping and dragging vertically on the 2D map. Delivers immediate value by enabling zoom control on all device types.

**Acceptance Scenarios**:

1. **Given** the 2D map is displayed at its default view, **When** the user clicks and holds on the map then drags upward, **Then** the map zooms in toward the initial click position proportionally to the drag distance
2. **Given** the 2D map is zoomed in, **When** the user clicks and holds on the map then drags downward, **Then** the map zooms out away from the initial click position proportionally to the drag distance
3. **Given** the 2D map is at maximum zoom, **When** the user drags upward, **Then** the zoom level does not exceed the maximum (clamped)
4. **Given** the 2D map is at minimum zoom (full view), **When** the user drags downward, **Then** the zoom level does not go below the minimum (clamped)
5. **Given** the user is on a mobile device viewing the 2D map, **When** the user touches and drags vertically on the map, **Then** the map zooms in or out identically to the desktop click-and-drag behavior
6. **Given** the user releases the mouse button or lifts their finger, **When** the drag gesture ends, **Then** the zoom level remains at its current position (no snap-back or drift)

---

### User Story 2 - Drag-to-Rotate on 3D Globe (Priority: P1)

A user viewing the 3D globe wants to manually rotate it by clicking and dragging (desktop) or touching and dragging (mobile). They press and hold on the globe, then drag horizontally — dragging left causes the globe to spin left, and dragging right causes it to spin right. The rotation is smooth and proportional to the drag distance.

**Why this priority**: This is co-equal with the 2D zoom as it fulfills the other half of the feature request. Globe rotation via drag provides an intuitive direct-manipulation feel that complements the existing auto-rotation toggle and scroll-wheel rotation, and is the only rotation method available on mobile devices.

**Independent Test**: Can be fully tested by clicking/tapping and dragging horizontally on the 3D globe. Delivers immediate value by enabling manual globe exploration on all device types.

**Acceptance Scenarios**:

1. **Given** the 3D globe is displayed, **When** the user clicks and holds on the globe then drags to the left, **Then** the globe rotates to the left proportionally to the drag distance
2. **Given** the 3D globe is displayed, **When** the user clicks and holds on the globe then drags to the right, **Then** the globe rotates to the right proportionally to the drag distance
3. **Given** the globe is auto-rotating, **When** the user clicks and drags on the globe, **Then** auto-rotation pauses for the duration of the drag, and the manual drag rotation is applied instead
4. **Given** the user releases the mouse button or lifts their finger after dragging the globe, **When** the drag gesture ends, **Then** auto-rotation resumes (if it was enabled) from the globe's current rotational position
5. **Given** the user is on a mobile device viewing the 3D globe, **When** the user touches and drags horizontally on the globe, **Then** the globe rotates identically to the desktop click-and-drag behavior

---

### User Story 3 - Drag Gesture Does Not Conflict with Existing Interactions (Priority: P2)

When a user drags on either map, the drag gesture must not interfere with existing click-to-select behavior (clicking a region or office marker) or with normal page scrolling outside the map area. A short click (without significant drag distance) should still trigger the existing selection behavior.

**Why this priority**: This is essential for a polished user experience but is a supporting behavior rather than a primary feature. Without proper gesture discrimination, drag behavior would break the existing click-to-select interactions that users rely on.

**Independent Test**: Can be tested by clicking on regions/markers (short click without dragging) and verifying selection still works, then dragging and verifying zoom/rotation occurs without triggering selection.

**Acceptance Scenarios**:

1. **Given** the user is on either map, **When** the user clicks briefly on a region or marker without dragging, **Then** the existing selection behavior fires normally (region highlights, office details appear)
2. **Given** the user is on either map, **When** the user clicks and drags beyond a small threshold distance, **Then** the drag gesture is recognized and selection behavior is suppressed
3. **Given** the user's cursor or finger is outside the map area, **When** the user attempts to scroll or drag, **Then** normal page behavior continues unaffected
4. **Given** the user begins a drag inside the map and moves the cursor outside the map boundary, **When** the cursor exits the map area, **Then** the drag gesture is cleanly terminated and the map state remains stable

---

### Edge Cases

- What happens when the user drags very quickly (fast flick gesture)? The system should handle rapid movement gracefully without lag, visual jitter, or excessive zoom/rotation overshoot.
- What happens when the user drags on the map while a region/office zoom animation is in progress on the 2D map? The drag-zoom should cancel the animation and take over control from the current zoom state.
- What happens when the user drags on the globe while a camera animation is in progress on the 3D globe? The manual drag rotation should take precedence, pausing auto-rotation and overriding the animation.
- What happens when the user uses multi-touch gestures (e.g., pinch-to-zoom)? Multi-touch gestures are outside the scope of this feature and should not be intercepted. Only single-finger/single-pointer drag is handled.
- What happens on devices with both mouse and touch input (e.g., laptops with touchscreens)? Both input methods should work independently and produce the same behavior.
- What happens when the user right-clicks and drags? Only primary button (left-click) drags should trigger zoom/rotation. Right-click drags should be ignored.
- What happens when the user starts a drag on one map and the view switches to the other map mid-drag? The drag gesture should be cleanly terminated when the map view changes.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The 2D map MUST zoom in when the user clicks/touches and drags upward on the map
- **FR-002**: The 2D map MUST zoom out when the user clicks/touches and drags downward on the map
- **FR-003**: The 2D drag-zoom MUST be centered on the position where the user initially pressed down, not the center of the viewport
- **FR-004**: The 2D drag-zoom amount MUST be proportional to the vertical drag distance
- **FR-005**: The 2D zoom level MUST be clamped between a minimum (full map view) and a maximum (closest zoom) to prevent over-zooming
- **FR-006**: The 3D globe MUST rotate to the left when the user clicks/touches and drags to the left on the globe
- **FR-007**: The 3D globe MUST rotate to the right when the user clicks/touches and drags to the right on the globe
- **FR-008**: The 3D globe rotation amount MUST be proportional to the horizontal drag distance
- **FR-009**: The 3D drag-rotation MUST pause auto-rotation for the duration of the drag gesture and resume it upon release (if auto-rotation was enabled)
- **FR-010**: Both maps MUST support touch input (single-finger drag) with identical behavior to mouse drag
- **FR-011**: Both maps MUST distinguish between a short click/tap (which triggers existing selection behavior) and a drag gesture (which triggers zoom/rotation), using a minimum drag distance threshold
- **FR-012**: Both maps MUST NOT interfere with normal page interactions when the cursor/finger is outside the map area
- **FR-013**: Both maps MUST handle rapid drag movements without visual jitter or performance degradation
- **FR-014**: Only primary pointer input (left mouse button, single finger touch) MUST trigger drag behavior; secondary inputs (right-click, multi-touch) MUST be ignored
- **FR-015**: The drag gesture MUST terminate cleanly when the user releases the pointer, lifts their finger, or moves the pointer outside the map boundary

## Assumptions

- "Drag upward" means moving the pointer/finger toward the top of the screen (negative Y direction), which zooms in. "Drag downward" means moving toward the bottom of the screen (positive Y direction), which zooms out.
- "Drag left/right" for the 3D globe refers to horizontal pointer movement, which maps to longitudinal rotation around the globe's vertical axis.
- The drag distance threshold for distinguishing a click from a drag will use a sensible default (e.g., 5-10 pixels of movement). No specific numeric threshold is prescribed.
- Zoom speed/sensitivity and rotation speed/sensitivity will use sensible defaults tuned during implementation. No specific numeric targets are prescribed.
- The existing scroll-wheel zoom (2D) and scroll-wheel rotation (3D) from feature 009 remain fully functional alongside the new drag behaviors. Both input methods coexist.
- Existing click-to-select regions, click-to-select offices, keyboard navigation, and all other current interactions remain fully functional and unaffected.
- Multi-touch gestures (pinch-to-zoom, two-finger rotate) are explicitly out of scope for this feature.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can zoom from minimum to maximum zoom level on the 2D map using a single drag gesture within 3 seconds
- **SC-002**: Users can rotate the 3D globe a full 360 degrees using a single drag gesture by dragging across the full width of the globe area
- **SC-003**: Drag interactions feel responsive with no perceptible delay between pointer movement and visual feedback (under 50ms perceived latency)
- **SC-004**: Short clicks on regions and office markers continue to trigger selection behavior with 100% reliability after drag behavior is added
- **SC-005**: Drag behavior works identically on touch devices (mobile/tablet) and desktop devices with a mouse
- **SC-006**: All existing map interactions (click-to-select regions, click-to-select offices, keyboard navigation, scroll-wheel zoom/rotation, auto-rotation toggle) continue to function correctly after drag behavior is added
- **SC-007**: Drag behavior works consistently across modern browsers (Chrome, Firefox, Edge, Safari) on both desktop and mobile
