import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { PageImmersion } from '@/components/animations/page-immersion';
import { EbooksCatalogExperience } from '@/components/catalog/EbooksCatalogExperience';
import { serializeJsonLd } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'La Salle des Plans — Catalogue des Manuels | Kheops Set',
  description:
    'Découvre les manuels d’ingénierie Kheops Set : Le Capital du Bâtisseur et Le Code du Bâtisseur. Des protocoles fermés, concrets et immédiatement applicables.',
  alternates: {
    canonical: '/ebooks',
  },
  openGraph: {
    title: 'La Salle des Plans — Catalogue des Manuels | Kheops Set',
    description:
      'Découvre les manuels d’ingénierie Kheops Set : Le Capital du Bâtisseur et Le Code du Bâtisseur. Des protocoles fermés, concrets et immédiatement applicables.',
    url: '/ebooks',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Salle des Plans — Catalogue des Manuels | Kheops Set',
    description:
      'Découvre les manuels d’ingénierie Kheops Set : Le Capital du Bâtisseur et Le Code du Bâtisseur.',
  },
};

export default function EbooksCatalogPage() {
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
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090909] text-[#FFFFFF]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <Navbar />

      <main id="main-content" className="flex-1 pt-28 pb-32 sm:pb-40 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1360px] space-y-12">
          <PageImmersion>
            {/* Breadcrumbs */}
            <nav aria-label="Fil d'Ariane" className="font-mono text-xs text-[#A5A5A0] pb-2">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-[#FFFFFF] transition-colors">
                    Accueil
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-[#EEB149]" aria-current="page">
                  Catalogue ebooks
                </li>
              </ol>
            </nav>

            {/* Expérience Catalogue Complète et Moderne */}
            <EbooksCatalogExperience />
          </PageImmersion>
        </div>
      </main>

      <Footer />
    </div>
  );
}
