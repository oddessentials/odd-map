# Feature Specification: Drag Pan & Rotate Behavior

**Feature Branch**: `010-drag-pan-behavior`
**Created**: 2026-02-07
**Status**: Draft
**Input**: User description: "The current branch must be modified so that instead of the mouse-down and drag (or press and drag on mobile) zooming the 2d map in and out, it should allow the user to slide the view around --more akin to google map behavior. On the 3d map the behavior should work left-to-right rather than up and down (so the globe spin feels realistic)."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Drag to Pan the 2D Map (Priority: P1)

A user viewing the 2D map has zoomed in to a specific area and wants to explore nearby regions without zooming back out. They press and hold (mouse button or finger on mobile), then drag in any direction. The visible map area slides in the direction of the drag, just like panning on Google Maps. Dragging left reveals content to the right of the current view, dragging up reveals content below, and so on. This replaces the current vertical-drag-to-zoom behavior.

**Why this priority**: Drag-to-pan is the most fundamental and universally expected map navigation gesture. Without it, users who have zoomed in have no intuitive way to navigate the zoomed view. This is the core value of the feature and directly addresses the user request.

**Independent Test**: Can be fully tested by zooming into the 2D map (via scroll wheel), then pressing and dragging in various directions to slide the view. Delivers immediate value by enabling standard map navigation.

**Acceptance Scenarios**:

1. **Given** the 2D map is zoomed in, **When** the user presses and drags to the left, **Then** the visible map area shifts to reveal content to the right (the view follows the opposite direction of the drag, i.e., the map slides with the cursor)
2. **Given** the 2D map is zoomed in, **When** the user presses and drags upward, **Then** the visible map area shifts to reveal content below
3. **Given** the 2D map is zoomed in, **When** the user presses and drags diagonally, **Then** the visible map area shifts in the corresponding diagonal direction
4. **Given** the 2D map is at its default (fully zoomed out) view, **When** the user presses and drags, **Then** the view does not pan beyond the map boundaries (the map stays within its natural bounds)
5. **Given** the 2D map is zoomed in and panned to a corner, **When** the user drags toward the edge, **Then** the pan stops at the map boundary and does not reveal empty space
6. **Given** a touch device, **When** the user presses and drags on the 2D map, **Then** the pan behavior works identically to mouse drag

---

### User Story 2 - Drag to Rotate the 3D Globe Horizontally (Priority: P1)

A user viewing the 3D globe wants to spin it to explore different geographical areas. They press and hold, then drag left or right. The globe rotates horizontally (longitudinally) in the direction of the drag, creating a natural spinning motion. Dragging right spins the globe so that the visible face moves to the right (new content appears from the left). Vertical drag movement is ignored for rotation, so the globe only spins on its vertical axis -- this feels realistic because real globes spin left and right, not up and down.

**Why this priority**: This is co-equal with the 2D pan as it addresses the second half of the user's request. Horizontal-only drag rotation makes the globe interaction feel physically realistic and intuitive. This modifies the existing drag-rotate behavior to restrict it to horizontal movement only (the current implementation already rotates horizontally, so this story primarily confirms the direction and ensures vertical drag is ignored).

**Independent Test**: Can be fully tested by pressing and dragging left and right on the 3D globe and observing horizontal rotation. Dragging up or down should produce no rotation. Delivers immediate value by providing realistic globe spin control.

**Acceptance Scenarios**:

1. **Given** the 3D globe is displayed, **When** the user presses and drags to the right, **Then** the globe rotates so the visible face moves rightward (counterclockwise when viewed from above)
2. **Given** the 3D globe is displayed, **When** the user presses and drags to the left, **Then** the globe rotates so the visible face moves leftward (clockwise when viewed from above)
3. **Given** the 3D globe is displayed, **When** the user presses and drags vertically (up or down only), **Then** the globe does not rotate
4. **Given** the 3D globe is displayed, **When** the user presses and drags diagonally, **Then** only the horizontal component of the drag causes rotation (vertical component is ignored)
5. **Given** the globe is auto-rotating, **When** the user presses and drags horizontally, **Then** the manual drag rotation overrides auto-rotation during the drag gesture
6. **Given** a touch device, **When** the user presses and drags horizontally on the 3D globe, **Then** the rotation behavior works identically to mouse drag

---

### User Story 3 - Drag Gesture Does Not Trigger Click Actions (Priority: P2)

When a user performs a drag gesture (pan on 2D, rotate on 3D), releasing the press must not trigger a click event on the underlying map element. This prevents accidental region or office selections when the user intended to navigate.

**Why this priority**: This is a supporting behavior that ensures the primary drag interactions feel clean and intentional. Without click suppression, every pan or rotate gesture would accidentally select regions/offices on release.

**Independent Test**: Can be tested by pressing on a region, dragging past the threshold, and releasing -- the region should not be selected.

**Acceptance Scenarios**:

1. **Given** the user presses on a selectable region on the 2D map, **When** they drag beyond the activation threshold and release, **Then** the region is not selected
2. **Given** the user presses on a selectable element on the 3D globe, **When** they drag beyond the activation threshold and release, **Then** the element is not selected
3. **Given** the user presses and releases without dragging (or with movement below the threshold), **When** the press is on a selectable element, **Then** the click/selection behavior works normally

---

### User Story 4 - Removal of Drag-to-Zoom on 2D Map (Priority: P2)

The existing drag-to-zoom behavior on the 2D map (where vertical dragging zooms in and out) must be completely replaced by the new drag-to-pan behavior. Zoom functionality remains available exclusively through the scroll wheel. Users should not experience any residual zoom-on-drag behavior.

**Why this priority**: This is essential for the feature to work correctly. If both drag-zoom and drag-pan coexist, the gestures would conflict. The user explicitly requested that drag should pan instead of zoom.

**Independent Test**: Can be tested by pressing and dragging vertically on the 2D map and confirming the view pans vertically rather than zooming.

**Acceptance Scenarios**:

1. **Given** the 2D map is displayed at any zoom level, **When** the user presses and drags vertically, **Then** the map pans vertically and does not zoom
2. **Given** the 2D map is displayed, **When** the user uses the scroll wheel, **Then** zoom behavior continues to work as before (scroll-wheel zoom is unaffected)

---

### Edge Cases

- What happens when the user drags very rapidly across the map? The pan/rotation should remain smooth and proportional without lag or visual jitter.
- What happens when the user starts a drag on the map and moves the cursor outside the map container? The drag should continue tracking and complete cleanly when released.
- What happens on a touch device when the user starts a single-finger drag while a multi-touch gesture is in progress? Single-finger drag should be the trigger for pan/rotate.
- What happens when the 2D map is fully zoomed out and the user drags? Panning has no effect since the full map is already visible, but the gesture should still be handled gracefully (no errors, no visual glitches).
- What happens when the user drags on the 3D globe while a camera animation (e.g., auto-rotation or click-to-zoom animation) is in progress? The manual drag should take priority and interrupt the animation.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The 2D map MUST pan (translate the visible area) when the user presses and drags in any direction
- **FR-002**: The 2D pan direction MUST follow the cursor/finger -- dragging left moves the view left, making content to the right visible (natural/direct panning)
- **FR-003**: The 2D pan amount MUST be proportional to the drag distance, providing one-to-one correspondence between cursor movement and map movement
- **FR-004**: The 2D map MUST NOT pan beyond the natural map boundaries, preventing empty space from being revealed
- **FR-005**: The 2D map MUST NOT exhibit any drag-to-zoom behavior -- the previous vertical-drag-zoom MUST be completely removed
- **FR-006**: The 2D scroll-wheel zoom MUST continue to function as before, unaffected by the drag behavior change
- **FR-007**: The 3D globe MUST rotate horizontally (around its vertical axis) when the user presses and drags left or right
- **FR-008**: The 3D globe drag rotation MUST respond only to horizontal (left-right) drag movement; vertical drag movement MUST be ignored for rotation purposes
- **FR-009**: The 3D globe rotation direction MUST match the drag direction -- dragging right rotates the visible face to the right
- **FR-010**: The 3D globe drag rotation MUST be proportional to the horizontal drag distance
- **FR-011**: Both maps MUST use a small movement threshold before activating drag mode, preventing accidental drags from interfering with click/tap selections
- **FR-012**: Both maps MUST suppress click events on the underlying elements after a drag gesture that exceeds the activation threshold
- **FR-013**: Both maps MUST support both mouse and touch input for drag gestures
- **FR-014**: The 3D globe drag rotation MUST coexist with the existing auto-rotation toggle and scroll-wheel rotation without conflict

## Assumptions

- "Drag" refers to a press-and-hold followed by movement, using either mouse (pointerdown + pointermove) or touch input. The existing pointer event infrastructure will be reused.
- The activation threshold (small dead zone before drag engages) will remain at or near the current 5-pixel value to prevent accidental drags from triggering on intended clicks.
- Panning on the 2D map uses "natural" or "direct" panning -- the map moves with the cursor, the same convention used by Google Maps, Apple Maps, and all major mapping applications.
- On the 3D globe, horizontal-only rotation means only the X-axis component of drag movement contributes to globe rotation. The existing rotation sensitivity will be preserved or tuned slightly for the new behavior.
- When the 2D map is fully zoomed out, there is nothing to pan, so the drag gesture is a no-op visually but still tracked correctly (threshold, click suppression, etc.).
- The existing drag-rotate behavior on the 3D globe already works in the correct horizontal direction; this feature primarily confirms that behavior and ensures the vertical component is fully ignored.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can pan the zoomed-in 2D map to any area within the map boundaries using drag gestures, reaching opposite edges within 3 seconds of continuous dragging
- **SC-002**: Users can rotate the 3D globe a full 360 degrees using only horizontal drag gestures within 5 seconds of continuous dragging
- **SC-003**: Drag interactions feel responsive with no perceptible delay between input and visual feedback (under 100ms perceived latency)
- **SC-004**: Zero accidental region/office selections occur during normal drag-to-pan or drag-to-rotate gestures
- **SC-005**: All existing map interactions (scroll-wheel zoom on 2D, scroll-wheel rotation on 3D, click-to-select regions, click-to-select offices, keyboard navigation, auto-rotation toggle) continue to function correctly after the drag behavior changes
- **SC-006**: Drag-to-pan and drag-to-rotate work consistently across modern desktop and mobile browsers (Chrome, Firefox, Edge, Safari)
