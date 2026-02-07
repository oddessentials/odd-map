# Quickstart: GitHub Actions Parity & Pages Deployment

**Feature Branch**: `006-github-pages-deploy`
**Date**: 2026-02-06

## Prerequisites

- Node.js 22.x
- npm (with `package-lock.json`)
- Git with GitHub remote configured

## Local Development

No changes to local development workflow. The standard commands continue to work:

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:3000
npm run verify       # Run full quality suite (typecheck, lint, format, tests)
npm run build        # Production build to dist/
```

## Demo Build (simulating CI deploy locally)

To test what the CI deploy step produces:

```bash
# Build with demo registry and subdirectory base path
VITE_CLIENT_REGISTRY=demo npx vite build --base /odd-map/

# Preview with subdirectory simulation
npx vite preview --base /odd-map/
```

The demo build includes both `oddessentials` and `usg` clients. Open the preview URL to verify:

- Default loads Odd Essentials
- Append `?client=usg` to switch to USG

## CI Pipeline (GitHub Actions)

The pipeline runs automatically on every push and PR:

1. **verify** job (all branches): CRLF check, `npm run verify`, `npm run build`
2. **deploy** job (main only): Builds with `--base /odd-map/` and demo registry, replaces `/docs`, commits if changed

## GitHub Pages Setup (manual, one-time)

After the first deploy commit lands on `main`:

1. Go to repository Settings > Pages
2. Source: "Deploy from a branch"
3. Branch: `main`, folder: `/docs`
4. Save

The demo site will be available at `https://<org>.github.io/odd-map/`.

## File Changes Summary

| File                         | Change                                                                       |
| ---------------------------- | ---------------------------------------------------------------------------- |
| `.github/workflows/ci.yml`   | Full rewrite: Node 22, CRLF parity, deploy job                               |
| `src/app.ts`                 | Use explicit `defaultClient` from registry                                   |
| `src/components/map-3d.js`   | Fix texture path for subdirectory hosting                                    |
| `src/lib/client-registry.ts` | Add oddessentials to PROD maps, demo registry support, `defaultClient` field |
| `config/clients.prod.json`   | Add oddessentials to production clients                                      |
| `config/clients.demo.json`   | New: demo-specific registry with explicit default                            |
| `vite.config.ts`             | No changes needed (base path via CLI flag)                                   |

## Verification Checklist

- [ ] `npm run verify` passes locally
- [ ] `npm run build` produces working output in `dist/`
- [ ] Demo build (`VITE_CLIENT_REGISTRY=demo npx vite build --base /odd-map/`) works
- [ ] `?client=usg` switches to USG config
- [ ] 3D globe texture loads correctly under subdirectory path
- [ ] GitHub Actions workflow triggers on push to any branch
- [ ] Deploy job only runs on `main`
- [ ] No empty commits when build output unchanged
