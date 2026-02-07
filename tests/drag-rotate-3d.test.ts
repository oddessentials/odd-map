/**
 * Unit tests for 3D globe drag-rotation math.
 * Tests the pure computeDragRotationDelta() function — no WebGL context needed.
 */

import { describe, it, expect } from 'vitest';
import { computeDragRotationDelta } from '../src/components/map-3d.js';

const SENSITIVITY = 0.005; // Expected DRAG_ROTATION_SENSITIVITY in rad/pixel

describe('computeDragRotationDelta', () => {
  // ────────────────────────────────────────────────
  // Direction mapping
  // ────────────────────────────────────────────────

  it('drag left (negative deltaX) returns positive rotation (globe turns left)', () => {
    const delta = computeDragRotationDelta(-100);
    expect(delta).toBeGreaterThan(0);
  });

  it('drag right (positive deltaX) returns negative rotation (globe turns right)', () => {
    const delta = computeDragRotationDelta(100);
    expect(delta).toBeLessThan(0);
  });

  it('opposite directions produce equal and opposite deltas', () => {
    const left = computeDragRotationDelta(-100);
    const right = computeDragRotationDelta(100);
    expect(left + right).toBeCloseTo(0);
    expect(left).toBeCloseTo(-right);
  });

  // ────────────────────────────────────────────────
  // Zero input
  // ────────────────────────────────────────────────

  it('zero deltaX returns exactly zero rotation', () => {
    const delta = computeDragRotationDelta(0);
    expect(delta).toBe(0);
  });

  // ────────────────────────────────────────────────
  // Proportionality
  // ────────────────────────────────────────────────

  it('larger deltaX produces larger rotation magnitude', () => {
    const small = Math.abs(computeDragRotationDelta(-50));
    const large = Math.abs(computeDragRotationDelta(-200));
    expect(large).toBeGreaterThan(small);
  });

  it('delta is strictly proportional to input (linearity)', () => {
    const d100 = computeDragRotationDelta(-100);
    const d200 = computeDragRotationDelta(-200);
    expect(d200).toBeCloseTo(d100 * 2, 10);
  });

  it('unit input (1px) produces exactly SENSITIVITY radians', () => {
    const delta = computeDragRotationDelta(-1);
    expect(delta).toBeCloseTo(SENSITIVITY, 10);
  });

  // ────────────────────────────────────────────────
  // Sensitivity constant validation
  // ────────────────────────────────────────────────

  it('sensitivity is 0.005 rad/pixel — 100px drag gives 0.5 rad', () => {
    const delta = computeDragRotationDelta(-100);
    expect(delta).toBeCloseTo(100 * SENSITIVITY, 10);
  });

  it('sensitivity is 0.005 rad/pixel — 200px drag gives 1.0 rad', () => {
    const delta = computeDragRotationDelta(-200);
    expect(delta).toBeCloseTo(200 * SENSITIVITY, 10);
  });

  // ────────────────────────────────────────────────
  // Full-width drag coverage
  // ────────────────────────────────────────────────

  it('300px drag achieves ~1.5 rad (~86 degrees)', () => {
    const delta = computeDragRotationDelta(-300);
    expect(delta).toBeCloseTo(1.5, 1);
  });

  it('full 360 degrees requires ~1257px of cumulative drag', () => {
    const fullRotation = 2 * Math.PI;
    const pixelsNeeded = fullRotation / SENSITIVITY;
    expect(pixelsNeeded).toBeCloseTo(1257, 0);
  });

  // ────────────────────────────────────────────────
  // Accumulation behavior
  // ────────────────────────────────────────────────

  it('accumulated incremental deltas equal one large delta', () => {
    // Simulating 10 incremental 10px moves = one 100px move
    let accumulated = 0;
    for (let i = 0; i < 10; i++) {
      accumulated += computeDragRotationDelta(-10);
    }
    const single = computeDragRotationDelta(-100);
    expect(accumulated).toBeCloseTo(single, 10);
  });

  it('equal left and right drags cancel out', () => {
    let rotation = 0;
    // 10 incremental left drags
    for (let i = 0; i < 10; i++) {
      rotation += computeDragRotationDelta(-20);
    }
    // 10 incremental right drags
    for (let i = 0; i < 10; i++) {
      rotation += computeDragRotationDelta(20);
    }
    expect(rotation).toBeCloseTo(0, 10);
  });

  // ────────────────────────────────────────────────
  // Fractional inputs
  // ────────────────────────────────────────────────

  it('fractional deltaX produces proportional fractional rotation', () => {
    const delta = computeDragRotationDelta(-0.5);
    expect(delta).toBeCloseTo(0.5 * SENSITIVITY, 10);
  });
});
