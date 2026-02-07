# Contracts: Map Toggle Edge Case Guards

**Feature**: 002-map-toggle-guard
**Date**: 2026-02-05

## Overview

This feature modifies internal component APIs. No external/public API changes.

## Component Contracts

### App Controller Interface (Modified)

```typescript
// src/app.ts
class App {
  // Existing public interface (unchanged)
  handleRegionClick(regionName: string): void;
  handleOfficeClick(office: Office, region?: Region): void;
  handleReset(): void;
  getState(): { state: StateValue; selectedRegion: Region | null; selectedOffice: Office | null };
  dispose(): void;

  // Internal state (new)
  private transitioning: boolean;

  // Internal methods (modified)
  private async toggleMapMode(): Promise<void>; // Now guards against re-entry
  private setToggleButtonEnabled(enabled: boolean): void; // NEW
}
```

**Behavioral Contract**:

- `toggleMapMode()` MUST return immediately if `transitioning === true`
- `toggleMapMode()` MUST set `transitioning = true` before any async work
- `toggleMapMode()` MUST set `transitioning = false` in `finally` block
- `setToggleButtonEnabled()` MUST update button `disabled` attribute

### Map3D Interface (Modified)

```typescript
// src/components/map-3d.js
export class Map3D {
  // Existing public interface (unchanged)
  selectRegion(regionName: string): void;
  selectOffice(office: OfficeWithRegion): void;
  reset(): void;
  dispose(): void;
  getState(): { selectedRegion: string | null; selectedOffice: OfficeWithRegion | null };

  // Existing internal state
  animating: boolean;

  // NEW: Animation control
  cancelAnimation(): void;
}
```

**Behavioral Contract**:

- `cancelAnimation()` MUST set `animating = false`
- `animateToTarget()` RAF callback MUST check `animating` flag and exit if false
- `dispose()` MUST call `cancelAnimation()` before other cleanup

### MapComponent Interface (Unchanged)

```typescript
// Polymorphic interface used by App for both 2D and 3D maps
interface MapComponent {
  selectRegion(regionName: string): void;
  selectOffice(office: Office | OfficeWithRegion): void;
  reset(): void;
  dispose?(): void;
}
```

No changes to this interface. MapSvg does not need animation cancellation (no camera animations).

## CSS Contract

### Toggle Button States

```css
/* src/styles/main.css */
#map-toggle {
  /* Normal state - existing styles */
}

#map-toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

**Accessibility Contract**:

- Disabled button MUST have reduced opacity for visual feedback
- Disabled button MUST show `not-allowed` cursor
- Browser handles `aria-disabled` implicitly via `disabled` attribute

## Test Contracts

New tests will follow existing patterns in `tests/` directory:

| Test File                | New Tests                                               |
| ------------------------ | ------------------------------------------------------- |
| `toggle-guard.test.ts`   | Verify rapid toggle is blocked                          |
| `toggle-guard.test.ts`   | Verify button disabled during transition                |
| `toggle-guard.test.ts`   | Verify animation cancelled on dispose                   |
| `view-switching.test.ts` | Verify selection preserved during interrupted animation |
