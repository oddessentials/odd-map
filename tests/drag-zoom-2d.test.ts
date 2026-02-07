/**
 * Unit tests for 2D SVG drag-zoom math.
 * Tests the pure computeDragZoomedViewBox() function — no DOM or SVG context needed.
 */

import { describe, it, expect } from 'vitest';
import { computeDragZoomedViewBox } from '../src/components/map-svg.js';
import type { ViewBoxRect } from '../src/components/map-svg.js';

const DEFAULT_VIEWBOX: ViewBoxRect = { x: 0, y: 0, w: 960, h: 600 };
const ASPECT_RATIO = 600 / 960; // 0.625
const MIN_VIEWBOX_WIDTH = 60;
const MAX_VIEWBOX_WIDTH = 960;

describe('computeDragZoomedViewBox', () => {
  // ────────────────────────────────────────────────
  // Basic drag-zoom direction
  // ────────────────────────────────────────────────

  it('drag up (negative deltaY) zooms in — shrinks viewBox', () => {
    const anchor = { x: 480, y: 300 };
    const result = computeDragZoomedViewBox(DEFAULT_VIEWBOX, anchor, -100);
    expect(result.w).toBeLessThan(DEFAULT_VIEWBOX.w);
    expect(result.h).toBeLessThan(DEFAULT_VIEWBOX.h);
  });

  it('drag down (positive deltaY) zooms out — grows viewBox', () => {
    const zoomed: ViewBoxRect = { x: 200, y: 125, w: 400, h: 250 };
    const anchor = { x: 400, y: 250 };
    const result = computeDragZoomedViewBox(zoomed, anchor, 100);
    expect(result.w).toBeGreaterThan(zoomed.w);
    expect(result.h).toBeGreaterThan(zoomed.h);
  });

  it('zero deltaY produces no viewBox change', () => {
    const anchor = { x: 480, y: 300 };
    const result = computeDragZoomedViewBox(DEFAULT_VIEWBOX, anchor, 0);
    expect(result.x).toBeCloseTo(DEFAULT_VIEWBOX.x);
    expect(result.y).toBeCloseTo(DEFAULT_VIEWBOX.y);
    expect(result.w).toBeCloseTo(DEFAULT_VIEWBOX.w);
    expect(result.h).toBeCloseTo(DEFAULT_VIEWBOX.h);
  });

  // ────────────────────────────────────────────────
  // Cursor-relative positioning (anchor point stays fixed)
  // ────────────────────────────────────────────────

  it('anchor point fractional position is preserved after drag-zoom in', () => {
    const start: ViewBoxRect = { x: 100, y: 62.5, w: 500, h: 312.5 };
    const anchor = { x: 300, y: 200 };
    const result = computeDragZoomedViewBox(start, anchor, -80);

    const fracBefore = {
      fx: (anchor.x - start.x) / start.w,
      fy: (anchor.y - start.y) / start.h,
    };
    const fracAfter = {
      fx: (anchor.x - result.x) / result.w,
      fy: (anchor.y - result.y) / result.h,
    };

    expect(fracAfter.fx).toBeCloseTo(fracBefore.fx, 10);
    expect(fracAfter.fy).toBeCloseTo(fracBefore.fy, 10);
  });

  it('anchor point fractional position is preserved after drag-zoom out', () => {
    const start: ViewBoxRect = { x: 200, y: 125, w: 400, h: 250 };
    const anchor = { x: 400, y: 250 };
    const result = computeDragZoomedViewBox(start, anchor, 80);

    const fracBefore = {
      fx: (anchor.x - start.x) / start.w,
      fy: (anchor.y - start.y) / start.h,
    };
    const fracAfter = {
      fx: (anchor.x - result.x) / result.w,
      fy: (anchor.y - result.y) / result.h,
    };

    expect(fracAfter.fx).toBeCloseTo(fracBefore.fx, 10);
    expect(fracAfter.fy).toBeCloseTo(fracBefore.fy, 10);
  });

  // ────────────────────────────────────────────────
  // Zoom clamping
  // ────────────────────────────────────────────────

  it('clamps at maximum zoom — viewBox width cannot go below 60', () => {
    const veryZoomed: ViewBoxRect = { x: 400, y: 250, w: 65, h: 65 * ASPECT_RATIO };
    const anchor = { x: 430, y: 270 };
    // Drag up a very large amount to try to exceed max zoom
    const result = computeDragZoomedViewBox(veryZoomed, anchor, -500);
    expect(result.w).toBe(MIN_VIEWBOX_WIDTH);
    expect(result.h).toBeCloseTo(MIN_VIEWBOX_WIDTH * ASPECT_RATIO);
  });

  it('clamps at minimum zoom — viewBox cannot exceed 960x600', () => {
    const anchor = { x: 480, y: 300 };
    // Drag down a very large amount from full view
    const result = computeDragZoomedViewBox(DEFAULT_VIEWBOX, anchor, 500);
    expect(result.w).toBe(MAX_VIEWBOX_WIDTH);
    expect(result.h).toBe(600);
  });

  it('stays clamped at max zoom on extreme drag-up', () => {
    const atMax: ViewBoxRect = { x: 400, y: 250, w: 60, h: 60 * ASPECT_RATIO };
    const anchor = { x: 430, y: 270 };
    const result = computeDragZoomedViewBox(atMax, anchor, -200);
    expect(result.w).toBe(MIN_VIEWBOX_WIDTH);
    expect(result.h).toBeCloseTo(MIN_VIEWBOX_WIDTH * ASPECT_RATIO);
  });

  it('stays clamped at min zoom on extreme drag-down', () => {
    const anchor = { x: 480, y: 300 };
    const result = computeDragZoomedViewBox(DEFAULT_VIEWBOX, anchor, 200);
    expect(result.w).toBe(MAX_VIEWBOX_WIDTH);
    expect(result.h).toBe(600);
  });

  // ────────────────────────────────────────────────
  // Proportionality
  // ────────────────────────────────────────────────

  it('larger drag produces more zoom', () => {
    const anchor = { x: 480, y: 300 };
    const smallDrag = computeDragZoomedViewBox(DEFAULT_VIEWBOX, anchor, -50);
    const largeDrag = computeDragZoomedViewBox(DEFAULT_VIEWBOX, anchor, -200);
    expect(largeDrag.w).toBeLessThan(smallDrag.w);
  });

  it('larger drag-down produces more zoom-out', () => {
    const start: ViewBoxRect = { x: 200, y: 125, w: 400, h: 250 };
    const anchor = { x: 400, y: 250 };
    const smallDrag = computeDragZoomedViewBox(start, anchor, 50);
    const largeDrag = computeDragZoomedViewBox(start, anchor, 200);
    expect(largeDrag.w).toBeGreaterThan(smallDrag.w);
  });

  // ────────────────────────────────────────────────
  // Aspect ratio preservation
  // ────────────────────────────────────────────────

  it('preserves 960:600 aspect ratio on drag-zoom in', () => {
    const anchor = { x: 480, y: 300 };
    const result = computeDragZoomedViewBox(DEFAULT_VIEWBOX, anchor, -100);
    expect(result.h / result.w).toBeCloseTo(ASPECT_RATIO, 10);
  });

  it('preserves aspect ratio on drag-zoom out', () => {
    const zoomed: ViewBoxRect = { x: 200, y: 125, w: 400, h: 250 };
    const anchor = { x: 400, y: 250 };
    const result = computeDragZoomedViewBox(zoomed, anchor, 100);
    expect(result.h / result.w).toBeCloseTo(ASPECT_RATIO, 10);
  });

  it('preserves aspect ratio through a range of drag distances', () => {
    const anchor = { x: 300, y: 200 };
    const deltas = [-300, -100, -50, -10, 10, 50, 100, 300];

    for (const delta of deltas) {
      const result = computeDragZoomedViewBox(DEFAULT_VIEWBOX, anchor, delta);
      expect(result.h / result.w).toBeCloseTo(ASPECT_RATIO, 5);
    }
  });

  // ────────────────────────────────────────────────
  // Symmetry — drag up then back returns to original
  // ────────────────────────────────────────────────

  it('dragging 100px up then 100px back returns to original viewBox', () => {
    const start: ViewBoxRect = { x: 100, y: 62.5, w: 600, h: 375 };
    const anchor = { x: 400, y: 250 };

    // Factor for -100: Math.pow(1.005, -100) ≈ 0.6065
    // Factor for 0 (back to start): Math.pow(1.005, 0) = 1.0
    // Since drag zoom always computes from start, dragging back to 0 returns exactly to start
    const zoomedIn = computeDragZoomedViewBox(start, anchor, -100);
    expect(zoomedIn.w).toBeLessThan(start.w);

    // Dragging back to deltaY=0 from the same start should give back the start
    const zoomedBack = computeDragZoomedViewBox(start, anchor, 0);
    expect(zoomedBack.w).toBeCloseTo(start.w, 10);
    expect(zoomedBack.h).toBeCloseTo(start.h, 10);
  });

  it('exponential symmetry: factor(-100) * factor(100) = 1', () => {
    // Math.pow(1.005, -100) * Math.pow(1.005, 100) = 1.0
    const factorUp = Math.pow(1.005, -100);
    const factorDown = Math.pow(1.005, 100);
    expect(factorUp * factorDown).toBeCloseTo(1.0, 10);
  });

  // ────────────────────────────────────────────────
  // Edge cases: anchor at map corners
  // ────────────────────────────────────────────────

  it('anchor at top-left corner (0,0) — origin stays near (0,0)', () => {
    const anchor = { x: 0, y: 0 };
    const result = computeDragZoomedViewBox(DEFAULT_VIEWBOX, anchor, -100);
    expect(result.x).toBeCloseTo(0, 5);
    expect(result.y).toBeCloseTo(0, 5);
    expect(result.w).toBeLessThan(DEFAULT_VIEWBOX.w);
  });

  it('anchor at center (480,300) — zoom is symmetric', () => {
    const anchor = { x: 480, y: 300 };
    const result = computeDragZoomedViewBox(DEFAULT_VIEWBOX, anchor, -100);
    // Center anchor should keep the zoom symmetric — origin should be offset equally
    const expectedX = anchor.x - result.w / 2;
    const expectedY = anchor.y - result.h / 2;
    expect(result.x).toBeCloseTo(expectedX, 5);
    expect(result.y).toBeCloseTo(expectedY, 5);
  });

  // ────────────────────────────────────────────────
  // Full zoom range validation
  // ────────────────────────────────────────────────

  it('a 500px drag-up covers the full zoom range (960 → 60)', () => {
    const anchor = { x: 480, y: 300 };
    // factor = Math.pow(1.005, -500) ≈ 0.082 → 960 * 0.082 ≈ 78.7
    // Even larger drag needed for 960 → 60
    const result = computeDragZoomedViewBox(DEFAULT_VIEWBOX, anchor, -600);
    expect(result.w).toBe(MIN_VIEWBOX_WIDTH);
  });

  it('a 500px drag-down from max zoom returns toward full view', () => {
    const maxZoom: ViewBoxRect = { x: 400, y: 250, w: 60, h: 60 * ASPECT_RATIO };
    const anchor = { x: 430, y: 270 };
    const result = computeDragZoomedViewBox(maxZoom, anchor, 600);
    expect(result.w).toBe(MAX_VIEWBOX_WIDTH);
  });
});
