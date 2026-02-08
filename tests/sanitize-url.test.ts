/**
 * Unit Tests - URL Sanitization (XSS Prevention)
 *
 * Tests sanitizeUrl() which prevents javascript: and other dangerous protocols
 * in href attributes rendered via innerHTML templates.
 */

import { describe, it, expect } from 'vitest';
import { sanitizeUrl, escapeHtml } from '../src/lib/escape-html';

describe('sanitizeUrl', () => {
  describe('allows safe protocols', () => {
    it('allows https URLs', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
    });

    it('allows http URLs', () => {
      expect(sanitizeUrl('http://example.com')).toBe('http://example.com');
    });

    it('allows mailto URLs', () => {
      expect(sanitizeUrl('mailto:user@example.com')).toBe('mailto:user@example.com');
    });

    it('allows tel URLs', () => {
      expect(sanitizeUrl('tel:+15551234567')).toBe('tel:+15551234567');
    });

    it('allows Google Maps directions URL', () => {
      const url = 'https://www.google.com/maps/dir/?api=1&destination=40.26,-80.16';
      expect(sanitizeUrl(url)).toBe(escapeHtml(url));
    });

    it('allows URL with encoded characters', () => {
      const url = 'https://www.google.com/maps/search/?api=1&query=123%20Main%20St';
      expect(sanitizeUrl(url)).toBe(escapeHtml(url));
    });
  });

  describe('blocks dangerous protocols', () => {
    it('blocks javascript: URLs', () => {
      expect(sanitizeUrl('javascript:alert(1)')).toBe('');
    });

    it('blocks javascript: with mixed case', () => {
      expect(sanitizeUrl('JavaScript:alert(1)')).toBe('');
    });

    it('blocks data: URLs', () => {
      expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('');
    });

    it('blocks vbscript: URLs', () => {
      expect(sanitizeUrl('vbscript:MsgBox("xss")')).toBe('');
    });

    it('blocks blob: URLs', () => {
      expect(sanitizeUrl('blob:http://example.com/file')).toBe('');
    });
  });

  describe('escapes HTML entities in output', () => {
    it('escapes angle brackets in URL', () => {
      const url = 'https://example.com/?q=<script>';
      const result = sanitizeUrl(url);
      expect(result).not.toContain('<');
      expect(result).toContain('&lt;');
    });

    it('escapes double quotes in URL', () => {
      const url = 'https://example.com/?q="test"';
      const result = sanitizeUrl(url);
      expect(result).not.toContain('"');
      expect(result).toContain('&quot;');
    });
  });

  describe('edge cases', () => {
    it('returns empty string for malformed URLs that parse as dangerous', () => {
      expect(sanitizeUrl('javascript:void(0)')).toBe('');
    });

    it('handles relative-like paths by treating them as https', () => {
      // Relative URLs resolve against the placeholder base
      const result = sanitizeUrl('/path/to/resource');
      expect(result).not.toBe('');
    });

    it('handles empty-ish strings gracefully', () => {
      // Empty path resolves to base URL which is https
      const result = sanitizeUrl('/');
      expect(result).not.toBe('');
    });
  });
});
