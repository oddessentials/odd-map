/**
 * Unit Tests - Resize Debounce
 *
 * Tests that the debounce pattern used by the 3D map's onResize handler
 * correctly coalesces rapid resize events into a single update.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Resize Debounce Pattern', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('coalesces rapid resize events into a single handler call', () => {
    const updateFn = vi.fn();
    let timeout: ReturnType<typeof setTimeout> | null = null;

    function debouncedResize() {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        updateFn();
      }, 100);
    }

    // Simulate rapid resize events (e.g., window drag)
    debouncedResize();
    debouncedResize();
    debouncedResize();
    debouncedResize();
    debouncedResize();

    // Before timeout, handler should not be called
    expect(updateFn).not.toHaveBeenCalled();

    // After timeout, handler should be called exactly once
    vi.advanceTimersByTime(100);
    expect(updateFn).toHaveBeenCalledTimes(1);
  });

  it('resets timer on each new resize event', () => {
    const updateFn = vi.fn();
    let timeout: ReturnType<typeof setTimeout> | null = null;

    function debouncedResize() {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        updateFn();
      }, 100);
    }

    // First resize
    debouncedResize();
    vi.advanceTimersByTime(80); // Almost at threshold

    // Another resize resets the timer
    debouncedResize();
    vi.advanceTimersByTime(80); // 80ms after second resize

    expect(updateFn).not.toHaveBeenCalled(); // Still waiting

    vi.advanceTimersByTime(20); // Now 100ms after second resize
    expect(updateFn).toHaveBeenCalledTimes(1);
  });

  it('allows multiple distinct resize sequences', () => {
    const updateFn = vi.fn();
    let timeout: ReturnType<typeof setTimeout> | null = null;

    function debouncedResize() {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        updateFn();
      }, 100);
    }

    // First sequence
    debouncedResize();
    vi.advanceTimersByTime(100);
    expect(updateFn).toHaveBeenCalledTimes(1);

    // Second sequence (after a pause)
    debouncedResize();
    vi.advanceTimersByTime(100);
    expect(updateFn).toHaveBeenCalledTimes(2);
  });

  it('can be cancelled by clearing timeout', () => {
    const updateFn = vi.fn();
    let timeout: ReturnType<typeof setTimeout> | null = null;

    function debouncedResize() {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        updateFn();
      }, 100);
    }

    // Start resize
    debouncedResize();

    // Cancel (simulate dispose)
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    vi.advanceTimersByTime(200);
    expect(updateFn).not.toHaveBeenCalled();
  });

  it('skips update when container dimensions are zero', () => {
    const updateFn = vi.fn();
    let timeout: ReturnType<typeof setTimeout> | null = null;

    // Simulate the guard condition from map-3d.js
    function debouncedResize(width: number, height: number) {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        if (width === 0 || height === 0) return;
        updateFn();
      }, 100);
    }

    debouncedResize(0, 0);
    vi.advanceTimersByTime(100);
    expect(updateFn).not.toHaveBeenCalled();

    debouncedResize(800, 600);
    vi.advanceTimersByTime(100);
    expect(updateFn).toHaveBeenCalledTimes(1);
  });
});
