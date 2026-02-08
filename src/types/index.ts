/**
 * Locations Map - Core Type Definitions
 *
 * Strict TypeScript types for the application data model.
 * Field names use camelCase, matching the client config JSON schema.
 */

/**
 * Geographic coordinates with confidence metadata
 */
export interface Coordinates {
  lat: number;
  lon: number;
  source: 'verified' | 'business_district' | 'city_centroid' | 'region_centroid';
  confidence: 'high' | 'medium' | 'low';
  approximate: boolean;
}

/**
 * Personnel/contact information
 */
export interface Personnel {
  name: string;
  title: string;
  phone: string;
  email: string;
  vcardUrl?: string;
}

/**
 * Office location
 */
export interface Office {
  officeCode: string;
  state: string;
  city: string;
  officeType: 'Branch Office' | 'Satellite Sales Office';
  address: string | null;
  region: string;
  coordinates: Coordinates;
  directionsUrl?: string;
}

/**
 * Office with region name attached (from getAllOffices)
 */
export interface OfficeWithRegion extends Office {
  regionName: string;
}

/**
 * Geographic region with offices and personnel
 */
export interface Region {
  name: string;
  personnel: Personnel[];
  offices: Office[];
}

/**
 * Specialty division (non-geographic)
 */
export interface SpecialtyDivision {
  name: string;
  personnel: Personnel[];
}

/**
 * Global contact information
 */
export interface GlobalContacts {
  mainPhone?: string;
  mainEmail?: string;
  departmentEmails?: {
    claims?: string;
    lossRuns?: string;
    accounting?: string;
  };
  accountingContact?: {
    name: string;
    title: string;
    phone: string;
    email: string;
  };
}

/**
 * 3D camera view override per region
 */
export interface CameraView {
  distance: number;
  lat: number;
  lon: number;
}

/**
 * Brand theme overrides
 */
export interface BrandTheme {
  primaryColor?: string;
  accentColor?: string;
  regionColors?: Record<string, string>;
  cameraViews?: Record<string, CameraView>;
  mapProvider?: {
    provider: 'maplibre' | 'apple' | 'google';
    tileStyleUrl?: string;
    appleMapToken?: string;
    googleMapsApiKey?: string;
    defaultZoom: number;
  };
}

/**
 * Application state machine states
 */
export enum AppState {
  USA_VIEW = 'USA_VIEW',
  REGION_VIEW = 'REGION_VIEW',
  LOCATION_VIEW = 'LOCATION_VIEW',
}

/**
 * SVG viewBox coordinates
 */
export interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Map component options
 */
export interface MapOptions {
  onRegionClick?: (regionName: string) => void;
  onOfficeClick?: (office: OfficeWithRegion) => void;
  onReset?: () => void;
}

/**
 * Camera position for 3D map
 */
export interface CameraPosition {
  position: [number, number, number];
  target: [number, number, number];
}
