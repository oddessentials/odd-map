# odd-map

A static website recreating and improving upon the [USG Insurance Services Locations](https://www.usgins.com/locations) page. Features an interactive USA map with region-based navigation and detailed location information.

## Features

- **Interactive USA Map**: Click regions to zoom in, click locations for details
- **Three UI Modes**: USA View → Region View → Location View
- **Responsive Design**: Works on desktop and mobile
- **Accessibility**: Keyboard navigation, ARIA labels, 2D SVG fallback
- **Three.js Enhancement**: Optional 3D rendering with smooth camera choreography
- **TypeScript**: Strict type checking with comprehensive type definitions
- **Pre-commit Testing**: Husky hooks run tests before each commit

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (Vite)
npm run dev
# Open http://localhost:3000

# Run tests
npm run test        # Watch mode
npm run test:run    # Single run
```

## Commands

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start Vite dev server                |
| `npm run build`     | Build production bundle              |
| `npm run test`      | Run tests in watch mode              |
| `npm run test:run`  | Run tests once                       |
| `npm run typecheck` | TypeScript type checking             |
| `npm run data`      | Regenerate location data from source |

## Data Pipeline

Location data is scraped from usgins.com and geocoded at build time:

```bash
npm run scrape    # Fetch locations from usgins.com
npm run geocode   # Geocode addresses (verified coords)
npm run build:data  # Generate src/data/locations.js
```

## Project Structure

```
odd-map/
├── data/                 # Build artifacts (gitignored)
├── scripts/              # Python data pipeline
├── src/
│   ├── assets/           # SVG map, 3D geometry
│   ├── components/       # Map components (TypeScript)
│   ├── data/             # Generated location data
│   ├── types/            # TypeScript type definitions
│   ├── styles/           # CSS (tokens, base, app)
│   └── index.html        # Entry point
├── tests/                # Vitest unit tests
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite build configuration
```

## Requirements

- Node.js 22+ (for dev server and build)
- Python 3.8+ (for data pipeline)
- No runtime backend dependencies - fully static site

## Licence

This project is licensed under the ISC License - see the [LICENCE.md](./LICENCE.md) file for details.
