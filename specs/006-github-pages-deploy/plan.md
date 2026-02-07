# Implementation Plan: GitHub Actions Parity & Pages Deployment

**Branch**: `006-github-pages-deploy` | **Date**: 2026-02-06 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/006-github-pages-deploy/spec.md`

## Summary

Migrate CI/CD from Azure Pipelines to GitHub Actions with full quality-gate parity, and add automated deployment of the Vite build output to `/docs` for GitHub Pages. The deployed demo defaults to the Odd Essentials client config (explicit value) and supports `?client=usg` switching. The build must work under a subdirectory path (`/<repo>/`).

## Technical Context

**Language/Version**: TypeScript 5.7 (ES2022), JavaScript (map-3d.js), YAML (GitHub Actions)
**Primary Dependencies**: Vite 7.3.1, Three.js 0.182, Vitest 4.0.17, Zod 4.3.5
**Storage**: N/A — static file build deployed to `/docs` directory in-repo
**Testing**: Vitest (`npm run verify` = typecheck + lint + format:check + test:ci)
**Target Platform**: GitHub Actions (ubuntu-latest), GitHub Pages (static hosting from `/<repo>/` subdirectory)
**Project Type**: Single static web application
**Performance Goals**: CI completes within 3 minutes; deploy within 5 minutes (SC-001, SC-002)
**Constraints**: No runtime backend (Constitution VI); all data bundled at build time; `/docs` must be committed (not `.gitignore`d)
**Scale/Scope**: 2 client configs (oddessentials, usg); 1 workflow file; ~5 source file modifications

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status | Notes                                                                                                                                                |
| ------------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Deterministic Data Pipeline       | PASS   | No changes to data pipeline. Build output is deterministic. Deploy avoids churn commits (FR-011).                                                    |
| II. Build-Time Coordinate Resolution | PASS   | No changes to coordinate system. All coords resolved at build time via import maps.                                                                  |
| III. Enterprise Testing Standards    | PASS   | CI workflow runs full `npm run verify` (typecheck, lint, format, test:ci). No regression.                                                            |
| IV. Performance Budgets              | PASS   | No changes to rendering pipeline.                                                                                                                    |
| V. Accessibility First               | PASS   | No UI changes. Build output preserves all existing ARIA/keyboard behavior.                                                                           |
| VI. Zero Runtime Backend             | PASS   | GitHub Pages is static hosting. No API dependencies added. Texture path fix uses `import.meta.env.BASE_URL` (Vite built-in, resolved at build time). |

**Gate result: PASS** — No violations. All constitution principles satisfied.

## Project Structure

### Documentation (this feature)

```text
specs/006-github-pages-deploy/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code Changes (repository root)

```text
.github/
└── workflows/
    └── ci.yml                    # MODIFIED: Full rewrite for CI parity + deploy job

src/
├── app.ts                        # MODIFIED: Explicit default client constant
├── components/
│   └── map-3d.js                 # MODIFIED: Fix absolute texture path → BASE_URL-relative
└── lib/
    └── client-registry.ts        # MODIFIED: Add oddessentials to PROD import maps

config/
├── clients.prod.json             # MODIFIED: Add oddessentials to prod registry
└── clients.demo.json             # NEW: Demo-specific registry (oddessentials + usg)

vite.config.ts                    # MODIFIED: Add configurable base path for subdirectory hosting

.gitignore                        # MODIFIED: Ensure /docs is NOT ignored (verify)

docs/                             # NEW (created by CI): GitHub Pages build output
```

## Design Decisions

### D1: Demo Build Mode vs Production Build Mode

The production registry (`clients.prod.json`) currently contains only `usg`. The demo needs both `oddessentials` and `usg`. Rather than polluting the production registry, we introduce a **demo build mode**:

- Add a `clients.demo.json` registry with `["oddessentials", "usg"]` and `defaultClient: "oddessentials"`.
- Add `oddessentials` to the production import maps in `client-registry.ts` (already in TEST maps).
- The CI deploy step builds with `VITE_CLIENT_REGISTRY=demo` env var, which the client-registry module uses to load the demo registry.
- The dev and standard production builds are unaffected.

**Rejected alternative**: Adding oddessentials to `clients.prod.json` — this would ship oddessentials in every production build, even for USG-only deployments.

### D2: Explicit Default Client

Currently `app.ts:128` uses `availableClients[0]` as the default. Per FR-009, the default must be explicitly `oddessentials`, not order-dependent.

- Add a `defaultClient` field to `ClientRegistry` interface and `clients.demo.json`.
- When present, `app.ts` uses `registry.defaultClient` instead of `[0]`.
- When absent (prod/test registries), falls back to `[0]` (existing behavior).

### D3: Vite Base Path for Subdirectory Hosting

GitHub Pages serves from `/<repo>/` (e.g., `https://org.github.io/odd-map/`). Vite's `base` config must be set at build time.

- Use env var `VITE_BASE_PATH` (defaulting to `/`) so the CI step can pass `VITE_BASE_PATH=/odd-map/`.
- Alternatively, use Vite's `--base` CLI flag: `vite build --base /odd-map/`.
- The CLI flag approach is simpler — no `vite.config.ts` change needed for the base path itself.
- However, `map-3d.js:300` hardcodes `/textures/earth-day.jpg` — this must use `import.meta.env.BASE_URL` for the path to resolve correctly.

**Decision**: Use `vite build --base /odd-map/` in CI. Fix `map-3d.js` texture path to use `import.meta.env.BASE_URL`.

### D4: Deploy Strategy — Full Replacement with Diff Check

Per FR-006 and FR-011:

1. Build to `dist/` (standard Vite output).
2. Remove all contents of `docs/` (or create it).
3. Copy `dist/` contents to `docs/`.
4. Check `git diff --stat docs/` — if no changes, skip commit.
5. If changes exist, commit and push.

This satisfies full replacement (no stale files) and no-churn (skip commit when unchanged).

### D5: GitHub Actions Workflow Structure

Single workflow file with two jobs:

1. **`verify`** — runs on all pushes and PRs. Mirrors Azure Pipelines CI stage.
2. **`deploy`** — runs only on `main` push, after `verify` passes. Builds and deploys to `/docs`.

The `deploy` job needs push permissions and uses `GITHUB_TOKEN` with `contents: write`.

### D6: CRLF Detection Parity

Azure Pipelines checks: `.sh`, `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.cjs`, `.json`, `.yml`, `.yaml`.
Current GitHub Actions checks: `.sh`, `.ts`, `.js`, `.mjs` (subset).
Fix: Update the regex to include all file extensions from Azure Pipelines.

## Complexity Tracking

No constitution violations — table not needed.
