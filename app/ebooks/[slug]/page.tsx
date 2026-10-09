import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ProductDetailPageExperience } from '@/components/products/ProductDetailPageExperience';
import { AVAILABLE_PRODUCTS, getProductBySlug } from '@/lib/products';
import { serializeJsonLd } from '@/lib/structured-data';

interface EbookDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return AVAILABLE_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: EbookDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Manuel non trouvé | Kheops Set',
      description: 'Le manuel demandé n’est pas répertorié dans la salle des plans.',
    };
  }

  const title = `${product.title} — Manuel d’Ingénierie (${product.format}) | Kheops Set`;
  const description = product.seoDescription || product.shortDescription;

  return {
    title,
    description,
    alternates: {
      canonical: `/ebooks/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/ebooks/${product.slug}`,
      type: 'book',
      images: [
        {
          url: product.coverImage,
          width: 800,
          height: 1100,
          alt: product.coverAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} — Kheops Set`,
      description,
      images: [product.coverImage],
    },
  };
}

export default async function EbookDetailPage({ params }: EbookDetailPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: 'https://kheops-set-ebook-mu.vercel.app/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Catalogue Ebooks',
        item: 'https://kheops-set-ebook-mu.vercel.app/ebooks',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.title,
        item: `https://kheops-set-ebook-mu.vercel.app/ebooks/${product.slug}`,
      },
    ],
  };

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: product.title,
    headline: product.subtitle,
    description: product.shortDescription,
    image: product.coverImage,
    bookFormat: 'https://schema.org/EBook',
    numberOfPages: typeof product.pageCount === 'number' ? product.pageCount : undefined,
    inLanguage: 'fr',
    author: {
      '@type': 'Organization',
      name: 'Kheops Set',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kheops Set',
    },
    offers: {
      '@type': 'Offer',
      price: product.priceXaf,
      priceCurrency: 'XAF',
      availability: 'https://schema.org/InStock',
      url: product.chariowUrl,
      seller: {
        '@type': 'Organization',
        name: 'Kheops Set',
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090909] text-[#FFFFFF]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(productJsonLd) }}
      />

      <Navbar />

      <main id="main-content" className="flex-1 pt-28 pb-32 sm:pb-40 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1360px] space-y-8 sm:space-y-12">
          {/* Breadcrumbs */}
          <nav aria-label="Fil d'Ariane" className="font-mono text-xs text-[#A5A5A0] pb-2">
            <ol className="flex items-center gap-2 flex-wrap">
              <li>
                <Link href="/" className="hover:text-[#FFFFFF] transition-colors">
                  Accueil
                </Link>
              </li>
              <li aria-hidden="true" className="text-[#565A5C]">/</li>
              <li>
                <Link href="/ebooks" className="hover:text-[#FFFFFF] transition-colors">
                  Catalogue ebooks
                </Link>
              </li>
              <li aria-hidden="true" className="text-[#565A5C]">/</li>
              <li className="text-[#EEB149] font-semibold" aria-current="page">
                {product.title}
              </li>
            </ol>
          </nav>

          {/* Sales Page Experience */}
          <ProductDetailPageExperience product={product} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
