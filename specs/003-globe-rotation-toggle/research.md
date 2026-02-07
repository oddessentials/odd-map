# Research: Globe Rotation Toggle

**Feature**: 003-globe-rotation-toggle
**Date**: 2026-02-05
**Status**: Complete

## Research Topics

### 1. Current Auto-Rotation Implementation

**Decision**: Leverage existing `autoRotate` property in Map3D class

**Findings**:

| Property             | Current Value      | Location           |
| -------------------- | ------------------ | ------------------ |
| `this.autoRotate`    | `true` (default)   | map-3d.js line 180 |
| `this.rotationSpeed` | `0.0005` rad/frame | map-3d.js line 181 |

**Rotation behavior** (map-3d.js lines 751-753):

```javascript
if (this.autoRotate && this.globeGroup) {
  this.globeGroup.rotation.y += this.rotationSpeed;
}
```

**autoRotate is currently modified in these situations**:

- Hover over marker/region → `false` (line 530)
- Leave interactive object → `true` (line 547)
- Select region → `false` (line 650)
- Camera animation starts → `false` (line 711)
- Reset map → `true` (line 681)
- cancelAnimation() → `false` (line 800)

**Rationale**: The existing property and animation loop are perfectly suited for this feature. Only change needed is the default value from `true` to `false`.

**Alternatives considered**:

- Create new property separate from `autoRotate` → Rejected (unnecessary complexity)
- Use a different rotation mechanism → Rejected (existing code works well)

---

### 2. Existing Button Pattern

**Decision**: Follow the 2D/3D toggle button pattern exactly

**Findings**:

The map-toggle button in index.html (lines 73-81):

```html
<button
  id="map-toggle"
  class="btn btn-secondary map-toggle"
  aria-label="Switch to 2D map"
  title="Switch to 2D view"
>
  2D
</button>
```

**CSS styling pattern** (app.css lines 121-144):

- Base: `rgba(255, 255, 255, 0.1)` background
- Hover: `rgba(255, 255, 255, 0.2)` + `scale(1.05)`
- Active state: `var(--color-accent)` background (#0066cc)
- Disabled: `opacity: 0.5; cursor: not-allowed`
- Min-width: 48px (touch-friendly)
- Font: bold (700), white text

**App.ts pattern** (button handling):

```typescript
this.mapToggleBtn = document.getElementById('map-toggle');
this.mapToggleBtn.addEventListener('click', () => this.toggleMapMode());
this.updateToggleButton(); // Updates text and ARIA labels
```

**Rationale**: Matching the existing pattern ensures visual consistency and reduces implementation complexity.

**Alternatives considered**:

- Floating action button → Rejected (inconsistent with existing UI)
- Menu item instead of button → Rejected (less discoverable)
- Icon-only button → Acceptable, but consider text fallback for clarity

---

### 3. Icon Selection

**Decision**: Use Unicode rotation symbol (↻) or SVG icon

**Options evaluated**:

| Option             | Symbol | Pros                     | Cons                 |
| ------------------ | ------ | ------------------------ | -------------------- |
| Unicode ↻ (U+21BB) | ↻      | Simple, no assets needed | Limited styling      |
| Unicode ⟳ (U+27F3) | ⟳      | Cleaner look             | Less browser support |
| SVG icon           | Custom | Full control, scalable   | Requires asset       |
| Text label         | "Spin" | Clear meaning            | Takes more space     |

**Rationale**: Unicode ↻ provides a recognizable rotation symbol without adding complexity. Can enhance with SVG later if needed.

**Alternatives considered**:

- Adding an icon library (Font Awesome, etc.) → Rejected (violates zero-backend principle, adds bundle size)

---

### 4. State Management During View Switching

**Decision**: Reset autoRotate to `false` on every 3D view init

**Current behavior analysis**:

When toggling 2D ↔ 3D (app.ts `toggleMapMode()`):

1. Capture selection state (region, office)
2. Dispose current map
3. Initialize new map
4. Restore selection state

**Implications for spin state**:

- 3D → 2D: Map3D disposed, spin state lost
- 2D → 3D: New Map3D created with default `autoRotate = false`
- This aligns with FR-009: "reset auto-rotation state to off when switching views"

**Rationale**: Starting with rotation off on every 3D init provides consistent, predictable behavior.

---

### 5. Button Visibility Logic

**Decision**: Show spin button only when 3D mode is active

**Implementation approach**:

```typescript
// In updateUIForMode() or similar
if (this.spinBtn) {
  this.spinBtn.hidden = !this.use3D;
}
```

**Placement**: Adjacent to 2D/3D toggle button in the header controls area

**Rationale**: The spin button is only relevant for 3D mode; hiding it in 2D mode reduces clutter.

---

### 6. Interaction with Manual Drag

**Decision**: Manual drag stops auto-rotation (existing behavior works)

**Current implementation** (map-3d.js line 584):

```javascript
// During drag, autoRotate is implicitly stopped because
// the globeGroup.rotation is being manually controlled
```

Note: The current code doesn't explicitly stop `autoRotate` on drag start. Need to verify if manual drag rotation conflicts with auto-rotation.

**Investigation needed during implementation**: Test whether manual drag needs to explicitly set `autoRotate = false`.

---

## Summary of Decisions

| Topic                | Decision                           |
| -------------------- | ---------------------------------- |
| Rotation mechanism   | Use existing `autoRotate` property |
| Default value        | Change from `true` to `false`      |
| Button style         | Match existing map-toggle pattern  |
| Button icon          | Unicode ↻ symbol                   |
| Button visibility    | Hidden in 2D mode                  |
| State on view switch | Always reset to off                |
| API method           | Add `toggleAutoRotate()` to Map3D  |

## Open Questions (to resolve during implementation)

1. Should manual drag explicitly set `autoRotate = false`? (May already work correctly)
2. Should the button show "active" state when spinning? (Yes, per FR-006)
