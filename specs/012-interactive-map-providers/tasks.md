# Tasks: Interactive Map Providers

**Input**: Design documents from `/specs/012-interactive-map-providers/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Test tasks are included — the plan.md specifies a test strategy with 4 test files (3 new, 1 modified).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies, create directory structure, and establish the provider type system that all stories depend on.

- [ ] T001 Install MapLibre GL JS as an npm dependency (`npm install maplibre-gl`) and verify Vite code-splits it via dynamic import
- [ ] T002 Create `src/lib/map-providers/` directory and define `MapProvider`, `TileMapProvider`, and all supporting interfaces (`MapProviderOptions`, `MarkerOptions`, `FlyToOptions`, `TileMapMarker`) in `src/lib/map-providers/types.ts` per plan.md Phase 1 Design
- [ ] T003 Extend `BrandThemeSchema` in `src/lib/client-config.schema.ts` with `MapProviderConfigSchema` (provider enum, tileStyleUrl, appleMapToken, defaultZoom) per plan.md schema extension design
- [ ] T004 Add `getMapProviderConfig()` accessor function in `src/lib/client-config.ts` that reads the `theme.mapProvider` section from the active client config, returning defaults when omitted

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Provider implementations and factory — MUST be complete before any user story can render a map.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T005 Implement MapLibre provider in `src/lib/map-providers/maplibre-provider.ts`: lazy-load MapLibre GL JS via dynamic `import('maplibre-gl')`, implement all `MapProvider` interface methods (initialize with OpenFreeMap vector tiles, setLocation with custom HTML marker, flyTo with animation, updateMarkerStyle, resize, dispose, getMapElement)
- [ ] T006 Implement Apple MapKit JS provider in `src/lib/map-providers/apple-provider.ts`: lazy-load via dynamic `<script>` tag injection from Apple CDN, implement all `MapProvider` interface methods (initialize with JWT token auth via `mapkit.init()`, setLocation with `mapkit.MarkerAnnotation`, flyTo, updateMarkerStyle via `glyphColor`, resize, dispose, getMapElement)
- [ ] T007 Implement provider factory in `src/lib/map-providers/provider-factory.ts`: `createMapProvider(config)` reads `MapProviderConfig`, returns MapLibre by default, returns Apple when specified with valid token, falls back to MapLibre with console warning when Apple token is missing/invalid or script fails to load
- [ ] T008 Write provider abstraction tests in `tests/map-provider.test.ts`: factory returns MapLibre by default, factory returns MapLibre when config specifies "maplibre", factory returns Apple when "apple" with valid token, factory falls back to MapLibre when "apple" without token, all `MapProvider` interface methods exist on returned provider instances
- [ ] T009 Extend existing tests in `tests/client-config.test.ts`: add test cases for MapProviderConfig validation (provider enum accepts "maplibre"/"apple", defaults to "maplibre" when omitted, validates tileStyleUrl format, validates defaultZoom range 1-20, accepts missing mapProvider entirely)

**Checkpoint**: Provider infrastructure ready — `createMapProvider()` returns a working MapLibre or Apple provider. User story implementation can begin.

---

## Phase 3: User Story 1 — Interactive Mini-Map in Details Panel (Priority: P1) MVP

**Goal**: Replace the Google Maps iframe with an interactive mini-map (MapLibre default) in the details panel and office modal. Supports pan, zoom, fly-to animation, expand/collapse overlay, and proper disposal.

**Independent Test**: Select any office → verify mini-map renders centered on office location with marker, pan/zoom works, fly-to animates between offices, expand button opens overlay, overlay dismisses via close/ESC/click-outside preserving state, 3D office modal also shows mini-map.

### Tests for User Story 1

- [ ] T010 [P] [US1] Write mini-map component tests in `tests/mini-map.test.ts`: MiniMap creates provider on first `show()`, MiniMap calls `flyTo()` on subsequent `show()` with different office, MiniMap disposes provider on `dispose()`, MiniMap expand/collapse preserves map element via DOM reparenting

### Implementation for User Story 1

- [ ] T011 [US1] Create `MiniMap` component in `src/components/mini-map.ts`: constructor accepts container element, `show(office, brandColor)` method lazy-creates provider via factory and initializes map with marker at office coordinates, `flyTo(office)` animates to new location on office switch, `dispose()` cleans up provider and DOM, tracks `currentOffice` to skip no-op updates
- [ ] T012 [US1] Create expand overlay component in `src/components/map-expand-overlay.ts`: creates full-screen overlay with close button, accepts map element via DOM reparenting from MiniMap (preserves map state per FR-018), `resize()` called after reparent, dismiss via close button click, Escape key, or click-outside, focus trapping and ARIA labels per Constitution Principle V
- [ ] T013 [US1] Add `expand()` method to `MiniMap` in `src/components/mini-map.ts`: instantiates `MapExpandOverlay`, reparents provider map element into overlay via `getMapElement()`, calls `provider.resize()`, on overlay close reparents back to inline container and calls `resize()` again
- [ ] T014 [US1] Modify `DetailsPanel.showOffice()` in `src/components/details-panel.js`: remove Google Maps iframe HTML (lines 221-238), add `<div class="mini-map-container" id="details-mini-map"></div>` in its place, after innerHTML set instantiate `MiniMap` on the container and call `show(office, brandColor)`, on subsequent office selections call `flyTo()` instead of recreating
- [ ] T015 [US1] Modify `DetailsPanel.showPlaceholder()` and `DetailsPanel.showRegion()` in `src/components/details-panel.js`: call `this.miniMap?.dispose()` and set `this.miniMap = null` when panel resets or shows region (no mini-map in region view), preventing memory leaks per FR-011
- [ ] T016 [US1] Modify `OfficeModal.createModal()` in `src/components/office-modal.js`: add `<div class="mini-map-container" id="modal-mini-map"></div>` in modal body after contact info section, after DOM insertion instantiate `MiniMap` and call `show(office, brandColor)`, in `close()` call `this.miniMap?.dispose()` before removing DOM elements
- [ ] T017 [US1] Update mini-map CSS in `src/styles/app.css`: increase `.mini-map-container` height (taller than current iframe per FR-016, e.g. `aspect-ratio: 16/12` or explicit min-height), remove `.mini-map-embed` iframe styles, add `.mini-map-expand-btn` positioned absolute top-right with expand icon, add `.map-expand-overlay` full-screen fixed overlay with backdrop, add `.map-expand-overlay .close-btn` positioned top-right

**Checkpoint**: User Story 1 is fully functional. Selecting any office shows an interactive MapLibre mini-map in the details panel (2D mode) and office modal (3D mode) with pan, zoom, fly-to, expand/collapse, and directions link. Google Maps iframe is removed. `npm test` passes.

---

## Phase 4: User Story 2 — Configurable Map Provider per Client (Priority: P2)

**Goal**: Allow per-client map provider selection via configuration. Demo client uses Apple Maps; production clients default to MapLibre. Zero code changes for provider switching.

**Independent Test**: Set `theme.mapProvider.provider` to `"apple"` with a valid token in a client config → mini-map renders with Apple Maps tiles. Remove the `mapProvider` section → mini-map defaults to MapLibre. Set `"apple"` with no token → falls back to MapLibre with console warning.

### Implementation for User Story 2

- [ ] T018 [P] [US2] Update `config/oddessentials-client.json` to add `mapProvider` config under `theme` with `"provider": "maplibre"` and `"defaultZoom": 15` as the explicit default configuration example
- [ ] T019 [P] [US2] Verify `MiniMap.show()` in `src/components/mini-map.ts` reads provider config from `getMapProviderConfig()` and passes it to `createMapProvider()` — ensure the factory correctly routes to MapLibre or Apple provider based on client config
- [ ] T020 [US2] Verify Apple provider fallback path in `src/lib/map-providers/provider-factory.ts`: when config specifies `"apple"` but `appleMapToken` is empty/missing, log `console.warn()` with clear message and return MapLibre provider instead; when Apple CDN script fails to load (onerror), catch and fall back to MapLibre with warning
- [ ] T021 [US2] End-to-end verification: load app with `?client=oddessentials` (MapLibre config), select an office, verify mini-map renders with OpenStreetMap tiles and OSM attribution; then modify config to `"apple"` with placeholder token, verify fallback to MapLibre with warning logged

**Checkpoint**: User Story 2 is functional. Provider switching works via config only. Apple fallback gracefully degrades. All existing tests pass.

---

## Phase 5: User Story 3 — Branded Map Styling (Priority: P3)

**Goal**: Mini-map markers use the client's brand color. MapLibre maps support light/dark style tones matching the application theme.

**Independent Test**: Configure two clients with different `primaryColor` values → verify mini-map markers render in each client's brand color. Verify MapLibre map style responds to light/dark preference.

### Implementation for User Story 3

- [ ] T022 [US3] Update `MiniMap.show()` in `src/components/mini-map.ts` to read `--color-primary` CSS custom property via `getComputedStyle()` and pass it as the marker `color` option to the provider, ensuring markers match the client's brand theme
- [ ] T023 [US3] Implement brand-colored markers in MapLibre provider (`src/lib/map-providers/maplibre-provider.ts`): create custom HTML marker element with inline `background-color` from `MarkerOptions.color`, add a pin shape via CSS (border-radius, pseudo-element), call `updateMarkerStyle()` to update color dynamically
- [ ] T024 [US3] Implement brand-colored markers in Apple provider (`src/lib/map-providers/apple-provider.ts`): set `glyphColor` and `color` properties on `mapkit.MarkerAnnotation` from `MarkerOptions.color` value
- [ ] T025 [US3] Add light/dark style support to MapLibre provider in `src/lib/map-providers/maplibre-provider.ts`: accept `style` option (`'light'` | `'dark'`) in `MapProviderOptions`, use appropriate OpenFreeMap style URL variant (or modify map paint properties for dark mode), default to `'light'`
- [ ] T026 [US3] Verify Apple Maps provider in `src/lib/map-providers/apple-provider.ts` applies `mapkit.Map.ColorSchemes.Dark` or `.Light` based on `MapProviderOptions.style` value

**Checkpoint**: User Story 3 is functional. Markers display in brand colors. MapLibre supports light/dark tone. Apple Maps applies brand color to markers.

---

## Phase 6: User Story 4 — Full-Screen Interactive Tile Map Mode (Priority: P4)

**Goal**: Add a third map mode (Tile Map) alongside 2D SVG and 3D Globe. Full-screen interactive map with all office markers, clustering, fly-to animations, and seamless integration with the existing state machine.

**Independent Test**: Click "Map" in the three-way selector → tile map renders with all office markers. Click a region → map animates to region. Click a marker → details panel opens. Zoom out → markers cluster. Switch modes → state preserved.

### Tests for User Story 4

- [ ] T027 [P] [US4] Write tile map mode tests in `tests/tile-map.test.ts`: TileMap implements `MapComponent` interface (selectRegion, selectOffice, reset, updateMarkerStates, dispose all exist), selectRegion calls fitBounds for region offices, selectOffice highlights correct marker, reset fits all markers in view, updateMarkerStates applies visual states (selected, dimmed, highlighted)

### Implementation for User Story 4

- [ ] T028 [US4] Extend MapLibre provider with `TileMapProvider` methods in `src/lib/map-providers/maplibre-provider.ts`: implement `setMarkers()` using GeoJSON source with `cluster: true` for automatic clustering, implement `updateMarkerStates()` to apply selected/dimmed/highlighted visual states to markers, implement `fitBounds()` to calculate LngLatBounds from marker positions and animate to fit, implement `onMarkerClick()` to register click handler on marker layer returning `officeCode`
- [ ] T029 [US4] Extend Apple provider with `TileMapProvider` methods in `src/lib/map-providers/apple-provider.ts`: implement `setMarkers()` using `mapkit.MarkerAnnotation` collection, implement `updateMarkerStates()`, implement `fitBounds()` using `mapkit.CoordinateRegion`, implement `onMarkerClick()` via annotation select event
- [ ] T030 [US4] Create `TileMap` component in `src/components/tile-map.ts`: implements `MapComponent` interface (selectRegion, selectOffice, reset, updateMarkerStates, dispose), `init()` creates TileMapProvider via factory, loads all offices as markers with clustering via `setMarkers()`, registers marker click handler to trigger `onOfficeClick` callback, `selectRegion()` calls `fitBounds()` for region offices, `selectOffice()` calls `flyTo()` and highlights marker
- [ ] T031 [US4] Replace `#map-toggle` button with three-way mode selector in `src/index.html`: replace `<button id="map-toggle">` with `<div class="mode-selector" role="group" aria-label="Map mode">` containing three `<button class="mode-btn" data-mode="2d|3d|tile" aria-pressed="true|false">` elements (2D, 3D, Map)
- [ ] T032 [US4] Update `app.ts` mode management: replace `use3D: boolean` with `mapMode: '2d' | '3d' | 'tile'`, replace `toggleMapMode()` with `switchMapMode(mode)` that uses the same transitioning guard + debounce + state preservation pattern, replace `mapToggleBtn` reference with `.mode-selector` event delegation listening for click on `.mode-btn`, add `updateModeSelector()` to toggle `active` class and `aria-pressed` on mode buttons
- [ ] T033 [US4] Extend `initMap()` in `src/app.ts` with tile map branch: when `mapMode === 'tile'`, create `TileMap` instance, call `await tileMap.init()`, set `document.body.dataset.mapMode = 'tile'`, restore selection state via `selectRegion()`/`selectOffice()` same as existing 2D/3D branches
- [ ] T034 [US4] Update spin button visibility in `src/app.ts`: `updateSpinButtonVisibility()` hides spin button when `mapMode !== '3d'` (not just `!use3D`), ensure spin toggle logic is guarded by `mapMode === '3d'`
- [ ] T035 [US4] Add mode selector and tile map CSS in `src/styles/app.css`: `.mode-selector` button group with flex layout and rounded corners, `.mode-btn` with active/pressed state styling matching existing button theme, `.tile-map-container` full-height in main map area, hide existing `.map-toggle` styles
- [ ] T036 [US4] Update `docs/index.html` with same three-way mode selector markup as `src/index.html` to keep production build template in sync

**Checkpoint**: User Story 4 is functional. Three-way mode selector works. Tile map shows all markers with clustering. Clicking markers opens details panel. Mode switching preserves state. All existing 2D/3D tests still pass.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, graceful degradation, performance verification, and cleanup.

- [ ] T037 Add graceful fallback in `src/components/mini-map.ts` for offline/tile-load failure: if provider `initialize()` rejects, display a user-friendly message in the mini-map container instead of broken tiles (spec edge case: no internet connectivity)
- [ ] T038 Add ResizeObserver in `src/components/mini-map.ts` to call `provider.resize()` when the container dimensions change (spec edge case: responsive layout, panel resize)
- [ ] T039 Handle rapid office switching in `src/components/mini-map.ts`: if `show()` or `flyTo()` is called while a previous animation is in-flight, cancel the pending animation before starting the new one (spec edge case: rapid office switching)
- [ ] T040 Verify lazy loading works correctly: confirm MapLibre chunk is NOT present in the initial Vite build output (`npm run build`), confirm it IS loaded on-demand when the first mini-map renders (check Network tab or Vite chunk manifest)
- [ ] T041 Run full test suite (`npm test`) and lint (`npm run lint`) — verify all existing tests pass (382+), all new tests pass, no lint warnings introduced
- [ ] T042 Verify mini-map works in both the 2D details panel and 3D office modal by manually testing: select office in 2D mode → mini-map appears, toggle to 3D → select office → modal mini-map appears, expand/collapse works in both contexts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2)
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2); benefits from US1 being complete for end-to-end verification
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2); benefits from US1 for visible marker testing
- **User Story 4 (Phase 6)**: Depends on Foundational (Phase 2); benefits from US1-US3 for provider maturity
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2. No dependencies on other stories. **MVP scope.**
- **User Story 2 (P2)**: Can start after Phase 2. Independently testable. Integrates with US1's MiniMap for visual verification.
- **User Story 3 (P3)**: Can start after Phase 2. Independently testable. Enhances US1/US2's markers with brand styling.
- **User Story 4 (P4)**: Can start after Phase 2. Independently testable. Benefits from US1-US3 provider implementations being mature.

### Within Each User Story

- Tests written first (where included) → verify they reference correct interfaces
- Component creation before integration into existing files
- CSS changes after component implementation
- Story checkpoint: verify independently before proceeding

### Parallel Opportunities

**Phase 1**: T002 and T003 can run in parallel (different files: types.ts vs schema.ts). T004 depends on T003.

**Phase 2**: T005 and T006 can run in parallel (different provider files). T007 depends on T005+T006. T008 and T009 can run in parallel with each other (different test files) once T007 is complete.

**Phase 3 (US1)**: T011 and T012 can run in parallel (different component files). T014 and T016 can run in parallel (details-panel.js vs office-modal.js). T017 (CSS) can run in parallel with component work.

**Phase 4 (US2)**: T018 and T019 can run in parallel (config file vs component file).

**Phase 5 (US3)**: T023, T024, and T025 can run in parallel (different provider files and concerns).

**Phase 6 (US4)**: T028 and T029 can run in parallel (MapLibre vs Apple tile provider). T031 and T035 can run in parallel (HTML vs CSS).

---

## Parallel Example: User Story 1

```text
# After Phase 2 completes, launch component creation in parallel:
T011: Create MiniMap component in src/components/mini-map.ts
T012: Create expand overlay in src/components/map-expand-overlay.ts

# After T011+T012, integrate into existing components in parallel:
T014: Modify details-panel.js (replace iframe with mini-map)
T016: Modify office-modal.js (add mini-map to modal)
T017: Update CSS styles in app.css
```

## Parallel Example: User Story 4

```text
# Extend both providers in parallel:
T028: Extend MapLibre with TileMapProvider methods
T029: Extend Apple with TileMapProvider methods

# After providers ready, build component + UI in parallel:
T030: Create TileMap component
T031: Update index.html mode selector markup
T035: Add mode selector + tile map CSS
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T009)
3. Complete Phase 3: User Story 1 (T010-T017)
4. **STOP and VALIDATE**: Select offices in 2D and 3D modes, verify mini-map renders, pan/zoom, fly-to, expand/collapse all work. Run `npm test`.
5. This alone delivers a significant UX improvement over the Google Maps iframe.

### Incremental Delivery

1. Setup + Foundational → Provider infrastructure ready
2. **Add US1** → Interactive mini-map in details panel + office modal (MVP!)
3. **Add US2** → Apple Maps for demo clients, MapLibre for production
4. **Add US3** → Brand-colored markers, light/dark theming
5. **Add US4** → Full-screen tile map mode with clustering + three-way selector
6. **Polish** → Edge cases, graceful degradation, performance verification
7. Each story adds visible value without breaking previous stories.

### Parallel Team Strategy

With multiple developers after Phase 2:

- Developer A: User Story 1 (P1) — the MVP
- Developer B: User Story 2 (P2) — config + Apple provider verification
- Developer C: User Story 4 (P4) — tile map mode (largest scope)
- US3 can be picked up by whoever finishes first

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks in same phase
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable at its checkpoint
- MapLibre GL JS CSS (`maplibre-gl/dist/maplibre-gl.css`) must be imported alongside the JS — include in the dynamic import or inject via `<link>` tag
- Apple MapKit JS CDN URL should be pinned to a specific version (e.g., `5.x.x`) per Constitution Principle VI
- The `docs/` directory contains a production build template — keep `docs/index.html` in sync with `src/index.html` changes (T036)
- Commit after each task or logical group; run `npm test` at each checkpoint
