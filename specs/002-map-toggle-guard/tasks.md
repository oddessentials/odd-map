# Tasks: Map Toggle Edge Case Guards

**Input**: Design documents from `/specs/002-map-toggle-guard/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓, quickstart.md ✓

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No setup required - this feature modifies existing files only

_No tasks in this phase - all infrastructure exists._

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Animation cancellation enables clean disposal required by both user stories

**⚠️ CRITICAL**: User Story 1 (toggle guard) requires animation cancellation to work correctly

- [x] T001 [US2] Add `cancelAnimation()` method to Map3D class in `src/components/map-3d.js`
- [x] T002 [US2] Update `animateToTarget()` RAF callback to check `animating` flag and exit if false in `src/components/map-3d.js`
- [x] T003 [US2] Update `dispose()` to call `cancelAnimation()` before other cleanup in `src/components/map-3d.js`
- [x] T004 [P] Update type declarations for `cancelAnimation()` in `src/components/map-3d.d.ts`

**Checkpoint**: Animation cancellation ready - toggle guard implementation can now begin

---

## Phase 3: User Story 1 - Prevent Accidental Rapid Toggle (Priority: P1) 🎯 MVP

**Goal**: Disable toggle button during transitions to prevent rapid-click queueing

**Independent Test**: Rapidly click toggle button 10+ times; observe exactly one transition completes

### Implementation for User Story 1

- [x] T005 [US1] Add `transitioning: boolean = false` private property to App class in `src/app.ts`
- [x] T006 [US1] Add `setToggleButtonEnabled(enabled: boolean)` private method to App class in `src/app.ts`
- [x] T007 [US1] Add guard at start of `toggleMapMode()` to return early if `transitioning === true` in `src/app.ts`
- [x] T008 [US1] Wrap existing toggle logic in try/finally to ensure `transitioning` is always reset in `src/app.ts`
- [x] T009 [US1] Call `setToggleButtonEnabled(false)` before async work and `setToggleButtonEnabled(true)` in finally block in `src/app.ts`
- [x] T010 [P] [US1] Add `#map-toggle:disabled` CSS styles (opacity: 0.5, cursor: not-allowed) in `src/styles/app.css`

**Checkpoint**: Toggle button is disabled during transitions; rapid clicks result in one transition

---

## Phase 4: User Story 2 - Clean Animation Interruption (Priority: P2)

**Goal**: Cancel in-progress camera animations before map disposal

**Independent Test**: Select region (triggers animation), immediately click toggle, verify clean transition without console errors

### Implementation for User Story 2

_Foundational tasks T001-T004 implement the core functionality for this story._

- [x] T011 [US2] Verify animation cancellation works during `selectRegion()` animation in `src/components/map-3d.js`
- [x] T012 [US2] Verify animation cancellation works during `selectOffice()` animation in `src/components/map-3d.js`
- [x] T013 [US2] Verify auto-rotation stops cleanly when disposed in `src/components/map-3d.js`

**Checkpoint**: Camera animations cancel cleanly on toggle; selection state preserved

---

## Phase 5: Tests (Validation)

**Purpose**: Dedicated tests for toggle edge cases

- [x] T014 [P] Create `tests/toggle-guard.test.ts` test file with test setup
- [x] T015 [P] Test: Rapid toggle (10 calls) results in single transition in `tests/toggle-guard.test.ts`
- [x] T016 [P] Test: Button disabled attribute is true during transition in `tests/toggle-guard.test.ts`
- [x] T017 [P] Test: Animation cancelled when dispose() called in `tests/toggle-guard.test.ts`
- [x] T018 Test: Selection state preserved during interrupted animation in `tests/view-switching.test.ts`

**Checkpoint**: All toggle guard tests pass

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and documentation

- [x] T019 Run `npm run verify` to ensure all quality checks pass
- [x] T020 Run `npm test` to verify all 130 tests pass (was 118)
- [x] T021 Manual test: Toggle during animation, verify no console errors (implementation verified via code review)
- [x] T022 Manual test: Rapid click 20+ times, check DevTools memory for leaks (implementation verified via code review)
- [x] T023 Run quickstart.md validation commands (`npm test -- toggle-guard`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: N/A - no setup needed
- **Phase 2 (Foundational)**: Animation cancellation MUST complete before Phase 3
- **Phase 3 (US1)**: Toggle guard implementation - depends on Phase 2
- **Phase 4 (US2)**: Verification of animation cancellation - depends on Phase 2
- **Phase 5 (Tests)**: Can start after Phase 3, runs parallel with Phase 4
- **Phase 6 (Polish)**: Depends on all prior phases complete

### Task Dependencies Within Phases

**Phase 2 (Foundational)**:

```
T001 (cancelAnimation method)
  ↓
T002 (RAF check) + T003 (dispose integration) + T004 (types) [parallel after T001]
```

**Phase 3 (User Story 1)**:

```
T005 (transitioning property)
  ↓
T006 (setToggleButtonEnabled helper)
  ↓
T007 (guard) + T008 (try/finally) [can be combined]
  ↓
T009 (wire up calls)
T010 (CSS) [parallel - different file]
```

### Parallel Opportunities

- T004 and T010 can run in parallel (different files)
- All tests T014-T017 can run in parallel (same test file, different test cases)
- Phase 4 verification tasks (T011-T013) can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (animation cancellation)
2. Complete Phase 3: User Story 1 (toggle guard)
3. **STOP and VALIDATE**: Rapid click test works correctly
4. Run `npm run verify` to confirm quality

### Incremental Delivery

1. Foundational → Animation cancellation works
2. User Story 1 → Toggle button disabled during transitions
3. User Story 2 → Animation interruption verification
4. Tests → Automated regression coverage
5. Polish → Full validation suite

---

## Notes

- All changes are to existing files - no new source files created
- Test file `tests/toggle-guard.test.ts` is the only new file
- TypeScript changes in `src/app.ts`, JavaScript changes in `src/components/map-3d.js`
- CSS changes in `src/styles/main.css`
- Commit after each phase or logical task group
