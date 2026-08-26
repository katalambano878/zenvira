'use client';

import { useEffect } from 'react';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Sika Homes';
const DEFAULT_TAGLINE =
  process.env.NEXT_PUBLIC_SITE_TAGLINE ||
  'Furniture, sofas & interiors for beautiful homes in Ghana.';

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title
      ? `${title} | ${SITE_NAME}`
      : `${SITE_NAME} | ${DEFAULT_TAGLINE}`;
  }, [title]);
}
