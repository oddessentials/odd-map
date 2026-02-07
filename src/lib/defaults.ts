/**
 * Shared Default Region Colors and Camera Views
 *
 * Extracted from map-3d.js hardcoded constants to serve as fallbacks
 * when client config does not provide overrides.
 * Used by both the 3D globe renderer and theme injector.
 */

import type { CameraView } from '../types/index.js';

/**
 * Default region colors as CSS hex strings.
 * Used as fallback when config.theme.regionColors does not override a region.
 */
export const DEFAULT_REGION_COLORS: Record<string, string> = {
  'Northeast Region': '#1a5276',
  'Southeast Region': '#196f3d',
  'South Region': '#b9770e',
  'Southern California': '#7d3c98',
  'West Region': '#2874a6',
  'Midwest Region': '#a04000',
};

/**
 * Default camera views for 3D globe.
 * Used as fallback when config.theme.cameraViews does not override a region.
 */
export const DEFAULT_CAMERA_VIEWS: Record<string, CameraView> = {
  'Northeast Region': { distance: 180, lat: 41, lon: -77 },
  'Southeast Region': { distance: 180, lat: 30, lon: -84 },
  'South Region': { distance: 180, lat: 31, lon: -98 },
  'Southern California': { distance: 180, lat: 34, lon: -118 },
  'West Region': { distance: 180, lat: 45, lon: -115 },
  'Midwest Region': { distance: 180, lat: 43, lon: -90 },
};

/** Default USA overview camera view */
export const DEFAULT_USA_VIEW: CameraView = { distance: 280, lat: 39, lon: -98 };

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

export function assertValidHex(hex: string): void {
  if (!HEX_COLOR_RE.test(hex)) {
    throw new Error(`Invalid hex color: "${hex}". Expected format: #RRGGBB.`);
  }
}

/**
 * Convert CSS hex color string to Three.js integer format.
 * "#1a5276" → 0x1a5276
 */
export function hexToThreeColor(hex: string): number {
  assertValidHex(hex);
  return parseInt(hex.replace('#', ''), 16);
}
