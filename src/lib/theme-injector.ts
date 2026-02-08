/**
 * Theme Injector - CSS Custom Property Injection
 *
 * Applies brand theme overrides from client configuration to CSS custom properties.
 * Satisfies FR-009 (CSS brand token injection) and WLC-009 (Bounded Brand Theming Surface).
 */

import type { BrandTheme } from '../types/index.js';
import { assertValidHex } from './defaults.js';

/** Light-mode card background — matches --color-bg-alt in tokens.css */
const SURFACE_LIGHT = '#f5f5f5';
/** Dark-mode card background — matches dark-mode .contact-card bg in app.css */
const SURFACE_DARK = '#252540';

/**
 * WCAG 2.1 relative luminance of a hex color.
 * @see https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function relativeLuminance(hex: string): number {
  assertValidHex(hex);
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * WCAG 2.1 contrast ratio between two hex colors.
 * Returns a value between 1 and 21.
 */
export function contrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Adjust a foreground color's lightness until it meets the required contrast
 * ratio against the given background. Preserves hue and saturation.
 *
 * On light backgrounds, darkens the foreground; on dark backgrounds, lightens it.
 * Returns the original color unchanged if it already passes.
 */
export function ensureContrast(fg: string, bg: string, minRatio = 4.5): string {
  if (contrastRatio(fg, bg) >= minRatio) return fg;

  const bgLum = relativeLuminance(bg);
  const { h, s, l } = hexToHsl(fg);
  // Darken on light backgrounds, lighten on dark backgrounds
  const direction = bgLum > 0.5 ? -0.01 : 0.01;
  let adjusted = l;

  for (let i = 0; i < 100; i++) {
    adjusted = Math.max(0, Math.min(1, adjusted + direction));
    const candidate = hslToHex(h, s, adjusted);
    if (contrastRatio(candidate, bg) >= minRatio) return candidate;
  }

  // Fallback: return the maximally adjusted color
  return hslToHex(h, s, Math.max(0, Math.min(1, adjusted)));
}

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
    root.setProperty('--color-primary-on-light', ensureContrast(theme.primaryColor, SURFACE_LIGHT));
    root.setProperty('--color-primary-on-dark', ensureContrast(theme.primaryColor, SURFACE_DARK));
  }

  if (theme.accentColor) {
    root.setProperty('--color-accent', theme.accentColor);
    const { light, dark } = computeVariants(theme.accentColor);
    root.setProperty('--color-accent-light', light);
    root.setProperty('--color-accent-dark', dark);
    root.setProperty('--color-accent-on-light', ensureContrast(theme.accentColor, SURFACE_LIGHT));
    root.setProperty('--color-accent-on-dark', ensureContrast(theme.accentColor, SURFACE_DARK));
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
