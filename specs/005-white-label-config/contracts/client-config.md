# Contract: Client Configuration Loader

**Module**: `src/lib/client-config.ts` (new)
**Schema**: `src/lib/client-config.schema.ts` (new)

---

## Purpose

Loads, validates, and provides access to the active client's configuration. This is the single entry point for all client-specific data in the application.

## Interface

### loadClientConfig(clientId: string): Promise<ClientConfig>

Loads and validates the client configuration JSON file for the given client ID.

**Inputs:**

- `clientId` — normalized lowercase string (e.g., `"usg"`, `"oddessentials"`)

**Outputs:**

- Resolved `ClientConfig` object conforming to the validated schema

**Errors:**

- `"Client '{id}' not found in registry."` — ID not in active registry
- `"Configuration schema version {N} is not supported. Maximum supported: {M}."` — version too high
- `"Missing required field: {path}"` — required field absent
- `"Duplicate office code: {code}."` — duplicate within offices array
- `"Invalid color format: {value}."` — theme color doesn't match hex pattern

**Side Effects:**

- Caches the loaded config for the session (one client per page load)

### getActiveConfig(): ClientConfig

Returns the previously loaded client config. Throws if called before `loadClientConfig()`.

### getClientOffices(): OfficeWithRegion[]

Returns all offices from the active config as a flat array with `regionName` attached. Replaces `getAllOffices()` from `locations.js`.

### getClientRegions(): Region[]

Reconstructs region objects from the active config by grouping offices and personnel by region name. Replaces `regions` export from `locations.js`.

### getClientRegion(regionName: string): Region | undefined

Returns a single reconstructed region by name. Replaces `getRegion()` from `locations.js`.

### getOfficesByRegion(regionName: string): Office[]

Returns offices filtered by region name. Replaces `getOfficesByRegion()` from `locations.js`.

---

## Schema Contract (Zod)

```
ClientConfigSchema = z.object({
  schemaVersion: z.number().int().min(1).max(MAX_SUPPORTED_VERSION),
  clientId: z.string().regex(/^[a-z][a-z0-9]*$/),
  name: z.string().min(1),
  copyrightHolder: z.string().min(1),
  tagline: z.string().optional(),
  offices: z.array(OfficeSchema).min(1),
  regionalPersonnel: z.record(z.string(), z.array(PersonnelSchema)).optional(),
  specialtyDivisions: z.array(SpecialtyDivisionSchema).optional(),
  globalContacts: GlobalContactsSchema.optional(),
  theme: BrandThemeSchema.optional(),
  metadata: z.record(z.unknown()).optional(),
})
```

Validation is strict — unknown keys are stripped silently.

---

## Import Map Extension

The `client-registry.ts` import maps must be extended to include client config imports:

```typescript
const PROD_CLIENT_CONFIG_MAP: Record<string, () => Promise<unknown>> = {
  usg: () => import('../../config/usg-client.json'),
};

const TEST_CLIENT_CONFIG_MAP: Record<string, () => Promise<unknown>> = {
  usg: () => import('../../config/usg-client.json'),
  oddessentials: () => import('../../config/oddessentials-client.json'),
};
```

This follows the exact same pattern as the existing map-config import maps.

---

## Consumers

All files that currently import from `src/data/locations.js` must switch to importing from `src/lib/client-config.ts`:

| Consumer                 | Old Import                          | New Import                                            |
| ------------------------ | ----------------------------------- | ----------------------------------------------------- |
| `app.ts`                 | `regions, getRegion`                | `getClientRegions, getClientRegion`                   |
| `map-svg.ts`             | `getAllOffices`                     | `getClientOffices`                                    |
| `map-3d.js`              | `regions, getAllOffices, getRegion` | `getClientRegions, getClientOffices, getClientRegion` |
| `region-list.js`         | `regions`                           | `getClientRegions`                                    |
| `specialty-divisions.js` | `specialtyDivisions`                | `getActiveConfig().specialtyDivisions`                |
