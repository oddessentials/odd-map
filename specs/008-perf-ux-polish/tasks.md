# Tasks: Map Performance & UX Polish

**Input**: Design documents from `/specs/008-perf-ux-polish/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, quickstart.md

**Tests**: Test tasks included for close button behavior (Constitution Principle III requires invariant tests for state machine changes).

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Verify baseline before making changes

- [x] T001 Run `npm run verify` to confirm all existing tests pass and establish baseline in `tests/`
- [ ] T002 Run `npm run dev` and visually confirm current marker translucency behavior in browser at `http://localhost:5173`

---

## Phase 2: Foundational

**Purpose**: No foundational/blocking prerequisites — all user stories modify independent concerns (CSS, app.ts state logic, mobile layout). Each story touches different areas of the codebase and can proceed after baseline verification.

**Checkpoint**: Baseline verified — user story implementation can now begin

---

## Phase 3: User Story 1 — Markers Stay Fully Opaque on 2D Map (Priority: P1) MVP

**Goal**: Eliminate unintentional marker translucency by scoping CSS transitions to only the properties that should animate, and removing redundant inline opacity assignments.

**Independent Test**: Load 2D map → verify full opacity in USA view → select region → verify in-region markers at full opacity, out-of-region dimmed instantly → reset → verify all markers return to full opacity instantly.

**Covers**: FR-001, FR-002, FR-003, FR-004, FR-014, FR-015, SC-001, SC-004, SC-007

### Implementation for User Story 1

- [x] T003 [P] [US1] Replace `transition: all 0.2s ease` with `transition: fill 0.2s ease, filter 0.2s ease, stroke-width 0.2s ease` on `.marker` rule in `src/styles/app.css` (line 875)
- [x] T004 [P] [US1] Remove `markerGroup.style.opacity = '1'` inline assignment in `addMarkers()` method in `src/components/map-svg.ts` (line ~192)
- [x] T005 [P] [US1] Remove `group.style.opacity = '1'` inline assignment in `ensureMarkersVisible()` method in `src/components/map-svg.ts` (line ~372)
- [ ] T006 [US1] Visually verify: load 2D map in browser, confirm markers at full opacity in USA view, select a region, confirm dimming is instant (no 200ms fade), confirm hover fill/filter effects still animate smoothly, confirm selected marker stroke-width still animates

**Checkpoint**: Markers display at full opacity with no unintentional translucency. Hover and selection animations preserved at current quality. US1 is independently complete.

---

## Phase 4: User Story 2 — Mobile-Friendly Map Experience (Priority: P2)

**Goal**: Restructure the mobile layout so the map is usable on iPhone Pro — region navigation above the map, touch-optimized map container, adequate touch targets, refined bottom sheet.

**Independent Test**: Open app on iPhone Pro (430×932) or Chrome DevTools device emulator → complete full journey: view USA map → tap region → tap marker → view details → navigate back. No horizontal scroll, no broken layouts, all controls reachable.

**Covers**: FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, SC-002, SC-010

### Implementation for User Story 2

- [x] T007 [US2] Restructure mobile grid layout in `@media (max-width: 768px)` section of `src/styles/app.css` (lines 748-792): change `.layout` to flex column, set `.map-section` to `flex: 1` instead of `min-height: 400px`, set `.sidebar-left` to `order: 0` (above map) with `flex-shrink: 0`
- [x] T008 [US2] Restyle `.sidebar-left` for mobile as compact chip/pill navigation in `src/styles/app.css`: add mobile-only rules for region buttons as inline `flex-wrap: wrap` row with compact padding, smaller font, no accordion expansion — just region name chips that fit in one or two rows
- [x] T009 [US2] Add `touch-action: manipulation` to `.map-container` in `src/styles/app.css` to prevent double-tap zoom delay on touch devices
- [x] T010 [US2] Compact the mobile header in `src/styles/app.css`: reduce `--header-height` to `48px` at `max-width: 768px` in `src/styles/tokens.css`, hide tagline/non-essential header elements on mobile via `display: none`
- [x] T011 [US2] Refine bottom sheet panel in `src/styles/app.css`: change `.sidebar-right` `max-height` from `50vh` to `40vh` at mobile breakpoint, ensure `overflow-y: auto` and `-webkit-overflow-scrolling: touch` are set for smooth iOS scrolling
- [x] T012 [US2] Add transparent `<circle>` hit area element to each marker group in `addMarkers()` in `src/components/map-svg.ts`: insert a `<circle cx="0" cy="-8" r="12">` with `fill: transparent; stroke: none; pointer-events: all` before the marker path to expand touch targets to ~44px equivalent
- [ ] T013 [US2] Verify `prefers-reduced-motion` media query in `src/styles/app.css` (lines 950-958) still functions correctly — ensure new mobile transitions respect this override
- [ ] T014 [US2] Visually verify on iPhone Pro (430×932) via Chrome DevTools device emulator: confirm no horizontal scroll, region chips visible above map, map fills remaining space, markers tappable at region zoom, bottom sheet scrollable, back/reset button reachable

**Checkpoint**: Full user journey works on iPhone Pro. No horizontal scroll on any 375px+ viewport. US2 is independently complete.

---

## Phase 5: User Story 3 — Close Buttons Behave Predictably (Priority: P3)

**Goal**: Make the details panel close button navigate back one level in the state hierarchy (matching Escape key behavior) instead of resetting the entire application.

**Independent Test**: Select a region → select an office → click panel close button → verify map stays on region view (not USA view). Also verify: Escape key matches, reset button still does full reset, 3D modal close still works correctly.

**Covers**: FR-011, FR-012, FR-013, SC-003, SC-005

### Tests for User Story 3

- [x] T015 [P] [US3] Write unit test in `tests/close-button.test.ts`: test that `handlePanelClose()` from LOCATION_VIEW transitions to REGION_VIEW (not USA_VIEW), mock `handleRegionClick` and verify it is called with current region name
- [x] T016 [P] [US3] Write unit test in `tests/close-button.test.ts`: test that `handlePanelClose()` from REGION_VIEW transitions to USA_VIEW (calls `handleReset`)
- [x] T017 [P] [US3] Write unit test in `tests/close-button.test.ts`: test that `handlePanelClose()` from USA_VIEW is a no-op (no state change)

### Implementation for User Story 3

- [x] T018 [US3] Add `handlePanelClose()` private method to App class in `src/app.ts`: if state is LOCATION_VIEW and selectedRegion exists, call `handleRegionClick(selectedRegion.name)`; else if state is REGION_VIEW, call `handleReset()`
- [x] T019 [US3] Change the `onClose` callback in DetailsPanel constructor from `() => this.handleReset()` to `() => this.handlePanelClose()` in `src/app.ts` (line ~176)
- [x] T020 [US3] Run tests with `npm test` to confirm T015-T017 pass and all existing tests still pass
- [ ] T021 [US3] Visually verify: select region → select office → click panel close → confirm map stays on region view; click reset button → confirm full reset to USA view; test Escape key behavior matches close button; switch to 3D mode → click office → close modal → confirm globe state preserved

**Checkpoint**: Close button navigates back one level. Reset button is the only full-reset control. 3D modal unchanged. US3 is independently complete.

---

## Phase 6: User Story 4 — Snappy 2D Map Interactions (Priority: P4)

**Goal**: Verify that all 2D map interactions feel smooth and responsive after the CSS transition and mobile layout changes. This is primarily a verification and polish phase — the core performance improvement (scoped transitions) was already done in US1.

**Independent Test**: Click through all interactions (region select, office select, reset, map toggle) and confirm each completes smoothly without jank.

**Covers**: FR-014, FR-015, FR-016, FR-019, SC-004, SC-006, SC-007

### Implementation for User Story 4

- [ ] T022 [US4] Visually verify zoom animation quality: click each region in 2D mode, confirm viewBox animation is smooth with no frame drops, confirm ease-out cubic easing is preserved in `src/components/map-svg.ts` `animateViewBox()`
- [ ] T023 [US4] Visually verify mode toggle: switch from 2D to 3D and back, confirm transition completes within 2 seconds, confirm no resource leaks (check DevTools memory tab), confirm map is interactive immediately after toggle
- [ ] T024 [US4] Visually verify hover effects on desktop: hover over markers in 2D mode, confirm fill color animates smoothly to accent color, confirm drop-shadow enhancement animates smoothly, confirm these effects are identical to pre-change baseline

**Checkpoint**: All 2D interactions feel snappy and professional. No visual regressions. US4 is independently complete.

---

## Phase 7: User Story 5 — Fast Initial Load (Priority: P5)

**Goal**: Verify no regression in startup performance after all changes.

**Independent Test**: Load app with DevTools Performance tab open. Measure time-to-interactive. Compare against pre-change baseline.

**Covers**: FR-020, SC-008, SC-009

### Implementation for User Story 5

- [x] T025 [US5] Run full verification suite: `npm run verify` — confirm all lint, format, typecheck, and test checks pass
- [ ] T026 [US5] Measure time-to-interactive in Chrome DevTools Performance tab on desktop: load app, record timing, confirm no regression from baseline captured in T002
- [ ] T027 [US5] Verify config loading: open DevTools Network tab, load app with `?client=oddessentials`, confirm config files loaded once (no redundant requests), confirm branding applies correctly

**Checkpoint**: No load time regression. All automated checks pass. US5 is independently complete.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all user stories

- [ ] T028 Run `npm run verify` for final full-suite validation
- [ ] T029 Run quickstart.md verification checklist from `specs/008-perf-ux-polish/quickstart.md` — confirm all items checked
- [ ] T030 Visually verify 3D globe non-regression: load 3D mode, confirm auto-rotation smooth, markers visible, hover tooltip works, office modal opens/closes correctly, no visual changes from baseline
- [ ] T031 Test `prefers-reduced-motion`: enable reduced-motion in OS settings or Chrome DevTools, confirm all animations are suppressed, confirm app still functions correctly
- [ ] T032 Test orientation change on mobile: rotate device/emulator between portrait and landscape, confirm layout adapts without page reload

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (baseline verification)
- **US1 (Phase 3)**: Depends on Phase 2 — CSS + map-svg.ts changes
- **US2 (Phase 4)**: Depends on Phase 2 — CSS + map-svg.ts changes (different sections than US1, but same files)
- **US3 (Phase 5)**: Depends on Phase 2 — app.ts changes only (independent of US1/US2 file changes)
- **US4 (Phase 6)**: Depends on US1 (transition fix must be in place to verify snappiness)
- **US5 (Phase 7)**: Depends on all prior stories (measures final state)
- **Polish (Phase 8)**: Depends on all stories complete

### User Story Dependencies

- **US1 (P1)**: Independent — can start immediately after baseline
- **US2 (P2)**: Independent of US1 — touches same files (app.css, map-svg.ts) but different sections. Can run in parallel with US1 if changes are coordinated, or sequentially after US1 for safety
- **US3 (P3)**: Fully independent — only modifies app.ts. Can run in parallel with US1 and US2
- **US4 (P4)**: Depends on US1 (verifies the transition fix is effective)
- **US5 (P5)**: Depends on all stories (measures final regression state)

### Parallel Opportunities

**Within US1** (T003, T004, T005 can all run in parallel — different files/lines):

```
T003: app.css transition fix
T004: map-svg.ts addMarkers() opacity removal
T005: map-svg.ts ensureMarkersVisible() opacity removal
→ Then T006: visual verification
```

**Across stories** (US1 and US3 can run in full parallel — no file overlap):

```
Developer A: US1 (app.css + map-svg.ts)
Developer B: US3 (app.ts only)
→ Both complete → US4 verification
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (baseline)
2. Complete Phase 3: User Story 1 (marker opacity fix)
3. **STOP and VALIDATE**: Markers at full opacity, hover effects preserved
4. This alone delivers the most impactful improvement

### Incremental Delivery

1. US1: Marker opacity fix → immediate visual quality improvement
2. US3: Close button fix → immediate UX correctness improvement (can be done in parallel with US2)
3. US2: Mobile layout overhaul → most complex change, highest effort
4. US4: Interaction polish verification → confirms everything feels snappy
5. US5: Load time verification → confirms no regressions
6. Each story adds value without breaking previous stories

### Recommended Execution Order (Solo Developer)

1. T001-T002 (baseline)
2. T003-T006 (US1 — quick win, 15 min)
3. T015-T021 (US3 — focused app.ts change, 30 min)
4. T007-T014 (US2 — largest change, CSS + SVG, 1-2 hours)
5. T022-T024 (US4 — verification)
6. T025-T027 (US5 — final regression check)
7. T028-T032 (polish)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US1 is the MVP — fixing marker opacity alone delivers the highest-impact improvement
- US2 (mobile) is the most complex change — budget extra time for testing on real devices
- US3 (close button) is a surgical fix to one callback + one new method
- US4 and US5 are primarily verification phases, not implementation
- `src/components/map-3d.js` and `src/components/office-modal.js` must NOT be modified
- Commit after each user story checkpoint for safe rollback
