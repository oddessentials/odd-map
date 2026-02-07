# Feature Specification: GitHub Actions Parity & Pages Deployment

**Feature Branch**: `006-github-pages-deploy`
**Created**: 2026-02-06
**Status**: Draft
**Input**: User description: "Our GitHub actions are outdated. Update our GitHub actions to match parity with current azure-pipelines.yml because we will be moving this repo back to GitHub. Setup an automated, deterministic pipeline so that when we push changes, we copy a version of the built project to /docs. This must work so we can point GitHub Pages automatic deployment to it (I'll do manually in GitHub settings). The demo must default to the Odd Essentials config, but if the user enters the querystring client=usg the demo must update accordingly. Commit changes often and ensure quality checks pass. Handle changes with enterprise-grade best practices."

## Clarifications

### Session 2026-02-06

- Q: How should `/docs` be updated on deploy? → A: Full replacement — delete previous contents and write fresh build output. No stale files may accumulate.
- Q: What does "deterministic build" mean for deploy commits? → A: No unnecessary deploy commits when nothing functionally changed. Goal is to avoid churn and empty commits, not strict byte-for-byte reproducibility.
- Q: How broad is the subdirectory hosting requirement? → A: All links, scripts, and runtime behavior must work when served from `/<repo>/` on GitHub Pages — not just asset paths.
- Q: How is the default client determined? → A: An explicit default client value (`oddessentials`) must be specified. Do not rely on registry array order, which could change and accidentally alter the demo.
- Q: What does "CI parity" mean relative to Azure Pipelines? → A: Running the same verification commands and enforcing the same checks and failure behavior. Structural mirroring of the YAML is not required.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Automated Demo Deployment on Push (Priority: P1)

When a developer pushes code to the main branch, the CI pipeline automatically builds the application and deploys it by fully replacing the `/docs` directory with fresh build output. GitHub Pages serves this directory as a live demo site, always reflecting the latest main branch code with no stale files from previous builds.

**Why this priority**: This is the core deliverable — without automated deployment to `/docs`, there is no live demo and no GitHub Pages site.

**Independent Test**: Push a change to `main` and verify the `/docs` directory is updated with a fresh build that loads correctly in a browser.

**Acceptance Scenarios**:

1. **Given** a developer pushes a commit to `main`, **When** the CI pipeline runs, **Then** the `/docs` directory is fully replaced with a complete, working build of the application (no stale files from previous builds remain).
2. **Given** the `/docs` directory has been updated by CI, **When** a user navigates to the GitHub Pages URL, **Then** the application loads and renders the interactive map with the Odd Essentials client configuration (the explicit default).
3. **Given** the demo is loaded with default config, **When** a user adds `?client=usg` to the URL, **Then** the application reloads with USG branding, theme, and office data.
4. **Given** a developer pushes to a non-main branch, **When** the CI pipeline runs, **Then** the `/docs` directory is NOT updated (only main deploys).

---

### User Story 2 - GitHub Actions CI at Azure Pipelines Parity (Priority: P1)

The GitHub Actions CI workflow enforces the same quality checks and failure behavior as the current Azure Pipelines configuration: Node 22.x, CRLF detection (full file extension list), dependency caching, full verification (lint, format check, typecheck, tests), and build verification. Structural mirroring of the Azure Pipelines YAML is not required — only the same commands and same pass/fail behavior.

**Why this priority**: Without CI parity, moving to GitHub means losing quality enforcement. This is equally critical as the deployment story.

**Independent Test**: Create a PR with a deliberate lint violation and verify the GitHub Actions workflow fails. Then fix it and verify the workflow passes.

**Acceptance Scenarios**:

1. **Given** the GitHub Actions workflow is configured, **When** a push occurs to any branch, **Then** the CI pipeline runs all quality checks (lint, format, typecheck, tests, build).
2. **Given** a source file has CRLF line endings, **When** the CI pipeline runs, **Then** the CRLF detection step fails with a clear error message listing the offending files.
3. **Given** a PR targets `main`, **When** the CI pipeline runs, **Then** all the same quality checks pass before merge is allowed.
4. **Given** the pipeline runs, **When** Node.js is set up, **Then** it uses version 22.x (matching Azure Pipelines).
5. **Given** the pipeline runs, **When** dependencies are installed, **Then** npm packages are cached between runs to reduce build time.

---

### User Story 3 - Multi-Client Demo via Query String (Priority: P2)

The deployed demo site supports switching between client configurations using a URL query parameter. The default experience shows Odd Essentials (determined by an explicit default value, not registry order). Entering `?client=usg` switches to USG. All links, scripts, and runtime behavior work correctly when served from a GitHub Pages subdirectory path (`/<repo>/`).

**Why this priority**: The default-client behavior already exists in the app code. This story ensures the build output preserves that capability and all paths work correctly under the GitHub Pages subdirectory.

**Independent Test**: Open the deployed GitHub Pages URL — verify Odd Essentials loads. Append `?client=usg` — verify USG loads.

**Acceptance Scenarios**:

1. **Given** a user visits the demo site with no query parameters, **When** the page loads, **Then** the Odd Essentials configuration is displayed (branding, offices, theme).
2. **Given** a user visits the demo site with `?client=usg`, **When** the page loads, **Then** the USG configuration is displayed.
3. **Given** a user visits the demo site with `?client=invalid`, **When** the page loads, **Then** a clear error message is shown (existing behavior preserved).
4. **Given** the site is served from `/<repo>/` subdirectory, **When** any page or feature is used, **Then** all links, scripts, assets, and runtime behavior work correctly (no broken paths).

---

### Edge Cases

- What happens when the build fails during the deploy step? The `/docs` directory must NOT be partially updated — either the full new build is committed or no change is made.
- What happens when the `/docs` directory doesn't exist yet? The pipeline must create it on first run.
- What happens when the build output is functionally identical to the current `/docs` content? No deploy commit should be created — avoid churn.
- What happens when the site is served from a subdirectory path? All links, script imports, asset references, and runtime behavior (including dynamic fetches) must resolve correctly under `/<repo>/`.
- What happens when the CRLF check runs on Windows-authored files? The check must detect working-tree CRLF regardless of git's autocrlf setting.
- What happens when the client registry order changes? The default client must remain Odd Essentials because it is specified by an explicit value, not array position.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The GitHub Actions CI workflow MUST run on every push to any branch and on pull requests targeting `main`.
- **FR-002**: The CI workflow MUST use Node.js 22.x with npm dependency caching.
- **FR-003**: The CI workflow MUST check for CRLF line endings in `.sh`, `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.cjs`, `.json`, `.yml`, and `.yaml` files (matching Azure Pipelines).
- **FR-004**: The CI workflow MUST run the same verification commands as Azure Pipelines: typecheck, lint, format check, and test (via `npm run verify`). Structural mirroring of the YAML is not required.
- **FR-005**: The CI workflow MUST run a production build (via `npm run build`) as a verification step.
- **FR-006**: On pushes to `main` only, the CI workflow MUST build the project and fully replace the `/docs` directory with fresh build output, removing all previous contents before writing the new build. The result is then committed and pushed.
- **FR-007**: The build output in `/docs` MUST work when served from a subdirectory path (`/<repo>/`). All links, scripts, assets, and runtime behavior (including dynamic fetches) must resolve correctly — not just static asset paths.
- **FR-008**: The `/docs` directory MUST NOT be listed in `.gitignore` — it must be committed to the repository for GitHub Pages to serve it.
- **FR-009**: The default client for the deployed demo MUST be `oddessentials`, specified by an explicit value — not determined by registry array order.
- **FR-010**: The deployed demo MUST support switching clients via the `?client=` query parameter (existing application behavior preserved through the build).
- **FR-011**: The deploy step MUST NOT create commits when the build output is functionally unchanged — no unnecessary churn or empty commits.
- **FR-012**: The deploy step MUST NOT partially update `/docs` on build failure — the commit only occurs after a successful, complete build.

### Key Entities

- **CI Workflow**: The GitHub Actions configuration file that orchestrates quality checks and deployment.
- **Build Output (`/docs`)**: The directory containing the production-ready static site served by GitHub Pages. Fully replaced on each successful deploy.
- **Client Registry**: The configuration that determines which clients are available. The default client is explicitly `oddessentials`, independent of array order.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Every push to any branch triggers the CI pipeline and completes all quality checks within 3 minutes.
- **SC-002**: Every push to `main` that passes CI results in an updated `/docs` directory with a working demo site within 5 minutes.
- **SC-003**: The GitHub Pages demo loads successfully with Odd Essentials as the default (explicit, not order-dependent) and allows switching to USG via `?client=usg`.
- **SC-004**: The GitHub Actions workflow enforces the same verification commands and failure behavior as the current Azure Pipelines configuration — no regressions in coverage.
- **SC-005**: The deploy step avoids unnecessary commits when the build output is functionally unchanged from the current `/docs` contents.

## Assumptions

- The GitHub Pages deployment will be configured manually in GitHub repository settings to serve from the `/docs` directory on the `main` branch. The pipeline only needs to populate `/docs`.
- The current Vite build produces a static site (HTML, JS, CSS, assets) that can be served from any static file host.
- The existing `?client=` query parameter routing is handled by the application at runtime and requires no server-side configuration.
- The Azure Pipelines AI Review stage is NOT ported to GitHub Actions — it depends on a custom self-hosted Ollama sidecar and Azure DevOps APIs. Only the CI quality stage is ported.
