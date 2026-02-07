/**
 * DOM Injector - Client Branding Injection
 *
 * Injects client-specific text and branding into the HTML document at startup.
 * Satisfies FR-003 (all UI text from config) and WLC-005 (Absolute Client String Isolation).
 */

import type { ValidatedClientConfig } from './client-config.schema.js';

/**
 * Populate all branding injection targets in the DOM with values from client config.
 * Called once at startup after client config is loaded, before the loading screen fades out.
 */
export function injectClientBranding(config: ValidatedClientConfig): void {
  document.title = `${config.name} - Locations Map`;

  setMetaDescription(`Interactive locations map for ${config.name}`);

  setText('#loading-logo', config.name);
  setText('#header-logo', config.name);
  setTextOrHide('#header-tagline', config.tagline);

  if (config.globalContacts) {
    setPhoneLink('#footer-phone', config.globalContacts.mainPhone);
    setEmailLink('#footer-email', config.globalContacts.mainEmail);
    setEmailLink('#footer-claims', config.globalContacts.departmentEmails?.claims);
    setEmailLink('#footer-lossruns', config.globalContacts.departmentEmails?.lossRuns);
    setEmailLink('#footer-accounting', config.globalContacts.departmentEmails?.accounting);

    if (config.globalContacts.accountingContact) {
      const contact = config.globalContacts.accountingContact;
      setText('#accounting-contact', `${contact.name}, ${contact.title} - ${contact.phone}`);
    } else {
      hideElement('#accounting-contact');
    }
  } else {
    hideElement('#footer-phone');
    hideElement('#footer-email');
    hideElement('#footer-claims');
    hideElement('#footer-lossruns');
    hideElement('#footer-accounting');
    hideElement('#accounting-contact');

    const footerLabel = document.querySelector(
      '.footer-contact .footer-label'
    ) as HTMLElement | null;
    if (footerLabel) {
      footerLabel.textContent = 'Contact information not available.';
    }
  }

  setText('#copyright', `\u00A9 ${new Date().getFullYear()} ${config.copyrightHolder}`);
}

/**
 * Set text content of an element by selector.
 * Silently skips if element not found (element may not exist yet in HTML).
 */
function setText(selector: string, text: string): void {
  const el = document.querySelector(selector);
  if (el) {
    el.textContent = text;
  }
}

/**
 * Set text content if value is provided, otherwise hide the element.
 */
function setTextOrHide(selector: string, value: string | undefined): void {
  const el = document.querySelector(selector);
  if (!el) return;

  if (value) {
    el.textContent = value;
    (el as HTMLElement).style.display = '';
  } else {
    (el as HTMLElement).style.display = 'none';
  }
}

/**
 * Set a phone link's text and href, or hide if value absent.
 */
function setPhoneLink(selector: string, phone: string | undefined): void {
  const el = document.querySelector(selector) as HTMLAnchorElement | null;
  if (!el) return;

  if (phone) {
    el.textContent = phone;
    el.href = `tel:${phone.replace(/[^+\d]/g, '')}`;
    el.style.display = '';
  } else {
    el.style.display = 'none';
  }
}

/**
 * Set an email link's text and href, or hide if value absent.
 */
function setEmailLink(selector: string, email: string | undefined): void {
  const el = document.querySelector(selector) as HTMLAnchorElement | null;
  if (!el) return;

  if (email) {
    el.textContent = email;
    el.href = `mailto:${email}`;
    el.style.display = '';
  } else {
    el.style.display = 'none';
  }
}

/**
 * Hide an element by selector.
 */
function hideElement(selector: string): void {
  const el = document.querySelector(selector) as HTMLElement | null;
  if (el) {
    el.style.display = 'none';
  }
}

/**
 * Set meta description content.
 */
function setMetaDescription(content: string): void {
  const meta = document.querySelector('meta[name="description"]');
  if (meta) {
    meta.setAttribute('content', content);
  }
}
