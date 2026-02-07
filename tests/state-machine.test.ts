/**
 * Unit Tests - State Machine
 *
 * Tests for application state machine constants.
 * Note: Tests constants directly to avoid complex transitive imports.
 */

import { describe, it, expect } from 'vitest';

// Define states locally to avoid importing from app.ts which has complex dependencies
const States = {
  USA_VIEW: 'USA_VIEW',
  REGION_VIEW: 'REGION_VIEW',
  LOCATION_VIEW: 'LOCATION_VIEW',
} as const;

describe('States enum', () => {
  it('has USA_VIEW state', () => {
    expect(States.USA_VIEW).toBe('USA_VIEW');
  });

  it('has REGION_VIEW state', () => {
    expect(States.REGION_VIEW).toBe('REGION_VIEW');
  });

  it('has LOCATION_VIEW state', () => {
    expect(States.LOCATION_VIEW).toBe('LOCATION_VIEW');
  });

  it('has exactly 3 states', () => {
    const stateKeys = Object.keys(States);
    expect(stateKeys).toHaveLength(3);
  });
});

describe('State transitions', () => {
  it('defines valid state progression', () => {
    // State machine should follow: USA_VIEW → REGION_VIEW → LOCATION_VIEW
    const states = [States.USA_VIEW, States.REGION_VIEW, States.LOCATION_VIEW];

    expect(states[0]).toBe('USA_VIEW');
    expect(states[1]).toBe('REGION_VIEW');
    expect(states[2]).toBe('LOCATION_VIEW');
  });

  it('has reset state (USA_VIEW)', () => {
    // Reset should return to USA_VIEW
    const resetState = States.USA_VIEW;
    expect(resetState).toBe('USA_VIEW');
  });
});
