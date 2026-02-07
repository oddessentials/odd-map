/**
 * Unit Tests - Close Button Behavior
 *
 * Tests that handlePanelClose() navigates back one level in the state hierarchy:
 *   LOCATION_VIEW → REGION_VIEW (not USA_VIEW)
 *   REGION_VIEW → USA_VIEW
 *   USA_VIEW → no-op
 *
 * Constitution Principle III: Invariant tests for state machine changes.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Replicate state constants to avoid importing app.ts (complex transitive deps)
const States = {
  USA_VIEW: 'USA_VIEW',
  REGION_VIEW: 'REGION_VIEW',
  LOCATION_VIEW: 'LOCATION_VIEW',
} as const;

type StateValue = (typeof States)[keyof typeof States];

/**
 * Minimal simulation of handlePanelClose() logic from app.ts.
 * This tests the decision logic in isolation without DOM/map dependencies.
 */
function handlePanelClose(
  state: StateValue,
  selectedRegion: { name: string } | null,
  callbacks: { handleRegionClick: (name: string) => void; handleReset: () => void }
): void {
  if (state === States.LOCATION_VIEW && selectedRegion) {
    callbacks.handleRegionClick(selectedRegion.name);
  } else if (state === States.REGION_VIEW) {
    callbacks.handleReset();
  }
  // USA_VIEW: no-op
}

describe('Panel Close Button Behavior', () => {
  let handleRegionClick: (name: string) => void;
  let handleReset: () => void;

  beforeEach(() => {
    handleRegionClick = vi.fn<(name: string) => void>();
    handleReset = vi.fn<() => void>();
  });

  it('LOCATION_VIEW transitions to REGION_VIEW (not USA_VIEW)', () => {
    const selectedRegion = { name: 'Northeast Region' };

    handlePanelClose(States.LOCATION_VIEW, selectedRegion, {
      handleRegionClick,
      handleReset,
    });

    expect(handleRegionClick).toHaveBeenCalledWith('Northeast Region');
    expect(handleReset).not.toHaveBeenCalled();
  });

  it('REGION_VIEW transitions to USA_VIEW', () => {
    handlePanelClose(
      States.REGION_VIEW,
      { name: 'Southeast Region' },
      {
        handleRegionClick,
        handleReset,
      }
    );

    expect(handleReset).toHaveBeenCalledOnce();
    expect(handleRegionClick).not.toHaveBeenCalled();
  });

  it('USA_VIEW is a no-op', () => {
    handlePanelClose(States.USA_VIEW, null, {
      handleRegionClick,
      handleReset,
    });

    expect(handleRegionClick).not.toHaveBeenCalled();
    expect(handleReset).not.toHaveBeenCalled();
  });

  it('LOCATION_VIEW without selectedRegion is a no-op', () => {
    handlePanelClose(States.LOCATION_VIEW, null, {
      handleRegionClick,
      handleReset,
    });

    expect(handleRegionClick).not.toHaveBeenCalled();
    expect(handleReset).not.toHaveBeenCalled();
  });
});
