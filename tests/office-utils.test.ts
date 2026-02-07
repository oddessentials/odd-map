import { describe, it, expect } from 'vitest';
import { ensureOfficeWithRegion } from '../src/lib/office-utils';
import type { Office, OfficeWithRegion } from '../src/types/index';

function createOffice(overrides?: Partial<Office>): Office {
  return {
    officeCode: 'TST PA1',
    city: 'Test City',
    state: 'Pennsylvania',
    officeType: 'Branch Office',
    address: '123 Test St',
    region: 'Test Region',
    coordinates: {
      lat: 40.0,
      lon: -80.0,
      source: 'verified',
      confidence: 'high',
      approximate: false,
    },
    ...overrides,
  };
}

describe('ensureOfficeWithRegion', () => {
  it('returns unchanged OfficeWithRegion if regionName exists', () => {
    const office: OfficeWithRegion = {
      ...createOffice(),
      regionName: 'Northeast Region',
    };

    const result = ensureOfficeWithRegion(office, 'Fallback Region');
    expect(result).toBe(office); // Same reference
    expect(result.regionName).toBe('Northeast Region');
  });

  it('adds fallback regionName when office lacks it', () => {
    const office = createOffice();

    const result = ensureOfficeWithRegion(office, 'Fallback Region');
    expect(result.regionName).toBe('Fallback Region');
    expect(result.officeCode).toBe('TST PA1');
  });

  it('uses fallback when regionName is empty string', () => {
    const office: OfficeWithRegion = {
      ...createOffice(),
      regionName: '',
    };

    const result = ensureOfficeWithRegion(office, 'Fallback Region');
    expect(result.regionName).toBe('Fallback Region');
  });

  it('does not mutate the original office object', () => {
    const office = createOffice();
    const originalCode = office.officeCode;

    const result = ensureOfficeWithRegion(office, 'Fallback Region');
    expect(result).not.toBe(office); // Different reference (spread)
    expect(office.officeCode).toBe(originalCode);
    expect('regionName' in office).toBe(false);
  });

  it('preserves all office properties in result', () => {
    const office = createOffice({
      officeCode: 'OE NY1',
      city: 'New York',
      state: 'New York',
      address: '456 Broadway',
      directionsUrl: 'https://example.com/directions',
    });

    const result = ensureOfficeWithRegion(office, 'Northeast Region');
    expect(result.officeCode).toBe('OE NY1');
    expect(result.city).toBe('New York');
    expect(result.state).toBe('New York');
    expect(result.address).toBe('456 Broadway');
    expect(result.directionsUrl).toBe('https://example.com/directions');
    expect(result.regionName).toBe('Northeast Region');
  });
});
