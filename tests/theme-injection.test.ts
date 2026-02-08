/**
 * Unit Tests - Theme Injection (WLC-009)
 *
 * Tests CSS custom property injection from client configuration.
 * Verifies bounded token surface area per contracts/theme-injection.md.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  applyClientTheme,
  normalizeRegionToToken,
  relativeLuminance,
  contrastRatio,
  ensureContrast,
} from '../src/lib/theme-injector';
import type { BrandTheme } from '../src/types/index';

describe('Theme Injection', () => {
  beforeEach(() => {
    // Reset inline styles on documentElement
    document.documentElement.removeAttribute('style');
  });

  describe('Contract Assertion 1: undefined theme does nothing', () => {
    it('does not modify CSS properties when theme is undefined', () => {
      const styleBefore = document.documentElement.getAttribute('style');
      applyClientTheme(undefined);
      const styleAfter = document.documentElement.getAttribute('style');

      expect(styleBefore).toBe(styleAfter);
    });
  });

  describe('Contract Assertion 2: primaryColor sets --color-primary + variants', () => {
    it('sets --color-primary to the provided value', () => {
      const theme: BrandTheme = { primaryColor: '#ff0000' };
      applyClientTheme(theme);

      const root = document.documentElement.style;
      expect(root.getPropertyValue('--color-primary')).toBe('#ff0000');
    });

    it('computes and sets --color-primary-light', () => {
      const theme: BrandTheme = { primaryColor: '#ff0000' };
      applyClientTheme(theme);

      const root = document.documentElement.style;
      const light = root.getPropertyValue('--color-primary-light');
      expect(light).toBeTruthy();
      expect(light).not.toBe('#ff0000');
    });

    it('computes and sets --color-primary-dark', () => {
      const theme: BrandTheme = { primaryColor: '#ff0000' };
      applyClientTheme(theme);

      const root = document.documentElement.style;
      const dark = root.getPropertyValue('--color-primary-dark');
      expect(dark).toBeTruthy();
      expect(dark).not.toBe('#ff0000');
    });

    it('computes and sets --color-bg-overlay from primary', () => {
      const theme: BrandTheme = { primaryColor: '#003366' };
      applyClientTheme(theme);

      const root = document.documentElement.style;
      const overlay = root.getPropertyValue('--color-bg-overlay');
      expect(overlay).toContain('rgba');
      expect(overlay).toContain('0.8');
    });
  });

  describe('Contract Assertion 3: regionColors sets --color-region-* tokens', () => {
    it('sets normalized region color token', () => {
      const theme: BrandTheme = {
        regionColors: { 'Northeast Region': '#aabbcc' },
      };
      applyClientTheme(theme);

      const root = document.documentElement.style;
      expect(root.getPropertyValue('--color-region-northeast-region')).toBe('#aabbcc');
    });

    it('handles multiple region colors', () => {
      const theme: BrandTheme = {
        regionColors: {
          'Northeast Region': '#aabbcc',
          'Southern California': '#ddeeff',
        },
      };
      applyClientTheme(theme);

      const root = document.documentElement.style;
      expect(root.getPropertyValue('--color-region-northeast-region')).toBe('#aabbcc');
      expect(root.getPropertyValue('--color-region-southern-california')).toBe('#ddeeff');
    });
  });

  describe('Contract Assertion 4: Only bounded tokens modified', () => {
    it('does not set tokens outside the bounded surface area', () => {
      const theme: BrandTheme = {
        primaryColor: '#ff0000',
        accentColor: '#00ff00',
        regionColors: { 'Test Region': '#0000ff' },
      };
      applyClientTheme(theme);

      const root = document.documentElement.style;
      // These tokens should NOT exist (they're not in the bounded surface)
      expect(root.getPropertyValue('--color-text')).toBe('');
      expect(root.getPropertyValue('--color-bg')).toBe('');
      expect(root.getPropertyValue('--color-border')).toBe('');
      expect(root.getPropertyValue('--font-sans')).toBe('');
    });

    it('sets all 4 contrast-safe tokens within the bounded surface', () => {
      const theme: BrandTheme = {
        primaryColor: '#003366',
        accentColor: '#0066cc',
      };
      applyClientTheme(theme);

      const root = document.documentElement.style;
      expect(root.getPropertyValue('--color-primary-on-light')).toBeTruthy();
      expect(root.getPropertyValue('--color-primary-on-dark')).toBeTruthy();
      expect(root.getPropertyValue('--color-accent-on-light')).toBeTruthy();
      expect(root.getPropertyValue('--color-accent-on-dark')).toBeTruthy();
    });
  });

  describe('Accent color', () => {
    it('sets --color-accent and derived variants', () => {
      const theme: BrandTheme = { accentColor: '#00ff00' };
      applyClientTheme(theme);

      const root = document.documentElement.style;
      expect(root.getPropertyValue('--color-accent')).toBe('#00ff00');
      expect(root.getPropertyValue('--color-accent-light')).toBeTruthy();
      expect(root.getPropertyValue('--color-accent-dark')).toBeTruthy();
    });
  });

  describe('Hex color input validation', () => {
    it('rejects invalid hex color in primaryColor', () => {
      const theme: BrandTheme = { primaryColor: '#GGGGGG' };
      expect(() => applyClientTheme(theme)).toThrow('Invalid hex color');
    });

    it('rejects 3-digit hex shorthand in accentColor', () => {
      const theme: BrandTheme = { accentColor: '#FFF' };
      expect(() => applyClientTheme(theme)).toThrow('Invalid hex color');
    });

    it('rejects non-hex string in primaryColor used with overlay', () => {
      const theme: BrandTheme = { primaryColor: 'notahex' };
      expect(() => applyClientTheme(theme)).toThrow('Invalid hex color');
    });
  });

  describe('Region name normalization', () => {
    it('normalizes "Northeast Region" to "northeast-region"', () => {
      expect(normalizeRegionToToken('Northeast Region')).toBe('northeast-region');
    });

    it('normalizes "Southern California" to "southern-california"', () => {
      expect(normalizeRegionToToken('Southern California')).toBe('southern-california');
    });

    it('normalizes "South Region" to "south-region"', () => {
      expect(normalizeRegionToToken('South Region')).toBe('south-region');
    });

    it('handles multiple spaces', () => {
      expect(normalizeRegionToToken('New  York  Region')).toBe('new-york-region');
    });
  });

  describe('Contrast enforcement', () => {
    describe('relativeLuminance', () => {
      it('returns 0 for black', () => {
        expect(relativeLuminance('#000000')).toBeCloseTo(0, 4);
      });

      it('returns 1 for white', () => {
        expect(relativeLuminance('#ffffff')).toBeCloseTo(1, 4);
      });

      it('returns a known midpoint for #808080', () => {
        const lum = relativeLuminance('#808080');
        expect(lum).toBeGreaterThan(0.2);
        expect(lum).toBeLessThan(0.25);
      });
    });

    describe('contrastRatio', () => {
      it('returns 21:1 for black on white', () => {
        expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
      });

      it('returns ~3.25:1 for oddessentials accent (#1a9c54) on card bg (#f5f5f5)', () => {
        const ratio = contrastRatio('#1a9c54', '#f5f5f5');
        expect(ratio).toBeGreaterThan(3.0);
        expect(ratio).toBeLessThan(3.5);
      });
    });

    describe('ensureContrast', () => {
      it('darkens oddessentials accent to pass 4.5:1 on light surface', () => {
        const result = ensureContrast('#1a9c54', '#f5f5f5');
        expect(result).not.toBe('#1a9c54');
        expect(contrastRatio(result, '#f5f5f5')).toBeGreaterThanOrEqual(4.5);
      });

      it('returns already-passing color unchanged', () => {
        // #003366 on #f5f5f5 is ~9.2:1, well above 4.5
        expect(ensureContrast('#003366', '#f5f5f5')).toBe('#003366');
      });

      it('lightens white-on-white to create contrast', () => {
        // White on white has ratio 1:1 — must darken
        const result = ensureContrast('#ffffff', '#ffffff');
        expect(contrastRatio(result, '#ffffff')).toBeGreaterThanOrEqual(4.5);
      });

      it('lightens black-on-dark to create contrast', () => {
        const result = ensureContrast('#000000', '#1a1a2e');
        // Black on near-black is low contrast; should lighten
        expect(contrastRatio(result, '#1a1a2e')).toBeGreaterThanOrEqual(4.5);
      });
    });

    describe('applyClientTheme contrast tokens', () => {
      it('sets all 4 contrast tokens', () => {
        const theme: BrandTheme = {
          primaryColor: '#1a9c54',
          accentColor: '#1a9c54',
        };
        applyClientTheme(theme);

        const root = document.documentElement.style;
        expect(root.getPropertyValue('--color-primary-on-light')).toBeTruthy();
        expect(root.getPropertyValue('--color-primary-on-dark')).toBeTruthy();
        expect(root.getPropertyValue('--color-accent-on-light')).toBeTruthy();
        expect(root.getPropertyValue('--color-accent-on-dark')).toBeTruthy();
      });

      it('all new tokens have contrast ratio >= 4.5 against their target surface', () => {
        const theme: BrandTheme = {
          primaryColor: '#1a9c54',
          accentColor: '#1a9c54',
        };
        applyClientTheme(theme);

        const root = document.documentElement.style;
        const primaryOnLight = root.getPropertyValue('--color-primary-on-light');
        const primaryOnDark = root.getPropertyValue('--color-primary-on-dark');
        const accentOnLight = root.getPropertyValue('--color-accent-on-light');
        const accentOnDark = root.getPropertyValue('--color-accent-on-dark');

        expect(contrastRatio(primaryOnLight, '#f5f5f5')).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(primaryOnDark, '#252540')).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(accentOnLight, '#f5f5f5')).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(accentOnDark, '#252540')).toBeGreaterThanOrEqual(4.5);
      });
    });
  });
});
