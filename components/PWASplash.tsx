'use client';

import { useState, useEffect } from 'react';
import { getWordmark, getSiteName, getSiteTagline } from '@/lib/site-defaults';

export default function PWASplash() {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    const hasShownSplash = sessionStorage.getItem('splashShown');

    if (isStandalone && !hasShownSplash) {
      setShowSplash(true);
      sessionStorage.setItem('splashShown', 'true');

      const timer = setTimeout(() => setShowSplash(false), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!showSplash) return null;

  return (
    <div className="pwa-splash" aria-hidden="true">
      <div className="pwa-splash-logo mb-4">
        <img src="/logo.png" alt="" className="w-20 h-20 object-contain mx-auto" />
      </div>
      <h1 className="text-white text-lg font-medium font-sans mb-2 opacity-90">{getSiteName()}</h1>
      <p className="text-blue-200 text-sm font-medium mb-8">{getWordmark()} — {getSiteTagline()}</p>
      <div className="pwa-splash-dots flex gap-1.5">
        <span className="w-2 h-2 bg-white rounded-full" />
        <span className="w-2 h-2 bg-white rounded-full" />
        <span className="w-2 h-2 bg-white rounded-full" />
      </div>
    </div>
  );
}
