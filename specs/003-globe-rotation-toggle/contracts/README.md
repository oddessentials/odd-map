# Contracts: Globe Rotation Toggle

**Feature**: 003-globe-rotation-toggle
**Date**: 2026-02-05

## Overview

This feature has no external API contracts. It is a purely client-side UI feature.

## Internal Interface

### Map3D Class Extension

The Map3D class will expose a new method:

```typescript
/**
 * Toggle auto-rotation on/off
 * @returns The new autoRotate state
 */
toggleAutoRotate(): boolean;

/**
 * Get current auto-rotation state
 */
getAutoRotate(): boolean;
```

### Type Declaration (map-3d.d.ts)

```typescript
export declare class Map3D {
  // ... existing methods ...

  /** Toggle auto-rotation and return new state */
  toggleAutoRotate(): boolean;

  /** Get current auto-rotation state */
  getAutoRotate(): boolean;
}
```

## No External Contracts

- No REST API endpoints
- No WebSocket connections
- No third-party service integrations
- All functionality is local to the browser
