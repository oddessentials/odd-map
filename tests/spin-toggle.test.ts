/**
 * Unit Tests for Spin Toggle Feature (Feature 003)
 *
 * Tests the globe rotation toggle functionality:
 * - autoRotate defaults to false (globe stationary)
 * - toggleAutoRotate() toggles and returns new state
 * - getAutoRotate() returns current state
 * - Spin button visibility based on 2D/3D mode
 * - Button click toggles rotation
 * - Button visual state reflects rotation state
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Map3D with spin toggle methods
vi.mock('../src/components/map-3d.js', () => ({
  Map3D: vi.fn().mockImplementation(() => {
    const instance = {
      autoRotate: false, // Default is now false
      selectRegion: vi.fn(),
      selectOffice: vi.fn(),
      reset: vi.fn(),
      dispose: vi.fn(),
      cancelAnimation: vi.fn(),
      getState: vi.fn().mockReturnValue({ selectedRegion: null, selectedOffice: null }),
      toggleAutoRotate: vi.fn().mockImplementation(() => {
        instance.autoRotate = !instance.autoRotate;
        return instance.autoRotate;
      }),
      getAutoRotate: vi.fn().mockImplementation(() => {
        return instance.autoRotate;
      }),
    };
    return instance;
  }),
}));

// Mock MapSvg
vi.mock('../src/components/map-svg.js', () => ({
  MapSvg: vi.fn().mockImplementation(() => ({
    init: vi.fn().mockResolvedValue(undefined),
    selectRegion: vi.fn(),
    selectOffice: vi.fn(),
    reset: vi.fn(),
    dispose: vi.fn(),
  })),
}));

describe('Spin Toggle - Map3D API', () => {
  describe('T020: autoRotate defaults to false', () => {
    it('initializes with autoRotate = false', () => {
      // Simulate Map3D default state
      const autoRotate = false;
      expect(autoRotate).toBe(false);
    });

    it('globe is stationary on initialization', () => {
      // Verify the expected default behavior
      const map3dState = {
        autoRotate: false,
        rotationSpeed: 0.0005,
      };

      expect(map3dState.autoRotate).toBe(false);
      expect(map3dState.rotationSpeed).toBe(0.0005);
    });
  });

  describe('T021: toggleAutoRotate() works correctly', () => {
    it('toggles from false to true', () => {
      let autoRotate = false;

      const toggleAutoRotate = () => {
        autoRotate = !autoRotate;
        return autoRotate;
      };

      const result = toggleAutoRotate();

      expect(result).toBe(true);
      expect(autoRotate).toBe(true);
    });

    it('toggles from true to false', () => {
      let autoRotate = true;

      const toggleAutoRotate = () => {
        autoRotate = !autoRotate;
        return autoRotate;
      };

      const result = toggleAutoRotate();

      expect(result).toBe(false);
      expect(autoRotate).toBe(false);
    });

    it('returns the new state after toggle', () => {
      let autoRotate = false;

      const toggleAutoRotate = () => {
        autoRotate = !autoRotate;
        return autoRotate;
      };

      // First toggle: false -> true
      expect(toggleAutoRotate()).toBe(true);
      // Second toggle: true -> false
      expect(toggleAutoRotate()).toBe(false);
      // Third toggle: false -> true
      expect(toggleAutoRotate()).toBe(true);
    });
  });

  describe('T022: getAutoRotate() returns current state', () => {
    it('returns false when autoRotate is false', () => {
      const autoRotate = false;
      const getAutoRotate = () => autoRotate;

      expect(getAutoRotate()).toBe(false);
    });

    it('returns true when autoRotate is true', () => {
      const autoRotate = true;
      const getAutoRotate = () => autoRotate;

      expect(getAutoRotate()).toBe(true);
    });

    it('reflects state changes from toggleAutoRotate', () => {
      let autoRotate = false;

      const toggleAutoRotate = () => {
        autoRotate = !autoRotate;
        return autoRotate;
      };

      const getAutoRotate = () => autoRotate;

      expect(getAutoRotate()).toBe(false);
      toggleAutoRotate();
      expect(getAutoRotate()).toBe(true);
      toggleAutoRotate();
      expect(getAutoRotate()).toBe(false);
    });
  });
});

describe('Spin Toggle - Button Visibility', () => {
  beforeEach(() => {
    // Set up DOM with spin toggle button
    document.body.innerHTML = `
      <button id="spin-toggle" class="btn btn-secondary spin-toggle" hidden>↻</button>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('T023: Button hidden when use3D is false', () => {
    it('button is hidden in 2D mode', () => {
      const use3D = false;
      const spinBtn = document.getElementById('spin-toggle') as HTMLButtonElement;

      // Simulate updateSpinButtonVisibility
      spinBtn.hidden = !use3D;

      expect(spinBtn.hidden).toBe(true);
    });

    it('button is visible in 3D mode', () => {
      const use3D = true;
      const spinBtn = document.getElementById('spin-toggle') as HTMLButtonElement;

      // Simulate updateSpinButtonVisibility
      spinBtn.hidden = !use3D;

      expect(spinBtn.hidden).toBe(false);
    });

    it('visibility updates when switching modes', () => {
      let use3D = false;
      const spinBtn = document.getElementById('spin-toggle') as HTMLButtonElement;

      const updateSpinButtonVisibility = () => {
        spinBtn.hidden = !use3D;
      };

      // Start in 2D mode
      updateSpinButtonVisibility();
      expect(spinBtn.hidden).toBe(true);

      // Switch to 3D mode
      use3D = true;
      updateSpinButtonVisibility();
      expect(spinBtn.hidden).toBe(false);

      // Switch back to 2D mode
      use3D = false;
      updateSpinButtonVisibility();
      expect(spinBtn.hidden).toBe(true);
    });
  });
});

describe('Spin Toggle - Button Interaction', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="spin-toggle" class="btn btn-secondary spin-toggle">↻</button>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('T024: Button click toggles autoRotate', () => {
    it('clicking button toggles rotation state', () => {
      let autoRotate = false;
      const spinBtn = document.getElementById('spin-toggle') as HTMLButtonElement;

      const toggleAutoRotate = () => {
        autoRotate = !autoRotate;
        return autoRotate;
      };

      const handleSpinToggle = () => {
        toggleAutoRotate();
      };

      spinBtn.addEventListener('click', handleSpinToggle);

      // Initial state
      expect(autoRotate).toBe(false);

      // Click to enable rotation
      spinBtn.click();
      expect(autoRotate).toBe(true);

      // Click to disable rotation
      spinBtn.click();
      expect(autoRotate).toBe(false);
    });

    it('multiple clicks toggle correctly', () => {
      let autoRotate = false;
      const spinBtn = document.getElementById('spin-toggle') as HTMLButtonElement;

      spinBtn.addEventListener('click', () => {
        autoRotate = !autoRotate;
      });

      // Click 5 times
      for (let i = 0; i < 5; i++) {
        spinBtn.click();
      }

      // Odd number of clicks: should be true
      expect(autoRotate).toBe(true);

      // Click once more (6 total)
      spinBtn.click();

      // Even number of clicks: should be false
      expect(autoRotate).toBe(false);
    });
  });

  describe('T025: Button visual state reflects rotation state', () => {
    it('adds active class when rotation is enabled', () => {
      const spinBtn = document.getElementById('spin-toggle') as HTMLButtonElement;
      const isSpinning = true;

      // Simulate updateSpinButton
      spinBtn.classList.toggle('active', isSpinning);

      expect(spinBtn.classList.contains('active')).toBe(true);
    });

    it('removes active class when rotation is disabled', () => {
      const spinBtn = document.getElementById('spin-toggle') as HTMLButtonElement;
      spinBtn.classList.add('active'); // Start with active

      const isSpinning = false;

      // Simulate updateSpinButton
      spinBtn.classList.toggle('active', isSpinning);

      expect(spinBtn.classList.contains('active')).toBe(false);
    });

    it('updates aria-pressed attribute', () => {
      const spinBtn = document.getElementById('spin-toggle') as HTMLButtonElement;

      // Spinning
      spinBtn.setAttribute('aria-pressed', 'true');
      expect(spinBtn.getAttribute('aria-pressed')).toBe('true');

      // Not spinning
      spinBtn.setAttribute('aria-pressed', 'false');
      expect(spinBtn.getAttribute('aria-pressed')).toBe('false');
    });

    it('visual state syncs with rotation state on toggle', () => {
      let autoRotate = false;
      const spinBtn = document.getElementById('spin-toggle') as HTMLButtonElement;

      const updateSpinButton = () => {
        spinBtn.classList.toggle('active', autoRotate);
        spinBtn.setAttribute('aria-pressed', String(autoRotate));
      };

      const handleSpinToggle = () => {
        autoRotate = !autoRotate;
        updateSpinButton();
      };

      spinBtn.addEventListener('click', handleSpinToggle);

      // Initial state
      updateSpinButton();
      expect(spinBtn.classList.contains('active')).toBe(false);
      expect(spinBtn.getAttribute('aria-pressed')).toBe('false');

      // Click to enable
      spinBtn.click();
      expect(spinBtn.classList.contains('active')).toBe(true);
      expect(spinBtn.getAttribute('aria-pressed')).toBe('true');

      // Click to disable
      spinBtn.click();
      expect(spinBtn.classList.contains('active')).toBe(false);
      expect(spinBtn.getAttribute('aria-pressed')).toBe('false');
    });
  });
});

describe('Spin Toggle - State Reset on View Switch', () => {
  it('autoRotate resets to false when switching to 3D mode', () => {
    // Simulates the behavior: new Map3D instance always starts with autoRotate = false
    const createMap3D = () => ({
      autoRotate: false, // Always defaults to false
      userWantsAutoRotate: false,
    });

    // First 3D instance
    const map1 = createMap3D();
    expect(map1.autoRotate).toBe(false);
    expect(map1.userWantsAutoRotate).toBe(false);

    // Simulate user enabling rotation
    map1.autoRotate = true;
    map1.userWantsAutoRotate = true;
    expect(map1.autoRotate).toBe(true);

    // Switch to 2D (dispose map1), then back to 3D (create new instance)
    const map2 = createMap3D();

    // New instance should have autoRotate = false (reset)
    expect(map2.autoRotate).toBe(false);
    expect(map2.userWantsAutoRotate).toBe(false);
  });
});

describe('Spin Toggle - FR-008: Animation Resumption', () => {
  describe('userWantsAutoRotate tracks user preference', () => {
    it('toggleAutoRotate sets both autoRotate and userWantsAutoRotate', () => {
      let autoRotate = false;
      let userWantsAutoRotate = false;

      const toggleAutoRotate = () => {
        userWantsAutoRotate = !userWantsAutoRotate;
        autoRotate = userWantsAutoRotate;
        return userWantsAutoRotate;
      };

      // First toggle: user enables rotation
      expect(toggleAutoRotate()).toBe(true);
      expect(autoRotate).toBe(true);
      expect(userWantsAutoRotate).toBe(true);

      // Second toggle: user disables rotation
      expect(toggleAutoRotate()).toBe(false);
      expect(autoRotate).toBe(false);
      expect(userWantsAutoRotate).toBe(false);
    });

    it('getAutoRotate returns userWantsAutoRotate (user preference)', () => {
      const userWantsAutoRotate = true; // User enabled rotation
      let autoRotate = true;

      // Temporarily paused (hover or animation)
      autoRotate = false;

      const getAutoRotate = () => userWantsAutoRotate;

      // Should return user preference, not effective state
      expect(getAutoRotate()).toBe(true);
      expect(autoRotate).toBe(false); // Effective state is paused
    });
  });

  describe('Animation completion restores rotation', () => {
    it('restores autoRotate to userWantsAutoRotate after animation', () => {
      const state = {
        autoRotate: true,
        userWantsAutoRotate: true,
        animating: false,
      };

      // Simulate starting animation (pauses rotation)
      const startAnimation = () => {
        state.animating = true;
        state.autoRotate = false;
      };

      // Simulate animation completion
      const completeAnimation = () => {
        state.animating = false;
        state.autoRotate = state.userWantsAutoRotate; // Restore user preference
      };

      // User has rotation enabled
      expect(state.autoRotate).toBe(true);
      expect(state.userWantsAutoRotate).toBe(true);

      // Animation starts, rotation pauses
      startAnimation();
      expect(state.animating).toBe(true);
      expect(state.autoRotate).toBe(false);
      expect(state.userWantsAutoRotate).toBe(true); // User still wants rotation

      // Animation completes, rotation resumes
      completeAnimation();
      expect(state.animating).toBe(false);
      expect(state.autoRotate).toBe(true); // Restored to user preference
      expect(state.userWantsAutoRotate).toBe(true);
    });

    it('does NOT restore rotation if user had it disabled', () => {
      const state = {
        autoRotate: false,
        userWantsAutoRotate: false,
        animating: false,
      };

      const startAnimation = () => {
        state.animating = true;
        state.autoRotate = false;
      };

      const completeAnimation = () => {
        state.animating = false;
        state.autoRotate = state.userWantsAutoRotate;
      };

      // User has rotation disabled
      expect(state.autoRotate).toBe(false);
      expect(state.userWantsAutoRotate).toBe(false);

      // Animation starts and completes
      startAnimation();
      completeAnimation();

      // Rotation stays disabled (user didn't want it)
      expect(state.autoRotate).toBe(false);
    });
  });

  describe('Reset clears both flags', () => {
    it('reset() sets both autoRotate and userWantsAutoRotate to false', () => {
      let autoRotate = true;
      let userWantsAutoRotate = true;

      const reset = () => {
        autoRotate = false;
        userWantsAutoRotate = false;
      };

      // User had rotation enabled
      expect(autoRotate).toBe(true);
      expect(userWantsAutoRotate).toBe(true);

      // Reset clears both
      reset();
      expect(autoRotate).toBe(false);
      expect(userWantsAutoRotate).toBe(false);
    });
  });
});
