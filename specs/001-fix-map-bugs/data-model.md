# Data Model: Fix Critical 3D/2D Map Visualization Bugs

**Feature**: 001-fix-map-bugs
**Date**: 2026-02-05

## Overview

This feature involves bug fixes only - no new entities or data structures are introduced. This document describes the existing state models affected by the fixes.

## Affected State Models

### MapSvg Component State

```typescript
// src/components/map-svg.ts
class MapSvg {
  // Existing state
  private selectedRegion: string | null;
  private selectedOffice: OfficeWithRegion | null;
  private regionBounds: Map<string, ViewBox>;

  // NEW: Initialization state (for race condition fix)
  private markersReady: boolean = false;
  private pendingRegionSelection: string | null = null;
}
```

**State Transitions**:

```
init() called → markersReady = false
addMarkers() complete → markersReady = true, process pendingRegionSelection
selectRegion() called:
  if markersReady → showMarkersForRegion() immediately
  else → store in pendingRegionSelection
```

### Map3D Component State

```typescript
// src/components/map-3d.js
class Map3D {
  // Existing state
  selectedRegion: string | null;
  selectedOffice: object | null;
  markerMeshes: Map<string, THREE.Group>;

  // NEW: Visibility state tracking (for hysteresis)
  // Note: marker.visible already tracks this per-marker
  // No new state needed - hysteresis uses existing visible flag
}
```

**Backface Culling Constants**:

```javascript
// Existing (single threshold)
marker.visible = dotProduct < 0.2;

// New (hysteresis thresholds)
const BACKFACE_HIDE_THRESHOLD = 0.25; // More restrictive to hide
const BACKFACE_SHOW_THRESHOLD = 0.15; // More permissive to show
```

### App Controller State

```typescript
// src/app.ts
class App {
  // Existing state (unchanged)
  private state: StateValue;
  private selectedRegion: Region | null;
  private selectedOffice: Office | null;
  private use3D: boolean;
  private map: MapComponent | null;
}
```

**No changes to App state** - the race condition fix is in the timing of method calls, not the state model.

## Configuration Constants

### Texture Alignment

```javascript
// src/components/map-3d.js

// Calibrated values for earth-day.jpg texture alignment
export const TEXTURE_LONGITUDE_OFFSET_DEG = 85; // Horizontal alignment (degrees)
export const TEXTURE_LATITUDE_OFFSET = 0.15; // Vertical alignment (texture units)
```

**Effect**: Aligns earth texture with pin coordinates. Longitude offset of 85° and latitude offset of 0.15 were calibrated empirically to align USA pins with the correct landmass positions.

### Backface Culling Thresholds

```javascript
// src/components/map-3d.js

// BEFORE (single threshold)
// Implicit threshold of 0.2 in updateExpensiveMarkerStates()

// AFTER (hysteresis thresholds)
const BACKFACE_HIDE_THRESHOLD = 0.25;
const BACKFACE_SHOW_THRESHOLD = 0.15;
```

**Effect**: Creates 0.1 unit "dead zone" where marker visibility doesn't change, preventing flickering.

## Validation Rules

### Marker Initialization

| Rule                                | Validation                                                            |
| ----------------------------------- | --------------------------------------------------------------------- |
| Markers must exist before selection | `markersReady === true` before `showMarkersForRegion()`               |
| Pending selection must be processed | If `pendingRegionSelection !== null` when `markersReady` becomes true |

### Texture Offset

| Rule                         | Validation                                                |
| ---------------------------- | --------------------------------------------------------- |
| Offset must be valid degrees | `0 <= TEXTURE_LONGITUDE_OFFSET_DEG < 360`                 |
| Offset applied correctly     | `texture.offset.x === TEXTURE_LONGITUDE_OFFSET_DEG / 360` |

### Hysteresis Thresholds

| Rule                            | Validation                                                  |
| ------------------------------- | ----------------------------------------------------------- |
| Hide threshold > Show threshold | `BACKFACE_HIDE_THRESHOLD > BACKFACE_SHOW_THRESHOLD`         |
| Buffer zone exists              | `BACKFACE_HIDE_THRESHOLD - BACKFACE_SHOW_THRESHOLD >= 0.05` |
| Thresholds in valid range       | Both between 0.0 and 1.0                                    |

## Entity Relationships

```
┌─────────────┐     manages      ┌──────────────┐
│    App      │ ───────────────► │   MapSvg     │
│ (controller)│                  │   Map3D      │
└─────────────┘                  └──────────────┘
       │                                │
       │ preserves state                │ renders
       │ across transitions             │
       ▼                                ▼
┌─────────────┐                  ┌──────────────┐
│  Selection  │ ◄─────────────── │   Markers    │
│   State     │    visualizes    │  (pins)      │
└─────────────┘                  └──────────────┘
```

The key relationship affected by these bugs:

- **App ↔ Map**: Selection state must be restored AFTER map is fully initialized
- **Map ↔ Markers**: Visibility state must use hysteresis to prevent flickering
- **Markers ↔ Texture**: Pin positions must align with earth texture
