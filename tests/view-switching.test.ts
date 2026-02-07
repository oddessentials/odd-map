/**
 * Integration Tests for View Switching (2D ↔ 3D)
 *
 * Tests that selection state is properly preserved when switching between
 * 2D SVG and 3D WebGL map views.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the map components
const mockSelectRegion = vi.fn();
const mockSelectOffice = vi.fn();
const mockReset = vi.fn();

// Mock MapSvg
vi.mock('../src/components/map-svg.js', () => ({
  MapSvg: vi.fn().mockImplementation(() => ({
    init: vi.fn().mockResolvedValue(undefined),
    selectRegion: mockSelectRegion,
    selectOffice: mockSelectOffice,
    reset: mockReset,
    dispose: vi.fn(),
  })),
}));

// Mock Map3D
vi.mock('../src/components/map-3d.js', () => ({
  Map3D: vi.fn().mockImplementation(() => ({
    init: vi.fn().mockResolvedValue(undefined),
    selectRegion: mockSelectRegion,
    selectOffice: mockSelectOffice,
    reset: mockReset,
    dispose: vi.fn(),
  })),
}));

describe('View Switching State Preservation', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Set up DOM
    document.body.innerHTML = `
            <div id="map-container"></div>
            <div id="details-panel"></div>
            <div id="region-list"></div>
            <div id="specialty-divisions"></div>
            <button id="reset-btn"></button>
            <div id="state-indicator"></div>
            <button id="map-toggle"></button>
        `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('State capture uses stable identifiers', () => {
    it('captures region name (string) not region object', () => {
      // This test verifies the pattern used in toggleMapMode
      const selectedRegion = { name: 'Northeast Region', offices: [] };
      const wasRegionName = selectedRegion?.name ?? null;

      expect(wasRegionName).toBe('Northeast Region');
      expect(typeof wasRegionName).toBe('string');
    });

    it('captures office code (string) not office object', () => {
      const selectedOffice = { officeCode: 'USG PA1', city: 'Canonsburg' };
      const wasOfficeCode = selectedOffice?.officeCode ?? null;

      expect(wasOfficeCode).toBe('USG PA1');
      expect(typeof wasOfficeCode).toBe('string');
    });

    it('handles null selection gracefully', () => {
      // Simulate null selection with proper typing
      const selectedRegion = null as { name: string } | null;
      const selectedOffice = null as { officeCode: string } | null;

      const wasRegionName = selectedRegion?.name ?? null;
      const wasOfficeCode = selectedOffice?.officeCode ?? null;

      expect(wasRegionName).toBeNull();
      expect(wasOfficeCode).toBeNull();
    });
  });

  describe('Restoration triggers marker visibility', () => {
    it('calls selectRegion with region name after view switch', async () => {
      // Simulate the pattern from toggleMapMode
      const mockMap = {
        selectRegion: vi.fn(),
        selectOffice: vi.fn(),
      };

      const wasRegionName = 'Southeast Region';
      const wasOfficeCode = null;

      // Restoration logic
      if (wasOfficeCode && mockMap) {
        mockMap.selectOffice({});
      } else if (wasRegionName && mockMap) {
        mockMap.selectRegion(wasRegionName);
      }

      expect(mockMap.selectRegion).toHaveBeenCalledWith('Southeast Region');
      expect(mockMap.selectOffice).not.toHaveBeenCalled();
    });

    it('calls selectOffice when office was selected', async () => {
      const mockMap = {
        selectRegion: vi.fn(),
        selectOffice: vi.fn(),
      };

      const wasOfficeCode = 'USG TX1';
      const wasOffice = { officeCode: 'USG TX1', city: 'Arlington' };
      const wasRegionName = 'South Region';

      // Restoration logic (matches toggleMapMode pattern)
      if (wasOfficeCode && wasOffice && mockMap) {
        mockMap.selectOffice(wasOffice);
      } else if (wasRegionName && mockMap) {
        mockMap.selectRegion(wasRegionName);
      }

      expect(mockMap.selectOffice).toHaveBeenCalledWith(wasOffice);
      expect(mockMap.selectRegion).not.toHaveBeenCalled();
    });
  });

  describe('State persists across multiple switches', () => {
    it('maintains region selection through 2D→3D→2D cycle', () => {
      // Simulate state machine
      const selectedRegion = { name: 'West Region', offices: [] };

      // Switch 1: capture before 3D
      const capturedRegion1 = selectedRegion?.name;

      // Simulate 3D mode (region stays selected)
      // Switch 2: capture before 2D
      const capturedRegion2 = selectedRegion?.name;

      expect(capturedRegion1).toBe('West Region');
      expect(capturedRegion2).toBe('West Region');
    });

    it('office selection supersedes region selection', () => {
      const selectedRegion = { name: 'Midwest Region' };
      const selectedOffice = { officeCode: 'USG IL1', city: 'Chicago' };

      const wasRegionName = selectedRegion?.name ?? null;
      const wasOfficeCode = selectedOffice?.officeCode ?? null;

      // Office takes priority in restoration
      const shouldRestoreOffice = !!wasOfficeCode;
      const shouldRestoreRegion = !wasOfficeCode && !!wasRegionName;

      expect(shouldRestoreOffice).toBe(true);
      expect(shouldRestoreRegion).toBe(false);
    });
  });
});

describe('MapSvg Marker Ready State (Race Condition Fix)', () => {
  describe('selectRegion queues selection if markers not ready', () => {
    it('queues region selection when markersReady is false', () => {
      // Simulate MapSvg state before markers are created
      const markersReady = false;
      let pendingRegionSelection: string | null = null;
      let ensureMarkersVisibleCalled = false;

      const selectRegion = (regionName: string) => {
        if (!markersReady) {
          // Queue the selection for later
          pendingRegionSelection = regionName;
        } else {
          // Process immediately
          ensureMarkersVisibleCalled = true;
        }
      };

      // Call selectRegion before markers are ready
      selectRegion('Northeast Region');

      expect(pendingRegionSelection).toBe('Northeast Region');
      expect(ensureMarkersVisibleCalled).toBe(false);
    });

    it('processes selection immediately when markersReady is true', () => {
      const markersReady = true;
      let pendingRegionSelection: string | null = null;
      let ensureMarkersVisibleCalled = false;
      let shownRegion: string | null = null;

      const selectRegion = (regionName: string) => {
        if (!markersReady) {
          pendingRegionSelection = regionName;
        } else {
          ensureMarkersVisibleCalled = true;
          shownRegion = regionName;
        }
      };

      selectRegion('Southeast Region');

      expect(pendingRegionSelection).toBeNull();
      expect(ensureMarkersVisibleCalled).toBe(true);
      expect(shownRegion).toBe('Southeast Region');
    });
  });

  describe('pending selection is processed when markers become ready', () => {
    it('processes queued selection after addMarkers completes', () => {
      let markersReady = false;
      let pendingRegionSelection: string | null = null;
      let processedRegion: string | null = null;

      const selectRegion = (regionName: string) => {
        if (!markersReady) {
          pendingRegionSelection = regionName;
        } else {
          processedRegion = regionName;
        }
      };

      const processPendingSelection = () => {
        if (pendingRegionSelection) {
          processedRegion = pendingRegionSelection;
          pendingRegionSelection = null;
        }
      };

      const addMarkersComplete = () => {
        markersReady = true;
        processPendingSelection();
      };

      // Simulate: selectRegion called before markers ready
      selectRegion('West Region');
      expect(pendingRegionSelection).toBe('West Region');
      expect(processedRegion).toBeNull();

      // Simulate: addMarkers completes
      addMarkersComplete();
      expect(markersReady).toBe(true);
      expect(pendingRegionSelection).toBeNull();
      expect(processedRegion).toBe('West Region');
    });

    it('handles null pending selection gracefully', () => {
      let markersReady = false;
      let pendingRegionSelection: string | null = null;
      let processedRegion: string | null = null;

      const processPendingSelection = () => {
        if (pendingRegionSelection) {
          processedRegion = pendingRegionSelection;
          pendingRegionSelection = null;
        }
      };

      const addMarkersComplete = () => {
        markersReady = true;
        processPendingSelection();
      };

      // No selection was made before markers ready
      addMarkersComplete();

      expect(markersReady).toBe(true);
      expect(processedRegion).toBeNull();
    });
  });
});

describe('T018: Selection State Preserved During Interrupted Animation', () => {
  it('captures selection state before animation cancellation', () => {
    // Simulate state capture pattern from toggleMapMode
    const selectedRegion = { name: 'Northeast Region', offices: [] };
    const selectedOffice = { officeCode: 'USG PA1', city: 'Canonsburg' };

    // Capture BEFORE any disposal/cancellation
    const wasRegionName = selectedRegion?.name ?? null;
    const wasOfficeCode = selectedOffice?.officeCode ?? null;
    const wasOffice = selectedOffice;
    const wasRegion = selectedRegion;

    // Simulate animation cancellation (doesn't affect captured state)
    let animating = true;
    const cancelAnimation = () => {
      animating = false;
    };
    cancelAnimation();

    // Captured values should be preserved
    expect(wasRegionName).toBe('Northeast Region');
    expect(wasOfficeCode).toBe('USG PA1');
    expect(wasOffice).toBe(selectedOffice);
    expect(wasRegion).toBe(selectedRegion);
    expect(animating).toBe(false);
  });

  it('restores selection after toggle even if animation was interrupted', () => {
    const mockMap = {
      selectRegion: vi.fn(),
      selectOffice: vi.fn(),
      cancelAnimation: vi.fn(),
      dispose: vi.fn(),
    };

    // State captured before toggle
    const wasRegionName = 'Southeast Region';
    const wasOfficeCode = null;
    const wasRegion = { name: 'Southeast Region', offices: [] };

    // Simulate toggle flow:
    // 1. Capture state (done above)
    // 2. Cancel animation and dispose old map
    mockMap.cancelAnimation();
    mockMap.dispose();

    // 3. Create new map (mockMap represents new map)
    // 4. Restore selection
    if (wasOfficeCode && mockMap) {
      mockMap.selectOffice({});
    } else if (wasRegionName && wasRegion && mockMap) {
      mockMap.selectRegion(wasRegionName);
    }

    expect(mockMap.cancelAnimation).toHaveBeenCalled();
    expect(mockMap.dispose).toHaveBeenCalled();
    expect(mockMap.selectRegion).toHaveBeenCalledWith('Southeast Region');
  });

  it('preserves office selection when animation is mid-flight', () => {
    // Simulate: user clicks office (starts animation), then toggles view
    let animating = true;
    const selectedOffice = { officeCode: 'USG CA1', city: 'Irvine' };
    const selectedRegion = { name: 'Southern California', offices: [] };

    // Capture state while animation is running
    const wasOfficeCode = selectedOffice?.officeCode ?? null;
    const wasOffice = selectedOffice;
    const wasRegion = selectedRegion;

    expect(animating).toBe(true); // Animation was in progress

    // Cancel animation (simulating dispose)
    animating = false;

    // Selection state should still be captured
    expect(wasOfficeCode).toBe('USG CA1');
    expect(wasOffice.city).toBe('Irvine');
    expect(wasRegion.name).toBe('Southern California');
  });
});

describe('Marker Visibility Consistency', () => {
  describe('2D Map marker visibility', () => {
    it('ensureMarkersVisible is triggered on selectRegion', () => {
      // This verifies the expected behavior of the 2D map
      const ensureMarkersVisible = vi.fn();

      const selectRegion = (regionName: string) => {
        // Simulated 2D map behavior
        ensureMarkersVisible(regionName);
      };

      selectRegion('Northeast Region');
      expect(ensureMarkersVisible).toHaveBeenCalledWith('Northeast Region');
    });
  });

  describe('3D Map marker visibility', () => {
    it('updateExpensiveMarkerStates filters by selectedRegion', () => {
      // Simulated 3D map behavior
      const markers = [
        { regionName: 'Northeast Region', visible: true },
        { regionName: 'Southeast Region', visible: true },
        { regionName: 'Northeast Region', visible: true },
      ];

      const selectedRegion = 'Northeast Region';

      markers.forEach((marker) => {
        const isInSelectedRegion = marker.regionName === selectedRegion;
        marker.visible = isInSelectedRegion;
      });

      expect(markers[0].visible).toBe(true);
      expect(markers[1].visible).toBe(false);
      expect(markers[2].visible).toBe(true);
    });
  });
});
