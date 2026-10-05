import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BookCard } from '@/components/products/BookCard';
import { PageImmersion } from '@/components/animations/page-immersion';
import { AVAILABLE_PRODUCTS } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Catalogue Ebooks — Kheops Set | Le Capital & Le Code du Bâtisseur',
  description:
    'Découvre les ebooks disponibles de Kheops Set : Le Capital du Bâtisseur et Le Code du Bâtisseur.',
  alternates: {
    canonical: '/ebooks',
  },
  openGraph: {
    title: 'Catalogue Ebooks — Kheops Set | Le Capital & Le Code du Bâtisseur',
    description:
      'Découvre les ebooks disponibles de Kheops Set : Le Capital du Bâtisseur et Le Code du Bâtisseur.',
    url: '/ebooks',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Catalogue Ebooks — Kheops Set',
    description:
      'Découvre les ebooks disponibles de Kheops Set : Le Capital du Bâtisseur et Le Code du Bâtisseur.',
  },
};

export default function EbooksCatalogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090909] text-[#FFFFFF]">
      <Navbar />

      <main className="flex-1 pt-28 pb-24 px-4 sm:px-6 lg:px-8 bg-blueprint-grid-dark">
        <div className="mx-auto max-w-[1360px]">
          <PageImmersion coordinates="CATALOGUE ÉDITORIAL · SALLE DES PLANS">
          <div className="space-y-16">
          {/* Breadcrumbs */}
          <nav aria-label="Fil d'Ariane" className="font-mono text-xs text-[#A5A5A0]">
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

          {/* Header */}
          <div className="border-b border-[#565A5C]/35 pb-10 space-y-4">
            <p className="font-mono text-xs text-[#EEB149] tracking-wider">
              CATALOGUE ÉDITORIAL KHEOPS SET
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFFFF]">
              Les outils de construction.
            </h1>
            <p className="text-base sm:text-lg text-[#A5A5A0] max-w-2xl leading-relaxed">
              Chaque ouvrage est conçu comme un plan d’exécution court, direct et immédiatement applicable.
            </p>
          </div>

          {/* 1. Produits Disponibles : Le Capital du Bâtisseur & Le Code du Bâtisseur */}
          <section aria-labelledby="available-ebooks-heading" className="space-y-8">
            <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-4">
              <h2
                id="available-ebooks-heading"
                className="font-display text-2xl sm:text-3xl font-bold text-[#FFFFFF]"
              >
                Ouvrages disponibles immédiatement
              </h2>
              <span className="font-mono text-xs text-[#EEB149]">
                2 MANUELS PDF
              </span>
            </div>

            <div className="space-y-10">
              {AVAILABLE_PRODUCTS.map((product) => (
                <BookCard key={product.id} product={product} />
              ))}
            </div>
          </section>
          </div>
          </PageImmersion>
        </div>
      </main>

      <Footer />
    </div>
  );
}
