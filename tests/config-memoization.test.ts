/**
 * Unit Tests - Client Config Memoization
 *
 * Tests that getClientRegions(), getClientOffices(), and getClientRegion()
 * return memoized results and invalidate correctly on config reload.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  loadClientConfig,
  getClientRegions,
  getClientOffices,
  getClientRegion,
  __resetConfig,
} from '../src/lib/client-config';
import { getClientConfigForClient } from '../src/lib/client-registry';

vi.mock('../src/lib/client-registry', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/lib/client-registry')>();
  return { ...actual, getClientConfigForClient: vi.fn() };
});

function createValidConfig(overrides?: Record<string, unknown>) {
  return {
    schemaVersion: 1,
    clientId: 'testclient',
    name: 'Test Client',
    copyrightHolder: 'Test Client Inc.',
    offices: [
      {
        officeCode: 'TST PA1',
        city: 'Philadelphia',
        state: 'Pennsylvania',
        officeType: 'Branch Office',
        address: '123 Test St',
        region: 'Northeast Region',
        coordinates: {
          lat: 40.0,
          lon: -80.0,
          source: 'verified',
          confidence: 'high',
          approximate: false,
        },
      },
      {
        officeCode: 'TST FL1',
        city: 'Miami',
        state: 'Florida',
        officeType: 'Branch Office',
        address: '456 Test Ave',
        region: 'Southeast Region',
        coordinates: {
          lat: 25.76,
          lon: -80.19,
          source: 'verified',
          confidence: 'high',
          approximate: false,
        },
      },
      {
        officeCode: 'TST PA2',
        city: 'Pittsburgh',
        state: 'Pennsylvania',
        officeType: 'Satellite Sales Office',
        address: '789 Test Blvd',
        region: 'Northeast Region',
        coordinates: {
          lat: 40.44,
          lon: -79.99,
          source: 'verified',
          confidence: 'high',
          approximate: false,
        },
      },
    ],
    regionalPersonnel: {
      'Northeast Region': [
        { name: 'Alice', title: 'Manager', phone: '555-0001', email: 'alice@test.com' },
      ],
    },
    ...overrides,
  };
}

describe('Client Config Memoization', () => {
  beforeEach(() => {
    __resetConfig();
    vi.clearAllMocks();
  });

  describe('getClientOffices memoization', () => {
    it('returns same reference on consecutive calls', async () => {
      vi.mocked(getClientConfigForClient).mockResolvedValue(createValidConfig());
      await loadClientConfig('testclient');

      const result1 = getClientOffices();
      const result2 = getClientOffices();

      expect(result1).toBe(result2); // Same reference, not just equal
    });

    it('returns correct office data with regionName', async () => {
      vi.mocked(getClientConfigForClient).mockResolvedValue(createValidConfig());
      await loadClientConfig('testclient');

      const offices = getClientOffices();
      expect(offices).toHaveLength(3);
      expect(offices[0].regionName).toBe('Northeast Region');
      expect(offices[0].officeCode).toBe('TST PA1');
    });

    it('invalidates cache when config is reloaded', async () => {
      vi.mocked(getClientConfigForClient).mockResolvedValue(createValidConfig());
      await loadClientConfig('testclient');

      const result1 = getClientOffices();

      // Reload with different config
      vi.mocked(getClientConfigForClient).mockResolvedValue(
        createValidConfig({ clientId: 'testclient2' })
      );
      await loadClientConfig('testclient2');

      const result2 = getClientOffices();
      expect(result1).not.toBe(result2); // Different reference after reload
    });
  });

  describe('getClientRegions memoization', () => {
    it('returns same reference on consecutive calls', async () => {
      vi.mocked(getClientConfigForClient).mockResolvedValue(createValidConfig());
      await loadClientConfig('testclient');

      const result1 = getClientRegions();
      const result2 = getClientRegions();

      expect(result1).toBe(result2);
    });

    it('groups offices by region correctly', async () => {
      vi.mocked(getClientConfigForClient).mockResolvedValue(createValidConfig());
      await loadClientConfig('testclient');

      const regions = getClientRegions();
      expect(regions).toHaveLength(2);

      const northeast = regions.find((r) => r.name === 'Northeast Region')!;
      expect(northeast.offices).toHaveLength(2);
      expect(northeast.personnel).toHaveLength(1);

      const southeast = regions.find((r) => r.name === 'Southeast Region')!;
      expect(southeast.offices).toHaveLength(1);
      expect(southeast.personnel).toHaveLength(0);
    });
  });

  describe('getClientRegion O(1) lookup', () => {
    it('returns correct region by name', async () => {
      vi.mocked(getClientConfigForClient).mockResolvedValue(createValidConfig());
      await loadClientConfig('testclient');

      const region = getClientRegion('Northeast Region');
      expect(region).toBeDefined();
      expect(region!.name).toBe('Northeast Region');
      expect(region!.offices).toHaveLength(2);
    });

    it('returns undefined for non-existent region', async () => {
      vi.mocked(getClientConfigForClient).mockResolvedValue(createValidConfig());
      await loadClientConfig('testclient');

      const region = getClientRegion('Non-existent Region');
      expect(region).toBeUndefined();
    });

    it('uses cached Map for repeated lookups', async () => {
      vi.mocked(getClientConfigForClient).mockResolvedValue(createValidConfig());
      await loadClientConfig('testclient');

      // Multiple lookups should all return the same region reference
      const r1 = getClientRegion('Northeast Region');
      const r2 = getClientRegion('Northeast Region');
      expect(r1).toBe(r2);
    });

    it('invalidates region map cache on config reload', async () => {
      vi.mocked(getClientConfigForClient).mockResolvedValue(createValidConfig());
      await loadClientConfig('testclient');

      const r1 = getClientRegion('Northeast Region');

      // Reload config
      vi.mocked(getClientConfigForClient).mockResolvedValue(createValidConfig());
      await loadClientConfig('testclient');

      const r2 = getClientRegion('Northeast Region');
      expect(r1).not.toBe(r2); // New reference after cache invalidation
    });
  });

  describe('__resetConfig clears all caches', () => {
    it('clears memoized results so fresh data is computed', async () => {
      vi.mocked(getClientConfigForClient).mockResolvedValue(createValidConfig());
      await loadClientConfig('testclient');

      const before = getClientOffices();
      __resetConfig();

      // Reload
      vi.mocked(getClientConfigForClient).mockResolvedValue(createValidConfig());
      await loadClientConfig('testclient');

      const after = getClientOffices();
      expect(before).not.toBe(after);
    });
  });
});
