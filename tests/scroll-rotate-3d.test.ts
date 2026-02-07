/**
 * Unit tests for 3D globe scroll-wheel rotation math.
 * Tests the pure computeScrollRotationDelta() function — no WebGL context needed.
 */

import { describe, it, expect } from 'vitest';
import { computeScrollRotationDelta } from '../src/components/map-3d.js';

const STEP = 0.05; // Expected rotation step in radians

describe('computeScrollRotationDelta', () => {
  // ────────────────────────────────────────────────
  // Direction mapping
  // ────────────────────────────────────────────────

  it('scroll-up (negative deltaY) returns positive delta (left rotation)', () => {
    const delta = computeScrollRotationDelta(-100);
    expect(delta).toBeGreaterThan(0);
    expect(delta).toBeCloseTo(STEP);
  });

  it('scroll-down (positive deltaY) returns negative delta (right rotation)', () => {
    const delta = computeScrollRotationDelta(100);
    expect(delta).toBeLessThan(0);
    expect(delta).toBeCloseTo(-STEP);
  });

  it('opposite scroll directions produce equal and opposite deltas', () => {
    const up = computeScrollRotationDelta(-100);
    const down = computeScrollRotationDelta(100);
    expect(up + down).toBe(0);
    expect(up).toBe(-down);
  });

  // ────────────────────────────────────────────────
  // Zero and edge cases
  // ────────────────────────────────────────────────

  it('deltaY of 0 returns exactly 0 (not -0)', () => {
    const delta = computeScrollRotationDelta(0);
    expect(delta).toBe(0);
    expect(Object.is(delta, 0)).toBe(true); // not -0
  });

  it('negative zero deltaY returns exactly 0', () => {
    const delta = computeScrollRotationDelta(-0);
    expect(delta).toBe(0);
    expect(Object.is(delta, 0)).toBe(true);
  });

  // ────────────────────────────────────────────────
  // Cross-browser normalization (direction-only)
  // ────────────────────────────────────────────────

  it('step size is consistent for small deltaY (Firefox line-based: ~3)', () => {
    expect(computeScrollRotationDelta(-3)).toBeCloseTo(STEP);
    expect(computeScrollRotationDelta(3)).toBeCloseTo(-STEP);
  });

  it('step size is consistent for large deltaY (Chrome pixel-based: ~100-150)', () => {
    expect(computeScrollRotationDelta(-100)).toBeCloseTo(STEP);
    expect(computeScrollRotationDelta(-150)).toBeCloseTo(STEP);
    expect(computeScrollRotationDelta(120)).toBeCloseTo(-STEP);
  });

  it('step size is consistent for very large deltaY (trackpad momentum: ~500+)', () => {
    expect(computeScrollRotationDelta(-500)).toBeCloseTo(STEP);
    expect(computeScrollRotationDelta(1000)).toBeCloseTo(-STEP);
  });

  it('step size is consistent for fractional deltaY (trackpad fine scroll)', () => {
    expect(computeScrollRotationDelta(-0.5)).toBeCloseTo(STEP);
    expect(computeScrollRotationDelta(0.3)).toBeCloseTo(-STEP);
    expect(computeScrollRotationDelta(-1.7)).toBeCloseTo(STEP);
  });

  it('all non-zero values produce the same magnitude', () => {
    const values = [-1000, -150, -3, -0.5, 0.5, 3, 150, 1000];
    for (const v of values) {
      expect(Math.abs(computeScrollRotationDelta(v))).toBeCloseTo(STEP);
    }
  });

  // ────────────────────────────────────────────────
  // Accumulation behavior
  // ────────────────────────────────────────────────

  it('accumulated scroll-up deltas produce full 360 rotation in ~126 steps', () => {
    const fullRotation = 2 * Math.PI;
    let accumulated = 0;
    let steps = 0;

    while (accumulated < fullRotation && steps < 200) {
      accumulated += computeScrollRotationDelta(-100);
      steps++;
    }

    expect(steps).toBeCloseTo(Math.ceil(fullRotation / STEP), 0);
    expect(accumulated).toBeGreaterThanOrEqual(fullRotation);
  });

  it('equal scroll-up and scroll-down events cancel out', () => {
    let rotation = 0;
    // 10 scroll-ups
    for (let i = 0; i < 10; i++) {
      rotation += computeScrollRotationDelta(-100);
    }
    // 10 scroll-downs
    for (let i = 0; i < 10; i++) {
      rotation += computeScrollRotationDelta(100);
    }
    expect(rotation).toBeCloseTo(0);
  });

  it('rotation accumulation is linear (no drift or acceleration)', () => {
    const delta = computeScrollRotationDelta(-100);
    let accumulated = 0;
    const steps = 50;

    for (let i = 0; i < steps; i++) {
      accumulated += computeScrollRotationDelta(-100);
    }

    expect(accumulated).toBeCloseTo(delta * steps, 10);
  });
});
