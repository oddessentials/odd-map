# Tasks: Fix Marker Highlighting & Panel State Management

**Input**: Design documents from `/specs/011-fix-marker-panel-state/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, quickstart.md

**Tests**: Included — FR-011 requires all existing tests to pass with close-button and marker-state tests updated.

**Organization**: Tasks are grouped by user story. All four stories are independent and can be implemented in any order.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Exact file paths included in descriptions

---

## Phase 1: User Story 1 - Close Button Fully Dismisses Selection (Priority: P1) MVP

**Goal**: Clicking the X close button resets the entire UI to USA_VIEW from any selection state (LOCATION_VIEW or REGION_VIEW) in a single click.

**Independent Test**: Select any office marker, click X. Both panels reset, map zooms out, all markers full opacity, URL hash cleared.

### Tests for User Story 1

- [x] T001 [US1] Update close-button tests to expect direct reset behavior in `tests/close-button.test.ts`: change LOCATION_VIEW test to expect `handleReset` called (not `handleRegionClick`); remove "LOCATION_VIEW without selectedRegion" edge case (no longer applies); keep REGION_VIEW → `handleReset` and USA_VIEW → no-op tests unchanged

### Implementation for User Story 1

- [x] T002 [US1] Simplify `handlePanelClose` method in `src/app.ts` (line 420): replace hierarchical back-navigation logic with `if (this.state !== States.USA_VIEW) { this.handleReset(); }`

- [x] T003 [US1] Run full test suite (`npm test`) and verify all tests pass including updated close-button tests

**Checkpoint**: Close button now fully resets from any state. Verify: select office → click X → full reset. Select region → click X → full reset.

---

## Phase 2: User Story 2 - Selected Office Marker Visually Distinguished (Priority: P2)

**Goal**: When an office is selected, same-region non-selected markers appear subdued (~55% opacity) to clearly distinguish the selected marker from its regional siblings.

**Independent Test**: Select any office marker. Selected marker shows accent color at full opacity, same-region siblings appear subdued, out-of-region markers fully dimmed.

### Tests for User Story 2

- [x] T004 [US2] Add subdued state tests in `tests/marker-state.test.ts`: (1) office selected → same-region non-selected markers have `subdued: true`; (2) selected marker has `subdued: false`; (3) out-of-region markers have `subdued: false` and `dimmed: true`; (4) region view (no office selected) → all markers `subdued: false`; (5) USA view → all markers `subdued: false`

### Implementation for User Story 2

- [x] T005 [US2] Add `subdued` boolean field to `MarkerVisualState` interface and compute it in `computeMarkerStates` function in `src/lib/marker-state.ts`: subdued is true when `selectedOfficeCode !== null && selectedRegion !== null && office.regionName === selectedRegion && office.officeCode !== selectedOfficeCode`

- [x] T006 [P] [US2] Add `.marker--subdued` CSS class in `src/styles/app.css` after `.marker--dimmed` (line 961): `opacity: 0.55` with no `pointer-events: none` (subdued markers remain clickable)

- [x] T007 [P] [US2] Add `marker--subdued` CSS class toggle in `updateMarkerStates` method in `src/components/map-svg.ts` (after the `marker--dimmed` toggle): `marker.classList.toggle('marker--subdued', state.subdued)`

- [x] T008 [P] [US2] Add subdued opacity handling in `updateMarkerStates` method in `src/components/map-3d.js` (after the dimmed block, before the normal reset block): when `state.subdued`, set material opacity to 0.55 and hide glow, then `continue`

- [x] T009 [US2] Run full test suite (`npm test`) and verify all tests pass including new subdued marker tests

**Checkpoint**: Office selection now shows three visual tiers. Verify: select office → selected marker bright, same-region subdued, out-of-region dimmed.

---

## Phase 3: User Story 3 - Panel Office List Buttons Maintain Consistent State (Priority: P3)

**Goal**: Clicking an office name in the panel's region office list routes through the app state machine, updating map, markers, URL, and panel consistently.

**Independent Test**: Select a region, click an office name in the panel list. Map zooms to office, marker highlighted, panel shows office details, URL updates. Click X → full reset.

### Implementation for User Story 3

- [x] T010 [P] [US3] Add `onOfficeClick` callback to `DetailsPanel` constructor options in `src/components/details-panel.js` (line 14): add `onOfficeClick: options.onOfficeClick || null` alongside existing `onClose`

- [x] T011 [US3] Update `.office-btn` click handlers in `showRegion` method in `src/components/details-panel.js` (line 118-121): replace direct `this.showOffice(office, region)` call with `if (this.options.onOfficeClick) { this.options.onOfficeClick(office, region); } else { this.showOffice(office, region); }`

- [x] T012 [US3] Pass `onOfficeClick` callback when instantiating `DetailsPanel` in `src/app.ts` (line 175): add `onOfficeClick: (office, region) => this.handleOfficeClick(office, region)` to the options object

- [x] T013 [US3] Run full test suite (`npm test`) and verify all tests pass

**Checkpoint**: Panel office list clicks now route through app. Verify: select region → click office in panel list → map zooms, marker highlighted → click X → full reset.

---

## Phase 4: User Story 4 - No Redundant State Processing on Navigation (Priority: P4)

**Goal**: Region and office click handlers update the URL without triggering the hashchange listener, preventing redundant re-processing. Deep-linking via direct URL navigation still works.

**Independent Test**: Select a region or office. State update logic executes exactly once (no doubled animation restart or panel re-render).

### Implementation for User Story 4

- [x] T014 [P] [US4] Replace `window.location.hash = ...` with `history.replaceState(null, '', '#...')` in `handleRegionClick` method in `src/app.ts` (line 376): change `window.location.hash = \`region=...\``to`history.replaceState(null, '', \`#region=...\`)`

- [x] T015 [P] [US4] Replace `window.location.hash = ...` with `history.replaceState(null, '', '#...')` in `handleOfficeClick` method in `src/app.ts` (line 409): change `window.location.hash = \`office=...\``to`history.replaceState(null, '', \`#office=...\`)`

- [x] T016 [US4] Run full test suite (`npm test`) and verify all tests pass; manually verify deep-linking still works by navigating to `#office=XYZ` and `#region=RegionName` URLs directly

**Checkpoint**: Hash changes no longer cause re-entrancy. Verify: select region → no animation jank; direct URL navigation still works.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all stories

- [x] T017 Run full test suite (`npm test`) and confirm all 371+ tests pass
- [ ] T018 Run quickstart.md manual testing checklist (8 scenarios) against dev server (`npm run dev`)
- [ ] T019 Verify 2D/3D mode switching preserves correct marker states (subdued, dimmed, selected) after each fix
- [ ] T020 Run lint and type checks (`npm run lint`) to confirm no regressions

---

## Dependencies & Execution Order

### Phase Dependencies

- **User Stories (Phase 1-4)**: All four stories are independent — no shared foundational prerequisites needed
  - US1, US2, US3, US4 can proceed in any order or in parallel
  - Each story touches different methods/files with minimal overlap
- **Polish (Phase 5)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent. Modifies `handlePanelClose` only.
- **User Story 2 (P2)**: Independent. Modifies `marker-state.ts` interface + both renderers + CSS.
- **User Story 3 (P3)**: Independent. Modifies `details-panel.js` + DetailsPanel instantiation in `app.ts`.
- **User Story 4 (P4)**: Independent. Modifies hash assignment lines in `handleRegionClick` and `handleOfficeClick` in `app.ts`.

### File Overlap Notes

- `src/app.ts` is touched by US1, US3, and US4, but in **different methods**:
  - US1: `handlePanelClose` (line 420)
  - US3: DetailsPanel instantiation (line 175)
  - US4: `handleRegionClick` hash line (line 376) + `handleOfficeClick` hash line (line 409)
- No merge conflicts expected when implementing sequentially.

### Within Each User Story

- Tests written/updated first, then implementation, then validation
- Each story ends with a full test suite run

### Parallel Opportunities

- T006, T007, T008 can run in parallel (CSS, 2D renderer, 3D renderer — different files)
- T010 can run in parallel with other stories (details-panel.js is only touched by US3)
- T014, T015 can run in parallel (different methods in same file, non-conflicting lines)

---

## Parallel Example: User Story 2

```bash
# After T005 (interface + computation) completes, launch renderers in parallel:
Task: "T006 Add .marker--subdued CSS class in src/styles/app.css"
Task: "T007 Add marker--subdued toggle in src/components/map-svg.ts"
Task: "T008 Add subdued opacity in src/components/map-3d.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: US1 — Close button direct reset
2. **STOP and VALIDATE**: Click X from any state → full reset
3. This alone fixes the most impactful user-facing bug

### Incremental Delivery

1. US1 (close button) → Test → Functional X button (MVP!)
2. US2 (subdued markers) → Test → Clear visual distinction for selected office
3. US3 (panel routing) → Test → Consistent state from panel clicks
4. US4 (hashchange) → Test → No animation jank
5. Polish → Full validation → Ready for PR

### Recommended Execution Order

Implement sequentially in priority order (P1 → P2 → P3 → P4) to maximize value delivered at each checkpoint. Each story builds confidence in the overall fix without depending on the others.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- All four stories are independently completable and testable
- Commit after each story phase completion
- Stop at any checkpoint to validate story independently
- The Escape key handler retains hierarchical behavior (out of scope per spec)
