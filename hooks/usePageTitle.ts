'use client';

import { useEffect } from 'react';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'New Project';
const DEFAULT_TAGLINE =
  process.env.NEXT_PUBLIC_SITE_TAGLINE || 'Build something exceptional.';

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title
      ? `${title} | ${SITE_NAME}`
      : `${SITE_NAME} | ${DEFAULT_TAGLINE}`;
  }, [title]);
}
