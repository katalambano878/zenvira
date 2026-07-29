'use client';

import Link from 'next/link';
import { useCMS } from '@/context/CMSContext';
import PageHero from '@/components/PageHero';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function AboutPage() {
  usePageTitle('About');
  const { getSetting } = useCMS();

  const siteName = getSetting('site_name') || process.env.NEXT_PUBLIC_SITE_NAME || 'New Project';

  const values = [
    {
      icon: 'ri-verified-badge-line',
      title: 'Quality First',
      description: 'Products you can trust — selected and checked before they reach you.'
    },
    {
      icon: 'ri-shopping-bag-line',
      title: 'Simple Shopping',
      description: 'Browse, add to cart, and checkout with a straightforward online experience.'
    },
    {
      icon: 'ri-customer-service-2-line',
      title: 'Helpful Support',
      description: 'Questions about an order? Reach us through the Contact page.'
    },
    {
      icon: 'ri-truck-line',
      title: 'Flexible Delivery',
      description: 'Pickup and delivery options at checkout — see Shipping for details.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="About Us"
        subtitle={`${siteName} — a clean starting point for your online store.`}
        backgroundImage="/logo.png"
      />

      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6">Who We Are</h2>
              <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                <p>
                  <strong>{siteName}</strong> is an e-commerce starter built to launch quickly. Customize branding, products, and settings in the admin, then go live when you are ready.
                </p>
                <p>
                  This template includes storefront pages, checkout, order tracking, and admin tools — everything you need as a foundation for a new project.
                </p>
                <p>
                  Replace placeholder content, connect your payment provider, and add your catalog to make the store yours.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative bg-gray-100 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt={siteName}
                  className="w-full h-full object-contain p-8"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What You Get</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A neutral storefront foundation — customize it for your brand and products.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <i className={`${value.icon} text-2xl text-blue-700`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-900 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to explore?</h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto">
            Browse the shop or visit Contact for email, phone, and location details.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 bg-white text-blue-900 px-10 py-5 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            Visit Shop
            <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
