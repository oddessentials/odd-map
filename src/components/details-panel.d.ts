/**
 * Type declarations for details-panel component (JavaScript)
 */

import type { Region, Office } from '../types/index.js';

export interface DetailsPanelOptions {
  onClose?: () => void;
}

export declare class DetailsPanel {
  constructor(container: HTMLElement, options?: DetailsPanelOptions);
  showRegion(region: Region): void;
  showOffice(office: Office, region: Region): void;
  showPlaceholder(): void;
  close(): void;
}
