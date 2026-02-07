# Research: GitHub Actions Parity & Pages Deployment

**Feature Branch**: `006-github-pages-deploy`
**Date**: 2026-02-06

## R1: Vite Base Path for GitHub Pages Subdirectory Hosting

**Decision**: Use `vite build --base /<repo>/` CLI flag at build time.

**Rationale**: Vite's `base` option rewrites all asset references (JS, CSS, images in HTML) to use the specified prefix. Using the CLI flag (`--base`) keeps `vite.config.ts` clean and allows different base paths for different deployment targets without code changes.

**Alternatives considered**:

- Hardcode `base: '/odd-map/'` in `vite.config.ts` — rejected because it breaks local dev (`vite` serves from `/`).
- Use env var in `vite.config.ts` (`base: process.env.VITE_BASE_PATH || '/'`) — viable but unnecessary complexity when the CLI flag achieves the same result.

**Key finding**: `import.meta.env.BASE_URL` is automatically set by Vite to the value of the `base` config. This means any runtime code that constructs URLs from static assets in `public/` should use `import.meta.env.BASE_URL + 'path/to/asset'` to work correctly under subdirectory hosting.

**Action required**: `map-3d.js:300` hardcodes `'/textures/earth-day.jpg'` — must change to `` `${import.meta.env.BASE_URL}textures/earth-day.jpg` ``.

## R2: GitHub Pages `/docs` Directory Deployment

**Decision**: CI builds to `dist/`, then replaces `docs/` contents, commits, and pushes.

**Rationale**: GitHub Pages can serve from the `/docs` folder on the main branch. This requires the built output to be committed to the repository — not deployed via a separate artifact mechanism.

**Alternatives considered**:

- GitHub Pages `gh-pages` branch deployment — rejected because the spec explicitly requires `/docs` directory on `main`.
- GitHub Actions `actions/deploy-pages` — deploys via artifact upload, not `/docs` directory. Rejected per spec.

**Key findings**:

- `docs/` must NOT be in `.gitignore` (currently it isn't — `.gitignore` only ignores `dist/`).
- The deploy job must run after the verify job succeeds.
- The deploy job must use `git diff` to detect actual changes before committing (FR-011).
- Full replacement means `rm -rf docs/*` before copying new build output (FR-006).

## R3: Demo Registry and Default Client

**Decision**: Create `config/clients.demo.json` with explicit `defaultClient` field.

**Rationale**: The production registry only contains `usg`. The demo needs both `oddessentials` and `usg`. A dedicated demo registry avoids polluting the production build while supporting the explicit default client requirement (FR-009).

**Alternatives considered**:

- Add oddessentials to `clients.prod.json` — rejected because it ships test client config in all production builds.
- Use environment variable to override default client — adds complexity without benefit since the demo build is a controlled CI environment.

**Key findings**:

- `clients.test.json` already lists `["oddessentials", "usg", "acme", "demo"]` — proves oddessentials config files exist and work.
- `config/oddessentials-client.json` and `config/oddessentials-map-config.json` already exist.
- The `ClientRegistry` interface in `client-registry.ts` needs a `defaultClient?: string` field.
- `app.ts:128` needs to read `registry.defaultClient` when present, falling back to `[0]`.
- `getClientRegistry()` needs a third branch for the demo environment.

## R4: GitHub Actions CI Parity with Azure Pipelines

**Decision**: Rewrite `.github/workflows/ci.yml` to match Azure Pipelines CI stage commands and behavior.

**Rationale**: The current GitHub Actions workflow is outdated (Node 20, incomplete CRLF check, missing extensions). Must match Azure Pipelines parity.

**Gaps identified**:

| Aspect                 | Azure Pipelines                                    | Current GitHub Actions                 | Action                                |
| ---------------------- | -------------------------------------------------- | -------------------------------------- | ------------------------------------- |
| Node version           | 22.x                                               | 20                                     | Update to 22.x                        |
| CRLF extensions        | `.sh,.ts,.tsx,.js,.jsx,.mjs,.cjs,.json,.yml,.yaml` | `.sh,.ts,.js,.mjs`                     | Add missing extensions                |
| CRLF detection pattern | `grep -E 'w/crlf' \| grep -E '\.(sh\|ts\|...)$'`   | `grep -E 'w/crlf.*(\.sh\|\.ts\|...)$'` | Align pattern                         |
| Checkout depth         | `fetchDepth: 0`                                    | Default (shallow)                      | Add `fetch-depth: 0`                  |
| npm caching            | `Cache@2` with `$(Pipeline.Workspace)/.npm`        | `setup-node` cache: npm                | Already handled by setup-node         |
| Verify command         | `npm run verify`                                   | `npm run verify`                       | Already aligned                       |
| Build verification     | `npm run build`                                    | `npm run build`                        | Already aligned                       |
| AI Review stage        | Ollama sidecar + ADO API                           | N/A                                    | Excluded from scope (spec assumption) |

## R5: Deploy Job — Avoiding Empty Commits

**Decision**: Use `git diff --quiet docs/` to detect changes before committing.

**Rationale**: `git diff --quiet` exits with code 1 if there are differences, 0 if none. This provides a clean conditional: skip commit when exit code is 0.

**Implementation pattern**:

```yaml
- name: Check for changes
  id: check
  run: |
    git add docs/
    if git diff --cached --quiet docs/; then
      echo "changed=false" >> $GITHUB_OUTPUT
    else
      echo "changed=true" >> $GITHUB_OUTPUT
    fi

- name: Commit and push
  if: steps.check.outputs.changed == 'true'
  run: |
    git commit -m "chore: deploy demo site to /docs"
    git push
```

## R6: Texture Path and `import.meta.env.BASE_URL`

**Decision**: Replace hardcoded `/textures/earth-day.jpg` with `import.meta.env.BASE_URL + 'textures/earth-day.jpg'`.

**Rationale**: `import.meta.env.BASE_URL` is a Vite built-in that resolves to `'/'` in dev and to the configured `base` value (e.g., `'/odd-map/'`) in production builds. This handles both local development and subdirectory deployment automatically.

**Key finding**: `import.meta.env.BASE_URL` always ends with a trailing slash, so the asset path should NOT start with `/`. Use `textures/earth-day.jpg` (not `/textures/earth-day.jpg`).

## R7: Client Registry Environment Detection

**Decision**: Use `import.meta.env.VITE_CLIENT_REGISTRY` environment variable to select registry file.

**Rationale**: The existing `import.meta.env.PROD` check distinguishes dev vs prod. We need a third option for the demo build. An explicit env var is clearer than overloading the PROD flag.

**Implementation**:

- `VITE_CLIENT_REGISTRY=demo` → load `clients.demo.json`
- `VITE_CLIENT_REGISTRY` unset + `PROD` → load `clients.prod.json`
- `VITE_CLIENT_REGISTRY` unset + not PROD → load `clients.test.json`

The env var only needs to be set in the CI deploy step.
