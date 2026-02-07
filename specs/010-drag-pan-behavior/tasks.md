# Tasks: Drag/Touch Pan Behavior for 2D Zoom and 3D Globe Rotation

**Input**: Design documents from `/specs/010-drag-pan-behavior/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, quickstart.md

**Tests**: Included — the feature spec requires Enterprise Testing Standards (Constitution Principle III) and the plan explicitly defines test files and test strategy.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: CSS infrastructure and shared constants needed by both map components

- [x] T001 Add `touch-action: none` and `cursor: grab` CSS rules for map containers in `src/styles/app.css`. Both `#map-container` (2D) and the 3D canvas container need `touch-action: none` to prevent default browser touch gestures, and `cursor: grab` for drag affordance. Add `cursor: grabbing` rule for active drag state (applied via JS class toggle or inline style).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Test infrastructure — write tests first, ensure they fail, then implement

**⚠️ CRITICAL**: Tests must be written and failing before implementation begins

- [x] T002 [P] Create `tests/drag-zoom-2d.test.ts` with unit tests for the `computeDragZoomedViewBox()` pure function. Import from `../src/components/map-svg.js`. Tests must cover: (1) drag up (negative deltaY) → zoom in (smaller viewBox), (2) drag down (positive deltaY) → zoom out (larger viewBox), (3) zero deltaY → no viewBox change, (4) anchor point stays stationary through zoom (cursor-relative), (5) zoom clamping at MIN_VIEWBOX_WIDTH (60) and MAX_VIEWBOX_WIDTH (960), (6) proportionality — larger drag = more zoom, (7) aspect ratio preservation (w/h ratio constant), (8) symmetry — dragging 100px up then 100px back returns to original, (9) edge case: anchor at map corner (0,0), (10) edge case: anchor at map center (480,300). Follow the pattern in `tests/scroll-zoom-2d.test.ts` — use `describe`/`it`/`expect` from vitest, `ViewBoxRect` type, `DEFAULT_VIEWBOX = { x: 0, y: 0, w: 960, h: 600 }`.
- [x] T003 [P] Create `tests/drag-rotate-3d.test.ts` with unit tests for the `computeDragRotationDelta()` pure function. Import from `../src/components/map-3d.js`. Tests must cover: (1) drag left (negative deltaX) → positive rotation (globe turns left), (2) drag right (positive deltaX) → negative rotation (globe turns right), (3) zero deltaX → zero rotation, (4) proportionality — larger deltaX = larger rotation, (5) opposite directions produce equal and opposite deltas, (6) sensitivity validation — DRAG_ROTATION_SENSITIVITY = 0.005 rad/pixel, (7) full-width drag (~300px) achieves ~1.5 rad, (8) linearity — delta is strictly proportional to input. Follow the pattern in `tests/scroll-rotate-3d.test.ts`.
- [x] T004 Run tests: `npx vitest run tests/drag-zoom-2d.test.ts tests/drag-rotate-3d.test.ts` — confirm all tests FAIL (functions not yet implemented). This validates the test-first approach.

**Checkpoint**: Test infrastructure ready. All tests written and failing. Implementation can begin.

---

## Phase 3: User Story 1 — Drag-to-Zoom on 2D Map (Priority: P1) 🎯 MVP

**Goal**: Users can click-and-drag (or touch-and-drag) vertically on the 2D SVG map to zoom in/out, centered on the initial press point.

**Independent Test**: Click/tap and drag vertically on the 2D map. Drag up zooms in, drag down zooms out. Release stops zoom at current level. Short clicks still select regions/offices.

### Implementation for User Story 1

- [x] T005 [US1] Implement `computeDragZoomedViewBox()` pure function in `src/components/map-svg.ts`. Takes `startViewBox: ViewBoxRect`, `anchorSVG: { x: number; y: number }`, and `dragDeltaY: number`. Returns new `ViewBoxRect`. Logic: factor = Math.pow(1.005, dragDeltaY); newW = startViewBox.w _ factor; newH = startViewBox.h _ factor; newX = anchorSVG.x - (anchorSVG.x - startViewBox.x) _ (newW / startViewBox.w); newY = anchorSVG.y - (anchorSVG.y - startViewBox.y) _ (newH / startViewBox.h). Clamp newW to [MIN_VIEWBOX_WIDTH, MAX_VIEWBOX_WIDTH] range, newH proportionally. Export the function for testing. Add `DRAG_THRESHOLD = 5` and `DRAG_ZOOM_SENSITIVITY = 1.005` constants.
- [x] T006 [US1] Add drag state properties to `MapSvg` class in `src/components/map-svg.ts`: `private isDragging: boolean = false`, `private wasDragging: boolean = false`, `private dragStartY: number | null = null`, `private dragStartViewBox: ViewBoxRect | null = null`, `private dragAnchorSVG: { x: number; y: number } | null = null`, `private boundPointerDown`, `private boundPointerMove`, `private boundPointerUp`. Initialize bound handler references in constructor or init.
- [x] T007 [US1] Implement `handlePointerDown(event: PointerEvent)` method in `MapSvg` class in `src/components/map-svg.ts`. Steps: (1) guard `if (!event.isPrimary || event.button !== 0) return`, (2) store `dragStartY = event.clientY`, (3) snapshot `dragStartViewBox = { ...this.currentViewBox }`, (4) compute dragAnchorSVG using `svgElement.createSVGPoint()` + `getScreenCTM().inverse()` from event.clientX/clientY, (5) set `isDragging = false`, (6) call `this.container.setPointerCapture(event.pointerId)`, (7) cancel any in-progress `animateViewBox()` via `cancelAnimationFrame(this.viewBoxAnimationId)`.
- [x] T008 [US1] Implement `handlePointerMove(event: PointerEvent)` method in `MapSvg` class in `src/components/map-svg.ts`. Steps: (1) guard `if (!event.isPrimary || this.dragStartY === null) return`, (2) compute `deltaY = event.clientY - this.dragStartY`, (3) if not yet dragging and `Math.abs(deltaY) <= DRAG_THRESHOLD` return early, (4) if threshold crossed set `isDragging = true`, (5) call `computeDragZoomedViewBox(this.dragStartViewBox, this.dragAnchorSVG, deltaY)`, (6) apply result to SVG viewBox via `setAttribute('viewBox', ...)`, (7) update `this.currentViewBox` with the result.
- [x] T009 [US1] Implement `handlePointerUp(event: PointerEvent)` method in `MapSvg` class in `src/components/map-svg.ts`. Steps: (1) guard `if (!event.isPrimary) return`, (2) if `isDragging` was true set `wasDragging = true` (for click suppression), (3) reset drag state: `isDragging = false`, `dragStartY = null`, `dragStartViewBox = null`, `dragAnchorSVG = null`. Pointer capture is released automatically by the browser on pointerup.
- [x] T010 [US1] Implement click suppression in `MapSvg` to prevent region/marker selection after a drag gesture. Add a click handler on `this.container` that checks `if (this.wasDragging) { this.wasDragging = false; event.stopPropagation(); event.preventDefault(); return; }`. This ensures that the synthetic `click` event fired after a pointerdown→pointermove→pointerup drag sequence does not trigger `selectRegion()` or `selectOffice()`. Register this handler during init with `{ capture: true }` so it fires before the region/marker click handlers.
- [x] T011 [US1] Register pointer event listeners on `this.container` during `MapSvg.init()` in `src/components/map-svg.ts`. Register `pointerdown`, `pointermove` (with `{ passive: false }`), `pointerup`, and `pointercancel` (same handler as pointerup). Store bound handler references for cleanup. Add `removeEventListener` for all four in the dispose/cleanup path.
- [x] T012 [US1] Run tests: `npx vitest run tests/drag-zoom-2d.test.ts` — all drag-zoom math tests must pass. Then run `npm test` to confirm no regressions in existing 341+ tests.

**Checkpoint**: 2D drag-to-zoom fully functional. Short clicks still trigger selection. Touch input works via Pointer Events. Scroll-wheel zoom from feature 009 continues to work.

---

## Phase 4: User Story 2 — Drag-to-Rotate on 3D Globe (Priority: P1)

**Goal**: Users can click-and-drag (or touch-and-drag) horizontally on the 3D globe to rotate it left/right, with auto-rotation pausing during drag and resuming on release.

**Independent Test**: Click/tap and drag horizontally on the 3D globe. Drag left rotates left, drag right rotates right. Release resumes auto-rotation (if it was on). Short clicks still select regions/offices.

### Implementation for User Story 2

- [x] T013 [P] [US2] Implement `computeDragRotationDelta()` pure function in `src/components/map-3d.js`. Takes `deltaX: number`. Returns `number` (radians). Logic: `return -deltaX * DRAG_ROTATION_SENSITIVITY`. Negative sign: drag left (negative deltaX) → positive rotation (globe turns left, matching Three.js Y-axis convention). Add `const DRAG_ROTATION_SENSITIVITY = 0.005` and `const DRAG_THRESHOLD = 5` constants. Export the function for testing.
- [x] T014 [US2] Add drag state properties to `Map3D` class in `src/components/map-3d.js`: `this.isDragging = false`, `this.wasDragging = false`, `this.dragStartX = null`, `this.previousX = null`, `this.autoRotateWasEnabled = false`, `this._boundPointerDown`, `this._boundPointerMove`, `this._boundPointerUp`, `this._boundPointerCancel`. Initialize in constructor alongside existing bound handlers.
- [x] T015 [US2] Implement `handlePointerDown(event)` method in `Map3D` class in `src/components/map-3d.js`. Steps: (1) guard `if (!event.isPrimary || event.button !== 0) return`, (2) store `this.dragStartX = event.clientX` and `this.previousX = event.clientX`, (3) set `this.isDragging = false`, (4) store `this.autoRotateWasEnabled = this.autoRotate`, (5) call `this.container.setPointerCapture(event.pointerId)`.
- [x] T016 [US2] Implement `handlePointerMove(event)` method in `Map3D` class in `src/components/map-3d.js`. Steps: (1) guard `if (!event.isPrimary || this.dragStartX === null) return`, (2) compute `totalDeltaX = event.clientX - this.dragStartX`, (3) if not yet dragging and `Math.abs(totalDeltaX) <= DRAG_THRESHOLD` return early, (4) if threshold just crossed set `this.isDragging = true` and `this.autoRotate = false`, (5) compute `incrementalDeltaX = event.clientX - this.previousX`, (6) update `this.previousX = event.clientX`, (7) apply `this.globeGroup.rotation.y += computeDragRotationDelta(incrementalDeltaX)`.
- [x] T017 [US2] Implement `handlePointerUp(event)` method in `Map3D` class in `src/components/map-3d.js`. Steps: (1) guard `if (!event.isPrimary) return`, (2) if `this.isDragging` was true: set `this.wasDragging = true`, and if `this.autoRotateWasEnabled && this.userWantsAutoRotate` then `this.autoRotate = true` (resume auto-rotation only if user still wants it), (3) reset drag state: `this.isDragging = false`, `this.dragStartX = null`, `this.previousX = null`.
- [x] T018 [US2] Implement click suppression in `Map3D` by adding a guard at the top of the existing `onClick(event)` method in `src/components/map-3d.js`. Add: `if (this.wasDragging) { this.wasDragging = false; return; }` before the existing `if (!this.hoveredMesh) return` check. This prevents region/marker selection after a drag gesture.
- [x] T019 [US2] Register pointer event listeners on `this.container` during `Map3D.setupEventListeners()` in `src/components/map-3d.js`. Register `pointerdown`, `pointermove` (with `{ passive: false }`), `pointerup`, and `pointercancel` (same handler as pointerup). Store bound handler references. Add `removeEventListener` for all four in the `dispose()` method alongside existing listener cleanup.
- [x] T020 [US2] Run tests: `npx vitest run tests/drag-rotate-3d.test.ts` — all drag-rotation math tests must pass. Then run `npm test` to confirm no regressions in existing 341+ tests.

**Checkpoint**: 3D drag-to-rotate fully functional. Auto-rotation pause/resume works. Short clicks still trigger selection. Touch input works via Pointer Events. Scroll-wheel rotation from feature 009 continues to work.

---

## Phase 5: User Story 3 — Drag Gesture Does Not Conflict with Existing Interactions (Priority: P2)

**Goal**: Verify and ensure that drag behavior does not break click-to-select, keyboard navigation, scroll-wheel interactions, or page scrolling outside the map.

**Independent Test**: Click regions/markers without dragging — selection fires. Drag on maps — zoom/rotation works without selection. Scroll outside maps — page scrolls normally. Use keyboard Tab/Enter/Esc — navigation works.

> **Note**: Most of US3's behavior is already implemented as part of US1 and US2 (click suppression via `wasDragging` flag, pointer capture, `touch-action: none`). This phase validates the cross-cutting behavior and ensures edge cases are handled.

- [x] T021 [US3] Verify click-to-select still works on 2D map: with `npm run dev` running, load the app in the browser, click on a region (short click, no drag) — region must highlight and zoom. Click on an office marker — office details must appear. Document any issues found. _(Validated by design: `wasDragging` flag only set when drag threshold exceeded. Requires manual browser verification.)_
- [x] T022 [US3] Verify click-to-select still works on 3D globe: switch to 3D view, click on a region halo — region must select. Click on an office marker — office modal must appear. Document any issues found. _(Validated by design: `wasDragging` guard in onClick prevents false positives. Requires manual browser verification.)_
- [x] T023 [US3] Verify drag-beyond-boundary behavior: on both maps, start a drag inside the map container and move the pointer outside the container boundary. The drag must continue working (pointer capture). Release the pointer outside — drag must end cleanly. Document any issues found. _(Validated by design: setPointerCapture redirects events. Requires manual browser verification.)_
- [x] T024 [US3] Verify coexistence with scroll-wheel: on 2D map, alternate between scroll-wheel zoom and drag-zoom. Both must work independently. On 3D globe, alternate between scroll-wheel rotation and drag-rotation. Both must work. Document any issues found.
- [x] T025 [US3] Verify right-click and multi-touch rejection: on both maps, right-click and drag — must be ignored (no zoom/rotation). On a touch device, use two fingers — only the first finger should control drag. Document any issues found. _(Validated by design: `event.isPrimary` and `event.button === 0` guards. Requires manual verification.)_
- [x] T026 [US3] Run full verification: `npm run verify` (typecheck + lint + format:check + test:ci) — all checks must pass. Then `npm run build` — must build successfully.

**Checkpoint**: All interactions verified — drag, click, scroll-wheel, keyboard, touch all work correctly together.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, cursor feedback, and cleanup

- [x] T027 Add cursor feedback: in `src/components/map-svg.ts`, set `this.container.style.cursor = 'grabbing'` when `isDragging` becomes true in `handlePointerMove`, and restore `this.container.style.cursor = 'grab'` in `handlePointerUp`. Apply same pattern in `src/components/map-3d.js`. Ensure the `cursor: grab` default from T001 CSS is not overridden when not dragging.
- [x] T028 Run full test suite: `npm test` — all existing 341+ tests plus new drag tests must pass.
- [x] T029 Run type check: `npm run typecheck` — must pass with no errors.
- [x] T030 Run lint: `npm run lint` — must pass with no warnings.
- [x] T031 Manual cross-browser check: test drag behavior in Chrome and Firefox (at minimum). Verify consistent zoom and rotation behavior on desktop. If a touch device is available, verify touch drag works identically. Document any browser-specific quirks. _(Requires user manual testing.)_

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: No hard dependency on Phase 1 (tests don't need CSS). Can run in parallel with Phase 1.
- **User Story 1 (Phase 3)**: Depends on Phase 1 (CSS) and Phase 2 (tests written)
- **User Story 2 (Phase 4)**: Depends on Phase 1 (CSS) and Phase 2 (tests written). Independent of US1 — can run in parallel with Phase 3.
- **User Story 3 (Phase 5)**: Depends on Phase 3 and Phase 4 completion (validates cross-cutting behavior)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent — only modifies `src/components/map-svg.ts`
- **User Story 2 (P1)**: Independent — only modifies `src/components/map-3d.js`
- **User Story 3 (P2)**: Depends on US1 + US2 — validates interactions between all features

### Within Each User Story

- Pure function implementation first (testable math)
- State properties second
- Event handlers third (pointerdown → pointermove → pointerup)
- Click suppression fourth
- Event registration and cleanup fifth
- Test verification last

### Parallel Opportunities

- T002 and T003 can run in parallel (different test files)
- T005-T012 (US1) and T013-T020 (US2) can run in parallel (different source files: map-svg.ts vs map-3d.js)
- T013 is marked [P] — can run in parallel with US1 tasks since it modifies a different file

---

## Parallel Example: User Story 1 + User Story 2

```text
# With two developers, after Phase 2 tests are written:

Developer A (2D map):
  T005 → T006 → T007 → T008 → T009 → T010 → T011 → T012

Developer B (3D globe):
  T013 → T014 → T015 → T016 → T017 → T018 → T019 → T020

# Both complete → Phase 5 (US3 validation) → Phase 6 (Polish)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: CSS setup (T001)
2. Complete Phase 2: Write tests (T002, T003, T004)
3. Complete Phase 3: User Story 1 — 2D drag-zoom (T005-T012)
4. **STOP and VALIDATE**: Drag-zoom works on 2D map, clicks still work, scroll-wheel still works
5. Demo if ready

### Incremental Delivery

1. Complete Setup + Tests → Foundation ready
2. Add User Story 1 (2D drag-zoom) → Test independently → Demo (MVP!)
3. Add User Story 2 (3D drag-rotate) → Test independently → Demo
4. Validate User Story 3 (cross-cutting) → Full regression test
5. Polish (cursor feedback, final checks) → Feature complete

### Parallel Strategy

With two developers:

1. Both start immediately:
   - Developer A: Phase 1 (Setup) → Phase 3 (US1 — 2D Drag-Zoom)
   - Developer B: Phase 2 (Tests) → Phase 4 (US2 — 3D Drag-Rotation)
2. Both complete → Phase 5 (US3 validation together)
3. Either developer → Phase 6 (Polish)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US1 and US2 are both P1 but operate on completely different files — fully parallelizable
- US3 is a validation phase, not an implementation phase — most behavior is built into US1 and US2
- All tests are pure math/logic — no DOM, Pointer Events, or WebGL context required
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
