# Feature Specification: Repository Rename (usg-map to odd-map)

**Feature Branch**: `007-repo-rename`
**Created**: 2026-02-06
**Status**: Draft
**Input**: User description: "We must rename the code repository to odd-map instead of usg-map. It might be best to make a copy rather than directly manipulate the existing repo."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Create a Copy of the Repository Under the New Name (Priority: P1)

A developer needs to create a new repository called "odd-map" that is an exact copy of the current "usg-map" repository, preserving all commit history, branches, and tags. The original "usg-map" repository remains intact and untouched as a safety net during the transition period.

**Why this priority**: This is the foundational step. Without a safe copy, all subsequent renaming work carries risk of data loss. The user explicitly requested making a copy rather than directly manipulating the existing repo.

**Independent Test**: Can be verified by cloning the new "odd-map" repository and confirming it contains identical commit history, branches, and tags as the original "usg-map" repository.

**Acceptance Scenarios**:

1. **Given** the existing "usg-map" repository on Azure DevOps, **When** a developer creates the new "odd-map" repository, **Then** the new repository contains identical commit history, branches, and tags.
2. **Given** the new "odd-map" repository exists, **When** a developer inspects the original "usg-map" repository, **Then** it remains completely unmodified.
3. **Given** the new "odd-map" repository exists, **When** a developer clones it, **Then** all files, directories, and git metadata are intact and functional.

---

### User Story 2 - Update All Internal References from usg-map to odd-map (Priority: P1)

A developer working in the new "odd-map" repository needs all internal references updated so that the project correctly identifies itself as "odd-map". This includes the package name, build configurations, documentation, CI/CD pipelines, and any hardcoded path references.

**Why this priority**: Equal priority to P1 because the copied repository is not usable until internal references are corrected. Broken references would cause build failures and confusion.

**Independent Test**: Can be verified by running the full build and test suite in the new repository after all references are updated. All builds pass and no references to "usg-map" remain as the repository's own identity.

**Acceptance Scenarios**:

1. **Given** the copied "odd-map" repository, **When** a developer runs the build process, **Then** the build completes successfully with no errors related to naming.
2. **Given** the copied "odd-map" repository, **When** a developer searches for "usg-map" in package metadata, CI/CD configuration, documentation, and path references, **Then** all repository-identity references reflect "odd-map".
3. **Given** the copied "odd-map" repository, **When** a developer runs the full test suite, **Then** all tests pass.
4. **Given** the CI/CD pipeline in the new repository, **When** a build is triggered, **Then** deployment targets the correct paths using "odd-map" as the base path.

---

### User Story 3 - Preserve Client Configuration Identity (Priority: P2)

The "usg" client identity (client ID, client configuration files, SVG region mappings) is a business-domain concept separate from the repository name. A developer needs the "usg" client to continue working correctly after the rename — the client data and configuration should remain functional since it represents a real insurance client (USG Insurance Services) whose data the map displays.

**Why this priority**: Client configurations are business data, not repository metadata. Renaming them would break the domain model and require changes to external SVG assets. The rename scope should be limited to repository identity, not business entities.

**Independent Test**: Can be verified by loading the "usg" client in the renamed repository and confirming all map features, office locations, and region highlights display correctly.

**Acceptance Scenarios**:

1. **Given** the renamed repository, **When** a user loads the map with the "usg" client, **Then** all office locations and region highlights display correctly.
2. **Given** the renamed repository, **When** a developer adds a new client configuration, **Then** the existing "usg" client configuration is unaffected.

---

### User Story 4 - Redirect or Deprecate the Original Repository (Priority: P3)

After the new "odd-map" repository is validated and all team members have switched to it, an administrator needs to mark the original "usg-map" repository as deprecated or archived so that no new work is accidentally committed there.

**Why this priority**: This is a cleanup step that can happen after the team has fully transitioned. It prevents confusion but is not blocking for development work.

**Independent Test**: Can be verified by confirming the original repository is marked as read-only or archived and that team members' local clones point to the new remote.

**Acceptance Scenarios**:

1. **Given** the team has fully transitioned to "odd-map", **When** an administrator archives the original repository, **Then** no new commits can be pushed to "usg-map".
2. **Given** a developer with an old local clone of "usg-map", **When** they update their git remote, **Then** they can push and pull from the new "odd-map" repository without re-cloning.

---

### Edge Cases

- What happens if there are open pull requests in the original "usg-map" repository at the time of the copy? They should be documented and re-created in the new repository if still active.
- What happens if a developer accidentally pushes to the old "usg-map" repository after the transition? The old repository should be archived/locked to prevent this.
- What happens if CI/CD pipelines reference the old repository URL? All pipeline configurations must be updated to point to the new "odd-map" repository.
- What happens if external services or webhooks reference "usg-map"? An inventory of external integrations should be checked and updated.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The new repository MUST be an exact mirror of the original, preserving all commit history, branches, and tags.
- **FR-002**: The package identity (name field in package manifest) MUST be updated from "usg-map" to "odd-map".
- **FR-003**: All CI/CD pipeline configurations MUST be updated to reference "odd-map" in build paths and base URLs.
- **FR-004**: All project documentation (README, developer guidelines) MUST be updated to reflect the new repository name "odd-map".
- **FR-005**: The "usg" client identifier and all client-specific configuration files MUST remain unchanged — these represent business-domain data, not repository identity.
- **FR-006**: All existing tests MUST pass after the rename without modification to test assertions related to client identity ("usg" client).
- **FR-007**: Test assertions that reference the repository name ("usg-map") MUST be updated to "odd-map".
- **FR-008**: Build scripts and utility scripts that reference "usg-map" in file paths or configuration paths MUST be updated where those paths represent the repository identity (not the client identity).
- **FR-009**: The original "usg-map" repository MUST remain intact and unmodified until the team confirms the transition is complete.
- **FR-010**: Git remote URLs in developer documentation and onboarding guides MUST reference the new "odd-map" repository.

### Key Entities

- **Repository Identity**: The project name, package name, base URL paths, CI/CD references, and documentation that identify this codebase as a unit. All instances change from "usg-map" to "odd-map".
- **Client Identity**: The "usg" client ID, client configuration files (`usg-client.json`, `usg-map-config.json`), SVG region IDs (`region-usg-*`), and client registry entries. These are business-domain data representing USG Insurance Services and do NOT change.

## Assumptions

- The repository is hosted on Azure DevOps at `https://dev.azure.com/oddessentials/oddessentials/_git/usg-map` and the new repository will be created in the same Azure DevOps project.
- The team uses a branching workflow where `main` is the primary branch. All branches and tags should be mirrored.
- Client configuration files (`usg-client.json`, `usg-map-config.json`) and their filenames are intentionally preserved because they represent the USG Insurance client — a business entity, not a repository naming artifact.
- SVG region IDs (`region-usg-*`) are embedded in shared SVG assets and are not renamed as part of this effort.
- The `--base /usg-map/` path in CI/CD (used for GitHub Pages hosting) will change to `--base /odd-map/` since it derives from the repository name, not the client name.
- Python scripts with user-agent strings referencing "usg-map" will be updated to "odd-map".
- No external consumers depend on the npm package name "usg-map" (the package is not published to a registry).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: The new "odd-map" repository contains 100% of the commit history, branches, and tags from the original.
- **SC-002**: The full build process completes successfully in the new repository on the first attempt after all reference updates.
- **SC-003**: 100% of existing tests pass in the new repository without changes to business-logic or client-identity assertions.
- **SC-004**: A search for "usg-map" across all repository-identity contexts (package name, base paths, documentation titles, CI/CD paths, user-agent strings) returns zero results.
- **SC-005**: The original "usg-map" repository remains unmodified and accessible as a fallback throughout the transition period.
- **SC-006**: All team members can clone, build, and run the new "odd-map" repository within their first attempt.
