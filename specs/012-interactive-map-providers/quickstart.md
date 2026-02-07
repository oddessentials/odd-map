# Quickstart: Interactive Map Providers

**Branch**: `012-interactive-map-providers`

## What This Feature Does

Replaces the static Google Maps iframe embed in the details panel with an interactive, styleable mini-map powered by MapLibre GL JS (default, free) or Apple MapKit JS (premium, for demos). Adds a full-screen interactive tile map as a third viewing mode alongside 2D SVG and 3D Globe. Map provider is configurable per-client with zero code changes.

## Key Files

| File                                         | Action | Purpose                                                    |
| -------------------------------------------- | ------ | ---------------------------------------------------------- |
| `src/lib/map-providers/types.ts`             | NEW    | MapProvider and TileMapProvider interface definitions      |
| `src/lib/map-providers/maplibre-provider.ts` | NEW    | MapLibre GL JS provider implementation                     |
| `src/lib/map-providers/apple-provider.ts`    | NEW    | Apple MapKit JS provider implementation                    |
| `src/lib/map-providers/provider-factory.ts`  | NEW    | Factory function: config → provider instance               |
| `src/components/mini-map.ts`                 | NEW    | Reusable mini-map component (details panel + office modal) |
| `src/components/tile-map.ts`                 | NEW    | Full-screen tile map mode (implements MapComponent)        |
| `src/components/map-expand-overlay.ts`       | NEW    | Expanded map overlay/lightbox                              |
| `src/components/details-panel.js`            | MODIFY | Replace iframe with mini-map container                     |
| `src/components/office-modal.js`             | MODIFY | Add mini-map to 3D office modal                            |
| `src/app.ts`                                 | MODIFY | Three-way mode selector, tile map integration              |
| `src/lib/client-config.schema.ts`            | MODIFY | Add MapProviderConfig to BrandThemeSchema                  |
| `src/styles/app.css`                         | MODIFY | Mini-map, overlay, mode selector, tile map styles          |
| `tests/map-provider.test.ts`                 | NEW    | Provider abstraction unit tests                            |
| `tests/mini-map.test.ts`                     | NEW    | Mini-map component tests                                   |
| `tests/tile-map.test.ts`                     | NEW    | Tile map mode tests                                        |
| `tests/client-config.test.ts`                | MODIFY | Extended for mapProvider schema validation                 |

## Core Concepts

### Provider Abstraction

The `MapProvider` interface abstracts the differences between MapLibre and Apple Maps:

```
MapProvider (interface)
├── initialize(container, options)  → load library, create map
├── setLocation(lat, lon, marker)   → center map, place marker
├── flyTo(lat, lon, options)        → animate to location
├── resize()                        → handle container resize
├── dispose()                       → clean up resources
└── getMapElement()                 → DOM element for reparenting
```

The `createMapProvider(config)` factory reads client config and returns the right provider.

### Lazy Loading

Map libraries are NOT in the initial bundle. They load on demand:

- **MapLibre**: `const maplibregl = await import('maplibre-gl')` — Vite code-splits into separate chunk
- **Apple MapKit JS**: Dynamic `<script>` injection from Apple CDN

First load happens when user opens details panel or switches to tile map mode.

### Mini-Map Lifecycle

```
Office selected → MiniMap.show(office)
                    ├── First call: create provider (lazy load library) → place marker
                    └── Subsequent: flyTo(new office) with smooth animation

User clicks expand → MiniMap.expand()
                       └── Reparent map element to overlay (preserves state)

Panel closes → MiniMap.dispose()
                 └── Provider.dispose() → free resources
```

### Three-Way Mode Selector

Replaces the existing 2D/3D toggle:

```
[2D] [3D] [Map]  ← button group with aria-pressed
 │     │    │
 │     │    └── TileMap (new: MapLibre/Apple full-screen with markers + clustering)
 │     └── Map3D (existing: Three.js globe)
 └── MapSvg (existing: 2D SVG)
```

All three modes implement `MapComponent` interface and share the same state machine.

### Client Config

```json
{
  "theme": {
    "mapProvider": {
      "provider": "maplibre",
      "defaultZoom": 15
    }
  }
}
```

Omitting `mapProvider` defaults to MapLibre + OpenFreeMap. No configuration needed for the free path.

## Running Tests

```bash
npm test
```

Provider tests use mock implementations — no network or WebGL context required.

## Constitution Note

This feature introduces a **justified violation** of Principle VI (Zero Runtime Backend): interactive map tiles require runtime network requests. Mitigated by: zero-cost default path (MapLibre + OpenFreeMap), lazy loading (no requests until needed), pinned library versions, and graceful degradation on tile failure. See plan.md Complexity Tracking for full justification.

## Relevant Prior Art

- `MapComponent` interface in `app.ts` — TileMap implements this same contract
- `DetailsPanel.showOffice()` in `details-panel.js` — current Google Maps iframe location
- `OfficeModal.createModal()` in `office-modal.js` — 3D modal that gains mini-map
- `BrandThemeSchema` in `client-config.schema.ts` — extended with mapProvider field
- `computeMarkerStates()` in `marker-state.ts` — reused by tile map for consistent visual states
- `toggleMapMode()` in `app.ts` — replaced by three-way switchMapMode()
