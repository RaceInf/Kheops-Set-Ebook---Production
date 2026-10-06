import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { PriceDisplay } from '@/components/ui/price-display';
import { FeaturedBookCard } from '@/components/products/FeaturedBookCard';
import { BookPreviewReader } from '@/components/products/BookPreviewReader';
import { ProductExecutionTabs } from '@/components/products/ProductExecutionTabs';
import {
  getProductBySlug,
  getChariowCheckoutUrl,
  calculatePriceInfo,
} from '@/lib/products';
import {
  IconPdf,
  IconRuler,
  IconBlueprint,
  IconCheck,
} from '@/components/icons/kheops-icons';
import { serializeJsonLd } from '@/lib/structured-data';
import { getValidSiteUrl } from '@/lib/safe-url';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Catalogue Ebooks | Kheops Set',
    };
  }

  return {
    title: product.seoTitle,
    description: product.seoDescription,
    alternates: {
      canonical: `/ebooks/${product.slug}`,
    },
    openGraph: {
      title: product.seoTitle,
      description: product.seoDescription,
      type: 'book',
      images: [
        {
          url: product.coverImage,
          width: 900,
          height: 1200,
          alt: product.coverAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.seoTitle,
      description: product.seoDescription,
      images: [product.coverImage],
    },
  };
}

export default async function EbookProductPage({ params }: PageProps) {
  const { slug } = await params;
  const ebook = getProductBySlug(slug);

  if (!ebook) {
    notFound();
  }

  const checkoutUrl = getChariowCheckoutUrl(ebook.chariowUrl, ebook.slug);
  const priceInfo = calculatePriceInfo(ebook);
  const appUrl = getValidSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL
  )
    .toString()
    .replace(/\/$/, '');

  const relatedProducts = ebook.relatedEbooks
    .map((relSlug) => getProductBySlug(relSlug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Accueil',
          item: `${appUrl}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Ebooks',
          item: `${appUrl}/ebooks`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: ebook.title,
          item: `${appUrl}/ebooks/${ebook.slug}`,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: ebook.title,
      description: ebook.longDescription,
      image: `${appUrl}${ebook.coverImage}`,
      brand: {
        '@type': 'Brand',
        name: 'Kheops Set',
      },
      offers: {
        '@type': 'Offer',
        price: String(priceInfo.activePriceXaf),
        priceCurrency: 'XAF',
        availability: 'https://schema.org/InStock',
        url: checkoutUrl,
      },
    },
    ...(ebook.faq.length > 0
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: ebook.faq.map((q) => ({
              '@type': 'Question',
              name: q.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: q.answer,
              },
            })),
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#090909] text-[#FFFFFF]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1 pt-28 pb-24">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumbs */}
          <nav aria-label="Fil d'Ariane" className="font-mono text-xs text-[#A5A5A0]">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-[#FFFFFF] transition-colors">
                  Accueil
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/ebooks" className="hover:text-[#FFFFFF] transition-colors">
                  Ebooks
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-[#EEB149]" aria-current="page">
                {ebook.title}
              </li>
            </ol>
          </nav>

          {/* Product Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pb-20 border-b border-[#565A5C]/35">
            {/* Left: Sticky Cover Showcase */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 border border-[#565A5C]/45 bg-[#151515]/80 p-8 sm:p-12 flex flex-col items-center justify-center">
              <div className="w-full flex items-center justify-between font-mono text-[11px] text-[#A5A5A0] mb-6">
                <span>{ebook.tag}</span>
                {priceInfo.isOnSale && priceInfo.salePercentageText && (
                  <span className="text-[#EEB149] font-semibold">
                    PROMO {priceInfo.salePercentageText}
                  </span>
                )}
              </div>

              <div className="perspective-1200">
                <div
                  className="relative w-[250px] sm:w-[290px] aspect-[3/4.2] bg-[#090909] border border-[#565A5C]/60 shadow-[20px_24px_50px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col justify-between p-6 sm:p-7"
                  style={{ transform: 'rotateY(-8deg) rotateX(2deg)' }}
                >
                  <div
                    aria-hidden="true"
                    className="absolute top-0 left-0 right-0 h-[2px] bg-[#EEB149]"
                  />
                  <div className="absolute inset-0 z-0 opacity-85">
                    <Image
                      src={ebook.coverImage}
                      alt={ebook.coverAlt}
                      fill
                      priority
                      sizes="(max-width: 640px) 250px, 290px"
                      referrerPolicy="no-referrer"
                      className="object-cover object-center"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-b from-[#090909]/92 via-[#090909]/25 to-[#090909]/95"
                    />
                  </div>

                  <div className="relative z-10 text-center space-y-1">
                    <span className="inline-block font-mono text-[9px] tracking-[0.22em] text-[#EEB149]">
                      {ebook.tag}
                    </span>
                    <p className="font-display text-2xl font-extrabold tracking-[0.06em] text-[#FFFFFF] uppercase leading-tight">
                      {ebook.title}
                    </p>
                  </div>

                  <div className="relative z-10 text-center space-y-3 pt-4 border-t border-[#565A5C]/35">
                    <p className="text-xs text-[#F3F1EB] leading-snug">
                      {ebook.subtitle}
                    </p>
                    <p className="font-mono text-[11px] tracking-[0.32em] text-[#EEB149] font-semibold">
                      KHEOPS SET
                    </p>
                  </div>
                </div>
              </div>

              {ebook.previewPages && ebook.previewPages.length > 0 && (
                <a
                  href="#apercu-liseuse"
                  className="mt-6 w-full py-3 px-4 border border-[#EEB149]/60 bg-[#090909] text-center font-mono text-xs font-semibold text-[#EEB149] hover:bg-[#EEB149] hover:text-[#090909] transition-colors"
                >
                  FEUILLETER UN EXTRAIT ({ebook.previewPages.length} PAGES)
                </a>
              )}
            </div>

            {/* Right: Product Purchase Module */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                  <span className="px-2.5 py-0.5 bg-[#EEB149] text-[#090909] font-bold tracking-wider">
                    {ebook.tag}
                  </span>
                  <span className="text-[#A5A5A0]">{ebook.category.toUpperCase()}</span>
                </div>

                <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFFFF]">
                  {ebook.title}
                </h1>

                <p className="text-lg sm:text-xl text-[#F3F1EB] font-medium leading-snug">
                  “{ebook.shortDescription}”
                </p>

                <p className="text-sm sm:text-base text-[#A5A5A0] leading-relaxed pt-2">
                  {ebook.longDescription}
                </p>
              </div>

              {/* Technical Specs Bar */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 bg-[#151515] border border-[#565A5C]/40">
                  <div className="flex items-center justify-between text-xs font-mono text-[#A5A5A0] mb-1">
                    <span>FORMAT</span>
                    <IconPdf className="w-4 h-4 text-[#EEB149]" />
                  </div>
                  <p className="font-mono text-sm font-semibold text-[#FFFFFF]">
                    {ebook.productType}
                  </p>
                </div>

                <div className="p-4 bg-[#151515] border border-[#565A5C]/40">
                  <div className="flex items-center justify-between text-xs font-mono text-[#A5A5A0] mb-1">
                    <span>VOLUME</span>
                    <IconRuler className="w-4 h-4 text-[#EEB149]" />
                  </div>
                  <p className="font-mono text-sm font-semibold text-[#FFFFFF] tabular-nums">
                    {ebook.pageCount} pages
                  </p>
                </div>

                <div className="p-4 bg-[#151515] border border-[#565A5C]/40">
                  <div className="flex items-center justify-between text-xs font-mono text-[#A5A5A0] mb-1">
                    <span>LANGUE</span>
                    <IconBlueprint className="w-4 h-4 text-[#EEB149]" />
                  </div>
                  <p className="font-mono text-sm font-semibold text-[#FFFFFF]">
                    {ebook.language}
                  </p>
                </div>
              </div>

              {/* Price with Strikethrough + Promo Badge & Chariow CTA Box */}
              <div className="p-6 sm:p-8 bg-[#151515] border border-[#EEB149]/60 space-y-6">
                <PriceDisplay
                  amountInXAF={ebook.priceXaf}
                  originalPriceXaf={ebook.originalPriceXaf}
                  salePriceXaf={ebook.salePriceXaf}
                  salePercentage={ebook.salePercentage}
                  isOnSale={ebook.isOnSale}
                  saleEndsAt={ebook.saleEndsAt}
                  showSelector={true}
                  size="lg"
                />

                <div className="space-y-3 pt-2 border-t border-[#565A5C]/30">
                  <a
                    href={checkoutUrl}
                    className="flex items-center justify-center w-full py-4 px-6 text-sm font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors"
                  >
                    {ebook.ctaLabel}
                  </a>
                  <p className="text-xs text-center text-[#A5A5A0]">
                    {ebook.ctaSubtext}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Core Interactive Dossier: ProductExecutionTabs */}
          <section aria-label="Dossier d’exécution technique du livre" className="pt-8">
            <ProductExecutionTabs product={ebook} />
          </section>

          {/* Liseuse d'aperçu interactive */}
          {ebook.previewPages && ebook.previewPages.length > 0 && (
            <div className="py-12 border-b border-[#565A5C]/35">
              <BookPreviewReader product={ebook} id="apercu-liseuse" />
            </div>
          )}

          {/* Extrait authentique du livre */}
          {ebook.excerpt && (
            <section aria-labelledby="excerpt-heading" className="py-12 space-y-8 border-b border-[#565A5C]/35">
              <div className="space-y-2">
                <p className="font-mono text-xs text-[#EEB149]">APERÇU DU TEXTE</p>
                <h2 id="excerpt-heading" className="font-display text-3xl font-bold text-[#FFFFFF]">
                  {ebook.excerpt.title}
                </h2>
              </div>

              <blockquote className="p-8 sm:p-12 bg-[#F3F1EB] text-[#090909] border-l-4 border-[#EEB149] space-y-4">
                <p className="font-display text-xl sm:text-2xl font-bold text-[#090909]">
                  {ebook.excerpt.quote}
                </p>
                <p className="text-base text-[#151515] leading-relaxed">
                  {ebook.excerpt.body}
                </p>
                <footer className="font-mono text-xs text-[#565A5C] pt-2">
                  — {ebook.excerpt.reference}
                </footer>
              </blockquote>
            </section>
          )}

          {/* Produit réel associé */}
          {relatedProducts.length > 0 && (
            <section aria-labelledby="related-book-heading" className="py-12 space-y-6">
              <div className="space-y-1">
                <p className="font-mono text-xs text-[#EEB149]">OUTIL COMPLÉMENTAIRE</p>
                <h2
                  id="related-book-heading"
                  className="font-display text-2xl sm:text-3xl font-bold text-[#FFFFFF]"
                >
                  À lire en complément
                </h2>
              </div>

              <div className="max-w-xl">
                {relatedProducts.map((rel) => (
                  <FeaturedBookCard key={rel.id} product={rel} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Bottom Product CTA */}
        <div className="mx-auto max-w-[920px] px-4 pt-16 text-center space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#FFFFFF]">
            Prêt à passer à l’exécution ?
          </h2>
          <div className="flex flex-col items-center space-y-3">
            <a
              href={checkoutUrl}
              className="px-10 py-4 text-sm font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors"
            >
              {ebook.ctaLabel}
            </a>
            <p className="text-xs text-[#A5A5A0]">{ebook.ctaSubtext}</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
