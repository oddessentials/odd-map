# Tasks: Globe Rotation Toggle

**Input**: Design documents from `/specs/003-globe-rotation-toggle/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, quickstart.md ✓

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No setup required - this feature modifies existing files only

_No tasks in this phase - all infrastructure exists._

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core changes that enable all user stories

**⚠️ CRITICAL**: User Story 2 (spin toggle button) requires these Map3D changes to work

- [ ] T001 Change `autoRotate` default from `true` to `false` in constructor in `src/components/map-3d.js`
- [ ] T002 Add `toggleAutoRotate()` method that returns new state in `src/components/map-3d.js`
- [ ] T003 Add `getAutoRotate()` method to expose current state in `src/components/map-3d.js`
- [ ] T004 [P] Update type declarations for new methods in `src/components/map-3d.d.ts`

**Checkpoint**: Map3D API ready - User Story 1 is complete, spin toggle can now be implemented

---

## Phase 3: User Story 1 - Static Globe by Default (Priority: P1) 🎯 MVP

**Goal**: Globe is stationary on initial 3D view load

**Independent Test**: Load the 3D map view and observe that the globe remains stationary. Manual drag and selection animations still work.

### Implementation for User Story 1

_Foundational task T001 implements this story. No additional tasks needed._

- [ ] T005 [US1] Verify manual drag rotation still works after autoRotate default change in `src/components/map-3d.js`
- [ ] T006 [US1] Verify selection animations (selectRegion, selectOffice) still work in `src/components/map-3d.js`

**Checkpoint**: Globe is stationary by default; manual interaction and animations work correctly

---

## Phase 4: User Story 2 - Spin Toggle Button (Priority: P2)

**Goal**: Users can click a spin button to start/stop auto-rotation

**Independent Test**: Click the spin button and verify the globe starts rotating; click again and verify it stops.

### Implementation for User Story 2

- [ ] T007 [P] [US2] Add spin toggle button markup (`id="spin-toggle"`) in `src/index.html`
- [ ] T008 [P] [US2] Add CSS styles for `.spin-toggle` button matching existing toggle pattern in `src/styles/app.css`
- [ ] T009 [US2] Add `spinBtn` property to App class in `src/app.ts`
- [ ] T010 [US2] Add click handler for spin button that calls `map.toggleAutoRotate()` in `src/app.ts`
- [ ] T011 [US2] Add `updateSpinButton()` method to update button visual state in `src/app.ts`
- [ ] T012 [US2] Add `updateSpinButtonVisibility()` to hide button in 2D mode in `src/app.ts`
- [ ] T013 [US2] Call `updateSpinButtonVisibility()` in `toggleMapMode()` after map switch in `src/app.ts`

**Checkpoint**: Spin button toggles auto-rotation on/off; button hidden in 2D mode

---

## Phase 5: User Story 3 - Spin Button Visual Design (Priority: P3)

**Goal**: Button has clear iconography and visual feedback for active/inactive states

**Independent Test**: Inspect the spin button - verify rotation icon, hover effects, and active state styling

### Implementation for User Story 3

- [ ] T014 [P] [US3] Add Unicode rotation icon (↻) to button content in `src/index.html`
- [ ] T015 [P] [US3] Add hover styling (scale, opacity) for `.spin-toggle:hover` in `src/styles/app.css`
- [ ] T016 [P] [US3] Add active state styling for `.spin-toggle.active` with accent background in `src/styles/app.css`
- [ ] T017 [US3] Add/remove `.active` class in `updateSpinButton()` based on rotation state in `src/app.ts`
- [ ] T018 [US3] Add ARIA labels (`aria-label`, `title`) to spin button in `src/index.html`

**Checkpoint**: Button has proper icon, hover effects, and clear active/inactive visual states

---

## Phase 6: Tests (Validation)

**Purpose**: Automated tests for spin toggle behavior

- [ ] T019 [P] Create `tests/spin-toggle.test.ts` test file with test setup
- [ ] T020 [P] Test: autoRotate defaults to false on Map3D initialization in `tests/spin-toggle.test.ts`
- [ ] T021 [P] Test: toggleAutoRotate() returns new state and toggles correctly in `tests/spin-toggle.test.ts`
- [ ] T022 [P] Test: getAutoRotate() returns current state in `tests/spin-toggle.test.ts`
- [ ] T023 [P] Test: Spin button is hidden when use3D is false in `tests/spin-toggle.test.ts`
- [ ] T024 [P] Test: Spin button click toggles autoRotate in `tests/spin-toggle.test.ts`
- [ ] T025 Test: Button visual state reflects rotation state in `tests/spin-toggle.test.ts`

**Checkpoint**: All spin toggle tests pass

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and edge case handling

- [ ] T026 Verify spin state resets on view switch (2D ↔ 3D) per FR-009 in `src/app.ts`
- [ ] T027 Run `npm run verify` to ensure all quality checks pass
- [ ] T028 Run `npm test` to verify all tests pass (target: ~140 tests)
- [ ] T029 Manual test: quickstart.md validation checklist
- [ ] T030 Manual test: Edge cases from spec (drag stops spin, selection pauses spin)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: N/A - no setup needed
- **Phase 2 (Foundational)**: No dependencies - can start immediately
- **Phase 3 (US1)**: Depends on Phase 2 (T001 specifically)
- **Phase 4 (US2)**: Depends on Phase 2 (T002, T003)
- **Phase 5 (US3)**: Depends on Phase 4 (button must exist)
- **Phase 6 (Tests)**: Can start after Phase 2, runs parallel with Phase 4/5
- **Phase 7 (Polish)**: Depends on all prior phases complete

### Task Dependencies Within Phases

**Phase 2 (Foundational)**:

```
T001 (autoRotate default)
  ↓
T002 (toggleAutoRotate) + T003 (getAutoRotate) + T004 (types) [parallel after T001]
```

**Phase 4 (User Story 2)**:

```
T007 (HTML markup) + T008 (CSS styles) [parallel - different files]
  ↓
T009 (spinBtn property)
  ↓
T010 (click handler) + T011 (updateSpinButton) [can be combined]
  ↓
T012 (visibility logic)
  ↓
T013 (wire up in toggleMapMode)
```

**Phase 5 (User Story 3)**:

```
T014 (icon) + T015 (hover) + T016 (active state) + T018 (ARIA) [parallel - different concerns]
  ↓
T017 (wire up active class)
```

### Parallel Opportunities

- T004 can run parallel with T002/T003 (different file)
- T007 and T008 can run parallel (HTML vs CSS)
- All tests T019-T025 can run parallel (same test file, different test cases)
- T014, T015, T016, T018 can run parallel (independent styling/markup)

---

## Parallel Example: User Story 2

```bash
# Launch HTML and CSS tasks together:
Task: "Add spin toggle button markup in src/index.html"
Task: "Add CSS styles for .spin-toggle in src/styles/app.css"

# Launch after markup/styles complete:
Task: "Add spinBtn property and handlers in src/app.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (T001-T004)
2. **STOP and VALIDATE**: Globe is stationary on load
3. This is the absolute minimum viable change

### Incremental Delivery

1. Foundational → Globe static by default (US1 complete)
2. User Story 2 → Spin button works (core functionality)
3. User Story 3 → Visual polish (nice to have)
4. Tests → Automated regression coverage
5. Polish → Full validation suite

---

## Notes

- All changes are to existing files - only new file is `tests/spin-toggle.test.ts`
- TypeScript changes in `src/app.ts`, JavaScript changes in `src/components/map-3d.js`
- CSS changes in `src/styles/app.css`, HTML changes in `src/index.html`
- Type declarations in `src/components/map-3d.d.ts`
- Commit after each phase or logical task group
- Button ID: `spin-toggle` (per data-model.md)
- Button icon: Unicode ↻ (per research.md)
