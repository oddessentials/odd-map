import type { Office, OfficeWithRegion } from '../types/index.js';

export function ensureOfficeWithRegion(
  office: Office | OfficeWithRegion,
  fallbackRegionName: string
): OfficeWithRegion {
  if (
    'regionName' in office &&
    typeof (office as OfficeWithRegion).regionName === 'string' &&
    (office as OfficeWithRegion).regionName.length > 0
  ) {
    return office as OfficeWithRegion;
  }
  return { ...office, regionName: fallbackRegionName };
}
