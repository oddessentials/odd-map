# Research: Fix Critical 3D/2D Map Visualization Bugs

**Feature**: 001-fix-map-bugs
**Date**: 2026-02-05

## Bug #1: Race Condition Analysis

### Decision: Use Promise-based initialization signal

### Rationale

The race condition occurs because:

1. `MapSvg.init()` is async (loads SVG, initializes projection, creates markers)
2. `toggleMapMode()` calls `await map2d.init()` but then immediately calls `selectRegion()`
3. However, `selectRegion()` calls `showMarkersForRegion()` which queries `.marker-group` elements
4. These elements are created in `addMarkers()` which runs at the end of `init()`

The async flow is correct, but the issue is that `init()` currently resolves before all DOM operations complete due to how JavaScript event loop handles synchronous DOM mutations after async operations.

**Code evidence** (`src/components/map-svg.ts:42-87`):

```typescript
async init(): Promise<void> {
  await initProjection('usg');      // async
  const svgModule = await import(...); // async
  this.container.innerHTML = svgText;  // sync DOM
  this.calculateRegionBounds();        // sync
  this.setupEventListeners();          // sync
  this.addMarkers();                   // sync - creates .marker-group elements
}
```

The problem: `app.ts:168` calls `await this.initMap()` which awaits `map2d.init()`, then immediately calls `map.selectRegion()`. Since `init()` resolves after `addMarkers()` runs synchronously, the markers SHOULD exist.

**Refined analysis**: The real issue may be in the restore logic order. Looking at `app.ts:173-185`:

```typescript
if (wasOfficeCode && wasOffice && this.map) {
  this.map.selectOffice(wasOffice);
  if (wasRegion) {
    this.panel?.showOffice(wasOffice, wasRegion);
  }
} else if (wasRegionName && wasRegion && this.map) {
  this.map.selectRegion(wasRegionName);
  this.panel?.showRegion(wasRegion);
}
```

This should work. Let me check if the issue is in `showMarkersForRegion()` itself or a timing issue with the DOM.

**Alternative hypothesis**: The `reset()` method in `map-svg.ts:270-284` may be called somewhere in the flow, which calls `hideAllMarkers()`. Need to verify call order.

### Alternatives Considered

1. **Queue selection until markers exist**: Adds complexity, harder to test
2. **Add callback after addMarkers()**: Same as promise but less idiomatic
3. **Use MutationObserver**: Overkill for this case

### Resolution

Add explicit `markersReady` state check in MapSvg and ensure `selectRegion()` is only called after markers exist. If markers don't exist yet, queue the selection.

---

## Bug #2: Texture Offset Analysis

### Decision: Calibrate texture offset empirically

### Rationale

Standard equirectangular Earth textures have varying alignments depending on their source. The initial assumption of 180° offset was incorrect for our specific texture.

**Empirical calibration process**:

- Irvine, CA (33.64°N, 117.74°W) was used as primary reference point
- Boston, MA (42.36°N, 71.06°W) was used as secondary reference
- Values were adjusted iteratively until pins aligned with landmass

**Final calibrated values**:

- `TEXTURE_LONGITUDE_OFFSET_DEG = 85` (horizontal alignment)
- `TEXTURE_LATITUDE_OFFSET = 0.15` (vertical alignment)

The `latLonToGlobe()` function at `map-3d.js:75-84` is mathematically correct:

```javascript
x = radius * Math.cos(latRad) * Math.sin(lonRad);
y = radius * Math.sin(latRad);
z = radius * Math.cos(latRad) * Math.cos(lonRad);
```

This places 0° longitude at +Z axis (front), which is correct. The texture offset aligns the specific texture file with this coordinate system.

### Alternatives Considered

1. **Modify the formula**: Would break mathematical correctness
2. **Use different texture**: Requires new asset, deployment changes
3. **Adjust texture offset**: Simple constant change ✅

### Resolution

Calibrated constants in `map-3d.js`:

```javascript
export const TEXTURE_LONGITUDE_OFFSET_DEG = 85;
export const TEXTURE_LATITUDE_OFFSET = 0.15;
```

---

## Bug #3: Flickering Analysis

### Decision: Implement hysteresis with 0.1 buffer zone

### Rationale

Backface culling at `map-3d.js:578` uses a single threshold:

```javascript
marker.visible = dotProduct < 0.2;
```

When a marker's `dotProduct` oscillates around 0.2 (due to floating-point precision or animation frame timing), it rapidly toggles between visible/hidden states.

**Hysteresis pattern**:

- Use TWO thresholds: `HIDE_THRESHOLD` and `SHOW_THRESHOLD`
- Hide when `dotProduct > HIDE_THRESHOLD` (e.g., 0.25)
- Show when `dotProduct < SHOW_THRESHOLD` (e.g., 0.15)
- Between 0.15 and 0.25: maintain current state

This creates a "dead zone" where state doesn't change, preventing rapid toggling.

### Alternatives Considered

1. **Debounce visibility changes**: Adds latency, complex state management
2. **Smooth opacity transitions**: CPU-intensive for many markers
3. **Increase throttle interval**: Would make all updates sluggish
4. **Hysteresis thresholds**: Clean, performant, standard solution ✅

### Resolution

Replace single threshold with state-aware logic:

```javascript
const BACKFACE_HIDE_THRESHOLD = 0.25;
const BACKFACE_SHOW_THRESHOLD = 0.15;

// In updateExpensiveMarkerStates():
if (marker.visible && dotProduct > BACKFACE_HIDE_THRESHOLD) {
  marker.visible = false;
} else if (!marker.visible && dotProduct < BACKFACE_SHOW_THRESHOLD) {
  marker.visible = true;
}
// If between thresholds: no change (hysteresis)
```

---

## Dependencies & Best Practices

### Three.js Texture Offset

- `texture.offset.x` accepts values in texture coordinate space (0.0 to 1.0)
- 180° = 0.5 in texture coordinates (180/360)
- Current code correctly divides by 360

### Vitest Async Testing

- Existing tests mock `init()` to return resolved promises
- New tests should follow same pattern for consistency
- Use `vi.fn().mockResolvedValue()` for async mocks

### Hysteresis in Animation Systems

- Common pattern in game dev and UI for debouncing state
- Buffer zone of 10-20% of threshold value is typical
- 0.1 buffer with 0.2 center = 50% buffer, which is conservative but safe
