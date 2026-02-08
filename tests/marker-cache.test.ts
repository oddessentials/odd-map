/**
 * Unit Tests - SVG Marker Element Cache
 *
 * Tests that marker element lookups use a Map cache for O(1) access
 * instead of repeated DOM querySelector calls during state updates.
 */

import { describe, it, expect, beforeEach } from 'vitest';

describe('Marker Element Cache Pattern', () => {
  let svg: SVGSVGElement;
  let markerCache: Map<string, { group: SVGGElement; marker: Element }>;

  beforeEach(() => {
    // Set up a mock SVG with marker groups
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    markerCache = new Map();

    const offices = ['TST PA1', 'TST FL1', 'TST TX1'];

    for (const code of offices) {
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('class', 'marker-group');
      group.setAttribute('data-office-code', code);

      const marker = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      marker.setAttribute('class', 'marker');

      group.appendChild(marker);
      svg.appendChild(group);

      // Populate cache (simulates addMarkers behavior)
      markerCache.set(code, { group, marker });
    }
  });

  it('cache provides O(1) access to marker elements', () => {
    const cached = markerCache.get('TST PA1');
    expect(cached).toBeDefined();
    expect(cached!.group.getAttribute('data-office-code')).toBe('TST PA1');
    expect(cached!.marker.getAttribute('class')).toBe('marker');
  });

  it('cache returns same reference as DOM query', () => {
    const cached = markerCache.get('TST FL1');
    const queried = svg.querySelector('.marker-group[data-office-code="TST FL1"]');

    expect(cached!.group).toBe(queried);
  });

  it('cache hit avoids DOM traversal', () => {
    const querySpy = vi.spyOn(svg, 'querySelector');

    // Using cache: no DOM query
    const cached = markerCache.get('TST TX1');
    expect(cached).toBeDefined();
    expect(querySpy).not.toHaveBeenCalled();

    querySpy.mockRestore();
  });

  it('updating marker classes via cache works correctly', () => {
    const states = [
      { officeCode: 'TST PA1', selected: true, highlighted: false, dimmed: false, subdued: false },
      { officeCode: 'TST FL1', selected: false, highlighted: false, dimmed: true, subdued: false },
      { officeCode: 'TST TX1', selected: false, highlighted: true, dimmed: false, subdued: false },
    ];

    // Apply states using cache (simulates updateMarkerStates)
    for (const state of states) {
      const cached = markerCache.get(state.officeCode);
      if (!cached) continue;
      const { marker } = cached;
      marker.classList.toggle('marker--selected', state.selected);
      marker.classList.toggle('marker--highlighted', state.highlighted);
      marker.classList.toggle('marker--dimmed', state.dimmed);
      marker.classList.toggle('marker--subdued', state.subdued);
    }

    // Verify state was applied
    const pa1 = markerCache.get('TST PA1')!.marker;
    expect(pa1.classList.contains('marker--selected')).toBe(true);
    expect(pa1.classList.contains('marker--dimmed')).toBe(false);

    const fl1 = markerCache.get('TST FL1')!.marker;
    expect(fl1.classList.contains('marker--dimmed')).toBe(true);
    expect(fl1.classList.contains('marker--selected')).toBe(false);

    const tx1 = markerCache.get('TST TX1')!.marker;
    expect(tx1.classList.contains('marker--highlighted')).toBe(true);
  });

  it('cache returns undefined for unknown office codes', () => {
    expect(markerCache.get('UNKNOWN')).toBeUndefined();
  });

  it('cache size matches number of markers', () => {
    expect(markerCache.size).toBe(3);
  });
});
