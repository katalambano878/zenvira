'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard, { type ColorVariant, getColorHex } from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton';
import AnimatedSection, { AnimatedGrid } from '@/components/AnimatedSection';
import NewsletterSection from '@/components/NewsletterSection';
import WhoWeAreSection from '@/components/WhoWeAreSection';
import { usePageTitle } from '@/hooks/usePageTitle';
import { getDefaultRoomCategories, getSiteName, getSiteTagline } from '@/lib/site-defaults';

const ROOM_FALLBACKS = getDefaultRoomCategories();

export default function Home() {
  usePageTitle('');
  const siteName = getSiteName();
  const tagline = getSiteTagline();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [homeCategories, setHomeCategories] = useState<
    { id: string; name: string; display_name: string; slug: string; subtitle: string; image?: string; tint: string }[]
  >([...ROOM_FALLBACKS]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/storefront/products?featured=true&limit=8'),
          fetch('/api/storefront/categories'),
        ]);

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setFeaturedProducts(Array.isArray(productsData) ? productsData : []);
        }

        if (categoriesRes.ok) {
          const catRows = await categoriesRes.json();
          if (Array.isArray(catRows) && catRows.length) {
            const featured = catRows.filter(
              (c: { metadata?: { featured?: boolean }; image_url?: string }) =>
                c.metadata?.featured === true
            );
            const source = featured.length > 0 ? featured : catRows;
            setHomeCategories(
              source.slice(0, 8).map((c: any, i: number) => ({
                id: c.id,
                name: c.name,
                display_name: c.metadata?.display_name || c.name,
                slug: c.slug,
                subtitle:
                  (c.description || '').trim().slice(0, 120) ||
                  c.metadata?.subtitle ||
                  'Shop this room',
                image: c.image_url as string | undefined,
                tint: ROOM_FALLBACKS[i % ROOM_FALLBACKS.length].tint,
              }))
            );
          }
        }
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error('Error fetching data:', msg);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <main className="flex-col items-center justify-between min-h-screen">
      {/* Hero — furniture / interiors composition */}
      <section className="relative w-full min-h-[88vh] md:min-h-[94vh] overflow-hidden flex items-end md:items-center">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,#3f3a32_0%,transparent_50%),radial-gradient(ellipse_at_80%_10%,#5c5346_0%,transparent_45%),linear-gradient(160deg,#1c1917_0%,#292524_45%,#44403c_100%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" aria-hidden />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 py-24 md:py-28">
          <p className="font-serif text-5xl sm:text-6xl md:text-7xl text-white tracking-tight mb-5 drop-shadow-lg animate-fade-in-up">
            {siteName}
          </p>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-light text-stone-100/95 mb-5 leading-snug max-w-2xl animate-fade-in-up" style={{ animationDelay: '80ms' }}>
            Sofas, furniture & interiors for homes that feel complete.
          </h1>
          <p className="text-base md:text-lg text-stone-300/90 max-w-xl mb-10 font-light leading-relaxed animate-fade-in-up" style={{ animationDelay: '160ms' }}>
            {tagline} Browse by room, shop online with Mobile Money, and furnish with confidence.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 animate-fade-in-up" style={{ animationDelay: '240ms' }}>
            <Link
              href="/shop"
              className="px-10 py-3.5 bg-amber-100 text-stone-900 rounded-md font-medium text-base hover:bg-white transition-colors text-center"
            >
              Shop Furniture
            </Link>
            <Link
              href="/categories"
              className="px-10 py-3.5 border border-white/35 text-white rounded-md font-medium text-base hover:bg-white/10 transition-colors text-center"
            >
              Shop by Room
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-stone-100 border-b border-stone-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <AnimatedGrid className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {[
              {
                title: 'Room-ready ranges',
                body: 'Sofas, beds, dining sets, décor and essentials organised by living room, bedroom, kitchen and more.',
              },
              {
                title: 'Built for Ghana buyers',
                body: 'Mobile-first shopping with secure Mobile Money checkout and WhatsApp support when you need a hand.',
              },
              {
                title: 'Delivery for real furniture',
                body: 'Large-item delivery and installation-friendly workflows so sofas and tables arrive ready for your space.',
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="font-serif text-xl text-stone-900 mb-2">{item.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </AnimatedGrid>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <AnimatedSection className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <h2 className="font-serif text-4xl sm:text-5xl text-stone-900 leading-[1.1]">
                Shop by <span className="italic text-stone-400">room</span>
              </h2>
              <p className="text-stone-600 mt-3 max-w-lg">
                Find sofas, beds, tables and décor by the spaces you are furnishing.
              </p>
            </div>
            <Link
              href="/categories"
              className="group flex items-center justify-center w-14 h-14 rounded-full border border-stone-200 hover:border-stone-900 hover:bg-stone-900 hover:text-white transition-all duration-300"
            >
              <i className="ri-arrow-right-line text-xl transition-transform group-hover:translate-x-1"></i>
            </Link>
          </AnimatedSection>

          <AnimatedGrid className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {homeCategories.map((category) => (
              <Link href={`/shop?category=${encodeURIComponent(category.slug)}`} key={category.id} className="group block h-full w-full">
                <div className="relative aspect-[3/4] overflow-hidden isolate bg-stone-900 shadow-lg">
                  {category.image ? (
                    <div className="absolute inset-0 transition-transform duration-[1500ms] ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={category.image}
                        alt={category.name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className={`absolute inset-0 ${category.tint}`} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent opacity-90" />
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end z-10">
                    <h3 className="font-serif text-2xl md:text-3xl text-white leading-[0.95] mb-2 drop-shadow-xl">
                      {category.display_name || category.name}
                    </h3>
                    <div className="h-px w-10 bg-amber-100/70 mb-3 transition-all duration-700 group-hover:w-full" />
                    <p className="text-white/75 font-light text-xs tracking-widest uppercase">
                      {category.subtitle}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </AnimatedGrid>
        </div>
      </section>

      <WhoWeAreSection />

      <section className="py-16 md:py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-stone-900 mb-4">Featured pieces</h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">
              {loading || featuredProducts.length > 0
                ? 'Hand-picked sofas, furniture and décor from the Sika Homes catalog.'
                : 'New furniture arrivals will appear here once products are added in admin.'}
            </p>
          </AnimatedSection>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-8">
              {[...Array(4)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-14 border border-dashed border-stone-300 bg-white/70">
              <p className="text-stone-500 mb-6">No featured furniture yet — browse the full shop or check back soon.</p>
              <Link href="/shop" className="text-sm font-medium text-stone-800 underline underline-offset-4">
                Browse all furniture
              </Link>
            </div>
          ) : (
            <AnimatedGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {featuredProducts.map((product) => {
                const variants = product.product_variants || [];
                const hasVariants = variants.length > 0;
                const minVariantPrice = hasVariants ? Math.min(...variants.map((v: any) => v.price || product.price)) : undefined;
                const totalVariantStock = hasVariants ? variants.reduce((sum: number, v: any) => sum + (v.quantity || 0), 0) : 0;
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

          <div className="text-center mt-16">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-stone-900 text-white px-10 py-4 rounded-md font-medium hover:bg-stone-800 transition-all"
            >
              View all furniture
            </Link>
          </div>
        </div>
      </section>

      <NewsletterSection />
    </main>
  );
}
