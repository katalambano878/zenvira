import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import {
  getSiteName,
  getSiteTagline,
  getDefaultMetaDescription,
  getDefaultTitleSuffix,
  getContactEmail,
  getContactAddress,
  getContactPhoneTel,
} from "@/lib/site-defaults";
import "./globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2563eb',
};

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://example.com';
const siteName = getSiteName();
const titleSuffix = getDefaultTitleSuffix();
const metaDesc = getDefaultMetaDescription();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: titleSuffix,
    template: `%s | ${siteName}`,
  },
  description: metaDesc,
  keywords: [
    siteName,
    "online store",
    "retail",
    "wholesale",
    "e-commerce",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  applicationName: siteName,
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/neww.png', sizes: 'any', type: 'image/png' },
    ],
    shortcut: '/neww.png',
    apple: '/neww.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: siteName,
  },
  formatDetection: {
    telephone: true,
    email: false,
    address: false,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  openGraph: {
    type: "website",
    locale: "en",
    url: siteUrl,
    title: titleSuffix,
    description: metaDesc,
    siteName,
    images: [
      {
        url: "/neww.png",
        width: 1200,
        height: 630,
        alt: `${siteName} — ${getSiteTagline()}`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: titleSuffix,
    description: metaDesc,
    images: ["/neww.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "shopping",
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

function buildOrganizationJsonLd(): Record<string, unknown> {
  const org: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl.replace(/\/$/, '')}/neww.png`,
    description: metaDesc,
  };
  const addr = getContactAddress();
  if (addr) {
    org.address = {
      "@type": "PostalAddress",
      streetAddress: addr,
      addressCountry: "GH",
    };
  }
  const tel = getContactPhoneTel();
  const email = getContactEmail();
  const contactPoint: Record<string, unknown> = {
    "@type": "ContactPoint",
    contactType: "customer service",
    email,
    availableLanguage: "English",
  };
  if (tel) contactPoint.telephone = tel;
  org.contactPoint = contactPoint;
  if (tel) org.telephone = tel;
  return org;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={siteName} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-tap-highlight" content="no" />

        <link rel="icon" href="/neww.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/neww.png" />

        <link rel="apple-touch-icon" href="/neww.png" />
        <link rel="apple-touch-startup-image" href="/neww.png" />

        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.1.0/fonts/remixicon.css"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router: fonts loaded in root layout apply to all pages */}
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildOrganizationJsonLd()),
          }}
        />
      </head>

      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {RECAPTCHA_SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
        />
      )}

      <body className="antialiased font-sans overflow-x-hidden pwa-body">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[10000] focus:px-6 focus:py-3 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:font-semibold focus:shadow-lg"
        >
          Skip to main content
        </a>
        <CartProvider>
          <WishlistProvider>
            <div id="main-content">
              {children}
            </div>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
