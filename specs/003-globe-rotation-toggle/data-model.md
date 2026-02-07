# Data Model: Globe Rotation Toggle

**Feature**: 003-globe-rotation-toggle
**Date**: 2026-02-05

## Overview

This feature involves UI state only, with no persistent data or new entities. The data model is minimal.

## State Properties

### Map3D Component State

| Property        | Type      | Default  | Description                                     |
| --------------- | --------- | -------- | ----------------------------------------------- |
| `autoRotate`    | `boolean` | `false`  | Whether automatic globe rotation is enabled     |
| `rotationSpeed` | `number`  | `0.0005` | Rotation speed in radians per frame (unchanged) |

**State transitions**:

```
┌─────────────────┐     toggleAutoRotate()     ┌─────────────────┐
│  autoRotate:    │ ──────────────────────────→│  autoRotate:    │
│     false       │                            │     true        │
│  (stationary)   │←────────────────────────── │  (spinning)     │
└─────────────────┘     toggleAutoRotate()     └─────────────────┘
                           OR
                     reset() / selectRegion()
                           OR
                     manual drag interaction
```

### App Component State

| Property  | Type                  | Default | Description                     |
| --------- | --------------------- | ------- | ------------------------------- |
| `spinBtn` | `HTMLElement \| null` | `null`  | Reference to spin toggle button |

## UI Element IDs

| Element            | ID            | Purpose                      |
| ------------------ | ------------- | ---------------------------- |
| Spin toggle button | `spin-toggle` | Toggles auto-rotation on/off |

## Data Flow

```
User clicks spin button
        │
        ▼
App.onSpinToggle()
        │
        ▼
Map3D.toggleAutoRotate()
        │
        ▼
autoRotate = !autoRotate
        │
        ▼
App.updateSpinButton()
        │
        ▼
Button visual state updated
```

## No Persistence

- Spin state is not persisted across page reloads
- Spin state resets to `false` on view switch (2D ↔ 3D)
- This is intentional per FR-009
