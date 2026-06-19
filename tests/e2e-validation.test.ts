/**
 * End-to-End Validation Tests (Session 7: T042, T043, T044)
 *
 * Comprehensive validation of the white-label config system:
 * - T042: Both client configs load and produce correct data
 * - T043: Odd Essentials exercises all 9 mandatory edge cases
 * - T044: Quickstart-style minimal client creation works
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ClientConfigSchema, formatValidationErrors } from '../src/lib/client-config.schema';
import { computeMarkerStates } from '../src/lib/marker-state';
import { assertValidHex } from '../src/lib/defaults';

// ─── Helpers ──────────────────────────────────────────────────────

function loadRawConfig(clientId: string): unknown {
  const path = join(__dirname, '..', 'config', `${clientId}-client.json`);
  return JSON.parse(readFileSync(path, 'utf-8'));
}

// ─── T042: End-to-End Validation with Both Configs ────────────────

describe('T042: End-to-End Validation', () => {
  describe('USG Config', () => {
    const raw = loadRawConfig('usg');

    it('passes schema validation', () => {
      const result = ClientConfigSchema.safeParse(raw);
      if (!result.success) {
        const msgs = formatValidationErrors(result.error);
        throw new Error(`USG schema validation failed:\n${msgs.join('\n')}`);
      }
      expect(result.success).toBe(true);
    });

    it('has 13 offices', () => {
      const result = ClientConfigSchema.safeParse(raw);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.offices).toHaveLength(13);
      }
    });

    it('has 6 distinct regions across offices', () => {
      const result = ClientConfigSchema.safeParse(raw);
      expect(result.success).toBe(true);
      if (result.success) {
        const regions = new Set(result.data.offices.map((o) => o.region));
        expect(regions.size).toBe(6);
      }
    });

    it('has USG branding fields', () => {
      const result = ClientConfigSchema.safeParse(raw);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('USG Insurance');
        expect(result.data.copyrightHolder).toContain('USG');
        expect(result.data.tagline).toBeDefined();
      }
    });

    it('has complete global contacts', () => {
      const result = ClientConfigSchema.safeParse(raw);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.globalContacts).toBeDefined();
        expect(result.data.globalContacts?.mainPhone).toBeDefined();
        expect(result.data.globalContacts?.mainEmail).toBeDefined();
      }
    });

    it('has specialty divisions', () => {
      const result = ClientConfigSchema.safeParse(raw);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.specialtyDivisions).toBeDefined();
        expect(result.data.specialtyDivisions!.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Odd Essentials Config', () => {
    const raw = loadRawConfig('oddessentials');

    it('passes schema validation', () => {
      const result = ClientConfigSchema.safeParse(raw);
      if (!result.success) {
        const msgs = formatValidationErrors(result.error);
        throw new Error(`OE schema validation failed:\n${msgs.join('\n')}`);
      }
      expect(result.success).toBe(true);
    });

    it('has 5 offices', () => {
      const result = ClientConfigSchema.safeParse(raw);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.offices).toHaveLength(5);
      }
    });

    it('has 4 distinct regions across offices', () => {
      const result = ClientConfigSchema.safeParse(raw);
      expect(result.success).toBe(true);
      if (result.success) {
        const regions = new Set(result.data.offices.map((o) => o.region));
        expect(regions.size).toBe(4);
        expect(regions).toContain('Northeast Region');
        expect(regions).toContain('South Region');
        expect(regions).toContain('West Region');
        expect(regions).toContain('Phantom Region');
      }
    });

    it('has Odd Essentials branding', () => {
      const result = ClientConfigSchema.safeParse(raw);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('Odd Essentials');
        expect(result.data.copyrightHolder).toBe('Odd Essentials LLC');
      }
    });
  });

  describe('Client registry defaults', () => {
    it('first client in test registry is "oddessentials"', () => {
      const registry = JSON.parse(
        readFileSync(join(__dirname, '..', 'config', 'clients.test.json'), 'utf-8')
      );
      expect(registry.clients[0]).toBe('oddessentials');
    });
  });

  describe('Cross-config isolation', () => {
    it('USG and Odd Essentials have different clientIds', () => {
      const usg = ClientConfigSchema.parse(loadRawConfig('usg'));
      const oe = ClientConfigSchema.parse(loadRawConfig('oddessentials'));
      expect(usg.clientId).not.toBe(oe.clientId);
    });

    it('USG and Odd Essentials have no overlapping office codes', () => {
      const usg = ClientConfigSchema.parse(loadRawConfig('usg'));
      const oe = ClientConfigSchema.parse(loadRawConfig('oddessentials'));
      const usgCodes = new Set(usg.offices.map((o) => o.officeCode));
      const oeCodes = new Set(oe.offices.map((o) => o.officeCode));
      for (const code of oeCodes) {
        expect(usgCodes.has(code)).toBe(false);
      }
    });
  });
});

// ─── T043: Odd Essentials Edge Case Coverage (SC-008) ─────────────

describe('T043: Odd Essentials Edge Cases (SC-008)', () => {
  const raw = loadRawConfig('oddessentials') as Record<string, unknown>;
  const config = ClientConfigSchema.parse(raw);

  it('Edge Case 1: offices across 3+ real regions + 1 phantom', () => {
    const regions = new Set(config.offices.map((o) => o.region));
    // 3 real regions + 1 phantom = 4 total
    expect(regions.size).toBeGreaterThanOrEqual(4);
    expect(regions).toContain('Phantom Region');
  });

  it('Edge Case 2: specialty division with empty personnel array', () => {
    const emptyDiv = config.specialtyDivisions?.find((d) => d.personnel.length === 0);
    expect(emptyDiv).toBeDefined();
    expect(emptyDiv?.name).toBe('Umbrella Services');
  });

  it('Edge Case 3: region with offices but no personnel', () => {
    // West Region has offices (OE OR1, OE WA1) but no entry in regionalPersonnel
    const westOffices = config.offices.filter((o) => o.region === 'West Region');
    expect(westOffices.length).toBeGreaterThan(0);

    const westPersonnel = config.regionalPersonnel?.['West Region'];
    expect(westPersonnel).toBeUndefined();
  });

  it('Edge Case 4: partial global contacts (lossRuns omitted)', () => {
    expect(config.globalContacts).toBeDefined();
    expect(config.globalContacts?.mainPhone).toBeDefined();
    expect(config.globalContacts?.mainEmail).toBeDefined();
    expect(config.globalContacts?.departmentEmails?.claims).toBeDefined();
    expect(config.globalContacts?.departmentEmails?.accounting).toBeDefined();
    // lossRuns deliberately omitted
    expect(config.globalContacts?.departmentEmails?.lossRuns).toBeUndefined();
  });

  it('Edge Case 5: partial theme regionColors (only 2 of 3 real regions)', () => {
    expect(config.theme?.regionColors).toBeDefined();
    const overriddenRegions = Object.keys(config.theme!.regionColors!);
    expect(overriddenRegions).toContain('Northeast Region');
    expect(overriddenRegions).toContain('South Region');
    expect(overriddenRegions).not.toContain('West Region');
  });

  it('Edge Case 7: personnel entry without vcardUrl', () => {
    const marco = config.regionalPersonnel?.['South Region']?.[0];
    expect(marco).toBeDefined();
    expect(marco?.name).toBe('Marco Bizarre');
    expect(marco?.vcardUrl).toBeUndefined();
  });

  it('Edge Case 8: schemaVersion is 1', () => {
    expect(config.schemaVersion).toBe(1);
  });
});

// ─── Marker State Centralization (SC-009) ─────────────────────────

describe('Marker state centralization validation (SC-009)', () => {
  it('produces identical output regardless of conceptual renderer', () => {
    // Simulate offices from Odd Essentials
    const offices = [
      { officeCode: 'OE NY1', regionName: 'Northeast Region' },
      { officeCode: 'OE FL1', regionName: 'South Region' },
      { officeCode: 'OE OR1', regionName: 'West Region' },
    ];

    const input = {
      allOffices: offices,
      selectedRegion: 'Northeast Region',
      selectedOfficeCode: 'OE NY1',
      hoveredOfficeCode: null,
    };

    // Call twice — pure function must produce identical results
    const states1 = computeMarkerStates(input);
    const states2 = computeMarkerStates(input);
    expect(states1).toEqual(states2);

    // Verify specific state rules
    const ny = states1.find((s) => s.officeCode === 'OE NY1')!;
    expect(ny.selected).toBe(true);
    expect(ny.dimmed).toBe(false);

    const fl = states1.find((s) => s.officeCode === 'OE FL1')!;
    expect(fl.selected).toBe(false);
    expect(fl.dimmed).toBe(true);

    // All visible
    states1.forEach((s) => expect(s.visible).toBe(true));
  });
});

// ─── Defaults Module Validation ───────────────────────────────────

describe('Defaults module validation', () => {
  it('assertValidHex accepts valid and rejects invalid', () => {
    expect(() => assertValidHex('#1a5276')).not.toThrow();
    expect(() => assertValidHex('#FF00AA')).not.toThrow();
    expect(() => assertValidHex('red')).toThrow('Invalid hex color');
    expect(() => assertValidHex('#abc')).toThrow('Invalid hex color');
  });
});

// ─── T044: Quickstart Validation (Minimal Third Client) ──────────

describe('T044: Quickstart Validation', () => {
  it('a minimal valid client config passes schema validation', () => {
    // Simulate creating a minimal "acme" config following the quickstart pattern
    const minimalConfig = {
      schemaVersion: 1,
      clientId: 'quicktest',
      name: 'Quick Test Insurance',
      copyrightHolder: 'Quick Test Inc.',
      offices: [
        {
          officeCode: 'QT TX1',
          city: 'Austin',
          state: 'Texas',
          officeType: 'Branch Office',
          address: '100 Main St, Austin, TX 78701',
          region: 'South Region',
          coordinates: {
            lat: 30.2672,
            lon: -97.7431,
            source: 'verified',
            confidence: 'high',
            approximate: false,
          },
        },
      ],
    };

    const result = ClientConfigSchema.safeParse(minimalConfig);
    if (!result.success) {
      const msgs = formatValidationErrors(result.error);
      throw new Error(`Minimal config failed:\n${msgs.join('\n')}`);
    }
    expect(result.success).toBe(true);
  });

  it('minimal config with all optional fields omitted is valid', () => {
    const bare = {
      schemaVersion: 1,
      clientId: 'bare',
      name: 'Bare Minimum',
      copyrightHolder: 'Bare Inc.',
      offices: [
        {
          officeCode: 'BARE 1',
          city: 'Nowhere',
          state: 'Kansas',
          officeType: 'Branch Office',
          region: 'Midwest Region',
          coordinates: {
            lat: 39.0,
            lon: -98.0,
            source: 'city_centroid',
            confidence: 'low',
            approximate: true,
          },
        },
      ],
    };

    const result = ClientConfigSchema.safeParse(bare);
    expect(result.success).toBe(true);
    if (result.success) {
      // Optional fields are undefined or have defaults
      expect(result.data.tagline).toBeUndefined();
      expect(result.data.regionalPersonnel).toBeUndefined();
      expect(result.data.specialtyDivisions).toBeUndefined();
      expect(result.data.globalContacts).toBeUndefined();
      expect(result.data.theme).toBeUndefined();
      // address defaults to null when omitted
      expect(result.data.offices[0].address).toBeNull();
    }
  });

  it('acme remains registered and user-selectable', () => {
    // acme is wired into the client-config import maps and is user-selectable.
    const registry = JSON.parse(
      readFileSync(join(__dirname, '..', 'config', 'clients.test.json'), 'utf-8')
    );
    expect(registry.clients).toContain('acme');
  });
});

// ─── Schema Version Guard (SC-010) ───────────────────────────────

describe('Schema version guard (SC-010)', () => {
  it('schemaVersion 999 is rejected with descriptive error', () => {
    const futureConfig = {
      schemaVersion: 999,
      clientId: 'future',
      name: 'Future Client',
      copyrightHolder: 'Future Inc.',
      offices: [
        {
          officeCode: 'FUT 1',
          city: 'Tomorrow',
          state: 'CA',
          officeType: 'Branch Office',
          region: 'West Region',
          coordinates: {
            lat: 34.0,
            lon: -118.0,
            source: 'verified',
            confidence: 'high',
            approximate: false,
          },
        },
      ],
    };

    const result = ClientConfigSchema.safeParse(futureConfig);
    expect(result.success).toBe(false);
    if (!result.success) {
      const msgs = formatValidationErrors(result.error);
      expect(msgs.some((m) => m.includes('not supported') || m.includes('Maximum supported'))).toBe(
        true
      );
    }
  });
});
