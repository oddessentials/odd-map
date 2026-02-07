/**
 * HTML Escape Utility
 *
 * Prevents XSS when interpolating config values into innerHTML templates.
 */

/**
 * Escape a string for safe insertion into HTML content or attributes.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
