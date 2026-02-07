# Research: White-Label Client Configuration

**Feature**: 005-white-label-config | **Date**: 2026-02-05
**Phase**: 0 — Codebase Research

---

## 1. Data Flow Analysis

### Location Data Import Chain

The primary data source is `src/data/locations.js`, which exports:

- `regions` — 6 regions with offices and personnel
- `specialtyDivisions` — 4 specialty divisions
- `globalContacts` — company-wide contact info
- `getAllOffices()` — flat array of all offices with `regionName` attached
- `getOfficesByRegion(regionName)` — offices filtered by region
- `getRegion(regionName)` — region lookup by name

**5 files import from locations.js:**

| Consumer                                | Imports                                 | Usage                                   |
| --------------------------------------- | --------------------------------------- | --------------------------------------- |
| `src/app.ts`                            | `regions`, `getRegion`                  | State machine navigation, region lookup |
| `src/components/map-svg.ts`             | `getAllOffices`                         | 2D marker placement                     |
| `src/components/map-3d.js`              | `regions`, `getAllOffices`, `getRegion` | 3D markers, region halos, camera views  |
| `src/components/region-list.js`         | `regions`                               | Sidebar region navigation               |
| `src/components/specialty-divisions.js` | `specialtyDivisions`                    | Specialty panel rendering               |

### Projection Loading Chain

- `map-svg.ts:53` calls `await initProjection('usg')` — **HARDCODED** client ID
- `projection.ts` is already client-aware with `clientStates` Map for per-client isolation
- `client-registry.ts` manages prod/test import maps for `{clientId}-map-config.json` files
- `getConfigForClient(clientId)` validates against registry before loading

### Key Finding: 3D Map Not Integrated with Client Registry

The 3D map (`map-3d.js`) imports directly from `locations.js` and does NOT use the client-registry or projection systems. It independently:

- Reads `regions` and `getAllOffices()` from the hardcoded locations module
- Defines its own `REGION_COLORS` constant (lines 52-59)
- Defines its own `CAMERA_VIEWS` constant (lines 62-70)
- Computes 3D coordinates internally via `latLonToGlobe()`

This is the most significant integration gap for white-labeling.

---

## 2. HTML and DOM Injection Approach

### Current State

`src/index.html` contains 7+ USG-specific strings:

- `<title>USG Insurance - Locations Map</title>`
- `<meta name="description" content="...USG Insurance...">`
- Loading screen logo text
- Header logo and tagline
- Footer contacts (phone, email, department emails)
- Copyright holder
- Details panel placeholder text

### Recommended Approach: Runtime DOM Injection

Vite provides no HTML templating engine. The recommended approach is **runtime DOM injection** at app startup:

1. Keep `index.html` with generic placeholder elements (IDs for injection targets)
2. At `App.init()`, load the client config and inject text content into DOM elements
3. This matches existing patterns — the app already manipulates DOM elements by ID

**Injection targets identified:**

- `document.title` — page title
- `#loading-logo` — loading screen text
- `#header-logo` / `#header-tagline` — header branding
- `#footer-contacts` — footer contact section
- `#copyright` — copyright notice
- `#state-indicator` — breadcrumb (already dynamic)
- Details panel placeholder text — controlled by `DetailsPanel` component

### Alternative Rejected: Build-Time HTML Generation

Generating per-client HTML at build time was considered but rejected because:

- Adds build complexity (multiple output targets)
- Violates the spec's single-URL-parameter client selection mechanism
- Would require separate deployments per client instead of one static build

---

## 3. SVG Region Color Configuration

### Current State

`src/assets/usa-regions.svg` has an embedded `<style>` block with hardcoded hex colors:

```css
.region-northeast {
  fill: #1a5276;
}
.region-southeast {
  fill: #196f3d;
}
/* etc. */
```

`src/styles/tokens.css` defines CSS custom properties for region colors (lines 59-64) but these are **not currently consumed** by the SVG.

`src/components/map-3d.js` defines `REGION_COLORS` as a separate hardcoded constant (lines 52-59).

### Recommended Approach: CSS Custom Properties

Replace hardcoded colors in the SVG with CSS custom property references:

```css
/* In SVG embedded style */
.region-northeast {
  fill: var(--color-region-northeast, #1a5276);
}
```

**Why this works:**

- Inline SVG (loaded via `?raw`) lives in the parent document's DOM
- CSS custom properties from the parent document cascade into inline SVG
- Default values in `var()` provide graceful fallback
- Theme injection at startup sets `document.documentElement.style.setProperty()`

**Specificity consideration:** The SVG's embedded `<style>` uses class selectors (specificity 0-1-0). CSS custom properties set on `:root` or `document.documentElement` cascade naturally since the SVG is in the same DOM tree when loaded via `?raw` import.

**3D path:** Region colors for the 3D globe (`REGION_COLORS` constant) are consumed as Three.js hex values. These must be read from the client config at Map3D initialization time, not from CSS.

---

## 4. Marker State Centralization

### Current Architecture: Asymmetric 2D/3D Marker Logic

**2D (MapSvg):**

- `addMarkers()` creates markers for ALL offices via `getAllOffices()`
- `ensureMarkersVisible()` shows ALL markers regardless of selected region
- No region-based filtering or dimming
- Selection highlight via CSS class toggle

**3D (Map3D):**

- `createMarkers()` creates markers for ALL offices via `getAllOffices()`
- `updateExpensiveMarkerStates()` performs region-based dimming:
  - Selected region's markers get full opacity
  - Other regions' markers get dimmed (opacity ~0.3)
  - Backface culling hides markers on far side of globe
- Marker states updated every 250ms (throttled)

### Asymmetry Impact

The 2D and 3D renderers have fundamentally different marker visibility behavior:

- 2D shows all markers at all times
- 3D dims out-of-region markers and hides backface markers

This violates WLC-008 (Centralized Marker State Authority) which requires a single logical mechanism for marker visibility across both renderers.

### Recommended Approach: MarkerStateManager

Create a centralized `MarkerStateManager` module that:

1. Accepts inputs: `selectedRegion`, `selectedOffice`, list of all offices
2. Outputs per-marker state: `{ visible: boolean, selected: boolean, highlighted: boolean, dimmed: boolean }`
3. Both renderers consume this output rather than computing states independently
4. Backface culling in 3D remains a rendering-level concern (per spec: "rendering concern, not state concern")

**State computation logic (unified):**

- `visible`: always `true` (all markers always logically exist)
- `selected`: `office.officeCode === selectedOffice?.officeCode`
- `highlighted`: marker is hovered
- `dimmed`: `selectedRegion && office.region !== selectedRegion.name`

**Renderer responsibilities (not centralized):**

- 2D: CSS class application based on MarkerStateManager output
- 3D: Material property updates based on MarkerStateManager output + backface culling

### Refactoring Scope

Moderate — requires:

1. New module: `src/lib/marker-state.ts`
2. Modify `map-svg.ts` to consume marker state from manager
3. Modify `map-3d.js` to consume marker state from manager (keeping backface culling local)
4. Update `app.ts` to create/update marker state on selection changes

---

## 5. Hardcoded Client Strings Inventory

### Application Source (`src/`)

| File                     | Line   | Hardcoded String                                    | Extraction Target                                             |
| ------------------------ | ------ | --------------------------------------------------- | ------------------------------------------------------------- |
| `map-svg.ts`             | 53     | `initProjection('usg')`                             | `clientConfig.clientId`                                       |
| `map-3d.js`              | 52-59  | `REGION_COLORS` constant                            | `clientConfig.theme.regionColors`                             |
| `map-3d.js`              | 62-70  | `CAMERA_VIEWS` constant                             | `clientConfig.theme.cameraViews`                              |
| `details-panel.js`       | 31     | "Click on a region to explore USG offices."         | `clientConfig.name` interpolation                             |
| `details-panel.js`       | 129    | "USG" logo placeholder                              | `clientConfig.name`                                           |
| `details-panel.js`       | 223    | "USG" placeholder text                              | `clientConfig.name`                                           |
| `specialty-divisions.js` | 20     | "Our specialty divisions serve clients nationwide." | Generic or config-driven                                      |
| `index.html`             | title  | "USG Insurance - Locations Map"                     | `clientConfig.name`                                           |
| `index.html`             | meta   | "USG Insurance" description                         | `clientConfig.name`                                           |
| `index.html`             | header | Logo, tagline                                       | `clientConfig.name`, `clientConfig.tagline`                   |
| `index.html`             | footer | Phone, emails, copyright                            | `clientConfig.globalContacts`, `clientConfig.copyrightHolder` |

### SVG Asset

| File              | Line   | Hardcoded String                            |
| ----------------- | ------ | ------------------------------------------- |
| `usa-regions.svg` | 2      | `aria-label="USG Insurance Locations Map"`  |
| `usa-regions.svg` | 3      | `<title>USG Insurance Regions</title>`      |
| `usa-regions.svg` | 22     | `.marker` stroke `#003366` (USG brand navy) |
| `usa-regions.svg` | styles | Hardcoded region hex colors                 |

### Config Files (allowed per spec)

- `config/usg-map-config.json` — office codes prefixed `USG`
- `config/clients.prod.json` — `"usg"` in client list
- `config/clients.test.json` — `"usg"` in client list

---

## 6. Existing Multi-Tenant Infrastructure

### What Already Exists

| Component                  | Multi-Tenant Ready? | Notes                                                                 |
| -------------------------- | ------------------- | --------------------------------------------------------------------- |
| `client-registry.ts`       | Yes                 | Prod/test import maps, registry validation                            |
| `projection.ts`            | Yes                 | `clientStates` Map for per-client coordinate isolation                |
| `map-config.schema.ts`     | Partial             | Validates map-config JSON; needs extension for client-config          |
| `normalization.ts`         | Yes                 | `normalizeClientId()`, `normalizeOfficeCode()`, `normalizeRegionId()` |
| `coordinate-validation.ts` | No                  | `REGION_BOUNDS` hardcoded for USG regions                             |
| `locations.js`             | No                  | All data hardcoded for USG                                            |
| `map-svg.ts`               | Partial             | Uses projection system but hardcodes `'usg'`                          |
| `map-3d.js`                | No                  | No integration with client registry at all                            |
| `details-panel.js`         | No                  | Hardcoded USG strings                                                 |
| `index.html`               | No                  | Hardcoded USG strings                                                 |

### Gap Summary

The 2D coordinate projection pipeline (`client-registry → projection → map-svg`) is already multi-tenant capable. The primary gaps are:

1. **Data layer**: `locations.js` must be replaced by config-driven data
2. **3D renderer**: Must be integrated with client config for data, colors, and camera views
3. **UI text**: All hardcoded strings must be extracted to config
4. **Marker state**: Must be centralized per WLC-008
5. **Theme injection**: CSS tokens must be set from config at startup

---

## 7. Configuration File Design Considerations

### Coordinate Duality

Each office needs coordinates in the client config (lat/lon for 3D) AND in the map-config (SVG x/y for 2D). The map-config's `coordinates` array provides SVG positions computed from lat/lon at build time. The client config provides the raw lat/lon.

**Implication**: When onboarding a new client, they must provide:

1. `config/{clientId}-client.json` — business data including lat/lon coordinates
2. `config/{clientId}-map-config.json` — SVG projection data (computed from lat/lon)

The build pipeline that converts lat/lon → SVG (x,y) must be documented in the quickstart guide.

### Schema Validation Strategy

The spec requires Zod schemas (consistent with existing `map-config.schema.ts`). The new client config schema should:

- Be defined in a new file `src/lib/client-config.schema.ts`
- Validate at load time before any rendering
- Produce descriptive errors for missing required fields
- Accept `schemaVersion: 1` and reject higher versions
