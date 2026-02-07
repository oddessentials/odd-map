/**
 * Unit tests for 2D SVG drag-pan math.
 * Tests the pure computeDragPannedViewBox() function — no DOM or SVG context needed.
 */

import { describe, it, expect } from 'vitest';
import { computeDragPannedViewBox } from '../src/components/map-svg.js';
import type { ViewBoxRect } from '../src/components/map-svg.js';

const MAP_WIDTH = 960;
const MAP_HEIGHT = 600;
const DEFAULT_VIEWBOX: ViewBoxRect = { x: 0, y: 0, w: 960, h: 600 };
const CONTAINER = { width: 960, height: 600 };

describe('computeDragPannedViewBox', () => {
  // ────────────────────────────────────────────────
  // Basic pan direction
  // ────────────────────────────────────────────────

  it('dragging left (negative dx) moves viewBox origin right', () => {
    const zoomed: ViewBoxRect = { x: 200, y: 125, w: 480, h: 300 };
    const result = computeDragPannedViewBox(zoomed, { dx: -100, dy: 0 }, CONTAINER);
    expect(result.x).toBeGreaterThan(zoomed.x);
  });

  it('dragging right (positive dx) moves viewBox origin left', () => {
    const zoomed: ViewBoxRect = { x: 200, y: 125, w: 480, h: 300 };
    const result = computeDragPannedViewBox(zoomed, { dx: 100, dy: 0 }, CONTAINER);
    expect(result.x).toBeLessThan(zoomed.x);
  });

  it('dragging up (negative dy) moves viewBox origin down', () => {
    const zoomed: ViewBoxRect = { x: 200, y: 125, w: 480, h: 300 };
    const result = computeDragPannedViewBox(zoomed, { dx: 0, dy: -100 }, CONTAINER);
    expect(result.y).toBeGreaterThan(zoomed.y);
  });

  it('dragging down (positive dy) moves viewBox origin up', () => {
    const zoomed: ViewBoxRect = { x: 200, y: 125, w: 480, h: 300 };
    const result = computeDragPannedViewBox(zoomed, { dx: 0, dy: 100 }, CONTAINER);
    expect(result.y).toBeLessThan(zoomed.y);
  });

  // ────────────────────────────────────────────────
  // Zero delta
  // ────────────────────────────────────────────────

  it('zero delta produces no change', () => {
    const zoomed: ViewBoxRect = { x: 200, y: 125, w: 480, h: 300 };
    const result = computeDragPannedViewBox(zoomed, { dx: 0, dy: 0 }, CONTAINER);
    expect(result.x).toBe(zoomed.x);
    expect(result.y).toBe(zoomed.y);
    expect(result.w).toBe(zoomed.w);
    expect(result.h).toBe(zoomed.h);
  });

  // ────────────────────────────────────────────────
  // Proportionality
  // ────────────────────────────────────────────────

  it('pan amount is proportional to drag distance', () => {
    const zoomed: ViewBoxRect = { x: 200, y: 125, w: 480, h: 300 };
    const small = computeDragPannedViewBox(zoomed, { dx: -50, dy: 0 }, CONTAINER);
    const large = computeDragPannedViewBox(zoomed, { dx: -100, dy: 0 }, CONTAINER);
    const smallShift = small.x - zoomed.x;
    const largeShift = large.x - zoomed.x;
    expect(largeShift).toBeCloseTo(smallShift * 2, 5);
  });

  it('pan scales with zoom level — smaller viewBox = less SVG movement per pixel', () => {
    const halfZoom: ViewBoxRect = { x: 200, y: 125, w: 480, h: 300 };
    const quarterZoom: ViewBoxRect = { x: 300, y: 200, w: 240, h: 150 };

    const halfResult = computeDragPannedViewBox(halfZoom, { dx: -100, dy: 0 }, CONTAINER);
    const quarterResult = computeDragPannedViewBox(quarterZoom, { dx: -100, dy: 0 }, CONTAINER);

    const halfShift = halfResult.x - halfZoom.x;
    const quarterShift = quarterResult.x - quarterZoom.x;

    // Quarter zoom (smaller viewBox) should move less in SVG space
    expect(Math.abs(quarterShift)).toBeLessThan(Math.abs(halfShift));
    // Should be exactly half the shift (proportional to viewBox width ratio)
    expect(quarterShift).toBeCloseTo(halfShift / 2, 5);
  });

  // ────────────────────────────────────────────────
  // Diagonal drag
  // ────────────────────────────────────────────────

  it('diagonal drag moves both x and y', () => {
    const zoomed: ViewBoxRect = { x: 200, y: 125, w: 480, h: 300 };
    const result = computeDragPannedViewBox(zoomed, { dx: -50, dy: -50 }, CONTAINER);
    expect(result.x).toBeGreaterThan(zoomed.x);
    expect(result.y).toBeGreaterThan(zoomed.y);
  });

  // ────────────────────────────────────────────────
  // Clamping
  // ────────────────────────────────────────────────

  it('clamping: x cannot go below 0', () => {
    const zoomed: ViewBoxRect = { x: 10, y: 125, w: 480, h: 300 };
    const result = computeDragPannedViewBox(zoomed, { dx: 100, dy: 0 }, CONTAINER);
    expect(result.x).toBe(0);
  });

  it('clamping: x cannot exceed MAP_WIDTH - viewBox.w', () => {
    const zoomed: ViewBoxRect = { x: 470, y: 125, w: 480, h: 300 };
    const result = computeDragPannedViewBox(zoomed, { dx: -100, dy: 0 }, CONTAINER);
    expect(result.x).toBe(MAP_WIDTH - zoomed.w);
  });

  it('clamping: y cannot go below 0', () => {
    const zoomed: ViewBoxRect = { x: 200, y: 10, w: 480, h: 300 };
    const result = computeDragPannedViewBox(zoomed, { dx: 0, dy: 100 }, CONTAINER);
    expect(result.y).toBe(0);
  });

  it('clamping: y cannot exceed MAP_HEIGHT - viewBox.h', () => {
    const zoomed: ViewBoxRect = { x: 200, y: 290, w: 480, h: 300 };
    const result = computeDragPannedViewBox(zoomed, { dx: 0, dy: -100 }, CONTAINER);
    expect(result.y).toBe(MAP_HEIGHT - zoomed.h);
  });

  // ────────────────────────────────────────────────
  // Fully zoomed out — pan has no effect
  // ────────────────────────────────────────────────

  it('fully zoomed out (viewBox.w === 960, viewBox.h === 600): pan has no effect — clamped to (0,0)', () => {
    const result = computeDragPannedViewBox(DEFAULT_VIEWBOX, { dx: -200, dy: -200 }, CONTAINER);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
    expect(result.w).toBe(MAP_WIDTH);
    expect(result.h).toBe(MAP_HEIGHT);
  });

  // ────────────────────────────────────────────────
  // Width and height unchanged
  // ────────────────────────────────────────────────

  it('width and height are never modified by pan', () => {
    const zoomed: ViewBoxRect = { x: 200, y: 125, w: 480, h: 300 };
    const deltas = [
      { dx: -100, dy: 0 },
      { dx: 100, dy: 0 },
      { dx: 0, dy: -100 },
      { dx: 0, dy: 100 },
      { dx: -50, dy: -50 },
      { dx: 200, dy: 200 },
    ];

    for (const delta of deltas) {
      const result = computeDragPannedViewBox(zoomed, delta, CONTAINER);
      expect(result.w).toBe(zoomed.w);
      expect(result.h).toBe(zoomed.h);
    }
  });

  // ────────────────────────────────────────────────
  // Reversibility
  // ────────────────────────────────────────────────

  it('reversibility: dragging left then right same amount returns to start', () => {
    const zoomed: ViewBoxRect = { x: 200, y: 125, w: 480, h: 300 };
    const left = computeDragPannedViewBox(zoomed, { dx: -80, dy: 0 }, CONTAINER);
    // Dragging back is equivalent to computing from original start with dx=0
    const back = computeDragPannedViewBox(zoomed, { dx: 0, dy: 0 }, CONTAINER);
    expect(back.x).toBe(zoomed.x);
    expect(back.y).toBe(zoomed.y);

    // Also verify: the shift from one direction is exactly reversed
    const shiftRight = left.x - zoomed.x;
    const rightResult = computeDragPannedViewBox(zoomed, { dx: 80, dy: 0 }, CONTAINER);
    const shiftLeft = rightResult.x - zoomed.x;
    expect(shiftRight + shiftLeft).toBeCloseTo(0, 10);
  });
});
