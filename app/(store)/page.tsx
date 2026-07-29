'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard, { type ColorVariant, getColorHex } from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton';
import AnimatedSection, { AnimatedGrid } from '@/components/AnimatedSection';
import NewsletterSection from '@/components/NewsletterSection';
import { usePageTitle } from '@/hooks/usePageTitle';
import { getSiteName, getSiteTagline } from '@/lib/site-defaults';

const HOME_CATEGORY_TINTS = ['bg-slate-800', 'bg-stone-800', 'bg-zinc-800', 'bg-neutral-800', 'bg-gray-800', 'bg-slate-900', 'bg-stone-900', 'bg-zinc-900'];

export default function Home() {
  usePageTitle('');
  const siteName = getSiteName();
  const tagline = getSiteTagline();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [homeCategories, setHomeCategories] = useState<
    { id: string; name: string; display_name: string; slug: string; subtitle: string; image: string; tint: string }[]
  >([]);
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
                c.metadata?.featured === true && c.image_url
            );
            const withImage = catRows.filter((c: { image_url?: string }) => c.image_url);
            const source = featured.length > 0 ? featured : withImage;
            setHomeCategories(
              source.slice(0, 8).map((c: any, i: number) => ({
                id: c.id,
                name: c.name,
                display_name: c.metadata?.display_name || c.name,
                slug: c.slug,
                subtitle:
                  (c.description || '').trim().slice(0, 120) ||
                  c.metadata?.subtitle ||
                  'Browse this collection',
                image: c.image_url as string,
                tint: HOME_CATEGORY_TINTS[i % HOME_CATEGORY_TINTS.length],
              }))
            );
          } else {
            setHomeCategories([]);
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
      {/* Hero — neutral starter composition */}
      <section className="relative w-full min-h-[85vh] md:min-h-[92vh] overflow-hidden flex items-center">
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-stone-700"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, white 0.5px, transparent 0.5px), radial-gradient(circle at 80% 70%, white 0.5px, transparent 0.5px)',
            backgroundSize: '48px 48px',
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" aria-hidden />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 md:px-10 py-24 text-center">
          <p className="font-serif text-4xl sm:text-5xl md:text-6xl text-white tracking-tight mb-6 drop-shadow-lg animate-fade-in-up">
            {siteName}
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-white/95 mb-5 leading-snug animate-fade-in-up" style={{ animationDelay: '80ms' }}>
            Build something exceptional.
          </h1>
          <p className="text-base md:text-lg text-white/70 max-w-xl mx-auto mb-10 font-light leading-relaxed animate-fade-in-up" style={{ animationDelay: '160ms' }}>
            This repository has been prepared as a clean foundation for a new digital product.
            {tagline && tagline !== 'Build something exceptional.' ? ` ${tagline}` : ''}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '240ms' }}>
            <Link
              href="/shop"
              className="px-10 py-3.5 bg-white text-slate-900 rounded-lg font-medium text-base hover:bg-stone-100 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/about"
              className="px-10 py-3.5 border border-white/40 text-white rounded-lg font-medium text-base hover:bg-white/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Feature placeholders */}
      <section className="py-20 md:py-28 bg-stone-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl text-gray-900 mb-3">A solid foundation</h2>
            <p className="text-gray-600 max-w-lg mx-auto">
              Reusable storefront, admin, and commerce modules — ready for your content.
            </p>
          </AnimatedSection>
          <AnimatedGrid className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {[
              { title: 'Storefront', body: 'Shop, cart, checkout, and account flows you can brand and extend.' },
              { title: 'Admin', body: 'Products, orders, customers, and content management out of the box.' },
              { title: 'Integrations', body: 'Payments, email, and SMS hooks — configure when credentials are ready.' },
            ].map((item) => (
              <div key={item.title} className="text-center md:text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </AnimatedGrid>
        </div>
      </section>

      {homeCategories.length > 0 && (
        <section className="py-20 md:py-28 bg-white relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
            <AnimatedSection className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <h2 className="font-serif text-4xl sm:text-5xl text-gray-900 leading-[1.1]">
                  Shop by <span className="italic text-gray-400">Category</span>
                </h2>
              </div>
              <Link
                href="/categories"
                className="group flex items-center justify-center w-14 h-14 rounded-full border border-gray-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300"
              >
                <i className="ri-arrow-right-line text-xl transition-transform group-hover:translate-x-1"></i>
              </Link>
            </AnimatedSection>

            <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {homeCategories.map((category) => (
                <Link href={`/shop?category=${encodeURIComponent(category.slug)}`} key={category.id} className="group block h-full w-full">
                  <div className="relative aspect-[3/4] overflow-hidden isolate bg-gray-900 shadow-xl rounded-2xl">
                    <div className="absolute inset-0 transition-transform duration-[1500ms] ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={category.image}
                        alt={category.name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                    <div className={`absolute inset-0 ${category.tint} mix-blend-overlay opacity-40`} />
                    <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                      <h3 className="font-serif text-3xl text-white leading-[0.9] mb-3 drop-shadow-xl">
                        {category.display_name || category.name}
                      </h3>
                      <div className="h-[1px] w-12 bg-white/60 mb-4 transition-all duration-700 group-hover:w-full" />
                      <p className="text-white/80 font-light text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                        {category.subtitle}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </AnimatedGrid>
          </div>
        </section>
      )}

      <section className="py-16 md:py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {loading || featuredProducts.length > 0
                ? 'Products marked as featured in admin appear here.'
                : 'No products have been added yet. Configure the catalog in admin to begin.'}
            </p>
          </AnimatedSection>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-8">
              {[...Array(4)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl bg-white/60">
              <p className="text-gray-500 mb-6">No featured products yet.</p>
              <Link href="/admin/products" className="text-sm font-medium text-slate-800 underline underline-offset-4">
                Open admin catalog
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
              className="inline-flex items-center justify-center bg-gray-900 text-white px-10 py-4 rounded-lg font-medium hover:bg-slate-800 transition-all"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <NewsletterSection />
    </main>
  );
}
