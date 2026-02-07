/**
 * Type declarations for region-list component (JavaScript)
 */

import type { Region, Office } from '../types/index.js';

export interface RegionListOptions {
  onRegionClick?: (region: Region) => void;
  onOfficeClick?: (office: Office, region: Region) => void;
}

export declare class RegionList {
  constructor(container: HTMLElement, options?: RegionListOptions);
  highlightRegion(regionName: string): void;
  reset(): void;
}
