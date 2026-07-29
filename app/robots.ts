import { MetadataRoute } from 'next';

/** Starter default: disallow indexing until new project content is ready. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: '/',
      },
    ],
  };
}
