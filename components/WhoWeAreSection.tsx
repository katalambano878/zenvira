'use client';

import Image from 'next/image';
import Link from 'next/link';
import AnimatedSection from './AnimatedSection';
import { getSiteName } from '@/lib/site-defaults';

export default function WhoWeAreSection() {
  const siteName = getSiteName();

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection className="order-2 lg:order-1">
            <p className="text-xs tracking-[0.2em] uppercase text-store-muted mb-3">Our story</p>
            <h2 className="text-3xl md:text-4xl font-serif text-store-ink mb-6">
              Furnish every room
            </h2>
            <div className="space-y-4 text-base text-store-muted leading-relaxed">
              <p>
                <strong className="text-store-ink">{siteName}</strong> helps you shop sofas, beds, tables,
                décor and home essentials — organised by room so you can build a complete look without the guesswork.
              </p>
              <p>
                From living-room seating to dining sets, we focus on clear product details, Mobile Money checkout,
                and delivery that respects large furniture.
              </p>
              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center text-store-gold font-medium hover:text-store-goldDark transition-colors group"
                >
                  <span className="border-b border-transparent group-hover:border-store-gold transition-colors">
                    Our story
                  </span>
                  <i className="ri-arrow-right-line ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection className="order-1 lg:order-2 relative" delay={200}>
            <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-soft relative group bg-white border border-stone-200">
              <Image
                src="/logo.png"
                alt={`${siteName} logo`}
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
