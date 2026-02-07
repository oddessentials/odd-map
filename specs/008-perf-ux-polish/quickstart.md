# Quickstart: 008-perf-ux-polish

## Prerequisites

- Node.js 22+
- npm

## Setup

```bash
git checkout 008-perf-ux-polish
npm ci
```

## Development

```bash
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run dev -- --host  # Expose to network (for mobile testing)
```

## Testing

```bash
npm test             # Run Vitest in watch mode
npm run lint         # ESLint check
npm run typecheck    # TypeScript type check
npm run verify       # Full verification (lint + format + typecheck + tests)
```

## Mobile Testing

1. Start dev server with `--host` flag to expose on local network
2. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. On iPhone Pro, navigate to `http://<your-ip>:5173`
4. Or use Chrome DevTools device emulator (iPhone 14 Pro preset, 430x932)

## Key Files to Edit

| File                                     | What to Change                                           |
| ---------------------------------------- | -------------------------------------------------------- |
| `src/styles/app.css:875`                 | Replace `transition: all` with explicit property list    |
| `src/styles/app.css:748-792`             | Rewrite `@media (max-width: 768px)` mobile layout        |
| `src/components/map-svg.ts:192,372`      | Remove inline `style.opacity` assignments                |
| `src/components/map-svg.ts` (addMarkers) | Add transparent `<circle>` hit area to each marker group |
| `src/app.ts:176`                         | Change `onClose` callback to `handlePanelClose()`        |
| `src/app.ts` (new method)                | Add `handlePanelClose()` method                          |

## Verification Checklist

- [ ] `npm run verify` passes
- [ ] 2D markers display at full opacity in USA overview (no translucency)
- [ ] Selecting a region dims out-of-region markers instantly (no fade animation)
- [ ] Hover fill/shadow effects still animate smoothly (not instant)
- [ ] Details panel close button navigates back one level (not full reset)
- [ ] Escape key behavior matches close button behavior
- [ ] Mobile layout works on iPhone Pro (430x932 viewport)
- [ ] Region chips all visible on mobile without scrolling past the map
- [ ] Markers are tappable on mobile at region zoom level
- [ ] Bottom sheet panel is scrollable and not covering entire map
- [ ] All hover/selection effects look identical on desktop
- [ ] 3D globe unchanged — auto-rotation, markers, modal all work as before
- [ ] Map mode toggle completes within 2 seconds
