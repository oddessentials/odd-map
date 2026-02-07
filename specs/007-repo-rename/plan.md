# Implementation Plan: Repository Rename (usg-map to odd-map)

**Branch**: `007-repo-rename` | **Date**: 2026-02-06 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/007-repo-rename/spec.md`

## Summary

Rename the code repository from "usg-map" to "odd-map" by creating a mirror copy of the repository on Azure DevOps, then updating all repository-identity references in the copy. The "usg" client identity (configuration files, SVG region IDs, client registries) is preserved unchanged as business-domain data. The original repository remains intact as a fallback.

## Technical Context

**Language/Version**: TypeScript 5.7 (ES2022), JavaScript (map-3d.js), Python 3.x (scripts), YAML (CI/CD)
**Primary Dependencies**: Vite 7.3.1, Three.js 0.182, Vitest 4.0.17, Zod 4.3.5
**Storage**: N/A — static JSON configuration files in `config/` directory
**Testing**: Vitest (jsdom environment), 22 test files in `tests/`
**Target Platform**: Static web deployment (Azure DevOps + GitHub Pages)
**Project Type**: Single project — static frontend application
**Performance Goals**: N/A — rename operation, no runtime performance impact
**Constraints**: Zero downtime during transition; original repository must remain accessible
**Scale/Scope**: 10 files require repository-identity updates; ~30 individual line changes (1 additional file explicitly preserved)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status | Notes                                                                                                  |
| ------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------ |
| I. Deterministic Data Pipeline       | PASS   | No data pipeline changes. Build artifacts unchanged.                                                   |
| II. Build-Time Coordinate Resolution | PASS   | No coordinate logic changes. Client config files (`usg-map-config.json`) preserved as-is.              |
| III. Enterprise Testing Standards    | PASS   | All existing tests must pass after rename. Only `setup.test.ts` line 16 changes (repo name assertion). |
| IV. Performance Budgets              | PASS   | No rendering or performance changes.                                                                   |
| V. Accessibility First               | PASS   | No UI changes.                                                                                         |
| VI. Zero Runtime Backend             | PASS   | No runtime behavior changes. CI base path update (`--base /odd-map/`) is build-time only.              |

**Gate result: PASS** — No constitutional violations. This feature is a metadata/identity change with no architectural impact.

**Post-design re-check: PASS** — No design decisions introduce constitutional tension.

## Project Structure

### Documentation (this feature)

```text
specs/007-repo-rename/
├── plan.md              # This file
├── research.md          # Phase 0: rename strategy research
├── quickstart.md        # Phase 1: step-by-step rename guide
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

> **Note**: `data-model.md` and `contracts/` are omitted — this feature involves no new data entities or API contracts.

### Source Code (repository root)

No new source files are created. The following existing files require repository-identity updates:

```text
odd-map/                              # Renamed from usg-map/
├── package.json                      # name: "usg-map" → "odd-map"
├── package-lock.json                 # name: "usg-map" → "odd-map" (2 occurrences)
├── README.md                         # Badge URL, structure diagram (title preserved as client branding)
├── CLAUDE.md                         # Document title
├── .github/
│   └── workflows/
│       └── ci.yml                    # --base /usg-map/ → --base /odd-map/
├── scripts/
│   └── geocode_locations.py          # User-agent string
├── tests/
│   └── setup.test.ts                 # Repository name assertion
└── specs/
    └── 006-github-pages-deploy/
        ├── plan.md                   # Base path references
        ├── research.md               # Base path references
        ├── quickstart.md             # Base path references
        └── tasks.md                  # Base path references
```

**Structure Decision**: Existing single-project structure is preserved exactly. No directories are added, removed, or renamed. Only file contents change.

### Files Explicitly NOT Changed (Client Identity)

These files contain "usg-map" as part of the USG Insurance client configuration name (`usg-map-config.json`) and must remain unchanged:

| File                               | Reason preserved                                     |
| ---------------------------------- | ---------------------------------------------------- |
| `config/usg-map-config.json`       | USG client map projection config (business data)     |
| `config/usg-client.json`           | USG client definition (business data)                |
| `config/clients.*.json`            | "usg" client registry entries (business data)        |
| `src/lib/client-registry.ts`       | Imports `usg-map-config.json` (client config path)   |
| `src/lib/projection.ts`            | Error message referencing client config file         |
| `scripts/add-region-ids.ts`        | Imports `usg-map-config.json`                        |
| `scripts/generate-map-hash.ts`     | Imports `usg-map-config.json`                        |
| `scripts/verify-svg-ids.ts`        | Imports `usg-map-config.json`                        |
| `scripts/verify-map-integrity.ts`  | Imports `usg-map-config.json`                        |
| `scripts/config-backup.ts`         | Default path to `usg-map-config.json`                |
| `scripts/project-coordinates.ts`   | Path to `usg-map-config.json` and `usg-client.json`  |
| `scripts/recapture-coordinates.ts` | Paths to `usg-map-config.json` and `usg-client.json` |
| `tests/coordinate-storage.test.ts` | Reads `usg-map-config.json` (client config)          |
| `tests/projection.test.ts`         | Comment referencing client config                    |
| `.agents/INVARIANTS.md`            | References `usg-map-config.json` (architectural doc) |
| `.specify/memory/constitution.md`  | References `usg-map-config.json` (governance doc)    |

## Complexity Tracking

> No constitutional violations — this section is intentionally empty.
