# Implementation Plan: Interactive Map Providers

**Branch**: `012-interactive-map-providers` | **Date**: 2026-02-07 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/012-interactive-map-providers/spec.md`

## Summary

Introduce a map provider abstraction that replaces the static Google Maps iframe in the details panel with an interactive, styleable mini-map — and extends to a full-screen tile map mode as a third view alongside 2D SVG and 3D Globe. MapLibre GL JS (backed by free OpenStreetMap vector tiles) serves as the open-source default; Apple MapKit JS is available as a premium option for demo clients. The provider is configured per-client with zero code changes. All map libraries are lazy-loaded on demand to preserve initial load performance.

## Technical Context

**Language/Version**: TypeScript 5.7 (ES2022 target), JavaScript (map-3d.js)
**Primary Dependencies**: Three.js 0.182, Vite 7.3.1, MapLibre GL JS (new, ~200KB gzipped), Apple MapKit JS (new, CDN-loaded)
**Storage**: N/A — static JSON configuration files in `config/` directory
**Testing**: Vitest 4.0.17
**Target Platform**: Modern desktop and mobile browsers (Chrome, Firefox, Edge, Safari)
**Project Type**: Single static web application
**Performance Goals**: Mini-map loads within 2s of office selection; 60 fps interaction; initial page load increase < 50ms
**Constraints**: Map libraries lazy-loaded (not in critical path); MapLibre requires no API key; Apple Maps requires JWT token from client config; vector tiles required for styling/theming
**Scale/Scope**: New provider abstraction layer, modified details panel + office modal, new tile map mode component, extended client config schema, ~8 new/modified source files, ~4 new test files

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status    | Notes                                                                                                                                                                                              |
| ------------------------------------ | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Deterministic Data Pipeline       | PASS      | No data pipeline changes. Office coordinates remain build-time immutable. Map tiles are presentation-layer assets, not data.                                                                       |
| II. Build-Time Coordinate Resolution | PASS      | Existing lat/lon coordinates from client config are passed directly to map providers. No client-side geocoding or projection recalculation.                                                        |
| III. Enterprise Testing Standards    | PASS      | New test files for provider abstraction, config schema extension, and provider initialization. No WebGL context required for unit tests.                                                           |
| IV. Performance Budgets              | PASS      | Map provider libraries are lazy-loaded, not included in initial bundle. Mini-map is a separate rendering surface — does not affect SVG/3D draw call or vertex budgets.                             |
| V. Accessibility First               | PASS      | Mini-map expand overlay follows modal accessibility rules (ESC close, click-outside, focus trap, ARIA labels). Tile map mode added to keyboard-navigable mode selector. Attribution text included. |
| VI. Zero Runtime Backend             | VIOLATION | Map tiles require runtime network requests to tile servers. Apple MapKit JS requires a JWT token for authentication. See Complexity Tracking for justification.                                    |
| Invariant 3 (Raycasting Isolation)   | PASS      | Map provider rendering is in separate DOM containers — no interaction with Three.js raycasting.                                                                                                    |
| Invariant 4 (Single Marker State)    | PASS      | Tile map markers use `computeMarkerStates()` for consistent state computation across all three modes.                                                                                              |
| Invariant 5 (Shared App State)       | PASS      | Mode switching preserves selectedRegion/selectedOffice via existing state machine in app.ts.                                                                                                       |
| Invariant 8 (No Post-Processing)     | PASS      | No new Three.js rendering effects. Map providers use their own WebGL/Canvas contexts.                                                                                                              |
| Invariant 10 (Zero Runtime Backend)  | VIOLATION | See Principle VI above.                                                                                                                                                                            |
| Invariant 12 (Performance Budget)    | PASS      | Lazy loading ensures no impact on initial load. Map provider contexts are separate from the 3D performance budget.                                                                                 |

**Gate Result**: VIOLATION — Principle VI requires justification. See Complexity Tracking below.

## Complexity Tracking

> **Justified Violations of Constitution Principle VI: Zero Runtime Backend**

| Violation                                    | Why Needed                                                                                                                                                                                                         | Simpler Alternative Rejected Because                                                                                                                                                                                                                                 |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime tile requests to OpenStreetMap/Apple | Interactive map tiles are the core value proposition of this feature. Users need to pan, zoom, and explore neighborhoods around office locations. This requires loading map imagery dynamically based on viewport. | Pre-rendering static map images at build time was considered, but eliminates interactivity (pan/zoom), requires generating images for every possible viewport/zoom combination, and defeats the purpose of replacing the Google Maps iframe with something superior. |
| Apple MapKit JS requires JWT auth token      | Apple Maps is the premium provider option for demo clients. Apple's CDN-loaded SDK authenticates via a short-lived JWT token provided in client config.                                                            | Using only MapLibre (no API key) was considered, but the spec explicitly requires Apple Maps as a premium option for sales demos. The token is static configuration, not a runtime API call.                                                                         |
| MapLibre GL JS loaded from CDN at runtime    | The library is ~200KB gzipped — bundling it would violate the "initial page load < 50ms increase" performance constraint. Lazy-loading from a pinned CDN version is the standard approach.                         | Bundling with Vite was considered, but adds ~200KB to the initial bundle, violating Principle IV performance budgets and FR-013/FR-015. Lazy loading preserves the zero-impact initial load.                                                                         |

**Mitigation measures:**

1. MapLibre + OpenStreetMap tiles require **zero API keys** and **zero per-request costs** — the default path has no billable API dependencies
2. All map libraries are **lazy-loaded on demand** — no network requests until user opens a details panel or switches to tile map mode
3. Library versions are **pinned to exact versions** (CDN with integrity hash or npm vendored) per existing Principle VI allowance for "CDN assets (pinned versions)"
4. The application **degrades gracefully** if tiles fail to load — a fallback message is shown instead of broken tiles
5. Apple Maps token is **static configuration** (not a runtime API call) — the token is pre-generated and included in client config JSON

## Project Structure

### Documentation (this feature)

```text
specs/012-interactive-map-providers/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── details-panel.js     # MODIFY: Replace Google Maps iframe with mini-map container + expand button
│   ├── office-modal.js      # MODIFY: Add interactive mini-map to 3D office modal
│   ├── map-svg.ts           # NO CHANGE (existing 2D SVG map)
│   ├── map-3d.js            # NO CHANGE (existing 3D globe map)
│   ├── mini-map.ts          # NEW: Mini-map component (renders in details panel and office modal)
│   ├── tile-map.ts          # NEW: Full-screen tile map mode component (implements MapComponent interface)
│   └── map-expand-overlay.ts # NEW: Expanded map overlay/lightbox component
├── lib/
│   ├── client-config.schema.ts  # MODIFY: Extend BrandThemeSchema with mapProvider config
│   ├── client-config.ts         # MODIFY: Expose map provider config accessor
│   ├── theme-injector.ts        # NO CHANGE (existing CSS custom property injection)
│   └── map-providers/
│       ├── types.ts             # NEW: MapProvider interface definition
│       ├── maplibre-provider.ts # NEW: MapLibre GL JS provider implementation
│       ├── apple-provider.ts    # NEW: Apple MapKit JS provider implementation
│       └── provider-factory.ts  # NEW: Factory function to create provider from config
├── app.ts                   # MODIFY: Three-way mode selector, tile map mode integration
└── styles/
    └── app.css              # MODIFY: Mini-map styles, expand overlay styles, tile map mode styles, mode selector styles

config/
├── oddessentials-client.json  # MODIFY: Add mapProvider config (optional)
└── usg-client.json            # MODIFY: Add mapProvider config (optional)

tests/
├── map-provider.test.ts       # NEW: Provider abstraction unit tests
├── mini-map.test.ts           # NEW: Mini-map component tests
├── tile-map.test.ts           # NEW: Tile map mode tests
└── client-config.test.ts      # MODIFY: Extend for new mapProvider schema validation
```

**Structure Decision**: Single project. New `src/lib/map-providers/` directory houses the provider abstraction layer. Components are co-located with existing components in `src/components/`. No new top-level directories beyond the provider subdirectory.

## Phase 0: Research Findings

All decisions documented in [research.md](research.md).

### Key Design Decisions

**Decision 1: Provider Abstraction — Strategy Pattern with Factory**

The map provider abstraction uses a Strategy pattern with a factory function. Each provider (MapLibre, Apple) implements a common `MapProvider` interface with methods for initialization, marker placement, fly-to animation, centering, resize, and disposal. The factory reads the client config and returns the appropriate provider instance. The consuming components (mini-map, tile map) interact only with the interface.

Rationale: Strategy pattern enables zero-code provider switching, matches the existing `MapComponent` interface pattern in `app.ts`, and is the simplest approach that satisfies FR-003 (configurable per client, no code changes).

**Decision 2: Lazy Loading — Dynamic Import + Async Factory**

MapLibre GL JS is installed as an npm dependency but loaded via dynamic `import()` only when the first mini-map or tile map renders. Apple MapKit JS is loaded via a dynamically-injected `<script>` tag (Apple's SDK is CDN-only). The provider factory returns a Promise, and all provider creation is async.

Rationale: Dynamic import with Vite produces a separate chunk that is only fetched on demand. This satisfies FR-013 (not in initial bundle) and FR-015 (no load time degradation). Apple's SDK must be loaded via script tag per their documentation.

**Decision 3: Tile Source — OpenFreeMap Vector Tiles**

MapLibre uses OpenFreeMap's free vector tile service (no API key, no usage limits). Vector tiles enable style customization for light/dark theming and brand color application to markers. The style URL is configurable in client config but defaults to OpenFreeMap's standard style.

Rationale: OpenFreeMap is free, requires no registration or API key, provides vector tiles (required for P3 branding story), and has sufficient capacity for this use case. MapTiler free tier is the fallback if OpenFreeMap has availability issues.

**Decision 4: Mini-Map as Reusable Component**

The mini-map is implemented as a standalone TypeScript class (`MiniMap`) that can be instantiated in both the details panel and the office modal. It accepts a container element, office coordinates, and a provider instance. It manages its own map lifecycle (create, update, dispose) independently of the parent component.

Rationale: Both the 2D details panel and 3D office modal need identical mini-map capabilities (FR-001). A reusable component avoids code duplication and ensures behavioral consistency across both contexts.

**Decision 5: Expand Overlay — Shared Map Instance**

When the user clicks the expand button, the mini-map's underlying provider map instance is moved (via DOM reparenting) into the overlay container rather than creating a new map instance. This preserves map state (position, zoom) across expand/collapse transitions (FR-018) and avoids the cost of initializing a second map.

Rationale: Creating a new map instance would require re-downloading tiles and would not preserve the user's current viewport. DOM reparenting of the canvas/container is a standard technique used by Google Maps and Mapbox for embed resize operations.

**Decision 6: Three-Way Mode Selector — Replace Toggle Button**

The existing `#map-toggle` button (2D/3D toggle) is replaced with a three-button group: "2D", "3D", "Map". The active mode is visually indicated. Clicking a mode button triggers `switchMapMode(mode)` which extends the existing `toggleMapMode()` logic. State preservation (selectedRegion, selectedOffice) across mode switches is maintained via the existing capture-and-restore pattern in `app.ts`.

Rationale: The spec requires a three-way selector (FR-019). A button group is the simplest accessible pattern (each button has `aria-pressed`), consistent with the existing toggle UX, and requires minimal HTML/CSS changes.

**Decision 7: Tile Map Mode — MapComponent Interface**

The full-screen tile map (`TileMap`) implements the existing `MapComponent` interface from `app.ts` (selectRegion, selectOffice, reset, updateMarkerStates, dispose). This allows it to plug into the existing app state machine identically to MapSvg and Map3D. Office markers are rendered as map markers with clustering via MapLibre's built-in clustering support.

Rationale: Reusing the `MapComponent` interface means the tile map mode requires zero changes to the state machine, panel coordination, or marker state computation. The existing `initMap()` pattern in `app.ts` simply gains a third branch.

**Decision 8: Marker Styling — CSS Custom Properties + Provider Adaptation**

Mini-map and tile map markers use the client's `--color-primary` CSS custom property for their color. MapLibre markers are created as custom HTML elements styled via CSS. Apple Maps markers use the `glyphColor` property set from the computed CSS custom property value. This ensures markers match the client brand without provider-specific configuration.

Rationale: Reusing the existing CSS custom property system (Principle V theme-injector) avoids a second theming mechanism. Reading computed styles at marker creation time bridges CSS theming to provider-specific APIs.

**Decision 9: Google Maps Iframe Removal**

The Google Maps iframe embed in `details-panel.js` (lines 221-238) is removed entirely. The `.mini-map-container` and `.mini-map-embed` CSS classes are repurposed for the new interactive mini-map. The `directions_url` link is preserved as a standalone button (already exists above the iframe).

Rationale: FR-001 replaces the iframe with the interactive mini-map. The "Get Directions" link works independently of the map display.

**Decision 10: Attribution — Provider-Specific Attribution Control**

MapLibre GL JS includes built-in OpenStreetMap attribution by default (bottom-right corner of map canvas). Apple MapKit JS includes Apple's own attribution. Both are preserved without modification. The mini-map container allocates space for attribution text via padding.

Rationale: FR-006 requires proper attribution. Both libraries handle this automatically — no custom implementation needed.

## Phase 1: Design

### Map Provider Interface

```typescript
interface MapProvider {
  /** Initialize the provider (load library, create map instance) */
  initialize(container: HTMLElement, options: MapProviderOptions): Promise<void>;

  /** Set the map center and place a marker */
  setLocation(lat: number, lon: number, options?: MarkerOptions): void;

  /** Animate to a new location (fly-to) */
  flyTo(lat: number, lon: number, options?: FlyToOptions): void;

  /** Update marker style (e.g., brand color change) */
  updateMarkerStyle(options: MarkerOptions): void;

  /** Handle container resize */
  resize(): void;

  /** Clean up map instance and free resources */
  dispose(): void;

  /** Get the underlying map element for DOM reparenting (expand/collapse) */
  getMapElement(): HTMLElement;
}

interface MapProviderOptions {
  zoom: number;
  interactive: boolean;
  attributionControl: boolean;
  style?: 'light' | 'dark';
}

interface MarkerOptions {
  color: string;
  label?: string;
}

interface FlyToOptions {
  zoom?: number;
  duration?: number; // ms
}
```

### Tile Map Provider Interface (extends MapProvider)

```typescript
interface TileMapProvider extends MapProvider {
  /** Add multiple markers with clustering */
  setMarkers(markers: TileMapMarker[]): void;

  /** Update visual states of markers (selected, dimmed, highlighted) */
  updateMarkerStates(states: MarkerVisualState[]): void;

  /** Fit the map view to show a set of markers */
  fitBounds(markers: TileMapMarker[], padding?: number): void;

  /** Register click handler for markers */
  onMarkerClick(handler: (officeCode: string) => void): void;
}

interface TileMapMarker {
  officeCode: string;
  lat: number;
  lon: number;
  label: string;
  color: string;
  regionName: string;
}
```

### Mini-Map Component Design

```typescript
class MiniMap {
  private provider: MapProvider | null = null;
  private container: HTMLElement;
  private expandBtn: HTMLButtonElement;
  private currentOffice: { lat: number; lon: number } | null = null;

  constructor(container: HTMLElement);

  /** Show/update the mini-map for an office location */
  async show(office: Office, brandColor: string): Promise<void>;

  /** Animate to a new office location (fly-to) */
  flyTo(office: Office): void;

  /** Expand the map into an overlay */
  expand(): void;

  /** Clean up resources */
  dispose(): void;
}
```

**Lifecycle:**

1. On first `show()` call: create provider (async — lazy loads library), initialize map, place marker
2. On subsequent `show()` calls: if same office, no-op; if different office, `flyTo()` the new location
3. On `expand()`: reparent map element into overlay container
4. On `dispose()`: call `provider.dispose()`, remove DOM elements, null references

### Details Panel Integration

**Modified `showOffice()` in `details-panel.js`:**

1. Remove Google Maps iframe HTML (lines 221-238)
2. Add `<div class="mini-map-container" id="details-mini-map"></div>` in its place
3. After setting innerHTML, instantiate or update `MiniMap` on the container
4. If `this.miniMap` exists and office has changed: call `this.miniMap.flyTo(office)`
5. If `this.miniMap` does not exist: create new `MiniMap`, call `show(office, brandColor)`
6. On panel close / `showPlaceholder()`: call `this.miniMap.dispose()`; set `this.miniMap = null`

### Office Modal Integration

**Modified `createModal()` in `office-modal.js`:**

1. Add `<div class="mini-map-container" id="modal-mini-map"></div>` in modal body after contact info
2. After DOM insertion, instantiate `MiniMap` on the container, call `show(office, brandColor)`
3. In `close()`: call `this.miniMap?.dispose()` before removing DOM elements

### Three-Way Mode Selector

**Modified HTML (index.html):**

Replace:

```html
<button id="map-toggle" class="btn btn-secondary">3D</button>
```

With:

```html
<div class="mode-selector" role="group" aria-label="Map mode">
  <button class="mode-btn active" data-mode="2d" aria-pressed="true">2D</button>
  <button class="mode-btn" data-mode="3d" aria-pressed="false">3D</button>
  <button class="mode-btn" data-mode="tile" aria-pressed="false">Map</button>
</div>
```

**Modified `app.ts`:**

- Replace `use3D: boolean` with `mapMode: '2d' | '3d' | 'tile'`
- Replace `toggleMapMode()` with `switchMapMode(mode: '2d' | '3d' | 'tile')`
- Extend `initMap()` with a third branch for tile map mode
- Mode selector event delegation: listen on `.mode-selector` for click on `.mode-btn`
- Active state: toggle `active` class and `aria-pressed` on mode buttons

### Tile Map Mode Component

```typescript
class TileMap implements MapComponent {
  private provider: TileMapProvider | null = null;
  private container: HTMLElement;

  constructor(container: HTMLElement, options: MapOptions);

  /** Initialize the tile map with all office markers */
  async init(): Promise<void>;

  selectRegion(regionName: string): void; // flyTo region bounds
  selectOffice(office: OfficeWithRegion): void; // flyTo office, highlight marker
  reset(): void; // fitBounds all markers
  updateMarkerStates(states: MarkerVisualState[]): void;
  dispose(): void;
}
```

### Client Config Schema Extension

Add to `BrandThemeSchema` in `client-config.schema.ts`:

```typescript
const MapProviderConfigSchema = z
  .object({
    provider: z.enum(['maplibre', 'apple']).default('maplibre'),
    tileStyleUrl: z.string().url().optional(),
    appleMapToken: z.string().optional(),
    defaultZoom: z.number().min(1).max(20).default(15),
  })
  .optional();

// Extend BrandThemeSchema
const BrandThemeSchema = z.object({
  primaryColor: HexColorSchema.optional(),
  accentColor: HexColorSchema.optional(),
  regionColors: z.record(z.string(), HexColorSchema).optional(),
  cameraViews: z.record(z.string(), CameraViewSchema).optional(),
  mapProvider: MapProviderConfigSchema, // NEW
});
```

### Test Strategy

**`tests/map-provider.test.ts` (NEW):**

- Provider factory returns MapLibre provider by default (no config)
- Provider factory returns MapLibre provider when config specifies "maplibre"
- Provider factory returns Apple provider when config specifies "apple" with valid token
- Provider factory falls back to MapLibre when "apple" specified but no token
- Provider interface contract: all methods exist on returned provider

**`tests/mini-map.test.ts` (NEW):**

- MiniMap creates provider on first show()
- MiniMap calls flyTo on subsequent show() with different office
- MiniMap disposes provider on dispose()
- MiniMap expand/collapse preserves map element

**`tests/tile-map.test.ts` (NEW):**

- TileMap implements MapComponent interface
- TileMap selectRegion calls fitBounds for region offices
- TileMap selectOffice highlights correct marker
- TileMap reset fits all markers
- TileMap updateMarkerStates applies visual states

**`tests/client-config.test.ts` (MODIFY):**

- MapProvider config validates provider enum
- MapProvider config defaults to maplibre when omitted
- MapProvider config validates appleMapToken when provider is apple
- MapProvider config validates tileStyleUrl format

### CSS Changes

**New styles in `app.css`:**

- `.mini-map-container` — updated dimensions (taller than current iframe, per FR-016)
- `.mini-map-expand-btn` — expand button overlay on mini-map
- `.map-expand-overlay` — full-screen overlay for expanded mini-map
- `.map-expand-overlay .close-btn` — overlay close button
- `.mode-selector` — button group container
- `.mode-btn` — individual mode buttons with active state
- `.tile-map-container` — full-screen tile map in main area

**Removed styles:**

- `.mini-map-embed` — iframe embed class (replaced)

## Constitution Re-Check (Post-Design)

| Principle                         | Status    | Notes                                                                                                                                                                          |
| --------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| I. Deterministic Data Pipeline    | PASS      | Office coordinates passed through unchanged. Tile imagery is presentation, not data.                                                                                           |
| II. Build-Time Coordinate Res.    | PASS      | No client-side geocoding. Existing lat/lon used directly.                                                                                                                      |
| III. Enterprise Testing Standards | PASS      | 4+ new test files. Provider abstraction testable without network (mock providers). All tests pure — no WebGL context.                                                          |
| IV. Performance Budgets           | PASS      | Lazy-loaded libraries in separate Vite chunk. SVG/3D budgets unaffected. Mini-map is independent rendering surface.                                                            |
| V. Accessibility First            | PASS      | Expand overlay: ESC, click-outside, focus trap, ARIA. Mode selector: aria-pressed, keyboard navigable. Attribution visible.                                                    |
| VI. Zero Runtime Backend          | VIOLATION | Justified: tile requests are presentation-layer assets (like CDN images), not data fetches. MapLibre has zero API cost. Apple token is static config. See Complexity Tracking. |
| All invariants                    | PASS      | No regressions to existing invariants. Tile map uses same state machine and marker state computation.                                                                          |

**Post-Design Gate Result**: VIOLATION justified — ready for task generation.
