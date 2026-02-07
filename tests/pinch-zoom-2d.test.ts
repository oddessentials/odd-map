/**
 * Unit tests for 2D SVG pinch-to-zoom math.
 * Tests the pure computePinchZoomedViewBox() function — no DOM or SVG context needed.
 */

import { describe, it, expect } from 'vitest';
import { computePinchZoomedViewBox } from '../src/components/map-svg.js';
import type { ViewBoxRect } from '../src/components/map-svg.js';

const MAP_WIDTH = 960;
const MAP_HEIGHT = 600;
const ASPECT_RATIO = MAP_HEIGHT / MAP_WIDTH; // 0.625
const DEFAULT_VIEWBOX: ViewBoxRect = { x: 0, y: 0, w: MAP_WIDTH, h: MAP_HEIGHT };
const CONTAINER = { width: 800, height: 500 };

describe('computePinchZoomedViewBox', () => {
  // ────────────────────────────────────────────────
  // Pinch apart → zoom in (viewBox shrinks)
  // ────────────────────────────────────────────────

  it('pinch apart (zoom in) shrinks the viewBox', () => {
    const startPointers: [{ x: number; y: number }, { x: number; y: number }] = [
      { x: 350, y: 200 },
      { x: 450, y: 300 },
    ];
    // Move fingers apart (double the distance)
    const currentPointers: [{ x: number; y: number }, { x: number; y: number }] = [
      { x: 300, y: 150 },
      { x: 500, y: 350 },
    ];

    const result = computePinchZoomedViewBox(
      DEFAULT_VIEWBOX,
      startPointers,
      currentPointers,
      CONTAINER
    );
    expect(result.w).toBeLessThan(DEFAULT_VIEWBOX.w);
    expect(result.h).toBeLessThan(DEFAULT_VIEWBOX.h);
  });

  // ────────────────────────────────────────────────
  // Pinch together → zoom out (viewBox grows)
  // ────────────────────────────────────────────────

  it('pinch together (zoom out) grows the viewBox', () => {
    const zoomed: ViewBoxRect = { x: 200, y: 125, w: 480, h: 300 };
    const startPointers: [{ x: number; y: number }, { x: number; y: number }] = [
      { x: 300, y: 150 },
      { x: 500, y: 350 },
    ];
    // Move fingers closer together
    const currentPointers: [{ x: number; y: number }, { x: number; y: number }] = [
      { x: 370, y: 220 },
      { x: 430, y: 280 },
    ];

    const result = computePinchZoomedViewBox(zoomed, startPointers, currentPointers, CONTAINER);
    expect(result.w).toBeGreaterThan(zoomed.w);
    expect(result.h).toBeGreaterThan(zoomed.h);
  });

  // ────────────────────────────────────────────────
  // Zoom centered on midpoint
  // ────────────────────────────────────────────────

  it('zoom centers on midpoint of pointers', () => {
    // Pointers centered at (400, 250) in an 800×500 container
    // Midpoint screen fraction: (0.5, 0.5) → SVG midpoint at (480, 300) for default viewBox
    const startPointers: [{ x: number; y: number }, { x: number; y: number }] = [
      { x: 350, y: 200 },
      { x: 450, y: 300 },
    ];
    const currentPointers: [{ x: number; y: number }, { x: number; y: number }] = [
      { x: 300, y: 150 },
      { x: 500, y: 350 },
    ];

    const result = computePinchZoomedViewBox(
      DEFAULT_VIEWBOX,
      startPointers,
      currentPointers,
      CONTAINER
    );

    // The screen midpoint (400, 250) maps to the same SVG point before and after zoom.
    // Before: SVG = 0 + (400/800)*960 = 480, 0 + (250/500)*600 = 300
    // After: the midpoint in SVG space should stay at (480, 300)
    const midSvgX = result.x + (400 / CONTAINER.width) * result.w;
    const midSvgY = result.y + (250 / CONTAINER.height) * result.h;

    expect(midSvgX).toBeCloseTo(480, 0);
    expect(midSvgY).toBeCloseTo(300, 0);
  });

  // ────────────────────────────────────────────────
  // Clamping at MIN_VIEWBOX_WIDTH (60)
  // ────────────────────────────────────────────────

  it('clamps at maximum zoom (MIN_VIEWBOX_WIDTH = 60)', () => {
    const nearMax: ViewBoxRect = { x: 400, y: 250, w: 80, h: 50 };
    const startPointers: [{ x: number; y: number }, { x: number; y: number }] = [
      { x: 350, y: 200 },
      { x: 450, y: 300 },
    ];
    // Very large pinch apart (10x distance increase)
    const currentPointers: [{ x: number; y: number }, { x: number; y: number }] = [
      { x: 0, y: 0 },
      { x: 800, y: 500 },
    ];

    const result = computePinchZoomedViewBox(nearMax, startPointers, currentPointers, CONTAINER);
    expect(result.w).toBe(60);
    expect(result.h).toBeCloseTo(60 * ASPECT_RATIO);
  });

  // ────────────────────────────────────────────────
  // Clamping at MAX_VIEWBOX_WIDTH (960)
  // ────────────────────────────────────────────────

  it('clamps at minimum zoom (MAX_VIEWBOX_WIDTH = 960)', () => {
    const startPointers: [{ x: number; y: number }, { x: number; y: number }] = [
      { x: 200, y: 150 },
      { x: 600, y: 350 },
    ];
    // Pinch together tightly
    const currentPointers: [{ x: number; y: number }, { x: number; y: number }] = [
      { x: 399, y: 249 },
      { x: 401, y: 251 },
    ];

    const result = computePinchZoomedViewBox(
      DEFAULT_VIEWBOX,
      startPointers,
      currentPointers,
      CONTAINER
    );
    expect(result.w).toBe(960);
    expect(result.h).toBe(600);
  });

  // ────────────────────────────────────────────────
  // No-change when pointers don't move
  // ────────────────────────────────────────────────

  it('returns unchanged viewBox when pointers do not move', () => {
    const startPointers: [{ x: number; y: number }, { x: number; y: number }] = [
      { x: 300, y: 200 },
      { x: 500, y: 300 },
    ];

    const result = computePinchZoomedViewBox(
      DEFAULT_VIEWBOX,
      startPointers,
      startPointers,
      CONTAINER
    );
    expect(result.w).toBeCloseTo(DEFAULT_VIEWBOX.w);
    expect(result.h).toBeCloseTo(DEFAULT_VIEWBOX.h);
  });

  // ────────────────────────────────────────────────
  // Consecutive pinches accumulate
  // ────────────────────────────────────────────────

  it('consecutive pinch-apart gestures progressively zoom in until clamped', () => {
    let vb: ViewBoxRect = { ...DEFAULT_VIEWBOX };
    const widths: number[] = [vb.w];

    for (let i = 0; i < 5; i++) {
      // Each "pinch" starts at current state with fingers 100px apart, ending 200px apart
      const startPointers: [{ x: number; y: number }, { x: number; y: number }] = [
        { x: 350, y: 250 },
        { x: 450, y: 250 },
      ];
      const currentPointers: [{ x: number; y: number }, { x: number; y: number }] = [
        { x: 300, y: 250 },
        { x: 500, y: 250 },
      ];

      vb = computePinchZoomedViewBox(vb, startPointers, currentPointers, CONTAINER);
      widths.push(vb.w);
    }

    // Widths should be non-increasing (zooming in, eventually clamped at 60)
    for (let i = 1; i < widths.length; i++) {
      expect(widths[i]).toBeLessThanOrEqual(widths[i - 1]);
    }
    // Should eventually reach the min clamp
    expect(widths[widths.length - 1]).toBe(60);
  });

  // ────────────────────────────────────────────────
  // Edge clamping at map boundaries
  // ────────────────────────────────────────────────

  it('viewBox x/y stay within map boundaries', () => {
    // Pinch at top-left corner
    const startPointers: [{ x: number; y: number }, { x: number; y: number }] = [
      { x: 10, y: 10 },
      { x: 60, y: 60 },
    ];
    const currentPointers: [{ x: number; y: number }, { x: number; y: number }] = [
      { x: 0, y: 0 },
      { x: 70, y: 70 },
    ];

    const result = computePinchZoomedViewBox(
      DEFAULT_VIEWBOX,
      startPointers,
      currentPointers,
      CONTAINER
    );
    expect(result.x).toBeGreaterThanOrEqual(0);
    expect(result.y).toBeGreaterThanOrEqual(0);
    expect(result.x + result.w).toBeLessThanOrEqual(MAP_WIDTH);
    expect(result.y + result.h).toBeLessThanOrEqual(MAP_HEIGHT);
  });

  it('viewBox clamped at bottom-right boundary', () => {
    // Pinch at bottom-right corner
    const startPointers: [{ x: number; y: number }, { x: number; y: number }] = [
      { x: 750, y: 450 },
      { x: 790, y: 490 },
    ];
    const currentPointers: [{ x: number; y: number }, { x: number; y: number }] = [
      { x: 700, y: 400 },
      { x: 800, y: 500 },
    ];

    const result = computePinchZoomedViewBox(
      DEFAULT_VIEWBOX,
      startPointers,
      currentPointers,
      CONTAINER
    );
    expect(result.x).toBeGreaterThanOrEqual(0);
    expect(result.y).toBeGreaterThanOrEqual(0);
    expect(result.x + result.w).toBeLessThanOrEqual(MAP_WIDTH);
    expect(result.y + result.h).toBeLessThanOrEqual(MAP_HEIGHT);
  });

  // ────────────────────────────────────────────────
  // Aspect ratio preservation
  // ────────────────────────────────────────────────

  it('preserves aspect ratio on pinch zoom in', () => {
    const startPointers: [{ x: number; y: number }, { x: number; y: number }] = [
      { x: 350, y: 200 },
      { x: 450, y: 300 },
    ];
    const currentPointers: [{ x: number; y: number }, { x: number; y: number }] = [
      { x: 250, y: 100 },
      { x: 550, y: 400 },
    ];

    const result = computePinchZoomedViewBox(
      DEFAULT_VIEWBOX,
      startPointers,
      currentPointers,
      CONTAINER
    );
    expect(result.h / result.w).toBeCloseTo(ASPECT_RATIO, 5);
  });

  // ────────────────────────────────────────────────
  // Edge cases
  // ────────────────────────────────────────────────

  it('returns copy of startViewBox for zero-size container', () => {
    const startPointers: [{ x: number; y: number }, { x: number; y: number }] = [
      { x: 300, y: 200 },
      { x: 500, y: 300 },
    ];
    const currentPointers: [{ x: number; y: number }, { x: number; y: number }] = [
      { x: 250, y: 150 },
      { x: 550, y: 350 },
    ];

    const result = computePinchZoomedViewBox(DEFAULT_VIEWBOX, startPointers, currentPointers, {
      width: 0,
      height: 0,
    });
    expect(result.w).toBe(DEFAULT_VIEWBOX.w);
    expect(result.h).toBe(DEFAULT_VIEWBOX.h);
  });

  it('returns copy when start distance is zero (coincident pointers)', () => {
    const coincident: [{ x: number; y: number }, { x: number; y: number }] = [
      { x: 400, y: 250 },
      { x: 400, y: 250 },
    ];
    const currentPointers: [{ x: number; y: number }, { x: number; y: number }] = [
      { x: 350, y: 200 },
      { x: 450, y: 300 },
    ];

    const result = computePinchZoomedViewBox(
      DEFAULT_VIEWBOX,
      coincident,
      currentPointers,
      CONTAINER
    );
    expect(result.w).toBe(DEFAULT_VIEWBOX.w);
  });
});
