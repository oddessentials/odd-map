# odd-map — Backlog

**Last reviewed:** 2026-02-07

Items below are forward-looking enhancements. All blocking and critical work has been completed.

---

## Production Readiness

### 1. Client Onboarding Guide

Create a dedicated `docs/CLIENT_ONBOARDING.md` covering the full end-to-end workflow for adding a new client: SVG region prep, config file structure, coordinate capture, theme customisation, verification checklist, and deployment steps. The README covers the basics — this would be the comprehensive reference for implementation teams.

**Files:** `docs/CLIENT_ONBOARDING.md` (new)

### 2. Schema Migration Strategy

The config loader already validates `schemaVersion` and rejects unsupported versions (`client-config.ts`). Document the formal migration path: version bump process, migration function pattern, backwards-compatibility policy, and rollback procedure. Create `docs/SCHEMA_MIGRATION.md`.

**Files:** `docs/SCHEMA_MIGRATION.md` (new)

### 3. Error Monitoring Integration

Add structured error tracking hooks for production observability. The app already renders inline error UI for all config failure modes (`app.ts`) — this item is about adding integration points (Sentry, Datadog, or similar) for `initProjection()` failures, config validation errors, and map provider load failures.

**Files:** `src/lib/error-tracking.ts` (new), integration in `src/app.ts`

---

## Quality Assurance

### 4. E2E Testing

Add Playwright tests covering the critical user paths: page load, region click, office drill-down, map mode switching, and client switching via URL parameter. Current coverage is 456 unit tests across 31 suites — E2E would validate the full integration.

**Files:** `e2e/` (new directory), `playwright.config.ts` (new)

### 5. Formal Accessibility Audit

Run axe-core automated scan and perform manual screen reader testing (NVDA/VoiceOver). The app already has ARIA labels, keyboard navigation, focus management, and `prefers-reduced-motion` support. This audit would identify any remaining WCAG 2.1 AA gaps and document compliance status.

### 6. Performance Benchmarking

Benchmark with a synthetic large-client config (100+ offices across 10+ regions) to establish baseline metrics for initial load, map mode switching, and region drill-down. Useful for setting SLA targets and identifying bottlenecks before scaling to larger clients.
