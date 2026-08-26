'use client';

import Image from 'next/image';
import Link from 'next/link';
import AnimatedSection from './AnimatedSection';
import { getSiteName } from '@/lib/site-defaults';

export default function WhoWeAreSection() {
  const siteName = getSiteName();

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-6">
              Furnish every room
            </h2>
            <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
              <p>
                <strong>{siteName}</strong> helps you shop sofas, beds, tables, décor and home
                essentials online — organised by room so you can build a complete look without the
                guesswork.
              </p>
              <p>
                From living-room seating to dining sets and bedroom pieces, we focus on clear product
                details, Mobile Money checkout, and delivery that respects large furniture.
              </p>
              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center text-stone-800 font-medium hover:text-stone-950 transition-colors group"
                >
                  <span className="border-b border-transparent group-hover:border-stone-900 transition-colors">
                    Our story
                  </span>
                  <i className="ri-arrow-right-line ml-2 transition-transform group-hover:translate-x-1"></i>
                </Link>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection className="order-1 lg:order-2 relative" delay={200}>
            <div className="aspect-[4/3] overflow-hidden shadow-2xl relative group bg-gradient-to-br from-stone-800 to-stone-600 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt={`${siteName} logo`}
                fill
                className="object-contain p-16 opacity-90 transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
