# Feature Specification: White-Label Client Configuration

**Feature Branch**: `005-white-label-config`
**Created**: 2026-02-05
**Status**: Draft
**Input**: User description: "Everything USG must be extracted out into a single configuration file. The name, the slogan, the people, the offices, the coordinates, the speciality divisions, etc. Everything except the regions. Our goal is to white label this product and the configuration file should be what it derives the presentation from. This will be added as an invariant and made a strict part of the constitution. Consider architectural preference for marker state centralization. To ensure this works, design an alternative config for Odd Essentials instead of USG. Then launch the map with an example of both."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Deploy Map for a New Client Using Only Configuration (Priority: P1)

A platform operator wants to deploy the interactive locations map for a new client organization ("Odd Essentials") without modifying any application source code. They create a single client configuration file containing the client's company name, tagline, contact information, office locations with coordinates, personnel, and specialty divisions. The application reads this configuration at startup and renders the entire experience using the client's data — branding, offices, contacts, and all.

"Zero code changes" means: the operator creates one new JSON client configuration file and adds the client ID to the appropriate client registry file (`clients.prod.json` or `clients.test.json`). No `.ts`, `.js`, `.css`, `.html`, or `.svg` files are created or modified. Registry files are configuration, not application source.

**Why this priority**: This is the foundational capability that enables white-labeling. Without it, every client deployment requires code changes, which defeats the purpose of a reusable platform.

**Independent Test**: Can be fully tested by creating a new client configuration file (e.g., for "Odd Essentials") and launching the application pointed at that config. The map should display Odd Essentials branding, offices, and contacts with zero source code changes.

**Acceptance Scenarios**:

1. **Given** a valid client configuration file for "Odd Essentials" exists and `oddessentials` is listed in the client registry, **When** the application starts with `?client=oddessentials` in the URL, **Then** the page title, header logo text, tagline, footer contacts, and copyright all reflect "Odd Essentials" branding — no mention of "USG" appears anywhere in the rendered DOM.
2. **Given** the Odd Essentials config defines 4 offices across 3 regions, **When** the map renders, **Then** exactly 4 markers appear at the configured coordinates and the region list shows only those 3 regions with their associated offices.
3. **Given** the Odd Essentials config includes specialty divisions, **When** the user opens the specialty divisions section, **Then** only the divisions and personnel defined in the Odd Essentials config appear.
4. **Given** the Odd Essentials config defines global contact information (phone, email), **When** the footer renders, **Then** the footer shows Odd Essentials' phone number and email addresses — not USG's.

---

### User Story 2 - Switch Between Client Deployments (Priority: P2)

A developer or platform operator wants to verify that the same application codebase serves multiple clients correctly. They switch from the USG configuration to the Odd Essentials configuration by changing the `?client=` URL parameter, confirming that each renders a completely different experience from the same codebase.

**Why this priority**: Proving multi-client capability on the same codebase validates the white-label architecture end-to-end. This is essential before onboarding a second real client.

**Independent Test**: Can be tested by loading the application with `?client=usg` and then `?client=oddessentials`, then comparing the rendered output to confirm complete data isolation.

**Acceptance Scenarios**:

1. **Given** the application is loaded with `?client=usg`, **When** the user views the page, **Then** all USG-specific data (13 offices, 6 regions, USG branding, USG contacts) appears correctly.
2. **Given** the application is loaded with `?client=oddessentials`, **When** the user views the page, **Then** all Odd Essentials-specific data appears and no USG data is visible.
3. **Given** both configs reference the same shared map asset (USA regions SVG), **When** switching between clients, **Then** the map regions render identically but markers, personnel, and branding differ.
4. **Given** no `?client=` parameter is provided, **When** the application starts, **Then** it loads the first client listed in the active registry file (default behavior).

---

### User Story 3 - All UI Text Derived from Configuration (Priority: P3)

An end user visits the Odd Essentials locations page. Every piece of visible text — the page title in the browser tab, the loading screen logo, the header, placeholder messages, footer contacts, and copyright notice — comes from the client configuration. No hardcoded client-specific strings leak into the rendered experience.

**Why this priority**: Complete text extraction ensures the white-label is seamless. Even a single leaked "USG" string in a placeholder message breaks the illusion and damages client trust.

**Independent Test**: Can be tested by searching the rendered DOM for "USG" when running under the Odd Essentials config. Zero matches confirms complete extraction.

**Acceptance Scenarios**:

1. **Given** the application runs with Odd Essentials config, **When** the page loads, **Then** the loading screen shows the Odd Essentials name (not "USG").
2. **Given** the application runs with Odd Essentials config, **When** no region is selected, **Then** the details panel placeholder reads "Click on a region to explore Odd Essentials offices." (using the configured company name).
3. **Given** the application runs with Odd Essentials config, **When** the user selects an office, **Then** the office detail view shows the configured logo text (not "USG").

---

### User Story 4 - 3D Globe Reflects Client Configuration (Priority: P4)

When the user switches to 3D globe mode, the region colors and camera views for each region are driven by the client configuration (or fall back to shared defaults when not overridden). Markers appear at the coordinates defined in the client config and marker state updates remain centralized through a single logical mechanism.

**Why this priority**: The 3D globe currently hardcodes region colors and camera views as constants. These must be configuration-driven to support clients with different visual preferences.

**Independent Test**: Can be tested by switching to 3D mode under the Odd Essentials config and verifying that markers appear at Odd Essentials office coordinates with correct region coloring.

**Acceptance Scenarios**:

1. **Given** the application runs in 3D mode with Odd Essentials config, **When** the globe renders, **Then** markers appear at the lat/lon coordinates defined in the Odd Essentials config.
2. **Given** the Odd Essentials config overrides region colors for 2 of its active regions, **When** the user hovers over a region in 3D mode, **Then** the overridden regions use the configured color and any non-overridden regions use the shared default color.
3. **Given** the 3D map updates marker visibility, **When** the globe rotates, **Then** all marker visibility and selection state computation flows through a single centralized mechanism — no parallel logic exists in individual renderers.

---

### Edge Cases

- What happens when a client configuration is missing an optional field (e.g., no `globalContacts`)? The system renders gracefully: the footer contact section shows "Contact information not available" and no links are rendered.
- What happens when a client configuration is missing a required field (e.g., no `clientId`)? Validation fails at load time with a descriptive error message naming the missing field. The application does not render.
- What happens when a client has zero offices in a region? The region still appears on the map (it is a shared asset) but the office list shows "No offices in this region."
- What happens when a client defines an office whose `region` field names a region not present in the shared SVG map asset? The office marker still renders at its lat/lon coordinates but is not associated with any clickable region boundary. A console warning is emitted.
- What happens when a client defines an office with approximate coordinates? The coordinate confidence warning still appears as it does today.
- What happens when personnel have no `vcard_url`? The "Download vCard" button does not appear, matching current behavior.
- What happens when the client config omits `theme.regionColors` for a region? The system uses the shared default region colors defined in the application's base theme.
- What happens when the client config omits `theme.cameraViews` for a region? The system uses the shared default camera views (USA overview position).
- What happens when the URL specifies a `?client=` value not listed in the active registry? The application shows a clear error: "Unknown client: {id}. Check the client registry." It does not fall back silently to another client.
- What happens when a client config has a `schemaVersion` higher than the application supports? Validation fails with: "Configuration schema version {N} is not supported. Maximum supported: {M}."

## Configuration Boundary _(mandatory)_

This section defines the exact boundary between client-owned configuration and shared platform assets. This boundary is an architectural invariant.

### Client Configuration Owns (per-client JSON file)

| Data Category          | Description                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| Client Identity        | `clientId`, `name`, `tagline`, `copyrightHolder`                                                  |
| Global Contacts        | Main phone, main email, departmental emails, accounting contact                                   |
| Offices                | All office data: code, city, state, type, address, coordinates, region assignment, directions URL |
| Regional Personnel     | Personnel keyed by region name (manager name, title, phone, email, vCard URL)                     |
| Specialty Divisions    | Division names and their personnel lists                                                          |
| Brand Theme (optional) | Primary color, accent color, per-region color overrides, per-region camera view overrides         |

### Shared Platform Assets Own (NOT in client config)

| Asset                      | Description                                                      | Canonical Source                                        |
| -------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------- |
| SVG Map Geometry           | State boundaries, region group elements, viewBox dimensions      | `src/assets/usa-regions.svg`                            |
| Region Definitions         | Region IDs, names, and SVG path IDs                              | `config/{clientId}-map-config.json` `regions` array     |
| SVG Coordinate Projections | Per-office SVG (x, y) positions computed from lat/lon            | `config/{clientId}-map-config.json` `coordinates` array |
| Default Region Colors      | Base palette used when client config omits overrides             | Application base theme (CSS tokens)                     |
| Default Camera Views       | Base 3D camera positions used when client config omits overrides | Application base theme (constants)                      |
| Projection Parameters      | geoAlbersUsa scale, translate, viewBox                           | `config/{clientId}-map-config.json` `projection` object |

### How Client Config References Shared Regions

The canonical region identifier is the `name` field from the shared map-config's `regions` array (e.g., `"Northeast Region"`, `"Midwest Region"`). Client configs reference regions by this exact name string in three places:

1. **Office region assignment**: Each office's `region` field matches a region `name`.
2. **Regional personnel**: The `regionalPersonnel` object uses region `name` as its key.
3. **Theme overrides**: `theme.regionColors` and `theme.cameraViews` use region `name` as keys.

Region names are case-sensitive and must match the shared map-config exactly. Mismatches produce console warnings but do not prevent rendering.

## Client Selection Mechanism _(mandatory)_

The application MUST support a single, canonical client selection mechanism:

**URL query parameter**: `?client={clientId}`

Behavior rules:

- The `clientId` value is normalized to lowercase and trimmed.
- The normalized ID MUST exist in the active client registry (`clients.prod.json` or `clients.test.json`, determined by build environment).
- If the `?client=` parameter is absent, the application loads the **first** client listed in the active registry.
- If the `?client=` value does not match any registered client, the application displays a clear error and does not render.
- The selected client ID is stable for the lifetime of the page load. Changing clients requires a page reload with a new URL parameter.

## Client Configuration Format _(mandatory)_

### File Format and Location

- **Format**: JSON
- **File naming**: `config/{clientId}-client.json` (e.g., `config/usg-client.json`, `config/oddessentials-client.json`)
- **Encoding**: UTF-8

### Schema Versioning

Every client configuration file MUST include a `schemaVersion` field as its first property:

- `schemaVersion` is a positive integer starting at `1`.
- The application declares the maximum schema version it supports.
- If a config's `schemaVersion` exceeds the application's maximum, validation fails with a descriptive error.
- **Forward compatibility rule**: When bumping `schemaVersion`, all previously-required fields remain required. New fields are added as optional with documented defaults. Removing or renaming fields requires a major version bump.

### Required vs. Optional Fields

**Required fields** — validation hard-fails if any are missing:

| Field Path                          | Type    | Description                                       |
| ----------------------------------- | ------- | ------------------------------------------------- |
| `schemaVersion`                     | integer | Configuration schema version (currently `1`)      |
| `clientId`                          | string  | Unique client identifier (lowercase, no spaces)   |
| `name`                              | string  | Company display name                              |
| `copyrightHolder`                   | string  | Legal entity for copyright notice                 |
| `offices`                           | array   | At least one office entry                         |
| `offices[].officeCode`              | string  | Unique office identifier                          |
| `offices[].city`                    | string  | City name                                         |
| `offices[].state`                   | string  | State name                                        |
| `offices[].officeType`              | string  | `"Branch Office"` or `"Satellite Sales Office"`   |
| `offices[].region`                  | string  | Region name (must match shared region definition) |
| `offices[].coordinates.lat`         | number  | Latitude                                          |
| `offices[].coordinates.lon`         | number  | Longitude                                         |
| `offices[].coordinates.source`      | string  | `"verified"`, `"business_district"`, etc.         |
| `offices[].coordinates.confidence`  | string  | `"high"`, `"medium"`, `"low"`                     |
| `offices[].coordinates.approximate` | boolean | Whether location is approximate                   |

**Optional fields** — omission triggers documented fallback behavior:

| Field Path                         | Type   | Fallback When Missing                                                 |
| ---------------------------------- | ------ | --------------------------------------------------------------------- |
| `tagline`                          | string | No tagline rendered below company name                                |
| `globalContacts`                   | object | Footer contact section shows "Contact information not available"      |
| `globalContacts.mainPhone`         | string | Phone link not rendered                                               |
| `globalContacts.mainEmail`         | string | Email link not rendered                                               |
| `globalContacts.departmentEmails`  | object | Department links section not rendered                                 |
| `globalContacts.accountingContact` | object | Accounting contact card not rendered                                  |
| `offices[].address`                | string | "Address not available for this office."                              |
| `offices[].directionsUrl`          | string | "Get Directions" button not rendered                                  |
| `regionalPersonnel`                | object | "Regional Manager" section not rendered for regions without personnel |
| `regionalPersonnel[regionName]`    | array  | Personnel section omitted for that region                             |
| `regionalPersonnel[][].vcardUrl`   | string | "Download vCard" button not rendered                                  |
| `specialtyDivisions`               | array  | Specialty Divisions section not rendered at all                       |
| `theme`                            | object | All shared defaults apply                                             |
| `theme.primaryColor`               | string | Default from base CSS tokens                                          |
| `theme.accentColor`                | string | Default from base CSS tokens                                          |
| `theme.regionColors`               | object | Default region colors from base theme                                 |
| `theme.regionColors[regionName]`   | string | Default color for that specific region                                |
| `theme.cameraViews`                | object | Default camera views from base constants                              |
| `theme.cameraViews[regionName]`    | object | USA overview camera position for that region                          |
| `metadata`                         | object | No metadata displayed                                                 |

## Canonical Data Shapes _(mandatory)_

These structural contracts define the exact shape of data entities within the client configuration. All consumers (components, renderers, panels) MUST operate against these shapes after the configuration is loaded and validated.

### Office

```
{
  "officeCode": "ODD NY1",           // Required. Unique within client. Format: "{PREFIX} {STATE}{N}"
  "city": "Brooklyn",                // Required.
  "state": "New York",               // Required.
  "officeType": "Branch Office",     // Required. Enum: "Branch Office" | "Satellite Sales Office"
  "address": "123 Main St, ...",     // Optional. Null or omitted for satellite offices.
  "directionsUrl": "https://...",    // Optional. Google Maps link.
  "region": "Northeast Region",      // Required. Must match a shared region name.
  "coordinates": {                   // Required.
    "lat": 40.6782,                  // Required.
    "lon": -73.9442,                 // Required.
    "source": "verified",            // Required. Enum: "verified" | "business_district" | "city_centroid" | "region_centroid"
    "confidence": "high",            // Required. Enum: "high" | "medium" | "low"
    "approximate": false             // Required.
  }
}
```

### Personnel

```
{
  "name": "Jane Doe",                // Required.
  "title": "Regional Manager",       // Required.
  "phone": "555.123.4567",           // Required.
  "email": "jane@example.com",       // Required.
  "vcardUrl": "https://..."          // Optional.
}
```

### Specialty Division

```
{
  "name": "Consulting Division",     // Required.
  "personnel": [ /* Personnel[] */ ] // Required. May be empty array.
}
```

### Global Contacts

```
{
  "mainPhone": "800.555.1234",       // Optional.
  "mainEmail": "hello@example.com",  // Optional.
  "departmentEmails": {              // Optional.
    "claims": "claims@example.com",  // Optional.
    "lossRuns": "lr@example.com",    // Optional.
    "accounting": "ar@example.com"   // Optional.
  },
  "accountingContact": {             // Optional. Shape: Personnel (without vcardUrl).
    "name": "...",
    "title": "...",
    "phone": "...",
    "email": "..."
  }
}
```

### Brand Theme

```
{
  "primaryColor": "#2d5016",         // Optional. CSS hex color. Overrides --color-primary.
  "accentColor": "#4a7c23",          // Optional. CSS hex color. Overrides --color-accent.
  "regionColors": {                  // Optional. Keyed by region name.
    "Northeast Region": "#1a5276",
    "Midwest Region": "#a04000"
  },
  "cameraViews": {                   // Optional. Keyed by region name. 3D globe only.
    "Northeast Region": {
      "distance": 180,
      "lat": 41,
      "lon": -77
    }
  }
}
```

### Configurable CSS Token Surface Area

The following CSS custom properties are the **only** tokens overridable via client configuration. All other tokens (spacing, typography, shadows, z-index, layout) are part of the core application theme and are NOT configurable per-client:

| CSS Token               | Config Source          | Description                   |
| ----------------------- | ---------------------- | ----------------------------- |
| `--color-primary`       | `theme.primaryColor`   | Primary brand color           |
| `--color-primary-light` | Derived from primary   | Lighter variant (computed)    |
| `--color-primary-dark`  | Derived from primary   | Darker variant (computed)     |
| `--color-accent`        | `theme.accentColor`    | Interactive element color     |
| `--color-accent-light`  | Derived from accent    | Lighter variant (computed)    |
| `--color-accent-dark`   | Derived from accent    | Darker variant (computed)     |
| `--color-bg-overlay`    | Derived from primary   | Overlay background (computed) |
| `--color-region-*`      | `theme.regionColors.*` | Per-region map fill colors    |

## Client String Isolation Invariant _(mandatory)_

### Enforcement Scope

Client-specific literal strings (company names, email addresses, phone numbers, domain names, office codes, personnel names) are **forbidden** in:

1. **Application source files**: All `.ts`, `.js`, `.html`, `.css` files under `src/`.
2. **Shared SVG assets**: The map SVG file `src/assets/usa-regions.svg` — the SVG `<title>`, `aria-label`, and any text content MUST be generic (e.g., "Locations Map" not "USG Insurance Locations Map").
3. **Build tooling**: Vite config, build scripts — no client-specific strings baked into builds.

Client-specific strings are **allowed** in:

1. **Client configuration files**: `config/{clientId}-client.json` — this is their purpose.
2. **Client map-config files**: `config/{clientId}-map-config.json` — office codes and region path IDs.
3. **Client registry files**: `config/clients.prod.json`, `config/clients.test.json` — client ID lists.
4. **Test fixtures**: Test files may reference client data for assertions.
5. **Documentation and comments**: `README.md`, `CLAUDE.md`, code comments explaining history.
6. **Package metadata**: `package.json` `name`/`description` fields (the package is the platform, not a client).

### Formal Enforcement

A dedicated test MUST exist that scans all application source files (under `src/`) for known client-specific patterns. At minimum, the test MUST assert that none of the following strings appear in any `.ts`, `.js`, `.html`, or `.css` file under `src/`:

- `"USG"` (as a standalone word or brand reference — not as a substring of generic words)
- `"usgins.com"`
- `"aauins.com"`
- `"USG Insurance"`
- `"Allied American"`
- Any hardcoded phone number from any client config
- Any hardcoded email address with a client-specific domain

This test runs as part of the standard test suite and blocks PRs that introduce client-specific strings into application source.

## Marker State Centralization Contract _(mandatory)_

All marker visibility computation, selection highlighting, and visual state transitions for both 2D and 3D renderers MUST flow through a **single logical mechanism**. This means:

1. **One source of truth for marker state**: A centralized function or module determines whether each marker is visible, selected, highlighted, or dimmed. Individual renderers (MapSvg, Map3D) call this mechanism — they do not independently compute marker states.
2. **No parallel logic**: If marker visibility depends on the selected region, that filtering happens in one place. The 2D renderer and 3D renderer both consume the result. Neither renderer has its own independent "which markers to show" logic.
3. **Backface culling is a rendering concern, not a state concern**: The 3D globe's backface culling (hiding markers on the far side of the globe) is a rendering-level optimization, not a state decision. It is the one exception where the 3D renderer may independently hide markers — but it does not change their logical state.
4. **Test coverage**: At least one test MUST verify that the centralized mechanism is the sole arbiter of marker visibility state, by asserting that marker state output is consistent regardless of which renderer is active.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST read all client-specific data (company name, tagline, contacts, offices, personnel, specialty divisions, brand theme overrides) from a single JSON client configuration file — not from hardcoded source code.
- **FR-002**: The system MUST NOT contain any client-specific literal strings in application source files under `src/`. A dedicated test MUST enforce this invariant by scanning source files for known client patterns.
- **FR-003**: The HTML page title, meta description, loading screen text, header logo/tagline, footer contacts, footer copyright, details panel placeholder text, and SVG accessibility labels MUST all derive from the loaded client configuration.
- **FR-004**: The existing `src/data/locations.js` file MUST be replaced by client configuration data. The helper functions (`getAllOffices`, `getOfficesByRegion`, `getRegion`) MUST read from the loaded client config rather than from a hardcoded module.
- **FR-005**: The 3D globe's region colors and camera views MUST be derived from client configuration overrides, falling back to shared application defaults when overrides are not provided.
- **FR-006**: All marker visibility and selection state computation MUST flow through a single centralized mechanism. Neither the 2D nor 3D renderer may independently determine which markers to show or highlight (backface culling excepted as a rendering-only concern).
- **FR-007**: The system MUST support a second complete client configuration ("Odd Essentials") alongside the existing USG configuration, serving as proof that the white-label architecture works.
- **FR-008**: The client configuration MUST be validated at load time against the schema. Missing required fields MUST produce a descriptive error naming the field. Schema version mismatches MUST produce a descriptive error. The application MUST NOT render when validation fails.
- **FR-009**: CSS brand tokens (`--color-primary`, `--color-accent`, `--color-region-*`) MUST be injectable from the client configuration at application startup. Only the tokens listed in the Configurable CSS Token Surface Area are overridable. All other tokens remain fixed.
- **FR-010**: The client registry system (`config/clients.prod.json`, `config/clients.test.json`) MUST be extended to include client configuration file paths alongside existing map-config paths.
- **FR-011**: Regions are NOT part of the client configuration. Region definitions (ID, name, SVG path ID) remain in the shared map-config. Client configs reference regions by the canonical `name` field from the map-config's `regions` array.
- **FR-012**: The client configuration file MUST include a `schemaVersion` integer field. The application MUST reject configs whose `schemaVersion` exceeds the maximum supported version.
- **FR-013**: The client selection mechanism is the URL query parameter `?client={clientId}`. When absent, the first client in the active registry is loaded. When the value is unrecognized, the application shows an error and does not render.
- **FR-014**: When a client config omits optional theme overrides (region colors, camera views), the system MUST use shared default values from the application's base theme — not produce errors.

### Key Entities

- **Client Configuration**: The single JSON file that is the source of truth for a client deployment. Contains: schema version, client identity, global contacts, offices, regional personnel, specialty divisions, and brand theme. File path: `config/{clientId}-client.json`.
- **Office**: A physical or satellite location belonging to a client. Required attributes: office code, city, state, office type, region assignment, coordinates (lat/lon with source, confidence, approximate flag). Optional: address, directions URL.
- **Personnel**: A person associated with a region or specialty division. Required attributes: name, title, phone, email. Optional: vCard URL.
- **Specialty Division**: A non-geographic organizational unit. Required attributes: name, personnel array (may be empty).
- **Global Contacts**: Company-wide contact channels. All fields optional. Attributes: main phone, main email, department emails (claims, loss runs, accounting), accounting contact person.
- **Brand Theme**: Visual identity overrides. All fields optional. Attributes: primary color, accent color, per-region color overrides, per-region camera view overrides.
- **Client Registry**: The list of client IDs allowed in a given environment (prod/test). Includes paths to both client config and map-config files.

## Odd Essentials Test Configuration _(mandatory)_

The "Odd Essentials" configuration is a fictional test client designed to exercise **all** rendering paths and edge behaviors. It MUST include:

### Required coverage

1. **At least 4 offices across at least 3 regions** — one with a full address and `directionsUrl`, one without (satellite with null address), one with `approximate: true` coordinates, and one in a region that has no regional personnel assigned.
2. **At least 1 specialty division with personnel** and **1 specialty division with an empty personnel array** — to verify the "0 contacts" rendering path.
3. **Regional personnel for at least 2 regions** — and explicitly **no personnel** for at least 1 region that has offices — to verify the "no regional manager" fallback.
4. **Global contacts with at least one department email omitted** — to verify partial fallback rendering.
5. **Theme overrides for some but not all active regions** — to verify that overridden regions use configured colors and non-overridden regions fall back to defaults.
6. **Camera view override for at least 1 region** — and no override for others — to verify mixed default/override behavior in 3D mode.
7. **At least 1 personnel entry without `vcardUrl`** — to verify the vCard button omission path.
8. **At least 1 office assigned to a region that exists in the shared SVG** — and **at least 1 office assigned to a region name that does NOT exist in the SVG** — to verify the "unmatched region" warning path.
9. **`schemaVersion: 1`** — to validate schema version checking.

### Purpose

The Odd Essentials config is NOT a minimal config. It is a **comprehensive edge-case exerciser**. Its data should be clearly fictional (invented names, placeholder emails like `jane@oddessentials.com`, fabricated addresses) so it is never mistaken for real client data.

## Assumptions

- The SVG map asset (`usa-regions.svg`) is shared across all clients. Clients do not bring their own map geometry — they map their offices into the pre-existing region structure.
- The existing map-config JSON files (`config/{clientId}-map-config.json`) continue to handle SVG coordinate projection (office SVG positions, region SVG path IDs, viewBox, projection parameters). The new client config file handles everything else (branding, data, personnel).
- Office codes in the new system use a client-meaningful prefix (e.g., "ODD NY1" for Odd Essentials, "USG PA1" for USG), but the prefix format is not enforced by the platform — it is a client convention.
- The light/dark variant colors (`--color-primary-light`, `--color-primary-dark`, etc.) are computed from the base color at runtime rather than requiring the client to specify all variants.
- The SVG asset's embedded `<style>` block for region colors will need to be made dynamic or overridden at runtime via CSS custom properties, since region colors are now configurable.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A new client can be onboarded by creating one JSON client configuration file and adding the client ID to the registry — zero `.ts`, `.js`, `.css`, `.html`, or `.svg` files are modified.
- **SC-002**: When running under the Odd Essentials configuration, a text search of the rendered DOM for "USG" returns zero matches.
- **SC-003**: A dedicated source-scanning test asserts that no client-specific literal strings (USG, usgins.com, aauins.com) appear in any application source file under `src/`.
- **SC-004**: The USG configuration continues to work identically to the current application — no visual or functional regressions.
- **SC-005**: Both the 2D SVG map and 3D globe correctly render offices, regions, and branding for both USG and Odd Essentials configurations.
- **SC-006**: The client configuration is validated at load time; providing a config with a missing required field produces a descriptive error naming the field within 1 second of page load.
- **SC-007**: All existing tests continue to pass after the refactor (no regressions to the 100+ test baseline).
- **SC-008**: The Odd Essentials configuration exercises all documented edge behaviors: missing optional fields, approximate coordinates, empty personnel arrays, regions without personnel, unmatched region names, and partial theme overrides.
- **SC-009**: The marker state centralization contract is validated by at least one test asserting that marker visibility output is consistent regardless of active renderer.
- **SC-010**: Providing a config with `schemaVersion: 999` produces a descriptive version-mismatch error.
