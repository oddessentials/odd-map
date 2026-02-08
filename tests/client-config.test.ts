/**
 * Unit Tests - Client Config Schema Validation (SC-006, SC-010)
 *
 * Tests Zod schema validation for client configuration files.
 * Verifies descriptive error messages for invalid configs.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ClientConfigSchema,
  MAX_SUPPORTED_SCHEMA_VERSION,
  formatValidationErrors,
} from '../src/lib/client-config.schema';
import { loadClientConfig, __resetConfig } from '../src/lib/client-config';
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
      },
    ],
    ...overrides,
  };
}

describe('Client Config Schema Validation', () => {
  describe('Valid configs', () => {
    it('accepts a minimal valid config', () => {
      const config = createValidConfig();
      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    it('accepts a config with all optional fields', () => {
      const config = createValidConfig({
        tagline: 'Test tagline',
        regionalPersonnel: {
          'Test Region': [
            {
              name: 'John Doe',
              title: 'Manager',
              phone: '555-1234',
              email: 'john@test.com',
              vcardUrl: 'https://example.com/john',
            },
          ],
        },
        specialtyDivisions: [
          {
            name: 'Test Division',
            personnel: [],
          },
        ],
        globalContacts: {
          mainPhone: '555-0000',
          mainEmail: 'info@test.com',
          departmentEmails: {
            claims: 'claims@test.com',
            lossRuns: 'lossruns@test.com',
            accounting: 'accounting@test.com',
          },
          accountingContact: {
            name: 'Jane Doe',
            title: 'Accountant',
            phone: '555-9999',
            email: 'jane@test.com',
          },
        },
        theme: {
          primaryColor: '#ff0000',
          accentColor: '#00ff00',
          regionColors: {
            'Test Region': '#aabbcc',
          },
          cameraViews: {
            'Test Region': {
              distance: 5,
              lat: 40.0,
              lon: -80.0,
            },
          },
        },
        metadata: {
          source: 'test',
          generatedAt: '2026-01-01',
        },
      });

      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    it('accepts config with optional office fields omitted', () => {
      const config = createValidConfig({
        offices: [
          {
            officeCode: 'TST PA1',
            city: 'Test City',
            state: 'Pennsylvania',
            officeType: 'Satellite Sales Office',
            region: 'Test Region',
            coordinates: {
              lat: 40.0,
              lon: -80.0,
              source: 'business_district',
              confidence: 'medium',
              approximate: true,
            },
          },
        ],
      });

      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.offices[0].address).toBeNull();
        expect(result.data.offices[0].directionsUrl).toBeUndefined();
      }
    });
  });

  describe('Missing required fields (SC-006)', () => {
    it('rejects config missing clientId', () => {
      const config = createValidConfig();
      delete (config as Record<string, unknown>).clientId;

      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
      if (!result.success) {
        const messages = formatValidationErrors(result.error);
        expect(messages.some((m) => m.includes('clientId'))).toBe(true);
      }
    });

    it('rejects config missing name', () => {
      const config = createValidConfig();
      delete (config as Record<string, unknown>).name;

      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });

    it('rejects config missing offices', () => {
      const config = createValidConfig();
      delete (config as Record<string, unknown>).offices;

      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });

    it('rejects config with empty offices array', () => {
      const config = createValidConfig({ offices: [] });

      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });
  });

  describe('Schema version validation (SC-010)', () => {
    it('accepts schemaVersion: 1', () => {
      const config = createValidConfig({ schemaVersion: 1 });
      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    it('rejects schemaVersion: 0', () => {
      const config = createValidConfig({ schemaVersion: 0 });
      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });

    it('rejects schemaVersion exceeding MAX_SUPPORTED_SCHEMA_VERSION', () => {
      const config = createValidConfig({
        schemaVersion: MAX_SUPPORTED_SCHEMA_VERSION + 1,
      });

      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
      if (!result.success) {
        const messages = formatValidationErrors(result.error);
        expect(
          messages.some((m) => m.includes('not supported') || m.includes('Maximum supported'))
        ).toBe(true);
      }
    });

    it('rejects non-integer schemaVersion', () => {
      const config = createValidConfig({ schemaVersion: 1.5 });
      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });
  });

  describe('Client ID validation', () => {
    it('rejects clientId with uppercase', () => {
      const config = createValidConfig({ clientId: 'TestClient' });
      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });

    it('rejects clientId with spaces', () => {
      const config = createValidConfig({ clientId: 'test client' });
      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });

    it('rejects clientId starting with number', () => {
      const config = createValidConfig({ clientId: '1client' });
      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });

    it('accepts valid clientId', () => {
      const config = createValidConfig({ clientId: 'oddessentials' });
      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });
  });

  describe('Office code uniqueness', () => {
    it('rejects duplicate office codes', () => {
      const config = createValidConfig({
        offices: [
          {
            officeCode: 'TST PA1',
            city: 'City A',
            state: 'PA',
            officeType: 'Branch Office',
            region: 'Region A',
            coordinates: {
              lat: 40,
              lon: -80,
              source: 'verified',
              confidence: 'high',
              approximate: false,
            },
          },
          {
            officeCode: 'TST PA1',
            city: 'City B',
            state: 'PA',
            officeType: 'Branch Office',
            region: 'Region B',
            coordinates: {
              lat: 41,
              lon: -81,
              source: 'verified',
              confidence: 'high',
              approximate: false,
            },
          },
        ],
      });

      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
      if (!result.success) {
        const messages = formatValidationErrors(result.error);
        expect(messages.some((m) => m.includes('Duplicate office code'))).toBe(true);
      }
    });

    it('accepts unique office codes', () => {
      const config = createValidConfig({
        offices: [
          {
            officeCode: 'TST PA1',
            city: 'City A',
            state: 'PA',
            officeType: 'Branch Office',
            region: 'Region A',
            coordinates: {
              lat: 40,
              lon: -80,
              source: 'verified',
              confidence: 'high',
              approximate: false,
            },
          },
          {
            officeCode: 'TST PA2',
            city: 'City B',
            state: 'PA',
            officeType: 'Branch Office',
            region: 'Region A',
            coordinates: {
              lat: 41,
              lon: -81,
              source: 'verified',
              confidence: 'high',
              approximate: false,
            },
          },
        ],
      });

      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });
  });

  describe('Coordinate bounds validation', () => {
    it('rejects lat outside [-90, 90]', () => {
      const config = createValidConfig({
        offices: [
          {
            officeCode: 'TST X1',
            city: 'Invalid',
            state: 'XX',
            officeType: 'Branch Office',
            region: 'Test',
            coordinates: {
              lat: 91,
              lon: -80,
              source: 'verified',
              confidence: 'high',
              approximate: false,
            },
          },
        ],
      });

      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });

    it('rejects lon outside [-180, 180]', () => {
      const config = createValidConfig({
        offices: [
          {
            officeCode: 'TST X1',
            city: 'Invalid',
            state: 'XX',
            officeType: 'Branch Office',
            region: 'Test',
            coordinates: {
              lat: 40,
              lon: 181,
              source: 'verified',
              confidence: 'high',
              approximate: false,
            },
          },
        ],
      });

      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });
  });

  describe('Color format validation', () => {
    it('rejects invalid hex color for primaryColor', () => {
      const config = createValidConfig({
        theme: { primaryColor: 'red' },
      });

      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });

    it('rejects 3-digit hex color', () => {
      const config = createValidConfig({
        theme: { primaryColor: '#f00' },
      });

      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });

    it('accepts valid 6-digit hex color', () => {
      const config = createValidConfig({
        theme: { primaryColor: '#ff0000' },
      });

      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    it('rejects invalid region color', () => {
      const config = createValidConfig({
        theme: { regionColors: { 'Test Region': 'not-a-color' } },
      });

      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });
  });

  describe('URL format validation (Item 1)', () => {
    it('rejects javascript: protocol in vcardUrl', () => {
      const config = createValidConfig({
        regionalPersonnel: {
          'Test Region': [
            {
              name: 'Test',
              title: 'Manager',
              phone: '555-1234',
              email: 'test@example.com',
              vcardUrl: 'javascript:alert(1)',
            },
          ],
        },
      });

      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });

    it('rejects http:// (non-HTTPS) in vcardUrl', () => {
      const config = createValidConfig({
        regionalPersonnel: {
          'Test Region': [
            {
              name: 'Test',
              title: 'Manager',
              phone: '555-1234',
              email: 'test@example.com',
              vcardUrl: 'http://example.com',
            },
          ],
        },
      });

      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });

    it('rejects empty string in vcardUrl', () => {
      const config = createValidConfig({
        regionalPersonnel: {
          'Test Region': [
            {
              name: 'Test',
              title: 'Manager',
              phone: '555-1234',
              email: 'test@example.com',
              vcardUrl: '',
            },
          ],
        },
      });

      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });

    it('accepts valid HTTPS URL with query params in vcardUrl', () => {
      const config = createValidConfig({
        regionalPersonnel: {
          'Test Region': [
            {
              name: 'Test',
              title: 'Manager',
              phone: '555-1234',
              email: 'test@example.com',
              vcardUrl: 'https://example.com/path?a=1&b=2',
            },
          ],
        },
      });

      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });
  });

  describe('Email validation (Item 5)', () => {
    it('rejects invalid email format in personnel', () => {
      const config = createValidConfig({
        regionalPersonnel: {
          'Test Region': [
            {
              name: 'Test',
              title: 'Manager',
              phone: '555-1234',
              email: 'notanemail',
            },
          ],
        },
      });

      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });

    it('rejects email exceeding 254 chars', () => {
      const longLocal = 'a'.repeat(246);
      const config = createValidConfig({
        regionalPersonnel: {
          'Test Region': [
            {
              name: 'Test',
              title: 'Manager',
              phone: '555-1234',
              email: `${longLocal}@test.com`,
            },
          ],
        },
      });

      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });

    it('rejects name exceeding 256 chars', () => {
      const config = createValidConfig({
        name: 'A'.repeat(257),
      });

      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });

    it('accepts valid emails from real configs', () => {
      const config = createValidConfig({
        regionalPersonnel: {
          'Test Region': [
            {
              name: 'Jane Quirk',
              title: 'Manager',
              phone: '555-1234',
              email: 'jane@oddessentials.com',
              vcardUrl: 'https://example.com/vcards/jquirk',
            },
          ],
        },
        globalContacts: {
          mainPhone: '555-0000',
          mainEmail: 'hello@oddessentials.com',
          departmentEmails: {
            claims: 'claims@oddessentials.com',
            accounting: 'billing@oddessentials.com',
          },
        },
      });

      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });
  });

  describe('Optional fields may be omitted', () => {
    it('tagline is optional', () => {
      const config = createValidConfig();
      delete (config as Record<string, unknown>).tagline;
      expect(ClientConfigSchema.safeParse(config).success).toBe(true);
    });

    it('regionalPersonnel is optional', () => {
      const config = createValidConfig();
      expect(ClientConfigSchema.safeParse(config).success).toBe(true);
    });

    it('specialtyDivisions is optional', () => {
      const config = createValidConfig();
      expect(ClientConfigSchema.safeParse(config).success).toBe(true);
    });

    it('globalContacts is optional', () => {
      const config = createValidConfig();
      expect(ClientConfigSchema.safeParse(config).success).toBe(true);
    });

    it('theme is optional', () => {
      const config = createValidConfig();
      expect(ClientConfigSchema.safeParse(config).success).toBe(true);
    });
  });

  describe('Error message formatting', () => {
    it('produces human-readable error messages', () => {
      const config = {};
      const result = ClientConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
      if (!result.success) {
        const messages = formatValidationErrors(result.error);
        expect(messages.length).toBeGreaterThan(0);
        messages.forEach((msg) => {
          expect(typeof msg).toBe('string');
          expect(msg.length).toBeGreaterThan(0);
        });
      }
    });
  });
});

describe('loadClientConfig schema version pre-check (T028)', () => {
  beforeEach(() => {
    __resetConfig();
    vi.restoreAllMocks();
  });

  it('produces error with actual version number when schemaVersion exceeds max', async () => {
    const futureVersion = MAX_SUPPORTED_SCHEMA_VERSION + 5;

    vi.mocked(getClientConfigForClient).mockResolvedValue(
      createValidConfig({ schemaVersion: futureVersion })
    );

    await expect(loadClientConfig('usg')).rejects.toThrow(
      `Configuration schema version ${futureVersion} is not supported. Maximum supported: ${MAX_SUPPORTED_SCHEMA_VERSION}.`
    );
  });

  it('Zod error includes actual version number', () => {
    const futureVersion = MAX_SUPPORTED_SCHEMA_VERSION + 3;
    const config = createValidConfig({ schemaVersion: futureVersion });
    const result = ClientConfigSchema.safeParse(config);
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = formatValidationErrors(result.error);
      expect(messages.some((m) => m.includes(String(futureVersion)))).toBe(true);
      expect(messages.some((m) => m.includes('not supported'))).toBe(true);
    }
  });
});

describe('MapProviderConfig schema validation (T009)', () => {
  it('accepts config with mapProvider using "maplibre" provider', () => {
    const config = createValidConfig({
      theme: {
        mapProvider: {
          provider: 'maplibre',
          defaultZoom: 15,
        },
      },
    });
    const result = ClientConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it('accepts config with mapProvider using "apple" provider', () => {
    const config = createValidConfig({
      theme: {
        mapProvider: {
          provider: 'apple',
          appleMapToken: 'eyJhbGciOiJFUzI1NiJ9.test',
          defaultZoom: 16,
        },
      },
    });
    const result = ClientConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it('defaults provider to "maplibre" when mapProvider is present but provider is omitted', () => {
    const config = createValidConfig({
      theme: {
        mapProvider: {
          defaultZoom: 14,
        },
      },
    });
    const result = ClientConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.theme?.mapProvider?.provider).toBe('maplibre');
    }
  });

  it('defaults defaultZoom to 15 when omitted', () => {
    const config = createValidConfig({
      theme: {
        mapProvider: {
          provider: 'maplibre',
        },
      },
    });
    const result = ClientConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.theme?.mapProvider?.defaultZoom).toBe(15);
    }
  });

  it('accepts config with no mapProvider at all (entire section omitted)', () => {
    const config = createValidConfig({
      theme: {
        primaryColor: '#ff0000',
      },
    });
    const result = ClientConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.theme?.mapProvider).toBeUndefined();
    }
  });

  it('accepts config with no theme at all', () => {
    const config = createValidConfig();
    const result = ClientConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it('rejects invalid provider enum value', () => {
    const config = createValidConfig({
      theme: {
        mapProvider: {
          provider: 'bing',
          defaultZoom: 15,
        },
      },
    });
    const result = ClientConfigSchema.safeParse(config);
    expect(result.success).toBe(false);
  });

  it('accepts config with mapProvider using "google" provider', () => {
    const config = createValidConfig({
      theme: {
        mapProvider: {
          provider: 'google',
          googleMapsApiKey: 'AIzaSyTest1234567890',
          defaultZoom: 14,
        },
      },
    });
    const result = ClientConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it('validates tileStyleUrl must be a valid URL', () => {
    const config = createValidConfig({
      theme: {
        mapProvider: {
          provider: 'maplibre',
          tileStyleUrl: 'not-a-url',
          defaultZoom: 15,
        },
      },
    });
    const result = ClientConfigSchema.safeParse(config);
    expect(result.success).toBe(false);
  });

  it('accepts valid tileStyleUrl', () => {
    const config = createValidConfig({
      theme: {
        mapProvider: {
          provider: 'maplibre',
          tileStyleUrl: 'https://tiles.example.com/style.json',
          defaultZoom: 15,
        },
      },
    });
    const result = ClientConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it('rejects defaultZoom below 1', () => {
    const config = createValidConfig({
      theme: {
        mapProvider: {
          provider: 'maplibre',
          defaultZoom: 0,
        },
      },
    });
    const result = ClientConfigSchema.safeParse(config);
    expect(result.success).toBe(false);
  });

  it('rejects defaultZoom above 20', () => {
    const config = createValidConfig({
      theme: {
        mapProvider: {
          provider: 'maplibre',
          defaultZoom: 21,
        },
      },
    });
    const result = ClientConfigSchema.safeParse(config);
    expect(result.success).toBe(false);
  });

  it('accepts defaultZoom at boundary values (1 and 20)', () => {
    const configMin = createValidConfig({
      theme: {
        mapProvider: { provider: 'maplibre', defaultZoom: 1 },
      },
    });
    expect(ClientConfigSchema.safeParse(configMin).success).toBe(true);

    const configMax = createValidConfig({
      theme: {
        mapProvider: { provider: 'maplibre', defaultZoom: 20 },
      },
    });
    expect(ClientConfigSchema.safeParse(configMax).success).toBe(true);
  });
});
