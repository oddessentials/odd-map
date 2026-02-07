# Data Model: GitHub Actions Parity & Pages Deployment

**Feature Branch**: `006-github-pages-deploy`
**Date**: 2026-02-06

## Entities

### ClientRegistry (modified)

Existing interface with new optional field.

| Field             | Type       | Required | Description                                                                 |
| ----------------- | ---------- | -------- | --------------------------------------------------------------------------- |
| clients           | string[]   | Yes      | List of available client IDs                                                |
| configPath        | string     | Yes      | Template path for map config files                                          |
| clientConfigPath  | string     | Yes      | Template path for client config files                                       |
| fixtureClients    | string[]   | No       | Client IDs that are test fixtures (skip client config validation)           |
| **defaultClient** | **string** | **No**   | **Explicit default client ID. When absent, first client in array is used.** |

**Validation rules**:

- `defaultClient` (when present) MUST be included in the `clients` array.
- If `defaultClient` is absent, behavior falls back to `clients[0]` (existing behavior preserved).

### Demo Registry File (`config/clients.demo.json`)

New file. Follows `ClientRegistry` schema.

```json
{
  "clients": ["oddessentials", "usg"],
  "defaultClient": "oddessentials",
  "configPath": "config/{clientId}-map-config.json",
  "clientConfigPath": "config/{clientId}-client.json"
}
```

### Build Output (`/docs`)

Not a data model entity — it's a directory of static files (HTML, JS, CSS, images) produced by Vite and committed to the repository.

**Invariants**:

- Fully replaced on each deploy (no stale files).
- Only committed when content has changed (no churn).
- All asset paths resolve correctly under `/<repo>/` subdirectory.

## State Transitions

### CI Pipeline States

```text
Push Event
  ├── Any branch / PR → [verify] → pass/fail
  └── main branch → [verify] → [deploy]
                                  ├── build → diff check → no changes → skip commit
                                  └── build → diff check → changes → commit + push
```

### Client Registry Selection (runtime)

```text
import.meta.env.VITE_CLIENT_REGISTRY === 'demo'
  → clients.demo.json (oddessentials + usg, default: oddessentials)

import.meta.env.PROD === true (and no VITE_CLIENT_REGISTRY)
  → clients.prod.json (usg only)

else
  → clients.test.json (oddessentials + usg + acme + demo)
```

## Relationships

```text
CI Workflow
  ├── verify job (all branches)
  │   ├── CRLF check
  │   ├── npm run verify (typecheck + lint + format + test:ci)
  │   └── npm run build
  └── deploy job (main only, depends on verify)
      ├── vite build --base /<repo>/
      ├── replace docs/ with dist/
      └── conditional commit + push

Demo Build
  ├── uses clients.demo.json registry
  ├── PROD import maps must include oddessentials + usg
  └── defaultClient → oddessentials (explicit)

GitHub Pages
  ├── serves from /docs on main branch
  ├── subdirectory: /<repo>/
  └── ?client= query param handled at runtime by app.ts
```
