# odd-map Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-05

## Active Technologies

- TypeScript 5.7 (ES2022), JavaScript (map-3d.js), Python 3.x (scripts), YAML (CI/CD) + Vite 7.3.1, Three.js 0.182, Vitest 4.0.17, Zod 4.3.5 (007-repo-rename)
- N/A — static JSON configuration files in `config/` directory (007-repo-rename)

- TypeScript 5.7 (ES2022), JavaScript (map-3d.js), YAML (GitHub Actions) + Vite 7.3.1, Three.js 0.182, Vitest 4.0.17, Zod 4.3.5 (006-github-pages-deploy)
- N/A — static file build deployed to `/docs` directory in-repo (006-github-pages-deploy)

- TypeScript 5.x (ES2022 target), JavaScript (map-3d.js) + Three.js (3D rendering), Vite (bundler), Zod (schema validation) (005-white-label-config)
- Static JSON configuration files (`config/` directory) (005-white-label-config)

- N/A (UI state only, no persistence) (003-globe-rotation-toggle)

- N/A (no persistence changes) (002-map-toggle-guard)

- TypeScript 5.x (ES2022 target), JavaScript (map-3d.js) + Three.js (3D rendering), Vite (bundler), Vitest (testing) (001-fix-map-bugs)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

npm test; npm run lint

## Code Style

TypeScript 5.x (ES2022 target), JavaScript (map-3d.js): Follow standard conventions

## Recent Changes

- 007-repo-rename: Added TypeScript 5.7 (ES2022), JavaScript (map-3d.js), Python 3.x (scripts), YAML (CI/CD) + Vite 7.3.1, Three.js 0.182, Vitest 4.0.17, Zod 4.3.5

- 006-github-pages-deploy: Added TypeScript 5.7 (ES2022), JavaScript (map-3d.js), YAML (GitHub Actions) + Vite 7.3.1, Three.js 0.182, Vitest 4.0.17, Zod 4.3.5

- 005-white-label-config: Added TypeScript 5.x (ES2022 target), JavaScript (map-3d.js) + Three.js (3D rendering), Vite (bundler), Zod (schema validation)

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
