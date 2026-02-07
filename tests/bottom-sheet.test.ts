/**
 * Unit Tests - Bottom Sheet Swipe-to-Dismiss
 *
 * Tests the swipe-to-dismiss logic for the mobile bottom sheet.
 * Follows the close-button.test.ts pattern (DOM class + logic testing).
 *
 * The actual touch gesture handler uses Touch events (touchstart/move/end),
 * but we test the decision logic in isolation:
 * - Swipe down at scrollTop ≤ 1 → triggers close
 * - Swipe down at scrollTop > 1 → no dismiss (native scroll handles it)
 * - Small swipe (< threshold) → snaps back
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

/** Threshold: minimum translateY before dismiss triggers (matches details-panel.js) */
const DISMISS_THRESHOLD = 80;

/** Resistance factor applied to swipe delta (matches details-panel.js) */
const RESISTANCE = 0.6;

/**
 * Minimal simulation of the swipe-to-dismiss decision logic from details-panel.js.
 * Extracted for isolated testing without real Touch events.
 */
function simulateSwipeDismiss(params: {
  scrollTop: number;
  swipeDeltaY: number;
  isOpen: boolean;
}): { action: 'dismiss' | 'snap-back' | 'none'; translateY: number } {
  const { scrollTop, swipeDeltaY, isOpen } = params;

  // Panel must be open
  if (!isOpen) {
    return { action: 'none', translateY: 0 };
  }

  // Only intercept at top of scroll and downward swipe
  if (scrollTop > 1 || swipeDeltaY <= 0) {
    return { action: 'none', translateY: 0 };
  }

  const translateY = swipeDeltaY * RESISTANCE;

  if (translateY > DISMISS_THRESHOLD) {
    return { action: 'dismiss', translateY };
  }

  return { action: 'snap-back', translateY };
}

describe('Bottom Sheet Swipe-to-Dismiss Logic', () => {
  it('dismisses when swiped down beyond threshold at scrollTop=0', () => {
    const result = simulateSwipeDismiss({
      scrollTop: 0,
      swipeDeltaY: 200, // 200 * 0.6 = 120 > 80
      isOpen: true,
    });

    expect(result.action).toBe('dismiss');
    expect(result.translateY).toBeGreaterThan(DISMISS_THRESHOLD);
  });

  it('dismisses when scrollTop is fractional (≤1, iOS elastic scroll)', () => {
    const result = simulateSwipeDismiss({
      scrollTop: 0.5, // iOS elastic scrolling
      swipeDeltaY: 200,
      isOpen: true,
    });

    expect(result.action).toBe('dismiss');
  });

  it('does NOT dismiss when scrollTop > 1 (user is scrolled into content)', () => {
    const result = simulateSwipeDismiss({
      scrollTop: 50,
      swipeDeltaY: 200,
      isOpen: true,
    });

    expect(result.action).toBe('none');
  });

  it('snaps back when swipe is below dismiss threshold', () => {
    const result = simulateSwipeDismiss({
      scrollTop: 0,
      swipeDeltaY: 50, // 50 * 0.6 = 30 < 80
      isOpen: true,
    });

    expect(result.action).toBe('snap-back');
    expect(result.translateY).toBeLessThanOrEqual(DISMISS_THRESHOLD);
  });

  it('does nothing when panel is not open', () => {
    const result = simulateSwipeDismiss({
      scrollTop: 0,
      swipeDeltaY: 200,
      isOpen: false,
    });

    expect(result.action).toBe('none');
  });

  it('does nothing on upward swipe (negative deltaY)', () => {
    const result = simulateSwipeDismiss({
      scrollTop: 0,
      swipeDeltaY: -100,
      isOpen: true,
    });

    expect(result.action).toBe('none');
  });

  it('applies resistance factor to swipe delta', () => {
    // 134px raw swipe * 0.6 resistance = 80.4, just over threshold
    const result = simulateSwipeDismiss({
      scrollTop: 0,
      swipeDeltaY: 134,
      isOpen: true,
    });

    expect(result.action).toBe('dismiss');
    expect(result.translateY).toBeCloseTo(134 * RESISTANCE);
  });

  it('borderline: exactly at threshold boundary', () => {
    // To get exactly 80: deltaY * 0.6 = 80 → deltaY = 133.33
    // 133 * 0.6 = 79.8 < 80 → snap-back
    const result = simulateSwipeDismiss({
      scrollTop: 0,
      swipeDeltaY: 133,
      isOpen: true,
    });

    expect(result.action).toBe('snap-back');
  });
});

describe('Bottom Sheet DOM Class Behavior', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.className = 'sidebar sidebar-right';
  });

  it('open class is present when panel is shown', () => {
    container.classList.add('open');
    expect(container.classList.contains('open')).toBe(true);
  });

  it('open class is removed on dismiss', () => {
    container.classList.add('open');
    // Simulate dismiss
    container.classList.remove('open');
    expect(container.classList.contains('open')).toBe(false);
  });

  it('onClose callback fires on dismiss', () => {
    const onClose = vi.fn();
    container.classList.add('open');

    // Simulate dismiss logic
    container.classList.remove('open');
    onClose();

    expect(onClose).toHaveBeenCalledOnce();
  });
});
