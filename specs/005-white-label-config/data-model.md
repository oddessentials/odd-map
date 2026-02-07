# Data Model: White-Label Client Configuration

**Feature**: 005-white-label-config | **Date**: 2026-02-05
**Phase**: 1 — Design & Contracts

---

## Entity Relationship Overview

```
ClientConfig (1)
├── offices[] (1:N)           — Office entities with coordinates
├── regionalPersonnel{} (1:N) — Keyed by region name
│   └── personnel[] (1:N)     — Personnel entities
├── specialtyDivisions[] (0:N)
│   └── personnel[] (0:N)     — Personnel entities
├── globalContacts (0..1)
│   └── accountingContact (0..1)  — Personnel shape
└── theme (0..1)
    ├── regionColors{} (0:N)  — Keyed by region name
    └── cameraViews{} (0:N)   — Keyed by region name

MapConfig (1, separate file)
├── regions[] (1:N)           — Shared region definitions
├── coordinates[] (1:N)       — SVG (x,y) positions per office
└── projection (1)            — geoAlbersUsa parameters

Relationship: ClientConfig.offices[].region → MapConfig.regions[].name
Relationship: ClientConfig.offices[].officeCode → MapConfig.coordinates[].officeCode
```

---

## Entity Schemas

### ClientConfig (root)

The top-level schema for `config/{clientId}-client.json`.

| Field                | Type                        | Required | Description                                       |
| -------------------- | --------------------------- | -------- | ------------------------------------------------- |
| `schemaVersion`      | integer                     | Yes      | Must be `1`. Rejected if > max supported.         |
| `clientId`           | string                      | Yes      | Lowercase, no spaces. Must match filename prefix. |
| `name`               | string                      | Yes      | Company display name.                             |
| `copyrightHolder`    | string                      | Yes      | Legal entity for copyright notice.                |
| `tagline`            | string                      | No       | Displayed below company name. Omit = no tagline.  |
| `offices`            | Office[]                    | Yes      | At least 1 office required.                       |
| `regionalPersonnel`  | Record<string, Personnel[]> | No       | Keyed by region name.                             |
| `specialtyDivisions` | SpecialtyDivision[]         | No       | Omit = section hidden.                            |
| `globalContacts`     | GlobalContacts              | No       | Omit = "Contact information not available".       |
| `theme`              | BrandTheme                  | No       | Omit = all shared defaults.                       |
| `metadata`           | Record<string, unknown>     | No       | Arbitrary metadata, not rendered.                 |

### Office

| Field           | Type           | Required | Description                                                             |
| --------------- | -------------- | -------- | ----------------------------------------------------------------------- |
| `officeCode`    | string         | Yes      | Unique within client. Convention: `{PREFIX} {STATE}{N}`.                |
| `city`          | string         | Yes      | City name.                                                              |
| `state`         | string         | Yes      | Full state name.                                                        |
| `officeType`    | enum           | Yes      | `"Branch Office"` or `"Satellite Sales Office"`.                        |
| `address`       | string \| null | No       | Full address or null for satellites. Fallback: "Address not available." |
| `directionsUrl` | string         | No       | Google Maps link. Omit = no "Get Directions" button.                    |
| `region`        | string         | Yes      | Must match a region `name` from MapConfig.                              |
| `coordinates`   | Coordinates    | Yes      | Lat/lon with metadata.                                                  |

### Coordinates

| Field         | Type    | Required | Description                                                                  |
| ------------- | ------- | -------- | ---------------------------------------------------------------------------- |
| `lat`         | number  | Yes      | Latitude (-90 to 90).                                                        |
| `lon`         | number  | Yes      | Longitude (-180 to 180).                                                     |
| `source`      | enum    | Yes      | `"verified"`, `"business_district"`, `"city_centroid"`, `"region_centroid"`. |
| `confidence`  | enum    | Yes      | `"high"`, `"medium"`, `"low"`.                                               |
| `approximate` | boolean | Yes      | Whether location is approximate.                                             |

### Personnel

| Field      | Type   | Required | Description                                            |
| ---------- | ------ | -------- | ------------------------------------------------------ |
| `name`     | string | Yes      | Full name.                                             |
| `title`    | string | Yes      | Job title.                                             |
| `phone`    | string | Yes      | Phone number (display format, not validated).          |
| `email`    | string | Yes      | Email address.                                         |
| `vcardUrl` | string | No       | vCard download URL. Omit = no "Download vCard" button. |

### SpecialtyDivision

| Field       | Type        | Required | Description                                |
| ----------- | ----------- | -------- | ------------------------------------------ |
| `name`      | string      | Yes      | Division name.                             |
| `personnel` | Personnel[] | Yes      | May be empty array (renders "0 contacts"). |

### GlobalContacts

All fields optional. Entire object is optional.

| Field                         | Type   | Required | Description                                        |
| ----------------------------- | ------ | -------- | -------------------------------------------------- |
| `mainPhone`                   | string | No       | Main phone number. Omit = phone link not rendered. |
| `mainEmail`                   | string | No       | Main email. Omit = email link not rendered.        |
| `departmentEmails`            | object | No       | Keyed by department name.                          |
| `departmentEmails.claims`     | string | No       | Claims department email.                           |
| `departmentEmails.lossRuns`   | string | No       | Loss runs department email.                        |
| `departmentEmails.accounting` | string | No       | Accounting department email.                       |
| `accountingContact`           | object | No       | Shape: `{ name, title, phone, email }`.            |

### BrandTheme

All fields optional. Entire object is optional.

| Field          | Type                       | Required | Description                                 |
| -------------- | -------------------------- | -------- | ------------------------------------------- |
| `primaryColor` | string                     | No       | CSS hex color. Overrides `--color-primary`. |
| `accentColor`  | string                     | No       | CSS hex color. Overrides `--color-accent`.  |
| `regionColors` | Record<string, string>     | No       | Keyed by region name. CSS hex colors.       |
| `cameraViews`  | Record<string, CameraView> | No       | Keyed by region name. 3D globe only.        |

### CameraView

| Field      | Type   | Required | Description                        |
| ---------- | ------ | -------- | ---------------------------------- |
| `distance` | number | Yes      | Camera distance from globe center. |
| `lat`      | number | Yes      | Camera target latitude.            |
| `lon`      | number | Yes      | Camera target longitude.           |

---

## Extended Client Registry

The existing `clients.prod.json` / `clients.test.json` format extends to include client config paths:

### Current Format

```json
{
  "clients": ["usg"],
  "configPath": "config/{clientId}-map-config.json"
}
```

### Extended Format

```json
{
  "clients": ["usg", "oddessentials"],
  "configPath": "config/{clientId}-map-config.json",
  "clientConfigPath": "config/{clientId}-client.json"
}
```

The `clientConfigPath` uses the same `{clientId}` template pattern as `configPath`.

---

## MarkerState Model

### MarkerVisualState (per-marker output)

| Field         | Type    | Description                                     |
| ------------- | ------- | ----------------------------------------------- |
| `officeCode`  | string  | Marker identifier                               |
| `visible`     | boolean | Logically visible (always true for all offices) |
| `selected`    | boolean | This office is the selected office              |
| `highlighted` | boolean | This marker is being hovered                    |
| `dimmed`      | boolean | Out-of-region when a region is selected         |
| `regionName`  | string  | Region this office belongs to                   |

### MarkerStateInput (computation input)

| Field                | Type               | Description                        |
| -------------------- | ------------------ | ---------------------------------- |
| `allOffices`         | OfficeWithRegion[] | All offices for the current client |
| `selectedRegion`     | string \| null     | Currently selected region name     |
| `selectedOfficeCode` | string \| null     | Currently selected office code     |
| `hoveredOfficeCode`  | string \| null     | Currently hovered office code      |

---

## Data Migration: locations.js → client.json

### Field Mapping

| locations.js                         | client.json                                  | Notes                               |
| ------------------------------------ | -------------------------------------------- | ----------------------------------- |
| `regions[].name`                     | NOT migrated                                 | Stays in map-config                 |
| `regions[].personnel[]`              | `regionalPersonnel[regionName][]`            | Re-keyed by region name             |
| `regions[].offices[]`                | `offices[]`                                  | Flat array, each has `region` field |
| `regions[].offices[].office_code`    | `offices[].officeCode`                       | camelCase                           |
| `regions[].offices[].office_type`    | `offices[].officeType`                       | camelCase                           |
| `regions[].offices[].directions_url` | `offices[].directionsUrl`                    | camelCase                           |
| `specialtyDivisions[]`               | `specialtyDivisions[]`                       | Direct mapping                      |
| `globalContacts.main_phone`          | `globalContacts.mainPhone`                   | camelCase                           |
| `globalContacts.main_email`          | `globalContacts.mainEmail`                   | camelCase                           |
| `globalContacts.claims_email`        | `globalContacts.departmentEmails.claims`     | Restructured                        |
| `globalContacts.loss_runs_email`     | `globalContacts.departmentEmails.lossRuns`   | Restructured                        |
| `globalContacts.accounting_email`    | `globalContacts.departmentEmails.accounting` | Restructured                        |
| `globalContacts.accounting_contact`  | `globalContacts.accountingContact`           | camelCase                           |
| N/A                                  | `clientId`                                   | New field                           |
| N/A                                  | `name`                                       | New field                           |
| N/A                                  | `copyrightHolder`                            | New field                           |
| N/A                                  | `tagline`                                    | New field                           |
| N/A                                  | `schemaVersion`                              | New field                           |
| N/A                                  | `theme`                                      | New field                           |

### Key Transformations

1. **snake_case → camelCase**: All field names switch to camelCase in the client config
2. **Personnel restructured**: Moves from nested under regions to `regionalPersonnel` object keyed by region name
3. **Offices flattened**: Moves from nested under regions to a top-level flat array; each office carries its `region` field
4. **Contacts restructured**: Department emails grouped under `departmentEmails` object
5. **New identity fields**: `clientId`, `name`, `copyrightHolder`, `tagline`, `schemaVersion` are new

---

## Type Compatibility

### Existing Types (src/types/index.ts)

The existing TypeScript interfaces use snake_case matching the current `locations.js` format:

- `Office.office_code`, `Office.office_type`, `Office.directions_url`
- `Personnel.vcard_url`
- `GlobalContacts.main_phone`, `GlobalContacts.main_email`, etc.

### Migration Strategy

The existing interfaces will be updated to use camelCase matching the new client config format. All consuming code updates in a single pass. The snake_case types are not exported as a public API — they are internal to this application.

---

## Validation Rules

### Schema Version

- Must be integer >= 1
- Must be <= `MAX_SUPPORTED_SCHEMA_VERSION` (initially `1`)
- Error: "Configuration schema version {N} is not supported. Maximum supported: {M}."

### Client ID

- Must match regex: `^[a-z][a-z0-9]*$`
- Must match the filename prefix of the config file
- Error: "Invalid clientId: must be lowercase alphanumeric."

### Office Code Uniqueness

- All `officeCode` values within a config must be unique
- Error: "Duplicate office code: {code}."

### Region Reference Validation

- Each `offices[].region` must match a `regions[].name` in the corresponding map-config
- Warning (not error): "Office {code} references unknown region '{name}'. Marker will render but not associate with a region boundary."

### Coordinate Bounds

- `lat` must be in range [-90, 90]
- `lon` must be in range [-180, 180]
- Error: "Office {code} has invalid coordinates: lat={lat}, lon={lon}."

### Color Format

- `primaryColor`, `accentColor`, and region color values must match CSS hex format: `^#[0-9a-fA-F]{6}$`
- Error: "Invalid color format: {value}. Expected CSS hex color (e.g., #1a5276)."
