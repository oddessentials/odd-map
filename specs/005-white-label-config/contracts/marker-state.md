# Contract: Marker State Manager

**Module**: `src/lib/marker-state.ts` (new)

---

## Purpose

Centralized computation of marker visual states for both 2D and 3D renderers. Satisfies WLC-008 (Centralized Marker State Authority) and FR-006 (single centralized mechanism).

## Interface

### computeMarkerStates(input: MarkerStateInput): MarkerVisualState[]

Pure function. Given the current selection state and list of all offices, returns the visual state for every marker.

**Inputs:**

```typescript
interface MarkerStateInput {
  allOffices: OfficeWithRegion[];
  selectedRegion: string | null; // region name or null
  selectedOfficeCode: string | null; // office code or null
  hoveredOfficeCode: string | null; // office code or null
}
```

**Outputs:**

```typescript
interface MarkerVisualState {
  officeCode: string;
  regionName: string;
  visible: boolean; // always true (logical visibility)
  selected: boolean; // this office is the selected office
  highlighted: boolean; // this marker is being hovered
  dimmed: boolean; // out-of-region when region is selected
}
```

**Rules:**

1. `visible` = always `true` (all markers are logically visible at all times)
2. `selected` = `officeCode === selectedOfficeCode`
3. `highlighted` = `officeCode === hoveredOfficeCode`
4. `dimmed` = `selectedRegion !== null && office.region !== selectedRegion`

**Pure Function Guarantee:**

- No side effects
- Same input always produces same output
- No dependency on renderer type
- Testable in isolation without DOM or WebGL

---

## Renderer Consumption

### 2D Renderer (MapSvg)

Receives `MarkerVisualState[]` and applies CSS classes:

- `.marker--selected` when `selected`
- `.marker--highlighted` when `highlighted`
- `.marker--dimmed` when `dimmed`

### 3D Renderer (Map3D)

Receives `MarkerVisualState[]` and applies material properties:

- Selected: emissive glow
- Highlighted: scale pulse
- Dimmed: opacity reduction

Additionally, Map3D applies **backface culling** as a rendering-only concern:

- Markers on the far side of the globe are hidden by the renderer
- This does NOT change their `MarkerVisualState` — it is a visibility optimization
- The existing `computeMarkerVisibility()` function (hysteresis-based) remains in `map-3d.js`

---

## Integration Points

### App.ts Orchestration

```
App selection changes → computeMarkerStates(input) → pass to active renderer
```

The `App` class calls `computeMarkerStates()` when:

- Region selection changes (`handleRegionClick`)
- Office selection changes (`handleOfficeClick`)
- Reset occurs (`handleReset`)

The resulting `MarkerVisualState[]` is passed to the active map component via a new method: `map.updateMarkerStates(states: MarkerVisualState[])`.

### Hover Handling

Hover state changes within the renderer (mouse events) call `computeMarkerStates()` with an updated `hoveredOfficeCode` and re-apply the result locally. This avoids round-tripping hover events through the App controller for performance.

---

## Test Contract

At least one test MUST verify:

1. Given the same `MarkerStateInput`, the output `MarkerVisualState[]` is identical regardless of which renderer is conceptually active
2. When `selectedRegion` is set, markers outside that region have `dimmed: true`
3. When `selectedOfficeCode` is set, exactly one marker has `selected: true`
4. When no selection is active, no markers are dimmed or selected
5. `visible` is always `true` for all markers
