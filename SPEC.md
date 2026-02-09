# odd-logistics Specification

> Companion app for odd-map — a visual, mobile-first client configuration builder.

Generated from a multi-perspective research team analysis (UX, Architecture, Devil's Advocate, Reviewer synthesis) on 2026-02-08.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [SVG Coordinate Coupling & odd-map Refactor](#2-svg-coordinate-coupling--odd-map-refactor)
3. [MVP Scope](#3-mvp-scope)
4. [UX Design](#4-ux-design)
5. [Technical Architecture](#5-technical-architecture)
6. [odd-map Config Format Reference](#6-odd-map-config-format-reference)
7. [Testing Strategy](#7-testing-strategy)
8. [Risk Analysis & Mitigations](#8-risk-analysis--mitigations)
9. [Phased Delivery Plan](#9-phased-delivery-plan)
10. [Deferred Items](#10-deferred-items)

---

## 1. Project Overview

**odd-logistics** is a standalone web application that generates valid configuration files for odd-map. Users interact with a MapLibre GL JS map to visually place offices, organize them into regions, assign personnel, pick brand colors, and export ready-to-use JSON config that plugs into odd-map without modification.

The long-term goal is full config generation (both client config and map config). The MVP generates client config only because odd-map's current SVG coordinate system is being refactored to support runtime lat/lon projection (see [TODO.md](./TODO.md) and [Section 2](#2-svg-coordinate-coupling--odd-map-refactor) below).

### Goals

- Mobile-first, user-friendly config builder with the map as the primary workspace
- Generate valid config JSON that passes odd-map's Zod schema validation (client config at MVP; full config after odd-map's runtime projection refactor)
- Enterprise-grade testing with deterministic test suite
- Local development server with live reload
- Deployed to GitHub Pages via `/docs` directory
- Copy/paste and file download for final config export

### Constraints

- New standalone repository (odd-map is unaffected)
- MapLibre GL JS only (free, no API keys for tiles)
- No backend — pure client-side application
- No framework — vanilla TypeScript matching odd-map's approach

---

## 2. SVG Coordinate Coupling & odd-map Refactor

### The Problem (odd-map)

odd-map's current architecture has a structural problem: **it does not use lat/lon for rendering**. It uses pre-computed SVG pixel coordinates (`svgX`/`svgY`) that are tightly coupled to a specific SVG file and a calibrated D3 projection. This is documented as a first-class concern in [TODO.md](./TODO.md).

Evidence from the odd-map codebase:

- `latLonToSvg()` in `src/lib/projection.ts` is **deprecated and throws an error**
- SVG coordinates are pre-computed by `scripts/recapture-coordinates.ts` using a brute-force grid search over D3 projection parameters (`scale: 1276, translate: [479, 299]`)
- `mapAssetHash` requires a SHA-256 hash of the actual SVG file
- `svgPathId` values (e.g., `region-usg-northeast-region`) reference specific `<path>` elements inside the SVG

This coupling means:

- No external tool can currently generate a valid map config
- Client onboarding requires running scripts inside the odd-map repo (no self-service path)
- Any SVG change invalidates all existing coordinates and requires full recalibration

### The Fix (odd-map)

odd-map will be refactored to use **runtime lat/lon projection**, eliminating the pre-computed `svgX`/`svgY` fields, the `mapAssetHash` requirement, and the calibration scripts. This is tracked as Option A in [TODO.md](./TODO.md) and will be a `schemaVersion: 2` migration.

### Impact on odd-logistics

| Phase             | What odd-logistics generates         | Depends on                                       |
| ----------------- | ------------------------------------ | ------------------------------------------------ |
| **MVP (now)**     | Client config only (`*-client.json`) | Nothing — lat/lon coordinates work today         |
| **Post-refactor** | Both client config AND map config    | odd-map's runtime projection refactor completing |

The MVP is scoped to client config not as a permanent limitation, but as a practical sequencing decision. Once odd-map ships runtime projection, odd-logistics will be updated to generate complete configs.

---

## 3. MVP Scope

### In Scope

| Feature             | Config Fields                                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Client identity     | `schemaVersion`, `clientId`, `name`, `copyrightHolder`, `tagline`                                                                        |
| Offices             | `officeCode`, `city`, `state`, `officeType`, `address`, `directionsUrl`, `region`, `coordinates` (lat/lon/source/confidence/approximate) |
| Regional personnel  | `regionalPersonnel` — keyed by region name, array of {name, title, phone, email, vcardUrl}                                               |
| Specialty divisions | `specialtyDivisions` — name + personnel array                                                                                            |
| Global contacts     | `globalContacts` — mainPhone, mainEmail, departmentEmails, accountingContact                                                             |
| Theme               | `primaryColor`, `accentColor`, `regionColors`, `mapProvider` config                                                                      |
| Export              | JSON clipboard copy + file download + validation summary                                                                                 |
| Import              | Load existing `*-client.json` for editing                                                                                                |

### Out of Scope (MVP — pending odd-map refactor)

- Map config generation (`*-map-config.json`) — blocked until odd-map ships runtime lat/lon projection
- `theme.cameraViews` — requires 3D scene knowledge tied to odd-map's Three.js rendering
- `clients.*.json` registry file generation — documented as manual step
- vCard URL generation
- E2E browser tests (Playwright)
- Visual regression testing

---

## 4. UX Design

### 4.1 Design Philosophy

**"Draw your map, fill in the details."**

The map is the primary workspace. Users start by placing offices on the map and grouping them into regions. Metadata (personnel, contacts, etc.) is entered through contextual panels that appear in response to map actions.

### 4.2 Layout Architecture

#### Mobile (< 768px) — Bottom Sheet Pattern

```
+----------------------------------+
|  [=] App Bar (clientName) [...]  |   48px, hamburger + overflow
+----------------------------------+
|  [Step 1] [Step 2] [Step 3]...  |   36px, horizontal scroll stepper
+----------------------------------+
|                                  |
|         MapLibre GL Map          |   Fills remaining space
|         (full viewport)          |
|                                  |
+----------------------------------+
|  ______________________________  |
|  |  Contextual content here   |  |   Bottom Sheet (draggable)
|  |____________________________|  |   3 snap points
+----------------------------------+
```

**Bottom sheet snap positions:**

| Position | Height        | Use                                                                          |
| -------- | ------------- | ---------------------------------------------------------------------------- |
| Peek     | ~80px         | Summary + primary action button. Map fully visible. Default resting state.   |
| Half     | ~45% viewport | Scrollable list or form. Map partially visible above.                        |
| Full     | ~90% viewport | Full form editing. 48px remains for app bar. "Back to map" button available. |

#### Desktop (> 768px) — Side Panel

Bottom sheet becomes a **400px right-side panel**. Map fills remaining space. Step indicator moves to the panel header.

#### Tablet (768px–1024px)

Bottom sheet with wider padding, max-width 540px, centered horizontally.

### 4.3 Phase Flow

A 6-phase guided flow with free navigation between completed phases. Not a locked wizard — users can jump back to any completed phase.

| Phase       | Focus                                                    | Primary Surface           |
| ----------- | -------------------------------------------------------- | ------------------------- |
| 1. Identity | clientId, name, copyrightHolder, tagline                 | Bottom sheet (half)       |
| 2. Offices  | Search, pin, edit offices on map                         | Map + bottom sheet (peek) |
| 3. Regions  | Create regions, assign offices                           | Map + bottom sheet (half) |
| 4. People   | Regional personnel, specialty divisions, global contacts | Bottom sheet (half)       |
| 5. Theme    | Brand colors, map provider config                        | Bottom sheet (half)       |
| 6. Export   | Validate, preview, copy/download JSON                    | Bottom sheet (full)       |

A persistent **step indicator** (pill-shaped stepper) shows which phases are complete. Green checkmarks on completed phases. Users tap any completed phase to jump back. Collapses to current step label on screens < 360px.

### 4.4 Map Interaction Patterns

#### Adding Offices (Primary: Search + Pin)

1. Floating search bar at top of map (pill-shaped with search icon)
2. User types address → autocomplete results appear (Nominatim geocoding)
3. User taps result → map flies to location with temporary marker
4. Confirmation sheet slides to peek: "Add office here?" with address pre-filled
5. User taps "Add Office" → sheet expands to half with office form (officeCode, city, state, officeType, region)
6. On save → marker becomes permanent, sheet returns to peek

#### Editing Offices

Tap existing marker → bottom sheet opens at half with office details → "Edit" button for edit mode, "Delete" with confirmation dialog.

#### Marker Styles

| Office Type            | Marker Style                      |
| ---------------------- | --------------------------------- |
| Branch Office          | Solid filled pin (primaryColor)   |
| Satellite Sales Office | Outlined/hollow pin (accentColor) |
| Selected               | Enlarged pin with subtle pulse    |
| Unassigned to region   | Orange warning dot on pin         |

#### Map Controls

- Standard MapLibre zoom/rotate (top-right, 44x44px touch targets)
- "Fit all offices" floating action button (bounding box zoom)
- Geolocation button (center map on user location)
- Light/dark tile style toggle

### 4.5 Region Management

**List-based assignment (mobile default):**

1. Create region by name in bottom sheet
2. Offices appear in "Unassigned" list
3. Drag offices from "Unassigned" into region groups
4. Alternatively, tap marker on map → "Assign to region" dropdown

On the map, offices are tinted with their region color for visual grouping (no SVG boundaries drawn).

### 4.6 Color Picker

**Two-step picker:**

1. **Swatch grid**: 12 curated professional colors + "Custom" option
2. **Custom**: Compact HSL picker with hex input field

Features:

- Live preview strip showing color as header bar, button, and text accent
- WCAG AA contrast check badge (pass/fail against white and dark backgrounds)
- Region colors: horizontal scrollable row of swatches per region, auto-assigned to avoid duplicates
- All hex colors must be 6-digit format (`#1a5276`, not `#1a5`)

### 4.7 Personnel & Contacts

**Regional personnel:** Each region card gets a "People" section. Inline form for name, title, phone, email. Swipe-left to delete. Tap to expand and edit.

**Specialty divisions:** Dedicated section in Phase 4. List of division cards, each expandable to show/edit personnel.

**Global contacts:** Simple form with labeled fields. Department emails in an expandable accordion.

### 4.8 Export Experience

1. Bottom sheet at full height with summary dashboard:
   - Client identity summary
   - Office count by region
   - Validation status (green checkmarks or red warnings)
2. **Validation gate**: Runs `ClientConfigSchema.safeParse()` — errors shown inline with links back to offending field
3. Two actions:
   - **Copy to clipboard** — large button, filename displayed (`{clientId}-client.json`), "Copied!" confirmation
   - **Download as file** — secondary action, downloads `.json` file
4. JSON formatted with 2-space indentation
5. Syntax-highlighted JSON preview (read-only)

### 4.9 Collapsible Interface Elements

| Element                | Behavior                                                   | Trigger                      |
| ---------------------- | ---------------------------------------------------------- | ---------------------------- |
| Step stepper           | Collapses to current step label                            | Screen < 360px               |
| Search bar             | Collapses to floating magnifying glass                     | Sheet at half or full        |
| Bottom sheet           | 3 snap points (peek/half/full)                             | Drag gesture or programmatic |
| Office detail sections | Accordion within sheet                                     | Tap section header           |
| Region cards           | Collapsed: name + count. Expanded: office list + personnel | Tap card                     |
| Department emails      | Collapsed under "More contacts"                            | Tap to expand                |
| Map controls           | Auto-hide after 3s idle, reappear on touch                 | Timeout                      |
| Validation errors      | Collapsed: count badge. Expanded: full list                | Tap badge                    |

### 4.10 Accessibility (WCAG AA)

- All interactive elements: minimum 44x44px touch targets
- Color pickers include hex text input (not color-only)
- 4.5:1 contrast ratio enforcement (matching odd-map's existing pattern)
- Bottom sheet handle: `role="slider"` with `aria-valuemin/max/now`
- Map markers: keyboard-focusable with `tabindex="0"` and `aria-label`
- Focus trap within bottom sheet at full height
- All animations respect `prefers-reduced-motion: reduce`
- Semantic HTML5: `<nav>`, `<main>`, `<aside>`, `<form>`, `<fieldset>`
- Live regions: `aria-live="polite"` for toasts and validation
- Validation: field-level `aria-describedby` linking to error messages

---

## 5. Technical Architecture

### 5.1 Key Decisions

| Decision         | Choice                                           | Rationale                                   |
| ---------------- | ------------------------------------------------ | ------------------------------------------- |
| Framework        | Vanilla TypeScript (no React/Vue)                | Matches odd-map, minimizes bundle           |
| State management | Custom pub/sub store with Zod validation         | Simple, no deps, built-in validation        |
| Map provider     | MapLibre GL JS 5.17.0                            | Same version as odd-map, free CartoDB tiles |
| Geocoding        | Nominatim (OpenStreetMap)                        | Free, no API key, 1 req/sec rate limit      |
| Schema sharing   | File copy with version-pinning + drift detection | Simple, schemas change rarely               |
| Persistence      | localStorage drafts + JSON export                | No backend, user-owned data                 |
| Testing          | Vitest + jsdom, mocked HTTP                      | Deterministic, matches odd-map patterns     |
| Deployment       | Vite build → /docs → GitHub Pages                | Same model as odd-map                       |
| CSS              | Custom properties (design tokens)                | Matches odd-map's theme pattern             |
| Build target     | ES2022, ESNext modules                           | Exact match of odd-map tsconfig             |

### 5.2 Runtime Dependencies

Only two:

| Package              | Size (gzipped) | Purpose           |
| -------------------- | -------------- | ----------------- |
| `maplibre-gl` 5.17.0 | ~200KB         | Interactive map   |
| `zod` ^4.3.5         | ~13KB          | Schema validation |

**Total bundle target: < 300KB gzipped** (including application code).

### 5.3 Project Structure

```
odd-logistics/
├── src/
│   ├── app.ts                          # Main application entry point
│   ├── vite-env.d.ts                   # Vite type declarations
│   ├── index.html                      # SPA entry HTML
│   ├── styles/
│   │   ├── tokens.css                  # CSS custom properties (design tokens)
│   │   ├── layout.css                  # Grid/flex layout
│   │   ├── forms.css                   # Form controls
│   │   └── map.css                     # MapLibre overrides
│   ├── lib/
│   │   ├── schemas/
│   │   │   ├── client-config.schema.ts # Copy of odd-map's ClientConfigSchema
│   │   │   ├── normalization.ts        # Copy of odd-map's normalization.ts
│   │   │   └── index.ts               # Re-exports all schemas + types
│   │   ├── geocoding/
│   │   │   ├── nominatim.ts            # Nominatim API client
│   │   │   ├── geocoder.ts             # Geocoder abstraction (strategy pattern)
│   │   │   └── rate-limiter.ts         # Request throttling (1 req/sec)
│   │   ├── map/
│   │   │   ├── map-manager.ts          # MapLibre init + lifecycle
│   │   │   ├── markers.ts             # Marker CRUD on the map
│   │   │   └── interactions.ts        # Click-to-place, drag markers
│   │   ├── state/
│   │   │   ├── config-store.ts        # Central reactive state store
│   │   │   ├── actions.ts             # State mutation actions
│   │   │   └── persistence.ts         # localStorage save/restore + export
│   │   ├── export/
│   │   │   └── client-config-export.ts # Generate + validate client config JSON
│   │   └── utils/
│   │       ├── escape-html.ts         # XSS prevention
│   │       └── debounce.ts            # Input debouncing
│   ├── components/
│   │   ├── config-form/
│   │   │   ├── client-info-form.ts    # clientId, name, copyrightHolder, tagline
│   │   │   ├── office-form.ts         # Single office editor
│   │   │   ├── office-list.ts         # Office list with add/remove
│   │   │   ├── personnel-form.ts      # Personnel editor
│   │   │   ├── theme-form.ts          # Theme editor (colors, map provider)
│   │   │   └── global-contacts-form.ts
│   │   ├── map-panel/
│   │   │   ├── map-view.ts            # MapLibre map container + controls
│   │   │   ├── geocode-search.ts      # Address search with autocomplete
│   │   │   └── coordinate-picker.ts   # Click-on-map to set lat/lon
│   │   ├── preview/
│   │   │   ├── json-preview.ts        # Live JSON output preview
│   │   │   └── validation-panel.ts    # Real-time validation errors
│   │   └── shared/
│   │       ├── bottom-sheet.ts        # Draggable bottom sheet (3 snap points)
│   │       ├── color-picker.ts        # Swatch grid + HSL + hex input
│   │       ├── toast.ts               # Toast notifications
│   │       └── modal.ts              # Confirmation modals
│   └── types/
│       └── index.ts                   # App-specific types (UI state, form state)
├── tests/
│   ├── unit/
│   │   ├── schemas/
│   │   │   └── client-config.test.ts  # Schema validation tests
│   │   ├── geocoding/
│   │   │   ├── nominatim.test.ts      # Nominatim client tests (mocked HTTP)
│   │   │   └── rate-limiter.test.ts   # Rate limiter tests (deterministic timers)
│   │   ├── state/
│   │   │   ├── config-store.test.ts   # State management tests
│   │   │   ├── actions.test.ts        # Action dispatch tests
│   │   │   └── persistence.test.ts    # localStorage mock tests
│   │   └── export/
│   │       └── client-config-export.test.ts
│   ├── integration/
│   │   ├── form-to-json.test.ts       # Full flow: form fill → JSON output
│   │   └── geocode-to-marker.test.ts  # Search → geocode → marker placement
│   └── fixtures/
│       ├── valid-client-config.json   # Copy of odd-map's acme-client.json
│       └── invalid-configs.ts         # Factory functions for invalid configs
├── scripts/
│   └── verify-schema-compat.ts        # Diff schemas against odd-map to detect drift
├── public/
│   └── favicon.ico
├── docs/                              # GitHub Pages build output
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── eslint.config.mjs
├── .prettierrc
└── CLAUDE.md
```

### 5.4 Build Toolchain

#### package.json (key dependencies)

```json
{
  "name": "odd-logistics",
  "type": "module",
  "engines": { "node": ">=22.0.0" },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:ci": "vitest run",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "verify": "npm run typecheck && npm run lint && npm run format:check && npm run test:ci"
  },
  "dependencies": {
    "maplibre-gl": "5.17.0",
    "zod": "^4.3.5"
  },
  "devDependencies": {
    "@eslint/js": "9.39.2",
    "@types/node": "22.19.7",
    "@vitest/coverage-v8": "4.0.17",
    "eslint": "9.39.2",
    "eslint-config-prettier": "10.1.8",
    "globals": "17.0.0",
    "jsdom": "27.4.0",
    "prettier": "3.8.0",
    "typescript": "^5.7.0",
    "typescript-eslint": "8.53.0",
    "vite": "7.3.1",
    "vitest": "4.0.17"
  }
}
```

#### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vitest/globals", "node"],
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["node_modules", "dist", "docs"]
}
```

#### vite.config.ts

```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../docs', // GitHub Pages output
    emptyOutDir: true,
  },
  server: {
    port: 3001, // Different from odd-map's 3000
    open: true,
  },
  resolve: {
    alias: { '@': '/src' },
  },
});
```

### 5.5 State Management

Custom reactive store with pub/sub pattern and built-in Zod validation:

```typescript
class ConfigStore {
  private draft: DraftClientConfig;
  private listeners: Set<Listener> = new Set();
  private validationErrors: z.ZodError | null = null;

  subscribe(listener: Listener): () => void {
    /* ... */
  }
  getDraft(): Readonly<DraftClientConfig> {
    /* ... */
  }
  getValidationErrors(): z.ZodError | null {
    /* ... */
  }
  isValid(): boolean {
    /* ... */
  }

  // Mutations (each triggers revalidation + listener notification)
  setClientInfo(info: Partial<ClientInfo>): void {
    /* ... */
  }
  addOffice(office: DraftOffice): void {
    /* ... */
  }
  updateOffice(index: number, office: Partial<DraftOffice>): void {
    /* ... */
  }
  removeOffice(index: number): void {
    /* ... */
  }
  // ... more mutations

  // Export validated config (throws if invalid)
  export(): ValidatedClientConfig {
    /* ... */
  }
}
```

**Persistence strategy:**

- Save to localStorage on every mutation (debounced 500ms)
- On load: attempt restore, validate with Zod, discard silently if invalid
- localStorage is a convenience cache, NOT a guarantee — primary export is always clipboard/file download

### 5.6 MapLibre Integration

```typescript
// Same CartoDB tile URLs as odd-map (free, no API key)
const STYLE_URLS = {
  light: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
} as const;
```

- Lazy-load via dynamic import (same pattern as odd-map's `MapLibreProvider`)
- Default center: `[-98, 39]` (center of USA), zoom 4
- Interactive: click-to-place for coordinate capture
- Markers use custom HTML elements matching odd-map's marker approach
- Light/dark tile style toggle

### 5.7 Geocoding

**Nominatim (OpenStreetMap)** with rate limiting:

- Base URL: `https://nominatim.openstreetmap.org/search`
- Rate limit: 1 request/second (hard requirement per Nominatim ToS)
- Required header: `User-Agent: odd-logistics/1.0 (config builder tool)`
- Parameters: `format=jsonv2`, `countrycodes=us`, `limit=5`, `addressdetails=1`
- Debounce user input: 500ms before triggering geocode request

**Confidence mapping** (to match odd-map's coordinate schema):

| Nominatim Result Level        | `source`            | `confidence` | `approximate` |
| ----------------------------- | ------------------- | ------------ | ------------- |
| Street-level, high importance | `business_district` | `medium`     | `false`       |
| City-level                    | `city_centroid`     | `medium`     | `true`        |
| Region/state-level            | `region_centroid`   | `low`        | `true`        |
| Manual map click              | `city_centroid`     | `low`        | `true`        |
| User overrides to verified    | `verified`          | `high`       | `false`       |

**Fallback:** If Nominatim is unavailable, users can click the map to set coordinates manually.

### 5.8 Schema Sharing Strategy

Copy files from odd-map with version-pinning comments:

```typescript
/**
 * COPIED FROM: odd-map/src/lib/client-config.schema.ts
 * COMMIT: <sha>
 * DATE: 2026-02-08
 *
 * This file MUST stay in sync with odd-map's schema.
 * Run `npm run verify:schema-compat` to check for drift.
 */
```

Source files to copy:

- `odd-map/src/lib/client-config.schema.ts` (151 lines)
- `odd-map/src/lib/normalization.ts` (86 lines)

A CI script (`scripts/verify-schema-compat.ts`) compares against odd-map's schemas to detect drift.

### 5.9 Security

Following odd-map's patterns:

- HTML escaping for all user input rendered to DOM
- URL sanitization for `directionsUrl`, `vcardUrl` fields
- HTTPS enforcement (schema validates `^https://` for all URLs)
- No `eval`/`innerHTML` with user data — use `textContent` or DOM API
- CSP-compatible: no inline scripts or styles
- Nominatim requests over HTTPS with `User-Agent` header per ToS

---

## 6. odd-map Config Format Reference

### 6.1 Client Config (`{clientId}-client.json`)

This is what odd-logistics generates.

```typescript
{
  schemaVersion: 1,                    // Must be 1
  clientId: string,                    // ^[a-z][a-z0-9]*$ (lowercase alphanum, starts with letter)
  name: string,                        // 1-256 chars
  copyrightHolder: string,             // 1-256 chars
  tagline?: string,                    // Max 500 chars
  offices: Office[],                   // Min 1 required, officeCode must be unique
  regionalPersonnel?: Record<string, Personnel[]>,
  specialtyDivisions?: SpecialtyDivision[],
  globalContacts?: GlobalContacts,
  theme?: BrandTheme,
  metadata?: Record<string, unknown>
}
```

**Office:**

```typescript
{
  officeCode: string,                  // 1-32 chars, unique across all offices
  city: string,                        // 1-128 chars
  state: string,                       // 1-128 chars
  officeType: "Branch Office" | "Satellite Sales Office",
  address: string | null,              // Max 512 chars or null
  directionsUrl?: string,              // HTTPS URL, max 2048 chars
  region: string,                      // 1-128 chars (must match a region name)
  coordinates: {
    lat: number,                       // -90 to 90
    lon: number,                       // -180 to 180
    source: "verified" | "business_district" | "city_centroid" | "region_centroid",
    confidence: "high" | "medium" | "low",
    approximate: boolean
  }
}
```

**Personnel:**

```typescript
{
  name: string,                        // 1-128 chars
  title: string,                       // 1-128 chars
  phone: string,                       // 1-30 chars
  email: string,                       // Valid email, max 254 chars
  vcardUrl?: string                    // HTTPS URL, max 2048 chars
}
```

**BrandTheme:**

```typescript
{
  primaryColor?: string,               // 6-digit hex (#1a5276)
  accentColor?: string,                // 6-digit hex
  regionColors?: Record<string, string>, // Region name → hex color
  cameraViews?: Record<string, CameraView>, // Out of scope for MVP
  mapProvider?: {
    provider: "maplibre" | "apple" | "google",
    tileStyleUrl?: string,
    appleMapToken?: string,
    googleMapsApiKey?: string,
    defaultZoom: number,               // 1-20, default 15
    defaultTileStyle: "light" | "dark" // Default "light"
  }
}
```

### 6.2 Map Config (`{clientId}-map-config.json`)

Not generated by odd-logistics at MVP. Will be generated after odd-map's runtime projection refactor eliminates the SVG coordinate coupling. Documented here for reference and to inform the post-refactor integration.

```typescript
{
  configVersion: 1,
  mapId: string,
  clientId: string,
  mapAssetHash: string,                // 64-char SHA-256 hex
  viewBox: { x: number, y: number, width: number, height: number },
  coordinates: [{
    officeCode: string,
    lat: number, lon: number,
    svgX: number, svgY: number         // SVG pixel positions (requires D3 projection)
  }],
  regions?: [{
    id: string,
    name: string,
    svgPathId: string                  // "region-{clientId}-{regionId}"
  }],
  projection?: { type: string, scale: number, translate: [number, number] }
}
```

### 6.3 Validation Rules

- `schemaVersion` must be exactly `1`
- `clientId` must match `^[a-z][a-z0-9]*$`
- `offices` array must have at least 1 entry
- All `officeCode` values must be unique (enforced via Zod superRefine)
- All URLs must use HTTPS (no http://, javascript:, data://)
- Hex colors must be exactly 6 digits: `#[0-9a-fA-F]{6}`
- Email validated by Zod `.email()`
- Coordinates: lat in [-90, 90], lon in [-180, 180]

### 6.4 Normalization

Applied automatically during validation:

- Office codes: trim + uppercase
- Region IDs: trim + lowercase
- Client IDs: trim + lowercase

---

## 7. Testing Strategy

### 7.1 Principles

"Enterprise-grade" concretely means:

- **Deterministic**: No flaky tests. All external APIs mocked. Fake timers for rate limiter tests.
- **Schema-validated**: The golden test — export from odd-logistics passes odd-map's `ClientConfigSchema.safeParse()`.
- **Pattern-matched**: Follow odd-map's existing test patterns (factory functions, `vi.mock()`, boundary value testing).

### 7.2 Test Categories

#### Unit Tests (`tests/unit/`)

| Area               | What's Tested                                            | Approach                                     |
| ------------------ | -------------------------------------------------------- | -------------------------------------------- |
| Schema validation  | Round-trip: generate config → validate → passes          | Port key tests from odd-map's 947-line suite |
| Store mutations    | Every state transition produces valid intermediate state | Factory functions for initial state          |
| Geocoding client   | Nominatim request/response mapping                       | `vi.fn()` mocked `fetch()`                   |
| Rate limiter       | Throttling behavior, queue ordering                      | `vi.useFakeTimers()`                         |
| Confidence mapping | Nominatim result levels → coordinate metadata            | Pure function tests                          |
| Export             | Generated JSON matches expected structure                | Snapshot + schema validation                 |

#### Integration Tests (`tests/integration/`)

| Test               | Flow                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| Form → JSON        | Create client → add offices → assign regions → add personnel → export → validate against `ClientConfigSchema` |
| Import → Re-export | Load existing config → modify → re-export → diff is minimal and correct                                       |
| Geocode → Marker   | Search address → select result → marker placed → coordinates captured in state                                |

#### Golden Test

The critical acceptance test: export JSON from odd-logistics, validate it against odd-map's exact `ClientConfigSchema`. If this passes, the config is guaranteed to work in odd-map.

### 7.3 Test Patterns

```typescript
// Mocked geocoding (never call real API in tests)
vi.mock('../src/lib/geocoding/nominatim', () => ({
  geocodeAddress: vi.fn().mockResolvedValue([
    {
      lat: 40.7128,
      lon: -74.006,
      displayName: '789 Broadway, New York, NY 10003',
      confidence: 'high',
      source: 'verified',
    },
  ]),
}));

// Factory functions for test fixtures
function createValidOffice(overrides?: Partial<DraftOffice>): DraftOffice {
  /* ... */
}
function createValidConfig(overrides?: Partial<DraftClientConfig>): DraftClientConfig {
  /* ... */
}

// Boundary value testing
test('rejects latitude outside [-90, 90]', () => {
  /* ... */
});
test('rejects longitude outside [-180, 180]', () => {
  /* ... */
});
test('rejects zoom outside [1, 20]', () => {
  /* ... */
});
```

### 7.4 Coverage

Target: ~200-300 test lines covering critical paths. Match odd-map's coverage config (v8 provider, text + html reporters).

---

## 8. Risk Analysis & Mitigations

| Risk                                | Severity               | Mitigation                                                                                                                                                       |
| ----------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SVG coordinate coupling in odd-map  | **High — being fixed** | odd-map refactoring to runtime lat/lon projection (see [TODO.md](./TODO.md)). MVP generates client config only; full config generation unblocked after refactor. |
| Nominatim rate limits (1 req/sec)   | Medium                 | Queue with rate limiter; manual coordinate entry as fallback; debounce input 500ms                                                                               |
| Nominatim accuracy (no suite-level) | Medium                 | Show confidence level; let users adjust pins on map; don't claim "verified" for geocoded results                                                                 |
| localStorage data loss              | Medium                 | Treat as convenience cache only; primary export is file download/clipboard; warn users                                                                           |
| Schema drift between repos          | Medium                 | Copy-with-version-pin + CI drift detection script. Will revisit shared package after odd-map schema v2 stabilizes.                                               |
| Two-file workflow (temporary)       | Medium                 | MVP: client config from odd-logistics, map config from odd-map scripts. Post-refactor: odd-logistics generates both.                                             |
| Bundle size                         | Low                    | MapLibre (~200KB gzip) is largest dep; lazy-load; total < 300KB gzip                                                                                             |
| Mobile MapLibre performance         | Low                    | MapLibre is well-optimized for mobile; no 3D rendering overhead                                                                                                  |
| Accessibility gaps                  | Low                    | 44px targets, keyboard nav, aria-live, focus trapping are MVP requirements                                                                                       |

---

## 9. Phased Delivery Plan

### Phase 1: MVP — Core Client Config Generator

1. Project scaffold: Vite + TypeScript + Vitest + ESLint + Prettier
2. Copy and verify odd-map's `ClientConfigSchema` and `normalization.ts`
3. State store with pub/sub + localStorage persistence
4. Identity form (clientId, name, copyrightHolder, tagline)
5. MapLibre map initialization (CartoDB tiles, lazy-loaded)
6. Geocoding integration (Nominatim + rate limiter)
7. Office management: search + pin, edit form, marker display
8. Region management: create regions, list-based office assignment, region colors
9. Personnel management: regional personnel + specialty divisions
10. Global contacts + department emails
11. Theme: primary/accent colors (hex input + swatch grid + WCAG preview), mapProvider config
12. Export: JSON clipboard copy + file download + Zod validation gate
13. Import: paste/upload existing `*-client.json`
14. Bottom sheet component (mobile) + side panel (desktop)
15. Step indicator with phase navigation
16. Test suite: schema validation, store, geocoding (mocked), full-flow integration
17. GitHub Pages deployment (`npm run build` → `/docs`)

### Phase 2: Polish

- Pin drop animations, spring physics on bottom sheet
- Long-press-to-pin on map
- Desktop lasso selection for region assignment
- Brand color theming of the odd-logistics UI itself
- Undo/redo (state history stack)
- Multi-client management (switch between saved configs)
- Glassmorphism on bottom sheet handle
- Confetti animation on successful copy
- Illustrated empty states

### Phase 3: Full Config Generation (after odd-map refactor)

- Once odd-map ships runtime lat/lon projection (`schemaVersion: 2`), update odd-logistics to generate both client config and map config
- Map config generation becomes straightforward: lat/lon coordinates (already captured), region definitions, and simplified metadata — no SVG coupling
- Update copied schemas to match odd-map's v2 schema
- Extract shared schemas to `@oddessentials/map-config-schema` npm package if warranted at that point

---

## 10. Deferred Items

These items were discussed during research but explicitly deferred:

| Item                           | Status                   | Notes                                                                                                  |
| ------------------------------ | ------------------------ | ------------------------------------------------------------------------------------------------------ |
| Map config generation          | **Blocked → Phase 3**    | Waiting on odd-map's runtime projection refactor. Will be unblocked when `svgX`/`svgY` are eliminated. |
| `theme.cameraViews`            | Deferred                 | Requires 3D scene knowledge tied to odd-map's Three.js rendering                                       |
| Client registry generation     | Deferred                 | Simple enough to document as a manual step                                                             |
| vCard URL generation           | Deferred                 | Low priority, no generation logic needed                                                               |
| E2E browser tests (Playwright) | Deferred                 | Too heavy for MVP; add after UI stabilizes                                                             |
| Visual regression testing      | Deferred                 | Not needed until UI is stable                                                                          |
| Shared npm schema package      | **Revisit at schema v2** | Premature now; reassess when odd-map ships `schemaVersion: 2`                                          |
| React/Vue/framework adoption   | Not planned              | Vanilla TS is sufficient and matches odd-map                                                           |
| Backend/database               | Not planned              | Not needed for a config generator tool                                                                 |
| Multi-user collaboration       | Not planned              | Out of scope for a single-user config tool                                                             |
