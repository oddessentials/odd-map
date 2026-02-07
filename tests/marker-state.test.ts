/**
 * Unit Tests - Marker State Manager (WLC-008)
 *
 * Tests centralized marker visual state computation.
 * Verifies contract assertions from contracts/marker-state.md.
 */

import { describe, it, expect } from 'vitest';
import { computeMarkerStates } from '../src/lib/marker-state';
import type { MarkerStateInput, MarkerOffice } from '../src/lib/marker-state';

function createOffice(officeCode: string, regionName: string): MarkerOffice {
  return { officeCode, regionName };
}

const OFFICES: MarkerOffice[] = [
  createOffice('TST PA1', 'Northeast Region'),
  createOffice('TST FL1', 'Southeast Region'),
  createOffice('TST TX1', 'South Region'),
  createOffice('TST CA1', 'West Region'),
];

describe('Marker State Manager', () => {
  describe('Contract Assertion 1: Same input produces same output', () => {
    it('produces identical output for identical input', () => {
      const input: MarkerStateInput = {
        allOffices: OFFICES,
        selectedRegion: 'Northeast Region',
        selectedOfficeCode: 'TST PA1',
        hoveredOfficeCode: null,
      };

      const result1 = computeMarkerStates(input);
      const result2 = computeMarkerStates(input);

      expect(result1).toEqual(result2);
    });

    it('output is deterministic regardless of conceptual renderer', () => {
      const input: MarkerStateInput = {
        allOffices: OFFICES,
        selectedRegion: 'South Region',
        selectedOfficeCode: null,
        hoveredOfficeCode: 'TST TX1',
      };

      // Same function called — no renderer dependency
      const states = computeMarkerStates(input);
      expect(states).toHaveLength(4);
      expect(states.find((s) => s.officeCode === 'TST TX1')?.highlighted).toBe(true);
    });
  });

  describe('Contract Assertion 2: Out-of-region markers are dimmed', () => {
    it('dims markers outside the selected region', () => {
      const input: MarkerStateInput = {
        allOffices: OFFICES,
        selectedRegion: 'Northeast Region',
        selectedOfficeCode: null,
        hoveredOfficeCode: null,
      };

      const states = computeMarkerStates(input);

      const northeast = states.find((s) => s.officeCode === 'TST PA1')!;
      const southeast = states.find((s) => s.officeCode === 'TST FL1')!;
      const south = states.find((s) => s.officeCode === 'TST TX1')!;
      const west = states.find((s) => s.officeCode === 'TST CA1')!;

      expect(northeast.dimmed).toBe(false);
      expect(southeast.dimmed).toBe(true);
      expect(south.dimmed).toBe(true);
      expect(west.dimmed).toBe(true);
    });
  });

  describe('Contract Assertion 3: Exactly one marker selected', () => {
    it('selects exactly one marker when selectedOfficeCode is set', () => {
      const input: MarkerStateInput = {
        allOffices: OFFICES,
        selectedRegion: 'South Region',
        selectedOfficeCode: 'TST TX1',
        hoveredOfficeCode: null,
      };

      const states = computeMarkerStates(input);
      const selectedCount = states.filter((s) => s.selected).length;

      expect(selectedCount).toBe(1);
      expect(states.find((s) => s.officeCode === 'TST TX1')!.selected).toBe(true);
    });
  });

  describe('Contract Assertion 4: No dimming/selection when nothing selected', () => {
    it('no markers dimmed or selected when no selection active', () => {
      const input: MarkerStateInput = {
        allOffices: OFFICES,
        selectedRegion: null,
        selectedOfficeCode: null,
        hoveredOfficeCode: null,
      };

      const states = computeMarkerStates(input);

      states.forEach((state) => {
        expect(state.dimmed).toBe(false);
        expect(state.selected).toBe(false);
      });
    });
  });

  describe('Contract Assertion 5: Visible always true', () => {
    it('all markers are logically visible regardless of state', () => {
      const inputs: MarkerStateInput[] = [
        {
          allOffices: OFFICES,
          selectedRegion: null,
          selectedOfficeCode: null,
          hoveredOfficeCode: null,
        },
        {
          allOffices: OFFICES,
          selectedRegion: 'Northeast Region',
          selectedOfficeCode: 'TST PA1',
          hoveredOfficeCode: 'TST FL1',
        },
      ];

      for (const input of inputs) {
        const states = computeMarkerStates(input);
        states.forEach((state) => {
          expect(state.visible).toBe(true);
        });
      }
    });
  });

  describe('Edge cases', () => {
    it('handles empty offices array', () => {
      const input: MarkerStateInput = {
        allOffices: [],
        selectedRegion: null,
        selectedOfficeCode: null,
        hoveredOfficeCode: null,
      };

      const states = computeMarkerStates(input);
      expect(states).toEqual([]);
    });

    it('handles all offices in same region', () => {
      const sameRegionOffices: MarkerOffice[] = [
        createOffice('TST A1', 'Same Region'),
        createOffice('TST A2', 'Same Region'),
        createOffice('TST A3', 'Same Region'),
      ];

      const input: MarkerStateInput = {
        allOffices: sameRegionOffices,
        selectedRegion: 'Same Region',
        selectedOfficeCode: null,
        hoveredOfficeCode: null,
      };

      const states = computeMarkerStates(input);
      states.forEach((state) => {
        expect(state.dimmed).toBe(false);
      });
    });

    it('highlighted state is independent of selection', () => {
      const input: MarkerStateInput = {
        allOffices: OFFICES,
        selectedRegion: 'Northeast Region',
        selectedOfficeCode: 'TST PA1',
        hoveredOfficeCode: 'TST FL1',
      };

      const states = computeMarkerStates(input);
      const hovered = states.find((s) => s.officeCode === 'TST FL1')!;

      expect(hovered.highlighted).toBe(true);
      expect(hovered.dimmed).toBe(true);
      expect(hovered.selected).toBe(false);
    });

    it('preserves regionName from input offices', () => {
      const input: MarkerStateInput = {
        allOffices: OFFICES,
        selectedRegion: null,
        selectedOfficeCode: null,
        hoveredOfficeCode: null,
      };

      const states = computeMarkerStates(input);
      expect(states[0].regionName).toBe('Northeast Region');
      expect(states[1].regionName).toBe('Southeast Region');
    });
  });
});
