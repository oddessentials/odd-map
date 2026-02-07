/**
 * Unit Tests - DOM Injection (WLC-005)
 *
 * Tests client branding injection into HTML document.
 * Verifies contract assertions from contracts/dom-injection.md.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { injectClientBranding } from '../src/lib/dom-injector';
import type { ValidatedClientConfig } from '../src/lib/client-config.schema';

function createConfig(overrides?: Partial<ValidatedClientConfig>): ValidatedClientConfig {
  return {
    schemaVersion: 1,
    clientId: 'testclient',
    name: 'Test Client',
    copyrightHolder: 'Test Client Inc.',
    offices: [
      {
        officeCode: 'TST PA1',
        city: 'Test City',
        state: 'Pennsylvania',
        officeType: 'Branch Office',
        address: '123 Test St',
        region: 'Test Region',
        coordinates: {
          lat: 40.0,
          lon: -80.0,
          source: 'verified',
          confidence: 'high',
          approximate: false,
        },
      },
    ],
    ...overrides,
  } as ValidatedClientConfig;
}

function setupDOM(): void {
  document.body.innerHTML = `
    <div id="loading-logo"></div>
    <span id="header-logo"></span>
    <span id="header-tagline"></span>
    <a id="footer-phone" href="#"></a>
    <a id="footer-email" href="#"></a>
    <a id="footer-claims" href="#"></a>
    <a id="footer-lossruns" href="#"></a>
    <a id="footer-accounting" href="#"></a>
    <span id="accounting-contact"></span>
    <div class="footer-contact"><span class="footer-label">Get Connected:</span></div>
    <div id="copyright"></div>
    <meta name="description" content="" />
  `;
}

describe('DOM Injection', () => {
  beforeEach(() => {
    setupDOM();
  });

  describe('Contract Assertion 1: document.title set from config.name', () => {
    it('sets document.title to "{name} - Locations Map"', () => {
      const config = createConfig({ name: 'Odd Essentials' });
      injectClientBranding(config);

      expect(document.title).toBe('Odd Essentials - Locations Map');
    });
  });

  describe('Contract Assertion 2: No hardcoded USG text after injection', () => {
    it('does not contain "USG" in any injection target after injection', () => {
      const config = createConfig({ name: 'Odd Essentials' });
      injectClientBranding(config);

      const targets = [
        '#loading-logo',
        '#header-logo',
        '#header-tagline',
        '#footer-phone',
        '#footer-email',
        '#copyright',
      ];

      for (const selector of targets) {
        const el = document.querySelector(selector);
        if (el && el.textContent) {
          expect(el.textContent).not.toContain('USG');
        }
      }

      expect(document.title).not.toContain('USG');
    });
  });

  describe('Contract Assertion 3: footer contacts hidden when globalContacts omitted', () => {
    it('hides all footer contact elements when globalContacts is absent', () => {
      const config = createConfig(); // no globalContacts
      injectClientBranding(config);

      const hiddenSelectors = [
        '#footer-phone',
        '#footer-email',
        '#footer-claims',
        '#footer-lossruns',
        '#footer-accounting',
        '#accounting-contact',
      ];

      for (const selector of hiddenSelectors) {
        const el = document.querySelector(selector) as HTMLElement;
        expect(el.style.display).toBe('none');
      }
    });

    it('sets fallback label text when globalContacts is absent', () => {
      const config = createConfig(); // no globalContacts
      injectClientBranding(config);

      const footerLabel = document.querySelector('.footer-contact .footer-label') as HTMLElement;
      expect(footerLabel.textContent).toBe('Contact information not available.');
    });
  });

  describe('Contract Assertion 4: tagline hidden when omitted', () => {
    it('hides tagline element when tagline is absent', () => {
      const config = createConfig(); // no tagline
      injectClientBranding(config);

      const tagline = document.querySelector('#header-tagline') as HTMLElement;
      expect(tagline.style.display).toBe('none');
    });

    it('shows tagline when provided', () => {
      const config = createConfig({ tagline: 'We deliver quality' });
      injectClientBranding(config);

      const tagline = document.querySelector('#header-tagline') as HTMLElement;
      expect(tagline.textContent).toBe('We deliver quality');
      expect(tagline.style.display).not.toBe('none');
    });
  });

  describe('Phone and email links', () => {
    it('sets href="tel:" for phone links', () => {
      const config = createConfig({
        globalContacts: {
          mainPhone: '555-123-4567',
          mainEmail: 'info@test.com',
        },
      });
      injectClientBranding(config);

      const phone = document.querySelector('#footer-phone') as HTMLAnchorElement;
      expect(phone.textContent).toBe('555-123-4567');
      expect(phone.href).toContain('tel:5551234567');
    });

    it('sets href="mailto:" for email links', () => {
      const config = createConfig({
        globalContacts: {
          mainEmail: 'info@test.com',
        },
      });
      injectClientBranding(config);

      const email = document.querySelector('#footer-email') as HTMLAnchorElement;
      expect(email.textContent).toBe('info@test.com');
      expect(email.href).toContain('mailto:info@test.com');
    });

    it('sets department email hrefs', () => {
      const config = createConfig({
        globalContacts: {
          departmentEmails: {
            claims: 'claims@test.com',
            lossRuns: 'lossruns@test.com',
            accounting: 'ar@test.com',
          },
        },
      });
      injectClientBranding(config);

      const claims = document.querySelector('#footer-claims') as HTMLAnchorElement;
      expect(claims.href).toContain('mailto:claims@test.com');

      const lossRuns = document.querySelector('#footer-lossruns') as HTMLAnchorElement;
      expect(lossRuns.href).toContain('mailto:lossruns@test.com');

      const accounting = document.querySelector('#footer-accounting') as HTMLAnchorElement;
      expect(accounting.href).toContain('mailto:ar@test.com');
    });
  });

  describe('Copyright', () => {
    it('sets copyright with dynamic year and copyrightHolder', () => {
      const config = createConfig({ copyrightHolder: 'Acme Corp.' });
      injectClientBranding(config);

      const copyright = document.querySelector('#copyright')!;
      const year = new Date().getFullYear();
      expect(copyright.textContent).toContain(String(year));
      expect(copyright.textContent).toContain('Acme Corp.');
    });
  });

  describe('Meta description', () => {
    it('sets meta description from config.name', () => {
      const config = createConfig({ name: 'Odd Essentials' });
      injectClientBranding(config);

      const meta = document.querySelector('meta[name="description"]')!;
      expect(meta.getAttribute('content')).toBe('Interactive locations map for Odd Essentials');
    });
  });

  describe('Logo injection', () => {
    it('sets loading-logo and header-logo from config.name', () => {
      const config = createConfig({ name: 'Test Brand' });
      injectClientBranding(config);

      expect(document.querySelector('#loading-logo')!.textContent).toBe('Test Brand');
      expect(document.querySelector('#header-logo')!.textContent).toBe('Test Brand');
    });
  });

  describe('Accounting contact', () => {
    it('shows accounting contact when provided', () => {
      const config = createConfig({
        globalContacts: {
          accountingContact: {
            name: 'Jane Doe',
            title: 'Controller',
            phone: '555-9999',
            email: 'jane@test.com',
          },
        },
      });
      injectClientBranding(config);

      const el = document.querySelector('#accounting-contact')!;
      expect(el.textContent).toContain('Jane Doe');
      expect(el.textContent).toContain('Controller');
      expect(el.textContent).toContain('555-9999');
    });

    it('hides accounting contact when absent', () => {
      const config = createConfig({
        globalContacts: {},
      });
      injectClientBranding(config);

      const el = document.querySelector('#accounting-contact') as HTMLElement;
      expect(el.style.display).toBe('none');
    });
  });
});
