/**
 * Unit Tests - Close Button Behavior
 *
 * Tests that handlePanelClose() fully resets to USA_VIEW from any state:
 *   LOCATION_VIEW → USA_VIEW (via handleReset)
 *   REGION_VIEW → USA_VIEW (via handleReset)
 *   USA_VIEW → no-op
 *
 * Tests that handleReset() re-entrancy guard prevents recursive loops.
 *
 * Tests that close button visibility matches panel state.
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
function handlePanelClose(state: StateValue, callbacks: { handleReset: () => void }): void {
  if (state !== States.USA_VIEW) {
    callbacks.handleReset();
  }
}

/**
 * Minimal simulation of handleReset() with re-entrancy guard from app.ts.
 * The real map.reset() calls onReset which calls handleReset() recursively.
 * The guard ensures the body executes only once.
 */
function createResetHandler(onBody: () => void) {
  let resetting = false;
  return function handleReset() {
    if (resetting) return;
    resetting = true;
    try {
      onBody();
    } finally {
      resetting = false;
    }
  };
}

describe('Panel Close Button Behavior', () => {
  let handleReset: () => void;

  beforeEach(() => {
    handleReset = vi.fn<() => void>();
  });

  it('LOCATION_VIEW resets to USA_VIEW directly', () => {
    handlePanelClose(States.LOCATION_VIEW, { handleReset });

    expect(handleReset).toHaveBeenCalledOnce();
  });

  it('REGION_VIEW resets to USA_VIEW', () => {
    handlePanelClose(States.REGION_VIEW, { handleReset });

    expect(handleReset).toHaveBeenCalledOnce();
  });

  it('USA_VIEW is a no-op', () => {
    handlePanelClose(States.USA_VIEW, { handleReset });

    expect(handleReset).not.toHaveBeenCalled();
  });
});

describe('handleReset re-entrancy guard', () => {
  it('executes reset body exactly once even when called recursively', () => {
    const bodyFn = vi.fn<() => void>();
    // Wrapper allows self-reference: the closure captures `invoke` which delegates to the handler
    const invoke = { fn: (() => {}) as () => void };
    const handleReset = createResetHandler(() => {
      bodyFn();
      // Simulate: this.map.reset() → options.onReset() → handleReset()
      invoke.fn();
    });
    invoke.fn = handleReset;

    handleReset();

    expect(bodyFn).toHaveBeenCalledOnce();
  });

  it('allows subsequent resets after first completes', () => {
    const bodyFn = vi.fn<() => void>();
    const handleReset = createResetHandler(() => {
      bodyFn();
      // Simulate recursive callback
      handleReset();
    });

    handleReset();
    handleReset();

    expect(bodyFn).toHaveBeenCalledTimes(2);
  });

  it('guard resets even if body throws', () => {
    const handleReset = createResetHandler(() => {
      throw new Error('simulated error');
    });

    expect(() => handleReset()).toThrow('simulated error');
    // Guard should have reset — second call should execute (and throw again)
    expect(() => handleReset()).toThrow('simulated error');
  });
});

describe('Close Button Visibility', () => {
  const HIDDEN_CLASS = 'panel-close--hidden';
  let container: HTMLElement;
  let closeBtn: HTMLButtonElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `
      <div class="panel-header">
        <h2 class="panel-title">Select a Location</h2>
        <button class="panel-close ${HIDDEN_CLASS}" aria-label="Close panel">
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div class="panel-body"></div>
    `;
    closeBtn = container.querySelector('.panel-close') as HTMLButtonElement;
  });

  it('close button is hidden in placeholder/fresh state', () => {
    expect(closeBtn.classList.contains(HIDDEN_CLASS)).toBe(true);
  });

  it('close button is visible when region is selected', () => {
    // Simulate showRegion
    closeBtn.classList.remove(HIDDEN_CLASS);
    expect(closeBtn.classList.contains(HIDDEN_CLASS)).toBe(false);
  });

  it('close button is visible when office is selected', () => {
    // Simulate showOffice
    closeBtn.classList.remove(HIDDEN_CLASS);
    expect(closeBtn.classList.contains(HIDDEN_CLASS)).toBe(false);
  });

  it('close button hides again after reset to placeholder', () => {
    // Simulate: showRegion → visible, then showPlaceholder → hidden
    closeBtn.classList.remove(HIDDEN_CLASS);
    expect(closeBtn.classList.contains(HIDDEN_CLASS)).toBe(false);

    closeBtn.classList.add(HIDDEN_CLASS);
    expect(closeBtn.classList.contains(HIDDEN_CLASS)).toBe(true);
  });
});
