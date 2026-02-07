# Tasks: Repository Rename (usg-map to odd-map)

**Input**: Design documents from `/specs/007-repo-rename/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, quickstart.md

**Tests**: Not explicitly requested. Existing test suite serves as validation — all 22 test files must pass after the rename.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the new repository as a mirror copy on Azure DevOps

- [ ] T001 Create empty "odd-map" repository in Azure DevOps project `oddessentials` (via Azure DevOps UI: Repos → New repository → Name: `odd-map`, no initialization)
- [ ] T002 Mirror the existing repository by running: `git clone --bare https://oddessentials@dev.azure.com/oddessentials/oddessentials/_git/usg-map usg-map.git && cd usg-map.git && git push --mirror https://oddessentials@dev.azure.com/oddessentials/oddessentials/_git/odd-map`
- [ ] T003 Clean up the temporary bare clone: remove the `usg-map.git` directory
- [ ] T004 Clone the new repository: `git clone https://oddessentials@dev.azure.com/oddessentials/oddessentials/_git/odd-map` and `cd odd-map`

**Checkpoint**: New "odd-map" repository exists with identical history, branches, and tags. All subsequent tasks are performed in the cloned `odd-map` working copy.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No foundational blocking tasks for this feature — all work is independent file edits within the cloned repository.

**⚠️ NOTE**: All Phase 3+ tasks must be executed in the newly cloned `odd-map` repository, NOT in the original `usg-map` repository.

---

## Phase 3: User Story 1 — Create a Copy of the Repository Under the New Name (Priority: P1) 🎯 MVP

**Goal**: Verify the mirror copy is complete and correct before making any changes.

**Independent Test**: Clone the new "odd-map" repository and confirm it contains identical commit history, branches, and tags as the original "usg-map" repository.

### Implementation for User Story 1

- [ ] T005 [US1] Verify commit history matches: run `git log --oneline -10` in both `usg-map` and `odd-map` and confirm identical output
- [ ] T006 [US1] Verify all branches exist: run `git branch -a` in `odd-map` and confirm all remote branches from `usg-map` are present
- [ ] T007 [US1] Verify all tags exist: run `git tag` in `odd-map` and compare against `usg-map`
- [ ] T008 [US1] Verify the original `usg-map` repository is unmodified: run `git log --oneline -1` on the original remote to confirm no new commits

**Checkpoint**: Mirror copy verified. Original repository confirmed untouched.

---

## Phase 4: User Story 2 — Update All Internal References from usg-map to odd-map (Priority: P1)

**Goal**: Update all repository-identity references so the project correctly identifies itself as "odd-map". Client-identity references (usg client configs, SVG region IDs) remain unchanged.

**Independent Test**: Run full build and test suite. Search for "usg-map" in repository-identity contexts and confirm zero results.

### Implementation for User Story 2

**Package metadata:**

- [x] T009 [P] [US2] Update package name in `package.json` line 2: change `"name": "usg-map"` to `"name": "odd-map"`
- [x] T010 [P] [US2] Update package name in `package-lock.json` lines 2 and 8: change `"name": "usg-map"` to `"name": "odd-map"` (2 occurrences)

**CI/CD pipeline:**

- [x] T011 [P] [US2] Update GitHub Pages base path in `.github/workflows/ci.yml` line 65: change `--base /usg-map/` to `--base /odd-map/`

**Documentation:**

- [x] T012 [P] [US2] Do NOT change `README.md` line 1 title (`# USG Insurance Locations Map`) — this is client/product branding (USG Insurance Services), not repository identity. Preserved per FR-005
- [x] T013 [P] [US2] Update `README.md` line 3: change badge URL from `build/status/usg-map?branchName=main` to `build/status/odd-map?branchName=main`
- [x] T014 [P] [US2] Update `README.md` line 57: change project structure root from `usg-map/` to `odd-map/`
- [x] T015 [P] [US2] Update `CLAUDE.md` line 1: change `# usg-map Development Guidelines` to `# odd-map Development Guidelines`

**Scripts:**

- [x] T016 [P] [US2] Update user-agent string in `scripts/geocode_locations.py` line 37: change `https://github.com/example/usg-map` to `https://github.com/example/odd-map`

**Tests:**

- [x] T017 [P] [US2] Update repo name assertion in `tests/setup.test.ts` line 16: change `expect('usg-map').toContain('map')` to `expect('odd-map').toContain('map')`

**Spec documentation (006-github-pages-deploy):**

- [x] T018 [P] [US2] Update base path references in `specs/006-github-pages-deploy/plan.md`: replace all occurrences of `/usg-map/` with `/odd-map/` in lines 98, 100, 101, 105
- [x] T019 [P] [US2] Update base path references in `specs/006-github-pages-deploy/research.md`: replace all occurrences of `/usg-map/` with `/odd-map/` in lines 14, 107
- [x] T020 [P] [US2] Update base path references in `specs/006-github-pages-deploy/quickstart.md`: replace all occurrences of `/usg-map/` with `/odd-map/` in lines 29, 32, 45, 56, 74
- [x] T021 [P] [US2] Update base path references in `specs/006-github-pages-deploy/tasks.md`: replace all occurrences of `/usg-map/` with `/odd-map/` in lines 62, 76, 82, 83. Do NOT change `?client=usg` query parameters — those are client-identity references (FR-005)

**Validation:**

- [x] T022 [US2] Run `npm install` to validate the lockfile is consistent after the name change
- [x] T023 [US2] Run `npm test` and confirm all 22 test files pass
- [x] T024 [US2] Run `npm run build` and confirm the build completes successfully
- [x] T025 [US2] Run a comprehensive search to verify no stale repository-identity references remain: `grep -r "usg-map" --include="*.json" --include="*.yml" --include="*.md" --include="*.py" --include="*.ts" . | grep -v node_modules | grep -v "usg-map-config" | grep -v "usg-client" | grep -v "specs/007-repo-rename"` — expected: zero results

**Checkpoint**: All repository-identity references updated. Build and tests pass. No stale "usg-map" references in repository-identity contexts.

---

## Phase 5: User Story 3 — Preserve Client Configuration Identity (Priority: P2)

**Goal**: Confirm that all "usg" client configurations remain functional and unchanged after the rename. No implementation tasks needed — this is a verification-only story.

**Independent Test**: Load the "usg" client in the renamed repository and confirm all map features display correctly.

### Verification for User Story 3

- [x] T026 [US3] Verify `config/usg-map-config.json` exists and is unchanged (file content matches original)
- [x] T027 [US3] Verify `config/usg-client.json` exists and is unchanged (file content matches original)
- [x] T028 [US3] Verify `config/clients.prod.json` still includes `"usg"` in the clients array
- [x] T029 [US3] Verify `config/clients.demo.json` still includes `"usg"` in the clients array
- [x] T030 [US3] Verify `config/clients.test.json` still includes `"usg"` in the clients array
- [x] T031 [US3] Verify `src/lib/client-registry.ts` still imports `usg-map-config.json` and `usg-client.json` for the "usg" client
- [x] T032 [US3] Run the client-specific tests to confirm USG client loads correctly: `npx vitest run tests/client-isolation.test.ts tests/client-config.test.ts tests/e2e-validation.test.ts`

**Checkpoint**: USG client configuration verified intact. All client-specific tests pass.

---

## Phase 6: User Story 4 — Redirect or Deprecate the Original Repository (Priority: P3)

**Goal**: After the team has validated the new repository, archive the original to prevent accidental commits.

**Independent Test**: Confirm the original repository is read-only and developers' remotes point to the new repository.

### Implementation for User Story 4

- [ ] T033 [US4] Notify all team members of the repository rename and provide the git remote update command: `git remote set-url origin https://oddessentials@dev.azure.com/oddessentials/oddessentials/_git/odd-map`
- [ ] T034 [US4] Confirm all team members have updated their local clones to point to `odd-map`
- [ ] T035 [US4] Document any open pull requests in `usg-map` that need to be re-created in `odd-map`. Re-create any still-active PRs in the new repository
- [ ] T036 [US4] Audit Azure DevOps service hooks, webhooks, and build pipeline triggers that reference `usg-map`. Update or re-create any that point to the old repository
- [ ] T037 [US4] Archive or disable the original `usg-map` repository in Azure DevOps (Settings → General → Disable)

**Checkpoint**: Original repository archived. All team members working from "odd-map".

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and commit

- [ ] T038 Commit all changes to `main` in the `odd-map` repository with message: "refactor: rename repository identity from usg-map to odd-map"
- [ ] T039 Push the commit to the `odd-map` remote and verify CI pipeline runs successfully
- [ ] T040 Run quickstart.md validation: walk through the complete quickstart guide and confirm all steps are accurate for the renamed repository

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: N/A — no blocking prerequisites
- **User Story 1 (Phase 3)**: Depends on Setup (Phase 1) — verify the mirror before changing anything
- **User Story 2 (Phase 4)**: Depends on User Story 1 verification — cannot update references until copy is confirmed
- **User Story 3 (Phase 5)**: Depends on User Story 2 — verify client identity after all reference changes
- **User Story 4 (Phase 6)**: Depends on User Stories 2 and 3 — cannot archive original until new repo is validated
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Phase 1 Setup only — verification of the mirror copy
- **User Story 2 (P1)**: Depends on US1 completion — safe to change files only after mirror is verified
- **User Story 3 (P2)**: Depends on US2 completion — verify client identity preservation after all reference updates
- **User Story 4 (P3)**: Depends on US2 + US3 — archive only after new repo is fully validated

### Within User Story 2 (Reference Updates)

- T009–T021 are all marked [P] and can be executed in parallel (different files, no dependencies)
- T022 depends on T009, T010 (npm install validates lockfile after package name change)
- T023 depends on T017 (tests won't pass until setup.test.ts is updated)
- T024 has no strict dependency (local `npm run build` uses default base path, not CI `--base` flag)
- T025 depends on T009–T021 (comprehensive search only meaningful after all edits)

### Parallel Opportunities

- **Phase 4 (US2)**: T009–T021 are all parallelizable — 12 active edits across different files with no interdependencies (T012 is an explicit no-op)
- **Phase 5 (US3)**: T026–T031 are all parallelizable — independent file existence checks

---

## Parallel Example: User Story 2

```bash
# Launch all file edits in parallel (12 tasks, all different files):
Task: "Update package.json name field"
Task: "Update package-lock.json name field"
Task: "Update ci.yml base path"
Task: "Update README.md badge URL"
Task: "Update README.md structure diagram"
Task: "Update CLAUDE.md title"
Task: "Update geocode_locations.py user-agent"
Task: "Update setup.test.ts assertion"
Task: "Update 006 plan.md base paths"
Task: "Update 006 research.md base paths"
Task: "Update 006 quickstart.md base paths"
Task: "Update 006 tasks.md base paths"

# Then run validation sequentially:
Task: "npm install"
Task: "npm test"
Task: "npm run build"
Task: "grep verification"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Create mirror copy on Azure DevOps
2. Complete Phase 3: Verify mirror is correct (US1)
3. Complete Phase 4: Update all repository-identity references (US2)
4. **STOP and VALIDATE**: Build passes, tests pass, no stale references
5. This is a fully functional renamed repository

### Incremental Delivery

1. US1 (mirror) + US2 (reference updates) → Renamed repository is usable (**MVP**)
2. Add US3 (client verification) → Confidence that nothing was accidentally broken
3. Add US4 (archive original) → Clean transition, no confusion

### Single Developer Timeline

All tasks can be completed by a single developer in a single session:

- Phase 1 (Setup): ~10 minutes
- Phase 3 (US1 Verification): ~5 minutes
- Phase 4 (US2 Reference Updates): ~30 minutes (13 parallel file edits + validation)
- Phase 5 (US3 Client Verification): ~10 minutes
- Phase 6 (US4 Archive): ~15 minutes (depends on team coordination)
- Phase 7 (Polish): ~10 minutes

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- **Critical distinction**: "usg-map" (repository identity → changes to "odd-map") vs "usg-map-config.json" (client identity → preserved)
- Commit after Phase 4 completion (all reference updates done together as one logical change)
- The original `usg-map` repository is NEVER modified — all changes happen in the new `odd-map` clone
