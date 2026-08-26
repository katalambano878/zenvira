'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard, { type ColorVariant, getColorHex } from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton';
import AnimatedSection, { AnimatedGrid } from '@/components/AnimatedSection';
import NewsletterSection from '@/components/NewsletterSection';
import { usePageTitle } from '@/hooks/usePageTitle';
import { getSiteName, getSiteTagline } from '@/lib/site-defaults';
import { SIKA_IMAGES } from '@/lib/furniture-images';

const ROOM_CARDS = [
  { name: 'Living Room', slug: 'living-room', image: SIKA_IMAGES.livingRoom },
  { name: 'Bedroom', slug: 'bedroom', image: SIKA_IMAGES.bedroom },
  { name: 'Dining Room', slug: 'dining', image: SIKA_IMAGES.dining },
  { name: 'Home Office', slug: 'office', image: SIKA_IMAGES.office },
];

const TRUST = [
  { icon: 'ri-stack-line', title: 'Quality materials', body: 'Sofas, woods and finishes chosen for everyday Ghanaian homes.' },
  { icon: 'ri-hammer-line', title: 'Thoughtful craft', body: 'Pieces selected for comfort, durability and clean styling.' },
  { icon: 'ri-home-heart-line', title: 'Room-ready ranges', body: 'Shop living, bedroom, dining, kitchen, décor and more.' },
  { icon: 'ri-truck-line', title: 'Furniture delivery', body: 'Large-item delivery planned for sofas, beds and tables.' },
];

const PURPOSES = [
  { icon: 'ri-compass-3-line', title: 'Timeless design', body: 'Looks that stay relevant as your home evolves.' },
  { icon: 'ri-shield-check-line', title: 'Built to last', body: 'Sturdy frames and finishes for daily living.' },
  { icon: 'ri-ruler-line', title: 'Clear details', body: 'Dimensions, materials and variants before you buy.' },
  { icon: 'ri-whatsapp-line', title: 'Human help', body: 'WhatsApp and consultation for sizing and delivery.' },
];

const TESTIMONIALS = [
  {
    quote: 'The sofa set transformed our living room. Delivery was careful and on schedule.',
    name: 'Ama Mensah',
    place: 'Accra',
  },
  {
    quote: 'We furnished the whole apartment through Sika Homes — browsing by room made it easy.',
    name: 'Kojo Asante',
    place: 'Tema',
  },
  {
    quote: 'WhatsApp help on dimensions saved us from ordering the wrong dining table.',
    name: 'Efua Boateng',
    place: 'East Legon',
  },
];

export default function Home() {
  usePageTitle('');
  const siteName = getSiteName();
  const tagline = getSiteTagline();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const productsRes = await fetch('/api/storefront/products?featured=true&limit=4');
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setFeaturedProducts(Array.isArray(productsData) ? productsData : []);
        }
      } catch (error: unknown) {
        console.error('Error fetching featured products:', error instanceof Error ? error.message : error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const spotlight = featuredProducts[0];

  return (
    <main className="bg-store-cream min-h-screen">
      {/* Hero — editorial split */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 md:pt-12 pb-10 md:pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="order-2 lg:order-1 animate-fade-in-up">
            <p className="text-[11px] sm:text-xs tracking-[0.22em] uppercase text-store-muted mb-5">
              Timeless furniture, thoughtfully chosen
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.12] text-store-ink mb-6">
              Designed for the way you live.
            </h1>
            <p className="text-store-muted text-base sm:text-lg leading-relaxed max-w-md mb-8">
              {tagline} Shop sofas, beds, dining sets and décor — built for Ghana homes.
            </p>
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link
                href="/shop"
                className="inline-flex items-center rounded-full bg-store-sage px-7 py-3.5 text-sm font-medium text-white hover:bg-store-sageDark transition-colors"
              >
                Shop Collection
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm text-store-ink hover:text-store-sage transition-colors"
              >
                <span className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center">
                  <i className="ri-play-fill text-sm" />
                </span>
                Our story
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-store-cream bg-stone-300"
                    style={{ backgroundColor: ['#8a947c', '#c4b5a0', '#6b7564'][i] }}
                  />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-store-muted">
                Trusted by families furnishing homes across Ghana
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative animate-fade-in-up" style={{ animationDelay: '120ms' }}>
            <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] rounded-[1.75rem] overflow-hidden shadow-soft">
              <Image
                src={SIKA_IMAGES.heroLiving}
                alt={`${siteName} living room furniture`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <Link
              href="/shop?category=sofas"
              className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 bg-white/95 backdrop-blur rounded-2xl p-3 pr-4 shadow-soft flex items-center gap-3 max-w-[240px] hover:scale-[1.02] transition-transform"
            >
              <span className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                <Image src={SIKA_IMAGES.heroChair} alt="Featured chair" fill className="object-cover" sizes="56px" />
              </span>
              <span className="text-left">
                <span className="block text-[10px] tracking-widest uppercase text-store-muted mb-0.5">New arrivals</span>
                <span className="block text-sm font-medium text-store-ink leading-snug">Sofas & seating for every room</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-stone-200/80 bg-white/60">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {TRUST.map((item) => (
              <div key={item.title} className="flex gap-3 items-start">
                <i className={`${item.icon} text-xl text-store-sage mt-0.5`} />
                <div>
                  <p className="text-sm font-medium text-store-ink mb-1">{item.title}</p>
                  <p className="text-xs text-store-muted leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by room */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-24">
        <AnimatedSection className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-store-muted mb-2">Collections</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-store-ink">Shop by room</h2>
          </div>
          <Link href="/categories" className="text-sm text-store-sage hover:text-store-sageDark inline-flex items-center gap-1">
            View all rooms <i className="ri-arrow-right-line" />
          </Link>
        </AnimatedSection>
        <AnimatedGrid className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {ROOM_CARDS.map((room) => (
            <Link key={room.slug} href={`/shop?category=${room.slug}`} className="group block">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-soft">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="font-serif text-lg sm:text-xl text-white">{room.name}</span>
                  <span className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-store-ink group-hover:bg-white transition-colors">
                    <i className="ri-arrow-right-up-line" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </AnimatedGrid>
      </section>

      {/* Featured spotlight */}
      <section className="bg-white/70 border-y border-stone-200/70">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-soft bg-store-sand">
              <Image
                src={spotlight?.product_images?.[0]?.url || SIKA_IMAGES.loungeChair}
                alt={spotlight?.name || 'Featured lounge seating'}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-store-muted mb-3">Featured piece</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-store-ink mb-4 leading-snug">
                Quality furniture that transforms your space
              </h2>
              <p className="text-store-muted leading-relaxed mb-8 max-w-md">
                From lounge chairs to full sofa sets — explore finishes, sizes and room styling before you checkout with Mobile Money.
              </p>
              {spotlight ? (
                <div className="rounded-2xl border border-stone-200 bg-store-cream p-5 sm:p-6">
                  <p className="font-serif text-xl text-store-ink mb-1">{spotlight.name}</p>
                  <p className="text-store-sage font-medium mb-4">
                    GHS {Number(spotlight.sale_price || spotlight.price).toLocaleString()}
                  </p>
                  <div className="flex gap-2 mb-5">
                    {['#535C4E', '#D6C7B2', '#2F2F2F'].map((hex) => (
                      <span key={hex} className="w-6 h-6 rounded-full border border-stone-300" style={{ backgroundColor: hex }} />
                    ))}
                  </div>
                  <Link
                    href={`/product/${spotlight.slug || spotlight.id}`}
                    className="inline-flex rounded-full bg-store-ink px-6 py-3 text-sm text-white hover:bg-store-sage transition-colors"
                  >
                    View product
                  </Link>
                </div>
              ) : (
                <Link
                  href="/shop"
                  className="inline-flex rounded-full bg-store-ink px-6 py-3 text-sm text-white hover:bg-store-sage transition-colors"
                >
                  Browse furniture
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sofa promo banner */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-16">
        <div className="grid md:grid-cols-2 rounded-[2rem] overflow-hidden shadow-soft min-h-[280px]">
          <div className="bg-store-sage flex flex-col justify-center px-8 sm:px-12 py-12 text-white">
            <p className="text-xs tracking-[0.2em] uppercase text-white/70 mb-3">Sofa collection</p>
            <h2 className="font-serif text-3xl sm:text-4xl mb-4 leading-snug">Modular comfort for every living room</h2>
            <p className="text-white/80 text-sm leading-relaxed mb-8 max-w-sm">
              Lounge seating, sectionals and accent chairs — shop sofas built for Ghana living spaces.
            </p>
            <Link href="/shop?category=sofas" className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4">
              Discover collection <i className="ri-arrow-right-line" />
            </Link>
          </div>
          <div className="relative min-h-[220px]">
            <Image src={SIKA_IMAGES.modularSofa} alt="Modular sofa collection" fill className="object-cover" sizes="50vw" />
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-12">
        <AnimatedSection className="text-center mb-12">
          <p className="text-xs tracking-[0.2em] uppercase text-store-muted mb-2">Why {siteName}</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-store-ink">Furniture with purpose</h2>
        </AnimatedSection>
        <AnimatedGrid className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {PURPOSES.map((item) => (
            <div key={item.title} className="text-center px-2">
              <div className="w-12 h-12 rounded-full border border-stone-300 flex items-center justify-center mx-auto mb-4 text-store-sage">
                <i className={`${item.icon} text-xl`} />
              </div>
              <h3 className="font-medium text-store-ink mb-2">{item.title}</h3>
              <p className="text-sm text-store-muted leading-relaxed">{item.body}</p>
            </div>
          ))}
        </AnimatedGrid>

        <AnimatedSection className="text-center mb-10">
          <h2 className="font-serif text-3xl text-store-ink mb-2">Loved in homes across Ghana</h2>
          <p className="text-store-muted text-sm">Real feedback from customers furnishing with {siteName}.</p>
        </AnimatedSection>
        <AnimatedGrid className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-2xl bg-white border border-stone-200/80 p-6 shadow-soft">
              <div className="flex gap-0.5 text-amber-500 mb-4 text-sm">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="ri-star-fill" />
                ))}
              </div>
              <p className="text-store-ink/90 text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-store-sage/20 flex items-center justify-center text-store-sage font-medium text-sm">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-medium text-store-ink">{t.name}</p>
                  <p className="text-xs text-store-muted">{t.place}</p>
                </div>
              </div>
            </div>
          ))}
        </AnimatedGrid>
      </section>

      {/* Featured grid if products exist */}
      {(loading || featuredProducts.length > 0) && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-20">
          <AnimatedSection className="flex items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-store-muted mb-2">Catalog</p>
              <h2 className="font-serif text-3xl text-store-ink">Featured furniture</h2>
            </div>
            <Link href="/shop" className="text-sm text-store-sage hover:text-store-sageDark">
              View all
            </Link>
          </AnimatedSection>
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <AnimatedGrid className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => {
                const variants = product.product_variants || [];
                const hasVariants = variants.length > 0;
                const minVariantPrice = hasVariants
                  ? Math.min(...variants.map((v: any) => v.price || product.price))
                  : undefined;
                const totalVariantStock = hasVariants
                  ? variants.reduce((sum: number, v: any) => sum + (v.quantity || 0), 0)
                  : 0;
                const effectiveStock = hasVariants ? totalVariantStock : product.quantity;
                const colorVariants: ColorVariant[] = [];
                const seenColors = new Set<string>();
                for (const v of variants) {
                  const colorName = (v as any).option2;
                  if (colorName && !seenColors.has(colorName.toLowerCase().trim())) {
                    const hex = getColorHex(colorName);
                    if (hex) {
                      seenColors.add(colorName.toLowerCase().trim());
                      colorVariants.push({ name: colorName.trim(), hex });
                    }
                  }
                }
                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    slug={product.slug}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.compare_at_price}
                    image={product.product_images?.[0]?.url || '/logo.png'}
                    rating={product.rating_avg || 5}
                    reviewCount={product.review_count || 0}
                    badge={product.featured ? 'Featured' : undefined}
                    inStock={effectiveStock > 0}
                    maxStock={effectiveStock || 50}
                    moq={product.moq || 1}
                    hasVariants={hasVariants}
                    minVariantPrice={minVariantPrice}
                    colorVariants={colorVariants}
                  />
                );
              })}
            </AnimatedGrid>
          )}
        </section>
      )}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-16">
        <NewsletterSection />
      </div>
    </main>
  );
}
