# Feature Specification: First-Class Mobile Experience

**Feature Branch**: `013-mobile-experience`
**Created**: 2026-02-07
**Status**: Draft
**Input**: User description: "Our map is currently working awesome on desktop. However, we need to be certain that we are serving a first-class mobile experience without impacting the existing desktop UX."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Touch Navigation on the Map (Priority: P1)

A mobile user opens the office locator on their phone. They can pan the 2D map by dragging with one finger, zoom in/out with a pinch gesture, and tap on a region to select it. The map responds smoothly to touch input with no jank, accidental scrolling, or unintended region selections during gestures. The same interactions continue to work identically with a mouse on desktop.

**Why this priority**: Touch navigation is the foundation of the mobile experience. If users cannot comfortably navigate the map with standard mobile gestures, no other mobile improvements matter.

**Independent Test**: Can be fully tested by loading the app on a mobile device, panning, pinching, and tapping regions. Delivers usable map navigation on touch screens.

**Acceptance Scenarios**:

1. **Given** the 2D map is displayed on a mobile device, **When** the user drags with one finger, **Then** the map pans smoothly in the drag direction without triggering page scroll or accidental region clicks
2. **Given** the 2D map is displayed on a mobile device, **When** the user performs a pinch gesture with two fingers, **Then** the map zooms in or out centered on the midpoint of the two touches
3. **Given** the user is pinch-zooming, **When** they lift both fingers, **Then** no region selection or marker click is triggered
4. **Given** the map is on a desktop browser, **When** the user scrolls and clicks with a mouse, **Then** behavior is unchanged from today (scroll-wheel zoom, click-to-select)

---

### User Story 2 - Details Panel as Bottom Sheet (Priority: P2)

When a mobile user taps a region or office, the details panel slides up from the bottom of the screen as a "bottom sheet." The user can scroll the panel content with one finger, swipe down to dismiss it, and the map remains visible behind it. On desktop, the panel continues to appear in the right sidebar as it does today.

**Why this priority**: The details panel is the primary way users consume office information. A cramped or hard-to-dismiss panel on mobile makes the core workflow frustrating.

**Independent Test**: Can be tested by selecting a region on mobile, scrolling the panel, and swiping to dismiss. Delivers comfortable information browsing on small screens.

**Acceptance Scenarios**:

1. **Given** a mobile device with the map loaded, **When** the user taps a region, **Then** the details panel slides up from the bottom, covering no more than 50% of the screen
2. **Given** the bottom sheet is open with scrollable content, **When** the user scrolls up inside the panel, **Then** the panel content scrolls without the panel itself dismissing
3. **Given** the bottom sheet is open and scrolled to the top, **When** the user swipes down on the panel, **Then** the panel dismisses (slides back down) revealing the full map
4. **Given** a desktop browser, **When** the user clicks a region, **Then** the panel opens in the right sidebar exactly as it does today

---

### User Story 3 - Comfortable Touch Targets and Tap Accuracy (Priority: P2)

On a mobile device, all interactive elements (region shapes, office list buttons, close buttons, mode selectors, expand buttons) are large enough to tap accurately with a finger. Users do not accidentally trigger the wrong action due to small hit areas or tightly packed controls.

**Why this priority**: Undersized tap targets are the most common mobile usability failure. Users who cannot accurately tap controls will abandon the experience.

**Independent Test**: Can be tested by tapping every interactive element on a mobile device and confirming each responds correctly without requiring precision taps. Delivers frustration-free interaction.

**Acceptance Scenarios**:

1. **Given** a mobile device, **When** the user taps a region on the 2D map, **Then** the correct region is selected on the first attempt (hit area is at least 44x44 points)
2. **Given** the office list in the details panel, **When** the user taps an office button, **Then** only that office is selected (buttons have sufficient spacing and size)
3. **Given** the panel close button, mode selector buttons, and expand button, **When** the user taps each, **Then** each responds correctly (minimum 44x44 point touch target)
4. **Given** a desktop browser, **When** the user clicks any interactive element, **Then** the behavior and visual appearance are unchanged

---

### User Story 4 - iOS Safe Area and Notch Handling (Priority: P3)

On devices with notches, rounded corners, or home indicator bars (modern iPhones, some Android devices), the app content is not obscured by hardware features. The header, bottom sheet, and any fixed-position controls respect the device safe area insets.

**Why this priority**: Without safe area handling, content is clipped or hidden behind hardware features on the most popular mobile devices, making the app feel broken.

**Independent Test**: Can be tested by loading the app on a notched device (or simulator) in both portrait and landscape. Delivers professional appearance on modern phones.

**Acceptance Scenarios**:

1. **Given** a device with a notch (e.g., iPhone 14+), **When** the app loads in portrait mode, **Then** the header content is fully visible below the notch/status bar
2. **Given** the bottom sheet is open on a device with a home indicator bar, **When** the user views the panel, **Then** the panel content is not obscured by the home indicator
3. **Given** a device in landscape orientation, **When** the user views the app, **Then** content avoids the notch cutout on both left and right sides
4. **Given** a desktop browser or device without safe area insets, **When** the app loads, **Then** layout is unchanged from today

---

### User Story 5 - 3D Globe Touch Rotation (Priority: P3)

A mobile user viewing the 3D globe can rotate it by dragging with one finger and the experience feels natural. The globe does not "stick" or jump unexpectedly. Pinch-to-zoom is not expected on the 3D globe (rotation only), and this is communicated through natural interaction feel.

**Why this priority**: The 3D globe is a secondary view mode, but touch rotation must feel natural for the map to be credible on mobile.

**Independent Test**: Can be tested by switching to 3D mode on a mobile device and dragging to rotate. Delivers smooth globe rotation via touch.

**Acceptance Scenarios**:

1. **Given** the 3D globe is displayed on a mobile device, **When** the user drags with one finger, **Then** the globe rotates smoothly in the drag direction
2. **Given** the user is dragging the 3D globe, **When** they lift their finger, **Then** no region is accidentally selected (drag threshold prevents tap)
3. **Given** a desktop browser in 3D mode, **When** the user drags with a mouse, **Then** the rotation behavior is unchanged

---

### User Story 6 - Tile Map Mode on Mobile (Priority: P3)

When the tile map (MapLibre or Apple Maps) is active on mobile, the user can pan, pinch-zoom, and tap markers using standard mobile map gestures. The tile map should feel like a native mapping app. Cluster markers expand when tapped, and individual office markers open the details panel.

**Why this priority**: The tile map is the most map-like mode and users expect native-quality mobile interactions when using it.

**Independent Test**: Can be tested by activating tile map mode on mobile, panning, zooming, tapping clusters and markers. Delivers native-feeling map interaction.

**Acceptance Scenarios**:

1. **Given** the tile map is displayed on a mobile device, **When** the user drags with one finger, **Then** the map pans smoothly
2. **Given** the tile map on mobile, **When** the user performs a pinch gesture, **Then** the map zooms in/out smoothly
3. **Given** a cluster marker on the tile map, **When** the user taps it, **Then** the map zooms into the cluster to reveal individual markers
4. **Given** an individual office marker, **When** the user taps it, **Then** the details panel opens with that office's information

---

### Edge Cases

- What happens when the user rotates their device while the details panel is open? (Panel should remain open and adjust its layout)
- What happens when the user opens the expand overlay (full-screen mini-map) on mobile? (Overlay should fill the viewport respecting safe areas, close button must be reachable)
- What happens when the mobile keyboard is open (e.g., future search feature)? (Layout should not break; content should shift up as needed)
- What happens on a very small screen (< 320px width)? (Content should remain usable, no horizontal overflow)
- What happens with slow network on mobile? (Map tiles and provider scripts should show loading states, not blank areas)
- What happens when a user switches between 2D, 3D, and tile map modes on mobile? (Mode switching should work identically to desktop; selected region/office should persist)

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The 2D SVG map MUST support pinch-to-zoom on touch devices, zooming centered on the midpoint of the two touch points
- **FR-002**: The 2D SVG map MUST distinguish between a tap (select region) and a drag gesture (pan), using a motion threshold to prevent accidental selections during pans
- **FR-003**: The 2D SVG map MUST distinguish between a single-finger drag (pan) and a two-finger pinch (zoom), not panning during an active pinch gesture
- **FR-004**: All interactive elements (buttons, region shapes, office list items, markers) MUST have a minimum touch target size of 44x44 CSS points
- **FR-005**: The details panel MUST display as a bottom sheet on mobile viewports (width ≤ 768px) that slides up from the bottom and can be dismissed by swiping down
- **FR-006**: The bottom sheet MUST allow scrolling its content without triggering a dismiss gesture when the content is not scrolled to the top
- **FR-007**: Fixed-position elements (header, bottom sheet, expand overlay) MUST respect device safe area insets to avoid content being obscured by notches, rounded corners, or home indicator bars
- **FR-008**: The expand overlay (full-screen mini-map) MUST fill the viewport while respecting safe area insets, with the close button positioned within the safe area
- **FR-009**: The 3D globe MUST support one-finger drag rotation on touch devices, with the same drag threshold used on desktop to prevent accidental region selection
- **FR-010**: All mobile changes MUST NOT alter the existing desktop experience when the viewport is wider than 768px
- **FR-011**: The tile map mode MUST support native touch gestures (pan, pinch-zoom, tap markers) through the underlying map provider's built-in touch handling
- **FR-012**: The mode selector (2D/3D/Tile toggle) MUST be comfortably usable on mobile with appropriately sized touch targets

### Non-Functional Requirements

- **NFR-001**: Touch gesture responses (pan, zoom, rotate) MUST feel smooth with no perceptible lag (visual feedback within one animation frame)
- **NFR-002**: Mobile-specific styles MUST be delivered through the same stylesheet, not a separate mobile bundle, to avoid layout flashes on load
- **NFR-003**: All mobile improvements MUST be implemented using progressive enhancement — the app must remain fully functional if any mobile-specific feature fails to load

## Assumptions

- The 768px breakpoint already used in the codebase is the correct mobile/desktop split point. No additional breakpoints are needed.
- The existing Pointer Events API usage in map-svg.ts and map-3d.js already provides basic touch support; the main gaps are pinch-to-zoom on the 2D map and swipe-to-dismiss on the bottom sheet.
- MapLibre GL JS and Apple MapKit JS already provide high-quality native touch interactions for the tile map — no custom touch handling is needed for that mode.
- "Mobile" in this context means smartphones and tablets. The primary concern is touchscreen interaction, not specifically small screens.
- The existing 40vh max-height for the mobile bottom sheet panel is approximately correct; 50% is an acceptable upper limit to keep the map visible.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can navigate the 2D map (pan, zoom, select region) on a mobile device using only touch gestures, completing all actions on the first attempt without accidental triggers
- **SC-002**: Users can open, scroll, and dismiss the details panel on mobile in under 3 seconds per action
- **SC-003**: All interactive elements pass a 44x44 CSS point minimum touch target audit
- **SC-004**: The app displays correctly on devices with safe area insets (notched phones) with no content obscured by hardware features
- **SC-005**: All existing desktop interactions (mouse scroll-zoom, click-to-select, drag-to-pan, sidebar panel) work identically after mobile changes are applied
- **SC-006**: The app loads and is interactive on a mid-range mobile device within 5 seconds on a 4G connection
- **SC-007**: Switching between 2D, 3D, and tile map modes on mobile works without errors or layout shifts
