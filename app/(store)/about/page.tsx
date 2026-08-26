'use client';

import Link from 'next/link';
import { useCMS } from '@/context/CMSContext';
import PageHero from '@/components/PageHero';
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
      description: 'Sofas, beds, tables and décor chosen for real Ghanaian homes — style, comfort and everyday use.',
    },
    {
      icon: 'ri-home-smile-line',
      title: 'Shop by room',
      description: 'Browse living room, bedroom, dining, kitchen, office and outdoor ranges without the guesswork.',
    },
    {
      icon: 'ri-whatsapp-line',
      title: 'WhatsApp-ready help',
      description: 'Ask about dimensions, fabrics or delivery before you buy — we respond on the channels you already use.',
    },
    {
      icon: 'ri-truck-line',
      title: 'Large-item delivery',
      description: 'Furniture is not a small parcel. We plan shipping and installation-friendly delivery for bulky pieces.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title={`About ${siteName}`}
        subtitle={tagline}
        backgroundImage="/logo.png"
      />

      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-6">Who we are</h2>
              <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                <p>
                  <strong>{siteName}</strong> is a home furnishing store for Ghana — sofas, furniture,
                  décor and the pieces that turn an empty room into a finished home.
                </p>
                <p>
                  We built this platform so you can browse by room, compare materials and dimensions,
                  and checkout securely with Mobile Money — then track your order through delivery.
                </p>
                <p>
                  Whether you are furnishing a new apartment, upgrading a living room set, or completing
                  a dining space, {siteName} is here to help you shop with clarity and confidence.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden shadow-2xl relative bg-gradient-to-br from-stone-800 via-stone-700 to-amber-900/40 flex items-end p-8">
                <div>
                  <p className="font-serif text-3xl text-white mb-2">{siteName}</p>
                  <p className="text-stone-200 text-sm max-w-sm">
                    Furniture, sofas & interiors — furnish every room beautifully.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-stone-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-stone-900 mb-4">What we stand for</h2>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              A furniture storefront designed around how Ghanaian buyers actually shop for homes.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-white p-8 border border-stone-100 shadow-sm">
                <div className="w-12 h-12 bg-stone-100 flex items-center justify-center mb-6">
                  <i className={`${value.icon} text-2xl text-stone-800`}></i>
                </div>
                <h3 className="text-xl font-semibold text-stone-900 mb-3">{value.title}</h3>
                <p className="text-stone-600 leading-relaxed text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-stone-900 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="font-serif text-4xl md:text-5xl mb-8">Ready to furnish?</h2>
          <p className="text-xl text-stone-300 mb-10 leading-relaxed max-w-2xl mx-auto">
            Explore sofas, beds, dining sets and décor — or message us if you need help matching pieces to your space.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 bg-amber-100 text-stone-900 px-10 py-4 font-semibold text-lg hover:bg-white transition-colors"
          >
            Shop furniture
            <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
