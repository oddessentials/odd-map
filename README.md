# odd-map

[![CI](https://github.com/oddessentials/odd-map/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/oddessentials/odd-map/actions/workflows/ci.yml)
[![Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://oddessentials.github.io/odd-map/)

A white-label interactive office locator with three rendering modes (2D SVG, 3D Globe, Tile Map), region-based navigation, and multi-client configuration. Fully static — no backend required.

**[View Live Demo](https://oddessentials.github.io/odd-map/)** (default client) | **[View with USG config](https://oddessentials.github.io/odd-map/?client=usg)**

> Switch clients via the `?client=` query parameter:
>
> - `https://oddessentials.github.io/odd-map/` — default (Odd Essentials)
> - `https://oddessentials.github.io/odd-map/?client=usg` — USG Insurance Services
> - `https://oddessentials.github.io/odd-map/?client=oddessentials` — Odd Essentials (explicit)

## Features

- **Three Map Modes**: 2D SVG map, 3D Three.js globe, and interactive tile map (MapLibre GL / Apple MapKit)
- **Region-Based Navigation**: Click regions to zoom in, click offices for details with mini-map
- **White-Label Support**: Multi-client configuration with per-client theming, branding, and data
- **Responsive Design**: Desktop sidebar layout with mobile bottom-sheet panel
- **Accessibility**: Keyboard navigation, ARIA labels, focus management, 2D SVG fallback
- **Zero Backend**: Fully static site deployable to any CDN or GitHub Pages

## Quick Start

```bash
npm install
npm run dev        # Start dev server → http://localhost:3000
npm test           # Run tests in watch mode
```

## Commands

| Command             | Description                               |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | Start Vite dev server                     |
| `npm run build`     | Build production bundle                   |
| `npm run verify`    | Full CI check (lint, format, types, test) |
| `npm test`          | Run tests in watch mode (Vitest)          |
| `npm run test:ci`   | Verify all clients + run tests once       |
| `npm run typecheck` | TypeScript type checking                  |
| `npm run lint`      | ESLint check                              |
| `npm run format`    | Prettier format                           |

## Project Structure

```
odd-map/
├── config/               # Client configurations (JSON)
│   ├── clients.prod.json       # Production client registry
│   ├── clients.demo.json       # Demo (GitHub Pages) registry
│   ├── {client}-client.json    # Client branding/theme
│   └── {client}-map-config.json# Client office data + coordinates
├── scripts/              # Build & data pipeline scripts
│   ├── scrape_locations.py     # Scrape office data from website
│   ├── geocode_locations.py    # Geocode addresses to coordinates
│   ├── generate_data_artifact.py # Generate config from scraped data
│   └── verify-*.ts             # Verification scripts
├── src/
│   ├── app.ts                  # Application entry point
│   ├── components/             # UI components (TS + JS)
│   │   ├── map-svg.ts          # 2D SVG map with pan/zoom
│   │   ├── map-3d.js           # 3D Three.js globe
│   │   ├── tile-map.ts         # Tile map (MapLibre/Apple)
│   │   ├── mini-map.ts         # Inline mini-map for details
│   │   ├── details-panel.js    # Office details sidebar/sheet
│   │   └── ...
│   ├── lib/                    # Shared utilities
│   │   ├── client-config.ts    # Client config loading + validation
│   │   ├── map-providers/      # Tile map provider abstraction
│   │   └── ...
│   ├── styles/                 # CSS (tokens, base, app)
│   ├── types/                  # TypeScript type definitions
│   └── index.html              # HTML entry point
├── tests/                # Vitest unit tests (433+ tests)
└── docs/                 # GitHub Pages deployment (auto-generated)
```

## Multi-Client Configuration

Each client has two config files in `config/`:

- **`{client}-client.json`** — Branding: name, logo, theme colors
- **`{client}-map-config.json`** — Data: offices, regions, coordinates, map provider settings

The client is selected at runtime via the `?client=` URL parameter. The client registry (`clients.*.json`) defines which clients are available per environment.

## Data Pipeline (Python)

The Python scripts in `scripts/` scrape, geocode, and package office location data into client config files. This pipeline was originally built for [USG Insurance Services](https://www.usgins.com/locations) and can be adapted for other clients.

```bash
# Full pipeline: scrape → geocode → generate config
npm run data

# Individual steps
npm run scrape      # Scrape office data from usgins.com
npm run geocode     # Geocode addresses to lat/lon coordinates
npm run build:data  # Generate config JSON from scraped data
```

> **Example**: See the USG config in action at [oddessentials.github.io/odd-map/?client=usg](https://oddessentials.github.io/odd-map/?client=usg)

**Requirements**: Python 3.8+ with dependencies in `scripts/requirements.txt`

## Requirements

- **Node.js 22+** — Dev server, build, tests
- **Python 3.8+** — Data pipeline only (not needed for development)

## Deployment

The demo site auto-deploys to GitHub Pages on every push to `main`. The CI workflow builds with the demo client registry and commits the output to the `docs/` directory.

For production deployments, run `npm run build` and serve the `dist/` directory from any static host.

## Licence

This project is licensed under the ISC License — see [LICENCE.md](./LICENCE.md) for details.
