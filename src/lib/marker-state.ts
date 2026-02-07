/**
 * Marker State Manager - Centralized Visual State Computation
 *
 * Pure function that computes marker visual states for both 2D and 3D renderers.
 * Satisfies WLC-008 (Centralized Marker State Authority).
 */

/**
 * Minimal office interface for marker state computation.
 * Decoupled from the legacy Office type — consumers map their data to this shape.
 */
export interface MarkerOffice {
  officeCode: string;
  regionName: string;
}

/**
 * Input for marker state computation
 */
export interface MarkerStateInput {
  allOffices: MarkerOffice[];
  selectedRegion: string | null;
  selectedOfficeCode: string | null;
  hoveredOfficeCode: string | null;
}

/**
 * Visual state for a single marker
 */
export interface MarkerVisualState {
  officeCode: string;
  regionName: string;
  visible: boolean;
  selected: boolean;
  highlighted: boolean;
  dimmed: boolean;
  subdued: boolean;
}

/**
 * Compute visual states for all markers.
 *
 * Pure function — no side effects, same input always produces same output,
 * no dependency on renderer type.
 */
export function computeMarkerStates(input: MarkerStateInput): MarkerVisualState[] {
  const { allOffices, selectedRegion, selectedOfficeCode, hoveredOfficeCode } = input;

  return allOffices.map((office) => ({
    officeCode: office.officeCode,
    regionName: office.regionName,
    visible: true,
    selected: office.officeCode === selectedOfficeCode,
    highlighted: office.officeCode === hoveredOfficeCode,
    dimmed: selectedRegion !== null && office.regionName !== selectedRegion,
    subdued:
      selectedOfficeCode !== null &&
      selectedRegion !== null &&
      office.regionName === selectedRegion &&
      office.officeCode !== selectedOfficeCode,
  }));
}
