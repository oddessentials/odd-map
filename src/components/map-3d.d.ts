/**
 * Type declarations for 3D map component (JavaScript)
 */

import type { MapOptions, OfficeWithRegion } from '../types/index.js';

/** Backface culling threshold for hiding markers (dot product value) */
export declare const BACKFACE_HIDE_THRESHOLD: number;

/** Backface culling threshold for showing markers (dot product value) */
export declare const BACKFACE_SHOW_THRESHOLD: number;

/**
 * Compute marker visibility using hysteresis to prevent flickering.
 * @param currentlyVisible - Current visibility state of the marker
 * @param dotProduct - Dot product of camera-to-marker direction and marker normal
 * @returns New visibility state
 */
export declare function computeMarkerVisibility(
  currentlyVisible: boolean,
  dotProduct: number
): boolean;

/** Texture longitude offset in degrees for horizontal alignment */
export declare const TEXTURE_LONGITUDE_OFFSET_DEG: number;

/** Texture latitude offset in texture units for vertical alignment */
export declare const TEXTURE_LATITUDE_OFFSET: number;

export declare class Map3D {
  constructor(container: HTMLElement, options?: MapOptions);
  selectRegion(regionName: string): void;
  selectOffice(office: OfficeWithRegion): void;
  reset(): void;
  dispose(): void;
  getState(): { selectedRegion: string | null; selectedOffice: OfficeWithRegion | null };
  /** Cancel any in-progress camera animation */
  cancelAnimation(): void;
  /** Toggle auto-rotation on/off and return new user preference state */
  toggleAutoRotate(): boolean;
  /** Get current auto-rotation user preference (may differ from effective state during animations) */
  getAutoRotate(): boolean;
}

export declare function hasWebGL(): boolean;
