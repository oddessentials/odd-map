# Tasks: Fix Critical 3D/2D Map Visualization Bugs

**Input**: Design documents from `/specs/001-fix-map-bugs/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: Included per Constitution III (Enterprise Testing Standards) requirement for regression tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Verification)

**Purpose**: Verify current state and ensure environment is ready

- [ ] T001 Run `npm install` to ensure dependencies are current
- [ ] T002 Run `npm run verify:quick` to confirm linting/formatting passes
- [ ] T003 Run `npm test` to establish baseline (existing tests should pass)
- [ ] T004 Run `npm run dev` and manually confirm all three bugs are reproducible per quickstart.md

**Checkpoint**: Environment verified, bugs confirmed reproducible

---

## Phase 2: Foundational (None Required)

**Purpose**: Core infrastructure that MUST be complete before ANY user story

**Note**: No foundational changes needed - all fixes are isolated to existing components with no shared infrastructure changes.

**Checkpoint**: No blocking prerequisites - user story implementation can begin immediately

---

## Phase 3: User Story 1 - Pins Remain Visible During Map Mode Transition (Priority: P1)

**Goal**: Fix race condition so pins remain visible when switching between 2D and 3D views

**Independent Test**: Select region in 3D view, toggle to 2D, verify pins visible without re-selecting

### Tests for User Story 1

- [ ] T005 [P] [US1] Add regression test for marker-ready state in tests/view-switching.test.ts: test that selectRegion queues selection if markers not ready
- [ ] T006 [P] [US1] Add regression test for pending selection processing in tests/view-switching.test.ts: test that queued selection is applied when markers become ready

### Implementation for User Story 1

- [ ] T007 [US1] Add `markersReady` private boolean property (default false) to MapSvg class in src/components/map-svg.ts
- [ ] T008 [US1] Add `pendingRegionSelection` private string|null property (default null) to MapSvg class in src/components/map-svg.ts
- [ ] T009 [US1] Update `addMarkers()` method in src/components/map-svg.ts to set `markersReady = true` after markers are created and process any pending selection
- [ ] T010 [US1] Update `selectRegion()` method in src/components/map-svg.ts to queue selection in `pendingRegionSelection` if `markersReady` is false, otherwise proceed normally
- [ ] T011 [US1] Run `npm test -- view-switching` to verify new tests pass

**Checkpoint**: User Story 1 complete - pins remain visible during 2D↔3D transitions

---

## Phase 4: User Story 2 - Pins Display at Correct Geographic Locations (Priority: P1)

**Goal**: Fix texture offset so 3D pins appear over USA landmass, not in the ocean

**Independent Test**: Load 3D globe, verify pins cluster over continental USA (California on west coast, New York on east coast)

### Tests for User Story 2

- [ ] T012 [P] [US2] Add texture offset calibration test in tests/projection-3d.test.ts: verify TEXTURE_LONGITUDE_OFFSET_DEG equals 180
- [ ] T013 [P] [US2] Add coordinate verification test in tests/projection-3d.test.ts: verify known US coordinates (e.g., Irvine CA at -117.74° lon) produce positions in western hemisphere

### Implementation for User Story 2

- [ ] T014 [US2] Change `TEXTURE_LONGITUDE_OFFSET_DEG` from `0` to `180` on line 60 of src/components/map-3d.js
- [ ] T015 [US2] Run `npm test -- projection-3d` to verify new tests pass
- [ ] T016 [US2] Manual verification: run `npm run dev`, switch to 3D view, confirm pins appear over USA landmass

**Checkpoint**: User Story 2 complete - 3D pins appear at correct geographic locations

---

## Phase 5: User Story 3 - Smooth Pin Visibility During Globe Rotation (Priority: P2)

**Goal**: Fix flickering by implementing hysteresis in backface culling

**Independent Test**: Load 3D globe with auto-rotate, observe pins near visibility edge - should transition once, not flicker

### Tests for User Story 3

- [ ] T017 [P] [US3] Add hysteresis threshold validation test in tests/scene-graph-parenting.test.ts: verify BACKFACE_HIDE_THRESHOLD > BACKFACE_SHOW_THRESHOLD
- [ ] T018 [P] [US3] Add hysteresis behavior test in tests/scene-graph-parenting.test.ts: simulate marker at threshold boundary, verify visibility doesn't toggle rapidly

### Implementation for User Story 3

- [ ] T019 [US3] Add constant `BACKFACE_HIDE_THRESHOLD = 0.25` near line 60 in src/components/map-3d.js
- [ ] T020 [US3] Add constant `BACKFACE_SHOW_THRESHOLD = 0.15` near line 60 in src/components/map-3d.js
- [ ] T021 [US3] Replace single-threshold visibility logic (line ~578) with hysteresis logic in `updateExpensiveMarkerStates()` in src/components/map-3d.js: if visible and dotProduct > HIDE_THRESHOLD then hide; else if not visible and dotProduct < SHOW_THRESHOLD then show; else no change
- [ ] T022 [US3] Run `npm test -- scene-graph-parenting` to verify new tests pass
- [ ] T023 [US3] Manual verification: run `npm run dev`, switch to 3D view with auto-rotate, confirm no pin flickering

**Checkpoint**: User Story 3 complete - pins transition smoothly without flickering

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and cleanup

- [ ] T024 Run full test suite: `npm run test:ci` to verify all tests pass
- [ ] T025 Run verification suite: `npm run verify` (typecheck, lint, format, tests)
- [ ] T026 Manual smoke test: complete user journey per quickstart.md manual testing checklist
- [ ] T027 [P] Update TODO.md to mark bugs #1, #2, #3 as FIXED with date

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: N/A - no foundational tasks
- **User Stories (Phase 3-5)**: Can start after Setup verification
  - User stories are independent and can proceed in parallel
  - Or sequentially in priority order (US1 → US2 → US3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent - modifies src/components/map-svg.ts only
- **User Story 2 (P1)**: Independent - modifies src/components/map-3d.js (different section than US3)
- **User Story 3 (P2)**: Independent - modifies src/components/map-3d.js (different section than US2)

### Within Each User Story

- Tests FIRST (T005-T006, T012-T013, T017-T018) - should FAIL before implementation
- Implementation tasks in order
- Run story-specific tests to verify
- Story complete checkpoint

### Parallel Opportunities

**User Stories can run in parallel:**

```
US1 (map-svg.ts) | US2 (map-3d.js:60) | US3 (map-3d.js:578)
       ↓        |        ↓           |         ↓
   T007-T011    |    T014-T016       |     T019-T023
```

**Within User Story 1:**

- T005 and T006 can run in parallel (both are tests)
- T007 and T008 can run in parallel (both add properties)

**Within User Story 2:**

- T012 and T013 can run in parallel (both are tests)

**Within User Story 3:**

- T017 and T018 can run in parallel (both are tests)
- T019 and T020 can run in parallel (both add constants)

---

## Parallel Example: All User Stories

```bash
# If multiple developers available, launch all user stories in parallel:

# Developer A: User Story 1
Task: "Add regression test for marker-ready state in tests/view-switching.test.ts"
Task: "Add markersReady property to MapSvg in src/components/map-svg.ts"
# ... continue US1 tasks

# Developer B: User Story 2
Task: "Add texture offset calibration test in tests/projection-3d.test.ts"
Task: "Change TEXTURE_LONGITUDE_OFFSET_DEG to 180 in src/components/map-3d.js"
# ... continue US2 tasks

# Developer C: User Story 3
Task: "Add hysteresis threshold validation test in tests/scene-graph-parenting.test.ts"
Task: "Add BACKFACE_HIDE_THRESHOLD constant in src/components/map-3d.js"
# ... continue US3 tasks
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

Both US1 and US2 are P1 priority and fix critical usability bugs:

1. Complete Phase 1: Setup verification
2. Complete Phase 3: User Story 1 (race condition)
3. Complete Phase 4: User Story 2 (texture offset)
4. **STOP and VALIDATE**: Both critical bugs should be fixed
5. Deploy if acceptable (flickering is lower priority polish)

### Full Implementation

1. Complete Setup (Phase 1)
2. Complete US1 → Test independently
3. Complete US2 → Test independently
4. Complete US3 → Test independently
5. Complete Polish (Phase 6)
6. All bugs fixed, ready for merge

### Single Developer Recommended Order

T001 → T002 → T003 → T004 (setup)
→ T005 → T006 → T007 → T008 → T009 → T010 → T011 (US1)
→ T012 → T013 → T014 → T015 → T016 (US2)
→ T017 → T018 → T019 → T020 → T021 → T022 → T023 (US3)
→ T024 → T025 → T026 → T027 (polish)

---

## Notes

- All implementation tasks modify existing files - no new files created
- US2 is a single-line constant change (simplest fix)
- US3 modifies same file as US2 but different section (lines 60 vs 578)
- Tests follow existing patterns in test files - add to existing describe blocks
- Constitution III requires tests for all fixes - tests included
- Commit after each user story completes for clean history
