/**
 * Map Provider Type Definitions
 *
 * Interfaces for the map provider abstraction layer.
 * Both MapLibre and Apple providers implement these contracts.
 */

import type { MarkerVisualState } from '../marker-state.js';
export type { MarkerVisualState };

/**
 * Options for initializing a map provider instance.
 */
export interface MapProviderOptions {
  zoom: number;
  interactive: boolean;
  attributionControl: boolean;
  style?: 'light' | 'dark';
}

/**
 * Styling options for a map marker.
 */
export interface MarkerOptions {
  color: string;
  label?: string;
}

/**
 * Options for animated map transitions (fly-to).
 */
export interface FlyToOptions {
  zoom?: number;
  duration?: number;
}

/**
 * Data for a single marker in the full-screen tile map mode.
 */
export interface TileMapMarker {
  officeCode: string;
  lat: number;
  lon: number;
  label: string;
  color: string;
  regionName: string;
}

/**
 * Base map provider interface.
 * Implemented by MapLibre and Apple providers for mini-map usage.
 */
export interface MapProvider {
  /** Initialize the provider (load library, create map instance) */
  initialize(container: HTMLElement, options: MapProviderOptions): Promise<void>;

  /** Set the map center and place a marker */
  setLocation(lat: number, lon: number, options?: MarkerOptions): void;

  /** Animate to a new location (fly-to) */
  flyTo(lat: number, lon: number, options?: FlyToOptions): void;

  /** Update marker style (e.g., brand color change) */
  updateMarkerStyle(options: MarkerOptions): void;

  /** Handle container resize */
  resize(): void;

  /** Clean up map instance and free resources */
  dispose(): void;

  /** Get the underlying map element for DOM reparenting (expand/collapse) */
  getMapElement(): HTMLElement;
}

/**
 * Extended provider interface for full-screen tile map mode.
 * Adds multi-marker support, clustering, and click handling.
 */
export interface TileMapProvider extends MapProvider {
  /** Add multiple markers with clustering */
  setMarkers(markers: TileMapMarker[]): void;

  /** Update visual states of markers (selected, dimmed, highlighted) */
  updateMarkerStates(states: MarkerVisualState[]): void;

  /** Fit the map view to show a set of markers */
  fitBounds(markers: TileMapMarker[], padding?: number): void;

  /** Register click handler for markers */
  onMarkerClick(handler: (officeCode: string) => void): void;
}

/**
 * Configuration for the map provider, from client config JSON.
 */
export interface MapProviderConfig {
  provider: 'maplibre' | 'apple';
  tileStyleUrl?: string;
  appleMapToken?: string;
  defaultZoom: number;
}
