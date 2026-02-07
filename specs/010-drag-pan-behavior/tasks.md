# Tasks: Drag Pan & Rotate Behavior

**Input**: Design documents from `/specs/010-drag-pan-behavior/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, quickstart.md

**Tests**: Included — Enterprise Testing Standards (Constitution Principle III) require test coverage for new math functions. Plan defines explicit test strategy.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Remove obsolete drag-zoom code and prepare for new drag-pan implementation

- [x] T001 Remove the `computeDragZoomedViewBox()` export function and the `DRAG_ZOOM_SENSITIVITY` constant from `src/components/map-svg.ts`. These are being replaced by the new `computeDragPannedViewBox()` function. Keep `computeZoomedViewBox()` (scroll-wheel zoom) and all other exports intact.
- [x] T002 Delete the obsolete test file `tests/drag-zoom-2d.test.ts`. This file tests the removed `computeDragZoomedViewBox()` function. It will be replaced by `tests/drag-pan-2d.test.ts` in Phase 3.

**Checkpoint**: Obsolete drag-zoom code removed. Existing scroll-wheel zoom and drag-rotate code untouched.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement the new pure math function for 2D pan — this is the core building block for User Story 1

**⚠️ CRITICAL**: The pure function must be implemented and tested before handler integration

- [x] T003 Implement `computeDragPannedViewBox()` pure function in `src/components/map-svg.ts`. Signature: `export function computeDragPannedViewBox(startViewBox: ViewBoxRect, screenDelta: { dx: number; dy: number }, containerSize: { width: number; height: number }): ViewBoxRect`. Algorithm: (1) Convert screen delta to SVG delta: `svgDeltaX = screenDelta.dx * (startViewBox.w / containerSize.width)`, `svgDeltaY = screenDelta.dy * (startViewBox.h / containerSize.height)`. (2) Translate origin: `newX = startViewBox.x - svgDeltaX`, `newY = startViewBox.y - svgDeltaY`. (3) Clamp: `newX = Math.max(0, Math.min(MAP_WIDTH - startViewBox.w, newX))`, `newY = Math.max(0, Math.min(MAP_HEIGHT - startViewBox.h, newY))`. (4) Return `{ x: newX, y: newY, w: startViewBox.w, h: startViewBox.h }`. Width and height are unchanged — pan does not zoom.
- [x] T004 Create `tests/drag-pan-2d.test.ts` with unit tests for `computeDragPannedViewBox()`. Import from `../src/components/map-svg.js`. Tests must cover: (1) dragging left (negative dx) moves viewBox origin right, (2) dragging right (positive dx) moves viewBox origin left, (3) dragging up (negative dy) moves viewBox origin down, (4) dragging down (positive dy) moves viewBox origin up, (5) zero delta produces no change, (6) pan amount is proportional to drag distance, (7) pan scales with zoom level — smaller viewBox = less SVG movement per pixel, (8) diagonal drag moves both x and y, (9) clamping: x cannot go below 0, (10) clamping: x cannot exceed MAP_WIDTH - viewBox.w, (11) clamping: y cannot go below 0, (12) clamping: y cannot exceed MAP_HEIGHT - viewBox.h, (13) fully zoomed out (viewBox.w === 960, viewBox.h === 600): pan has no effect — clamped to (0,0), (14) width and height are never modified by pan, (15) reversibility: dragging left then right same amount returns to start. Use constants `MAP_WIDTH = 960`, `MAP_HEIGHT = 600`, `DEFAULT_VIEWBOX = { x: 0, y: 0, w: 960, h: 600 }`. Follow existing test patterns from `tests/scroll-zoom-2d.test.ts`.
- [x] T005 Run tests: `npx vitest run tests/drag-pan-2d.test.ts` — all pan math tests must pass. Then run `npm test` to confirm no regressions.

**Checkpoint**: Pure pan function implemented and tested. Foundation ready for handler integration.

---

## Phase 3: User Story 1 — Drag to Pan the 2D Map (Priority: P1) 🎯 MVP

**Goal**: Replace drag-to-zoom with drag-to-pan on the 2D SVG map. Users can press and drag in any direction to slide the visible map area, Google Maps-style.

**Independent Test**: Zoom into the 2D map via scroll wheel, then press and drag in any direction. The map slides with the cursor. Drag to map edge — pan stops at boundary. Release — map stays at panned position. Short click on region — still selects.

### Implementation for User Story 1

- [x] T006 [US1] Update drag state properties in the `MapSvg` class in `src/components/map-svg.ts`. Remove: `private dragStartY: number | null = null` and `private dragAnchorSVG: { x: number; y: number } | null = null`. Add: `private dragStartScreenPos: { x: number; y: number } | null = null`. Keep: `isDragging`, `wasDragging`, `dragStartViewBox`, and all bound handler references.
- [x] T007 [US1] Rewrite `handlePointerDown(event: PointerEvent)` in `MapSvg` class in `src/components/map-svg.ts`. Steps: (1) guard `if (!event.isPrimary || event.button !== 0) return`, (2) store `this.dragStartScreenPos = { x: event.clientX, y: event.clientY }`, (3) snapshot `this.dragStartViewBox = { ...this.currentViewBox }`, (4) set `this.isDragging = false`, (5) call `this.container.setPointerCapture(event.pointerId)`, (6) cancel any in-progress viewBox animation. Remove the SVG anchor point computation (no longer needed for pan).
- [x] T008 [US1] Rewrite `handlePointerMove(event: PointerEvent)` in `MapSvg` class in `src/components/map-svg.ts`. Steps: (1) guard `if (!event.isPrimary || this.dragStartScreenPos === null) return`, (2) guard `if (!this.dragStartViewBox) return`, (3) compute `deltaX = event.clientX - this.dragStartScreenPos.x` and `deltaY = event.clientY - this.dragStartScreenPos.y`, (4) threshold check: `if (!this.isDragging && Math.hypot(deltaX, deltaY) <= DRAG_THRESHOLD) return`, (5) if not yet dragging: set `this.isDragging = true` and `this.container.style.cursor = 'grabbing'`, (6) compute: `const newViewBox = computeDragPannedViewBox(this.dragStartViewBox, { dx: deltaX, dy: deltaY }, { width: this.container.clientWidth, height: this.container.clientHeight })`, (7) apply: `this.currentViewBox = newViewBox` and `this.svgElement.setAttribute('viewBox', ...)`.
- [x] T009 [US1] Update `handlePointerUp(event: PointerEvent)` in `MapSvg` class in `src/components/map-svg.ts`. Steps: (1) guard `if (!event.isPrimary) return`, (2) if `this.isDragging` was true: set `this.wasDragging = true`, (3) reset: `this.isDragging = false`, `this.dragStartScreenPos = null`, `this.dragStartViewBox = null`, `this.container.style.cursor = 'grab'`.
- [x] T010 [US1] Update the comment on line 30-32 of `src/components/map-svg.ts` to change "Drag-zoom constants" to "Drag-pan constants" and remove any reference to `DRAG_ZOOM_SENSITIVITY`. Update the comment on line 125 referencing "Drag-zoom state" to "Drag-pan state".
- [x] T011 [US1] Run tests: `npx vitest run tests/drag-pan-2d.test.ts` — all tests must pass. Then run `npm test` to confirm no regressions across the full suite.

**Checkpoint**: 2D drag-to-pan fully functional. Scroll-wheel zoom still works. Short clicks still select regions/offices. No drag-to-zoom behavior remains.

---

## Phase 4: User Story 2 — Drag to Rotate the 3D Globe Horizontally (Priority: P1)

**Goal**: Ensure the 3D globe drag-rotate responds only to horizontal drag movement. Vertical drag is ignored for rotation but still activates drag mode for click suppression.

**Independent Test**: Press and drag left/right on the 3D globe — globe rotates horizontally. Drag up/down — globe does NOT rotate. Drag diagonally — only horizontal component causes rotation. Short click still selects.

### Implementation for User Story 2

- [x] T012 [US2] Add `dragStartY` property to the `Map3D` class constructor in `src/components/map-3d.js`. Add `this.dragStartY = null` alongside the existing `this.dragStartX = null`.
- [x] T013 [US2] Update `handlePointerDown(event)` in `Map3D` class in `src/components/map-3d.js`. Add: `this.dragStartY = event.clientY` alongside the existing `this.dragStartX = event.clientX` assignment (line 589).
- [x] T014 [US2] Update `handlePointerMove(event)` in `Map3D` class in `src/components/map-3d.js`. Change the threshold check from `if (!this.isDragging && Math.abs(totalDeltaX) <= DRAG_THRESHOLD) return` to: compute `const totalDeltaY = event.clientY - this.dragStartY` then `if (!this.isDragging && Math.hypot(totalDeltaX, totalDeltaY) <= DRAG_THRESHOLD) return`. Keep the rotation computation unchanged — only the horizontal `incrementalDeltaX` is used for `computeDragRotationDelta()`.
- [x] T015 [US2] Update `handlePointerUp(event)` in `Map3D` class in `src/components/map-3d.js`. Add cleanup: `this.dragStartY = null` alongside the existing `this.dragStartX = null` reset (line 632).
- [x] T016 [US2] Add a named test to `tests/drag-rotate-3d.test.ts` confirming vertical-only drag produces zero rotation. Add test: `it('vertical-only drag (deltaX = 0) produces zero rotation — globe does not respond to vertical movement', () => { expect(computeDragRotationDelta(0)).toBe(0); })`. This makes the horizontal-only behavior explicitly tested with a descriptive name.
- [x] T017 [US2] Run tests: `npx vitest run tests/drag-rotate-3d.test.ts` — all tests must pass including the new vertical-drag test. Then run `npm test` to confirm no regressions.

**Checkpoint**: 3D globe drag-rotate confirmed horizontal-only. Vertical drags activate drag mode but produce zero rotation. Auto-rotation pause/resume still works. Scroll-wheel rotation still works.

---

## Phase 5: User Story 3 + User Story 4 — Click Suppression & Drag-Zoom Removal Validation (Priority: P2)

**Goal**: Validate that drag gestures don't trigger click actions (US3) and that no drag-to-zoom behavior remains on the 2D map (US4). Both stories are validated together since they are cross-cutting.

**Independent Test**: Press on a region, drag past threshold, release — region is NOT selected. Short click on same region — region IS selected. Drag vertically on 2D map — map pans, does NOT zoom. Scroll wheel — still zooms.

- [x] T018 [US3] Verify click suppression on 2D map: with `npm run dev` running, zoom into the 2D map (scroll wheel), click a region with a short click — must select. Then drag past 5px on the same region — must NOT select on release. Confirm `wasDragging` flag and capture-phase click handler are working correctly.
- [x] T019 [US3] Verify click suppression on 3D globe: switch to 3D view, click a region halo with a short click — must select. Then drag horizontally past 5px on a halo — must NOT select on release. Drag vertically past 5px on a halo — must NOT select on release (hypot threshold catches vertical drags).
- [x] T020 [US4] Verify drag-to-zoom is fully removed: on the 2D map, press and drag vertically — the map must pan vertically, NOT zoom in or out. Confirm the viewBox width/height do not change during any drag gesture. Only the scroll wheel should zoom.
- [x] T021 [US4] Verify scroll-wheel zoom still works: on the 2D map, scroll up — must zoom in. Scroll down — must zoom out. Zoom is cursor-relative. Pan after zooming — pan works within zoomed boundaries.
- [x] T022 Run full verification: `npm test` — all tests pass. `npm run lint` — no warnings. `npm run typecheck` — no errors. `npm run build` — builds successfully.

**Checkpoint**: All behaviors verified. Click suppression works. Drag-to-zoom fully removed. All existing interactions intact.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup and cross-browser validation

- [x] T023 [P] Review and clean up any remaining comments in `src/components/map-svg.ts` that reference "drag-zoom" or "zoom" in the context of drag behavior. Update to reference "drag-pan" or "pan" as appropriate. Do not change comments about scroll-wheel zoom.
- [x] T024 [P] Review and clean up any remaining comments in `src/components/map-3d.js` that reference drag behavior. Ensure comments accurately describe horizontal-only rotation.
- [ ] T025 Manual cross-browser check: test drag-pan on 2D and drag-rotate on 3D in Chrome and Firefox (at minimum). Verify: (1) pan follows cursor 1:1 at various zoom levels, (2) pan stops at boundaries, (3) globe rotates only horizontally, (4) touch input works on a mobile device (if available). Document any browser-specific quirks.
- [x] T026 Run final full suite: `npm test && npm run lint && npm run typecheck && npm run build` — all must pass cleanly.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: No hard dependency on Phase 1. Can run in parallel with Phase 1.
- **User Story 1 (Phase 3)**: Depends on Phase 1 (drag-zoom removed) and Phase 2 (pan function implemented)
- **User Story 2 (Phase 4)**: Depends only on Phase 2 completion. Independent of US1 — can run in parallel with Phase 3.
- **User Story 3+4 (Phase 5)**: Depends on Phase 3 and Phase 4 completion (validates cross-cutting behavior)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent — only modifies `src/components/map-svg.ts`
- **User Story 2 (P1)**: Independent — only modifies `src/components/map-3d.js` and `tests/drag-rotate-3d.test.ts`
- **User Story 3 (P2)**: Depends on US1 + US2 — validates click suppression across both maps
- **User Story 4 (P2)**: Depends on US1 — validates drag-zoom removal

### Within Each User Story

- State property changes first
- Event handler rewrites second (pointerdown → pointermove → pointerup)
- Comment cleanup third
- Test verification last

### Parallel Opportunities

- T001 and T002 can run in parallel (different files)
- T003 and T004 can run in parallel (source file vs test file)
- Phase 3 (US1) and Phase 4 (US2) can run in parallel (map-svg.ts vs map-3d.js — completely different files)
- T023 and T024 can run in parallel (different files)

---

## Parallel Example: User Story 1 + User Story 2

```text
# After Phase 2 foundation is complete:

Developer A (2D map — src/components/map-svg.ts):
  T006 → T007 → T008 → T009 → T010 → T011

Developer B (3D globe — src/components/map-3d.js):
  T012 → T013 → T014 → T015 → T016 → T017

# Both complete → Phase 5 (validation) → Phase 6 (polish)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Remove drag-zoom code (T001, T002)
2. Complete Phase 2: Implement and test pan function (T003, T004, T005)
3. Complete Phase 3: User Story 1 — 2D drag-to-pan (T006-T011)
4. **STOP and VALIDATE**: Pan works on 2D map, scroll-wheel zoom still works, clicks still work
5. Demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (2D drag-to-pan) → Test independently → Demo (MVP!)
3. Add User Story 2 (3D horizontal drag-rotate) → Test independently → Demo
4. Validate User Story 3+4 (cross-cutting) → Full regression test
5. Polish (comments, cross-browser) → Feature complete

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US1 and US2 are both P1 and operate on completely different files — fully parallelizable
- US3 and US4 are validation phases, not implementation phases — behavior is built into US1 and US2
- All unit tests are pure math/logic — no DOM, Pointer Events, or WebGL context required
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
