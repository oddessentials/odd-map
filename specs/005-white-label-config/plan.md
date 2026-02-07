# Implementation Plan: White-Label Client Configuration

**Branch**: `005-white-label-config` | **Date**: 2026-02-05 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/005-white-label-config/spec.md`

## Summary

Extract all USG-specific data (company name, offices, personnel, contacts, specialty divisions, branding) from hardcoded source files into a single JSON client configuration file per client. Introduce a centralized marker state manager, theme injection system, and DOM branding injection to enable zero-code-change client onboarding. Validate the architecture by deploying a second complete client configuration ("Odd Essentials") alongside USG.

## Technical Context

**Language/Version**: TypeScript 5.x (ES2022 target), JavaScript (map-3d.js)
**Primary Dependencies**: Three.js (3D rendering), Vite (bundler), Zod (schema validation)
**Storage**: Static JSON configuration files (`config/` directory)
**Testing**: Vitest (74+ existing tests across 12 test files)
**Target Platform**: Browser (static SPA, no backend)
**Project Type**: Single project (frontend-only static site)
**Performance Goals**: 60fps rendering, <2000 vertices, <50 draw calls (existing budgets)
**Constraints**: Zero runtime backend, no API keys, static delivery, offline-capable
**Scale/Scope**: 2 client configs (USG + Odd Essentials), 6 regions, ~15 offices per client

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Principle I — Deterministic Data Pipeline: PASS

Client configuration files are static JSON loaded at startup. No runtime data fetching or computation of coordinates. The build-time pipeline remains unchanged — lat/lon → SVG (x,y) projection happens at build time in map-config files. Client configs contain pre-computed coordinates.

### Principle II — Build-Time Coordinate Resolution: PASS

2D SVG coordinates remain in `{clientId}-map-config.json` with O(1) lookup. 3D coordinates use `latLonToGlobe()` from client config lat/lon values. The Y-up convention is unchanged. No client-side geocoding introduced.

### Principle III — Enterprise Testing Standards: PASS

New invariant tests required:

- Client string isolation scanning test (FR-002, SC-003)
- Marker state centralization test (FR-006, SC-009)
- Schema validation tests (FR-008, SC-006, SC-010)
- Multi-client rendering tests (SC-002, SC-005)
  Existing 74+ tests must continue passing (SC-007).

### Principle IV — Performance Budgets: PASS

No changes to rendering pipeline performance. Client config loading adds one async JSON import at startup (negligible — already done for map-config). Marker state computation is a pure function over a small array (~15 offices), well within the 250ms throttle budget.

### Principle V — Accessibility First: PASS

SVG accessibility labels genericized (no client-specific strings). ARIA labels on interactive elements unchanged. All modal behavior unchanged. Keyboard navigation unchanged.

### Principle VI — Zero Runtime Backend: PASS

Client configs are static JSON files bundled by Vite. No new runtime API calls. No external data fetches. Client selection is via URL query parameter, not a backend lookup.

### Architectural Invariants: PASS

| Invariant                              | Status       | Notes                                   |
| -------------------------------------- | ------------ | --------------------------------------- |
| 1. Deterministic Coordinate Rendering  | Pass         | Coordinates from config, not computed   |
| 2. Scene Graph Parenting               | Pass         | No changes to 3D scene graph            |
| 3. Raycasting Isolation                | Pass         | No changes to raycasting                |
| 4. Single Marker State Update Function | **Improved** | New MarkerStateManager centralizes this |
| 5. Shared Application State            | Pass         | App still owns selection state          |
| 6. Three Mandatory UI Modes            | Pass         | No changes to state machine             |
| 7. Modal Accessibility                 | Pass         | No changes to modals                    |
| 8. No Post-Processing Effects          | Pass         | No rendering changes                    |
| 9. Region-First Interaction            | Pass         | Regions remain shared, not per-client   |
| 10. Zero Runtime Backend               | Pass         | Static JSON, no backend                 |
| 11. Build-Time Data Pipeline           | Pass         | Config files are build artifacts        |
| 12. Performance Budget                 | Pass         | No rendering overhead                   |
| 13. Progressive Enhancement            | Pass         | HTML remains functional base layer      |

### White-Label Configuration Invariants: PASS

| WLC Invariant                                   | Status | Satisfying Artifact                     |
| ----------------------------------------------- | ------ | --------------------------------------- |
| WLC-001 Clear Data Ownership Boundary           | Pass   | Spec §Configuration Boundary            |
| WLC-002 Single Canonical Client Selection       | Pass   | `?client={clientId}` URL parameter      |
| WLC-003 Versioned Configuration Schema          | Pass   | `schemaVersion` field + Zod validation  |
| WLC-004 Required vs Optional Field Contract     | Pass   | data-model.md entity schemas            |
| WLC-005 Absolute Client String Isolation        | Pass   | Source scanning test + DOM injection    |
| WLC-006 Canonical Region Identifiers            | Pass   | Region `name` from map-config           |
| WLC-007 Deterministic Region Override Behavior  | Pass   | Fallback to shared defaults             |
| WLC-008 Centralized Marker State Authority      | Pass   | MarkerStateManager contract             |
| WLC-009 Bounded Brand Theming Surface           | Pass   | 8 CSS tokens, theme-injector contract   |
| WLC-010 Canonical Data Shape Contracts          | Pass   | data-model.md + Zod schemas             |
| WLC-011 Source Code Immutability for Onboarding | Pass   | quickstart.md (config-only changes)     |
| WLC-012 Enforced Client Isolation Validation    | Pass   | Source scanning test                    |
| WLC-013 Comprehensive Multi-Client Proof        | Pass   | Odd Essentials config with 9 edge cases |

## Project Structure

### Documentation (this feature)

```text
specs/005-white-label-config/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0: codebase research findings
├── data-model.md        # Phase 1: entity schemas and migration mapping
├── quickstart.md        # Phase 1: client onboarding guide
├── contracts/           # Phase 1: interface contracts
│   ├── client-config.md # Client config loader contract
│   ├── marker-state.md  # Marker state manager contract
│   ├── theme-injection.md # Theme injector contract
│   └── dom-injection.md # DOM branding injection contract
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2: implementation tasks (via /speckit.tasks)
```

### Source Code (repository root)

```text
config/
├── usg-client.json              # NEW: USG client configuration
├── oddessentials-client.json     # NEW: Odd Essentials client configuration
├── oddessentials-map-config.json # NEW: Odd Essentials map projection
├── usg-map-config.json           # EXISTING: USG map projection
├── clients.prod.json             # MODIFIED: add oddessentials + clientConfigPath
└── clients.test.json             # MODIFIED: add oddessentials + clientConfigPath

src/
├── lib/
│   ├── client-config.ts          # NEW: client config loader + accessors
│   ├── client-config.schema.ts   # NEW: Zod schema for client config
│   ├── marker-state.ts           # NEW: centralized marker state computation
│   ├── theme-injector.ts         # NEW: CSS token injection from config
│   ├── dom-injector.ts           # NEW: DOM branding injection
│   ├── client-registry.ts        # MODIFIED: add client config import maps
│   └── projection.ts             # MODIFIED: accept dynamic clientId
├── components/
│   ├── map-svg.ts                # MODIFIED: consume client config + marker state
│   ├── map-3d.js                 # MODIFIED: consume client config + marker state
│   ├── details-panel.js          # MODIFIED: remove hardcoded USG strings
│   ├── region-list.js            # MODIFIED: consume client config
│   └── specialty-divisions.js    # MODIFIED: consume client config
├── data/
│   └── locations.js              # DELETED: replaced by client config
├── assets/
│   └── usa-regions.svg           # MODIFIED: genericize text, use CSS vars
├── types/
│   └── index.ts                  # MODIFIED: camelCase field names
├── styles/
│   └── tokens.css                # MODIFIED: ensure region color vars are defaults
├── index.html                    # MODIFIED: remove USG text, add injection IDs
└── app.ts                        # MODIFIED: init flow with client config loading

tests/
├── client-config.test.ts         # NEW: schema validation tests
├── marker-state.test.ts          # NEW: marker state centralization tests
├── client-isolation.test.ts      # MODIFIED: add source scanning test
└── theme-injection.test.ts       # NEW: theme token injection tests
```

**Structure Decision**: Single frontend project. No new directories beyond existing structure. New modules added to `src/lib/` following established patterns. Configuration files added to `config/` following established naming convention.

## Complexity Tracking

No constitution violations to justify. All changes align with existing patterns and principles.

## Phase Outputs Reference

| Phase   | Artifact                 | Path                                                         |
| ------- | ------------------------ | ------------------------------------------------------------ |
| Phase 0 | Research findings        | [research.md](research.md)                                   |
| Phase 1 | Data model               | [data-model.md](data-model.md)                               |
| Phase 1 | Client config contract   | [contracts/client-config.md](contracts/client-config.md)     |
| Phase 1 | Marker state contract    | [contracts/marker-state.md](contracts/marker-state.md)       |
| Phase 1 | Theme injection contract | [contracts/theme-injection.md](contracts/theme-injection.md) |
| Phase 1 | DOM injection contract   | [contracts/dom-injection.md](contracts/dom-injection.md)     |
| Phase 1 | Quickstart guide         | [quickstart.md](quickstart.md)                               |
| Phase 2 | Implementation tasks     | tasks.md (via `/speckit.tasks`)                              |
