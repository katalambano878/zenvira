'use client';

import Image from 'next/image';
import Link from 'next/link';
import AnimatedSection from './AnimatedSection';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'New Project';

export default function WhoWeAreSection() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6">
              Who We Are
            </h2>
            <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
              <p>
                <strong>{SITE_NAME}</strong> is a starter storefront template. Replace this section
                with your brand story, values, and what makes your shop unique.
              </p>
              <p>
                The e-commerce architecture is ready — products, cart, checkout, and admin are wired
                up. Add your catalog and customize copy when you launch.
              </p>
              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center text-blue-800 font-medium hover:text-blue-900 transition-colors group"
                >
                  <span className="border-b border-transparent group-hover:border-blue-900 transition-colors">
                    Read Our Full Story
                  </span>
                  <i className="ri-arrow-right-line ml-2 transition-transform group-hover:translate-x-1"></i>
                </Link>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection className="order-1 lg:order-2 relative" delay={200}>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative group bg-gray-50 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt={`${SITE_NAME} logo`}
                fill
                className="object-contain p-12 transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
