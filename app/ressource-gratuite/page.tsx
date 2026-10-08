import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { FreeResourceHero } from '@/components/resource/FreeResourceHero';
import { TrustProtocolBlock } from '@/components/ui/trust-protocol-block';
import { DualBookShowcase } from '@/components/products/DualBookShowcase';
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

      <main id="main-content" className="flex-1 pt-28 pb-32 sm:pb-40 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1360px] space-y-12">
          <PageImmersion>
            {/* Breadcrumb Navigation */}
            <nav
              aria-label="Fil d’Ariane"
              className="font-mono text-xs text-[#A5A5A0] pb-4"
            >
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-[#FFFFFF] transition-colors">
                    Accueil
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-[#EEB149]" aria-current="page">
                  Ressource Gratuite
                </li>
              </ol>
            </nav>

            <div className="space-y-24 sm:space-y-36">
              {/* Main Form + Hero Section */}
              <FreeResourceHero />

              {/* Technical Trust Protocol Block */}
              <TrustProtocolBlock
                title="SÉCURITÉ & DÉLIVRABILITÉ"
                variant="full"
              />

              {/* Equal Footing Presentation of Both Books */}
              <section aria-label="Nos manuels complets">
                <DualBookShowcase
                  title="Pour aller plus loin : Nos manuels complets"
                  subtitle="Le Protocole isole les fuites d’urgence. Nos manuels d’ingénierie construisent ton système patrimonial et décisionnel."
                  ctaLocation="free_resource"
                  headerClassName="text-left"
                />
              </section>

              {/* Secondary CTA Gateway */}
              <section
                aria-label="Catalogue et accès direct"
                className="p-10 sm:p-14 lg:p-16 bg-[#151515] border border-[#565A5C]/40 text-center space-y-6"
              >
                <p className="font-mono text-xs text-[#EEB149] uppercase tracking-wider font-semibold">
                  PASSERELLE ÉDITORIALE
                </p>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#FFFFFF]">
                  Tu souhaites explorer l’intégralité du catalogue ?
                </h2>
                <div className="pt-2">
                  <Link
                    href="/ebooks"
                    className="inline-block px-8 py-4 text-xs sm:text-sm font-semibold tracking-wider border border-[#565A5C] text-[#FFFFFF] hover:border-[#EEB149] hover:text-[#EEB149] transition-colors font-mono"
                  >
                    VOIR TOUS LES EBOOKS →
                  </Link>
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
