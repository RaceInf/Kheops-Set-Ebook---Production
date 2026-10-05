import type { MetadataRoute } from 'next';
import { getValidSiteUrl } from '@/lib/safe-url';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getValidSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL
  )
    .toString()
    .replace(/\/$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/preview/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
