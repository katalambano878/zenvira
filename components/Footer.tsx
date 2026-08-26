'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCMS } from '@/context/CMSContext';
import {
  getSiteName,
  getSiteTagline,
  getContactEmail,
  getContactPhoneDisplay,
  getContactAddress,
  sanitizeAddressDisplay,
  getDefaultSocialLinks,
} from '@/lib/site-defaults';

function FooterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10 lg:border-none last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left lg:py-0 lg:cursor-default lg:mb-5"
      >
        <h4 className="font-serif text-lg text-white">{title}</h4>
        <i className={`ri-arrow-down-s-line text-white/50 lg:hidden transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all ${isOpen ? 'max-h-96 pb-5' : 'max-h-0 lg:max-h-none'}`}>
        {children}
      </div>
    </div>
  );
}

export default function Footer() {
  const { getSetting } = useCMS();
  const siteName = getSetting('site_name') || getSiteName();
  const siteTagline = getSetting('site_tagline') || getSiteTagline();
  const contactEmail = getSetting('contact_email') || getContactEmail();
  const contactPhone = getSetting('contact_phone') || getContactPhoneDisplay();
  const contactWhatsapp =
    getSetting('contact_whatsapp') || process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || getContactPhoneDisplay();
  const contactAddress = sanitizeAddressDisplay(getSetting('contact_address') || getContactAddress());
  const socialDefaults = getDefaultSocialLinks();
  const socialInstagram = getSetting('social_instagram') || socialDefaults.instagram;
  const socialFacebook = getSetting('social_facebook') || '';
  const socialYoutube = getSetting('social_youtube') || socialDefaults.youtube;

  const waDigits = (contactWhatsapp || '').replace(/\D/g, '');
  const chatHref = waDigits
    ? `https://wa.me/${waDigits.startsWith('0') ? `233${waDigits.slice(1)}` : waDigits}`
    : '/contact';

  return (
    <footer className="bg-store-ink text-white border-t border-store-ink mt-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-block">
              <img
                src="/logo.png"
                alt={siteName}
                className="h-14 sm:h-16 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-sm">{siteTagline}</p>
            {(contactAddress || contactPhone || contactEmail) && (
              <p className="text-sm text-white/50 leading-relaxed">
                {[contactAddress, contactPhone, contactEmail].filter(Boolean).join(' · ')}
              </p>
            )}
            <div className="flex gap-3 pt-1">
              {[
                { link: socialInstagram, icon: 'ri-instagram-line', label: 'Instagram' },
                { link: socialFacebook, icon: 'ri-facebook-fill', label: 'Facebook' },
                { link: socialYoutube, icon: 'ri-youtube-fill', label: 'YouTube' },
              ].map(
                (s) =>
                  s.link && (
                    <a
                      key={s.label}
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-store-gold hover:text-store-ink hover:border-store-gold transition-colors"
                    >
                      <i className={s.icon} />
                    </a>
                  )
              )}
            </div>
          </div>

          <div className="lg:col-span-6 grid sm:grid-cols-3 gap-6">
            <FooterSection title="Shop">
              <ul className="space-y-2.5 text-sm text-white/55">
                <li><Link href="/shop" className="hover:text-store-gold">All furniture</Link></li>
                <li><Link href="/shop?category=sofas" className="hover:text-store-gold">Sofas</Link></li>
                <li><Link href="/shop?category=bedroom" className="hover:text-store-gold">Bedroom</Link></li>
                <li><Link href="/shop?category=dining" className="hover:text-store-gold">Dining</Link></li>
              </ul>
            </FooterSection>
            <FooterSection title="Collections">
              <ul className="space-y-2.5 text-sm text-white/55">
                <li><Link href="/shop?category=living-room" className="hover:text-store-gold">Living room</Link></li>
                <li><Link href="/shop?category=kitchen" className="hover:text-store-gold">Kitchen</Link></li>
                <li><Link href="/shop?category=office" className="hover:text-store-gold">Office</Link></li>
                <li><Link href="/shop?category=outdoor" className="hover:text-store-gold">Outdoor</Link></li>
              </ul>
            </FooterSection>
            <FooterSection title="Help">
              <ul className="space-y-2.5 text-sm text-white/55">
                <li><Link href="/shipping" className="hover:text-store-gold">Delivery</Link></li>
                <li><Link href="/returns" className="hover:text-store-gold">Returns</Link></li>
                <li><Link href="/order-tracking" className="hover:text-store-gold">Track order</Link></li>
                <li><Link href="/faqs" className="hover:text-store-gold">FAQs</Link></li>
              </ul>
            </FooterSection>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <p className="font-serif text-lg text-white mb-1">Need help?</p>
              <p className="text-xs text-white/50 mb-4 leading-relaxed">
                Ask about sofas, dimensions, or delivery across Ghana.
              </p>
              <Link
                href={chatHref}
                target={waDigits ? '_blank' : undefined}
                rel={waDigits ? 'noopener noreferrer' : undefined}
                className="inline-flex w-full items-center justify-center rounded-full bg-store-gold px-4 py-2.5 text-xs font-medium text-store-ink hover:bg-white transition-colors"
              >
                Start a chat
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-store-gold">Privacy</Link>
            <Link href="/terms" className="hover:text-store-gold">Terms</Link>
            <Link href="/about" className="hover:text-store-gold">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
