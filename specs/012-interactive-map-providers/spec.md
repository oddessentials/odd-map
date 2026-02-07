# Feature Specification: Interactive Map Providers

**Feature Branch**: `012-interactive-map-providers`
**Created**: 2026-02-07
**Status**: Draft
**Input**: User description: "Very carefully explore how we might be able to use the following libraries to further enhance our product. MapLibre and OpenStreetMap. peaceandquiet.com does an impressive job utilizing these libraries. We also have a key to Apple Maps Web for our demo which might provide users with a premium experience alongside our current Google Maps solution."

## Background & Motivation

The application currently displays office locations on a custom 2D SVG map and a 3D Three.js globe, with a Google Maps iframe embed in the details panel for street-level context. While functional, this approach has limitations:

- The details panel mini-map is a basic iframe embed with no interactivity beyond what Google provides
- There is no interactive street-level or neighborhood-level map view as a primary map mode
- The application cannot offer map provider choice to different clients (e.g., a premium Apple Maps experience for demos vs. a free/open-source MapLibre + OpenStreetMap solution for cost-conscious deployments)
- The current Google Maps embed cannot be styled or branded to match client themes

This feature introduces a **map provider abstraction** that allows the application to render interactive, tile-based maps using multiple providers -- starting with MapLibre (backed by OpenStreetMap tiles) as the open-source default and Apple MapKit JS as a premium option. This replaces the static Google Maps iframe in the details panel and opens the door to a future full-screen interactive tile map mode alongside the existing SVG and 3D views.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Interactive Mini-Map in Details Panel (Priority: P1)

When a user selects an office from the map or sidebar, the details panel displays an interactive mini-map centered on that office's location. The mini-map supports pan and zoom gestures, shows the office marker with a branded pin, and provides a smooth, embedded map experience -- replacing the current static Google Maps iframe.

**Why this priority**: This is the most visible improvement and the foundation for all other stories. It replaces an existing feature (Google Maps iframe) with a superior interactive experience that loads faster, respects client branding, and doesn't depend on a third-party iframe.

**Independent Test**: Can be fully tested by selecting any office and verifying the mini-map renders with correct location, marker, pan/zoom, and branded styling.

**Acceptance Scenarios**:

1. **Given** a user has selected an office with known coordinates, **When** the details panel renders, **Then** an interactive mini-map appears centered on the office location with a visible marker
2. **Given** the mini-map is displayed, **When** the user drags or pinch-zooms the mini-map, **Then** the map pans and zooms smoothly without affecting the main map view
3. **Given** the mini-map is displayed, **When** the user clicks the marker or a "Get Directions" control, **Then** they are navigated to an external directions service in a new tab
4. **Given** the application is configured to use MapLibre, **When** the mini-map renders, **Then** it uses OpenStreetMap tiles with no API key required and proper OSM attribution is displayed
5. **Given** a user switches from one office to another, **When** the mini-map updates, **Then** the map smoothly animates (fly-to) from the previous location to the new one rather than jumping abruptly
6. **Given** the mini-map has not yet been needed, **When** the application initially loads, **Then** no map provider code is downloaded -- the library is loaded on-demand only when the details panel first displays a mini-map
7. **Given** the mini-map is displayed in the details panel, **When** the user clicks an expand button, **Then** the map opens in a larger overlay/lightbox view for full neighborhood exploration with the same marker, pan, and zoom capabilities
8. **Given** the expanded map overlay is open, **When** the user closes it (close button, Escape key, or clicking outside), **Then** it returns to the inline mini-map view without losing map state (position/zoom)
9. **Given** the user is in 3D globe mode and clicks an office marker, **When** the office modal opens, **Then** it includes the same interactive mini-map with identical capabilities (pan, zoom, expand, directions) as the 2D details panel

---

### User Story 2 - Configurable Map Provider per Client (Priority: P2)

Different clients can be configured to use different map providers for the mini-map. The "demo" client uses Apple MapKit JS for a premium look, while other clients default to MapLibre + OpenStreetMap (free, no API key). The provider choice is set in the client configuration file and requires no code changes.

**Why this priority**: This enables the sales demo use case (Apple Maps for premium feel) and cost optimization (MapLibre for production clients with no per-request charges). It builds directly on P1's foundation.

**Independent Test**: Can be tested by switching between two client configurations and verifying the mini-map renders with the correct provider's tiles and visual style.

**Acceptance Scenarios**:

1. **Given** a client configuration specifies "maplibre" as the map provider, **When** the details panel mini-map renders, **Then** it uses OpenStreetMap tiles via MapLibre with proper attribution
2. **Given** a client configuration specifies "apple" as the map provider with a valid token, **When** the details panel mini-map renders, **Then** it uses Apple Maps tiles with Apple's visual style
3. **Given** a client configuration does not specify a map provider, **When** the mini-map renders, **Then** it defaults to MapLibre + OpenStreetMap
4. **Given** a client configuration specifies "apple" but the token is missing or invalid, **When** the mini-map attempts to render, **Then** it falls back to MapLibre + OpenStreetMap and logs a warning

---

### User Story 3 - Branded Map Styling (Priority: P3)

The interactive mini-map visual style adapts to match the client's brand theme. Colors, marker appearance, and map tone (light/dark) align with the client configuration so the map feels like a native part of the application rather than a third-party embed.

**Why this priority**: Enhances perceived quality and white-label readiness. Depends on P1 and P2 infrastructure being in place.

**Independent Test**: Can be tested by configuring two clients with different brand colors and verifying the mini-map marker and overall tone differ accordingly.

**Acceptance Scenarios**:

1. **Given** a client has a primary brand color defined in their theme, **When** the mini-map renders a marker, **Then** the marker uses the client's brand color
2. **Given** the MapLibre provider is active, **When** the mini-map renders, **Then** the map style (light or dark tone) matches the application's current visual mode
3. **Given** the Apple Maps provider is active, **When** the mini-map renders, **Then** the map uses Apple's native styling with the client's brand color applied to markers

---

### User Story 4 - Full-Screen Interactive Tile Map Mode (Priority: P4)

Users can switch to a full-screen interactive tile map as a third map mode (alongside 2D SVG and 3D Globe). This mode shows all office locations on an interactive MapLibre or Apple Maps base with clustering, smooth fly-to animations on selection, and region boundary overlays. This is the capstone UX enhancement — a modern, explorable map experience as the primary navigation surface.

**Why this priority**: This is the largest scope item and represents the full vision. It depends on the provider abstraction from P1-P2 and extends it to the main map area. Included in-scope to deliver the complete experience.

**Independent Test**: Can be tested by toggling to the tile map mode and verifying offices appear as interactive markers on a pannable/zoomable tile map.

**Acceptance Scenarios**:

1. **Given** the user is viewing the application, **When** they select the tile map option from the three-way mode selector (2D SVG / 3D Globe / Tile Map), **Then** the main map area renders an interactive tile-based map showing all office markers
2. **Given** the tile map mode is active, **When** the user clicks a region in the sidebar, **Then** the map smoothly animates to show that region's offices
3. **Given** the tile map mode is active at a zoomed-out level, **When** multiple offices are close together, **Then** they cluster into a single numbered marker that expands on zoom
4. **Given** the tile map mode is active, **When** the user clicks an office marker, **Then** the details panel opens with that office's information (same as SVG/3D modes)
5. **Given** the user is viewing an office in the details panel mini-map, **When** they click the expand button, **Then** the mini-map expands into the tile map experience (overlay or transitions to tile map mode) with the current office location preserved
6. **Given** the three-way selector is visible, **When** the user is in any mode, **Then** the currently active mode is visually indicated and switching between modes preserves the selected region/office state

---

### Edge Cases

- What happens when the device has no internet connectivity for tile loading? The mini-map should display a graceful fallback message instead of broken tiles
- What happens when the container is resized (responsive layout, panel resize)? The map should resize and re-center automatically
- What happens when coordinates have low confidence (approximate)? The mini-map should still render at the best-known location with an appropriate zoom level
- What happens when the user rapidly switches between offices? The mini-map should cancel any in-flight tile loads and re-center without visual glitches
- What happens on mobile where the details panel is a bottom sheet? The mini-map should remain usable with touch gestures within the constrained space

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST render an interactive mini-map when an office is selected — in both the 2D details panel and the 3D globe's office modal — centered on the office's coordinates
- **FR-002**: System MUST support at least two map providers: MapLibre (with OpenStreetMap tiles) and Apple MapKit JS
- **FR-003**: System MUST allow the map provider to be configured per client via the client configuration file, with no code changes required
- **FR-004**: System MUST default to MapLibre + OpenStreetMap when no provider is explicitly configured
- **FR-005**: System MUST fall back gracefully from Apple Maps to MapLibre if the Apple Maps token is missing, invalid, or the service is unavailable
- **FR-006**: System MUST display proper attribution for the active tile provider (e.g., OpenStreetMap attribution for MapLibre)
- **FR-007**: Mini-map MUST support pan and zoom interactions (mouse drag, scroll wheel, touch gestures)
- **FR-008**: Mini-map MUST display the selected office location with a visible, branded marker
- **FR-009**: Mini-map MUST provide a way to open external directions (link or button) to the selected office
- **FR-010**: Mini-map MUST re-center and update when the user selects a different office without requiring a page reload
- **FR-011**: System MUST properly dispose of map instances when the details panel closes or the user navigates away, preventing memory leaks
- **FR-012**: Mini-map marker color MUST be configurable via the client theme (using the existing brand color system)
- **FR-013**: Map provider libraries MUST be lazy-loaded -- they MUST NOT be included in the initial page bundle or block the application's first render
- **FR-014**: Mini-map MUST animate smoothly when transitioning between office locations (fly-to or ease-to animation, not an abrupt jump)
- **FR-015**: The overall application MUST NOT degrade in initial load time, interaction responsiveness, or memory usage as a result of adding map provider support. The map provider is loaded on-demand only when needed.
- **FR-016**: Mini-map MUST be displayed at a prominent default size (taller than the current Google Maps iframe) within the details panel
- **FR-017**: Mini-map MUST include an expand control that opens the map in a larger overlay/lightbox view for neighborhood exploration
- **FR-018**: The expanded overlay MUST be dismissible via close button, Escape key, or clicking outside the overlay, returning to the inline mini-map without losing map state
- **FR-019**: The existing 2D/3D toggle MUST be replaced with a three-way mode selector: 2D SVG, 3D Globe, and Tile Map
- **FR-020**: Switching between map modes via the selector MUST preserve the currently selected region and/or office state
- **FR-021**: The mini-map expand button (FR-017) and the tile map mode selector (FR-019) MUST both provide entry to the interactive tile map experience
- **FR-022**: The full-screen tile map mode MUST display all office markers with clustering at zoomed-out levels, expanding individual markers on zoom

### Key Entities

- **Map Provider**: Represents a pluggable map rendering backend (e.g., MapLibre, Apple MapKit JS). Each provider implements a common interface for initialization, marker placement, centering, and disposal.
- **Tile Source**: The source of map tile imagery. MapLibre uses OpenStreetMap raster or vector tiles; Apple MapKit JS uses Apple's proprietary tiles.
- **Map Provider Configuration**: Per-client settings that specify which provider to use, authentication tokens (if required), default zoom level, and style preferences.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: The interactive mini-map loads and displays the correct office location within 2 seconds of office selection on a standard broadband connection
- **SC-002**: Users can pan and zoom the mini-map with the same responsiveness as leading consumer map applications (no perceptible lag on interactions)
- **SC-003**: Switching between MapLibre and Apple Maps providers requires only a configuration change -- zero code modifications
- **SC-004**: The mini-map consumes no ongoing API costs when configured with MapLibre + OpenStreetMap (free tile source)
- **SC-005**: Apple Maps mini-map stays within the free tier (250,000 map views/day) for demo and low-traffic client deployments
- **SC-006**: All existing tests continue to pass -- the map provider addition does not regress current 2D SVG, 3D globe, or application state management functionality
- **SC-007**: Mini-map works correctly on desktop (mouse) and mobile/tablet (touch) across modern browsers
- **SC-008**: Initial page load time does not increase by more than 50ms compared to the current application (map libraries are lazy-loaded, not bundled in the critical path)
- **SC-009**: Transitioning between offices on the mini-map feels fluid and polished -- animated fly-to with no blank tile flicker during the transition
- **SC-010**: The mini-map experience is noticeably more engaging than the current static Google Maps iframe -- users can explore the neighborhood around an office without leaving the application

## Clarifications

### Session 2026-02-07

- Q: How prominent should the interactive mini-map be in the details panel? → A: Prominent default size with an expand button that opens a larger overlay/lightbox for full neighborhood exploration.
- Q: Which OpenStreetMap tile source strategy should MapLibre use? → A: Free vector tile service (OpenFreeMap or MapTiler free tier). Styleable, sharp at all zooms, enables light/dark theming.
- Q: Should the 3D globe's office modal also get an interactive mini-map? → A: Yes — both the 2D details panel and 3D office modal get the interactive mini-map for a consistent experience.
- Q: Should P4 (full-screen tile map as a third map mode) be in-scope or explicitly deferred? → A: In-scope — implement all four stories (P1-P4) in this feature branch. Full vision.
- Q: How should the tile map mode fit into the existing 2D/3D toggle? → A: Both B and C — three-way selector (2D SVG, 3D Globe, Tile Map) as a full map mode, AND the mini-map expand button as a second entry point to the tile map experience.

## Assumptions

- MapLibre will use a free vector tile service (OpenFreeMap or MapTiler free tier) for sharp, styleable tiles that support light/dark theming and branded styling. Vector tiles are required (not raster) to enable the P3 branding story.
- The Apple MapKit JS token/key is already available for the demo client and will be provided via environment variable or client configuration -- token generation is outside the scope of this feature.
- The existing details panel layout and responsive behavior (desktop sidebar, mobile bottom sheet) will be preserved -- the mini-map replaces only the Google Maps iframe area.
- All four stories (P1-P4) are in-scope for this feature branch. P1-P3 should be implemented first to establish the provider abstraction, with P4 building on that foundation.
- The current Google Maps iframe embed will be removed once the interactive mini-map is in place -- there is no requirement to support Google Maps as a third provider (though the abstraction would allow adding it later).
