# Tasks: White-Label Client Configuration

**Input**: Design documents from `/specs/005-white-label-config/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Included — spec mandates tests for schema validation (SC-006, SC-010), marker state centralization (SC-009), client string isolation (SC-003), and regression (SC-007).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the foundational schema, types, and configuration files that all user stories depend on.

- [ ] T001 Update TypeScript interfaces from snake_case to camelCase in `src/types/index.ts` — rename `office_code` → `officeCode`, `office_type` → `officeType`, `directions_url` → `directionsUrl`, `vcard_url` → `vcardUrl`, `main_phone` → `mainPhone`, `main_email` → `mainEmail`, etc. Add new `ClientConfig`, `BrandTheme`, `CameraView` interfaces. Update `Coordinates.source` enum to include `"business_district"`. Update `GlobalContacts` to new nested structure with `departmentEmails` and `accountingContact`.
- [ ] T002 Create Zod validation schema in `src/lib/client-config.schema.ts` — define `ClientConfigSchema` with all required/optional fields per data-model.md. Include `MAX_SUPPORTED_SCHEMA_VERSION = 1`, sub-schemas for Office, Personnel, SpecialtyDivision, GlobalContacts, BrandTheme, CameraView, Coordinates. Add custom refinements: office code uniqueness check, coordinate bounds validation, hex color format validation. Produce descriptive error messages per contract.
- [ ] T003 Create client config loader module in `src/lib/client-config.ts` — implement `loadClientConfig(clientId)`, `getActiveConfig()`, `getClientOffices()`, `getClientRegions()`, `getClientRegion(name)`, `getOfficesByRegion(name)` per contracts/client-config.md. Cache loaded config. Reconstruct `Region[]` by grouping offices and personnel by region name. Use Zod schema from T002 for validation.
- [ ] T004 Create USG client configuration file `config/usg-client.json` — migrate all data from `src/data/locations.js` to the new camelCase JSON format. Include `schemaVersion: 1`, `clientId: "usg"`, `name: "USG Insurance"`, `copyrightHolder: "USG Insurance Services, Inc."`, `tagline: "We've got you covered."`. Flatten offices into top-level array with `region` field. Re-key personnel under `regionalPersonnel`. Restructure `globalContacts` with `departmentEmails` nesting. Include existing `specialtyDivisions` with camelCase field names.
- [ ] T005 [P] Extend client registry in `src/lib/client-registry.ts` — add `PROD_CLIENT_CONFIG_MAP` and `TEST_CLIENT_CONFIG_MAP` import maps for client config JSON files (parallel to existing map-config maps). Add `getClientConfigForClient(clientId)` function. Add `usg` entry to prod map, `usg` + `oddessentials` to test map. Add `clientConfigPath` to `ClientRegistry` interface.
- [ ] T006 [P] Update registry JSON files `config/clients.prod.json` and `config/clients.test.json` — add `clientConfigPath: "config/{clientId}-client.json"` field. Add `oddessentials` to the test registry's `clients` array.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core modules that MUST be complete before ANY user story can be implemented. These are the shared mechanisms all stories depend on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T007 Create marker state manager in `src/lib/marker-state.ts` — implement pure function `computeMarkerStates(input: MarkerStateInput): MarkerVisualState[]` per contracts/marker-state.md. Export `MarkerStateInput` and `MarkerVisualState` interfaces. Rules: `visible` always true, `selected` when officeCode matches, `highlighted` when hovered, `dimmed` when region selected and office not in that region.
- [ ] T008 [P] Create theme injector in `src/lib/theme-injector.ts` — implement `applyClientTheme(theme: BrandTheme | undefined): void` per contracts/theme-injection.md. Set CSS custom properties on `document.documentElement`. Compute light/dark variants via HSL manipulation (+/- 15% lightness). Normalize region names to CSS token format (lowercase, hyphens). Only modify bounded token surface area.
- [ ] T009 [P] Create DOM injector in `src/lib/dom-injector.ts` — implement `injectClientBranding(config: ClientConfig): void` per contracts/dom-injection.md. Set `document.title`, meta description, `#loading-logo`, `#header-logo`, `#header-tagline`, footer contacts (`#footer-phone`, `#footer-email`, `#footer-claims`, `#footer-lossruns`, `#footer-accounting`, `#accounting-contact`), `#copyright`. Hide elements when optional fields are absent. Show "Contact information not available" when entire `globalContacts` is absent.
- [ ] T010 Write tests for marker state manager in `tests/marker-state.test.ts` — test all 5 contract assertions: (1) same input produces same output regardless of renderer, (2) out-of-region markers are dimmed, (3) exactly one marker selected, (4) no dimming/selection when nothing selected, (5) visible always true. Test edge cases: empty offices array, all offices in same region.
- [ ] T011 [P] Write tests for client config schema validation in `tests/client-config.test.ts` — test: valid USG config passes validation, missing required field produces descriptive error naming the field (SC-006), `schemaVersion: 999` produces version-mismatch error (SC-010), duplicate office codes rejected, invalid coordinates rejected, invalid hex colors rejected, optional fields may be omitted.
- [ ] T012 [P] Write tests for theme injection in `tests/theme-injection.test.ts` — test: undefined theme does nothing, primaryColor sets `--color-primary` + derived variants, regionColors sets `--color-region-*` tokens, only bounded tokens are modified.

**Checkpoint**: Foundation ready — all shared modules (client-config loader, marker state, theme injector, DOM injector) are tested and functional. User story implementation can now begin.

---

## Phase 3: User Story 1 — Deploy Map for a New Client Using Only Configuration (Priority: P1) MVP

**Goal**: The application loads all client-specific data from a JSON config file. A new client can be onboarded with zero source code changes.

**Independent Test**: Create `config/oddessentials-client.json`, add to registry, load with `?client=oddessentials`. Map renders with Odd Essentials data.

### Implementation for User Story 1

- [ ] T013 [US1] Genericize `src/index.html` — remove all USG-specific text. Replace title with "Locations Map", meta description with generic text. Add `id` attributes to injection targets: `#loading-logo`, `#header-logo`, `#header-tagline`, `#footer-phone`, `#footer-email`, `#footer-claims`, `#footer-lossruns`, `#footer-accounting`, `#accounting-contact`, `#copyright`. Use generic placeholder text ("Loading...", empty strings). Structure footer contacts as individual elements with IDs.
- [ ] T014 [P] [US1] Genericize SVG asset `src/assets/usa-regions.svg` — change `aria-label` to `"Locations Map"`, `<title>` to `"Locations Map"`. Replace hardcoded region fill colors with CSS custom property references: e.g., `.region-usg-northeast { fill: var(--color-region-northeast-region, #1a5276); }`. Replace `.marker` stroke color `#003366` with `var(--color-primary, #003366)`.
- [ ] T015 [P] [US1] Update CSS tokens in `src/styles/tokens.css` — ensure `--color-region-*` variables are defined as defaults matching current hardcoded values. These serve as fallbacks when client config omits theme overrides.
- [ ] T016 [US1] Wire client config loading into `src/app.ts` — in `init()`, read `?client=` from URL params (or default to first registry client). Call `loadClientConfig(clientId)`. Call `injectClientBranding(config)`. Call `applyClientTheme(config.theme)`. Pass clientId to `initMap()`. Replace `regions` and `getRegion` imports from `locations.js` with `getClientRegions()` and `getClientRegion()` from `client-config.ts`. Update `handleOfficeClick` to use `getClientRegions()` for region lookup. Handle config load errors by showing error message in `#map-container` and aborting init.
- [ ] T017 [US1] Update `src/components/map-svg.ts` — replace `import { getAllOffices } from '../data/locations.js'` with `import { getClientOffices } from '../lib/client-config.js'`. Change `initProjection('usg')` on line 53 to accept dynamic `clientId` parameter passed from App. Use `getClientOffices()` in `addMarkers()`.
- [ ] T018 [US1] Update `src/components/region-list.js` — replace `import { regions } from '../data/locations.js'` with `import { getClientRegions } from '../lib/client-config.js'`. Use `getClientRegions()` to build sidebar navigation.
- [ ] T019 [US1] Update `src/components/specialty-divisions.js` — replace `import { specialtyDivisions } from '../data/locations.js'` with `import { getActiveConfig } from '../lib/client-config.js'`. Use `getActiveConfig().specialtyDivisions ?? []`. Remove hardcoded "Our specialty divisions serve clients nationwide." — use generic text.
- [ ] T020 [US1] Update `src/components/details-panel.js` — replace all hardcoded "USG" strings (lines 31, 129, 223) with `getActiveConfig().name`. Import `getActiveConfig` from `client-config.ts`. Change placeholder text to `"Click on a region to explore " + config.name + " offices."`.
- [ ] T021 [US1] Delete `src/data/locations.js` — remove the file entirely. All consumers now use `client-config.ts`. Verify no remaining imports of `../data/locations.js` in any source file.
- [ ] T022 [US1] Create Odd Essentials client configuration `config/oddessentials-client.json` — comprehensive edge-case exerciser per spec §Odd Essentials Test Configuration. Include: `schemaVersion: 1`, `clientId: "oddessentials"`, `name: "Odd Essentials"`, `copyrightHolder: "Odd Essentials LLC"`, `tagline: "Force multipliers for small businesses."`. 4+ offices across 3+ regions (1 with full address+directionsUrl, 1 satellite with null address, 1 with `approximate: true`, 1 in region with no personnel). 2 specialty divisions (1 with personnel, 1 with empty array). Regional personnel for 2 regions + 1 region without. Global contacts with 1 department email omitted. Theme overrides for some regions only. Camera view override for 1 region. 1 personnel without vcardUrl. 1 office referencing non-existent region. All data clearly fictional.
- [ ] T023 [US1] Create Odd Essentials map-config `config/oddessentials-map-config.json` — SVG coordinate projections for Odd Essentials offices. Use same projection parameters as USG (`geoAlbersUsa`, `scale: 1276`, `translate: [479, 299]`). Compute SVG (x,y) from each office's lat/lon. Define regions referencing the same canonical region names.
- [ ] T024 [US1] Add Odd Essentials to import maps in `src/lib/client-registry.ts` — add `oddessentials` entries to `TEST_CONFIG_IMPORT_MAP` (map-config) and `TEST_CLIENT_CONFIG_MAP` (client config).
- [ ] T025 [US1] Update all existing tests to work with new camelCase types — update any test file that references `office_code`, `office_type`, `directions_url`, `vcard_url`, `main_phone`, `main_email` to use camelCase equivalents. Ensure all 74+ existing tests pass (SC-007).
- [ ] T026 [US1] Run full test suite and verify zero regressions — execute `npm test` and confirm all existing tests pass with the refactored codebase.

**Checkpoint**: At this point, User Story 1 should be fully functional. Loading `?client=usg` shows USG data, loading `?client=oddessentials` shows Odd Essentials data. Zero source code changes needed for new clients.

---

## Phase 4: User Story 2 — Switch Between Client Deployments (Priority: P2)

**Goal**: Prove complete data isolation between clients on the same codebase. Switching `?client=` URL parameter renders an entirely different experience.

**Independent Test**: Load with `?client=usg`, verify USG data. Load with `?client=oddessentials`, verify Odd Essentials data. No cross-contamination.

### Implementation for User Story 2

- [ ] T027 [US2] Implement client selection error handling in `src/app.ts` — when `?client=` value is not in registry, display clear error message "Unknown client: {id}. Check the client registry." in the map container. Do not render the map. When no `?client=` param, default to first client in registry.
- [ ] T028 [US2] Implement schema version validation in `src/lib/client-config.ts` — when `schemaVersion` exceeds `MAX_SUPPORTED_SCHEMA_VERSION`, produce error: "Configuration schema version {N} is not supported. Maximum supported: {M}." Prevent rendering.
- [ ] T029 [US2] Add region reference validation in `src/lib/client-config.ts` — after loading client config and map config, cross-validate that each `offices[].region` matches a `regions[].name` in the map-config. Emit console warnings for mismatches (not errors). Use `console.warn("Office {code} references unknown region '{name}'.")`.
- [ ] T030 [US2] Write client string isolation scanning test in `tests/client-isolation.test.ts` — scan all `.ts`, `.js`, `.html`, `.css` files under `src/` for forbidden patterns: `"USG"` (standalone word/brand reference), `"usgins.com"`, `"aauins.com"`, `"USG Insurance"`, `"Allied American"`, hardcoded USG phone numbers, hardcoded USG email addresses. Test MUST pass (SC-003). Use file system reads to scan source files.

**Checkpoint**: Both USG and Odd Essentials work correctly. Unknown client IDs show clear errors. No client data leaks between configs. Source scanning test enforces string isolation.

---

## Phase 5: User Story 3 — All UI Text Derived from Configuration (Priority: P3)

**Goal**: Every piece of visible text in the application comes from the client configuration. No hardcoded client strings remain anywhere in the rendered DOM.

**Independent Test**: Load with `?client=oddessentials`, search rendered DOM for "USG" — zero matches (SC-002).

### Implementation for User Story 3

- [ ] T031 [US3] Audit and fix any remaining hardcoded client strings in `src/` — do a comprehensive search of all `.ts`, `.js`, `.html`, `.css`, `.svg` files under `src/` for any remaining USG-specific strings. Fix any found. Verify the client isolation scanning test passes.
- [ ] T032 [US3] Verify component placeholder text uses config throughout — confirm `DetailsPanel` placeholder, `SpecialtyDivisionsPanel` header, and any other component text strings derive from `getActiveConfig().name` or are generic. Check `office-modal.js` for any hardcoded client strings.
- [ ] T033 [US3] Verify loading screen, header, footer, copyright all inject correctly — manually test with both `?client=usg` and `?client=oddessentials`. Confirm: page title, meta description, loading logo, header branding, tagline (or hidden), footer contacts (or "not available"), copyright all match the active config.

**Checkpoint**: Zero USG strings appear in the rendered DOM when running under Odd Essentials config. All UI text is config-driven.

---

## Phase 6: User Story 4 — 3D Globe Reflects Client Configuration (Priority: P4)

**Goal**: The 3D globe renders with client-specific region colors, camera views, and markers from config. Marker state is centralized.

**Independent Test**: Switch to 3D mode with `?client=oddessentials`. Verify markers at Odd Essentials coordinates, overridden region colors, default colors for non-overridden regions.

### Implementation for User Story 4

- [ ] T034 [US4] Update `src/components/map-3d.js` — replace `import { regions, getAllOffices, getRegion } from '../data/locations.js'` with imports from `client-config.ts`. Replace hardcoded `REGION_COLORS` constant (lines 52-59) with a function that reads from `getActiveConfig().theme?.regionColors` with fallback to shared defaults. Replace hardcoded `CAMERA_VIEWS` constant (lines 62-70) with a function that reads from `getActiveConfig().theme?.cameraViews` with fallback to shared defaults. Convert CSS hex strings to Three.js hex integers.
- [ ] T035 [US4] Define shared default region colors and camera views — create a defaults section (either in `client-config.ts` or a separate `src/lib/defaults.ts`) that exports `DEFAULT_REGION_COLORS` and `DEFAULT_CAMERA_VIEWS` matching the current hardcoded values. Both the theme injector and 3D renderer reference these defaults.
- [ ] T036 [US4] Integrate marker state manager into `src/components/map-svg.ts` — add `updateMarkerStates(states: MarkerVisualState[])` method. Apply CSS classes (`.marker--selected`, `.marker--highlighted`, `.marker--dimmed`) based on state. Remove any independent marker state computation. Call `computeMarkerStates()` for hover events locally.
- [ ] T037 [US4] Integrate marker state manager into `src/components/map-3d.js` — add `updateMarkerStates(states: MarkerVisualState[])` method. Apply material property changes (emissive, opacity, scale) based on state. Keep backface culling as a rendering-only concern (existing `computeMarkerVisibility()` remains). Remove independent region-based dimming logic from `updateExpensiveMarkerStates()` — use `MarkerVisualState.dimmed` instead.
- [ ] T038 [US4] Wire marker state through `src/app.ts` — in `handleRegionClick`, `handleOfficeClick`, and `handleReset`, call `computeMarkerStates()` with current selection state and pass result to `this.map.updateMarkerStates(states)`. Add `MapComponent` interface method `updateMarkerStates(states: MarkerVisualState[]): void`.
- [ ] T039 [US4] Verify 3D rendering with both configs — manually test 3D globe with `?client=usg` (all 13 markers, USG region colors) and `?client=oddessentials` (4 markers, partially overridden region colors, 1 camera view override). Confirm backface culling still works.

**Checkpoint**: 3D globe is fully config-driven. Marker state centralized per WLC-008. Both configs render correctly in 2D and 3D modes.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, cleanup, and comprehensive testing across all stories.

- [ ] T040 [P] Run full test suite — execute `npm test` and confirm all existing + new tests pass. Target: 0 regressions (SC-007).
- [ ] T041 [P] Run lint and type check — execute `npm run lint` and verify zero errors. Ensure all new modules have proper TypeScript types.
- [ ] T042 Perform end-to-end validation with both configs — load app with `?client=usg`: verify 13 offices, 6 regions, USG branding, all contacts, specialty divisions, 2D + 3D modes. Load with `?client=oddessentials`: verify 4+ offices, 3+ regions, Odd Essentials branding, partial contacts, edge cases, 2D + 3D modes. Verify no `?client=` param defaults to first registry client.
- [ ] T043 Validate Odd Essentials edge case coverage (SC-008) — verify all 9 mandatory edge cases from spec: (1) offices across 3+ regions with varied attributes, (2) specialty divisions with empty personnel, (3) regions without personnel, (4) partial global contacts, (5) partial theme overrides, (6) partial camera view overrides, (7) personnel without vcardUrl, (8) office with unmatched region, (9) schemaVersion: 1.
- [ ] T044 Validate quickstart.md accuracy — follow the quickstart guide to create a minimal third test client. Verify the steps work without modifying source code. Delete test client files after validation.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion (types + schema + loader must exist) — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion — can start after foundation
- **User Story 2 (Phase 4)**: Depends on Phase 3 completion (needs configs + wiring to exist)
- **User Story 3 (Phase 5)**: Depends on Phase 3 completion (needs string extraction to be mostly done)
- **User Story 4 (Phase 6)**: Depends on Phase 2 completion (marker state manager) + Phase 3 (config wiring). Can be worked in parallel with US2/US3 after Phase 3.
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Foundation only — no story dependencies. This is the MVP.
- **US2 (P2)**: Requires US1 to be complete (needs two working configs to test switching)
- **US3 (P3)**: Requires US1 to be complete (needs config-driven text to audit)
- **US4 (P4)**: Requires Foundation (marker state) + US1 (config wiring). Can parallel with US2/US3.

### Within Each User Story

- Config files before code that consumes them
- Core module changes before component integration
- Integration before deletion of old code
- Tests validate after implementation

### Parallel Opportunities

**Phase 1**: T005 and T006 are parallel (different files)
**Phase 2**: T008, T009, T011, T012 are parallel (different files, independent modules)
**Phase 3**: T013, T014, T015 are parallel (HTML, SVG, CSS — different files)
**Phase 7**: T040, T041 are parallel (test vs lint)

---

## Parallel Example: Phase 1

```
# These can run in parallel:
Task T005: "Extend client registry in src/lib/client-registry.ts"
Task T006: "Update registry JSON files config/clients.prod.json and config/clients.test.json"
```

## Parallel Example: Phase 2

```
# These can run in parallel:
Task T008: "Create theme injector in src/lib/theme-injector.ts"
Task T009: "Create DOM injector in src/lib/dom-injector.ts"
Task T011: "Write tests for client config schema in tests/client-config.test.ts"
Task T012: "Write tests for theme injection in tests/theme-injection.test.ts"
```

## Parallel Example: Phase 3 (US1)

```
# These can run in parallel:
Task T013: "Genericize src/index.html"
Task T014: "Genericize SVG asset src/assets/usa-regions.svg"
Task T015: "Update CSS tokens in src/styles/tokens.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (types, schema, loader, USG config, registry)
2. Complete Phase 2: Foundational (marker state, theme injector, DOM injector, tests)
3. Complete Phase 3: User Story 1 (genericize HTML/SVG/CSS, wire config, migrate components, create Odd Essentials, delete locations.js)
4. **STOP and VALIDATE**: Load both `?client=usg` and `?client=oddessentials` — verify full rendering
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. User Story 1 → Config-driven rendering works → Deploy/Demo (MVP!)
3. User Story 2 → Client switching + error handling → Deploy/Demo
4. User Story 3 → Complete string isolation enforced → Deploy/Demo
5. User Story 4 → 3D globe config-driven + marker state centralized → Deploy/Demo
6. Polish → All edge cases validated, quickstart verified

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- The spec explicitly mandates tests for: schema validation (SC-006, SC-010), client string isolation (SC-003), marker state centralization (SC-009), and zero test regressions (SC-007)
- The camelCase type migration (T001) is intentionally first because all subsequent code depends on the new field names
- Deleting `locations.js` (T021) is positioned after all consumers are migrated to prevent broken imports
- Odd Essentials config (T022) exercises all 9 mandatory edge cases per spec §Odd Essentials Test Configuration
- Total: 44 tasks across 7 phases
