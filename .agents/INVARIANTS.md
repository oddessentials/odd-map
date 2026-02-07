# USG Map Platform Invariants

Non-negotiable architectural principles. Violations require explicit justification and team review.

---

## 1. Deterministic Coordinate Rendering

> **Pins render where they belong—always.**

| Constraint                                                         | Rationale                                       |
| ------------------------------------------------------------------ | ----------------------------------------------- |
| Coordinates are immutable at runtime                               | No geocoding or projection on the client side   |
| 2D: SVG positions from `usg-map-config.json`                       | O(1) lookup by `officeCode`                     |
| 3D: `latLonToGlobe(lat, lon)` with Y-up convention                 | Mathematical consistency with texture alignment |
| Null coordinates → explicit fallback (region centroid or omission) | Rendering never fails silently                  |

**Standard 3D Axes**: Y+ = North, Z+ = Front (0°, 0°), X+ = East (90° E)

---

## 2. Scene Graph Parenting (3D Globe)

```
globeGroup (rotates)
├── earthMesh
├── markerGroup
└── regionOverlayGroup
```

- **All rotating elements parent to `globeGroup`**—markers must never attach to Earth mesh directly.
- **staticGroup** holds non-rotating elements (stars, lights).
- A non-WebGL unit test **must assert correct parenting**.

---

## 3. Raycasting Isolation

| Intent        | Ray Target                                    |
| ------------- | --------------------------------------------- |
| Drag / Rotate | Full scene or globe mesh                      |
| Click / Hover | `markerGroup` + `regionOverlayGroup` **only** |

The globe surface **must never trigger selection events**.

---

## 4. Single Marker State Update Function

All marker visual state flows through **one centralized function**:

- Hover highlight
- Selection glow
- Dimming (out-of-region)
- Animation (pulse/scale)

**Only hovered or selected pins may animate.**

---

## 5. Shared Application State

```
              ┌───────────┐
              │   App     │ (state machine owner)
              │ State     │
              └───┬───┬───┘
                  │   │
         ┌────────┘   └────────┐
         ▼                     ▼
    ┌─────────┐          ┌─────────┐
    │  2D Map │          │  3D Map │
    └─────────┘          └─────────┘
```

- Both 2D and 3D maps read/write the **same** `selectedRegion` and `selectedOffice` state.
- View transitions use stable identifiers (`regionName` string, `officeCode` string).

---

## 6. Three Mandatory UI Modes

| Mode              | Entry                   | Exit                 |
| ----------------- | ----------------------- | -------------------- |
| **USA View**      | App init / Reset button | Click region         |
| **Region View**   | Click region on USA map | Click office or Back |
| **Location View** | Click office marker     | Close modal or Back  |

Transitions are **deterministic**—no playful or chaotic motion.

---

## 7. Modal Accessibility

All modals **must**:

- Close on `ESC` key
- Close on click-outside
- Trap focus within the dialog
- Provide ARIA labels

---

## 8. No Post-Processing Effects

Highlights and glows are achieved via:

- Simple meshes
- Sprites
- Material-based effects (emissive, opacity)

**OutlinePass and similar passes are prohibited** due to performance overhead.

---

## 9. Region-First Interaction

- Regions are the primary selectable unit at the national level.
- States may render visually but are **never** primary click targets.

---

## 10. Zero Runtime Backend

| Allowed                      | Prohibited                       |
| ---------------------------- | -------------------------------- |
| Static file serving          | Runtime API calls                |
| CDN assets (pinned versions) | External data fetches at runtime |
| Build-time geocoding         | Client-side geocoding            |

Google Maps embeds allowed **only if no API key is required**; otherwise, link-only.

---

## 11. Build-Time Data Pipeline

```
usgins.com (source of truth)
       │
       ▼
  scrape → geocode → validate → emit artifact
                                      │
                                      ▼
                       data/locations.json (versioned)
```

- Schema enforces: region, office name, type, address, phone, email, manager, vCard/directions links.
- Missing data is **explicitly represented**, never inferred.
- Validation report confirms parity with official source.

---

## 12. Performance Budget (3D Path)

| Metric                    | Budget                           |
| ------------------------- | -------------------------------- |
| Total vertices (USA map)  | < 2,000                          |
| Draw calls                | < 50                             |
| Throttled update interval | 250 ms                           |
| Camera animation guard    | Skip expensive path during lerps |

Fall back to 2D SVG when budgets are exceeded.

---

## 13. Progressive Enhancement

- Base: accessible HTML + SVG.
- Enhanced: animation + 3D.
- Keyboard navigation and ARIA from day one.

---

## White-Label Configuration Invariants

These invariants govern the white-label architecture introduced in feature `005-white-label-config`. They ensure that the platform can serve multiple clients from a single codebase with zero application source changes per client.

### WLC-001 — Clear Data Ownership Boundary

All client-specific presentation and business data (branding, contacts, offices, personnel, specialty divisions, theme overrides, region visual overrides) MUST reside in the unified client configuration. Shared geographic assets (SVG regions and coordinate projection metadata) MUST remain external and be referenced consistently by all clients.

### WLC-002 — Single Canonical Client Selection Path

The platform MUST define one authoritative mechanism for selecting which client configuration loads at runtime. All environments and tests MUST use this same mechanism.

### WLC-003 — Versioned Configuration Schema

Every client configuration MUST declare a schema version and conform to a canonical structural contract. Future changes MUST preserve backward compatibility or explicitly bump the schema version.

### WLC-004 — Required vs Optional Field Contract

The configuration schema MUST explicitly define which fields are mandatory (hard validation failure) and which are optional (graceful UI fallback behavior).

### WLC-005 — Absolute Client String Isolation

No client-specific literals (names, emails, domains, slogans) may exist in application logic or rendered UI outside of the active client configuration. Any documentation exceptions MUST be explicitly scoped.

### WLC-006 — Canonical Region Identifiers

All client configurations MUST reference regions using a single shared identifier system derived from the shared map asset. No client may invent region keys.

### WLC-007 — Deterministic Region Override Behavior

The spec MUST define default behavior for missing region overrides (colors, camera views, mappings) to ensure predictable rendering across clients.

### WLC-008 — Centralized Marker State Authority

All marker visibility and state calculations across 2D and 3D renderers MUST flow through a single authoritative mechanism. No parallel or duplicated logic is permitted.

### WLC-009 — Bounded Brand Theming Surface

The configuration may override only explicitly approved visual tokens (such as primary color, accent color, and region colors). All other styling remains part of the core platform.

### WLC-010 — Canonical Data Shape Contracts

Offices, personnel, specialty divisions, global contacts, and brand theme structures MUST follow a single defined schema to ensure consistent consumption throughout the system.

### WLC-011 — Source Code Immutability for Client Onboarding

Onboarding a new client MUST NOT require modification of application source files. Only configuration assets may change.

### WLC-012 — Enforced Client Isolation Validation

The platform MUST include automated checks ensuring no client-specific data leaks into runtime UI or application logic.

### WLC-013 — Comprehensive Multi-Client Proof Configuration

The secondary (Odd Essentials) configuration MUST exercise all rendering paths, including optional field fallbacks, approximate coordinates, empty regions, and specialty divisions.

---

## Origin

These invariants emerged from the original design specification (2024–2026) which mandated:

1. **Deterministic rendering**—coordinates computed once at build time.
2. **Static delivery**—no runtime backend, no billable API keys.
3. **Professional choreography**—smooth, critically damped camera motion.
4. **Data parity**—scraped data matches official USG locations page exactly.

The platform is now Level 5 compliant with `@oddessentials/repo-standards`, with 74+ tests validating these invariants.
