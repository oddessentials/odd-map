/**
 * Unit Tests - Bounds Clamping
 *
 * Tests the pure clampBounds function for viewBox calculation.
 */

import { describe, it, expect } from 'vitest';
import { clampBounds } from '../src/lib/bounds-clamping';

describe('clampBounds', () => {
  const MAP_WIDTH = 960;
  const MAP_HEIGHT = 600;
  const PADDING = 30;

  it('handles left-only clamping', () => {
    const bbox = { x: 10, y: 100, width: 100, height: 80 };
    const result = clampBounds(bbox, PADDING, MAP_WIDTH, MAP_HEIGHT);

    expect(result.x).toBe(0); // 10 - 30 = -20 → clamped to 0
    expect(result.width).toBe(140); // (10 + 100 + 30) - 0 = 140
  });

  it('handles right-only clamping', () => {
    const bbox = { x: 900, y: 100, width: 50, height: 80 };
    const result = clampBounds(bbox, PADDING, MAP_WIDTH, MAP_HEIGHT);

    expect(result.x).toBe(870); // 900 - 30 = 870
    expect(result.width).toBe(90); // min(960, 980) - 870 = 90
  });

  it('handles top-only clamping', () => {
    const bbox = { x: 100, y: 10, width: 100, height: 80 };
    const result = clampBounds(bbox, PADDING, MAP_WIDTH, MAP_HEIGHT);

    expect(result.y).toBe(0); // 10 - 30 = -20 → clamped to 0
    expect(result.height).toBe(120); // (10 + 80 + 30) - 0 = 120
  });

  it('handles bottom-only clamping', () => {
    const bbox = { x: 100, y: 550, width: 100, height: 40 };
    const result = clampBounds(bbox, PADDING, MAP_WIDTH, MAP_HEIGHT);

    expect(result.y).toBe(520); // 550 - 30 = 520
    expect(result.height).toBe(80); // min(600, 620) - 520 = 80
  });

  it('handles both-side clamping', () => {
    const bbox = { x: -10, y: 0, width: 980, height: 620 };
    const result = clampBounds(bbox, PADDING, MAP_WIDTH, MAP_HEIGHT);

    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
    expect(result.width).toBe(960);
    expect(result.height).toBe(600);
  });

  it('handles zero-size bounding box', () => {
    const bbox = { x: 100, y: 100, width: 0, height: 0 };
    const result = clampBounds(bbox, PADDING, MAP_WIDTH, MAP_HEIGHT);

    expect(result.width).toBe(60); // padding * 2
    expect(result.height).toBe(60);
  });

  it('guarantees non-negative dimensions for out-of-bounds bbox', () => {
    // Edge case: bbox is entirely outside the map
    const bbox = { x: 1000, y: 700, width: 10, height: 10 };
    const result = clampBounds(bbox, PADDING, MAP_WIDTH, MAP_HEIGHT);

    expect(result.width).toBeGreaterThanOrEqual(0);
    expect(result.height).toBeGreaterThanOrEqual(0);
  });

  it('no clamping when fully inside map', () => {
    const bbox = { x: 200, y: 150, width: 300, height: 200 };
    const result = clampBounds(bbox, PADDING, MAP_WIDTH, MAP_HEIGHT);

    expect(result.x).toBe(170); // 200 - 30
    expect(result.y).toBe(120); // 150 - 30
    expect(result.width).toBe(360); // 300 + 60
    expect(result.height).toBe(260); // 200 + 60
  });

  it('handles zero padding', () => {
    const bbox = { x: 100, y: 100, width: 200, height: 150 };
    const result = clampBounds(bbox, 0, MAP_WIDTH, MAP_HEIGHT);

    expect(result.x).toBe(100);
    expect(result.y).toBe(100);
    expect(result.width).toBe(200);
    expect(result.height).toBe(150);
  });
});
