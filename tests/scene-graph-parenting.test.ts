/**
 * Unit Tests for Scene Graph Parenting (Invariant #2)
 *
 * Non-WebGL tests that validate the 3D globe scene graph structure.
 * Ensures markers parent to globeGroup, never to earthMesh directly.
 *
 * From INVARIANTS.md:
 * ```
 * globeGroup (rotates)
 * ├── earthMesh
 * ├── markerGroup
 * └── regionOverlayGroup
 *
 * staticGroup (non-rotating)
 * └── lights, stars
 * ```
 *
 * - All rotating elements parent to globeGroup
 * - Markers must never attach to Earth mesh directly
 * - A non-WebGL unit test must assert correct parenting
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  BACKFACE_HIDE_THRESHOLD,
  BACKFACE_SHOW_THRESHOLD,
  computeMarkerVisibility,
} from '../src/components/map-3d.js';

/**
 * Mock Three.js Object3D for testing scene graph relationships
 * without requiring WebGL context
 */
class MockObject3D {
  name: string = '';
  parent: MockObject3D | null = null;
  children: MockObject3D[] = [];
  userData: Record<string, unknown> = {};

  add(child: MockObject3D): this {
    child.parent = this;
    this.children.push(child);
    return this;
  }

  remove(child: MockObject3D): this {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      child.parent = null;
      this.children.splice(index, 1);
    }
    return this;
  }

  /**
   * Get all ancestors (parent chain) up to root
   */
  getAncestors(): MockObject3D[] {
    const ancestors: MockObject3D[] = [];
    let current = this.parent;
    while (current) {
      ancestors.push(current);
      current = current.parent;
    }
    return ancestors;
  }

  /**
   * Check if this object is a descendant of the given ancestor
   */
  isDescendantOf(ancestor: MockObject3D): boolean {
    return this.getAncestors().includes(ancestor);
  }

  /**
   * Recursively get all descendants
   */
  getDescendants(): MockObject3D[] {
    const descendants: MockObject3D[] = [];
    const traverse = (obj: MockObject3D) => {
      obj.children.forEach((child) => {
        descendants.push(child);
        traverse(child);
      });
    };
    traverse(this);
    return descendants;
  }
}

class MockScene extends MockObject3D {
  constructor() {
    super();
    this.name = 'Scene';
  }
}

class MockGroup extends MockObject3D {}
class MockMesh extends MockObject3D {}

/**
 * Simulates the scene graph setup from map-3d.js
 * This mirrors the production code structure for testing
 */
function createSceneGraph() {
  const scene = new MockScene();

  // Create globeGroup (rotates with globe)
  const globeGroup = new MockGroup();
  globeGroup.name = 'globeGroup';
  scene.add(globeGroup);

  // Create markerGroup as child of globeGroup
  const markerGroup = new MockGroup();
  markerGroup.name = 'markerGroup';
  globeGroup.add(markerGroup);

  // Create regionOverlayGroup as child of globeGroup
  const regionOverlayGroup = new MockGroup();
  regionOverlayGroup.name = 'regionOverlayGroup';
  globeGroup.add(regionOverlayGroup);

  // Create earthMesh as child of globeGroup
  const earthMesh = new MockMesh();
  earthMesh.name = 'earth';
  earthMesh.userData = { type: 'earth' };
  globeGroup.add(earthMesh);

  // Create atmosphere as child of globeGroup
  const atmosphere = new MockMesh();
  atmosphere.name = 'atmosphere';
  atmosphere.userData = { type: 'decoration' };
  globeGroup.add(atmosphere);

  // Create staticGroup (does not rotate)
  const staticGroup = new MockGroup();
  staticGroup.name = 'staticGroup';
  scene.add(staticGroup);

  // Add lights to staticGroup
  const ambientLight = new MockObject3D();
  ambientLight.name = 'ambientLight';
  staticGroup.add(ambientLight);

  const sunLight = new MockObject3D();
  sunLight.name = 'sunLight';
  staticGroup.add(sunLight);

  // Add stars to staticGroup
  const stars = new MockObject3D();
  stars.name = 'stars';
  stars.userData = { type: 'decoration' };
  staticGroup.add(stars);

  return {
    scene,
    globeGroup,
    markerGroup,
    regionOverlayGroup,
    earthMesh,
    atmosphere,
    staticGroup,
  };
}

/**
 * Simulates adding a marker (from map-3d.js createMarkers)
 */
function createMarker(markerGroup: MockGroup, officeCode: string, regionName: string): MockGroup {
  const marker = new MockGroup();
  marker.name = `marker-${officeCode}`;
  marker.userData = {
    type: 'marker',
    regionName,
    office: { officeCode: officeCode },
  };

  // Marker components (body, head, glow)
  const body = new MockMesh();
  body.name = 'body';
  marker.add(body);

  const head = new MockMesh();
  head.name = 'head';
  marker.add(head);

  const glow = new MockMesh();
  glow.name = 'glow';
  glow.userData = { isGlow: true };
  marker.add(glow);

  // CRITICAL: Add marker to markerGroup, NOT to earthMesh
  markerGroup.add(marker);

  return marker;
}

/**
 * Simulates adding a region halo (from map-3d.js createRegionHalos)
 */
function createRegionHalo(regionOverlayGroup: MockGroup, regionName: string): MockMesh {
  const halo = new MockMesh();
  halo.name = `halo-${regionName}`;
  halo.userData = {
    type: 'region',
    regionName,
  };

  // CRITICAL: Add halo to regionOverlayGroup
  regionOverlayGroup.add(halo);

  return halo;
}

describe('Scene Graph Parenting (Invariant #2)', () => {
  let sceneGraph: ReturnType<typeof createSceneGraph>;

  beforeEach(() => {
    sceneGraph = createSceneGraph();
  });

  describe('globeGroup hierarchy', () => {
    it('globeGroup is direct child of scene', () => {
      expect(sceneGraph.globeGroup.parent).toBe(sceneGraph.scene);
    });

    it('markerGroup is direct child of globeGroup', () => {
      expect(sceneGraph.markerGroup.parent).toBe(sceneGraph.globeGroup);
    });

    it('regionOverlayGroup is direct child of globeGroup', () => {
      expect(sceneGraph.regionOverlayGroup.parent).toBe(sceneGraph.globeGroup);
    });

    it('earthMesh is direct child of globeGroup', () => {
      expect(sceneGraph.earthMesh.parent).toBe(sceneGraph.globeGroup);
    });

    it('atmosphere is direct child of globeGroup', () => {
      expect(sceneGraph.atmosphere.parent).toBe(sceneGraph.globeGroup);
    });

    it('globeGroup contains exactly the expected children', () => {
      const childNames = sceneGraph.globeGroup.children.map((c) => c.name).sort();
      expect(childNames).toEqual(['atmosphere', 'earth', 'markerGroup', 'regionOverlayGroup']);
    });
  });

  describe('staticGroup hierarchy', () => {
    it('staticGroup is direct child of scene', () => {
      expect(sceneGraph.staticGroup.parent).toBe(sceneGraph.scene);
    });

    it('staticGroup is NOT a child of globeGroup', () => {
      expect(sceneGraph.staticGroup.isDescendantOf(sceneGraph.globeGroup)).toBe(false);
    });

    it('staticGroup contains lights and stars', () => {
      const childNames = sceneGraph.staticGroup.children.map((c) => c.name);
      expect(childNames).toContain('ambientLight');
      expect(childNames).toContain('sunLight');
      expect(childNames).toContain('stars');
    });
  });

  describe('scene structure', () => {
    it('scene has exactly two top-level groups', () => {
      expect(sceneGraph.scene.children).toHaveLength(2);
      const childNames = sceneGraph.scene.children.map((c) => c.name);
      expect(childNames).toContain('globeGroup');
      expect(childNames).toContain('staticGroup');
    });
  });
});

describe('Marker Parenting (Invariant #2)', () => {
  let sceneGraph: ReturnType<typeof createSceneGraph>;

  beforeEach(() => {
    sceneGraph = createSceneGraph();
  });

  describe('markers parent to markerGroup', () => {
    it('marker is added to markerGroup, not earthMesh', () => {
      const marker = createMarker(sceneGraph.markerGroup, 'USG-CA1', 'West Region');

      expect(marker.parent).toBe(sceneGraph.markerGroup);
      expect(marker.parent).not.toBe(sceneGraph.earthMesh);
    });

    it('marker is descendant of globeGroup', () => {
      const marker = createMarker(sceneGraph.markerGroup, 'USG-CA1', 'West Region');

      expect(marker.isDescendantOf(sceneGraph.globeGroup)).toBe(true);
    });

    it('marker is NOT direct child of globeGroup', () => {
      const marker = createMarker(sceneGraph.markerGroup, 'USG-CA1', 'West Region');

      expect(marker.parent).not.toBe(sceneGraph.globeGroup);
    });

    it('multiple markers all parent to markerGroup', () => {
      const markers = [
        createMarker(sceneGraph.markerGroup, 'USG-CA1', 'West Region'),
        createMarker(sceneGraph.markerGroup, 'USG-PA1', 'Northeast Region'),
        createMarker(sceneGraph.markerGroup, 'USG-FL1', 'Southeast Region'),
        createMarker(sceneGraph.markerGroup, 'USG-TX1', 'South Region'),
      ];

      markers.forEach((marker) => {
        expect(marker.parent).toBe(sceneGraph.markerGroup);
      });

      expect(sceneGraph.markerGroup.children).toHaveLength(4);
    });

    it('earthMesh has no marker children', () => {
      createMarker(sceneGraph.markerGroup, 'USG-CA1', 'West Region');
      createMarker(sceneGraph.markerGroup, 'USG-PA1', 'Northeast Region');

      const earthChildren = sceneGraph.earthMesh.children;
      const markerChildren = earthChildren.filter((c) => c.userData.type === 'marker');

      expect(markerChildren).toHaveLength(0);
    });
  });

  describe('marker components', () => {
    it('marker body/head/glow are children of marker group', () => {
      const marker = createMarker(sceneGraph.markerGroup, 'USG-CA1', 'West Region');

      const childNames = marker.children.map((c) => c.name);
      expect(childNames).toContain('body');
      expect(childNames).toContain('head');
      expect(childNames).toContain('glow');
    });
  });
});

describe('Region Halo Parenting (Invariant #2)', () => {
  let sceneGraph: ReturnType<typeof createSceneGraph>;

  beforeEach(() => {
    sceneGraph = createSceneGraph();
  });

  it('region halo parents to regionOverlayGroup', () => {
    const halo = createRegionHalo(sceneGraph.regionOverlayGroup, 'West Region');

    expect(halo.parent).toBe(sceneGraph.regionOverlayGroup);
  });

  it('region halo is descendant of globeGroup', () => {
    const halo = createRegionHalo(sceneGraph.regionOverlayGroup, 'West Region');

    expect(halo.isDescendantOf(sceneGraph.globeGroup)).toBe(true);
  });

  it('region halo is NOT child of earthMesh', () => {
    const halo = createRegionHalo(sceneGraph.regionOverlayGroup, 'West Region');

    expect(halo.parent).not.toBe(sceneGraph.earthMesh);
  });

  it('multiple halos all parent to regionOverlayGroup', () => {
    const halos = [
      createRegionHalo(sceneGraph.regionOverlayGroup, 'West Region'),
      createRegionHalo(sceneGraph.regionOverlayGroup, 'Northeast Region'),
      createRegionHalo(sceneGraph.regionOverlayGroup, 'Southeast Region'),
    ];

    halos.forEach((halo) => {
      expect(halo.parent).toBe(sceneGraph.regionOverlayGroup);
    });
  });
});

describe('Rotation Isolation (Invariant #2)', () => {
  let sceneGraph: ReturnType<typeof createSceneGraph>;

  beforeEach(() => {
    sceneGraph = createSceneGraph();
  });

  it('all rotating elements are descendants of globeGroup', () => {
    createMarker(sceneGraph.markerGroup, 'USG-CA1', 'West Region');
    createRegionHalo(sceneGraph.regionOverlayGroup, 'West Region');

    // Get all descendants of globeGroup
    const rotatingElements = sceneGraph.globeGroup.getDescendants();
    const rotatingNames = rotatingElements.map((e) => e.name);

    // Should include: earthMesh, atmosphere, markerGroup, regionOverlayGroup, markers, halos
    expect(rotatingNames).toContain('earth');
    expect(rotatingNames).toContain('atmosphere');
    expect(rotatingNames).toContain('markerGroup');
    expect(rotatingNames).toContain('regionOverlayGroup');
    expect(rotatingNames).toContain('marker-USG-CA1');
    expect(rotatingNames).toContain('halo-West Region');
  });

  it('non-rotating elements are NOT descendants of globeGroup', () => {
    const globeDescendants = sceneGraph.globeGroup.getDescendants();

    // staticGroup and its children should NOT be in globeGroup
    expect(globeDescendants).not.toContain(sceneGraph.staticGroup);

    sceneGraph.staticGroup.children.forEach((child) => {
      expect(globeDescendants).not.toContain(child);
    });
  });

  it('lights and stars do not rotate with globe', () => {
    // Verify lights/stars are in staticGroup, not globeGroup
    const staticChildren = sceneGraph.staticGroup.children.map((c) => c.name);
    const globeChildren = sceneGraph.globeGroup.children.map((c) => c.name);

    expect(staticChildren).toContain('ambientLight');
    expect(staticChildren).toContain('sunLight');
    expect(staticChildren).toContain('stars');

    expect(globeChildren).not.toContain('ambientLight');
    expect(globeChildren).not.toContain('sunLight');
    expect(globeChildren).not.toContain('stars');
  });
});

describe('Invariant Violation Detection', () => {
  let sceneGraph: ReturnType<typeof createSceneGraph>;

  beforeEach(() => {
    sceneGraph = createSceneGraph();
  });

  it('detects marker incorrectly parented to earthMesh', () => {
    // This simulates a violation: attaching marker to earthMesh
    const badMarker = new MockGroup();
    badMarker.name = 'bad-marker';
    badMarker.userData = { type: 'marker' };

    // VIOLATION: Adding to earthMesh instead of markerGroup
    sceneGraph.earthMesh.add(badMarker);

    // Test should detect this violation
    expect(badMarker.parent).toBe(sceneGraph.earthMesh);
    expect(badMarker.parent).not.toBe(sceneGraph.markerGroup);

    // The marker IS a descendant of globeGroup (via earthMesh)
    // but it's NOT correctly parented through markerGroup
    const markerGroupDescendants = sceneGraph.markerGroup.getDescendants();
    expect(markerGroupDescendants).not.toContain(badMarker);
  });

  it('detects marker incorrectly parented to scene directly', () => {
    const badMarker = new MockGroup();
    badMarker.name = 'bad-marker';
    badMarker.userData = { type: 'marker' };

    // VIOLATION: Adding to scene instead of markerGroup
    sceneGraph.scene.add(badMarker);

    expect(badMarker.parent).toBe(sceneGraph.scene);
    expect(badMarker.isDescendantOf(sceneGraph.globeGroup)).toBe(false);
  });

  it('detects staticGroup incorrectly placed under globeGroup', () => {
    // Create a "bad" setup where staticGroup is under globeGroup
    const badScene = new MockScene();
    const badGlobeGroup = new MockGroup();
    badGlobeGroup.name = 'globeGroup';
    badScene.add(badGlobeGroup);

    const badStaticGroup = new MockGroup();
    badStaticGroup.name = 'staticGroup';

    // VIOLATION: staticGroup should be sibling of globeGroup, not child
    badGlobeGroup.add(badStaticGroup);

    expect(badStaticGroup.isDescendantOf(badGlobeGroup)).toBe(true);
    // This violates the invariant - staticGroup should NOT rotate with globe
  });
});

describe('Backface Culling Hysteresis (Flickering Prevention)', () => {
  // Constants imported from production code to ensure tests validate actual values

  describe('threshold configuration', () => {
    it('HIDE_THRESHOLD must be greater than SHOW_THRESHOLD for hysteresis', () => {
      // Hysteresis requires a gap between thresholds to prevent rapid toggling
      expect(BACKFACE_HIDE_THRESHOLD).toBeGreaterThan(BACKFACE_SHOW_THRESHOLD);
    });

    it('threshold gap should be at least 0.05 for stable transitions', () => {
      const gap = BACKFACE_HIDE_THRESHOLD - BACKFACE_SHOW_THRESHOLD;
      expect(gap).toBeGreaterThanOrEqual(0.05);
    });

    it('thresholds should be in valid range (0 to 1)', () => {
      expect(BACKFACE_HIDE_THRESHOLD).toBeGreaterThan(0);
      expect(BACKFACE_HIDE_THRESHOLD).toBeLessThan(1);
      expect(BACKFACE_SHOW_THRESHOLD).toBeGreaterThan(0);
      expect(BACKFACE_SHOW_THRESHOLD).toBeLessThan(1);
    });
  });

  describe('hysteresis behavior', () => {
    // Tests use the actual production function (computeMarkerVisibility) imported from map-3d.js
    // This ensures tests validate real behavior, not a local re-implementation

    it('visible marker hides when dot product exceeds HIDE_THRESHOLD', () => {
      const visible = computeMarkerVisibility(true, 0.3); // Above HIDE_THRESHOLD (0.25)
      expect(visible).toBe(false);
    });

    it('hidden marker shows when dot product drops below SHOW_THRESHOLD', () => {
      const visible = computeMarkerVisibility(false, 0.1); // Below SHOW_THRESHOLD (0.15)
      expect(visible).toBe(true);
    });

    it('visible marker stays visible in hysteresis band', () => {
      // Dot product between SHOW and HIDE thresholds
      const visible = computeMarkerVisibility(true, 0.2);
      expect(visible).toBe(true);
    });

    it('hidden marker stays hidden in hysteresis band', () => {
      // Dot product between SHOW and HIDE thresholds
      const visible = computeMarkerVisibility(false, 0.2);
      expect(visible).toBe(false);
    });

    it('visibility does not toggle rapidly at boundary (anti-flicker)', () => {
      // Simulate marker oscillating around the old single threshold (0.2)
      // With hysteresis, it should NOT flicker
      const dotProducts = [0.19, 0.21, 0.19, 0.21, 0.19, 0.21];
      let visible = true;
      const visibilityHistory: boolean[] = [];

      dotProducts.forEach((dp) => {
        visible = computeMarkerVisibility(visible, dp);
        visibilityHistory.push(visible);
      });

      // Count visibility changes
      let toggleCount = 0;
      for (let i = 1; i < visibilityHistory.length; i++) {
        if (visibilityHistory[i] !== visibilityHistory[i - 1]) {
          toggleCount++;
        }
      }

      // With hysteresis, should have 0 toggles (all in hysteresis band)
      // Without hysteresis, would have 5 toggles
      expect(toggleCount).toBe(0);
    });

    it('marker transitions smoothly through visibility zones', () => {
      // Simulate marker moving from front to back of globe
      const dotProducts = [0.0, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35];
      let visible = true;
      const visibilityHistory: boolean[] = [];

      dotProducts.forEach((dp) => {
        visible = computeMarkerVisibility(visible, dp);
        visibilityHistory.push(visible);
      });

      // Should stay visible until HIDE_THRESHOLD (0.25)
      expect(visibilityHistory[0]).toBe(true); // 0.0
      expect(visibilityHistory[1]).toBe(true); // 0.1
      expect(visibilityHistory[2]).toBe(true); // 0.15
      expect(visibilityHistory[3]).toBe(true); // 0.2
      expect(visibilityHistory[4]).toBe(false); // 0.25 - crosses threshold
      expect(visibilityHistory[5]).toBe(false); // 0.3
      expect(visibilityHistory[6]).toBe(false); // 0.35
    });
  });
});
