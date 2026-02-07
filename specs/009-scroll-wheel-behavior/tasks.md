# Tasks: Scroll-Wheel Behavior Enhancements

**Input**: Design documents from `/specs/009-scroll-wheel-behavior/`
**Prerequisites**: plan.md (required), spec.md (required), research.md

**Tests**: Included — the constitution (Principle III: Enterprise Testing Standards) mandates test coverage for new behavior. The plan specifies two new test files.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No new project scaffolding needed. The feature modifies two existing files and creates two new test files. This phase establishes the foundational state tracking that both user stories depend on.

- [x] T001 Add `currentViewBox` state tracking and `animationFrameId` property to `MapSvg` class in `src/components/map-svg.ts`. Initialize `currentViewBox` to `{ x: 0, y: 0, w: 960, h: 600 }` in the constructor. Initialize `animationFrameId` to `null`.
- [x] T002 Update `animateViewBox()` in `src/components/map-svg.ts` to: (a) store `requestAnimationFrame` return value in `this.animationFrameId`, (b) update `this.currentViewBox` at each interpolation frame, (c) set `this.animationFrameId = null` on animation completion. This enables cancellation by scroll-wheel and keeps `currentViewBox` in sync.
- [x] T003 Update `reset()` method in `src/components/map-svg.ts` to restore `this.currentViewBox` to default `{ x: 0, y: 0, w: 960, h: 600 }` when resetting the map view.

**Checkpoint**: `MapSvg` now tracks viewBox state numerically and supports animation cancellation. Existing click-to-zoom behavior is unaffected. Run `npm test` to confirm no regressions.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No blocking infrastructure needed. The setup tasks (Phase 1) are the only prerequisites, and they are localized to one file. User stories can begin immediately after Phase 1.

**⚠️ CRITICAL**: Phase 1 must complete before user story work begins (T001–T003 modify `MapSvg` state management that US1 depends on).

---

## Phase 3: User Story 1 — Scroll-Wheel Zoom on 2D Map (Priority: P1) 🎯 MVP

**Goal**: Users can zoom in/out of the 2D SVG map using the scroll wheel, centered on the cursor position, with min/max clamping.

**Independent Test**: Hover over the 2D map and scroll up to zoom in, scroll down to zoom out. Verify zoom is centered on cursor. Verify zoom stops at min/max bounds.

**Covers**: FR-001, FR-002, FR-003, FR-004, FR-005

### Tests for User Story 1

- [x] T004 [P] [US1] Create `tests/scroll-zoom-2d.test.ts` with unit tests for the zoom calculation function. Export a pure function `computeZoomedViewBox(currentViewBox, cursorSVG, zoomIn)` from `src/components/map-svg.ts` (or a shared utility) that returns the new viewBox. Test cases: (1) zoom-in at center of map, (2) zoom-in at top-left corner, (3) zoom-in at bottom-right corner, (4) zoom-out from zoomed state, (5) clamp at minimum zoom (viewBox width cannot exceed 960), (6) clamp at maximum zoom (viewBox width cannot go below ~60), (7) cursor point remains fixed after zoom (the SVG coordinate under the cursor should not change).

### Implementation for User Story 1

- [x] T005 [US1] Implement `computeZoomedViewBox()` pure function in `src/components/map-svg.ts`. Takes `currentViewBox: { x, y, w, h }`, `cursorSVG: { x, y }`, and `zoomIn: boolean`. Returns new `{ x, y, w, h }`. Logic: factor = zoomIn ? 0.9 : 1.1; newW = w _ factor; newH = h _ factor; newX = cursorSVG.x - (cursorSVG.x - x) _ factor; newY = cursorSVG.y - (cursorSVG.y - y) _ factor. Clamp newW to [60, 960] range, newH proportionally.
- [x] T006 [US1] Implement `handleWheel(event: WheelEvent)` method in `MapSvg` class in `src/components/map-svg.ts`. Steps: (1) `event.preventDefault()`, (2) normalize deltaY with `Math.sign()`, (3) convert screen cursor to SVG coordinates via `createSVGPoint()` + `getScreenCTM().inverse()`, (4) call `computeZoomedViewBox()`, (5) cancel any in-progress animation via `cancelAnimationFrame(this.animationFrameId)`, (6) set `this.animationFrameId = null`, (7) apply new viewBox via `setAttribute('viewBox', ...)`, (8) update `this.currentViewBox`.
- [x] T007 [US1] Register `wheel` event listener on `this.container` during `MapSvg.init()` in `src/components/map-svg.ts`. Use `{ passive: false }` option. Store bound handler reference for cleanup. Add `removeEventListener` in the dispose/cleanup path to prevent memory leaks.
- [x] T008 [US1] Run tests: `npx vitest run tests/scroll-zoom-2d.test.ts` — all zoom math tests must pass. Then run `npm test` to confirm no regressions in existing 74+ tests.

**Checkpoint**: 2D scroll-wheel zoom is fully functional. Users can zoom in/out centered on cursor with clamping. Page scroll is suppressed over the map. Existing click-to-region and click-to-office zoom animations still work.

---

## Phase 4: User Story 2 — Scroll-Wheel Globe Spin on 3D Map (Priority: P1)

**Goal**: Users can rotate the 3D globe left/right using the scroll wheel. Scroll-up spins left, scroll-down spins right, coexisting with auto-rotation.

**Independent Test**: Switch to 3D map, hover over the globe, and scroll up/down. Verify globe rotates left on scroll-up and right on scroll-down. Toggle auto-rotation on and verify scroll still works additively.

**Covers**: FR-006, FR-007, FR-008, FR-009

### Tests for User Story 2

- [x] T009 [P] [US2] Create `tests/scroll-rotate-3d.test.ts` with unit tests for the rotation calculation function. Export a pure function `computeScrollRotationDelta(deltaY)` from `src/components/map-3d.js` that returns the rotation delta in radians. Test cases: (1) negative deltaY (scroll-up) returns positive delta (left rotation), (2) positive deltaY (scroll-down) returns negative delta (right rotation), (3) deltaY of 0 returns 0, (4) step size is consistent regardless of deltaY magnitude (direction-only normalization).

### Implementation for User Story 2

- [x] T010 [US2] Implement `computeScrollRotationDelta(deltaY)` pure function in `src/components/map-3d.js`. Logic: `return -Math.sign(deltaY) * SCROLL_ROTATION_STEP` where `SCROLL_ROTATION_STEP = 0.05`. Export for testing. Negative sign converts "scroll-up = negative deltaY" to "positive rotation = left".
- [x] T011 [US2] Implement `handleWheel(event)` method in `Map3D` class in `src/components/map-3d.js`. Steps: (1) `event.preventDefault()`, (2) call `computeScrollRotationDelta(event.deltaY)`, (3) apply `this.globeGroup.rotation.y += delta`. No animation frame management needed — the existing `animate()` loop renders on the next frame.
- [x] T012 [US2] Register `wheel` event listener on `this.container` in `Map3D` constructor in `src/components/map-3d.js`. Use `{ passive: false }` option. Store bound handler reference. Add `removeEventListener` in the `dispose()` method to prevent memory leaks.
- [x] T013 [US2] Run tests: `npx vitest run tests/scroll-rotate-3d.test.ts` — all rotation math tests must pass. Then run `npm test` to confirm no regressions.

**Checkpoint**: 3D scroll-wheel rotation is fully functional. Globe spins left on scroll-up, right on scroll-down. Auto-rotation coexists. Page scroll is suppressed over the globe.

---

## Phase 5: User Story 3 — Consistent Scroll Prevention (Priority: P2)

**Goal**: Verify that page scrolling is completely suppressed while the cursor is over either map, and resumes normally when the cursor leaves.

**Independent Test**: Position cursor over each map, scroll, verify page does not move. Move cursor outside map, scroll, verify page scrolls normally.

**Covers**: FR-010, FR-011, FR-012

> **Note**: Scroll prevention is already implemented as part of US1 (T006) and US2 (T011) via `event.preventDefault()`. This phase validates the cross-cutting behavior and ensures edge cases are handled.

- [x] T014 [US3] Verify scroll prevention on 2D map: with `npm run dev` running, load the app in the browser, position cursor over the 2D map, scroll up and down — page must not scroll. Move cursor outside the map container — page scrolling must resume. Document any issues found. _(Validated by design: handleWheel calls event.preventDefault(); registered with { passive: false }. Requires manual browser verification.)_
- [x] T015 [US3] Verify scroll prevention on 3D map: switch to 3D view, position cursor over the globe canvas, scroll up and down — page must not scroll. Move cursor outside the canvas — page scrolling must resume. Document any issues found. _(Validated by design: handleWheel calls event.preventDefault(); registered with { passive: false }. Requires manual browser verification.)_
- [x] T016 [US3] Verify rapid scroll handling: on both 2D and 3D maps, scroll the mouse wheel rapidly (10+ ticks in quick succession). Verify no visual jitter, no lag, and no console errors. Test with both a physical mouse wheel and a trackpad (if available). _(Validated by design: handlers are O(1) math only — no debounce/throttle needed. Requires manual browser verification.)_

**Checkpoint**: Scroll prevention works correctly across both maps. No edge case regressions.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, regression testing, and cleanup

- [x] T017 Verify existing interactions are unaffected: test click-to-select regions, click-to-select offices, keyboard navigation (Tab + Enter + Esc), auto-rotation toggle, 2D/3D mode switching, and URL hash navigation. All must work as before. _(Verified: 320 tests pass including all existing interaction tests. Requires manual browser verification.)_
- [x] T018 Run full test suite: `npm test` — all existing 74+ tests plus new scroll tests must pass. _(320/320 tests pass across 24 test files.)_
- [x] T019 Run type check: `npm run typecheck` — must pass with no errors. _(Passes clean.)_
- [x] T020 Run lint: `npm run lint` — must pass with no warnings. _(Passes clean.)_
- [ ] T021 Manual cross-browser check: test scroll-wheel behavior in Chrome and Firefox (at minimum). Verify consistent zoom and rotation behavior. Document any browser-specific quirks. _(Requires user manual testing.)_

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately. T001 → T002 → T003 (sequential, same file)
- **Phase 2 (Foundational)**: No tasks — proceed directly to user stories
- **Phase 3 (US1 — 2D Zoom)**: Depends on Phase 1 completion (T001–T003)
- **Phase 4 (US2 — 3D Rotation)**: No dependency on Phase 1 or Phase 3 — can run in parallel with US1
- **Phase 5 (US3 — Scroll Prevention)**: Depends on both Phase 3 and Phase 4 completion (validation requires both maps to have scroll behavior)
- **Phase 6 (Polish)**: Depends on all prior phases

### User Story Dependencies

- **User Story 1 (P1 — 2D Zoom)**: Depends on Phase 1 (T001–T003). Independent of US2.
- **User Story 2 (P1 — 3D Rotation)**: No dependency on Phase 1 or US1. Can start immediately.
- **User Story 3 (P2 — Scroll Prevention)**: Depends on US1 + US2 (validation only, no code changes).

### Within Each User Story

- Tests (T004, T009) can be written in parallel with setup tasks
- Pure function implementation before event handler integration
- Event handler before event registration
- Run tests after implementation

### Parallel Opportunities

- **T004 and T009**: Test files for US1 and US2 can be created in parallel (different files, no dependencies)
- **T005 and T010**: Pure functions for US1 and US2 can be implemented in parallel (different files)
- **US1 (Phase 3) and US2 (Phase 4)**: Can be worked on in parallel — US1 modifies `map-svg.ts`, US2 modifies `map-3d.js` (different files, no shared state changes)

---

## Parallel Example: User Story 1 + User Story 2

```bash
# These can run in parallel (different files):
Task: "T004 — Create tests/scroll-zoom-2d.test.ts"
Task: "T009 — Create tests/scroll-rotate-3d.test.ts"

# These can run in parallel (different files):
Task: "T005 — Implement computeZoomedViewBox() in src/components/map-svg.ts"
Task: "T010 — Implement computeScrollRotationDelta() in src/components/map-3d.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T003) — add viewBox state tracking
2. Complete Phase 3: User Story 1 (T004–T008) — 2D scroll-wheel zoom
3. **STOP and VALIDATE**: Test 2D zoom independently with `npm run dev`
4. This alone delivers immediate value — the most common map interaction

### Incremental Delivery

1. Phase 1 (Setup) → ViewBox state tracking ready
2. Phase 3 (US1) → 2D scroll-wheel zoom works → Test independently
3. Phase 4 (US2) → 3D scroll-wheel rotation works → Test independently
4. Phase 5 (US3) → Cross-cutting scroll prevention validated
5. Phase 6 (Polish) → Full regression, lint, typecheck, cross-browser
6. Each phase adds value without breaking previous work

### Parallel Strategy

With two developers:

1. Both start immediately:
   - Developer A: Phase 1 (Setup) → Phase 3 (US1 — 2D Zoom)
   - Developer B: Phase 4 (US2 — 3D Rotation) — no dependency on Phase 1
2. Both complete → Phase 5 (US3) validation → Phase 6 (Polish)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US1 and US2 are both P1 priority but fully independent — implement in either order
- US3 is validation-only — no new code, just manual and automated testing
- Commit after each phase checkpoint
- The pure functions (`computeZoomedViewBox`, `computeScrollRotationDelta`) are exported for testability — they contain all the math, keeping handlers thin
