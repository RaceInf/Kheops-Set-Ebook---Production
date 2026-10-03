import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { FreeResourceHero } from '@/components/resource/FreeResourceHero';
import { ProductUpsellCards } from '@/components/products/ProductUpsellCards';
import { PageImmersion } from '@/components/animations/page-immersion';

export const metadata: Metadata = {
  title: 'Le Protocole du Bâtisseur — Guide Gratuit PDF | Kheops Set',
  description:
    'Télécharge Le Protocole du Bâtisseur : un guide PDF simple pour protéger ton attention, poser des limites et mieux choisir tes priorités.',
  alternates: {
    canonical: '/ressource-gratuite',
  },
  openGraph: {
    title: 'Le Protocole du Bâtisseur — Guide Gratuit PDF | Kheops Set',
    description:
      'Télécharge Le Protocole du Bâtisseur : un guide PDF simple pour protéger ton attention, poser des limites et mieux choisir tes priorités.',
    url: '/ressource-gratuite',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Le Protocole du Bâtisseur — Guide Gratuit PDF | Kheops Set',
    description:
      'Télécharge Le Protocole du Bâtisseur : un guide PDF simple pour protéger ton attention, poser des limites et mieux choisir tes priorités.',
  },
};

export default function FreeResourcePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090909] text-[#FFFFFF]">
      <Navbar />

      <main className="flex-1 pt-28 pb-24 px-4 sm:px-6 lg:px-8 bg-blueprint-grid-dark">
        <div className="mx-auto max-w-[1360px]">
          <PageImmersion coordinates="LE PREMIER PLAN · PROTOCOLE D’ISOLATION">
          <div className="space-y-12">
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
                Le Protocole d’Isolation
              </li>
            </ol>
          </nav>

          {/* Hero + Mockup + Formulaire + Contenu en 3 étapes */}
          <FreeResourceHero />

          {/* Présentation discrète des deux ebooks payants */}
          <ProductUpsellCards />
          </div>
          </PageImmersion>
        </div>
      </main>

      <Footer />
    </div>
  );
}
