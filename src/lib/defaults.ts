/**
 * Shared theme helpers.
 *
 * Hex-color validation used by the theme injector when applying client
 * brand colors to CSS custom properties.
 */

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

export function assertValidHex(hex: string): void {
  if (!HEX_COLOR_RE.test(hex)) {
    throw new Error(`Invalid hex color: "${hex}". Expected format: #RRGGBB.`);
  }
}
