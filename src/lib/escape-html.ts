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

/**
 * Sanitize a URL for safe use in href attributes.
 * Allows only http:, https:, mailto:, and tel: protocols.
 * Returns empty string for invalid or dangerous URLs (e.g., javascript:).
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url, 'https://placeholder.invalid');
    const protocol = parsed.protocol.toLowerCase();
    if (
      protocol === 'https:' ||
      protocol === 'http:' ||
      protocol === 'mailto:' ||
      protocol === 'tel:'
    ) {
      return escapeHtml(url);
    }
    return '';
  } catch {
    return '';
  }
}
