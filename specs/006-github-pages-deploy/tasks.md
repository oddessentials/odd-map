# Tasks: GitHub Actions Parity & Pages Deployment

**Input**: Design documents from `/specs/006-github-pages-deploy/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not explicitly requested in the feature specification. Quality verification is performed by `npm run verify` (existing test suite) and by the CI pipeline itself.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Configuration and data model changes needed by multiple user stories

- [ ] T001 Create demo client registry file at `config/clients.demo.json` with `{"clients": ["oddessentials", "usg"], "defaultClient": "oddessentials", "configPath": "config/{clientId}-map-config.json", "clientConfigPath": "config/{clientId}-client.json"}`
- [ ] T002 Add `defaultClient?: string` field to `ClientRegistry` interface in `src/lib/client-registry.ts`
- [ ] T003 Add oddessentials to `PROD_CONFIG_IMPORT_MAP` and `PROD_CLIENT_CONFIG_MAP` in `src/lib/client-registry.ts` (matching existing entries in TEST maps)
- [ ] T004 Add demo registry branch to `getClientRegistry()` in `src/lib/client-registry.ts` — when `import.meta.env.VITE_CLIENT_REGISTRY === 'demo'`, load `clients.demo.json`; otherwise preserve existing prod/test branching
- [ ] T005 Export `getDefaultClient()` function from `src/lib/client-registry.ts` that returns `registry.defaultClient ?? registry.clients[0]`
- [ ] T006 Update `src/app.ts` line 128 to use `getDefaultClient()` from client-registry instead of `availableClients[0]` for the no-`?client=` fallback
- [ ] T007 Verify `.gitignore` does NOT list `docs/` (currently confirmed clean — verify no accidental additions)
- [ ] T008 Run `npm run verify` to confirm all setup changes pass quality checks

**Checkpoint**: Shared infrastructure ready — demo registry loads, default client is explicit, import maps include oddessentials for production builds

---

## Phase 2: User Story 2 — GitHub Actions CI at Azure Pipelines Parity (Priority: P1)

**Goal**: Rewrite `.github/workflows/ci.yml` to enforce the same quality checks and failure behavior as Azure Pipelines: Node 22.x, full CRLF extension list, dependency caching, `npm run verify`, and `npm run build`.

**Independent Test**: Create a branch, push it, and verify the GitHub Actions `verify` job runs with Node 22.x, full CRLF detection, and all verification commands matching Azure Pipelines behavior.

### Implementation

- [ ] T009 [US2] Rewrite `.github/workflows/ci.yml` verify job: update `actions/checkout@v4` with `fetch-depth: 0`, update `actions/setup-node@v4` to `node-version: '22'` with `cache: 'npm'`, add `npm ci` step
- [ ] T010 [US2] Add CRLF detection step to `.github/workflows/ci.yml` matching Azure Pipelines: two-grep pattern (`git ls-files --eol | grep -E 'w/crlf' | grep -E '\.(sh|ts|tsx|js|jsx|mjs|cjs|json|ya?ml)$'`), fail with `::error::` annotation and file list
- [ ] T011 [US2] Add verify step (`npm run verify`) and build verification step (`npm run build`) to `.github/workflows/ci.yml` verify job
- [ ] T012 [US2] Commit and push branch to trigger CI; verify workflow runs on push (FR-001, FR-002, FR-003, FR-004, FR-005)

**Checkpoint**: GitHub Actions verify job matches Azure Pipelines CI parity — same Node version, same CRLF extensions, same commands, same failure behavior

---

## Phase 3: User Story 1 — Automated Demo Deployment on Push (Priority: P1) 🎯 MVP

**Goal**: When code is pushed to `main`, CI builds the project with demo config and subdirectory base path, fully replaces `/docs` with fresh build output, and commits/pushes only if the output changed.

**Independent Test**: Push a change to `main` and verify `/docs` is updated with a fresh build. Push again without changes and verify no deploy commit is created.

### Implementation

- [ ] T013 [US1] Add `deploy` job to `.github/workflows/ci.yml`: runs only on `push` to `main` (`if: github.ref == 'refs/heads/main' && github.event_name == 'push'`), depends on `verify` job (`needs: verify`), with `permissions: contents: write`
- [ ] T014 [US1] In the deploy job: checkout with `fetch-depth: 0`, setup Node 22.x with npm cache, run `npm ci`
- [ ] T015 [US1] In the deploy job: build step with `VITE_CLIENT_REGISTRY=demo npx vite build --base /odd-map/` — outputs to `dist/`
- [ ] T016 [US1] In the deploy job: replace docs step — `rm -rf docs && mkdir -p docs && cp -r dist/* docs/`
- [ ] T017 [US1] In the deploy job: conditional commit step — configure git user, `git add docs/`, check `git diff --cached --quiet docs/` to detect changes, skip commit if unchanged (FR-011), commit with message `"chore: deploy demo site to /docs [skip ci]"` and push if changed
- [ ] T018 [US1] Verify deploy job does NOT run on non-main branches (FR-006 condition: main only)
- [ ] T019 [US1] Run `npm run verify` to confirm workflow YAML is valid and all source changes pass quality checks

**Checkpoint**: Push to `main` triggers verify + deploy. `/docs` is fully replaced. No commit when unchanged. Non-main branches skip deploy.

---

## Phase 4: User Story 3 — Multi-Client Demo via Query String (Priority: P2)

**Goal**: The deployed demo site defaults to Odd Essentials and supports `?client=usg` switching. All assets, links, and runtime behavior work correctly under the GitHub Pages subdirectory path (`/<repo>/`).

**Independent Test**: Build with demo config and `--base /odd-map/`, serve with `vite preview`, verify Odd Essentials loads by default and `?client=usg` switches to USG. Verify 3D globe texture loads.

### Implementation

- [ ] T020 [P] [US3] Fix texture path in `src/components/map-3d.js` line 300: replace `'/textures/earth-day.jpg'` with `` `${import.meta.env.BASE_URL}textures/earth-day.jpg` `` (R6 — subdirectory-safe asset loading)
- [ ] T021 [US3] Add oddessentials to `config/clients.prod.json` clients array: `["oddessentials", "usg"]` — required because demo build uses `PROD` mode with Vite and the PROD import maps
- [ ] T022 [US3] Build locally with demo config: `set VITE_CLIENT_REGISTRY=demo && npx vite build --base /odd-map/` (Windows) and verify `dist/` output is complete
- [ ] T023 [US3] Preview locally: `npx vite preview --base /odd-map/` — verify default loads Odd Essentials, `?client=usg` switches to USG, 3D globe texture loads, no console errors
- [ ] T024 [US3] Run `npm run verify` to confirm all source changes pass quality checks

**Checkpoint**: Demo build works under subdirectory path. Default client is Odd Essentials (explicit). Client switching via query string works. 3D texture loads correctly.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all user stories

- [ ] T025 Run full `npm run verify` (typecheck, lint, format:check, test:ci) — zero errors
- [ ] T026 Run `npm run build` (standard production build) — verify no regressions to production build
- [ ] T027 Review `.github/workflows/ci.yml` end-to-end: verify trigger conditions (FR-001), Node version (FR-002), CRLF extensions (FR-003), verify command (FR-004), build step (FR-005), deploy conditions (FR-006), diff check (FR-011), atomic deploy (FR-012)
- [ ] T028 Verify `/docs` is NOT in `.gitignore` (FR-008)
- [ ] T029 Commit all changes and push feature branch for CI validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — can start immediately. BLOCKS all user stories.
- **Phase 2 (US2 — CI Parity)**: Depends on Phase 1 completion. Can run in parallel with Phase 3/4 after Phase 1.
- **Phase 3 (US1 — Deploy)**: Depends on Phase 1 and Phase 2 (verify job must exist for deploy job to reference).
- **Phase 4 (US3 — Multi-Client Demo)**: Depends on Phase 1 (demo registry, import maps). T020 (texture fix) has no dependencies and can run during Phase 1.
- **Phase 5 (Polish)**: Depends on all previous phases.

### User Story Dependencies

- **US2 (CI Parity)**: Depends on Phase 1 setup only. The verify job is self-contained.
- **US1 (Deploy)**: Depends on US2 (deploy job requires verify job to exist as a prerequisite).
- **US3 (Multi-Client Demo)**: Depends on Phase 1 (registry, import maps). T020 is independent.

### Within Each Phase

- Setup tasks T001-T006 should execute in order (each builds on previous).
- T007, T008 can run after T001-T006.
- US2 tasks T009-T011 modify the same file sequentially; T012 depends on all.
- US1 tasks T013-T017 modify the same file sequentially; T018-T019 depend on all.
- US3 task T020 is [P] — can run at any time (different file: map-3d.js).
- T021-T024 execute sequentially.

### Parallel Opportunities

- T020 (texture path fix in map-3d.js) is fully independent and can run in parallel with any other phase
- Phase 2 (US2) and Phase 4 (US3) implementation can proceed in parallel after Phase 1 is done
- T001 (demo registry) and T007 (.gitignore check) target different files and can run in parallel

---

## Parallel Example: After Phase 1 Setup

```bash
# These can run concurrently:
Agent A: "Rewrite verify job in .github/workflows/ci.yml" (T009-T011)
Agent B: "Fix texture path in src/components/map-3d.js" (T020)
Agent C: "Update config/clients.prod.json" (T021)
```

---

## Implementation Strategy

### MVP First (US2 + US1)

1. Complete Phase 1: Setup (demo registry, import maps, default client)
2. Complete Phase 2: US2 — CI verify job at Azure Pipelines parity
3. Complete Phase 3: US1 — Deploy job writing to `/docs`
4. **STOP and VALIDATE**: Push to `main`, verify CI runs both jobs, `/docs` is populated
5. The demo is now live (even if subdirectory paths aren't yet fixed)

### Incremental Delivery

1. Setup + US2 → CI quality gates enforced on GitHub
2. - US1 → Demo auto-deploys to `/docs` on every `main` push
3. - US3 → Demo works perfectly under GitHub Pages subdirectory, texture loads, default client is Odd Essentials
4. Polish → Final cross-cutting validation

---

## Notes

- The spec does not request new test files — quality is enforced by running the existing `npm run verify` suite after each phase
- All CI workflow changes are in a single file (`.github/workflows/ci.yml`) so US1 and US2 tasks are sequential within the file
- The `[skip ci]` tag in the deploy commit message (T017) prevents infinite deploy loops
- `vite build --base /odd-map/` is the CLI approach (plan decision D3) — no `vite.config.ts` changes needed for base path
- The repo name in `--base /odd-map/` may need adjustment if the GitHub repository has a different name
