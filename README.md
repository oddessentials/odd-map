# odd-map

[![CI](https://github.com/oddessentials/odd-map/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/oddessentials/odd-map/actions/workflows/ci.yml)
[![Tests](https://img.shields.io/badge/tests-734_passing-brightgreen)](https://github.com/oddessentials/odd-map/actions)
[![Demo](https://img.shields.io/badge/demo-live-blue)](https://oddessentials.github.io/odd-map/)

A white-label, mobile-friendly interactive office locator with three rendering modes, region-based navigation, and multi-client theming. Fully static — no backend required.

**[View Live Demo](https://oddessentials.github.io/odd-map/)** · Works on desktop & mobile

---

## ✨ Features

- 🗺️ **Three Map Modes** — 2D SVG with pan/zoom, 3D Three.js globe with rotation, and interactive tile map (MapLibre GL / Apple MapKit / Google Maps)
- 📍 **Region-Based Navigation** — Click regions to zoom in, select offices for full details with inline mini-map
- 🏷️ **White-Label Multi-Client** — Per-client branding, theme colors, office data, and map provider config via JSON
- 🌐 **Runtime Lat/Lon Projection** — v2 config schema with d3-geo projection; no more pre-computed SVG coordinates
- 📱 **Mobile-First Touch** — Pinch-to-zoom, swipe-to-dismiss bottom sheet, 44px touch targets, safe area insets for notched devices
- 📐 **Collapsible Sidebars** — Desktop sidebars collapse/expand with smooth CSS Grid transitions and ARIA-compliant toggle buttons
- ♿ **Accessible** — Keyboard navigation, ARIA labels, focus management, reduced-motion support
- ⚡ **Zero Backend** — Fully static build deployable to any CDN, S3 bucket, or GitHub Pages

## 🚀 Quick Start

```bash
npm install
npm run dev          # Start dev server at http://localhost:3000
npm test             # Run tests in watch mode
```

## 🔀 Switching Clients

The active client is controlled by the `?client=` URL query parameter. Each client gets its own branding, theme, and office data.

```
https://your-domain.com/                         # default client
https://your-domain.com/?client=oddessentials    # explicit client
https://your-domain.com/?client=acme             # ACME Corp (Google Maps)
```

To add a new client, create two JSON files in `config/` and register the client ID in the appropriate `clients.*.json` registry. See [Multi-Client Configuration](#multi-client-configuration) for details.

## 🛠️ Commands

| Command                                 | Description                                                         |
| --------------------------------------- | ------------------------------------------------------------------- |
| `npm run dev`                           | Start Vite dev server                                               |
| `npm run build`                         | Production build to `dist/`                                         |
| `npm run verify`                        | Full CI check — lint, format, typecheck, client verification, tests |
| `npm test`                              | Run 734 tests in watch mode (Vitest)                                |
| `npm run test:ci`                       | Verify all clients + run tests once                                 |
| `npm run typecheck`                     | TypeScript type checking                                            |
| `npm run lint`                          | ESLint check                                                        |
| `npm run format`                        | Prettier format                                                     |
| `node scripts/generate-mapkit-token.js` | Generate Apple MapKit JWT from `.p8` key                            |

## 📁 Project Structure

```
odd-map/
├── config/                   # Client configuration files
│   ├── clients.prod.json           # Production client registry
│   ├── clients.demo.json           # Demo (GitHub Pages) registry
│   ├── {client}-client.json        # Branding: name, logo, theme colors
│   └── {client}-map-config.json    # Data: offices, regions, coordinates
├── scripts/                  # Build, data pipeline & verification
│   ├── generate-mapkit-token.js    # Generate Apple MapKit JWT from .p8 key
│   ├── scrape_locations.py         # Scrape office data from website
│   ├── geocode_locations.py        # Geocode addresses to lat/lon
│   ├── generate_data_artifact.py   # Generate config from scraped data
│   ├── verify-all-clients.ts       # Validate all client configs
│   ├── verify-map-integrity.ts     # SVG map + data integrity checks
│   └── ...                         # Additional tooling scripts
├── src/
│   ├── app.ts                      # Application entry point
│   ├── components/                 # UI components
│   │   ├── map-svg.ts              # 2D SVG map (pan, zoom, pinch)
│   │   ├── map-3d.js               # 3D Three.js globe
│   │   ├── tile-map.ts             # Tile map (MapLibre / Apple / Google)
│   │   ├── mini-map.ts             # Inline mini-map in detail views
│   │   ├── details-panel.js        # Office details sidebar / bottom sheet
│   │   └── ...                     # Modal, region list, overlays
│   ├── lib/                        # Shared utilities & config loading
│   │   ├── client-config.ts        # Client config loader + Zod validation
│   │   ├── map-providers/          # Tile map provider abstraction layer
│   │   │   ├── types.ts            # Provider interfaces
│   │   │   ├── provider-factory.ts # Factory with safe-fallback logic
│   │   │   ├── maplibre-provider.ts # MapLibre GL JS (default, free)
│   │   │   ├── apple-provider.ts   # Apple MapKit JS (CDN, JWT auth)
│   │   │   └── google-provider.ts  # Google Maps JS API (CDN, API key)
│   │   └── ...                     # Projection, theming, escape, state
│   ├── styles/                     # CSS (design tokens, base, app)
│   ├── types/                      # TypeScript type definitions
│   └── index.html                  # HTML entry point
├── tests/                    # 734 Vitest unit tests across 46 suites
└── docs/                     # GitHub Pages deployment (auto-generated)
```

## 🌍 Map Providers

odd-map supports three tile map providers through a unified abstraction layer. The active provider is configured per-client in the `theme.mapProvider` section of the client config JSON.

### 🔌 Built-in Providers

| Provider            | Config Value | Auth        | Cost                | Notes                                                             |
| ------------------- | ------------ | ----------- | ------------------- | ----------------------------------------------------------------- |
| **MapLibre GL JS**  | `"maplibre"` | None (free) | Free                | Default. CartoDB basemap. Full clustering + feature-state support |
| **Apple MapKit JS** | `"apple"`    | JWT token   | Free tier available | CDN-loaded. Requires `appleMapToken` in config                    |
| **Google Maps**     | `"google"`   | API key     | Pay-as-you-go       | CDN-loaded. Requires `googleMapsApiKey` in config                 |

### 🛡️ Safe-Fallback Behavior

All key-driven providers (Apple, Google) automatically fall back to MapLibre when credentials are missing or empty. This ensures the map always renders, even in demos or when API keys haven't been configured yet.

```
Requested: "apple"  + no token     → Falls back to MapLibre (with console warning)
Requested: "google" + no API key   → Falls back to MapLibre (with console warning)
Requested: "maplibre"              → Always works (no credentials needed)
```

### ⚙️ Configuring a Provider

Set the provider in your client config file (`config/{client}-client.json`):

```jsonc
{
  "theme": {
    "mapProvider": {
      "provider": "google", // "maplibre" | "apple" | "google"
      "googleMapsApiKey": "AIzaSy...", // Required for Google Maps
      // "appleMapToken": "eyJhbGci...",           // Required for Apple MapKit
      // "tileStyleUrl": "https://...",            // Optional: custom MapLibre tile style
      "defaultZoom": 14, // Zoom level for mini-map (1-20)
    },
  },
}
```

### 🔑 Where to Put API Keys

API keys are stored directly in the client config JSON files. Since this is a static site, keys are served as part of the client bundle.

**For Apple MapKit:**

Apple MapKit requires a signed JWT token (not the raw `.p8` private key). Use the included generator script:

1. Download your MapKit private key (`.p8` file) from [Apple Developer > Keys](https://developer.apple.com/account/resources/authkeys/list)
2. Find your **Team ID** on the [Membership page](https://developer.apple.com/account#MembershipDetailsCard) and **Key ID** from the key filename or Keys page
3. Generate the token:

```bash
node scripts/generate-mapkit-token.js \
  --teamId ABCD1234EF \
  --keyId A56J59A23Y \
  --keyFile ~/AuthKey_A56J59A23Y.p8
```

4. Paste the output JWT into your client config's `theme.mapProvider`:

```json
"appleMapToken": "eyJhbGciOiJFUzI1NiIs..."
```

> **Note:** The `.p8` file is your private key — keep it safe and never commit it (it's in `.gitignore`). The generated JWT is safe for client-side use; it expires after 180 days by default (configurable via `--expiry`).

**For Google Maps:**

1. Create an API key in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. **Restrict the key** to the Maps JavaScript API and your domain(s) via HTTP referrer restrictions
3. Add `"googleMapsApiKey": "<your-key>"` to your client config's `theme.mapProvider`

> **Security note:** Since this is a client-side application, API keys are visible in the browser. Always apply domain restrictions and usage quotas to your keys. MapLibre requires no API key at all.

### 📊 Current Client Defaults

| Client            | Default Provider | Fallback                    |
| ----------------- | ---------------- | --------------------------- |
| **oddessentials** | Apple MapKit     | MapLibre (no token in demo) |
| **usg**           | MapLibre         | N/A (always works)          |
| **acme**          | Google Maps      | MapLibre (no key in demo)   |

## 🏢 Multi-Client Configuration

Each client requires two JSON files in `config/`:

| File                       | Purpose                                                     |
| -------------------------- | ----------------------------------------------------------- |
| `{client}-client.json`     | Branding — name, logo URL, theme colors, tagline            |
| `{client}-map-config.json` | Data — offices, regions, coordinates, map provider settings |

Clients are registered in `clients.*.json` (one per environment). The active client is resolved at runtime from the `?client=` URL parameter, falling back to the registry's `defaultClient`.

**To add a new client:**

1. Create `config/yourclient-client.json` with branding and theme
2. Create `config/yourclient-map-config.json` with office/region data
3. Add `"yourclient"` to the `clients` array in the appropriate `clients.*.json`
4. Run `npm run verify` to validate

## 🔧 Data Pipeline (Python)

The Python scripts in `scripts/` automate scraping, geocoding, and packaging office location data into client config files. This pipeline was built for [USG Insurance Services](https://www.usgins.com/locations) as a reference implementation and can be adapted for any client with a public locations page.

```bash
# Full pipeline: scrape -> geocode -> generate config
npm run data

# Individual steps
npm run scrape       # Scrape office data from usgins.com
npm run geocode      # Geocode addresses to lat/lon coordinates
npm run build:data   # Generate config JSON from scraped data
```

> See the USG-generated config in action: [oddessentials.github.io/odd-map/?client=usg](https://oddessentials.github.io/odd-map/?client=usg)

**Requirements:** Python 3.8+ with dependencies from `scripts/requirements.txt`

## 🧰 Tech Stack

| Layer        | Technology                                          |
| ------------ | --------------------------------------------------- |
| Language     | TypeScript 5.7 (ES2022), JavaScript (3D module)     |
| Bundler      | Vite 7.3.1                                          |
| Testing      | Vitest 4.0.17, jsdom — 734 tests across 46 suites   |
| 3D Rendering | Three.js 0.182                                      |
| Tile Maps    | MapLibre GL JS, Apple MapKit JS, Google Maps JS API |
| Validation   | Zod 4.3                                             |
| CI/CD        | GitHub Actions, Husky, lint-staged, commitlint      |
| Linting      | ESLint 9, Prettier 3.8                              |

## 📋 Requirements

- **Node.js 22+** — Dev server, build, tests
- **Python 3.8+** — Data pipeline only (optional, not needed for development)

## 🚢 Deployment

The demo site auto-deploys to GitHub Pages on every push to `main`. The CI workflow builds with the demo client registry and outputs to `docs/`.

For production, run `npm run build` and serve `dist/` from any static host.

## 📄 Licence

ISC License — see [LICENCE.md](./LICENCE.md) for details.
