/**
 * Unit tests for 2D SVG scroll-wheel zoom math.
 * Tests the pure computeZoomedViewBox() function — no DOM or SVG context needed.
 */

import { describe, it, expect } from 'vitest';
import { computeZoomedViewBox } from '../src/components/map-svg.js';
import type { ViewBoxRect } from '../src/components/map-svg.js';

const DEFAULT_VIEWBOX: ViewBoxRect = { x: 0, y: 0, w: 960, h: 600 };
const ASPECT_RATIO = 600 / 960; // 0.625

describe('computeZoomedViewBox', () => {
  // ────────────────────────────────────────────────
  // Basic zoom-in / zoom-out
  // ────────────────────────────────────────────────

  it('zooms in at center of map (shrinks viewBox by factor 0.9)', () => {
    const cursor = { x: 480, y: 300 };
    const result = computeZoomedViewBox(DEFAULT_VIEWBOX, cursor, true);
    expect(result.w).toBeCloseTo(960 * 0.9);
    expect(result.h).toBeCloseTo(600 * 0.9);
  });

  it('zooms out from a zoomed-in state (grows viewBox by factor 1.1)', () => {
    const zoomed: ViewBoxRect = { x: 200, y: 100, w: 480, h: 300 };
    const cursor = { x: 440, y: 250 };
    const result = computeZoomedViewBox(zoomed, cursor, false);
    expect(result.w).toBeCloseTo(480 * 1.1);
    expect(result.h).toBeCloseTo(300 * 1.1);
  });

  // ────────────────────────────────────────────────
  // Cursor-relative positioning (zoom point stays fixed)
  // ────────────────────────────────────────────────

  it('zooms in at top-left corner — origin stays near (0,0)', () => {
    const cursor = { x: 0, y: 0 };
    const result = computeZoomedViewBox(DEFAULT_VIEWBOX, cursor, true);
    expect(result.w).toBeCloseTo(960 * 0.9);
    expect(result.x).toBeCloseTo(0);
    expect(result.y).toBeCloseTo(0);
  });

  it('zooms in at bottom-right corner — origin shifts right/down', () => {
    const cursor = { x: 960, y: 600 };
    const result = computeZoomedViewBox(DEFAULT_VIEWBOX, cursor, true);
    expect(result.w).toBeCloseTo(960 * 0.9);
    expect(result.x).toBeGreaterThan(0);
    expect(result.y).toBeGreaterThan(0);
  });

  it('cursor fractional position is preserved after zoom-in', () => {
    const current: ViewBoxRect = { x: 100, y: 50, w: 500, h: 312.5 };
    const cursor = { x: 300, y: 200 };
    const result = computeZoomedViewBox(current, cursor, true);

    const fracBefore = {
      fx: (cursor.x - current.x) / current.w,
      fy: (cursor.y - current.y) / current.h,
    };
    const fracAfter = {
      fx: (cursor.x - result.x) / result.w,
      fy: (cursor.y - result.y) / result.h,
    };

    expect(fracAfter.fx).toBeCloseTo(fracBefore.fx, 10);
    expect(fracAfter.fy).toBeCloseTo(fracBefore.fy, 10);
  });

  it('cursor fractional position is preserved after zoom-out', () => {
    const current: ViewBoxRect = { x: 200, y: 100, w: 400, h: 250 };
    const cursor = { x: 400, y: 225 };
    const result = computeZoomedViewBox(current, cursor, false);

    const fracBefore = {
      fx: (cursor.x - current.x) / current.w,
      fy: (cursor.y - current.y) / current.h,
    };
    const fracAfter = {
      fx: (cursor.x - result.x) / result.w,
      fy: (cursor.y - result.y) / result.h,
    };

    expect(fracAfter.fx).toBeCloseTo(fracBefore.fx, 10);
    expect(fracAfter.fy).toBeCloseTo(fracBefore.fy, 10);
  });

  it('cursor position is stable across different cursor locations', () => {
    // Test several arbitrary cursor points to ensure the formula works universally
    const positions = [
      { x: 100, y: 80 },
      { x: 700, y: 450 },
      { x: 480, y: 300 },
      { x: 50, y: 550 },
    ];

    const current: ViewBoxRect = { x: 0, y: 0, w: 960, h: 600 };

    for (const cursor of positions) {
      const result = computeZoomedViewBox(current, cursor, true);
      const fracBefore = (cursor.x - current.x) / current.w;
      const fracAfter = (cursor.x - result.x) / result.w;
      expect(fracAfter).toBeCloseTo(fracBefore, 10);
    }
  });

  // ────────────────────────────────────────────────
  // Clamping behavior
  // ────────────────────────────────────────────────

  it('clamps at minimum zoom — viewBox cannot exceed 960x600', () => {
    const cursor = { x: 480, y: 300 };
    const result = computeZoomedViewBox(DEFAULT_VIEWBOX, cursor, false);
    expect(result.w).toBe(960);
    expect(result.h).toBe(600);
  });

  it('clamps at maximum zoom — viewBox width cannot go below 60', () => {
    const veryZoomed: ViewBoxRect = { x: 400, y: 250, w: 62, h: 62 * ASPECT_RATIO };
    const cursor = { x: 431, y: 269 };
    const result = computeZoomedViewBox(veryZoomed, cursor, true);
    expect(result.w).toBe(60);
    expect(result.h).toBeCloseTo(60 * ASPECT_RATIO);
  });

  it('stays clamped at max zoom on repeated zoom-in attempts', () => {
    const atMax: ViewBoxRect = { x: 400, y: 250, w: 60, h: 60 * ASPECT_RATIO };
    const cursor = { x: 430, y: 270 };
    const result = computeZoomedViewBox(atMax, cursor, true);
    expect(result.w).toBe(60);
    expect(result.h).toBeCloseTo(60 * ASPECT_RATIO);
  });

  it('stays clamped at min zoom on repeated zoom-out attempts', () => {
    const cursor = { x: 480, y: 300 };
    // First zoom-out hits clamp
    const r1 = computeZoomedViewBox(DEFAULT_VIEWBOX, cursor, false);
    expect(r1.w).toBe(960);
    // Second zoom-out stays clamped
    const r2 = computeZoomedViewBox(r1, cursor, false);
    expect(r2.w).toBe(960);
    expect(r2.h).toBe(600);
  });

  it('clamp near max zoom boundary preserves aspect ratio', () => {
    // viewBox width 65 * 0.9 = 58.5, which gets clamped to 60
    const nearMax: ViewBoxRect = { x: 400, y: 250, w: 65, h: 65 * ASPECT_RATIO };
    const cursor = { x: 432, y: 270 };
    const result = computeZoomedViewBox(nearMax, cursor, true);
    expect(result.w).toBe(60);
    expect(result.h).toBeCloseTo(60 * ASPECT_RATIO);
  });

  it('clamp near min zoom boundary preserves aspect ratio', () => {
    // viewBox width 900 * 1.1 = 990 > 960, gets clamped to 960
    const nearMin: ViewBoxRect = { x: 30, y: 18.75, w: 900, h: 900 * ASPECT_RATIO };
    const cursor = { x: 480, y: 300 };
    const result = computeZoomedViewBox(nearMin, cursor, false);
    expect(result.w).toBe(960);
    expect(result.h).toBe(600);
  });

  // ────────────────────────────────────────────────
  // Aspect ratio preservation
  // ────────────────────────────────────────────────

  it('preserves 960:600 aspect ratio on zoom-in', () => {
    const cursor = { x: 480, y: 300 };
    const result = computeZoomedViewBox(DEFAULT_VIEWBOX, cursor, true);
    expect(result.h / result.w).toBeCloseTo(ASPECT_RATIO, 10);
  });

  it('preserves aspect ratio on zoom-out', () => {
    const zoomed: ViewBoxRect = { x: 200, y: 125, w: 400, h: 250 };
    const cursor = { x: 400, y: 250 };
    const result = computeZoomedViewBox(zoomed, cursor, false);
    expect(result.h / result.w).toBeCloseTo(ASPECT_RATIO, 10);
  });

  it('preserves aspect ratio through many consecutive zooms', () => {
    const cursor = { x: 300, y: 200 };
    let vb: ViewBoxRect = { ...DEFAULT_VIEWBOX };

    // Zoom in 15 times
    for (let i = 0; i < 15; i++) {
      vb = computeZoomedViewBox(vb, cursor, true);
    }
    expect(vb.h / vb.w).toBeCloseTo(ASPECT_RATIO, 5);

    // Zoom out 15 times
    for (let i = 0; i < 15; i++) {
      vb = computeZoomedViewBox(vb, cursor, false);
    }
    expect(vb.h / vb.w).toBeCloseTo(ASPECT_RATIO, 5);
  });

  // ────────────────────────────────────────────────
  // Consecutive zoom accumulation
  // ────────────────────────────────────────────────

  it('consecutive zoom-ins progressively shrink viewBox', () => {
    const cursor = { x: 480, y: 300 };
    let vb: ViewBoxRect = { ...DEFAULT_VIEWBOX };
    const widths: number[] = [vb.w];

    for (let i = 0; i < 5; i++) {
      vb = computeZoomedViewBox(vb, cursor, true);
      widths.push(vb.w);
    }

    // Each width should be strictly smaller than the previous
    for (let i = 1; i < widths.length; i++) {
      expect(widths[i]).toBeLessThan(widths[i - 1]);
    }
  });

  it('consecutive zoom-outs progressively grow viewBox until clamped', () => {
    const cursor = { x: 300, y: 200 };
    let vb: ViewBoxRect = { x: 200, y: 125, w: 400, h: 250 };
    const widths: number[] = [vb.w];

    for (let i = 0; i < 20; i++) {
      vb = computeZoomedViewBox(vb, cursor, false);
      widths.push(vb.w);
    }

    // Widths should be non-decreasing (grow until clamped at 960)
    for (let i = 1; i < widths.length; i++) {
      expect(widths[i]).toBeGreaterThanOrEqual(widths[i - 1]);
    }
    // Should eventually reach the clamp
    expect(widths[widths.length - 1]).toBe(960);
  });

  it('zoom-in followed by equal zoom-out returns approximately to starting viewBox', () => {
    const cursor = { x: 480, y: 300 };
    const original: ViewBoxRect = { x: 100, y: 62.5, w: 600, h: 375 };

    const zoomedIn = computeZoomedViewBox(original, cursor, true);
    const zoomedBack = computeZoomedViewBox(zoomedIn, cursor, false);

    // 0.9 * 1.1 = 0.99, so there's a small ~1% drift per round-trip
    expect(zoomedBack.w).toBeCloseTo(original.w * 0.99, 1);
    expect(zoomedBack.h).toBeCloseTo(original.h * 0.99, 1);
  });

  // ────────────────────────────────────────────────
  // Full zoom range validation (SC-001)
  // ────────────────────────────────────────────────

  it('can zoom from full view to max zoom within ~28 steps', () => {
    const cursor = { x: 480, y: 300 };
    let vb: ViewBoxRect = { ...DEFAULT_VIEWBOX };
    let steps = 0;

    while (vb.w > 60 && steps < 50) {
      vb = computeZoomedViewBox(vb, cursor, true);
      steps++;
    }

    expect(vb.w).toBe(60);
    expect(steps).toBeLessThanOrEqual(30); // Should take ~28 steps
    expect(steps).toBeGreaterThanOrEqual(20); // Sanity lower bound
  });

  it('can zoom from max zoom back to full view', () => {
    const cursor = { x: 480, y: 300 };
    let vb: ViewBoxRect = { x: 400, y: 250, w: 60, h: 60 * ASPECT_RATIO };
    let steps = 0;

    while (vb.w < 960 && steps < 50) {
      vb = computeZoomedViewBox(vb, cursor, false);
      steps++;
    }

    expect(vb.w).toBe(960);
    expect(vb.h).toBe(600);
  });
});
