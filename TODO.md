# USG Map - Consolidated TODO

**Last Updated:** 2026-02-05

---

## ✅ FIXED - 3D Map Issues (Branch: 001-fix-map-bugs)

### 1. Pins Disappear on 3D → 2D Transition

**Status:** ✅ FIXED (commit c5c2cef)

**Solution:** Added race condition fix with `markersReady` flag and `pendingRegionSelection` queue in `map-svg.ts`. When `selectRegion()` is called before markers exist, the selection is queued and processed after `addMarkers()` completes.

**Files:** `src/components/map-svg.ts`

---

### 2. 3D Map Pin Flickering

**Status:** ✅ FIXED (commit c8daf5e)

**Solution:** Added hysteresis to backface culling with two thresholds:

- `BACKFACE_HIDE_THRESHOLD = 0.25` (hide when exceeds)
- `BACKFACE_SHOW_THRESHOLD = 0.15` (show when drops below)

The 0.10 gap prevents rapid toggling at the visibility boundary.

**Files:** `src/components/map-3d.js`

---

### 3. 3D Map Pins in Wrong Location (Ocean Instead of USA)

**Status:** ✅ FIXED (commit 9e1d97e)

**Solution:** Calibrated texture alignment with empirically determined offsets:

- `TEXTURE_LONGITUDE_OFFSET_DEG = 85` (not 180 as initially assumed)
- `texture.offset.y = 0.15` (vertical alignment)

**Files:** `src/components/map-3d.js`

---

## 🔴 MUST DO - Before First Production Deploy

### 4. Integrate Validation into Coordinate Capture Tool ⏱️ 2h

**Why:** Prevents capturing bad coordinates (ocean, wrong region)

**Steps:**

1. Import `validateCaptureSession` into `tools/coordinate-capture.html`
2. Call validation before enabling export button
3. Display errors/warnings in UI with visual indicators
4. Block export if errors exist, allow with warnings

**Files:** `tools/coordinate-capture.html`, `src/lib/coordinate-validation.ts` ✅

---

### 5. Update Coordinate Capture Tool with Backup Integration ⏱️ 1h

**Why:** Prevents config corruption during manual updates

**Steps:**

1. Import `safeWriteConfig` into capture tool
2. Replace direct JSON write with `safeWriteConfig`
3. Show backup confirmation in export flow
4. Add "Restore from Backup" button

**Files:** `tools/coordinate-capture.html`, `scripts/config-backup.ts` ✅

---

### 6. Fix SVG Region IDs ⏱️ 30min

**Why:** Blocks all verification, needs to pass before deploy

**Steps:**

1. Run: `npm run add-region-ids:dry-run` (preview)
2. Review proposed changes
3. Run: `npm run add-region-ids` (apply)
4. Verify SVG still renders
5. Run: `npm run generate:map-hash`
6. Run: `npm run verify:svg-ids` (should pass)

---

### 7. Create Migration/Onboarding Documentation ⏱️ 2h

**Why:** Engineers need to know how to add clients

**Steps:**

1. Create `docs/CLIENT_ONBOARDING.md` with prerequisites, SVG prep, config creation, region ID naming, coordinate capture workflow, verification checklist
2. Add to README.md

---

### 8. Add Error Recovery UI to MapSvg ⏱️ 1.5h

**Why:** White screen on config load failure is bad UX

**Steps:**

1. Add error state to MapSvg component
2. Render fallback UI on init failure (error message, "Retry" button, "Report Issue" link)
3. Add manual client switching UI (for multi-tenant apps)
4. Test with invalid config

**Files:** `src/components/map-svg.ts`

---

## 🟡 SHOULD DO - Post-Deploy Hardening

### 9. Runtime Hot Reload for Config Updates ⏱️ 2h

Add file watcher to detect config changes, call `initProjection()` to reload, re-render markers, show toast notification.

---

### 10. Document Schema Migration Strategy ⏱️ 1h

Create `docs/SCHEMA_MIGRATION.md` documenting v1 schema, outline migration approach with `configVersion` check, create migration functions.

---

### 11. Add Memory Management for Multi-Client ⏱️ 1.5h

Implement LRU cache for `clientStates` Map, add `maxClients` config, add `clearClient(clientId)` API.

**Files:** `src/lib/projection.ts`

---

### 12. Integrate Monitoring/Observability ⏱️ 2h

Add error tracking integration points for `getMarkerPosition()` failures, `initProjection()` failures, validation failures. Document Sentry/DataDog integration.

---

### 13. Handle 3D Map Lat/Lon Decision ⏱️ 1h

**Recommendation:** Keep lat/lon as reference data. 3D map continues using `office.coordinates`, 2D uses office code lookup. Document decision in `docs/ARCHITECTURE.md`.

---

## 🟢 NICE TO HAVE - Polish

### 14. E2E Testing for Coordinate Capture Tool ⏱️ 3h

Set up Playwright, write tests for load tool, click map, enter office code, export config.

---

### 15. Accessibility Audit & Fixes ⏱️ 2h

Run axe-core, add screen reader labels, ensure keyboard navigation, add ARIA announcements.

---

### 16. Performance Testing ⏱️ 2h

Create perf test with 100+ offices, benchmark `initProjection()` and marker rendering time.

---

### 17. Implement White-Labeling ⏱️ 4h

Add pinAsset to config schema, support custom pin SVG/image, add brandColors to config.

---

### 18. Create CLI Tool for Common Tasks ⏱️ 3h

Create `scripts/map-cli.ts` with commands: `map new-client`, `map verify`, `map backup`, `map migrate`.

---

## ✅ COMPLETED

- **3D Map Bug Fixes (001-fix-map-bugs branch)**:
  - Race condition fix for 2D/3D view toggle (markersReady + pendingRegionSelection)
  - Texture alignment calibration (85° longitude, 0.15 latitude offset)
  - Hysteresis backface culling to prevent flickering (0.15/0.25 thresholds)
  - HMR support for dev server with proper Three.js resource cleanup
  - 118 tests passing (added 9 hysteresis tests, updated texture offset tests)
- Office Modal Component with Google Maps directions
- Scene Graph Organization (globeGroup, markerGroup, regionOverlayGroup, staticGroup)
- Performance Optimizations (object pooling, animation guards, throttled updates)
- Unit Tests (20 projection + 9 view switching tests)
- TypeScript compilation clean, Vite build successful
- Phase 1: Integrity Infrastructure
- Phase 3: UI Integration with Loud Failures
- Phase 3.5: Production Release Gates
- Phase 3.6: Multi-Tenant Safety
- SVG Region ID Generator Tool
- Config Backup/Restore Utilities
- Coordinate Validation Logic

---

## 📊 Priority Summary

| Priority                 | Items  | Est. Time |
| ------------------------ | ------ | --------- |
| ✅ Critical 3D Issues    | #1-3   | DONE      |
| 🔴 Must Do Pre-Deploy    | #4-8   | 7h        |
| 🟡 Post-Deploy Hardening | #9-13  | 7.5h      |
| 🟢 Polish                | #14-18 | 14h       |

---

## 🚀 Quick Reference

**Key Files:**

- `src/components/map-3d.js` - 3D globe implementation
- `src/components/map-svg.ts` - 2D SVG map implementation
- `src/app.ts` - Application controller, view switching
- `src/lib/projection.ts` - Coordinate projection system

**Test Commands:**

```bash
npm run test:ci           # Full verification + tests
npm run verify:production # SVG IDs + integrity checks
npm run build             # Production build
```

**Estimated to Production:** 2-3 sessions (15-20 hours)
