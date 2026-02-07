/**
 * Unit Tests - Pointer Event Handling State Machine
 *
 * Tests the pointer event state machine logic from map-svg.ts.
 * Covers: pointer type gating, pointer capture lifecycle,
 * wasPinching/wasDragging state transitions, and pinch→lift edge cases.
 *
 * Follows the bottom-sheet.test.ts pattern — extracts decision logic into
 * a minimal simulation for isolated testing without real DOM/PointerEvent.
 */

import { describe, it, expect, beforeEach } from 'vitest';

// ────────────────────────────────────────────────
// Constants matching map-svg.ts implementation
// ────────────────────────────────────────────────

const DRAG_THRESHOLD = 4;

// ────────────────────────────────────────────────
// Minimal pointer state machine simulation
// ────────────────────────────────────────────────

interface PointerPoint {
  x: number;
  y: number;
}

interface PointerState {
  pointers: Map<number, PointerPoint>;
  isDragging: boolean;
  wasDragging: boolean;
  isPinching: boolean;
  wasPinching: boolean;
  dragStartScreenPos: PointerPoint | null;
  capturedPointers: Set<number>;
  releasedPointers: Set<number>;
  cursor: string;
}

function createPointerState(): PointerState {
  return {
    pointers: new Map(),
    isDragging: false,
    wasDragging: false,
    isPinching: false,
    wasPinching: false,
    dragStartScreenPos: null,
    capturedPointers: new Set(),
    releasedPointers: new Set(),
    cursor: 'grab',
  };
}

/**
 * Simulate handlePointerDown from map-svg.ts.
 * Returns true if the event was accepted (not filtered out).
 */
function simulatePointerDown(
  state: PointerState,
  pointerId: number,
  x: number,
  y: number,
  pointerType: string = 'touch',
  button: number = 0
): boolean {
  // Fix 1: pointer type gate — only check button for mouse events
  if (pointerType === 'mouse' && button !== 0) return false;

  state.pointers.set(pointerId, { x, y });

  // Fix 2: capture immediately on pointerdown
  state.capturedPointers.add(pointerId);

  if (state.pointers.size === 1) {
    state.dragStartScreenPos = { x, y };
    state.isDragging = false;
    state.wasDragging = false;
    state.wasPinching = false;
  } else if (state.pointers.size >= 2) {
    state.isDragging = false;
    state.cursor = 'grab';
    state.isPinching = true;
  }

  return true;
}

/**
 * Simulate handlePointerMove from map-svg.ts (drag detection only).
 */
function simulatePointerMove(state: PointerState, pointerId: number, x: number, y: number): void {
  if (!state.pointers.has(pointerId)) return;

  state.pointers.set(pointerId, { x, y });

  // Skip pinch math — tested separately in pinch-zoom-2d.test.ts
  if (state.isPinching) return;

  // Single-pointer drag
  if (state.pointers.size !== 1 || state.isPinching || state.wasPinching) return;
  if (!state.dragStartScreenPos) return;

  const deltaX = x - state.dragStartScreenPos.x;
  const deltaY = y - state.dragStartScreenPos.y;

  if (!state.isDragging && Math.hypot(deltaX, deltaY) <= DRAG_THRESHOLD) return;

  if (!state.isDragging) {
    state.isDragging = true;
    state.cursor = 'grabbing';
    // Fix 2: no setPointerCapture here — already done in pointerdown
  }
}

/**
 * Simulate handlePointerUp from map-svg.ts.
 */
function simulatePointerUp(state: PointerState, pointerId: number): void {
  if (!state.pointers.has(pointerId)) return;

  // Fix 2: release pointer capture on up
  if (state.capturedPointers.has(pointerId)) {
    state.releasedPointers.add(pointerId);
    state.capturedPointers.delete(pointerId);
  }

  state.pointers.delete(pointerId);

  if (state.isPinching) {
    if (state.pointers.size < 2) {
      state.isPinching = false;
      state.wasPinching = true;
      // pinchStartPointers/pinchStartViewBox cleared (not modeled here)
    }
  } else if (state.isDragging) {
    state.wasDragging = true;
  }

  if (state.pointers.size === 0) {
    // Fix 3: wasPinching cleared when all pointers gone
    state.isDragging = false;
    state.wasPinching = false;
    state.dragStartScreenPos = null;
    state.cursor = 'grab';
  }
}

// ────────────────────────────────────────────────
// Fix 1: Pointer type gate
// ────────────────────────────────────────────────

describe('Pointer Type Gate (Fix 1)', () => {
  let state: PointerState;

  beforeEach(() => {
    state = createPointerState();
  });

  it('accepts touch pointerdown with button=0', () => {
    const accepted = simulatePointerDown(state, 1, 100, 200, 'touch', 0);

    expect(accepted).toBe(true);
    expect(state.pointers.size).toBe(1);
  });

  it('accepts touch pointerdown regardless of button value', () => {
    // Touch events may have non-zero button in edge cases; we should not reject them
    const accepted = simulatePointerDown(state, 1, 100, 200, 'touch', 2);

    expect(accepted).toBe(true);
    expect(state.pointers.size).toBe(1);
  });

  it('accepts pen pointerdown regardless of button value', () => {
    const accepted = simulatePointerDown(state, 1, 100, 200, 'pen', 5);

    expect(accepted).toBe(true);
    expect(state.pointers.size).toBe(1);
  });

  it('accepts mouse left-click (button=0)', () => {
    const accepted = simulatePointerDown(state, 1, 100, 200, 'mouse', 0);

    expect(accepted).toBe(true);
    expect(state.pointers.size).toBe(1);
  });

  it('rejects mouse right-click (button=2)', () => {
    const accepted = simulatePointerDown(state, 1, 100, 200, 'mouse', 2);

    expect(accepted).toBe(false);
    expect(state.pointers.size).toBe(0);
  });

  it('rejects mouse middle-click (button=1)', () => {
    const accepted = simulatePointerDown(state, 1, 100, 200, 'mouse', 1);

    expect(accepted).toBe(false);
    expect(state.pointers.size).toBe(0);
  });
});

// ────────────────────────────────────────────────
// Fix 2: Pointer capture lifecycle
// ────────────────────────────────────────────────

describe('Pointer Capture Lifecycle (Fix 2)', () => {
  let state: PointerState;

  beforeEach(() => {
    state = createPointerState();
  });

  it('captures pointer immediately on pointerdown', () => {
    simulatePointerDown(state, 1, 100, 200);

    expect(state.capturedPointers.has(1)).toBe(true);
  });

  it('captures both pointers in a pinch gesture', () => {
    simulatePointerDown(state, 1, 100, 200);
    simulatePointerDown(state, 2, 200, 200);

    expect(state.capturedPointers.has(1)).toBe(true);
    expect(state.capturedPointers.has(2)).toBe(true);
  });

  it('releases pointer capture on pointerup', () => {
    simulatePointerDown(state, 1, 100, 200);
    simulatePointerUp(state, 1);

    expect(state.capturedPointers.has(1)).toBe(false);
    expect(state.releasedPointers.has(1)).toBe(true);
  });

  it('releases both pointers when pinch ends', () => {
    simulatePointerDown(state, 1, 100, 200);
    simulatePointerDown(state, 2, 200, 200);
    simulatePointerUp(state, 1);
    simulatePointerUp(state, 2);

    expect(state.capturedPointers.size).toBe(0);
    expect(state.releasedPointers.has(1)).toBe(true);
    expect(state.releasedPointers.has(2)).toBe(true);
  });

  it('does not call setPointerCapture during drag move', () => {
    simulatePointerDown(state, 1, 100, 200);
    const capturedBefore = new Set(state.capturedPointers);

    // Move beyond threshold to start drag
    simulatePointerMove(state, 1, 200, 200);

    // No new captures should have been added during move
    expect(state.capturedPointers).toEqual(capturedBefore);
  });
});

// ────────────────────────────────────────────────
// Fix 3: wasPinching cleared when all pointers gone
// ────────────────────────────────────────────────

describe('wasPinching State Reset (Fix 3)', () => {
  let state: PointerState;

  beforeEach(() => {
    state = createPointerState();
  });

  it('sets wasPinching=true on 2→1 transition', () => {
    // Start pinch
    simulatePointerDown(state, 1, 100, 200);
    simulatePointerDown(state, 2, 200, 200);
    expect(state.isPinching).toBe(true);

    // Lift one finger (2→1)
    simulatePointerUp(state, 2);

    expect(state.isPinching).toBe(false);
    expect(state.wasPinching).toBe(true);
    expect(state.pointers.size).toBe(1);
  });

  it('clears wasPinching when all pointers are gone (2→1→0)', () => {
    // Start pinch
    simulatePointerDown(state, 1, 100, 200);
    simulatePointerDown(state, 2, 200, 200);

    // Lift first finger (2→1): wasPinching=true
    simulatePointerUp(state, 2);
    expect(state.wasPinching).toBe(true);

    // Lift second finger (1→0): wasPinching must be cleared
    simulatePointerUp(state, 1);
    expect(state.wasPinching).toBe(false);
    expect(state.pointers.size).toBe(0);
  });

  it('clears wasPinching when both fingers lift simultaneously (2→0)', () => {
    // Start pinch
    simulatePointerDown(state, 1, 100, 200);
    simulatePointerDown(state, 2, 200, 200);

    // Both lift in rapid succession
    simulatePointerUp(state, 1);
    simulatePointerUp(state, 2);

    expect(state.wasPinching).toBe(false);
    expect(state.pointers.size).toBe(0);
  });

  it('wasPinching suppresses drag during 2→1 transition', () => {
    // Start pinch
    simulatePointerDown(state, 1, 100, 200);
    simulatePointerDown(state, 2, 200, 200);

    // Lift one finger
    simulatePointerUp(state, 2);
    expect(state.wasPinching).toBe(true);

    // Remaining finger moves — should NOT start a drag
    simulatePointerMove(state, 1, 300, 300);
    expect(state.isDragging).toBe(false);
  });

  it('new touch after pinch can start a fresh drag', () => {
    // Pinch then lift all
    simulatePointerDown(state, 1, 100, 200);
    simulatePointerDown(state, 2, 200, 200);
    simulatePointerUp(state, 1);
    simulatePointerUp(state, 2);
    expect(state.wasPinching).toBe(false);

    // Fresh touch
    simulatePointerDown(state, 3, 150, 150);
    expect(state.wasPinching).toBe(false);

    // Move beyond threshold → should start drag
    simulatePointerMove(state, 3, 250, 250);
    expect(state.isDragging).toBe(true);
  });
});

// ────────────────────────────────────────────────
// Drag state transitions
// ────────────────────────────────────────────────

describe('Drag State Transitions', () => {
  let state: PointerState;

  beforeEach(() => {
    state = createPointerState();
  });

  it('does not start drag below threshold', () => {
    simulatePointerDown(state, 1, 100, 100);
    simulatePointerMove(state, 1, 102, 102); // ~2.8px < 4px threshold

    expect(state.isDragging).toBe(false);
  });

  it('starts drag when movement exceeds threshold', () => {
    simulatePointerDown(state, 1, 100, 100);
    simulatePointerMove(state, 1, 110, 110); // ~14px > 4px threshold

    expect(state.isDragging).toBe(true);
    expect(state.cursor).toBe('grabbing');
  });

  it('sets wasDragging on pointerup after drag', () => {
    simulatePointerDown(state, 1, 100, 100);
    simulatePointerMove(state, 1, 200, 200); // start drag
    simulatePointerUp(state, 1);

    expect(state.wasDragging).toBe(true);
  });

  it('resets cursor to grab when all pointers gone', () => {
    simulatePointerDown(state, 1, 100, 100);
    simulatePointerMove(state, 1, 200, 200); // start drag
    expect(state.cursor).toBe('grabbing');

    simulatePointerUp(state, 1);
    expect(state.cursor).toBe('grab');
  });
});

// ────────────────────────────────────────────────
// Pinch → drag transition edge cases
// ────────────────────────────────────────────────

describe('Pinch-to-Drag Transition Edge Cases', () => {
  let state: PointerState;

  beforeEach(() => {
    state = createPointerState();
  });

  it('entering pinch cancels active drag', () => {
    // Start single-finger drag
    simulatePointerDown(state, 1, 100, 100);
    simulatePointerMove(state, 1, 200, 200);
    expect(state.isDragging).toBe(true);

    // Second finger down → enters pinch, cancels drag
    simulatePointerDown(state, 2, 300, 300);
    expect(state.isPinching).toBe(true);
    expect(state.isDragging).toBe(false);
  });

  it('full pinch lifecycle: down→pinch→lift all→clean state', () => {
    simulatePointerDown(state, 1, 100, 100);
    simulatePointerDown(state, 2, 200, 200);
    expect(state.isPinching).toBe(true);

    simulatePointerUp(state, 1);
    expect(state.isPinching).toBe(false);
    expect(state.wasPinching).toBe(true);

    simulatePointerUp(state, 2);
    expect(state.wasPinching).toBe(false);
    expect(state.isDragging).toBe(false);
    expect(state.pointers.size).toBe(0);
    expect(state.capturedPointers.size).toBe(0);
    expect(state.cursor).toBe('grab');
  });

  it('ignores pointerup for unknown pointer IDs', () => {
    simulatePointerDown(state, 1, 100, 100);
    simulatePointerUp(state, 99); // never registered

    expect(state.pointers.size).toBe(1);
    expect(state.capturedPointers.has(1)).toBe(true);
  });

  it('ignores pointermove for unknown pointer IDs', () => {
    simulatePointerDown(state, 1, 100, 100);
    simulatePointerMove(state, 99, 500, 500);

    expect(state.isDragging).toBe(false);
  });
});
