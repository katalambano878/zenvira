/**
 * Sika Homes — home furnishing & interiors defaults.
 * Override via NEXT_PUBLIC_* env vars and/or CMS settings for production.
 */

function env(key: string): string {
  if (typeof process === 'undefined' || !process.env) return '';
  return String(process.env[key] ?? '').trim();
}

/** Text logo / wordmark (header, footer, PWA) */
export function getWordmark(): string {
  return env('NEXT_PUBLIC_WORDMARK') || 'Sika Homes';
}

/** Display name (store / site title) */
export function getSiteName(): string {
  return env('NEXT_PUBLIC_SITE_NAME') || 'Sika Homes';
}

/** Canonical site URL without trailing slash */
export function getAppUrl(): string {
  return (env('NEXT_PUBLIC_APP_URL') || 'http://localhost:3000').replace(/\/+$/, '');
}

/** Short line for meta / hero */
export function getSiteTagline(): string {
  return (
    env('NEXT_PUBLIC_SITE_TAGLINE') ||
    'Furniture, sofas & interiors for beautiful homes in Ghana.'
  );
}

export function getContactEmail(): string {
  return env('NEXT_PUBLIC_CONTACT_EMAIL') || 'hello@sikahomes.com';
}

/** Human-readable phone for display */
export function getContactPhoneDisplay(): string {
  return env('NEXT_PUBLIC_CONTACT_PHONE') || '';
}

/** E.164-style for tel: / SMS (best effort from display or raw env) */
export function getContactPhoneTel(): string {
  const raw = env('NEXT_PUBLIC_CONTACT_PHONE_TEL') || env('NEXT_PUBLIC_CONTACT_PHONE');
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  if (raw.includes('+')) return '+' + digits.replace(/^\+/, '');
  if (digits.startsWith('0') && digits.length >= 9) return `+233${digits.slice(1)}`;
  return digits.length >= 10 ? `+${digits}` : digits;
}

export function getContactAddress(): string {
  return env('NEXT_PUBLIC_CONTACT_ADDRESS') || 'Ghana';
}

/** Strip placeholder / empty so "[Your address]" never shows in UI */
export function sanitizeAddressDisplay(addr: string | undefined | null): string {
  const t = (addr ?? '').trim();
  if (!t || /^\[Your address\]$/i.test(t)) return '';
  return t;
}

/** Default social links — empty unless set via env or CMS */
export function getDefaultSocialLinks() {
  return {
    instagram: env('NEXT_PUBLIC_SOCIAL_INSTAGRAM'),
    youtube: env('NEXT_PUBLIC_SOCIAL_YOUTUBE'),
    snapchat: env('NEXT_PUBLIC_SOCIAL_SNAPCHAT'),
  };
}

export function getSocialInstagramHandle(): string {
  return env('NEXT_PUBLIC_SOCIAL_INSTAGRAM_HANDLE');
}

export function getSocialYoutubeHandle(): string {
  return env('NEXT_PUBLIC_SOCIAL_YOUTUBE_HANDLE');
}

export function getSocialSnapchatHandle(): string {
  return env('NEXT_PUBLIC_SOCIAL_SNAPCHAT_HANDLE');
}

export function getDefaultMetaDescription(): string {
  return (
    env('NEXT_PUBLIC_SITE_DESCRIPTION') ||
    'Shop sofas, beds, tables, décor and home essentials at Sika Homes. Room-ready furniture with delivery across Ghana — furnish your space beautifully.'
  );
}

export function getDefaultTitleSuffix(): string {
  return `${getSiteName()} | Sofas, Furniture & Interiors`;
}

/** Moolre / SMS sender id (max length per provider) */
export function getSmsSenderId(): string {
  const id = (env('NEXT_PUBLIC_SMS_SENDER_ID') || 'SIKAHOMES').toUpperCase();
  return id.slice(0, 11);
}

/** Auto-generated product SKU prefix */
export function getSkuPrefix(): string {
  return (env('NEXT_PUBLIC_SKU_PREFIX') || 'SIKA').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || 'SIKA';
}

/** Server: admin / notification email fallback */
export function getServerAdminEmail(): string {
  return env('ADMIN_EMAIL') || getContactEmail();
}

export function getServerEmailFrom(): string {
  const explicit = env('EMAIL_FROM');
  if (explicit) return explicit;
  const name = getSiteName();
  const email = getServerAdminEmail();
  return `${name} <${email}>`;
}

/** Static room-based shop shortcuts used on the homepage when catalog is empty */
export function getDefaultRoomCategories() {
  return [
    {
      id: 'sofas',
      name: 'Sofas',
      display_name: 'Sofas',
      slug: 'sofas',
      subtitle: 'Lounge-ready seating',
      tint: 'bg-stone-800',
    },
    {
      id: 'living-room',
      name: 'Living Room',
      display_name: 'Living Room',
      slug: 'living-room',
      subtitle: 'Tables, storage & accents',
      tint: 'bg-neutral-800',
    },
    {
      id: 'bedroom',
      name: 'Bedroom',
      display_name: 'Bedroom',
      slug: 'bedroom',
      subtitle: 'Beds & nightstands',
      tint: 'bg-zinc-800',
    },
    {
      id: 'dining',
      name: 'Dining',
      display_name: 'Dining',
      slug: 'dining',
      subtitle: 'Tables & chairs',
      tint: 'bg-slate-800',
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      display_name: 'Kitchen',
      slug: 'kitchen',
      subtitle: 'Practical home goods',
      tint: 'bg-stone-900',
    },
    {
      id: 'decor',
      name: 'Décor',
      display_name: 'Décor',
      slug: 'decor',
      subtitle: 'Finishing touches',
      tint: 'bg-neutral-900',
    },
    {
      id: 'office',
      name: 'Office',
      display_name: 'Office',
      slug: 'office',
      subtitle: 'Desks & work seating',
      tint: 'bg-zinc-900',
    },
    {
      id: 'outdoor',
      name: 'Outdoor',
      display_name: 'Outdoor',
      slug: 'outdoor',
      subtitle: 'Patio & garden',
      tint: 'bg-slate-900',
    },
  ] as const;
}
