/**
 * Unit Tests - Theme Injection (WLC-009)
 *
 * Tests CSS custom property injection from client configuration.
 * Verifies bounded token surface area per contracts/theme-injection.md.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { applyClientTheme, normalizeRegionToToken } from '../src/lib/theme-injector';
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
});
