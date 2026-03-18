/**
 * Neutral site defaults. Set NEXT_PUBLIC_* env vars and/or CMS settings for production.
 */

function env(key: string): string {
  if (typeof process === 'undefined' || !process.env) return '';
  return String(process.env[key] ?? '').trim();
}

/** Text logo / wordmark (header, footer, PWA) */
export function getWordmark(): string {
  return env('NEXT_PUBLIC_WORDMARK') || 'Zenvira';
}

/** Display name (store / site title) */
export function getSiteName(): string {
  return env('NEXT_PUBLIC_SITE_NAME') || 'Your Store';
}

/** Short line for meta / hero */
export function getSiteTagline(): string {
  return env('NEXT_PUBLIC_SITE_TAGLINE') || 'Online store';
}

export function getContactEmail(): string {
  return env('NEXT_PUBLIC_CONTACT_EMAIL') || 'contact@example.com';
}

/** Human-readable phone for display */
export function getContactPhoneDisplay(): string {
  return env('NEXT_PUBLIC_CONTACT_PHONE');
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
  return env('NEXT_PUBLIC_CONTACT_ADDRESS');
}

/** Strip placeholder / empty so "[Your address]" never shows in UI */
export function sanitizeAddressDisplay(addr: string | undefined | null): string {
  const t = (addr ?? '').trim();
  if (!t || /^\[Your address\]$/i.test(t)) return '';
  return t;
}

/** Default social links (override with NEXT_PUBLIC_SOCIAL_* or CMS) */
export function getDefaultSocialLinks() {
  return {
    instagram: env('NEXT_PUBLIC_SOCIAL_INSTAGRAM') || 'https://www.instagram.com/_adjoatee/',
    youtube: env('NEXT_PUBLIC_SOCIAL_YOUTUBE') || 'https://www.youtube.com/@adjoatee',
    snapchat: env('NEXT_PUBLIC_SOCIAL_SNAPCHAT') || 'https://www.snapchat.com/add/badgyaltee.xx',
  };
}

export function getSocialInstagramHandle(): string {
  return env('NEXT_PUBLIC_SOCIAL_INSTAGRAM_HANDLE') || '_adjoatee';
}

export function getSocialYoutubeHandle(): string {
  return env('NEXT_PUBLIC_SOCIAL_YOUTUBE_HANDLE') || '@adjoatee';
}

export function getSocialSnapchatHandle(): string {
  return env('NEXT_PUBLIC_SOCIAL_SNAPCHAT_HANDLE') || 'badgyaltee.xx';
}

export function getDefaultMetaDescription(): string {
  const tag = getSiteTagline();
  const addr = getContactAddress();
  if (addr) return `${tag}. ${addr}.`;
  return `${tag}. Shop online.`;
}

export function getDefaultTitleSuffix(): string {
  return `${getSiteName()} | ${getSiteTagline()}`;
}

/** Moolre / SMS sender id (max length per provider) */
export function getSmsSenderId(): string {
  const id = (env('NEXT_PUBLIC_SMS_SENDER_ID') || 'STORE').toUpperCase();
  return id.slice(0, 11);
}

/** Auto-generated product SKU prefix */
export function getSkuPrefix(): string {
  return (env('NEXT_PUBLIC_SKU_PREFIX') || 'SKU').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || 'SKU';
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
