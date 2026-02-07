# Feature Specification: Map Performance & UX Polish

**Feature Branch**: `008-perf-ux-polish`
**Created**: 2026-02-06
**Status**: Draft
**Input**: User description: "Carefully review the current state of the application. It is working fairly well but the performance isn't up to par. On the 2d map, the markers fade out and become translucent which makes it looks like its performing poorly. Look for ways to improve the user experience as well as other ways to improve performance. The dynamically loaded config in the demo is working really awesome but we have to make sure the entire map works snappy without losing any current effects. There seems to be more than one 'x' (close) button that doesn't perform as one would expect. The navigation looks poor on mobile display and the 2d map barely works on a pro iphone. Mobile-friendliness must be an invariant."

## Design Philosophy

This feature is about making a good application feel great — not about cutting corners. The goal is to fix what's broken (marker opacity, mobile layout, close button behavior) and tighten what's loose (interaction responsiveness), while preserving and enhancing the rich, polished user experience that already exists.

**Core principle: Optimize without compromise.** Every animation, visual effect, drop shadow, hover glow, and transition in the application exists for a reason. Performance improvements MUST be achieved by fixing root causes (e.g., scoping CSS transitions correctly, improving layout efficiency) — never by removing or cheapening effects. If a zoom animation is janky, the fix is to make it smoother, not to remove the easing curve. If a hover effect is slow, the fix is to make it faster, not to replace it with a simpler one.

The bar is professional, premium-quality UI. The map should feel like a product customers are proud to show, on both desktop and mobile.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Markers Stay Fully Opaque on 2D Map (Priority: P1)

A user opens the map in 2D mode and sees all office markers rendered at full opacity immediately. When the user selects a region, markers outside that region dim intentionally (visual distinction), but markers within the selected region remain fully solid and never appear faded or translucent unintentionally. The map feels crisp and responsive at all times.

**Why this priority**: The translucent/faded marker appearance is the primary complaint — it makes the application look broken or slow even when it is functioning correctly. Fixing this has the highest visual impact for the least effort.

**Independent Test**: Can be fully tested by loading the 2D map and verifying that all markers display at full opacity in every view state (USA overview, region selected, office selected). Delivers immediate perceived quality improvement.

**Acceptance Scenarios**:

1. **Given** the 2D map is loaded in USA overview, **When** the user views the map, **Then** all markers display at full opacity with no unintentional translucency
2. **Given** the user selects a region, **When** markers outside the region dim, **Then** markers inside the selected region remain at full opacity (1.0) — only out-of-region markers dim to a clearly intentional reduced opacity
3. **Given** the user deselects a region (returns to USA view), **When** the map resets, **Then** all markers immediately return to full opacity with no lingering fade effect

---

### User Story 2 - Mobile-Friendly Map Experience (Priority: P2)

A user opens the map on an iPhone Pro (or similar mobile device) and the entire application is usable: the 2D map is navigable with touch, markers are tappable, panels are reachable, and navigation is clear. The layout adapts properly to small screens without broken overflow, unusable controls, or hidden content.

**Why this priority**: Mobile-friendliness is an invariant — the map must work on phones. The current 2D map barely functions on iPhone Pro, navigation looks poor on mobile, and this makes the product unusable for a significant portion of users.

**Independent Test**: Can be fully tested by loading the application on an iPhone Pro (or equivalent mobile simulator) and completing the full user journey: view USA map, select a region, select an office, view details, navigate back.

**Acceptance Scenarios**:

1. **Given** a user opens the map on an iPhone Pro, **When** the page loads, **Then** the map fills the available viewport, markers are visible, and the layout does not overflow or require horizontal scrolling
2. **Given** a user taps a region on the mobile 2D map, **When** the map zooms in, **Then** the zoom animation completes smoothly and markers within the region are large enough to tap individually
3. **Given** a user taps a marker on mobile, **When** the details panel appears, **Then** it slides up as a bottom sheet that is scrollable, readable, and does not obscure the entire map
4. **Given** a user wants to navigate back from a detail view on mobile, **When** they look for navigation controls, **Then** the reset/back action is clearly visible and easy to reach with one hand (bottom portion of screen or prominent header control)
5. **Given** a user is viewing the mobile layout, **When** the left sidebar (region list) is displayed, **Then** it is navigable without covering the map entirely and regions are easy to tap

---

### User Story 3 - Close Buttons Behave Predictably (Priority: P3)

A user encounters close/dismiss buttons (the "x" on the details panel, the "x" on the 3D office modal) and each one does what the user expects: it closes or dismisses the immediate panel or modal without resetting the entire application state unexpectedly. Close means "dismiss this thing" — not "go back to the beginning."

**Why this priority**: Unpredictable close button behavior frustrates users and erodes trust in the interface. The details panel close button currently triggers a full application reset (back to USA view) rather than simply closing the panel, which is confusing.

**Independent Test**: Can be tested by opening the details panel (select an office), clicking the close button, and verifying the panel closes while the map stays in its current view state (region or office). Separately, test the 3D office modal close button to confirm it dismisses the modal only.

**Acceptance Scenarios**:

1. **Given** the user is viewing office details in the right panel (region view active), **When** they click the panel's close/X button, **Then** the details panel closes (or collapses) but the map remains on the current region view — it does NOT reset to USA overview
2. **Given** the user is viewing the 3D office modal, **When** they click the modal's close button, **Then** the modal dismisses and the globe remains in its current state (selected region/office still highlighted)
3. **Given** the user is viewing the 3D office modal, **When** they press Escape or click outside the modal, **Then** the modal dismisses identically to clicking the close button
4. **Given** there is a dedicated reset/back-to-start button, **When** the user clicks it, **Then** the full application state resets to USA overview — this is the only control that performs a full reset

---

### User Story 4 - Snappy 2D Map Interactions (Priority: P4)

A user interacts with the 2D map (clicking regions, selecting offices, toggling map modes) and every interaction feels immediate. Region zoom animations are smooth without jank. Switching between map modes completes quickly. The overall experience feels polished and professional.

**Why this priority**: Even after fixing the marker opacity and mobile issues, slow transitions or janky animations will undermine the perceived quality. Ensuring 2D interactions feel snappy rounds out the polish.

**Independent Test**: Can be tested by performing all common user interactions (region select, office select, reset, map toggle) and verifying each completes within acceptable time with no dropped frames or visual stutter.

**Acceptance Scenarios**:

1. **Given** the user is on the USA overview, **When** they click a region, **Then** the zoom animation to that region completes smoothly without visible frame drops
2. **Given** the user is viewing a region, **When** they click the reset/back button, **Then** the map zooms out to USA view smoothly
3. **Given** the user toggles from 2D to 3D mode, **When** the new map loads, **Then** the transition completes and the map is interactive within a reasonable time
4. **Given** the user hovers over markers on the 2D map, **When** the hover effect activates, **Then** the visual feedback appears immediately without delay

---

### User Story 5 - Fast Initial Load (Priority: P5)

A user navigates to the map application (via the demo URL or embedded page) and the map becomes interactive quickly. The loading screen fades out promptly once content is ready. Configuration loading, branding injection, and map initialization happen efficiently without unnecessary delays.

**Why this priority**: Initial load time matters for first impressions, but the dynamic config system is already working well. This story focuses on ensuring no regressions and trimming any unnecessary overhead in the startup sequence.

**Independent Test**: Can be tested by loading the application with browser DevTools open and measuring time-to-interactive. Delivers confidence that performance improvements elsewhere do not regress startup time.

**Acceptance Scenarios**:

1. **Given** a user navigates to the map URL, **When** the page loads, **Then** the loading screen appears immediately and the map becomes interactive promptly
2. **Given** the application loads with a valid client parameter, **When** config files are fetched, **Then** no redundant network requests are made (config loaded once, cached for session)
3. **Given** the user is on a mid-range device, **When** the application loads, **Then** the total time from navigation to interactive map is reasonable for a static site

---

### Edge Cases

- What happens when markers overlap at certain zoom levels on mobile? They should remain individually tappable — if they cannot be separated at the current zoom level, tapping a cluster should zoom in further or show a disambiguation list
- What happens when a user rapidly taps between regions on mobile? The map should complete or cancel the current animation gracefully before starting a new one — no animation queue buildup
- What happens on a low-powered device or one with reduced-motion preferences? The application should respect `prefers-reduced-motion` and degrade gracefully without breaking functionality
- What happens when the mobile device rotates between portrait and landscape? The layout should adapt without requiring a page reload

### Constraint: 3D Globe Non-Regression

The 3D globe is working well and MUST NOT be degraded by changes in this feature. Any code touching the 3D globe component (map-3d.js, office-modal.js) must be limited to close button behavior fixes (FR-013) and must not alter rendering, animation, or interaction logic. The globe's existing optimizations (backface culling, throttled updates, object pooling, hysteresis) are sufficient and should remain untouched.

## Requirements _(mandatory)_

### Functional Requirements

**Marker Opacity (2D Map)**

- **FR-001**: The 2D map MUST render all markers at full opacity (1.0) when no region is selected
- **FR-002**: When a region is selected on the 2D map, markers outside the selected region MUST dim to a clearly reduced opacity, while markers inside the selected region MUST remain at full opacity
- **FR-003**: When a region selection is cleared, all markers MUST return to full opacity immediately — no lingering fade or transition delay
- **FR-004**: The CSS transition on markers MUST be scoped to only the properties that need to animate (e.g., fill, filter), avoiding unintended opacity transitions that create a translucent appearance

**Mobile Experience**

- **FR-005**: The application MUST be fully usable on iPhone Pro and equivalent mobile devices in portrait orientation
- **FR-006**: On mobile screens, the 2D map MUST be navigable via touch — tapping regions and markers MUST work reliably
- **FR-007**: On mobile screens, markers MUST be large enough to tap individually when zoomed into a region view (minimum touch target size of 44x44 CSS pixels)
- **FR-008**: The mobile layout MUST NOT require horizontal scrolling — all content MUST fit within the device viewport width
- **FR-009**: The mobile navigation (region list, breadcrumbs, back/reset controls) MUST be clearly visible and reachable without scrolling to find them
- **FR-010**: The details panel on mobile MUST be scrollable when content exceeds the visible area of the bottom sheet

**Close Button Behavior**

- **FR-011**: The details panel close button MUST close/collapse the details panel only — it MUST NOT reset the application to USA overview
- **FR-012**: After closing the details panel, the map MUST remain in its current view state (region view stays on region, zoom level preserved)
- **FR-013**: The 3D office modal close button, Escape key, and click-outside MUST all dismiss the modal without changing the underlying map state

**2D Map Performance**

- **FR-014**: The 2D map viewBox zoom animation MUST complete without visible frame drops on standard hardware
- **FR-015**: All existing 2D visual effects (marker hover highlighting, selected marker glow, region color coding, drop shadows, easing curves, animated transitions) MUST be preserved at their current quality level or improved — effects MUST NOT be removed, simplified, or replaced with cheaper alternatives
- **FR-016**: The application MUST continue to respect `prefers-reduced-motion` media query for users who have enabled it

**3D Globe Non-Regression**

- **FR-017**: The 3D globe rendering, animation, and interaction logic MUST NOT be modified — changes to 3D-related code are limited to close button/modal dismiss behavior only
- **FR-018**: The 3D globe MUST continue to function identically after all changes — no degradation in frame rate, visual quality, or interactivity

**System Integrity**

- **FR-019**: Map mode toggling (2D/3D) MUST dispose of the previous map's resources cleanly before initializing the new one — no resource leaks
- **FR-020**: The dynamic client config loading MUST remain fully functional with no regressions — config fetched once per session, validated, and cached

## Assumptions

- "Standard hardware" means a device with at least 4GB RAM, 4 CPU cores, and a basic integrated GPU (representative of a typical office workstation or modern laptop)
- "Mobile" primarily means iPhone Pro-class devices (latest generation iOS Safari) and equivalent Android devices
- The current set of offices per client is in the range of 20-50 locations; performance budgets are based on this scale
- The `transition: all 0.2s ease` on `.marker` is a likely contributor to the translucency perception — transitioning opacity alongside fill/filter creates a brief intermediate state where markers appear faded
- The details panel close button currently calls `handleReset()` which resets the entire app to USA view — this is the incorrect behavior that FR-011 addresses
- 3D mode may not be expected to work on all mobile devices — it is acceptable to restrict 3D mode to desktop or hide the toggle on mobile if performance cannot be guaranteed

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All markers on the 2D map display at full opacity in the USA overview — zero markers appear translucent or faded unintentionally
- **SC-002**: A user can complete the full journey (view map, select region, select office, view details, navigate back) on an iPhone Pro without any broken layouts, unreachable controls, or non-functional interactions
- **SC-003**: The details panel close button dismisses the panel only — it does not reset the map to USA overview
- **SC-004**: Region zoom animations on the 2D map complete smoothly with no perceptible frame drops or jank
- **SC-005**: The 3D globe functions identically before and after changes — no degradation in rendering, animation, or interaction
- **SC-006**: Map mode toggling (2D to 3D and back) completes and the new map becomes interactive within 2 seconds
- **SC-007**: All existing visual effects (hover highlights, selected markers, region colors, drop shadows, easing curves, animated transitions) remain at their current quality level or better — no effect is removed, simplified, or visually degraded
- **SC-008**: No increase in initial page load time — time-to-interactive remains at or below current baseline
- **SC-009**: The application passes all existing automated tests after changes
- **SC-010**: No horizontal scrolling required on any mobile viewport 375px or wider
