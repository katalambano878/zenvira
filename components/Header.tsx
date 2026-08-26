'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MiniCart from './MiniCart';
import { useCart } from '@/context/CartContext';
import { api } from '@/lib/api';
import { useCMS } from '@/context/CMSContext';
import { getWordmark } from '@/lib/site-defaults';

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/categories' },
  { label: 'Rooms', href: '/categories' },
  { label: 'About Us', href: '/about' },
  { label: 'Blog', href: '/blog' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistCount, setWishlistCount] = useState(0);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  const { cartCount, isCartOpen, setIsCartOpen } = useCart();
  const { getSetting } = useCMS();

  const siteName = getSetting('site_name') || process.env.NEXT_PUBLIC_SITE_NAME || 'Sika Homes';
  const wordmark = getWordmark();
  const waRaw = getSetting('contact_whatsapp') || process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || '';
  const waDigits = waRaw.replace(/\D/g, '');
  const consultHref = waDigits
    ? `https://wa.me/${waDigits.startsWith('0') ? `233${waDigits.slice(1)}` : waDigits}`
    : '/contact';

  useEffect(() => {
    const updateWishlistCount = () => {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistCount(wishlist.length);
    };
    updateWishlistCount();
    window.addEventListener('wishlistUpdated', updateWishlistCount);

    const checkUser = async () => {
      try {
        const me = await api<{ user: { id: string; email: string } | null }>('/api/auth/me');
        setUser(me.user);
      } catch {
        setUser(null);
      }
    };
    checkUser();

    return () => window.removeEventListener('wishlistUpdated', updateWishlistCount);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <header className="bg-store-cream/95 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200/60">
        <div className="safe-area-top" />
        <nav aria-label="Main navigation">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="h-[4.5rem] md:h-20 grid grid-cols-[auto_1fr_auto] items-center gap-3">
              <div className="flex items-center gap-3">
                <button
                  className="lg:hidden p-2 -ml-2 text-store-ink"
                  onClick={() => setIsMobileMenuOpen(true)}
                  aria-label="Open menu"
                >
                  <i className="ri-menu-line text-2xl" />
                </button>
                <Link href="/" className="select-none" aria-label={`${wordmark} — home`}>
                  <span className="font-serif text-xl sm:text-2xl tracking-[0.04em] text-store-ink uppercase">
                    {wordmark}
                  </span>
                </Link>
              </div>

              <div className="hidden lg:flex items-center justify-center gap-8 xl:gap-10">
                {NAV.map((link) => (
                  <Link
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    className="text-[13px] tracking-wide text-store-ink/80 hover:text-store-ink transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="flex items-center justify-end gap-1 sm:gap-2">
                <button
                  className="p-2 text-store-ink/80 hover:text-store-ink"
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Search"
                >
                  <i className="ri-search-line text-xl" />
                </button>

                <Link
                  href={user ? '/account' : '/auth/login'}
                  className="p-2 text-store-ink/80 hover:text-store-ink hidden sm:inline-flex"
                  aria-label="Account"
                >
                  <i className="ri-user-line text-xl" />
                </Link>

                <div className="relative">
                  <button
                    className="p-2 text-store-ink/80 hover:text-store-ink"
                    onClick={() => setIsCartOpen(!isCartOpen)}
                    aria-label="Cart"
                  >
                    <i className="ri-shopping-bag-line text-xl" />
                    {cartCount > 0 && (
                      <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-store-sage text-[10px] font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <MiniCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                </div>

                <Link
                  href={consultHref}
                  target={waDigits ? '_blank' : undefined}
                  rel={waDigits ? 'noopener noreferrer' : undefined}
                  className="hidden md:inline-flex ml-2 items-center rounded-full bg-store-sage px-5 py-2.5 text-xs font-medium tracking-wide text-white hover:bg-store-sageDark transition-colors"
                >
                  Book a Consultation
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {isSearchOpen && (
        <div className="fixed inset-0 bg-store-ink/40 z-50 flex items-start justify-center pt-24 px-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-soft">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-2xl text-store-ink">Search furniture</h3>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-store-muted"
                  aria-label="Close search"
                >
                  <i className="ri-close-line text-2xl" />
                </button>
              </div>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Sofas, beds, dining sets…"
                    className="w-full px-4 py-3.5 pr-12 border border-stone-200 rounded-full focus:ring-2 focus:ring-store-sage/30 focus:border-store-sage text-base bg-store-cream"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-store-sage"
                  >
                    <i className="ri-search-line text-xl" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-store-ink/40" onClick={() => setIsMobileMenuOpen(false)} aria-hidden />
          <div className="absolute top-0 left-0 bottom-0 w-[85%] max-w-xs bg-store-cream shadow-xl flex flex-col">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <span className="font-serif text-xl uppercase tracking-wide">{wordmark}</span>
              <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu" className="p-2">
                <i className="ri-close-line text-2xl" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {NAV.map((link) => (
                <Link
                  key={`${link.label}-m`}
                  href={link.href}
                  className="block px-4 py-3 text-base text-store-ink rounded-xl hover:bg-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-stone-200 my-3" />
              <Link href="/wishlist" className="block px-4 py-3" onClick={() => setIsMobileMenuOpen(false)}>
                Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ''}
              </Link>
              <Link href="/contact" className="block px-4 py-3" onClick={() => setIsMobileMenuOpen(false)}>
                Book a Consultation
              </Link>
            </nav>
            <div className="p-4 text-center text-xs text-store-muted border-t border-stone-200">
              © {new Date().getFullYear()} {siteName}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
