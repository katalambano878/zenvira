/** Shared brand URLs and SEO copy for metadata, JSON-LD, and PWA. */

import {
  getAppUrl,
  getContactAddress,
  getContactEmail,
  getContactPhoneDisplay,
  getContactPhoneTel,
  getDefaultMetaDescription,
  getDefaultTitleSuffix,
  getSiteName,
} from '@/lib/site-defaults';

export const SITE_LEGAL_NAME = getSiteName();

export function getSiteUrl(): string {
  return getAppUrl();
}

export const SITE_DEFAULT_TITLE = getDefaultTitleSuffix();

export const SITE_DEFAULT_DESCRIPTION = getDefaultMetaDescription();

export const SITE_KEYWORDS = [
  'Sika Homes',
  'furniture Ghana',
  'sofas Accra',
  'home furnishing',
  'beds and mattresses',
  'living room furniture',
  'dining tables',
  'interior décor',
  'buy furniture online Ghana',
  'home interiors',
] as const;

export const BRAND_ASSETS = {
  logo: '/logo.png',
  logo512: '/icon-512.png',
  ogImage: '/og-image.png',
  appleTouchIcon: '/apple-touch-icon.png',
  favicon32: '/favicon-32.png',
  favicon16: '/favicon-16.png',
  icon192: '/icon-192.png',
  icon512: '/icon-512.png',
  iconMaskable192: '/icon-maskable-192.png',
  iconMaskable512: '/icon-maskable-512.png',
} as const;

export function absoluteAsset(path: string): string {
  return `${getSiteUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Prefer bundled logo; ignore legacy CMS paths until admin uploads a new one. */
export function resolveSiteLogo(stored?: string | null): string {
  const value = stored?.trim();
  if (!value) return BRAND_ASSETS.logo;
  if (value === '/logo.svg' || value.includes('supabase.co/storage')) return BRAND_ASSETS.logo;
  return value;
}

/** Default contact for structured data (overridden when site_settings are populated). */
export const SITE_CONTACT = {
  email: getContactEmail(),
  phonePrimary: getContactPhoneTel() || getContactPhoneDisplay(),
  phoneSecondary: '',
  areaServed: 'Ghana',
  addressLocality: getContactAddress(),
} as const;
