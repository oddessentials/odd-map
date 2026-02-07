/**
 * Bounds Clamping Utility
 *
 * Pure function for calculating clamped viewBox bounds with padding.
 */

export interface BBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Clamp a bounding box with padding to map boundaries.
 *
 * @param bbox - Raw bounding box from getBBox()
 * @param padding - Padding to add around the box
 * @param mapWidth - Maximum X coordinate
 * @param mapHeight - Maximum Y coordinate
 * @returns Clamped viewBox coordinates with guaranteed non-negative dimensions
 */
export function clampBounds(
  bbox: BBox,
  padding: number,
  mapWidth: number,
  mapHeight: number
): BBox {
  // Calculate intended bounds with padding
  const intendedLeft = bbox.x - padding;
  const intendedTop = bbox.y - padding;
  const intendedRight = bbox.x + bbox.width + padding;
  const intendedBottom = bbox.y + bbox.height + padding;

  // Clamp all four edges to map boundaries
  const clampedLeft = Math.max(0, intendedLeft);
  const clampedTop = Math.max(0, intendedTop);
  const clampedRight = Math.min(mapWidth, intendedRight);
  const clampedBottom = Math.min(mapHeight, intendedBottom);

  // Derive dimensions, guaranteeing non-negative values
  return {
    x: clampedLeft,
    y: clampedTop,
    width: Math.max(0, clampedRight - clampedLeft),
    height: Math.max(0, clampedBottom - clampedTop),
  };
}
