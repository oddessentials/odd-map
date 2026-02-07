# Quickstart: Repository Rename (usg-map to odd-map)

**Feature**: 007-repo-rename
**Date**: 2026-02-06

## Prerequisites

- Azure DevOps access to the `oddessentials` project with repository creation permissions
- Git CLI installed
- Node.js and npm installed (for build/test validation)

## Step-by-Step Guide

### Phase 1: Create the New Repository (Azure DevOps)

1. **Create empty repository** in Azure DevOps:
   - Navigate to `oddessentials` project → Repos
   - Click "New repository"
   - Name: `odd-map`
   - Leave it empty (no README, no .gitignore)

2. **Mirror the existing repository**:

   ```bash
   # Clone bare (all branches, tags, refs)
   git clone --bare https://oddessentials@dev.azure.com/oddessentials/oddessentials/_git/usg-map usg-map.git

   # Push everything to the new repo
   cd usg-map.git
   git push --mirror https://oddessentials@dev.azure.com/oddessentials/oddessentials/_git/odd-map

   # Clean up
   cd ..
   rm -rf usg-map.git
   ```

3. **Verify the mirror**:

   ```bash
   git clone https://oddessentials@dev.azure.com/oddessentials/oddessentials/_git/odd-map
   cd odd-map
   git log --oneline -5          # Should match original history
   git branch -a                 # Should show all branches
   git tag                       # Should show all tags
   ```

### Phase 2: Update Repository-Identity References

After cloning the new `odd-map` repository, update these files:

| #    | File                                 | What to change                                         |
| ---- | ------------------------------------ | ------------------------------------------------------ |
| 1    | `package.json`                       | `"name": "usg-map"` → `"name": "odd-map"`              |
| 2    | `package-lock.json`                  | `"name": "usg-map"` → `"name": "odd-map"` (2 places)   |
| 3    | `.github/workflows/ci.yml`           | `--base /usg-map/` → `--base /odd-map/`                |
| 4    | `README.md`                          | Badge URL: `usg-map?branchName` → `odd-map?branchName` |
| 5    | `README.md`                          | Structure diagram: `usg-map/` → `odd-map/`             |
| 6    | `CLAUDE.md`                          | `# usg-map` → `# odd-map`                              |
| 7    | `scripts/geocode_locations.py`       | User-agent: `usg-map` → `odd-map`                      |
| 8    | `tests/setup.test.ts`                | `'usg-map'` → `'odd-map'`                              |
| 9-11 | `specs/006-github-pages-deploy/*.md` | `usg-map` → `odd-map` in base path references          |

### Phase 3: Validate

```bash
# Install dependencies
npm install

# Run full test suite
npm test

# Run build
npm run build

# Verify no stale repository-identity references
# (Client-identity references like usg-map-config.json are expected and correct)
grep -r "usg-map" --include="*.json" --include="*.yml" --include="*.md" --include="*.py" --include="*.ts" . \
  | grep -v node_modules \
  | grep -v "usg-map-config" \
  | grep -v "usg-client" \
  | grep -v "specs/007-repo-rename"
# Expected: no results (all repo-identity references updated)
```

### Phase 4: For Existing Developers

Developers with existing local clones can switch without re-cloning:

```bash
# Update remote URL
git remote set-url origin https://oddessentials@dev.azure.com/oddessentials/oddessentials/_git/odd-map

# Verify
git remote -v

# Pull latest
git pull
```

### Phase 5: Archive Original (After Team Transition)

Once all team members have confirmed they are using `odd-map`:

1. In Azure DevOps, navigate to `usg-map` → Settings → General
2. Set repository to "Disabled" or delete (after confirming no open PRs)

## What NOT to Change

The following references to "usg" are **business-domain data** (USG Insurance client) and must remain unchanged:

- `config/usg-map-config.json` (filename and contents)
- `config/usg-client.json` (filename and contents)
- `"usg"` client ID entries in `clients.*.json`
- `region-usg-*` SVG path IDs
- All source/script/test imports of these client config files
