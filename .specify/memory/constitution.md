<!--
Sync Impact Report
==================
Version change: 0.0.0 → 1.0.0 (MAJOR - initial ratification)

Added principles:
  - I. Deterministic Data Pipeline
  - II. Build-Time Coordinate Resolution
  - III. Enterprise Testing Standards
  - IV. Performance Budgets
  - V. Accessibility First
  - VI. Zero Runtime Backend

Added sections:
  - Code Quality Standards
  - Architectural Invariants

Templates requiring updates:
  - .specify/templates/plan-template.md ✅ No changes needed (Constitution Check section exists)
  - .specify/templates/spec-template.md ✅ No changes needed (Requirements section compatible)
  - .specify/templates/tasks-template.md ✅ No changes needed (Test-first structure compatible)

Follow-up TODOs:
  - After 005-white-label-config: Update Principle I text — replace `data/locations.json` with
    `config/{clientId}-client.json`, replace `usgins.com` reference with generic "client source".
  - After 005-white-label-config: Update Principle II text — replace `usg-map-config.json` with
    `{clientId}-map-config.json`. These are PATCH-level constitution wording updates.
-->

# USG Map Platform Constitution

## Core Principles

### I. Deterministic Data Pipeline

All location data MUST be computed at build time and remain immutable at runtime.

**Non-negotiable rules:**

- Coordinates are resolved once during the build pipeline (scrape → geocode → validate → emit)
- No client-side geocoding or projection recalculation
- Missing data MUST be explicitly represented, never inferred or silently omitted
- Data artifacts (`data/locations.json`) MUST be versioned with generation timestamps
- Validation reports MUST confirm parity with official source (usgins.com)

**Rationale:** Deterministic pipelines eliminate runtime variability, enable offline delivery,
and ensure reproducible builds across environments.

### II. Build-Time Coordinate Resolution

Pins render where they belong—always. Coordinate systems MUST follow documented conventions.

**Non-negotiable rules:**

- 2D coordinates: SVG positions from `usg-map-config.json` with O(1) lookup by `officeCode`
- 3D coordinates: `latLonToGlobe(lat, lon)` with Y-up convention (Y+ = North, Z+ = Front, X+ = East)
- Null coordinates MUST trigger explicit fallback (region centroid or omission)
- Rendering MUST never fail silently—coordinate errors produce visible warnings
- Scene graph parenting MUST be validated by non-WebGL unit tests

**Rationale:** Mathematical consistency prevents visual bugs and enables automated testing
without GPU dependencies.

### III. Enterprise Testing Standards

Test coverage MUST validate architectural invariants, not just feature behavior.

**Non-negotiable rules:**

- Invariant tests: Each INVARIANTS.md rule MUST have at least one dedicated test
- Current baseline: 100+ tests across 12 test files (projection, state machine, parenting, etc.)
- Scene graph tests MUST NOT require WebGL context
- Coordinate projection tests MUST cover all hemisphere and axis conventions
- State machine tests MUST validate all three UI modes and transitions
- Pre-commit hooks MUST run lint, format check, and type check

**Test categories required:**

| Category         | Purpose                        | Example                         |
| ---------------- | ------------------------------ | ------------------------------- |
| Projection       | Coordinate math correctness    | `projection-3d.test.ts`         |
| State Machine    | UI mode transitions            | `state-machine.test.ts`         |
| Scene Graph      | 3D parenting relationships     | `scene-graph-parenting.test.ts` |
| Client Isolation | Multi-tenant coordinate safety | `client-isolation.test.ts`      |
| Production Smoke | End-to-end initialization      | `production-smoke.test.ts`      |

**Rationale:** Invariant-focused testing catches architectural regressions that feature tests miss.

### IV. Performance Budgets

3D rendering MUST stay within strict budgets; fallback to 2D when exceeded.

**Non-negotiable rules:**

| Metric                    | Budget   | Enforcement                    |
| ------------------------- | -------- | ------------------------------ |
| Total vertices (USA map)  | < 2,000  | Build-time validation          |
| Draw calls                | < 50     | Runtime monitoring             |
| Expensive update interval | 250 ms   | Throttle in animation loop     |
| Camera animation guard    | Required | Skip costly paths during lerps |

- OutlinePass and post-processing effects are PROHIBITED (use material-based effects)
- Marker state updates MUST be throttled; hover/tooltip updates remain responsive
- Performance degradation MUST trigger automatic 2D fallback

**Rationale:** Consistent 60fps rendering on mid-tier hardware; graceful degradation over failure.

### V. Accessibility First

Progressive enhancement with accessibility as the foundation, not an afterthought.

**Non-negotiable rules:**

- Base layer: Accessible HTML + SVG (MUST work without JavaScript)
- Enhanced layer: Animation + 3D (opt-in, never required)
- Keyboard navigation MUST work in all UI modes
- All modals MUST: close on ESC, close on click-outside, trap focus, provide ARIA labels
- ARIA labels required on all interactive elements

**UI Mode requirements:**

| Mode          | Entry               | Exit                 | Keyboard Support  |
| ------------- | ------------------- | -------------------- | ----------------- |
| USA View      | App init / Reset    | Click region         | Tab + Enter       |
| Region View   | Click region        | Click office or Back | Tab + Enter + Esc |
| Location View | Click office marker | Close modal or Back  | Tab + Enter + Esc |

**Rationale:** Government and enterprise clients require WCAG compliance; accessibility
benefits all users.

### VI. Zero Runtime Backend

Static delivery with no billable API dependencies at runtime.

**Non-negotiable rules:**

| Allowed                      | Prohibited                       |
| ---------------------------- | -------------------------------- |
| Static file serving          | Runtime API calls                |
| CDN assets (pinned versions) | External data fetches at runtime |
| Build-time geocoding         | Client-side geocoding            |
| Google Maps links (no key)   | Embedded maps requiring API keys |

- All data MUST be bundled in the static build artifact
- No network requests required after initial page load
- Third-party dependencies MUST be pinned to exact versions

**Rationale:** Eliminates runtime costs, enables offline-capable deployment, removes
external service dependencies.

## Code Quality Standards

### Type Safety

- TypeScript strict mode enabled (`strict: true` in tsconfig.json)
- No `any` types without explicit justification in comments
- All public APIs MUST have complete type definitions
- Zod schemas for runtime validation of external data

### Code Style

- ESLint + Prettier enforced via pre-commit hooks
- Imports MUST be organized and deduplicated
- Functions MUST be single-purpose (max ~50 lines recommended)
- No dead code—unused exports and variables MUST be removed

### Documentation

- INVARIANTS.md documents all architectural constraints
- Type definitions serve as inline documentation
- README.md provides quickstart for developers
- Code comments explain "why", not "what"

## Architectural Invariants

The following invariants from `.agents/INVARIANTS.md` are incorporated by reference:

1. **Deterministic Coordinate Rendering** (Principle II)
2. **Scene Graph Parenting** (Principle III test requirements)
3. **Raycasting Isolation** (globe surface never triggers selection)
4. **Single Marker State Update Function** (centralized visual state)
5. **Shared Application State** (2D/3D share selectedRegion/selectedOffice)
6. **Three Mandatory UI Modes** (Principle V)
7. **Modal Accessibility** (Principle V)
8. **No Post-Processing Effects** (Principle IV)
9. **Region-First Interaction** (regions are primary click targets)
10. **Zero Runtime Backend** (Principle VI)
11. **Build-Time Data Pipeline** (Principle I)
12. **Performance Budget** (Principle IV)
13. **Progressive Enhancement** (Principle V)

Violations of any invariant require explicit justification and team review before merge.

## Governance

### Amendment Process

1. Propose changes via pull request to this constitution file
2. Changes MUST include rationale and impact assessment
3. All active contributors MUST review governance changes
4. Backward-incompatible changes require MAJOR version bump

### Version Policy

- **MAJOR**: Principle removal, redefinition, or incompatible governance changes
- **MINOR**: New principle added or existing principle materially expanded
- **PATCH**: Clarifications, wording improvements, typo fixes

### Compliance Review

- All PRs MUST pass pre-commit hooks (lint, format, typecheck)
- All PRs MUST maintain or improve test coverage
- Invariant violations MUST be documented in PR description with justification
- Constitution compliance verified during code review

**Version**: 1.0.0 | **Ratified**: 2026-02-04 | **Last Amended**: 2026-02-04
