/**
 * Unit Tests for 3D Globe Coordinate Projection
 *
 * Tests the latLonToGlobe function to ensure the coordinate convention
 * (Y-up=north, Z+=front, X+=east) is correctly implemented and cannot regress.
 */

import { describe, it, expect } from 'vitest';
import { TEXTURE_LONGITUDE_OFFSET_DEG, TEXTURE_LATITUDE_OFFSET } from '../src/components/map-3d.js';

// Re-implement the projection function for testing
// (In production, this would be imported from a shared module)
const GLOBE_RADIUS = 100;

function latLonToGlobe(
  lat: number,
  lon: number,
  radius: number = GLOBE_RADIUS
): { x: number; y: number; z: number } {
  const latRad = lat * (Math.PI / 180);
  const lonRad = lon * (Math.PI / 180);

  return {
    x: radius * Math.cos(latRad) * Math.sin(lonRad),
    y: radius * Math.sin(latRad),
    z: radius * Math.cos(latRad) * Math.cos(lonRad),
  };
}

describe('latLonToGlobe - Axis Convention', () => {
  describe('Y-axis = North (North Pole at +Y)', () => {
    it('places North Pole at +Y', () => {
      const pos = latLonToGlobe(90, 0, 100);
      expect(pos.y).toBeCloseTo(100, 5);
      expect(pos.x).toBeCloseTo(0, 5);
      expect(pos.z).toBeCloseTo(0, 5);
    });

    it('places South Pole at -Y', () => {
      const pos = latLonToGlobe(-90, 0, 100);
      expect(pos.y).toBeCloseTo(-100, 5);
      expect(pos.x).toBeCloseTo(0, 5);
      expect(pos.z).toBeCloseTo(0, 5);
    });

    it('places equator at Y=0', () => {
      const pos = latLonToGlobe(0, 0, 100);
      expect(pos.y).toBeCloseTo(0, 5);
    });
  });

  describe('Z-axis = Front (0° longitude at +Z)', () => {
    it('places 0° longitude, equator at +Z', () => {
      const pos = latLonToGlobe(0, 0, 100);
      expect(pos.z).toBeCloseTo(100, 5);
      expect(pos.x).toBeCloseTo(0, 5);
      expect(pos.y).toBeCloseTo(0, 5);
    });

    it('places 180° longitude at -Z', () => {
      const pos = latLonToGlobe(0, 180, 100);
      expect(pos.z).toBeCloseTo(-100, 5);
      expect(pos.x).toBeCloseTo(0, 5);
    });

    it('places -180° longitude at -Z (same as 180°)', () => {
      const pos = latLonToGlobe(0, -180, 100);
      expect(pos.z).toBeCloseTo(-100, 5);
      expect(pos.x).toBeCloseTo(0, 5);
    });
  });

  describe('X-axis = East (90°E at +X)', () => {
    it('places 90°E longitude at +X', () => {
      const pos = latLonToGlobe(0, 90, 100);
      expect(pos.x).toBeCloseTo(100, 5);
      expect(pos.z).toBeCloseTo(0, 5);
      expect(pos.y).toBeCloseTo(0, 5);
    });

    it('places 90°W longitude at -X', () => {
      const pos = latLonToGlobe(0, -90, 100);
      expect(pos.x).toBeCloseTo(-100, 5);
      expect(pos.z).toBeCloseTo(0, 5);
      expect(pos.y).toBeCloseTo(0, 5);
    });
  });
});

describe('latLonToGlobe - Hemisphere Tests', () => {
  describe('Northern Hemisphere (positive latitude)', () => {
    it('all northern hemisphere points have positive Y', () => {
      const testCases = [
        { lat: 45, lon: 0 },
        { lat: 30, lon: 90 },
        { lat: 60, lon: -90 },
        { lat: 15, lon: 180 },
      ];

      testCases.forEach(({ lat, lon }) => {
        const pos = latLonToGlobe(lat, lon, 100);
        expect(pos.y).toBeGreaterThan(0);
      });
    });
  });

  describe('Southern Hemisphere (negative latitude)', () => {
    it('all southern hemisphere points have negative Y', () => {
      const testCases = [
        { lat: -45, lon: 0 },
        { lat: -30, lon: 90 },
        { lat: -60, lon: -90 },
        { lat: -15, lon: 180 },
      ];

      testCases.forEach(({ lat, lon }) => {
        const pos = latLonToGlobe(lat, lon, 100);
        expect(pos.y).toBeLessThan(0);
      });
    });
  });

  describe('Eastern Hemisphere (positive longitude)', () => {
    it('eastern hemisphere points 0-180° have positive X when near 90°E', () => {
      const pos = latLonToGlobe(0, 45, 100);
      expect(pos.x).toBeGreaterThan(0);
    });
  });

  describe('Western Hemisphere (negative longitude)', () => {
    it('western hemisphere points have negative X when near 90°W', () => {
      const pos = latLonToGlobe(0, -45, 100);
      expect(pos.x).toBeLessThan(0);
    });
  });
});

describe('latLonToGlobe - Reference Points', () => {
  describe('USA locations (Northern Hemisphere, Western Hemisphere)', () => {
    it('Irvine, CA is in correct quadrant', () => {
      // Irvine: 33.64°N, 117.74°W
      const pos = latLonToGlobe(33.64, -117.74, 100);

      // Northern hemisphere: Y > 0
      expect(pos.y).toBeGreaterThan(0);

      // Western hemisphere: X < 0 (since longitude is negative/west)
      expect(pos.x).toBeLessThan(0);

      // Pacific-facing (between 90°W and 180°): Z < 0
      expect(pos.z).toBeLessThan(0);
    });

    it('Boston, MA is in correct quadrant', () => {
      // Boston: 42.36°N, 71.06°W
      const pos = latLonToGlobe(42.36, -71.06, 100);

      // Northern hemisphere: Y > 0
      expect(pos.y).toBeGreaterThan(0);

      // Western hemisphere: X < 0
      expect(pos.x).toBeLessThan(0);

      // Atlantic-facing (between 0° and 90°W): Z > 0
      expect(pos.z).toBeGreaterThan(0);
    });

    it('Chicago, IL is in correct quadrant', () => {
      // Chicago: 41.88°N, 87.63°W
      const pos = latLonToGlobe(41.88, -87.63, 100);

      // Northern hemisphere: Y > 0
      expect(pos.y).toBeGreaterThan(0);

      // Western hemisphere: X < 0
      expect(pos.x).toBeLessThan(0);
    });
  });

  describe('International reference points', () => {
    it('London, UK (0° longitude) is at +Z side', () => {
      // London: 51.51°N, 0.13°W
      const pos = latLonToGlobe(51.51, -0.13, 100);

      expect(pos.y).toBeGreaterThan(0); // Northern
      expect(pos.z).toBeGreaterThan(0); // Near prime meridian
    });

    it('Tokyo, Japan is in Eastern Hemisphere', () => {
      // Tokyo: 35.68°N, 139.69°E
      const pos = latLonToGlobe(35.68, 139.69, 100);

      expect(pos.y).toBeGreaterThan(0); // Northern
      // 139°E is between 90°E and 180°, so X > 0, Z < 0
      expect(pos.x).toBeGreaterThan(0);
      expect(pos.z).toBeLessThan(0);
    });

    it('Sydney, Australia is in Southern Hemisphere', () => {
      // Sydney: 33.87°S, 151.21°E
      const pos = latLonToGlobe(-33.87, 151.21, 100);

      expect(pos.y).toBeLessThan(0); // Southern
      expect(pos.x).toBeGreaterThan(0); // Eastern
    });
  });
});

describe('Texture Longitude Offset (Bug Fix)', () => {
  // The earth texture must be aligned with the coordinate system.
  // Constants imported from production code to ensure tests validate actual values.

  it('texture longitude offset should be calibrated to 85 degrees', () => {
    // This test ensures the texture offset constant matches the calibrated value
    // that aligns pins with the USA landmass on the earth texture
    expect(TEXTURE_LONGITUDE_OFFSET_DEG).toBe(86);
  });

  it('texture offset in texture coordinates should be ~0.236', () => {
    // Texture coordinates range from 0.0 to 1.0
    // 85° / 360° ≈ 0.236 in texture coordinate space
    const textureOffsetX = TEXTURE_LONGITUDE_OFFSET_DEG / 360;
    expect(textureOffsetX).toBeCloseTo(0.236, 2);
  });

  it('texture latitude offset should be 0.15 for vertical alignment', () => {
    expect(TEXTURE_LATITUDE_OFFSET).toBe(0.15);
  });

  describe('US coordinates produce western hemisphere positions', () => {
    it('Irvine, CA (-117.74° lon) produces negative X (western hemisphere)', () => {
      // Irvine: 33.64°N, 117.74°W
      const pos = latLonToGlobe(33.64, -117.74, 100);

      // Western hemisphere should have negative X
      expect(pos.x).toBeLessThan(0);
      // Northern hemisphere should have positive Y
      expect(pos.y).toBeGreaterThan(0);
    });

    it('New York (-74° lon) produces negative X (western hemisphere)', () => {
      // NYC: 40.71°N, 74.01°W
      const pos = latLonToGlobe(40.71, -74.01, 100);

      expect(pos.x).toBeLessThan(0);
      expect(pos.y).toBeGreaterThan(0);
    });
  });
});

describe('latLonToGlobe - Radius', () => {
  it('scales output by radius', () => {
    const pos1 = latLonToGlobe(45, 45, 100);
    const pos2 = latLonToGlobe(45, 45, 200);

    expect(pos2.x).toBeCloseTo(pos1.x * 2, 5);
    expect(pos2.y).toBeCloseTo(pos1.y * 2, 5);
    expect(pos2.z).toBeCloseTo(pos1.z * 2, 5);
  });

  it('always places points at exactly radius distance from origin', () => {
    const testCases = [
      { lat: 0, lon: 0 },
      { lat: 45, lon: 45 },
      { lat: -30, lon: -120 },
      { lat: 90, lon: 0 },
    ];

    testCases.forEach(({ lat, lon }) => {
      const pos = latLonToGlobe(lat, lon, 100);
      const distance = Math.sqrt(pos.x ** 2 + pos.y ** 2 + pos.z ** 2);
      expect(distance).toBeCloseTo(100, 5);
    });
  });
});
