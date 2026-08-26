'use client';

import Link from 'next/link';
import { useCMS } from '@/context/CMSContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { getSiteName, getSiteTagline } from '@/lib/site-defaults';

export default function AboutPage() {
  usePageTitle('About');
  const { getSetting } = useCMS();
  const siteName = getSetting('site_name') || getSiteName();
  const tagline = getSetting('site_tagline') || getSiteTagline();

  const values = [
    {
      icon: 'ri-sofa-line',
      title: 'Furniture that fits',
      description: 'Sofas, beds, tables and décor chosen for real Ghanaian homes.',
    },
    {
      icon: 'ri-home-smile-line',
      title: 'Shop by room',
      description: 'Browse living room, bedroom, dining, kitchen, office and outdoor.',
    },
    {
      icon: 'ri-whatsapp-line',
      title: 'WhatsApp-ready help',
      description: 'Ask about dimensions, fabrics or delivery before you buy.',
    },
    {
      icon: 'ri-truck-line',
      title: 'Large-item delivery',
      description: 'Scheduled shipping for bulky pieces — not left at the gate.',
    },
  ];

  return (
    <div className="min-h-screen bg-store-cream">
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-16 pb-12 text-center">
        <p className="text-xs tracking-[0.2em] uppercase text-store-muted mb-3">About us</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-store-ink mb-4">{siteName}</h1>
        <p className="text-store-muted max-w-xl mx-auto text-lg">{tagline}</p>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center bg-white rounded-[2rem] border border-stone-200/80 p-8 md:p-12 shadow-soft">
          <div>
            <h2 className="font-serif text-3xl text-store-ink mb-5">Who we are</h2>
            <div className="space-y-4 text-store-muted leading-relaxed">
              <p>
                <strong className="text-store-ink">{siteName}</strong> is a home furnishing store for Ghana —
                sofas, furniture, décor and the pieces that turn an empty room into a finished home.
              </p>
              <p>
                Browse by room, compare materials and dimensions, checkout with Mobile Money, then track
                delivery through to your door.
              </p>
            </div>
          </div>
          <div className="aspect-[4/3] rounded-3xl bg-store-sage flex items-end p-8 text-white">
            <div>
              <p className="font-serif text-3xl mb-2">{siteName}</p>
              <p className="text-white/80 text-sm max-w-sm">Furniture, sofas & interiors — furnish every room beautifully.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-stone-200/70 py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl text-store-ink mb-3">What we stand for</h2>
            <p className="text-store-muted">A furniture storefront designed for how Ghana buyers shop for homes.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-stone-200 bg-store-cream p-6">
                <div className="w-11 h-11 rounded-full bg-white border border-stone-200 flex items-center justify-center mb-4 text-store-sage">
                  <i className={`${v.icon} text-xl`} />
                </div>
                <h3 className="font-medium text-store-ink mb-2">{v.title}</h3>
                <p className="text-sm text-store-muted leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 text-center px-4">
        <h2 className="font-serif text-3xl sm:text-4xl text-store-ink mb-4">Ready to furnish?</h2>
        <p className="text-store-muted mb-8 max-w-lg mx-auto">
          Explore sofas, beds, dining sets and décor — or message us for a consultation.
        </p>
        <Link
          href="/shop"
          className="inline-flex rounded-full bg-store-sage px-8 py-3.5 text-sm font-medium text-white hover:bg-store-sageDark transition-colors"
        >
          Shop furniture
        </Link>
      </section>
    </div>
  );
}
