# Research: Repository Rename (usg-map to odd-map)

**Feature**: 007-repo-rename
**Date**: 2026-02-06

## Research Task 1: Azure DevOps Repository Mirroring Strategy

### Decision: Git bare clone + mirror push to new Azure DevOps repository

### Rationale

A `git clone --bare` followed by `git push --mirror` is the standard approach for creating an exact copy of a Git repository including all branches, tags, and refs. Azure DevOps supports this natively — the new repository is created empty via the Azure DevOps UI or CLI, then populated with the mirror push.

### Alternatives Considered

| Alternative                               | Rejected Because                                                                                                                         |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Azure DevOps "Fork"                       | Forks maintain a link to the upstream repo and are intended for PR workflows, not permanent renames. Fork names may also be constrained. |
| Azure DevOps "Import"                     | Import is designed for external URLs and may not preserve all refs. Mirror push gives more control.                                      |
| Rename in-place via Azure DevOps settings | Does not create a copy — directly renames the original, which contradicts the user requirement to keep the original intact.              |
| GitHub-style "Transfer"                   | Not applicable — repository is on Azure DevOps, which does not have a transfer feature.                                                  |

### Procedure

1. Create empty "odd-map" repository in Azure DevOps project `oddessentials`
2. Clone existing repo as bare: `git clone --bare https://.../_git/usg-map usg-map.git`
3. Push mirror to new repo: `cd usg-map.git && git push --mirror https://.../_git/odd-map`
4. Verify: clone `odd-map`, confirm branches/tags/history match
5. Clean up bare clone: remove `usg-map.git` temp directory

---

## Research Task 2: Scope of "usg-map" vs "usg" References

### Decision: Only rename repository-identity references; preserve all client-identity references

### Rationale

The codebase contains two distinct categories of "usg" references:

1. **Repository identity** ("usg-map"): Package name, CI base paths, documentation titles, badge URLs, user-agent strings. These identify the codebase itself and must change to "odd-map".

2. **Client identity** ("usg", "usg-map-config.json", "usg-client.json"): USG Insurance Services is a real business client whose configuration data is stored in these files. The filename `usg-map-config.json` means "the map config for the USG client", not "the config for the usg-map repository". Renaming these would break the domain model and require cascading changes to SVG region IDs (`region-usg-*`), client registries, and test fixtures.

### Discriminator Rules

| Pattern                                    | Category            | Action                       |
| ------------------------------------------ | ------------------- | ---------------------------- |
| `"name": "usg-map"` in package.json        | Repository identity | Change to `"odd-map"`        |
| `--base /usg-map/` in CI/CD                | Repository identity | Change to `--base /odd-map/` |
| `# usg-map` in doc titles                  | Repository identity | Change to `# odd-map`        |
| Badge/build URLs containing `usg-map`      | Repository identity | Change to `odd-map`          |
| User-agent strings containing `usg-map`    | Repository identity | Change to `odd-map`          |
| `expect('usg-map')` in test assertion      | Repository identity | Change to `'odd-map'`        |
| `usg-map-config.json` (filename or import) | Client identity     | DO NOT change                |
| `'usg'` (client ID in registries/tests)    | Client identity     | DO NOT change                |
| `region-usg-*` (SVG path IDs)              | Client identity     | DO NOT change                |
| `usg-client.json` (filename or import)     | Client identity     | DO NOT change                |

---

## Research Task 3: package-lock.json Regeneration vs Manual Edit

### Decision: Regenerate via `npm install` after updating `package.json`

### Rationale

Manually editing `package-lock.json` is fragile and can introduce inconsistencies. The standard approach is to update `package.json`, delete `package-lock.json`, and run `npm install` to regenerate it. However, since the only change is the `name` field (not dependencies), a targeted edit of the 2 occurrences in `package-lock.json` is also acceptable and faster.

### Chosen Approach

Edit `package-lock.json` directly (2 occurrences of `"name": "usg-map"` → `"name": "odd-map"`), then run `npm install` to validate the lockfile is consistent. This avoids unnecessary dependency resolution churn while ensuring correctness.

---

## Research Task 4: Spec File Updates (006-github-pages-deploy)

### Decision: Update base path references in spec files from feature 006

### Rationale

The `specs/006-github-pages-deploy/` directory contains plan, research, quickstart, and tasks files that reference `--base /usg-map/` as the GitHub Pages base path. Since this path derives from the repository name (not the client name), these references should be updated to `--base /odd-map/` in the new repository to maintain documentation accuracy.

These are historical planning documents, not executable code, so the risk of breakage is zero. However, leaving stale references would cause confusion for developers reading the deployment documentation.

---

## Research Task 5: Git Remote URL Update for Developers

### Decision: Document remote update command in quickstart guide

### Rationale

Developers with existing local clones of `usg-map` can switch to the new repository without re-cloning by updating their git remote:

```
git remote set-url origin https://oddessentials@dev.azure.com/oddessentials/oddessentials/_git/odd-map
```

This preserves local branches, stashes, and work-in-progress. The quickstart guide will include this command for easy reference.

---

## Complete File Change Manifest

### Files to Update (Repository Identity → "odd-map")

| #   | File                                          | Lines              | Change                                         |
| --- | --------------------------------------------- | ------------------ | ---------------------------------------------- |
| 1   | `package.json`                                | 2                  | `"name": "usg-map"` → `"name": "odd-map"`      |
| 2   | `package-lock.json`                           | 2, 8               | `"name": "usg-map"` → `"name": "odd-map"`      |
| 3   | `.github/workflows/ci.yml`                    | 65                 | `--base /usg-map/` → `--base /odd-map/`        |
| 4   | `README.md`                                   | 3, 57              | Badge URL and project structure directory name |
| 5   | `CLAUDE.md`                                   | 1                  | `# usg-map` → `# odd-map`                      |
| 6   | `scripts/geocode_locations.py`                | 37                 | User-agent URL                                 |
| 7   | `tests/setup.test.ts`                         | 16                 | `'usg-map'` → `'odd-map'`                      |
| 8   | `specs/006-github-pages-deploy/plan.md`       | 98, 100, 101, 105  | Base path references                           |
| 9   | `specs/006-github-pages-deploy/research.md`   | 14, 107            | Base path references                           |
| 10  | `specs/006-github-pages-deploy/quickstart.md` | 29, 32, 45, 56, 74 | Base path references                           |
| 11  | `specs/006-github-pages-deploy/tasks.md`      | 62, 76, 82, 83     | Base path references                           |

### Files Preserved (Client Identity — "usg")

17 files containing `usg-map-config.json`, `usg-client.json`, `'usg'` client ID, or `region-usg-*` SVG references. Full list documented in plan.md.

**Total scope**: 11 files changed, ~30 line edits, 17 files intentionally preserved.
