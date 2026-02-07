# Contracts: Fix Critical 3D/2D Map Visualization Bugs

**Feature**: 001-fix-map-bugs
**Date**: 2026-02-05

## Overview

This feature is a bug fix with **no API changes**. All fixes are internal to existing components.

## Component Contracts (Unchanged)

### MapSvg Interface

```typescript
interface MapSvg {
  init(): Promise<void>;
  selectRegion(regionName: string): void;
  selectOffice(office: OfficeWithRegion): void;
  reset(): void;
  getState(): { selectedRegion: string | null; selectedOffice: OfficeWithRegion | null };
}
```

**No changes to public interface.** Internal implementation adds marker-ready state tracking.

### Map3D Interface

```typescript
interface Map3D {
  selectRegion(regionName: string): void;
  selectOffice(office: Office): void;
  reset(): void;
  getState(): { selectedRegion: string | null; selectedOffice: object | null };
  dispose(): void;
}
```

**No changes to public interface.** Internal implementation adds hysteresis constants and updates visibility logic.

### App Controller Interface

```typescript
interface App {
  handleRegionClick(regionName: string): void;
  handleOfficeClick(office: Office, region?: Region): void;
  handleReset(): void;
  getState(): { state: StateValue; selectedRegion: Region | null; selectedOffice: Office | null };
}
```

**No changes to public interface.** Internal implementation timing is adjusted in `toggleMapMode()`.

## Configuration Constants

### New Constants (map-3d.js)

```javascript
// Texture alignment (calibrated values)
export const TEXTURE_LONGITUDE_OFFSET_DEG = 85; // Calibrated for earth-day.jpg texture
export const TEXTURE_LATITUDE_OFFSET = 0.15; // Vertical alignment adjustment

// Backface culling hysteresis
export const BACKFACE_HIDE_THRESHOLD = 0.25; // New
export const BACKFACE_SHOW_THRESHOLD = 0.15; // New
```

These are exported constants for test validation but not part of any component API.

## Test Contracts

New tests will follow existing patterns in `tests/` directory:

| Test File                       | New Tests                                           |
| ------------------------------- | --------------------------------------------------- |
| `view-switching.test.ts`        | Verify markers visible after toggle                 |
| `projection-3d.test.ts`         | Verify texture offset produces correct positions    |
| `scene-graph-parenting.test.ts` | Verify hysteresis prevents rapid visibility changes |
