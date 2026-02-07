# Quickstart: Onboarding a New Client

**Feature**: 005-white-label-config | **Date**: 2026-02-05

---

## Overview

Onboarding a new client requires exactly **two configuration files** and **one registry edit**. No application source code is modified.

---

## Step 1: Create the Client Configuration File

Create `config/{clientId}-client.json` with the client's business data.

**Minimal required structure:**

```json
{
  "schemaVersion": 1,
  "clientId": "newclient",
  "name": "New Client Inc.",
  "copyrightHolder": "New Client Inc.",
  "offices": [
    {
      "officeCode": "NC NY1",
      "city": "New York",
      "state": "New York",
      "officeType": "Branch Office",
      "address": "123 Broadway, New York, NY 10001",
      "directionsUrl": "https://www.google.com/maps/dir//123+Broadway+New+York+NY",
      "region": "Northeast Region",
      "coordinates": {
        "lat": 40.7128,
        "lon": -74.006,
        "source": "verified",
        "confidence": "high",
        "approximate": false
      }
    }
  ]
}
```

**Optional fields to enrich the configuration:**

- `tagline` — displayed below company name in the header
- `globalContacts` — footer contact information (phone, email, department emails)
- `regionalPersonnel` — personnel keyed by region name
- `specialtyDivisions` — non-geographic divisions with personnel
- `theme` — brand color overrides (`primaryColor`, `accentColor`, `regionColors`, `cameraViews`)
- `metadata` — arbitrary data (not rendered)

See `data-model.md` for the complete schema reference.

---

## Step 2: Create the Map Configuration File

Create `config/{clientId}-map-config.json` with SVG coordinate projections.

This file maps the client's offices to SVG pixel positions on the shared USA regions map. It uses the same `geoAlbersUsa` projection as all clients.

```json
{
  "regions": [
    {
      "name": "Northeast Region",
      "svgPathId": "region-newclient-northeast-region"
    }
  ],
  "coordinates": [
    {
      "officeCode": "NC NY1",
      "x": 830.5,
      "y": 190.2
    }
  ],
  "projection": {
    "type": "geoAlbersUsa",
    "scale": 1276,
    "translate": [479, 299]
  },
  "viewBox": {
    "x": 0,
    "y": 0,
    "width": 960,
    "height": 600
  }
}
```

**How to compute SVG coordinates:**

The SVG (x, y) positions are computed from lat/lon using the `geoAlbersUsa` projection with the parameters above. Use the existing build pipeline or compute manually:

1. Use the same projection parameters as the USG config (`scale: 1276`, `translate: [479, 299]`)
2. Apply the Albers USA projection formula to each office's lat/lon
3. The resulting (x, y) values are the SVG coordinates

---

## Step 3: Register the Client

Add the client ID to the appropriate registry file.

**For production deployment** — edit `config/clients.prod.json`:

```json
{
  "clients": ["usg", "newclient"],
  "configPath": "config/{clientId}-map-config.json",
  "clientConfigPath": "config/{clientId}-client.json"
}
```

**For development/testing** — edit `config/clients.test.json`:

```json
{
  "clients": ["usg", "oddessentials", "newclient"],
  "configPath": "config/{clientId}-map-config.json",
  "clientConfigPath": "config/{clientId}-client.json"
}
```

**Additionally**, add the client's import entries to `src/lib/client-registry.ts`:

```typescript
// In the appropriate import map (PROD or TEST)
newclient: () => import('../../config/newclient-map-config.json'),

// In the client config import map
newclient: () => import('../../config/newclient-client.json'),
```

---

## Step 4: Launch

Open the application with the client query parameter:

```
https://your-domain.com/?client=newclient
```

The application loads the client config, validates it, injects branding into the DOM, and renders the map with the client's offices, personnel, and theme.

---

## Validation

On load, the application validates the client config against the schema. If validation fails:

- **Missing required field**: Error message names the field. App does not render.
- **Schema version mismatch**: Error message shows expected vs actual version. App does not render.
- **Unknown client ID**: Error message lists available clients. App does not render.
- **Unknown region reference**: Console warning. Office renders at coordinates but not linked to a region boundary.

---

## Files Modified (total)

| File                                                     | Change                   |
| -------------------------------------------------------- | ------------------------ |
| `config/{clientId}-client.json`                          | Created (new)            |
| `config/{clientId}-map-config.json`                      | Created (new)            |
| `config/clients.prod.json` or `config/clients.test.json` | Client ID added to list  |
| `src/lib/client-registry.ts`                             | Import map entries added |

**No `.ts`, `.js`, `.css`, `.html`, or `.svg` source files under `src/` are modified** (registry import maps are configuration, not application logic per the spec).

---

## Example: Odd Essentials

See `config/oddessentials-client.json` for a comprehensive example that exercises all optional fields, edge cases, and theme overrides. This is the reference configuration for the white-label proof.
