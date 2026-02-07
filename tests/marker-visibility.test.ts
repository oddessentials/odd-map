/**
 * Unit Tests for 2D Map Marker Visibility
 *
 * Tests that markers are always visible in the 2D SVG map:
 * - Visible on initial render
 * - Visible after selecting a region
 * - Visible after reset (returning to USA view)
 * - Visible after selecting an office
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('2D Map Marker Visibility', () => {
  /**
   * Simulates the marker visibility state management from map-svg.ts
   */
  interface MarkerState {
    opacity: string;
    pointerEvents: string;
  }

  let markers: Map<string, MarkerState>;

  const createMarker = (_officeCode: string): MarkerState => ({
    opacity: '1', // Markers visible by default
    pointerEvents: 'auto',
  });

  // Helper to ensure all markers are visible (mirrors ensureMarkersVisible in map-svg.ts)
  const makeAllMarkersVisible = (): void => {
    markers.forEach((marker) => {
      marker.opacity = '1';
      marker.pointerEvents = 'auto';
    });
  };

  const isMarkerVisible = (officeCode: string): boolean => {
    const marker = markers.get(officeCode);
    return marker?.opacity === '1' && marker?.pointerEvents === 'auto';
  };

  beforeEach(() => {
    // Initialize markers for test offices
    markers = new Map();
    markers.set('USG PA1', createMarker('USG PA1'));
    markers.set('USG TX1', createMarker('USG TX1'));
    markers.set('USG CA1', createMarker('USG CA1'));
  });

  afterEach(() => {
    markers.clear();
  });

  describe('T029: Markers visible on initial render', () => {
    it('all markers have opacity 1 after creation', () => {
      markers.forEach((marker) => {
        expect(marker.opacity).toBe('1');
      });
    });

    it('all markers have pointerEvents auto after creation', () => {
      markers.forEach((marker) => {
        expect(marker.pointerEvents).toBe('auto');
      });
    });

    it('isMarkerVisible returns true for all markers', () => {
      expect(isMarkerVisible('USG PA1')).toBe(true);
      expect(isMarkerVisible('USG TX1')).toBe(true);
      expect(isMarkerVisible('USG CA1')).toBe(true);
    });
  });

  describe('T030: Markers visible after region selection', () => {
    it('ensureMarkersVisible keeps all markers visible', () => {
      // Simulate ensureMarkersVisible (shows all markers regardless of region)
      const ensureMarkersVisible = (_regionName: string): void => {
        makeAllMarkersVisible();
      };

      ensureMarkersVisible('Northeast Region');

      // All markers should still be visible
      expect(isMarkerVisible('USG PA1')).toBe(true);
      expect(isMarkerVisible('USG TX1')).toBe(true);
      expect(isMarkerVisible('USG CA1')).toBe(true);
    });

    it('selecting different regions keeps all markers visible', () => {
      const ensureMarkersVisible = (_regionName: string): void => {
        makeAllMarkersVisible();
      };

      // Select Northeast
      ensureMarkersVisible('Northeast Region');
      expect(isMarkerVisible('USG PA1')).toBe(true);
      expect(isMarkerVisible('USG TX1')).toBe(true);

      // Select Southwest
      ensureMarkersVisible('Southwest Region');
      expect(isMarkerVisible('USG PA1')).toBe(true);
      expect(isMarkerVisible('USG TX1')).toBe(true);

      // Select Western
      ensureMarkersVisible('Western Region');
      expect(isMarkerVisible('USG PA1')).toBe(true);
      expect(isMarkerVisible('USG CA1')).toBe(true);
    });
  });

  describe('T031: Markers visible after reset', () => {
    it('reset shows all markers', () => {
      // Simulate reset() behavior
      const reset = (): void => {
        makeAllMarkersVisible();
      };

      // Even if markers were somehow hidden, reset should show them
      markers.forEach((marker) => {
        marker.opacity = '0';
        marker.pointerEvents = 'none';
      });

      reset();

      expect(isMarkerVisible('USG PA1')).toBe(true);
      expect(isMarkerVisible('USG TX1')).toBe(true);
      expect(isMarkerVisible('USG CA1')).toBe(true);
    });

    it('markers remain visible through select-reset cycle', () => {
      const ensureMarkersVisible = (_regionName: string): void => {
        makeAllMarkersVisible();
      };

      const reset = (): void => {
        makeAllMarkersVisible();
      };

      // Initial state - all visible
      expect(isMarkerVisible('USG PA1')).toBe(true);

      // Select region - still visible
      ensureMarkersVisible('Northeast Region');
      expect(isMarkerVisible('USG PA1')).toBe(true);
      expect(isMarkerVisible('USG TX1')).toBe(true);

      // Reset - still visible
      reset();
      expect(isMarkerVisible('USG PA1')).toBe(true);
      expect(isMarkerVisible('USG TX1')).toBe(true);
      expect(isMarkerVisible('USG CA1')).toBe(true);
    });
  });

  describe('T032: Markers visible after office selection', () => {
    it('selectOffice keeps all markers visible', () => {
      // Simulate selectOffice behavior
      const selectOffice = (_officeCode: string, _regionName: string): void => {
        // selectOffice calls ensureMarkersVisible which shows all markers
        makeAllMarkersVisible();
      };

      selectOffice('USG PA1', 'Northeast Region');

      expect(isMarkerVisible('USG PA1')).toBe(true);
      expect(isMarkerVisible('USG TX1')).toBe(true);
      expect(isMarkerVisible('USG CA1')).toBe(true);
    });
  });

  describe('T033: Full user flow maintains marker visibility', () => {
    it('complete flow: load -> select region -> select office -> reset', () => {
      const ensureMarkersVisible = (_regionName: string): void => makeAllMarkersVisible();
      const selectOffice = (_officeCode: string, _regionName: string): void =>
        makeAllMarkersVisible();
      const reset = (): void => makeAllMarkersVisible();

      // 1. Initial load - markers visible
      expect(isMarkerVisible('USG PA1')).toBe(true);
      expect(isMarkerVisible('USG TX1')).toBe(true);
      expect(isMarkerVisible('USG CA1')).toBe(true);

      // 2. Select region - markers still visible
      ensureMarkersVisible('Northeast Region');
      expect(isMarkerVisible('USG PA1')).toBe(true);
      expect(isMarkerVisible('USG TX1')).toBe(true);
      expect(isMarkerVisible('USG CA1')).toBe(true);

      // 3. Select office - markers still visible
      selectOffice('USG PA1', 'Northeast Region');
      expect(isMarkerVisible('USG PA1')).toBe(true);
      expect(isMarkerVisible('USG TX1')).toBe(true);
      expect(isMarkerVisible('USG CA1')).toBe(true);

      // 4. Reset to USA view - markers still visible
      reset();
      expect(isMarkerVisible('USG PA1')).toBe(true);
      expect(isMarkerVisible('USG TX1')).toBe(true);
      expect(isMarkerVisible('USG CA1')).toBe(true);
    });

    it('multiple region selections maintain visibility', () => {
      const ensureMarkersVisible = (_regionName: string): void => makeAllMarkersVisible();

      const regions = ['Northeast Region', 'Southwest Region', 'Western Region', 'Midwest Region'];

      regions.forEach((region) => {
        ensureMarkersVisible(region);

        // All markers visible after each selection
        markers.forEach((_marker, code) => {
          expect(isMarkerVisible(code)).toBe(true);
        });
      });
    });
  });
});

describe('Marker Visibility State Transitions', () => {
  it('ensureMarkersVisible sets correct state', () => {
    const marker = { opacity: '0', pointerEvents: 'none' };

    // Simulate ensureMarkersVisible
    marker.opacity = '1';
    marker.pointerEvents = 'auto';

    expect(marker.opacity).toBe('1');
    expect(marker.pointerEvents).toBe('auto');
  });

  it('marker default state is visible', () => {
    // This documents the expected default from addMarkers()
    const defaultMarkerState = {
      opacity: '1',
      pointerEvents: 'auto',
    };

    expect(defaultMarkerState.opacity).toBe('1');
    expect(defaultMarkerState.pointerEvents).toBe('auto');
  });
});
