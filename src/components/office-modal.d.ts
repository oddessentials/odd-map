/**
 * Office Modal Component TypeScript Declarations
 */

import type { Office, OfficeWithRegion, Region } from '../types/index.js';

export class OfficeModal {
  modal: HTMLDivElement | null;
  overlay: HTMLDivElement | null;
  focusableElements: Element[];
  previouslyFocused: Element | null;
  isOpen: boolean;

  constructor();
  show(office: Office | OfficeWithRegion, region?: Region): void;
  createModal(office: Office | OfficeWithRegion, region?: Region): void;
  buildDirectionsUrl(office: Office | OfficeWithRegion): string;
  updateFocusableElements(): void;
  handleKeydown(event: KeyboardEvent): void;
  handleClickOutside(event: MouseEvent): void;
  close(): void;
}

export function showOfficeModal(office: Office | OfficeWithRegion, region?: Region): OfficeModal;
export function closeOfficeModal(): void;
