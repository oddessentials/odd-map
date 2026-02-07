/**
 * Three.js 3D Globe Component (Refactored)
 *
 * Renders an interactive rotating globe focused on USA.
 * Provides identical interaction contract as the 2D SVG map.
 *
 * Architecture:
 * - globeGroup: Contains all rotating elements (earth, markers, region halos)
 * - staticGroup: Contains non-rotating elements (stars, lights)
 * - Separated raycasting: drag/rotation uses full scene, click/hover restricted to interactive groups
 * - Split update paths: expensive ops throttled, hover/tooltips remain responsive
 *
 * Coordinate Convention (documented):
 * - Y-axis = up (North Pole at +Y)
 * - Z-axis = front (0° longitude points toward +Z)
 * - X-axis = east (+X is eastern hemisphere)
 */

import * as THREE from 'three';
import {
  getClientRegions,
  getClientOffices,
  getClientRegion,
  getActiveConfig,
} from '../lib/client-config.js';
import {
  DEFAULT_REGION_COLORS,
  DEFAULT_CAMERA_VIEWS,
  DEFAULT_USA_VIEW,
  hexToThreeColor,
} from '../lib/defaults.js';
import { showOfficeModal, closeOfficeModal } from './office-modal.js';

// Globe configuration
const GLOBE_RADIUS = 100;
const GLOBE_SEGMENTS = 64;
const ATMOSPHERE_SCALE = 1.15;

// Scroll-wheel rotation constant (radians per scroll tick)
const SCROLL_ROTATION_STEP = 0.05;

// Drag-rotation constants
const DRAG_ROTATION_SENSITIVITY = 0.005; // Radians per pixel of horizontal drag
const DRAG_THRESHOLD = 5; // Pixels of movement before drag mode activates

/**
 * Compute the globe rotation delta for a scroll-wheel event.
 * Pure function — exported for testability.
 *
 * Scroll-up (negative deltaY) → positive rotation (globe turns left).
 * Scroll-down (positive deltaY) → negative rotation (globe turns right).
 * Uses Math.sign() for direction-only normalization (ignores magnitude).
 *
 * @param {number} deltaY - WheelEvent.deltaY value
 * @returns {number} Rotation delta in radians to add to globeGroup.rotation.y
 */
export function computeScrollRotationDelta(deltaY) {
  const sign = Math.sign(deltaY);
  if (sign === 0) return 0;
  return -sign * SCROLL_ROTATION_STEP;
}

/**
 * Compute the globe rotation delta for a drag gesture.
 * Pure function — exported for testability.
 *
 * Drag left (negative deltaX) → positive rotation (globe turns left).
 * Drag right (positive deltaX) → negative rotation (globe turns right).
 * Linear mapping: radians = -deltaX * DRAG_ROTATION_SENSITIVITY.
 *
 * @param {number} deltaX - Horizontal pixel delta (event.clientX difference)
 * @returns {number} Rotation delta in radians to add to globeGroup.rotation.y
 */
export function computeDragRotationDelta(deltaX) {
  if (deltaX === 0) return 0;
  return -deltaX * DRAG_ROTATION_SENSITIVITY;
}

// Backface culling hysteresis thresholds (prevents flickering at visibility boundary)
// HIDE_THRESHOLD must be > SHOW_THRESHOLD to create hysteresis band
export const BACKFACE_HIDE_THRESHOLD = 0.25; // Hide marker when dot product exceeds this
export const BACKFACE_SHOW_THRESHOLD = 0.15; // Show marker when dot product drops below this

/**
 * Compute marker visibility using hysteresis to prevent flickering.
 * Exported for testability - this is the actual logic used in updateExpensiveMarkerStates().
 *
 * @param {boolean} currentlyVisible - Current visibility state of the marker
 * @param {number} dotProduct - Dot product of camera-to-marker direction and marker normal
 * @returns {boolean} New visibility state
 */
export function computeMarkerVisibility(currentlyVisible, dotProduct) {
  if (currentlyVisible) {
    // Currently visible: only hide if exceeds higher threshold
    return dotProduct < BACKFACE_HIDE_THRESHOLD;
  } else {
    // Currently hidden: only show if drops below lower threshold
    return dotProduct < BACKFACE_SHOW_THRESHOLD;
  }
}

/**
 * Get region colors merged from config overrides and shared defaults.
 * Returns Three.js integer color values (0xRRGGBB).
 */
function getRegionColors() {
  const config = getActiveConfig();
  const merged = { ...DEFAULT_REGION_COLORS, ...config.theme?.regionColors };
  const result = {};
  for (const [name, hex] of Object.entries(merged)) {
    try {
      result[name] = hexToThreeColor(hex);
    } catch (_e) {
      console.warn(`Invalid color for region "${name}": "${hex}". Using default.`);
      result[name] = 0x4a9eff;
    }
  }
  return result;
}

/**
 * Get camera views merged from config overrides and shared defaults.
 */
function getCameraViews() {
  const config = getActiveConfig();
  return {
    USA: DEFAULT_USA_VIEW,
    ...DEFAULT_CAMERA_VIEWS,
    ...config.theme?.cameraViews,
  };
}

/**
 * Texture longitudinal calibration offset (in degrees).
 *
 * This single constant aligns the equirectangular Earth texture
 * with the mathematical coordinate system. Calibrated using:
 * - Irvine, CA (33.64°N, 117.74°W) → should appear over Southern California
 * - Boston, MA (42.36°N, 71.06°W) → should appear over Northeast coast
 * - Prime Meridian (0°) → should align with Africa/Europe
 *
 * Value of 0 means no offset. Adjust only if texture has non-standard alignment.
 * TUNING: Increase to move pins LEFT, decrease to move pins RIGHT.
 */
export const TEXTURE_LONGITUDE_OFFSET_DEG = 86;

/**
 * Texture latitude offset for vertical alignment.
 * Applied to texture.offset.y to shift texture vertically.
 * TUNING: Increase to move pins DOWN, decrease to move pins UP.
 */
export const TEXTURE_LATITUDE_OFFSET = 0.15;

/**
 * Convert lat/lon to 3D position on globe surface.
 *
 * Standard spherical to Cartesian conversion with documented convention:
 * - Y-axis is "up" (North Pole at Y = +radius)
 * - Z-axis is "front" (0° longitude points toward +Z)
 * - X-axis is "east" (90°E longitude points toward +X)
 *
 * @param {number} lat - Latitude in degrees (-90 to 90)
 * @param {number} lon - Longitude in degrees (-180 to 180)
 * @param {number} radius - Distance from globe center
 * @returns {{x: number, y: number, z: number}} Cartesian coordinates
 */
function latLonToGlobe(lat, lon, radius = GLOBE_RADIUS) {
  const latRad = lat * (Math.PI / 180);
  const lonRad = lon * (Math.PI / 180);

  return {
    x: radius * Math.cos(latRad) * Math.sin(lonRad),
    y: radius * Math.sin(latRad),
    z: radius * Math.cos(latRad) * Math.cos(lonRad),
  };
}

/**
 * Get camera position from lat/lon and distance
 */
function getCameraPosition(lat, lon, distance) {
  const pos = latLonToGlobe(lat, lon, distance);
  return new THREE.Vector3(pos.x, pos.y, pos.z);
}

/**
 * Calculate region centroid from office coordinates
 */
function calculateRegionCentroid(offices) {
  let avgLat = 0,
    avgLon = 0,
    count = 0;
  offices.forEach((office) => {
    if (office.coordinates) {
      avgLat += office.coordinates.lat;
      avgLon += office.coordinates.lon;
      count++;
    }
  });
  if (count === 0) return null;
  return { lat: avgLat / count, lon: avgLon / count };
}

export class Map3D {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      onRegionClick: options.onRegionClick || (() => {}),
      onOfficeClick: options.onOfficeClick || (() => {}),
      onReset: options.onReset || (() => {}),
    };

    // Core THREE objects
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Animation frame ID for cancellation
    this.animationFrameId = null;

    // Scene graph groups (key architectural organization)
    this.globeGroup = null; // Rotates: contains earth, markers, region halos
    this.markerGroup = null; // Child of globeGroup: all office markers
    this.regionOverlayGroup = null; // Child of globeGroup: region halos (invisible, for raycasting)
    this.staticGroup = null; // Does not rotate: stars, lights

    // Meshes
    this.earthMesh = null;
    this.atmosphere = null;
    this.markerMeshes = new Map(); // officeCode -> marker Group
    this.regionHalos = new Map(); // regionName -> halo mesh

    // State
    this.selectedRegion = null;
    this.selectedOffice = null;
    this.hoveredMesh = null;

    // Animation state
    this.animating = false;
    this.autoRotate = false;
    this.userWantsAutoRotate = false; // Tracks user preference, separate from effective state
    this.rotationSpeed = 0.0005;

    // Event handler references (for removal in dispose)
    this._boundOnResize = null;
    this._boundOnMouseMove = null;
    this._boundOnClick = null;
    this._boundOnWheel = null;

    // Drag-rotation state
    this.isDragging = false;
    this.wasDragging = false;
    this.dragStartX = null;
    this.dragStartY = null;
    this.previousX = null;
    this.autoRotateWasEnabled = false;
    this._boundPointerDown = null;
    this._boundPointerMove = null;
    this._boundPointerUp = null;

    // Performance: reusable vectors (object pooling)
    this._tempVectors = {
      worldPos: new THREE.Vector3(),
      toMarker: new THREE.Vector3(),
      cameraDir: new THREE.Vector3(),
    };

    // Performance: throttle expensive visibility updates (250ms)
    this._lastExpensiveUpdate = 0;
    this._expensiveUpdateInterval = 250;

    // Tooltip element
    this.tooltip = null;

    this.init();
  }

  async init() {
    // Set up scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a1628);

    // Create scene graph groups
    this.globeGroup = new THREE.Group();
    this.globeGroup.name = 'globeGroup';
    this.scene.add(this.globeGroup);

    this.markerGroup = new THREE.Group();
    this.markerGroup.name = 'markerGroup';
    this.globeGroup.add(this.markerGroup);

    this.regionOverlayGroup = new THREE.Group();
    this.regionOverlayGroup.name = 'regionOverlayGroup';
    this.globeGroup.add(this.regionOverlayGroup);

    this.staticGroup = new THREE.Group();
    this.staticGroup.name = 'staticGroup';
    this.scene.add(this.staticGroup);

    // Set up camera
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 1, 2000);

    // Position camera to view USA
    const cameraViews = getCameraViews();
    const usaView = cameraViews.USA;
    const camPos = getCameraPosition(usaView.lat, usaView.lon, usaView.distance);
    this.camera.position.copy(camPos);
    this.camera.lookAt(0, 0, 0);

    // Set up renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // Create scene elements
    this.createLighting();
    this.createEarth();
    this.createAtmosphere();
    this.createStars();
    this.createRegionHalos();
    this.createMarkers();
    this.createTooltip();

    // Event listeners
    this.setupEventListeners();

    // Start render loop
    this.animate();
  }

  createLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.staticGroup.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
    sunLight.position.set(200, 100, 150);
    this.staticGroup.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x4da6ff, 0.3);
    rimLight.position.set(-100, 50, -100);
    this.staticGroup.add(rimLight);
  }

  createEarth() {
    const geometry = new THREE.SphereGeometry(GLOBE_RADIUS, GLOBE_SEGMENTS, GLOBE_SEGMENTS);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(`${import.meta.env.BASE_URL}textures/earth-day.jpg`);

    // Texture alignment configuration
    // RepeatWrapping on S (horizontal) enables longitude offset to wrap around the globe
    texture.wrapS = THREE.RepeatWrapping;
    // RepeatWrapping on T (vertical) is required for offset.y to work.
    // This is safe because:
    // 1. The offset (0.15) is small and doesn't cause visible polar seams
    // 2. The sphere UVs don't extend beyond [0,1] so no actual repeat occurs
    // 3. Calibrated empirically to align USA pins with landmass (see specs/001-fix-map-bugs/research.md)
    texture.wrapT = THREE.RepeatWrapping;

    // Apply calibration offsets (converted from degrees to texture units)
    // Longitude: 0.0 to 1.0 = 0° to 360°
    texture.offset.x = TEXTURE_LONGITUDE_OFFSET_DEG / 360;
    // Latitude: small vertical shift to align texture with coordinate system
    texture.offset.y = TEXTURE_LATITUDE_OFFSET;

    const material = new THREE.MeshPhongMaterial({
      map: texture,
      bumpScale: 0.5,
      shininess: 10,
      specular: new THREE.Color(0x333333),
    });

    this.earthMesh = new THREE.Mesh(geometry, material);
    this.earthMesh.name = 'earth';
    this.earthMesh.userData = { type: 'earth' };
    this.globeGroup.add(this.earthMesh);
  }

  createAtmosphere() {
    const geometry = new THREE.SphereGeometry(GLOBE_RADIUS * ATMOSPHERE_SCALE, 64, 64);
    const material = new THREE.ShaderMaterial({
      vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
      fragmentShader: `
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
                }
            `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });

    this.atmosphere = new THREE.Mesh(geometry, material);
    this.atmosphere.name = 'atmosphere';
    this.atmosphere.userData = { type: 'decoration' };
    this.globeGroup.add(this.atmosphere);
  }

  createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      const radius = 500 + Math.random() * 500;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1,
      transparent: true,
      opacity: 0.8,
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    stars.userData = { type: 'decoration' };
    this.staticGroup.add(stars);
  }

  createRegionHalos() {
    getClientRegions().forEach((region) => {
      const regionName = region.name;
      const centroid = calculateRegionCentroid(region.offices);

      if (!centroid) return;

      const pos = latLonToGlobe(centroid.lat, centroid.lon, GLOBE_RADIUS + 1);
      const regionColors = getRegionColors();
      const color = regionColors[regionName] || 0x4a9eff;

      // Invisible sphere for raycasting only
      const haloGeometry = new THREE.SphereGeometry(5, 16, 16);
      const haloMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0, // Invisible - pure hit target
      });

      const halo = new THREE.Mesh(haloGeometry, haloMaterial);
      halo.position.set(pos.x, pos.y, pos.z);
      halo.userData = {
        regionName,
        type: 'region',
        centroidLat: centroid.lat,
        centroidLon: centroid.lon,
      };

      this.regionOverlayGroup.add(halo);
      this.regionHalos.set(regionName, halo);
    });
  }

  createMarkers() {
    const offices = getClientOffices();

    offices.forEach((office) => {
      if (!office.coordinates) return;

      const pos = latLonToGlobe(office.coordinates.lat, office.coordinates.lon, GLOBE_RADIUS + 2);

      // Create 3D pin-style marker
      const markerGroup = new THREE.Group();
      markerGroup.name = `marker-${office.officeCode}`;

      // Pin body (small cylinder)
      const bodyGeometry = new THREE.CylinderGeometry(0.6, 0.6, 2.5, 8);
      const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0xff4444,
        emissive: 0x330000,
        shininess: 100,
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 1.25;
      markerGroup.add(body);

      // Pin head (sphere)
      const headGeometry = new THREE.SphereGeometry(1.0, 16, 16);
      const headMaterial = new THREE.MeshPhongMaterial({
        color: 0xff6b6b,
        emissive: 0x440000,
        shininess: 100,
      });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = 3;
      markerGroup.add(head);

      // Glowing aura (visible only on hover/select)
      const glowGeometry = new THREE.SphereGeometry(1.5, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff8888,
        transparent: true,
        opacity: 0,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.y = 3;
      glow.userData.isGlow = true;
      markerGroup.add(glow);

      // Position and orient the marker group
      markerGroup.position.set(pos.x, pos.y, pos.z);

      // Make pin point outward from globe center
      const direction = new THREE.Vector3(pos.x, pos.y, pos.z).normalize();
      markerGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

      markerGroup.userData = {
        office,
        type: 'marker',
        regionName: office.regionName,
        worldPosition: new THREE.Vector3(pos.x, pos.y, pos.z),
      };

      // Visible by default
      markerGroup.visible = true;

      this.markerGroup.add(markerGroup);
      this.markerMeshes.set(office.officeCode, markerGroup);
    });
  }

  createTooltip() {
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'map3d-tooltip';
    this.container.style.position = 'relative';
    this.container.appendChild(this.tooltip);
  }

  setupEventListeners() {
    // Store bound references for removal in dispose()
    this._boundOnMouseMove = (e) => this.onMouseMove(e);
    this._boundOnClick = (e) => this.onClick(e);
    this._boundOnResize = () => this.onResize();
    this._boundOnWheel = (e) => this.handleWheel(e);

    this.container.addEventListener('mousemove', this._boundOnMouseMove);
    this.container.addEventListener('click', this._boundOnClick);
    window.addEventListener('resize', this._boundOnResize);
    this.container.addEventListener('wheel', this._boundOnWheel, { passive: false });

    // Pointer event listeners for drag-rotation
    this._boundPointerDown = (e) => this.handlePointerDown(e);
    this._boundPointerMove = (e) => this.handlePointerMove(e);
    this._boundPointerUp = (e) => this.handlePointerUp(e);

    this.container.addEventListener('pointerdown', this._boundPointerDown);
    this.container.addEventListener('pointermove', this._boundPointerMove, { passive: false });
    this.container.addEventListener('pointerup', this._boundPointerUp);
    this.container.addEventListener('pointercancel', this._boundPointerUp);
  }

  /**
   * Handle mouse wheel events for scroll-driven globe rotation.
   * Scroll-up rotates left, scroll-down rotates right.
   * Suppresses default page scrolling when cursor is over the globe.
   */
  handleWheel(event) {
    event.preventDefault();

    if (!this.globeGroup) return;

    const delta = computeScrollRotationDelta(event.deltaY);
    if (delta === 0) return;

    this.globeGroup.rotation.y += delta;
  }

  handlePointerDown(event) {
    if (!event.isPrimary || event.button !== 0) return;

    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.previousX = event.clientX;
    this.isDragging = false;
    this.autoRotateWasEnabled = this.autoRotate;
    this.container.setPointerCapture(event.pointerId);
  }

  handlePointerMove(event) {
    if (!event.isPrimary || this.dragStartX === null) return;

    const totalDeltaX = event.clientX - this.dragStartX;
    const totalDeltaY = event.clientY - this.dragStartY;

    // Check drag threshold (2D distance so vertical drags also activate drag mode)
    if (!this.isDragging && Math.hypot(totalDeltaX, totalDeltaY) <= DRAG_THRESHOLD) return;

    if (!this.isDragging) {
      this.isDragging = true;
      this.autoRotate = false;
      this.container.style.cursor = 'grabbing';
    }

    // Incremental delta for smooth rotation
    const incrementalDeltaX = event.clientX - this.previousX;
    this.previousX = event.clientX;

    if (this.globeGroup) {
      this.globeGroup.rotation.y += computeDragRotationDelta(incrementalDeltaX);
    }
  }

  handlePointerUp(event) {
    if (!event.isPrimary) return;

    if (this.isDragging) {
      this.wasDragging = true;
      // Resume auto-rotation if it was enabled before drag and user still wants it
      if (this.autoRotateWasEnabled && this.userWantsAutoRotate) {
        this.autoRotate = true;
      }
    }

    // Reset drag state
    this.isDragging = false;
    this.dragStartX = null;
    this.dragStartY = null;
    this.previousX = null;
    this.container.style.cursor = '';
  }

  /**
   * Get interactive objects for click/hover raycasting.
   * IMPORTANT: Excludes earth mesh and decorations.
   */
  getInteractiveObjects() {
    const objects = [];

    // Add visible markers
    this.markerMeshes.forEach((marker) => {
      if (marker.visible) {
        objects.push(marker);
      }
    });

    // Add region halos (invisible but interactable)
    this.regionHalos.forEach((halo) => {
      objects.push(halo);
    });

    return objects;
  }

  onMouseMove(event) {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // IMPORTANT: Only raycast against interactive objects, NOT earth/decorations
    const interactiveObjects = this.getInteractiveObjects();
    const intersects = this.raycaster.intersectObjects(interactiveObjects, true);

    // Track previous hover for responsive updates
    const previousHovered = this.hoveredMesh;
    this.hoveredMesh = null;
    this.tooltip.style.opacity = '0';

    if (intersects.length > 0) {
      let mesh = intersects[0].object;
      // Find parent with userData.type if needed
      while (mesh && !mesh.userData.type) {
        mesh = mesh.parent;
      }

      if (mesh && (mesh.userData.type === 'region' || mesh.userData.type === 'marker')) {
        this.hoveredMesh = mesh;
        this.container.style.cursor = 'pointer';
        this.autoRotate = false;

        // Show tooltip immediately (not throttled)
        if (mesh.userData.type === 'region') {
          this.tooltip.textContent = mesh.userData.regionName;
        } else if (mesh.userData.type === 'marker') {
          this.tooltip.textContent = `${mesh.userData.office.city}, ${mesh.userData.office.state}`;
        }
        this.tooltip.style.left = `${event.clientX - rect.left + 10}px`;
        this.tooltip.style.top = `${event.clientY - rect.top + 10}px`;
        this.tooltip.style.opacity = '1';
      }
    }

    if (!this.hoveredMesh) {
      this.container.style.cursor = 'default';
      // Note: autoRotate is now user-controlled via toggle button
      // Don't auto-enable rotation on hover leave
    }

    // Update hover glow immediately (responsive path)
    if (previousHovered !== this.hoveredMesh) {
      this.updateHoverGlow(previousHovered, this.hoveredMesh);
    }
  }

  /**
   * Update hover glow effect immediately (responsive, not throttled)
   */
  updateHoverGlow(previousMesh, currentMesh) {
    // Remove glow from previous
    if (previousMesh && previousMesh.userData.type === 'marker') {
      previousMesh.children.forEach((child) => {
        if (child.userData.isGlow) {
          child.material.opacity = 0;
        }
      });
    }

    // Add glow to current
    if (currentMesh && currentMesh.userData.type === 'marker') {
      currentMesh.children.forEach((child) => {
        if (child.userData.isGlow) {
          child.material.opacity = 0.4;
        }
      });
    }
  }

  onClick(_event) {
    // Suppress click after a drag gesture
    if (this.wasDragging) {
      this.wasDragging = false;
      return;
    }

    // IMPORTANT: Only respond to clicks on interactive objects
    if (!this.hoveredMesh) return;

    if (this.hoveredMesh.userData.type === 'region') {
      this.selectRegion(this.hoveredMesh.userData.regionName);
      this.options.onRegionClick(this.hoveredMesh.userData.regionName);
    } else if (this.hoveredMesh.userData.type === 'marker') {
      const office = this.hoveredMesh.userData.office;
      this.selectOffice(office);
      this.options.onOfficeClick(office);

      // Show office modal with region info
      const region = getClientRegion(office.regionName);
      showOfficeModal(office, region);
    }
  }

  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Expensive marker state updates (backface culling, distance scaling).
   * THROTTLED to every 250ms to prevent performance degradation.
   * Skipped entirely during camera animations.
   *
   * Note: Region-based dimming is now handled by updateMarkerStates()
   * via the centralized computeMarkerStates() function. This method
   * only handles rendering-only concerns (backface culling + distance scaling).
   */
  updateExpensiveMarkerStates() {
    // Skip during animation to prevent freeze
    if (this.animating) return;

    const { worldPos, toMarker } = this._tempVectors;
    const cameraPosition = this.camera.position;

    this.markerMeshes.forEach((marker, _code) => {
      if (marker.userData._dimmed) {
        // Apply opacity dimming — keeps backface culling and distance scaling active
        marker.children.forEach((child) => {
          if (child.material && !child.userData.isGlow) {
            child.material.transparent = true;
            child.material.opacity = 0.3;
          }
          if (child.userData.isGlow) {
            child.material.opacity = 0;
          }
        });
        // Fall through to backface culling and distance scaling below
      }

      // Get marker world position (accounting for globe rotation)
      marker.getWorldPosition(worldPos);

      // Backface culling: hide markers behind globe
      // Uses hysteresis to prevent flickering at visibility boundary
      toMarker.copy(worldPos).sub(cameraPosition).normalize();
      const dotProduct = toMarker.dot(worldPos.clone().normalize());

      // Apply hysteresis logic (exported as computeMarkerVisibility for testability)
      marker.visible = computeMarkerVisibility(marker.visible, dotProduct);

      if (!marker.visible) return;

      // Distance-based scaling
      const distance = cameraPosition.distanceTo(worldPos);
      const scale = Math.max(0.5, Math.min(1.5, 200 / distance));
      marker.scale.setScalar(scale);
    });
  }

  /**
   * Apply centralized marker visual states from computeMarkerStates().
   * Applies material property changes for selected/highlighted/dimmed states.
   * @param {Array<{officeCode: string, selected: boolean, highlighted: boolean, dimmed: boolean}>} states
   */
  updateMarkerStates(states) {
    for (const state of states) {
      const marker = this.markerMeshes.get(state.officeCode);
      if (!marker) continue;

      marker.userData._dimmed = state.dimmed;

      if (state.dimmed) {
        // Apply dimming immediately to prevent visible flash before next expensive tick
        marker.children.forEach((child) => {
          if (child.material && !child.userData.isGlow) {
            child.material.transparent = true;
            child.material.opacity = 0.3;
          }
          if (child.userData.isGlow) {
            child.material.opacity = 0;
          }
        });
        continue;
      }

      if (state.subdued) {
        marker.children.forEach((child) => {
          if (child.material && !child.userData.isGlow) {
            child.material.transparent = true;
            child.material.opacity = 0.55;
          }
          if (child.userData.isGlow) {
            child.material.opacity = 0;
          }
        });
        continue;
      }

      // Reset opacity for markers coming out of dimmed state
      marker.children.forEach((child) => {
        if (child.material && !child.userData.isGlow) {
          child.material.opacity = 1.0;
          child.material.transparent = false;
        }
      });

      // Selected: emissive glow on head
      marker.children.forEach((child) => {
        if (child.userData.isGlow) {
          child.material.opacity = state.selected ? 0.5 : 0;
        } else if (child.geometry?.type === 'SphereGeometry' && !child.userData.isGlow) {
          // Pin head
          child.material.emissive.setHex(state.selected ? 0x664400 : 0x440000);
        }
      });

      // Highlighted: scale pulse
      if (state.highlighted && !state.selected) {
        marker.children.forEach((child) => {
          if (child.userData.isGlow) {
            child.material.opacity = 0.4;
          }
        });
      }
    }
  }

  selectRegion(regionName) {
    this.selectedRegion = regionName;
    this.selectedOffice = null;
    this.autoRotate = false;

    // Animate camera to region
    const cameraViews = getCameraViews();
    const view = cameraViews[regionName] || cameraViews.USA;
    this.animateToTarget(view.lat, view.lon, view.distance);

    // Force immediate expensive update after animation settles
    setTimeout(() => this.updateExpensiveMarkerStates(), 100);
  }

  selectOffice(office) {
    this.selectedOffice = office;

    if (!office.coordinates) return;

    // Zoom closer to the office
    this.animateToTarget(office.coordinates.lat, office.coordinates.lon, 150);
  }

  reset() {
    this.selectedRegion = null;
    this.selectedOffice = null;
    this.autoRotate = false;
    this.userWantsAutoRotate = false;

    // Close any open modal
    closeOfficeModal();

    // Return to USA view
    const cameraViews = getCameraViews();
    const view = cameraViews.USA;
    this.animateToTarget(view.lat, view.lon, view.distance);

    this.options.onReset();
  }

  /**
   * Animate camera to target location.
   * Globe rotation is stopped and camera moves directly to view the target.
   */
  animateToTarget(lat, lon, distance, duration = 1000) {
    if (this.animating) return;
    this.animating = true;
    this.autoRotate = false;

    // Calculate target camera position accounting for current globe rotation
    const currentGlobeRotation = this.globeGroup.rotation.y;
    const adjustedLon = lon + (currentGlobeRotation * 180) / Math.PI;

    const targetCameraPos = getCameraPosition(lat, adjustedLon, distance);
    const startCameraPos = this.camera.position.clone();

    const startTime = performance.now();

    const animate = (currentTime) => {
      // Check for cancellation (allows clean disposal during animation)
      if (!this.animating) return;

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      this.camera.position.lerpVectors(startCameraPos, targetCameraPos, eased);
      this.camera.lookAt(0, 0, 0);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.animating = false;
        // Restore rotation if user had it enabled before animation
        this.autoRotate = this.userWantsAutoRotate;
        // Force expensive update after animation completes
        this.updateExpensiveMarkerStates();
      }
    };

    requestAnimationFrame(animate);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    // Rotate the entire globeGroup (synchronized rotation)
    if (this.autoRotate && this.globeGroup) {
      this.globeGroup.rotation.y += this.rotationSpeed;
    }

    // Throttled expensive updates (visibility, scaling, backface culling)
    const now = Date.now();
    if (now - this._lastExpensiveUpdate > this._expensiveUpdateInterval) {
      this.updateExpensiveMarkerStates();
      this._lastExpensiveUpdate = now;
    }

    // Animate glow for hovered/selected markers (responsive, every frame)
    const time = Date.now() * 0.002;
    if (this.hoveredMesh?.userData.type === 'marker') {
      this.hoveredMesh.children.forEach((child) => {
        if (child.userData.isGlow) {
          const pulse = Math.sin(time) * 0.15 + 0.4;
          child.material.opacity = pulse;
        }
      });
    }
    if (this.selectedOffice) {
      const selectedMarker = this.markerMeshes.get(this.selectedOffice.officeCode);
      if (selectedMarker && selectedMarker !== this.hoveredMesh) {
        selectedMarker.children.forEach((child) => {
          if (child.userData.isGlow) {
            const pulse = Math.sin(time) * 0.1 + 0.35;
            child.material.opacity = pulse;
          }
        });
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  getState() {
    return {
      selectedRegion: this.selectedRegion,
      selectedOffice: this.selectedOffice,
    };
  }

  /**
   * Cancel any in-progress camera animation and stop auto-rotation.
   * Called before dispose() to ensure clean shutdown.
   */
  cancelAnimation() {
    this.animating = false;
    this.autoRotate = false;
    this.userWantsAutoRotate = false;
  }

  /**
   * Toggle auto-rotation on/off.
   * Sets both user preference and effective state.
   * @returns {boolean} The new autoRotate state
   */
  toggleAutoRotate() {
    this.userWantsAutoRotate = !this.userWantsAutoRotate;
    this.autoRotate = this.userWantsAutoRotate;
    return this.userWantsAutoRotate;
  }

  /**
   * Get current auto-rotation user preference.
   * Returns what the user wants (not the effective state during animations/hover).
   * @returns {boolean} User's autoRotate preference
   */
  getAutoRotate() {
    return this.userWantsAutoRotate;
  }

  /**
   * Get scene graph for testing
   */
  getSceneGraph() {
    return {
      globeGroup: this.globeGroup,
      markerGroup: this.markerGroup,
      regionOverlayGroup: this.regionOverlayGroup,
      staticGroup: this.staticGroup,
      earthMesh: this.earthMesh,
    };
  }

  dispose() {
    try {
      // Cancel any in-progress camera animation first
      this.cancelAnimation();

      // Cancel animation loop
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }

      // Remove event listeners (with guards)
      if (this._boundOnResize) {
        window.removeEventListener('resize', this._boundOnResize);
      }
      if (this._boundOnMouseMove && this.container) {
        this.container.removeEventListener('mousemove', this._boundOnMouseMove);
      }
      if (this._boundOnClick && this.container) {
        this.container.removeEventListener('click', this._boundOnClick);
      }
      if (this._boundOnWheel && this.container) {
        this.container.removeEventListener('wheel', this._boundOnWheel);
      }
      if (this._boundPointerDown && this.container) {
        this.container.removeEventListener('pointerdown', this._boundPointerDown);
      }
      if (this._boundPointerMove && this.container) {
        this.container.removeEventListener('pointermove', this._boundPointerMove);
      }
      if (this._boundPointerUp && this.container) {
        this.container.removeEventListener('pointerup', this._boundPointerUp);
        this.container.removeEventListener('pointercancel', this._boundPointerUp);
      }

      // Dispose tooltip
      if (this.tooltip && this.tooltip.parentNode) {
        this.tooltip.parentNode.removeChild(this.tooltip);
      }

      // Close any open modal
      closeOfficeModal();

      // Dispose earth mesh resources
      if (this.earthMesh) {
        this.earthMesh.geometry?.dispose();
        if (this.earthMesh.material?.map) {
          this.earthMesh.material.map.dispose();
        }
        this.earthMesh.material?.dispose();
      }

      // Dispose atmosphere
      if (this.atmosphere) {
        this.atmosphere.geometry?.dispose();
        this.atmosphere.material?.dispose();
      }

      // Dispose marker resources (track unique geometries/materials to avoid double-dispose)
      if (this.markerMeshes) {
        const disposedGeometries = new Set();
        const disposedMaterials = new Set();

        this.markerMeshes.forEach((marker) => {
          marker.children.forEach((child) => {
            // Dispose geometry if not already disposed
            if (child.geometry && !disposedGeometries.has(child.geometry)) {
              disposedGeometries.add(child.geometry);
              child.geometry.dispose();
            }
            // Handle material (can be array or single)
            if (child.material) {
              const materials = Array.isArray(child.material) ? child.material : [child.material];
              materials.forEach((mat) => {
                if (mat && !disposedMaterials.has(mat)) {
                  disposedMaterials.add(mat);
                  mat.dispose();
                }
              });
            }
          });
        });
      }

      // Dispose region halos
      if (this.regionHalos) {
        this.regionHalos.forEach((halo) => {
          if (halo.geometry) halo.geometry.dispose();
          // Handle material (can be array or single)
          if (halo.material) {
            const materials = Array.isArray(halo.material) ? halo.material : [halo.material];
            materials.forEach((mat) => mat?.dispose());
          }
        });
      }

      // Dispose stars (in staticGroup)
      if (this.staticGroup) {
        this.staticGroup.children.forEach((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
      }
    } finally {
      // Always try to dispose renderer
      if (this.renderer) {
        this.renderer.dispose();
        this.renderer.forceContextLoss();
        if (this.container && this.renderer.domElement?.parentNode === this.container) {
          this.container.removeChild(this.renderer.domElement);
        }
      }
    }
  }
}

// WebGL detection utility
export function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (_e) {
    return false;
  }
}

// HMR support for development
if (import.meta.hot) {
  import.meta.hot.accept((_newModule) => {
    // Module updated - page will reload
    console.log('[HMR] map-3d.js updated');
  });

  import.meta.hot.dispose((_data) => {
    // Clean up before module is replaced
    console.log('[HMR] Disposing map-3d.js');
    // The app.ts will handle actual disposal via toggleMapMode or reset
  });
}
