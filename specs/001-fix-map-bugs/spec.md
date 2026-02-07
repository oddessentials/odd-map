# Feature Specification: Fix Critical 3D/2D Map Visualization Bugs

**Feature Branch**: `001-fix-map-bugs`
**Created**: 2026-02-05
**Status**: Draft
**Input**: User description: "Fix three critical 3D/2D map visualization bugs: (1) Pins disappear on 3D→2D transition due to race condition; (2) 3D map pin flickering caused by backface culling with no hysteresis; (3) 3D pins appear in ocean instead of USA due to texture offset misconfiguration"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Pins Remain Visible During Map Mode Transition (Priority: P1)

As a user viewing office locations on the map, when I switch from 3D globe view to 2D SVG view (or vice versa), I expect all pins in my currently selected region to remain visible without disappearing or requiring me to re-select the region.

**Why this priority**: This is the most user-facing bug affecting core navigation. Users lose context when pins disappear, forcing them to re-navigate to their selection, which degrades the experience significantly.

**Independent Test**: Can be fully tested by selecting a region in 3D view, clicking the 2D/3D toggle button, and verifying pins remain visible. Delivers immediate value by preserving user context during view transitions.

**Acceptance Scenarios**:

1. **Given** I am viewing the 3D globe with "Northeast Region" selected and pins visible, **When** I click the toggle to switch to 2D view, **Then** the Northeast Region pins remain visible in the 2D SVG map without any user action required.

2. **Given** I am viewing the 2D map with a specific office selected, **When** I switch to 3D view, **Then** the same office remains selected and its pin is visible on the globe.

3. **Given** I am viewing the map with no region selected (USA overview), **When** I toggle between 2D and 3D views, **Then** the transition completes smoothly with no visual artifacts or errors.

---

### User Story 2 - Pins Display at Correct Geographic Locations on 3D Globe (Priority: P1)

As a user exploring office locations on the 3D globe, I expect pins to appear over the correct geographic locations in the United States, not displaced into the ocean or other incorrect areas.

**Why this priority**: Pins appearing in the wrong location (ocean) renders the 3D map completely unusable for its core purpose of showing where offices are located. This is a fundamental correctness issue.

**Independent Test**: Can be fully tested by loading the 3D globe, observing that pins cluster over the continental United States landmass, and verifying known office locations (e.g., California offices appear on the west coast, New York offices appear on the east coast).

**Acceptance Scenarios**:

1. **Given** I load the 3D globe view, **When** I observe the office pins, **Then** all pins appear over land areas within the United States, not in the ocean.

2. **Given** I view a Southern California region office, **When** I locate its pin on the 3D globe, **Then** the pin appears over the Southern California coastal area, not displaced into the Pacific Ocean.

3. **Given** I view a Northeast region office (e.g., Boston area), **When** I locate its pin on the 3D globe, **Then** the pin appears over the northeastern United States, not displaced into the Atlantic Ocean.

---

### User Story 3 - Smooth Pin Visibility During Globe Rotation (Priority: P2)

As a user interacting with the rotating 3D globe, I expect pins to appear and disappear smoothly as they rotate into and out of view, without rapid flickering or visual instability.

**Why this priority**: While the globe is usable with flickering pins, the visual instability makes the experience feel unpolished and can cause eye strain. This is a polish issue that significantly impacts perceived quality.

**Independent Test**: Can be fully tested by loading the 3D globe, allowing it to auto-rotate, and observing that pins near the visibility edge transition smoothly between visible and hidden states without rapid on/off flickering.

**Acceptance Scenarios**:

1. **Given** the 3D globe is auto-rotating, **When** a pin approaches the edge of visibility (about to rotate behind the globe), **Then** the pin fades or hides smoothly without rapid flickering.

2. **Given** I manually drag-rotate the 3D globe, **When** pins transition from visible to hidden (or vice versa), **Then** no pin flickers rapidly between states during the rotation.

3. **Given** a pin is positioned near the visibility threshold, **When** the globe rotates very slowly past that point, **Then** the pin changes visibility state once, not multiple times.

---

### Edge Cases

**Out of Scope**: The following edge cases preserve existing behavior and are not addressed in this bug fix:

| Edge Case                        | Current Behavior                                   | Disposition                           |
| -------------------------------- | -------------------------------------------------- | ------------------------------------- |
| Toggle during camera animation   | Animation interrupts; minor visual glitch possible | Out of scope - acceptable for bug fix |
| Toggle with no selection         | Works correctly; null selection preserved          | Covered by existing tests             |
| Toggle while 3D textures loading | Toggle proceeds; 2D loads independently            | Out of scope - acceptable for bug fix |
| Rapid toggle clicking            | Each toggle queues; may cause stutter              | Out of scope - future polish item     |

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST preserve selected region state when user toggles between 2D and 3D map views
- **FR-002**: System MUST preserve selected office state when user toggles between 2D and 3D map views
- **FR-003**: System MUST ensure 2D SVG markers are fully rendered before applying region-based visibility filters
- **FR-004**: System MUST display 3D globe pins at geographically accurate locations corresponding to actual US office coordinates
- **FR-005**: System MUST align the earth texture with the coordinate system so that longitude 0° corresponds to the Prime Meridian
- **FR-006**: System MUST implement visibility threshold buffering (hysteresis) for 3D pin backface culling to prevent rapid state changes
- **FR-007**: System MUST use different thresholds for hiding pins versus showing pins to create a buffer zone
- **FR-008**: System MUST skip expensive visibility calculations during active camera animations

### Key Entities

- **Office Pin**: A visual marker representing an office location, with coordinates, region association, and visibility state
- **Map View State**: The current map rendering mode (2D or 3D), selected region, and selected office that must persist across view transitions
- **Visibility Threshold**: The backface culling parameters that determine when a 3D pin is visible or hidden based on its position relative to the camera

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of pins in the selected region remain visible after toggling between 2D and 3D views (verified by automated test)
- **SC-002**: All office pins on the 3D globe appear within their correct US geographic region (no pins in ocean areas)
- **SC-003**: Zero visible pin flickering during normal globe rotation (pins change visibility state at most once per rotation past the threshold)
- **SC-004**: Map view transitions complete without errors in browser console
- **SC-005**: Existing view-switching tests continue to pass after fixes are applied

## Assumptions

- The earth texture (`earth-day.jpg`) uses a standard equirectangular projection that is Pacific-centered (180° offset from Prime Meridian)
- Office coordinate data in the configuration is accurate (lat/lon values are correct)
- The 2D SVG map and 3D globe use the same underlying office data source
- A hysteresis buffer of approximately 0.05-0.1 units will be sufficient to prevent flickering without noticeably delaying pin visibility changes
