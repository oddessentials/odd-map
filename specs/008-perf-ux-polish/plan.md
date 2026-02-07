# Implementation Plan: Map Performance & UX Polish

**Branch**: `008-perf-ux-polish` | **Date**: 2026-02-06 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/008-perf-ux-polish/spec.md`

## Summary

Fix three distinct UX problems — 2D marker translucency caused by `transition: all`, broken close button behavior that resets the entire app, and a mobile layout that is unusable on iPhone Pro — while preserving all existing visual effects at their current quality level. No changes to 3D globe rendering.

## Technical Context

**Language/Version**: TypeScript 5.7 (ES2022), JavaScript (map-3d.js), CSS3
**Primary Dependencies**: Three.js 0.182, Vite 7.3.1, Zod 4.3.5
**Storage**: N/A — static JSON configuration files
**Testing**: Vitest 4.0.17 (unit + integration)
**Target Platform**: Desktop browsers (Chrome, Firefox, Safari, Edge) + Mobile Safari (iPhone Pro), Mobile Chrome
**Project Type**: Single static web application
**Performance Goals**: 60fps animations on standard hardware, instant marker state changes, smooth viewBox transitions
**Constraints**: No runtime API calls, static delivery only, must respect `prefers-reduced-motion`
**Scale/Scope**: 20-50 office markers per client, 5-6 regions, ~1,154 lines CSS + ~500 lines TS/JS per component

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status | Notes                                                                                                                                       |
| ------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Deterministic Data Pipeline       | PASS   | No data pipeline changes                                                                                                                    |
| II. Build-Time Coordinate Resolution | PASS   | No coordinate changes                                                                                                                       |
| III. Enterprise Testing Standards    | PASS   | Existing tests must pass; add tests for close button behavior                                                                               |
| IV. Performance Budgets              | PASS   | No new draw calls, no post-processing, CSS-only marker fix                                                                                  |
| V. Accessibility First               | PASS   | Close button fix improves accessibility (predictable behavior); mobile fix improves touch accessibility; `prefers-reduced-motion` preserved |
| VI. Zero Runtime Backend             | PASS   | No runtime API calls added                                                                                                                  |

| Invariant                              | Status | Notes                                                         |
| -------------------------------------- | ------ | ------------------------------------------------------------- |
| #4 Single Marker State Update Function | PASS   | `computeMarkerStates()` unchanged                             |
| #5 Shared Application State            | PASS   | State machine enhanced (new transition), not broken           |
| #6 Three Mandatory UI Modes            | PASS   | USA_VIEW, REGION_VIEW, LOCATION_VIEW preserved                |
| #7 Modal Accessibility                 | PASS   | Modal close behavior already correct; panel close being fixed |
| #9 Region-First Interaction            | PASS   | Region list navigation improved on mobile                     |
| #13 Progressive Enhancement            | PASS   | Mobile layout is progressive enhancement of base HTML         |

**Post-Phase 1 Re-check**: All gates still pass. No new storage, no new dependencies, no architectural changes.

## Project Structure

### Documentation (this feature)

```text
specs/008-perf-ux-polish/
├── plan.md              # This file
├── research.md          # Phase 0 output (completed)
├── data-model.md        # Phase 1 output (N/A — no data model changes)
├── quickstart.md        # Phase 1 output
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (files modified by this feature)

```text
src/
├── styles/
│   └── app.css              # Marker transition fix, mobile layout overhaul
├── components/
│   ├── map-svg.ts           # Remove inline opacity assignments
│   └── details-panel.js     # (unchanged — behavior driven by app.ts callback)
├── app.ts                   # New handlePanelClose() method, onClose callback fix
└── index.html               # Viewport meta refinement (if needed)

tests/
└── close-button.test.ts     # New: panel close behavior tests
```

**Structure Decision**: Single project — all changes are within the existing `src/` and `tests/` directories. No new directories or modules created.

## Design Decisions

### D1: Marker Opacity Fix — Scope CSS Transitions

**Change**: Replace `transition: all 0.2s ease` on `.marker` with explicit property list.

**Before** (app.css:875):

```css
.marker {
  transition: all 0.2s ease;
}
```

**After**:

```css
.marker {
  transition:
    fill 0.2s ease,
    filter 0.2s ease,
    stroke-width 0.2s ease;
}
```

**Why**: `transition: all` animates opacity when `.marker--dimmed` is toggled, creating a 200ms fade that makes markers appear sluggish. Listing only the properties that should animate (fill for hover color, filter for drop-shadow, stroke-width for selected state) makes opacity changes instant while preserving all existing hover and selection effects at their current quality.

**Effects preserved**:

- Hover: fill color change (primary → accent) — still animated 0.2s
- Hover: drop-shadow enhancement — still animated 0.2s
- Selected: stroke-width increase — still animated 0.2s
- Dimmed: opacity reduction — now instant (correct behavior)
- Un-dimmed: opacity restoration — now instant (correct behavior)

**Also**: Remove `markerGroup.style.opacity = '1'` in `map-svg.ts:192-193` (`addMarkers()`) and `map-svg.ts:372` (`ensureMarkersVisible()`). These inline opacity assignments on the parent group are unnecessary now that opacity is controlled exclusively via CSS classes on the `.marker` element. Removing them eliminates potential inheritance conflicts.

### D2: Close Button — Back-One-Level Navigation

**Change**: Replace `handleReset()` callback with new `handlePanelClose()` method.

**Before** (app.ts:176):

```typescript
this.panel = new DetailsPanel(this.panelContainer, {
  onClose: () => this.handleReset(),
});
```

**After**:

```typescript
this.panel = new DetailsPanel(this.panelContainer, {
  onClose: () => this.handlePanelClose(),
});
```

**New method**:

```typescript
private handlePanelClose(): void {
  if (this.state === States.LOCATION_VIEW && this.selectedRegion) {
    this.handleRegionClick(this.selectedRegion.name);
  } else if (this.state === States.REGION_VIEW) {
    this.handleReset();
  }
}
```

**Why**: This matches the Escape key behavior already in `app.ts:465-478` — back one level in the state hierarchy. LOCATION_VIEW → REGION_VIEW → USA_VIEW. The close button semantically means "dismiss this content" which is equivalent to "go back one level."

**State machine transitions after fix**:

```
USA_VIEW ──(click region)──→ REGION_VIEW ──(click office)──→ LOCATION_VIEW
   ↑                              ↑                              |
   |                              └──── panel close / Escape ────┘
   └──────────── panel close / Escape / reset button ────────────┘
```

**3D globe impact**: None. The office modal close behavior (`office-modal.js`) is already correct — it only dismisses the modal DOM without calling back to app.ts. No changes needed.

### D3: Mobile Layout Overhaul

**Change**: Restructure the 768px responsive breakpoint for a mobile-first map experience.

**Key changes to app.css `@media (max-width: 768px)`**:

1. **Map-first vertical layout**: Map section uses `flex: 1` to fill available space instead of `min-height: 400px`. The map should be the hero element on mobile.

2. **Region list as compact inline navigation**: Instead of a full sidebar below the map, the region list becomes a single-row strip of compact chip/pill buttons positioned between the header and the map. With 5-6 regions, all chips fit within a 375px+ viewport without scrolling. If a client has more regions than can fit, chips wrap to a second row rather than requiring horizontal scroll. This satisfies FR-008 (no horizontal scrolling) while keeping all regions visible and tappable without scrolling past the map.

3. **Touch-optimized map container**: Add `touch-action: manipulation` on the map container to prevent double-tap zoom delay and conflicts with the viewBox-based zoom. This is the standard approach for custom-zoomed content on touch devices.

4. **Bottom sheet refinements**: Reduce `max-height` from `50vh` to `40vh` on smaller screens to leave more of the map visible. Ensure panel content is scrollable with `overflow-y: auto` and `-webkit-overflow-scrolling: touch` for smooth momentum scrolling on iOS.

5. **Header compactness**: Reduce mobile header height from 56px to 48px. Hide non-essential elements (e.g., tagline) on viewports below 768px. Keep breadcrumb and reset button visible — these are the primary navigation controls on mobile.

6. **Touch target sizing**: Add an invisible `<circle>` hit area element to each marker group in `map-svg.ts` with a radius large enough to meet the 44×44 CSS pixel minimum at the zoomed-in region view. The circle receives pointer events but is fully transparent (`fill: transparent; stroke: none; pointer-events: all`). This is the standard SVG technique for expanding click/tap targets without changing visual appearance.

7. **Viewport meta**: The existing `<meta name="viewport" content="width=device-width, initial-scale=1.0">` is correct. No changes needed — the viewport tag already allows user zoom and sets proper device width.

8. **Orientation change**: The CSS grid/flex layout naturally reflows on viewport resize. No explicit orientation change handler is needed — the `resize` event already triggers `requestAnimationFrame` in the SVG map, and CSS media queries re-evaluate automatically.

**Layout on mobile after fix**:

```
┌──────────────────────────────┐
│ Header (compact, 48px)       │
├──────────────────────────────┤
│ Region chips (wrap if needed)│
├──────────────────────────────┤
│                              │
│         SVG Map              │
│      (fills remaining)       │
│                              │
├──────────────────────────────┤
│ Bottom sheet (details panel) │
│ (slides up when active, 40vh)│
└──────────────────────────────┘
```

**Effects preserved**: All desktop visual effects remain unchanged. Mobile adaptations only add/reorganize layout — no effects are removed or simplified.

**Edge cases addressed**:

- **Rapid region tapping**: The existing `animateViewBox()` in `map-svg.ts` does not queue animations — each call overwrites the current animation target. Rapid taps simply redirect the in-progress animation to the new target, which is the correct behavior. No additional queuing logic needed.
- **Marker overlap on mobile**: At the USA overview zoom level, some markers may overlap. Tapping a region zooms in to separate them. At region zoom level, markers should be individually tappable with the expanded hit areas (point 6). If markers still overlap at region zoom, this is a data/coordinate issue, not a layout issue — out of scope for this feature.

### D4: 3D Globe — No Changes

The 3D globe component (`map-3d.js`) and office modal (`office-modal.js`) receive zero rendering, animation, or interaction changes. The only 3D-adjacent impact is the `handlePanelClose()` fix in `app.ts`, which does not affect the modal or globe in any way.

### D5: Resource Cleanup & Mode Toggle (FR-019, SC-006)

**Status**: Already implemented correctly — no changes needed.

The existing `initMap()` method in `app.ts:215-249` already handles resource cleanup:

1. Calls `this.map?.dispose()` on the current map before creating a new one
2. Clears the map container DOM
3. The 3D map's `dispose()` method (`map-3d.js:873-940`) cleans up geometries, materials, event listeners, WebGL resources, and cancels animation frames
4. The 2D map's `dispose()` method removes event listeners and clears SVG references

Mode toggle is gated by a 500ms debounce (`TOGGLE_DEBOUNCE_MS`) to prevent accidental double-clicks. The toggle already completes well within the 2-second SC-006 target on standard hardware.

**Action**: Verify during implementation that no changes in this feature regress toggle timing. No code changes needed.

## File Change Summary

| File                         | Change Type | Description                                                                                                                                                                                 |
| ---------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/styles/app.css`         | MODIFY      | Scope `.marker` transition to explicit properties; overhaul mobile `@media (max-width: 768px)` rules; add `touch-action: manipulation` to map container; region list chip layout for mobile |
| `src/components/map-svg.ts`  | MODIFY      | Remove inline `style.opacity` assignments in `addMarkers()` and `ensureMarkersVisible()`; add transparent `<circle>` hit area to each marker group for touch targets                        |
| `src/app.ts`                 | MODIFY      | Add `handlePanelClose()` method; change `onClose` callback from `handleReset()` to `handlePanelClose()`                                                                                     |
| `tests/close-button.test.ts` | CREATE      | Unit tests for panel close behavior (state transitions)                                                                                                                                     |

**Files NOT changed**:

- `src/components/map-3d.js` — no rendering/animation/interaction changes
- `src/components/office-modal.js` — close behavior already correct
- `src/components/details-panel.js` — behavior driven by callback, no internal changes
- `src/lib/marker-state.ts` — `computeMarkerStates()` unchanged
- `src/lib/client-config.ts` — config loading unchanged
- `src/index.html` — viewport meta already correct, no changes needed
- `config/` — no configuration changes

## Risk Assessment

| Risk                                                | Likelihood | Impact | Mitigation                                                                                  |
| --------------------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------------- |
| Mobile CSS changes break desktop layout             | Low        | High   | All mobile changes scoped inside `@media (max-width: 768px)`; desktop rules untouched       |
| Marker transition fix removes intended animation    | Low        | Medium | Explicitly list all currently-animated properties; visual regression check                  |
| Close button state navigation introduces edge cases | Medium     | Medium | Match existing Escape key behavior exactly; add unit tests                                  |
| Region chip layout wraps too much on narrow screens | Low        | Low    | 5-6 regions with short names fit in one row at 375px; wrap is graceful fallback             |
| Touch circle hit areas overlap on clustered markers | Low        | Medium | Circle radius sized conservatively; at region zoom level markers should be separated enough |
| Mode toggle regresses from added marker hit areas   | Low        | Low    | Hit area circles are simple transparent SVG elements; negligible performance cost           |
