/**
 * Unit Tests - Client Config Data Access
 *
 * Tests for data layer functions from client-config.ts.
 * Replaces the former locations.js tests.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import {
  loadClientConfig,
  getClientOffices,
  getOfficesByRegion,
  getClientRegion,
  getClientRegions,
} from '../src/lib/client-config';

describe('Client Config Data Access', () => {
  beforeAll(async () => {
    await loadClientConfig('usg');
  });

  describe('getClientOffices', () => {
    it('returns flat array of all offices', () => {
      const offices = getClientOffices();
      expect(offices.length).toBeGreaterThan(0);
    });

    it('includes regionName on each office', () => {
      const offices = getClientOffices();
      for (const office of offices) {
        expect(office.regionName).toBeDefined();
        expect(office.regionName.length).toBeGreaterThan(0);
      }
    });

    it('preserves office coordinates', () => {
      const offices = getClientOffices();
      for (const office of offices) {
        expect(office.coordinates.lat).toBeDefined();
        expect(office.coordinates.lon).toBeDefined();
      }
    });
  });

  describe('getOfficesByRegion', () => {
    it('returns offices for valid region', () => {
      const regions = getClientRegions();
      const regionName = regions[0].name;
      const offices = getOfficesByRegion(regionName);
      expect(offices.length).toBeGreaterThan(0);
    });

    it('returns empty array for unknown region', () => {
      const offices = getOfficesByRegion('Unknown Region');
      expect(offices).toEqual([]);
    });
  });

  describe('getClientRegion', () => {
    it('returns region for valid name', () => {
      const regions = getClientRegions();
      const regionName = regions[0].name;
      const region = getClientRegion(regionName);
      expect(region).toBeDefined();
      expect(region?.name).toBe(regionName);
    });

    it('returns undefined for unknown region', () => {
      const region = getClientRegion('Unknown Region');
      expect(region).toBeUndefined();
    });
  });

  describe('getClientRegions', () => {
    it('returns all regions', () => {
      const regions = getClientRegions();
      expect(regions.length).toBeGreaterThan(0);
    });

    it('each region has offices', () => {
      const regions = getClientRegions();
      for (const region of regions) {
        expect(region.offices.length).toBeGreaterThan(0);
      }
    });
  });
});
