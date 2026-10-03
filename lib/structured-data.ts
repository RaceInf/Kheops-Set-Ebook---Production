import type { Product } from '@/lib/products';

/**
 * Nettoie et sérialise un objet JSON-LD en neutralisant les balises HTML (<)
 * pour prévenir toute vulnérabilité d'injection XSS dans les scripts JSON-LD.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/**
 * Schéma Schema.org pour l'Organisation / Marque
 */
export function buildOrganizationJsonLd(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Kheops Set',
    url: baseUrl,
    logo: `${baseUrl}/images/monolith-gold-fissure.jpg`,
    description:
      'Marque éditoriale anonyme. Outils et plans concrets pour reprendre le contrôle de ton argent, de ton temps et de tes décisions.',
    slogan: 'L’Acier Bienveillant · Une vie est un chantier.',
    sameAs: [
      'https://www.facebook.com/kheops.set/',
      'https://www.instagram.com/kheopset.motivation/',
      'https://chat.whatsapp.com/JM5y9X4rV3lEmds6fVr5vz',
    ],
  };
}

/**
 * Schéma Schema.org pour le Site Web
 */
export function buildWebSiteJsonLd(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Kheops Set',
    url: baseUrl,
    inLanguage: 'fr-FR',
    description:
      'Livres numériques et protocoles d’action pour bâtir une souveraineté financière et personnelle.',
  };
}

/**
 * Schéma Schema.org pour un Produit Ebook
 */
export function buildProductJsonLd(product: Product, checkoutUrl: string, baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.longDescription || product.shortDescription,
    image: `${baseUrl}${product.coverImage}`,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: 'Kheops Set',
    },
    offers: {
      '@type': 'Offer',
      price: String(product.salePriceXaf || product.priceXaf),
      priceCurrency: 'XAF',
      availability:
        product.availability === 'InStock'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/PreOrder',
      url: checkoutUrl,
      seller: {
        '@type': 'Organization',
        name: 'Kheops Set (via Chariow)',
      },
    },
  };
}

/**
 * Schéma Schema.org pour les fils d'Ariane (Breadcrumbs)
 */
export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Schéma Schema.org pour les FAQs visibles
 */
export function buildFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
