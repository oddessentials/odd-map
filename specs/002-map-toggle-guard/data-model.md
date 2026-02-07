# Data Model: Map Toggle Edge Case Guards

**Feature**: 002-map-toggle-guard
**Date**: 2026-02-05

## Overview

This feature adds state management for map mode transitions. No persistent data entities are introduced - all changes are runtime state within existing components.

## State Additions

### App Controller State

```typescript
// src/app.ts - additions to App class
class App {
  // Existing state (unchanged)
  private state: StateValue;
  private selectedRegion: Region | null;
  private selectedOffice: Office | null;
  private use3D: boolean;
  private map: MapComponent | null;

  // NEW: Transition guard state
  private transitioning: boolean = false;
}
```

**State Transitions**:

```
toggleMapMode() called:
  if transitioning → return (no-op)
  transitioning = true → button disabled
  ... async map initialization ...
  transitioning = false → button enabled
```

### Map3D Animation State

```typescript
// src/components/map-3d.js - existing + new
class Map3D {
  // Existing animation state
  animating: boolean; // True during camera animation
  animationFrameId: number; // RAF ID for render loop

  // NEW: Animation cancellation method
  cancelAnimation(): void; // Sets animating=false, RAF callback exits
}
```

**State Transitions**:

```
selectRegion()/selectOffice() called:
  animating = true
  RAF loop runs
  completion OR cancelAnimation() called:
    animating = false
```

## Entity Relationships

```
┌─────────────┐     controls     ┌──────────────┐
│    App      │ ───────────────► │  MapToggle   │
│ (controller)│                  │   Button     │
└─────────────┘                  └──────────────┘
       │                                │
       │ transitioning                  │ disabled
       │ = true                         │ = true
       ▼                                ▼
┌─────────────┐                  ┌──────────────┐
│   initMap   │ ──────────────── │  Visual      │
│   (async)   │    reflects      │  Feedback    │
└─────────────┘                  └──────────────┘
       │
       │ disposes
       ▼
┌─────────────┐
│   Map3D     │
│  .dispose() │
└─────────────┘
       │
       │ calls
       ▼
┌─────────────┐
│ cancelAnim  │
│   ation()   │
└─────────────┘
```

## Validation Rules

### Transition State

| Rule                             | Validation                                   |
| -------------------------------- | -------------------------------------------- |
| Single transition at a time      | `transitioning === true` blocks new toggles  |
| Transition always completes      | `finally` block ensures flag is cleared      |
| Button reflects transition state | `disabled` attribute matches `transitioning` |

### Animation State

| Rule                            | Validation                                               |
| ------------------------------- | -------------------------------------------------------- |
| Animation respects cancellation | RAF callback checks `animating` flag                     |
| Disposal cancels animation      | `dispose()` calls `cancelAnimation()` first              |
| Flag is always reset            | Completion and cancellation both set `animating = false` |

## No Database Changes

This feature does not modify any persistent data structures. All changes are runtime state management within JavaScript/TypeScript classes.
