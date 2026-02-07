/**
 * Performance Monitor
 *
 * Tracks frame rate, load times, and enforces performance budgets.
 * Provides adaptive quality settings for Three.js rendering.
 */

export class PerformanceMonitor {
  constructor(options = {}) {
    this.options = {
      targetFPS: options.targetFPS || 60,
      sampleSize: options.sampleSize || 60,
      budgets: {
        initialLoad: options.initialLoadBudget || 2000, // ms
        mapRender: options.mapRenderBudget || 100, // ms
        transition: options.transitionBudget || 500, // ms
      },
      onPerformanceIssue: options.onPerformanceIssue || (() => {}),
    };

    this.frameTimes = [];
    this.lastFrameTime = 0;
    this.isMonitoring = false;

    // Timing marks
    this.marks = {};
    this.measures = {};

    // Device info
    this.deviceInfo = this.detectDevice();

    // Quality level (1 = low, 2 = medium, 3 = high)
    this.qualityLevel = this.calculateInitialQuality();
  }

  detectDevice() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    let renderer = 'Unknown';
    let vendor = 'Unknown';

    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      }
    }

    return {
      devicePixelRatio: Math.min(window.devicePixelRatio, 2), // Cap at 2x
      isMobile: /Android|iPhone|iPad|iPod/i.test(navigator.userAgent),
      hasWebGL: !!gl,
      renderer,
      vendor,
      memory: navigator.deviceMemory || 4, // Default 4GB if not available
      cores: navigator.hardwareConcurrency || 4,
    };
  }

  calculateInitialQuality() {
    const { devicePixelRatio, isMobile, memory, cores } = this.deviceInfo;

    // Low-end device detection
    if (isMobile && memory <= 2) return 1;
    if (cores <= 2) return 1;

    // High-end detection
    if (devicePixelRatio >= 2 && memory >= 8 && cores >= 8) return 3;

    // Default to medium
    return 2;
  }

  mark(name) {
    this.marks[name] = performance.now();
  }

  measure(name, startMark, endMark = null) {
    const start = this.marks[startMark];
    const end = endMark ? this.marks[endMark] : performance.now();

    if (start === undefined) {
      console.warn(`Performance mark "${startMark}" not found`);
      return 0;
    }

    const duration = end - start;
    this.measures[name] = duration;

    // Check against budgets
    this.checkBudget(name, duration);

    return duration;
  }

  checkBudget(name, duration) {
    const budget = this.options.budgets[name];
    if (budget && duration > budget) {
      console.warn(
        `Performance budget exceeded for "${name}": ${duration.toFixed(1)}ms (budget: ${budget}ms)`
      );
      this.options.onPerformanceIssue({ name, duration, budget });
    }
  }

  startFrameMonitoring() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    this.lastFrameTime = performance.now();
    this.monitorFrame();
  }

  stopFrameMonitoring() {
    this.isMonitoring = false;
  }

  monitorFrame() {
    if (!this.isMonitoring) return;

    const now = performance.now();
    const frameTime = now - this.lastFrameTime;
    this.lastFrameTime = now;

    this.frameTimes.push(frameTime);
    if (this.frameTimes.length > this.options.sampleSize) {
      this.frameTimes.shift();
    }

    requestAnimationFrame(() => this.monitorFrame());
  }

  get fps() {
    if (this.frameTimes.length === 0) return 0;
    const avgFrameTime = this.frameTimes.reduce((a, b) => a + b) / this.frameTimes.length;
    return 1000 / avgFrameTime;
  }

  get avgFrameTime() {
    if (this.frameTimes.length === 0) return 0;
    return this.frameTimes.reduce((a, b) => a + b) / this.frameTimes.length;
  }

  getQualitySettings() {
    switch (this.qualityLevel) {
      case 1: // Low
        return {
          pixelRatio: 1,
          antialias: false,
          shadows: false,
          animationDuration: 200,
        };
      case 2: // Medium
        return {
          pixelRatio: Math.min(window.devicePixelRatio, 1.5),
          antialias: true,
          shadows: false,
          animationDuration: 300,
        };
      case 3: // High
        return {
          pixelRatio: Math.min(window.devicePixelRatio, 2),
          antialias: true,
          shadows: true,
          animationDuration: 400,
        };
      default:
        return this.getQualitySettings.call({ qualityLevel: 2 });
    }
  }

  adaptQuality() {
    const currentFPS = this.fps;
    const targetFPS = this.options.targetFPS;

    // If FPS is consistently low, reduce quality
    if (currentFPS < targetFPS * 0.7 && this.qualityLevel > 1) {
      this.qualityLevel--;
      console.info(
        `Reducing quality to level ${this.qualityLevel} (FPS: ${currentFPS.toFixed(1)})`
      );
      return true;
    }

    // If FPS is consistently high, increase quality
    if (currentFPS > targetFPS * 0.95 && this.qualityLevel < 3) {
      this.qualityLevel++;
      console.info(
        `Increasing quality to level ${this.qualityLevel} (FPS: ${currentFPS.toFixed(1)})`
      );
      return true;
    }

    return false;
  }

  getReport() {
    return {
      device: this.deviceInfo,
      quality: this.qualityLevel,
      qualitySettings: this.getQualitySettings(),
      fps: this.fps.toFixed(1),
      avgFrameTime: this.avgFrameTime.toFixed(2),
      measures: { ...this.measures },
    };
  }

  logReport() {
    console.table(this.getReport());
  }
}

// Singleton for global performance monitoring
let monitor = null;

export function getPerformanceMonitor(options) {
  if (!monitor) {
    monitor = new PerformanceMonitor(options);
  }
  return monitor;
}
