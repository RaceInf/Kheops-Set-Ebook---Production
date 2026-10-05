import type { MetadataRoute } from 'next';
import { ALL_PRODUCTS } from '@/lib/products';
import { getValidSiteUrl } from '@/lib/safe-url';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getValidSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL
  )
    .toString()
    .replace(/\/$/, '');
  const lastModified = new Date();

  // Pages statiques publiques principales
  const staticRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/ebooks', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/ressource-gratuite', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/a-propos', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/faq', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/mentions-legales', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/confidentialite', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/conditions', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/remboursement', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  // Pages produits publiées et disponibles uniquement (Le Capital & Le Code)
  const productRoutes = ALL_PRODUCTS.map((p) => ({
    path: `/ebooks/${p.slug}`,
    priority: 0.95,
    changeFrequency: 'weekly' as const,
    lastModified: p.updatedDate ? new Date(p.updatedDate) : lastModified,
  }));

  const allEntries = [
    ...staticRoutes.map((r) => ({
      url: `${baseUrl}${r.path}`,
      lastModified,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...productRoutes.map((r) => ({
      url: `${baseUrl}${r.path}`,
      lastModified: r.lastModified,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
  ];

  return allEntries;
}
