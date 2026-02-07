# Data Model: Interactive Map Providers

**Feature**: 012-interactive-map-providers | **Date**: 2026-02-07
**Phase**: 1 — Design & Contracts

---

## Entity Relationship Overview

```
ClientConfig (1) — existing
├── offices[] (1:N)              — existing, unchanged
│   └── coordinates (1)          — existing, provides lat/lon for map providers
├── theme (0..1)                 — existing
│   ├── primaryColor             — existing, used for marker styling
│   ├── accentColor              — existing
│   ├── regionColors{}           — existing
│   ├── cameraViews{}            — existing
│   └── mapProvider (0..1)       — NEW: map provider configuration
│       ├── provider             — "maplibre" | "apple"
│       ├── tileStyleUrl         — optional custom tile style URL
│       ├── appleMapToken        — optional JWT token for Apple Maps
│       └── defaultZoom          — default zoom level for mini-map
└── ...

MapProvider (interface) — NEW
├── MapLibreProvider             — implements MapProvider
└── AppleProvider                — implements MapProvider

TileMapProvider (interface, extends MapProvider) — NEW
├── MapLibreTileProvider         — implements TileMapProvider
└── AppleTileProvider            — implements TileMapProvider

MiniMap (component) — NEW
├── uses MapProvider (1)
└── renders in details-panel or office-modal container

TileMap (component, implements MapComponent) — NEW
├── uses TileMapProvider (1)
└── renders in main map container (alongside MapSvg, Map3D)

MapExpandOverlay (component) — NEW
└── borrows MapProvider map element from MiniMap via DOM reparenting
```

---

## New Entity Schemas

### MapProviderConfig

Configuration for the map provider, nested under `theme` in client config JSON.

| Field           | Type                      | Required | Default      | Description                                                                           |
| --------------- | ------------------------- | -------- | ------------ | ------------------------------------------------------------------------------------- |
| `provider`      | `"maplibre"` \| `"apple"` | No       | `"maplibre"` | Which map provider to use. Falls back to MapLibre if Apple fails.                     |
| `tileStyleUrl`  | string (URL)              | No       | OpenFreeMap  | Custom vector tile style URL. MapLibre only. Overrides the default OpenFreeMap style. |
| `appleMapToken` | string                    | No       | —            | JWT token for Apple MapKit JS authentication. Required when `provider` is `"apple"`.  |
| `defaultZoom`   | number (1-20)             | No       | `15`         | Default zoom level for mini-map display. Higher = more zoomed in.                     |

**Validation rules:**

- If `provider` is `"apple"` and `appleMapToken` is missing/empty: fall back to MapLibre, log warning
- `tileStyleUrl` must be a valid HTTPS URL if provided
- `defaultZoom` must be between 1 and 20 inclusive

### MapProviderOptions

Runtime options passed to provider initialization (not persisted — computed at render time).

| Field                | Type                  | Required | Default   | Description                                                 |
| -------------------- | --------------------- | -------- | --------- | ----------------------------------------------------------- |
| `zoom`               | number                | Yes      | —         | Initial zoom level (from config `defaultZoom`)              |
| `interactive`        | boolean               | Yes      | —         | Whether pan/zoom gestures are enabled                       |
| `attributionControl` | boolean               | Yes      | —         | Whether to show attribution text (always true for mini-map) |
| `style`              | `"light"` \| `"dark"` | No       | `"light"` | Map style tone, derived from application theme              |

### MarkerOptions

Styling options for a map marker.

| Field   | Type   | Required | Default | Description                                            |
| ------- | ------ | -------- | ------- | ------------------------------------------------------ |
| `color` | string | Yes      | —       | CSS hex color (from `--color-primary` custom property) |
| `label` | string | No       | —       | Optional text label displayed on or near the marker    |

### FlyToOptions

Options for animated map transitions.

| Field      | Type   | Required | Default | Description                        |
| ---------- | ------ | -------- | ------- | ---------------------------------- |
| `zoom`     | number | No       | current | Target zoom level after animation  |
| `duration` | number | No       | `1500`  | Animation duration in milliseconds |

### TileMapMarker

Data for a single marker in the full-screen tile map mode.

| Field        | Type   | Required | Description                           |
| ------------ | ------ | -------- | ------------------------------------- |
| `officeCode` | string | Yes      | Unique office identifier              |
| `lat`        | number | Yes      | Latitude                              |
| `lon`        | number | Yes      | Longitude                             |
| `label`      | string | Yes      | Display label (e.g., "Dallas, Texas") |
| `color`      | string | Yes      | Marker fill color (CSS hex)           |
| `regionName` | string | Yes      | Region name for grouping/filtering    |

---

## Extended Client Config Schema

### Before (current `theme` in client config)

```json
{
  "theme": {
    "primaryColor": "#1a5276",
    "accentColor": "#e74c3c",
    "regionColors": { "Northeast": "#3498db" },
    "cameraViews": { "Northeast": { "distance": 3, "lat": 42, "lon": -73 } }
  }
}
```

### After (with mapProvider extension)

```json
{
  "theme": {
    "primaryColor": "#1a5276",
    "accentColor": "#e74c3c",
    "regionColors": { "Northeast": "#3498db" },
    "cameraViews": { "Northeast": { "distance": 3, "lat": 42, "lon": -73 } },
    "mapProvider": {
      "provider": "maplibre",
      "defaultZoom": 15
    }
  }
}
```

### Apple Maps demo client example

```json
{
  "theme": {
    "primaryColor": "#1a5276",
    "mapProvider": {
      "provider": "apple",
      "appleMapToken": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik...",
      "defaultZoom": 16
    }
  }
}
```

### No mapProvider (default behavior)

When the `mapProvider` field is omitted entirely, the system defaults to:

- Provider: `maplibre`
- Tile source: OpenFreeMap vector tiles
- Default zoom: `15`
- No API key needed

---

## Provider Interface Contract

### MapProvider (base)

```typescript
interface MapProvider {
  initialize(container: HTMLElement, options: MapProviderOptions): Promise<void>;
  setLocation(lat: number, lon: number, options?: MarkerOptions): void;
  flyTo(lat: number, lon: number, options?: FlyToOptions): void;
  updateMarkerStyle(options: MarkerOptions): void;
  resize(): void;
  dispose(): void;
  getMapElement(): HTMLElement;
}
```

**Contract rules:**

- `initialize()` MUST be called before any other method
- `initialize()` MUST resolve only after the map is ready to render (tiles loaded, canvas created)
- `dispose()` MUST release all resources (remove event listeners, destroy map instance, null references)
- `dispose()` MUST be idempotent (safe to call multiple times)
- `getMapElement()` MUST return the root DOM element that can be reparented for expand/collapse
- `resize()` MUST recalculate the map viewport based on current container dimensions
- `flyTo()` MUST animate smoothly (not jump) per FR-014

### TileMapProvider (extends MapProvider)

```typescript
interface TileMapProvider extends MapProvider {
  setMarkers(markers: TileMapMarker[]): void;
  updateMarkerStates(states: MarkerVisualState[]): void;
  fitBounds(markers: TileMapMarker[], padding?: number): void;
  onMarkerClick(handler: (officeCode: string) => void): void;
}
```

**Contract rules:**

- `setMarkers()` replaces all existing markers (not additive)
- `setMarkers()` MUST enable clustering at zoomed-out levels per FR-022
- `updateMarkerStates()` MUST apply visual states (selected, dimmed, highlighted) per existing `MarkerVisualState` shape
- `fitBounds()` MUST calculate bounds from marker positions and animate to fit them in view
- `onMarkerClick()` MUST return the `officeCode` of the clicked marker

---

## Relationship to Existing Types

### Reused types (no changes)

| Type                    | Source                            | Usage                                        |
| ----------------------- | --------------------------------- | -------------------------------------------- |
| `Office`                | `src/types/index.ts`              | Passed to MiniMap.show() for coordinates     |
| `OfficeWithRegion`      | `src/types/index.ts`              | Passed to TileMap.selectOffice()             |
| `Region`                | `src/types/index.ts`              | Used for region bounds calculation           |
| `MarkerVisualState`     | `src/lib/marker-state.ts`         | Passed to TileMapProvider.updateMarkerStates |
| `ValidatedClientConfig` | `src/lib/client-config.schema.ts` | Extended with mapProvider field              |

### New types (this feature)

| Type                 | File                              | Description                         |
| -------------------- | --------------------------------- | ----------------------------------- |
| `MapProvider`        | `src/lib/map-providers/types.ts`  | Base provider interface             |
| `TileMapProvider`    | `src/lib/map-providers/types.ts`  | Extended provider for tile map mode |
| `MapProviderOptions` | `src/lib/map-providers/types.ts`  | Initialization options              |
| `MarkerOptions`      | `src/lib/map-providers/types.ts`  | Marker styling options              |
| `FlyToOptions`       | `src/lib/map-providers/types.ts`  | Animation options                   |
| `TileMapMarker`      | `src/lib/map-providers/types.ts`  | Tile map marker data                |
| `MapProviderConfig`  | `src/lib/client-config.schema.ts` | Zod schema for config validation    |

---

## MapComponent Interface Compatibility

The existing `MapComponent` interface in `app.ts` is implemented by `MapSvg`, `Map3D`, and now `TileMap`:

```typescript
interface MapComponent {
  selectRegion(regionName: string): void;
  selectOffice(office: Office | OfficeWithRegion): void;
  reset(): void;
  updateMarkerStates?(states: MarkerVisualState[]): void;
  dispose?(): void;
}
```

The `TileMap` class implements all five methods. This ensures it plugs into the existing app state machine (`app.ts`) with zero changes to state management, panel coordination, or marker state computation.
