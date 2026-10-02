import type { MetadataRoute } from 'next';
import { MAIN_EBOOK } from '@/lib/ebooks-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL || 'https://kheopsset.com';
  const lastModified = new Date();

  const routes = [
    '',
    '/ebooks',
    `/ebooks/${MAIN_EBOOK.slug}`,
    '/a-propos',
    '/ressource-gratuite',
    '/faq',
    '/contact',
    '/mentions-legales',
    '/confidentialite',
    '/conditions',
    '/remboursement',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === '' || route.startsWith('/ebooks') ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route.startsWith('/ebooks/') ? 0.9 : 0.7,
  }));
}
