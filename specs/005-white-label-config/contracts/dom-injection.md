# Contract: DOM Injection

**Module**: `src/lib/dom-injector.ts` (new)

---

## Purpose

Injects client-specific text and branding into the HTML document at application startup. Replaces all hardcoded USG strings in `index.html` and component placeholder text with values from the active client configuration.

Satisfies FR-003 (all UI text from config) and WLC-005 (Absolute Client String Isolation).

## Interface

### injectClientBranding(config: ClientConfig): void

Populates all branding injection targets in the DOM with values from the client configuration.

**Inputs:**

- `config` — the validated `ClientConfig` object

**Behavior:**

| DOM Target                 | Config Source                                         | Fallback           |
| -------------------------- | ----------------------------------------------------- | ------------------ |
| `document.title`           | `config.name + " - Locations Map"`                    | — (required field) |
| `meta[name="description"]` | `"Interactive locations map for " + config.name`      | —                  |
| `#loading-logo`            | `config.name`                                         | —                  |
| `#header-logo`             | `config.name`                                         | —                  |
| `#header-tagline`          | `config.tagline`                                      | Element hidden     |
| `#footer-phone`            | `config.globalContacts?.mainPhone`                    | Element hidden     |
| `#footer-email`            | `config.globalContacts?.mainEmail`                    | Element hidden     |
| `#footer-claims`           | `config.globalContacts?.departmentEmails?.claims`     | Element hidden     |
| `#footer-lossruns`         | `config.globalContacts?.departmentEmails?.lossRuns`   | Element hidden     |
| `#footer-accounting`       | `config.globalContacts?.departmentEmails?.accounting` | Element hidden     |
| `#accounting-contact`      | `config.globalContacts?.accountingContact`            | Element hidden     |
| `#copyright`               | `config.copyrightHolder`                              | — (required field) |

**Optional field behavior:**

- When a field is missing, the corresponding DOM element is hidden (`display: none` or `hidden` attribute)
- Contact section header ("Contact information not available") is shown when entire `globalContacts` is absent

**Side Effects:**

- Modifies `textContent` and visibility of identified DOM elements
- Called once at startup, before the loading screen fades out

---

## Component Placeholder Text

Some client-specific strings live in component code, not in `index.html`. These are extracted via config:

| Component                 | Current String                                      | Config-Driven Replacement                                     |
| ------------------------- | --------------------------------------------------- | ------------------------------------------------------------- |
| `DetailsPanel`            | "Click on a region to explore USG offices."         | `"Click on a region to explore " + config.name + " offices."` |
| `DetailsPanel`            | "USG" logo placeholder                              | `config.name`                                                 |
| `SpecialtyDivisionsPanel` | "Our specialty divisions serve clients nationwide." | Generic: "Specialty divisions" (no client name needed)        |

Components receive the active config (or relevant fields) at construction time or via a shared accessor.

---

## HTML Template Changes

`src/index.html` is modified to:

1. Remove all USG-specific text content
2. Add `id` attributes to injection target elements
3. Use generic placeholder text (e.g., "Loading..." instead of "USG Insurance")

The HTML becomes a generic shell that works for any client once populated.

---

## SVG Accessibility Updates

The SVG asset `src/assets/usa-regions.svg` must also be genericized:

| Current                                    | Generic Replacement            |
| ------------------------------------------ | ------------------------------ |
| `aria-label="USG Insurance Locations Map"` | `aria-label="Locations Map"`   |
| `<title>USG Insurance Regions</title>`     | `<title>Locations Map</title>` |

These are static changes to the SVG file, not runtime injection.

---

## Test Contract

1. After `injectClientBranding(oddEssentialsConfig)`, `document.title` contains "Odd Essentials"
2. After injection, a DOM search for "USG" returns zero matches
3. When `globalContacts` is omitted from config, footer contact elements are hidden
4. When `tagline` is omitted from config, the tagline element is hidden
