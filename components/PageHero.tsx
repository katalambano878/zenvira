import React from 'react';
import Image from 'next/image';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  /** Optional small label above the title (defaults off). */
  eyebrow?: string;
}

export default function PageHero({ title, subtitle, backgroundImage, eyebrow }: PageHeroProps) {
  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center min-h-[50vh] md:min-h-[60vh] ${
        !backgroundImage ? 'bg-store-ink' : ''
      }`}
    >
      {backgroundImage ? (
        <>
          <Image
            src={backgroundImage}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={80}
          />
          <div className="absolute inset-0 bg-black/50" />
        </>
      ) : (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        </div>
      )}

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 text-center z-10 flex flex-col items-center">
        {eyebrow ? (
          <div className="mb-6">
            <span className="inline-block py-1 px-4 text-white/90 text-sm tracking-[0.3em] uppercase font-semibold border border-white/20 rounded-full backdrop-blur-md bg-white/5">
              {eyebrow}
            </span>
          </div>
        ) : null}

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif italic font-medium text-white mb-6 leading-[1.1] drop-shadow-2xl">
          {title}
        </h1>

        {subtitle ? (
          <p className="text-base md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-lg">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}
