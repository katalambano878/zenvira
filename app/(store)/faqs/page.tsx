"use client";

import { useState } from 'react';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { PAGE_HEROES } from '@/lib/furniture-images';
import { getSiteName } from '@/lib/site-defaults';

export default function FAQsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const siteName = getSiteName();
  const waDigits = (process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || process.env.NEXT_PUBLIC_CONTACT_PHONE || '').replace(/\D/g, '');

  const categories = [
    { id: 'all', name: 'All Questions', icon: 'ri-question-line' },
    { id: 'orders', name: 'Orders', icon: 'ri-shopping-bag-line' },
    { id: 'furniture', name: 'Furniture', icon: 'ri-sofa-line' },
    { id: 'shipping', name: 'Delivery', icon: 'ri-truck-line' },
    { id: 'returns', name: 'Returns', icon: 'ri-arrow-go-back-line' },
    { id: 'payment', name: 'Payment', icon: 'ri-bank-card-line' },
    { id: 'account', name: 'Account', icon: 'ri-user-line' },
  ];

  const faqs = [
    {
      category: 'orders',
      question: 'How do I order furniture online?',
      answer: `Browse by room or shop all products, add pieces to your cart, then checkout with your delivery details. ${siteName} confirms your order by email/SMS and you can track status anytime on the Order Tracking page.`,
    },
    {
      category: 'orders',
      question: 'Can I order on WhatsApp instead?',
      answer: 'Yes. If you prefer help choosing a sofa set, confirming dimensions, or arranging delivery, message us on WhatsApp from the Contact page. Share the product link or name and we will guide you.',
    },
    {
      category: 'orders',
      question: 'Can I modify or cancel my order?',
      answer: 'Contact us as soon as possible — ideally within 1 hour of placing the order. Once a furniture order is packed or dispatched, changes may not be possible.',
    },
    {
      category: 'orders',
      question: 'How do I track my furniture delivery?',
      answer: 'Use Order Tracking with your order number and email. Status moves through confirmed, processing, packed, dispatched, in transit, and delivered.',
    },
    {
      category: 'furniture',
      question: 'Do product pages show dimensions and materials?',
      answer: 'Yes. Product pages are built for furniture shopping — look for galleries, size/colour/material variants, and description details so you can match pieces to your room.',
    },
    {
      category: 'furniture',
      question: 'How should I choose a sofa for my living room?',
      answer: 'Measure your wall and walkway clearance first, then filter Living Room / Sofas by size and style. Message us on WhatsApp with a room photo if you want a second opinion before buying.',
    },
    {
      category: 'furniture',
      question: 'Do you sell full room sets?',
      answer: 'Many customers pair sofas with centre tables, dining sets with chairs, and beds with nightstands. Use related products on each page, or shop by room to complete a look.',
    },
    {
      category: 'shipping',
      question: 'Do you deliver large furniture items?',
      answer: 'Yes. Sofas, beds and tables need scheduled delivery. See Shipping & Delivery for zones and timelines. Some items may require assembly or installation on arrival — we will note this on the order.',
    },
    {
      category: 'shipping',
      question: 'What are typical delivery times in Ghana?',
      answer: 'Greater Accra and nearby areas are usually fastest (often a few business days after confirmation). Other regions take longer depending on route and item size. Exact timing is confirmed after checkout.',
    },
    {
      category: 'shipping',
      question: 'What if nobody is home for delivery?',
      answer: 'Our team or partner will attempt delivery and contact you. If unsuccessful, we reschedule. Large furniture is not left unattended without your confirmation.',
    },
    {
      category: 'shipping',
      question: 'Is store pickup available?',
      answer: 'Where enabled, you can choose pickup at checkout. Bring your order number and a valid ID when collecting.',
    },
    {
      category: 'returns',
      question: 'What is your return policy for furniture?',
      answer: 'Unused items in original condition may be eligible within the return window stated on the Returns page. Custom-cut, heavily assembled, or damaged-by-use pieces may not qualify. Defective items are prioritised for replacement or refund.',
    },
    {
      category: 'returns',
      question: 'Who pays return shipping on bulky items?',
      answer: 'If the issue is a defect or our error, we cover return logistics. Change-of-mind returns on large furniture may include a collection fee — confirm with support before initiating.',
    },
    {
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We support secure Ghana payments via Moolre (Mobile Money and supported methods). Pay before dispatch — we do not offer cash on delivery for furniture orders.',
    },
    {
      category: 'payment',
      question: 'Is checkout secure?',
      answer: 'Yes. Payments are processed through our payment partner over encrypted connections. We never store full card numbers on our servers.',
    },
    {
      category: 'payment',
      question: 'How do refunds work?',
      answer: 'Approved refunds return to your original payment method after inspection. Mobile Money refunds require correct wallet details.',
    },
    {
      category: 'account',
      question: 'Do I need an account to buy?',
      answer: 'No — guest checkout works. An account saves addresses, order history and makes reordering easier.',
    },
    {
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Use Forgot Password on the login page. We email a reset link valid for a limited time.',
    },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Orders, furniture sizing, delivery of large pieces, payments and returns."
        backgroundImage={PAGE_HEROES.support}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-8">
        <div className="relative bg-white rounded-full shadow-xl border border-store-ink/10 p-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search furniture FAQs..."
            className="w-full pl-12 pr-4 py-4 border-0 rounded-full focus:ring-2 focus:ring-stone-500 focus:border-transparent text-sm bg-transparent"
          />
          <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-store-muted text-xl" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-store-ink text-white shadow-lg'
                  : 'bg-white text-store-ink border border-store-ink/10 hover:border-store-gold'
              }`}
            >
              <i className={`${category.icon} text-lg`}></i>
              {category.name}
            </button>
          ))}
        </div>

        {filteredFAQs.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredFAQs.map((faq) => (
              <details
                key={faq.question}
                className="bg-white border border-store-ink/10 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <summary className="px-6 py-5 font-medium text-store-ink cursor-pointer hover:bg-black/[0.02] transition-colors flex items-center justify-between">
                  <span className="flex-1 pr-4">{faq.question}</span>
                  <i className="ri-arrow-down-s-line text-xl text-store-muted"></i>
                </summary>
                <div className="px-6 pb-5 text-store-muted leading-relaxed border-t border-store-ink/10 pt-4">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-bold text-store-ink mb-2">No results found</h3>
            <p className="text-store-muted">Try another search or browse a different category</p>
          </div>
        )}
      </div>

      <div className="bg-store-ink py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif text-white mb-4">Still deciding on a piece?</h2>
          <p className="text-xl text-white/70 mb-8 leading-relaxed">
            Send a WhatsApp message with the product name or a room photo — we will help you choose.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-store-gold text-store-ink px-8 py-4 font-medium hover:bg-white transition-colors whitespace-nowrap"
            >
              <i className="ri-mail-line text-lg"></i>
              Contact us
            </Link>
            {waDigits ? (
              <a
                href={`https://wa.me/${waDigits.startsWith('0') ? `233${waDigits.slice(1)}` : waDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-store-gold text-store-ink px-8 py-4 font-medium hover:bg-store-goldDark transition-colors whitespace-nowrap"
              >
                <i className="ri-whatsapp-line text-lg"></i>
                WhatsApp
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
