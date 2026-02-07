/**
 * Theme Injector - CSS Custom Property Injection
 *
 * Applies brand theme overrides from client configuration to CSS custom properties.
 * Satisfies FR-009 (CSS brand token injection) and WLC-009 (Bounded Brand Theming Surface).
 */

import type { BrandTheme } from '../types/index.js';
import { assertValidHex } from './defaults.js';

/**
 * Apply client theme overrides to document CSS custom properties.
 * Called once at application startup after client config is loaded.
 *
 * Only modifies the bounded token surface area defined in the contract.
 */
export function applyClientTheme(theme: BrandTheme | undefined): void {
  if (!theme) return;

  const root = document.documentElement.style;

  if (theme.primaryColor) {
    root.setProperty('--color-primary', theme.primaryColor);
    const { light, dark } = computeVariants(theme.primaryColor);
    root.setProperty('--color-primary-light', light);
    root.setProperty('--color-primary-dark', dark);
    root.setProperty('--color-bg-overlay', hexToRgba(theme.primaryColor, 0.8));
  }

  if (theme.accentColor) {
    root.setProperty('--color-accent', theme.accentColor);
    const { light, dark } = computeVariants(theme.accentColor);
    root.setProperty('--color-accent-light', light);
    root.setProperty('--color-accent-dark', dark);
  }

  if (theme.regionColors) {
    for (const [regionName, color] of Object.entries(theme.regionColors)) {
      try {
        assertValidHex(color);
        const tokenId = normalizeRegionToToken(regionName);
        root.setProperty(`--color-region-${tokenId}`, color);
      } catch {
        console.warn(`Invalid regionColor for "${regionName}": "${color}". Skipping.`);
      }
    }
  }
}

/**
 * Normalize a region name to a CSS token identifier.
 * "Northeast Region" → "northeast-region"
 */
export function normalizeRegionToToken(regionName: string): string {
  return regionName.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Compute light (+15% lightness) and dark (-15% lightness) variants.
 */
function computeVariants(hex: string): { light: string; dark: string } {
  const { h, s, l } = hexToHsl(hex);
  return {
    light: hslToHex(h, s, Math.min(1, l + 0.15)),
    dark: hslToHex(h, s, Math.max(0, l - 0.15)),
  };
}

/**
 * Convert hex color to RGBA string.
 */
function hexToRgba(hex: string, alpha: number): string {
  assertValidHex(hex);
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Convert hex color to HSL components.
 */
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  assertValidHex(hex);
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return { h: 0, s: 0, l };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  return { h, s, l };
}

/**
 * Convert HSL components to hex color string.
 */
function hslToHex(h: number, s: number, l: number): string {
  if (s === 0) {
    const val = Math.round(l * 255);
    const hex = val.toString(16).padStart(2, '0');
    return `#${hex}${hex}${hex}`;
  }

  const hue2rgb = (p: number, q: number, t: number): number => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
