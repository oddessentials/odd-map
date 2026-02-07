# Contract: Theme Injection

**Module**: `src/lib/theme-injector.ts` (new)

---

## Purpose

Applies brand theme overrides from the client configuration to CSS custom properties at application startup. Satisfies FR-009 (CSS brand token injection) and WLC-009 (Bounded Brand Theming Surface).

## Interface

### applyClientTheme(theme: BrandTheme | undefined): void

Applies theme overrides to the document's CSS custom properties. Called once at application startup after client config is loaded.

**Inputs:**

- `theme` — the optional `theme` object from the client configuration. May be `undefined`.

**Behavior:**

1. If `theme` is `undefined`, do nothing — all CSS tokens retain their base values from `tokens.css`.

2. If `theme.primaryColor` is provided:
   - Set `--color-primary` to the value
   - Compute and set `--color-primary-light` (lighter variant)
   - Compute and set `--color-primary-dark` (darker variant)
   - Compute and set `--color-bg-overlay` (derived from primary with alpha)

3. If `theme.accentColor` is provided:
   - Set `--color-accent` to the value
   - Compute and set `--color-accent-light` (lighter variant)
   - Compute and set `--color-accent-dark` (darker variant)

4. If `theme.regionColors` is provided:
   - For each `regionName → color` entry, set `--color-region-{normalizedRegionId}` to the value
   - Region ID normalization: lowercase, spaces replaced with hyphens (e.g., `"Northeast Region"` → `"northeast-region"`)

**Side Effects:**

- Calls `document.documentElement.style.setProperty()` for each token
- Modifies the live document styles (idempotent — re-calling overwrites)

---

## Color Derivation

Lighter and darker variants are computed from the base color using HSL manipulation:

- **Light variant**: Increase lightness by 15%
- **Dark variant**: Decrease lightness by 15%
- **Overlay**: Primary color at 80% opacity

This computation happens in JavaScript at startup (not at build time), keeping the client config simple (only base colors specified).

---

## Token Surface Area (bounded)

Only these tokens may be overridden. This list is exhaustive:

| CSS Token               | Source                 | Type     |
| ----------------------- | ---------------------- | -------- |
| `--color-primary`       | `theme.primaryColor`   | Direct   |
| `--color-primary-light` | Derived from primary   | Computed |
| `--color-primary-dark`  | Derived from primary   | Computed |
| `--color-accent`        | `theme.accentColor`    | Direct   |
| `--color-accent-light`  | Derived from accent    | Computed |
| `--color-accent-dark`   | Derived from accent    | Computed |
| `--color-bg-overlay`    | Derived from primary   | Computed |
| `--color-region-*`      | `theme.regionColors.*` | Direct   |

No other CSS tokens are configurable per-client.

---

## SVG Color Integration

The SVG map asset (`usa-regions.svg`) must reference CSS custom properties instead of hardcoded hex values:

**Before:**

```css
.region-usg-northeast {
  fill: #1a5276;
}
```

**After:**

```css
.region-usg-northeast {
  fill: var(--color-region-northeast-region, #1a5276);
}
```

Because the SVG is loaded inline via `?raw` import, it shares the parent document's DOM tree and inherits CSS custom properties set on `document.documentElement`.

---

## 3D Color Integration

The 3D globe renderer (`map-3d.js`) does NOT use CSS for region colors — it uses Three.js hex integers. Region colors for 3D are read from the client config's `theme.regionColors` at Map3D initialization time and converted to Three.js color format:

```
CSS hex "#1a5276" → Three.js 0x1a5276
```

Default region colors (used when config omits overrides) are defined as constants in a shared defaults module.

---

## Test Contract

1. Calling `applyClientTheme(undefined)` does not modify any CSS properties
2. Calling `applyClientTheme({ primaryColor: '#ff0000' })` sets `--color-primary` to `#ff0000` and computes light/dark variants
3. Calling `applyClientTheme({ regionColors: { 'Northeast Region': '#aabbcc' } })` sets `--color-region-northeast-region` to `#aabbcc`
4. Tokens not listed in the bounded surface area are never modified
