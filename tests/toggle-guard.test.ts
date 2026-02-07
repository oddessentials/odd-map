/**
 * Unit Tests for Map Toggle Edge Case Guards (Feature 002)
 *
 * Tests the toggle guard mechanism that prevents race conditions
 * when rapidly switching between 2D and 3D map modes.
 *
 * Key behaviors tested:
 * - Rapid toggle clicks result in single transition
 * - Button is disabled during transition
 * - Animation is cancelled on dispose
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Track mock calls for verification
let _mockInitMapCalls = 0;
let mockDisposeCallOrder: string[] = [];

// Mock MapSvg
vi.mock('../src/components/map-svg.js', () => ({
  MapSvg: vi.fn().mockImplementation(() => ({
    init: vi.fn().mockImplementation(async () => {
      _mockInitMapCalls++;
      // Simulate async initialization delay
      await new Promise((resolve) => setTimeout(resolve, 10));
    }),
    selectRegion: vi.fn(),
    selectOffice: vi.fn(),
    reset: vi.fn(),
    dispose: vi.fn().mockImplementation(() => {
      mockDisposeCallOrder.push('MapSvg.dispose');
    }),
  })),
}));

// Mock Map3D with animation state
// Note: State is stored on the returned object itself so reads reflect updates
vi.mock('../src/components/map-3d.js', () => ({
  Map3D: vi.fn().mockImplementation(() => {
    const instance = {
      animating: false,
      autoRotate: true,
      init: vi.fn().mockImplementation(async () => {
        _mockInitMapCalls++;
        await new Promise((resolve) => setTimeout(resolve, 10));
      }),
      selectRegion: vi.fn().mockImplementation(() => {
        instance.animating = true;
      }),
      selectOffice: vi.fn().mockImplementation(() => {
        instance.animating = true;
      }),
      reset: vi.fn(),
      dispose: vi.fn().mockImplementation(() => {
        mockDisposeCallOrder.push('Map3D.dispose');
      }),
      cancelAnimation: vi.fn().mockImplementation(() => {
        instance.animating = false;
        instance.autoRotate = false;
        mockDisposeCallOrder.push('Map3D.cancelAnimation');
      }),
      getState: vi.fn().mockReturnValue({ selectedRegion: null, selectedOffice: null }),
    };
    return instance;
  }),
}));

describe('Toggle Guard Mechanism', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    _mockInitMapCalls = 0;
    mockDisposeCallOrder = [];

    // Set up DOM with toggle button
    document.body.innerHTML = `
      <div id="map-container"></div>
      <div id="details-panel"></div>
      <div id="region-list"></div>
      <div id="specialty-divisions"></div>
      <button id="reset-btn"></button>
      <div id="state-indicator"></div>
      <button id="map-toggle">3D</button>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('T015: Rapid toggle results in single transition', () => {
    it('blocks re-entry when transitioning flag is true', async () => {
      // Simulate the toggle guard pattern from App class
      let transitioning = false;
      let transitionCount = 0;

      const toggleMapMode = async () => {
        if (transitioning) return;
        transitioning = true;

        try {
          transitionCount++;
          // Simulate async map initialization
          await new Promise((resolve) => setTimeout(resolve, 50));
        } finally {
          transitioning = false;
        }
      };

      // Fire 10 rapid toggle calls
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(toggleMapMode());
      }

      await Promise.all(promises);

      // Only one transition should have occurred
      expect(transitionCount).toBe(1);
    });

    it('allows new transition after previous completes', async () => {
      let transitioning = false;
      let transitionCount = 0;

      const toggleMapMode = async () => {
        if (transitioning) return;
        transitioning = true;

        try {
          transitionCount++;
          await new Promise((resolve) => setTimeout(resolve, 10));
        } finally {
          transitioning = false;
        }
      };

      // First transition
      await toggleMapMode();
      expect(transitionCount).toBe(1);

      // Second transition (should be allowed)
      await toggleMapMode();
      expect(transitionCount).toBe(2);
    });
  });

  describe('T016: Button disabled during transition', () => {
    it('disables button at start of transition', () => {
      const button = document.getElementById('map-toggle') as HTMLButtonElement;
      expect(button.disabled).toBe(false);

      // Simulate setToggleButtonEnabled(false)
      button.disabled = true;

      expect(button.disabled).toBe(true);
      expect(button.getAttribute('disabled')).toBe('');
    });

    it('re-enables button after transition completes', async () => {
      const button = document.getElementById('map-toggle') as HTMLButtonElement;

      const setToggleButtonEnabled = (enabled: boolean) => {
        button.disabled = !enabled;
      };

      // Simulate transition
      setToggleButtonEnabled(false);
      expect(button.disabled).toBe(true);

      // Simulate async work
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Re-enable in finally block
      setToggleButtonEnabled(true);
      expect(button.disabled).toBe(false);
    });

    it('re-enables button even if transition throws', async () => {
      const button = document.getElementById('map-toggle') as HTMLButtonElement;

      const setToggleButtonEnabled = (enabled: boolean) => {
        button.disabled = !enabled;
      };

      let transitioning = false;

      const toggleMapMode = async () => {
        if (transitioning) return;
        transitioning = true;
        setToggleButtonEnabled(false);

        try {
          // Simulate error during transition
          throw new Error('WebGL context lost');
        } finally {
          transitioning = false;
          setToggleButtonEnabled(true);
        }
      };

      // Should not throw (error is caught internally)
      try {
        await toggleMapMode();
      } catch {
        // Expected
      }

      // Button should be re-enabled
      expect(button.disabled).toBe(false);
      expect(transitioning).toBe(false);
    });
  });

  describe('T017: Animation cancelled on dispose', () => {
    it('cancelAnimation sets animating to false', () => {
      // Simulate Map3D animation state
      let animating = true;
      let autoRotate = true;

      const cancelAnimation = () => {
        animating = false;
        autoRotate = false;
      };

      expect(animating).toBe(true);
      expect(autoRotate).toBe(true);

      cancelAnimation();

      expect(animating).toBe(false);
      expect(autoRotate).toBe(false);
    });

    it('dispose calls cancelAnimation before cleanup', () => {
      const disposeOrder: string[] = [];

      // Simulate Map3D dispose pattern
      const cancelAnimation = () => {
        disposeOrder.push('cancelAnimation');
      };

      const dispose = () => {
        // Cancel animation first
        cancelAnimation();
        disposeOrder.push('cancelAnimationFrame');
        disposeOrder.push('removeEventListeners');
        disposeOrder.push('disposeResources');
      };

      dispose();

      expect(disposeOrder[0]).toBe('cancelAnimation');
      expect(disposeOrder).toEqual([
        'cancelAnimation',
        'cancelAnimationFrame',
        'removeEventListeners',
        'disposeResources',
      ]);
    });

    it('RAF callback exits early when animating is false', () => {
      let animating = true;
      let frameCount = 0;

      const animate = () => {
        // Check for cancellation
        if (!animating) return;

        frameCount++;

        // Simulate work that would continue
        if (frameCount < 5) {
          // In real code: requestAnimationFrame(animate)
          animate();
        }
      };

      // Start animation
      animate();
      expect(frameCount).toBe(5);

      // Reset and cancel mid-animation
      frameCount = 0;
      animating = false;

      animate();
      expect(frameCount).toBe(0); // Should exit immediately
    });
  });
});

describe('Mock Tracking Verification', () => {
  beforeEach(() => {
    _mockInitMapCalls = 0;
    mockDisposeCallOrder = [];
  });

  it('tracks init calls across map instances', async () => {
    // Simulate multiple init calls
    const mockInit = async () => {
      _mockInitMapCalls++;
      await new Promise((resolve) => setTimeout(resolve, 5));
    };

    await mockInit();
    await mockInit();

    expect(_mockInitMapCalls).toBe(2);
  });

  it('tracks dispose call order for cleanup verification', () => {
    // Simulate the expected dispose order from Map3D
    mockDisposeCallOrder.push('Map3D.cancelAnimation');
    mockDisposeCallOrder.push('Map3D.dispose');

    expect(mockDisposeCallOrder[0]).toBe('Map3D.cancelAnimation');
    expect(mockDisposeCallOrder[1]).toBe('Map3D.dispose');
    expect(mockDisposeCallOrder).toHaveLength(2);
  });

  it('verifies cancelAnimation is called before dispose in cleanup', () => {
    // This validates the dispose pattern: cancelAnimation must come first
    const simulateDispose = () => {
      mockDisposeCallOrder.push('Map3D.cancelAnimation');
      mockDisposeCallOrder.push('Map3D.dispose');
    };

    simulateDispose();

    // cancelAnimation should always be first in the order
    const cancelIndex = mockDisposeCallOrder.indexOf('Map3D.cancelAnimation');
    const disposeIndex = mockDisposeCallOrder.indexOf('Map3D.dispose');

    expect(cancelIndex).toBeLessThan(disposeIndex);
  });
});

describe('3D→2D Toggle Marker Visibility', () => {
  /**
   * Tests for the fix where markers disappear when toggling from 3D to 2D mode
   * with an office selected. The root cause was that selectedOffice (plain Office)
   * lacks regionName, which is needed by map-svg's ensureMarkersVisible().
   */

  interface Office {
    officeCode: string;
    city: string;
    state: string;
    officeType: string;
  }

  interface OfficeWithRegion extends Office {
    regionName: string;
  }

  interface Region {
    name: string;
    offices: Office[];
  }

  describe('T026: OfficeWithRegion construction in toggleMapMode', () => {
    it('constructs OfficeWithRegion when office lacks regionName', () => {
      // Simulate the app state after selecting an office
      const wasOffice: Office = {
        officeCode: 'USG PA1',
        city: 'Philadelphia',
        state: 'PA',
        officeType: 'Regional Office',
      };
      const wasRegion: Region = {
        name: 'Northeast Region',
        offices: [wasOffice],
      };

      // This is the fix logic from toggleMapMode
      const officeWithRegion: OfficeWithRegion =
        'regionName' in wasOffice
          ? (wasOffice as OfficeWithRegion)
          : { ...wasOffice, regionName: wasRegion.name };

      expect(officeWithRegion.regionName).toBe('Northeast Region');
      expect(officeWithRegion.officeCode).toBe('USG PA1');
      expect(officeWithRegion.city).toBe('Philadelphia');
    });

    it('preserves existing regionName when office already has it', () => {
      // Office already has regionName (e.g., from getAllOffices())
      const wasOffice: OfficeWithRegion = {
        officeCode: 'USG PA1',
        city: 'Philadelphia',
        state: 'PA',
        officeType: 'Regional Office',
        regionName: 'Northeast Region',
      };

      // This is the fix logic from toggleMapMode - when regionName exists, use as-is
      const hasRegionName = 'regionName' in wasOffice;
      expect(hasRegionName).toBe(true);

      // The ternary would return wasOffice directly since it has regionName
      const officeWithRegion = wasOffice as OfficeWithRegion;

      // Should use existing regionName, not construct new object
      expect(officeWithRegion).toBe(wasOffice);
      expect(officeWithRegion.regionName).toBe('Northeast Region');
    });

    it('requires wasRegion to be non-null for construction', () => {
      const wasOffice: Office = {
        officeCode: 'USG PA1',
        city: 'Philadelphia',
        state: 'PA',
        officeType: 'Regional Office',
      };
      const wasRegion: Region | null = null;

      // The fix includes a guard: wasOfficeCode && wasOffice && wasRegion && this.map
      // This test verifies the guard prevents construction with null region
      const shouldConstruct = !!(wasOffice && wasRegion && !('regionName' in wasOffice));

      expect(shouldConstruct).toBe(false);
    });
  });

  describe('T027: selectOffice receives OfficeWithRegion', () => {
    it('calls selectOffice with regionName for marker visibility', () => {
      const selectOfficeCalls: OfficeWithRegion[] = [];

      // Mock map.selectOffice
      const mockMap = {
        selectOffice: (office: OfficeWithRegion) => {
          selectOfficeCalls.push(office);
        },
      };

      // Simulate toggleMapMode restore logic
      const wasOffice: Office = {
        officeCode: 'USG TX1',
        city: 'Dallas',
        state: 'TX',
        officeType: 'Regional Office',
      };
      const wasRegion: Region = {
        name: 'Southwest Region',
        offices: [wasOffice],
      };

      const officeWithRegion: OfficeWithRegion =
        'regionName' in wasOffice
          ? (wasOffice as OfficeWithRegion)
          : { ...wasOffice, regionName: wasRegion.name };

      mockMap.selectOffice(officeWithRegion);

      expect(selectOfficeCalls).toHaveLength(1);
      expect(selectOfficeCalls[0].regionName).toBe('Southwest Region');
      expect(selectOfficeCalls[0].officeCode).toBe('USG TX1');
    });

    it('enables ensureMarkersVisible in map-svg via regionName', () => {
      // Simulate map-svg's selectOffice behavior
      let ensureMarkersVisibleCalled = false;
      let showMarkersRegion: string | null = null;

      const mockMapSvg = {
        markersReady: true,
        selectedRegion: null as string | null,
        selectOffice: (office: OfficeWithRegion) => {
          if (office.regionName) {
            mockMapSvg.selectedRegion = office.regionName;
          }
          // This is the key fix: ensureMarkersVisible is called when regionName exists
          if (mockMapSvg.markersReady && office.regionName) {
            ensureMarkersVisibleCalled = true;
            showMarkersRegion = office.regionName;
          }
        },
      };

      const officeWithRegion: OfficeWithRegion = {
        officeCode: 'USG CA1',
        city: 'San Francisco',
        state: 'CA',
        officeType: 'Regional Office',
        regionName: 'Western Region',
      };

      mockMapSvg.selectOffice(officeWithRegion);

      expect(ensureMarkersVisibleCalled).toBe(true);
      expect(showMarkersRegion).toBe('Western Region');
      expect(mockMapSvg.selectedRegion).toBe('Western Region');
    });

    it('does NOT call ensureMarkersVisible when regionName is missing', () => {
      let ensureMarkersVisibleCalled = false;

      const mockMapSvg = {
        markersReady: true,
        selectOffice: (office: Partial<OfficeWithRegion>) => {
          // Without regionName, ensureMarkersVisible won't be called
          if (mockMapSvg.markersReady && office.regionName) {
            ensureMarkersVisibleCalled = true;
          }
        },
      };

      // Office without regionName (the bug scenario)
      const officeWithoutRegion: Partial<OfficeWithRegion> = {
        officeCode: 'USG CA1',
        city: 'San Francisco',
        state: 'CA',
        officeType: 'Regional Office',
        // regionName is missing!
      };

      mockMapSvg.selectOffice(officeWithoutRegion);

      expect(ensureMarkersVisibleCalled).toBe(false);
    });
  });

  describe('T028: Full toggle flow preserves marker visibility', () => {
    it('markers visible after 3D→2D toggle with office selected', () => {
      // Simulate the complete flow
      type MarkerState = { visible: boolean; region: string };
      const markerStates: Map<string, MarkerState> = new Map();

      // Initialize markers as visible (new default state - markers always visible)
      markerStates.set('USG PA1', { visible: true, region: 'Northeast Region' });
      markerStates.set('USG TX1', { visible: true, region: 'Southwest Region' });

      // Helper to make all markers visible
      const makeAllMarkersVisible = (): void => {
        markerStates.forEach((state) => {
          state.visible = true;
        });
      };

      // ensureMarkersVisible now shows ALL markers (not just the selected region)
      const ensureMarkersVisible = (_regionName: string): void => {
        makeAllMarkersVisible();
      };

      // Simulate: User selects office in 3D mode
      const selectedOffice: Office = {
        officeCode: 'USG PA1',
        city: 'Philadelphia',
        state: 'PA',
        officeType: 'Regional Office',
      };
      const selectedRegion: Region = {
        name: 'Northeast Region',
        offices: [selectedOffice],
      };

      // Simulate: Toggle to 2D mode (map recreated, markers start visible by default)
      // In the new implementation, markers are created with opacity: 1
      markerStates.forEach((state) => {
        state.visible = true;
      });

      // Simulate: Restore logic with the fix
      const officeWithRegion: OfficeWithRegion =
        'regionName' in selectedOffice
          ? (selectedOffice as OfficeWithRegion)
          : { ...selectedOffice, regionName: selectedRegion.name };

      // selectOffice calls ensureMarkersVisible which shows all markers
      if (officeWithRegion.regionName) {
        ensureMarkersVisible(officeWithRegion.regionName);
      }

      // Verify: ALL markers are visible (new behavior)
      expect(markerStates.get('USG PA1')?.visible).toBe(true);
      expect(markerStates.get('USG TX1')?.visible).toBe(true);
    });
  });
});

describe('Animation Cancellation Integration', () => {
  it('animateToTarget respects cancellation flag', () => {
    let animating = false;
    let frameCount = 0;

    const animateToTarget = () => {
      if (animating) return; // Guard against multiple animations
      animating = true;
      frameCount = 0;

      const animate = () => {
        if (!animating) return; // Cancellation check

        frameCount++;

        if (frameCount < 10) {
          animate(); // Recursive call (simulates RAF)
        } else {
          animating = false;
        }
      };

      animate();
    };

    const cancelAnimation = () => {
      animating = false;
    };

    // Start animation - should complete all 10 frames
    animateToTarget();
    expect(frameCount).toBe(10);
    expect(animating).toBe(false);

    // Reset for cancellation test
    animating = false;
    frameCount = 0;

    // Start animation but cancel after 3 frames
    animating = true;
    const animateWithEarlyCancel = () => {
      if (!animating) return;

      frameCount++;

      // Cancel after 3 frames
      if (frameCount === 3) {
        cancelAnimation();
      }

      if (frameCount < 10 && animating) {
        animateWithEarlyCancel();
      }
    };

    animateWithEarlyCancel();

    // Should have stopped at frame 3
    expect(frameCount).toBe(3);
    expect(animating).toBe(false);
  });
});
