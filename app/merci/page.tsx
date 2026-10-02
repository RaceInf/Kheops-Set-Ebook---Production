import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ThankYouResourceFlow } from '@/components/thank-you/ThankYouResourceFlow';
import { ProductUpsellCards } from '@/components/products/ProductUpsellCards';
import { PageImmersion } from '@/components/animations/page-immersion';

export const metadata: Metadata = {
  title: 'Merci — Kheops Set',
  description:
    'Accède à ton Protocole du Bâtisseur ou retrouve les informations concernant ta commande Chariow.',
  robots: {
    index: false,
    follow: false,
  },
};

interface MerciPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MerciPage({ searchParams }: MerciPageProps) {
  const resolvedParams = await searchParams;
  const rawResource =
    typeof resolvedParams.ressource === 'string' ? resolvedParams.ressource : '';

  // Validation stricte du paramètre URL contre toute injection (liste blanche)
  const isProtocolFlow = rawResource === 'protocole-du-batisseur';

  return (
    <div className="min-h-screen flex flex-col bg-[#090909] text-[#FFFFFF]">
      <Navbar />

      <main className="flex-1 pt-28 pb-24 px-4 sm:px-6 lg:px-8 bg-blueprint-grid-dark">
        <div className="mx-auto max-w-[920px]">
          <PageImmersion coordinates="ESPACE DE RÉCEPTION · KHEOPS SET">
          <div className="space-y-8">
          {/* Sélecteur de mode d'affichage discret pour faciliter la navigation entre Protocole Gratuit et Commande Chariow */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#565A5C]/30 pb-4 font-mono text-xs">
            <span className="text-[#A5A5A0]">ESPACE DE RÉCEPTION KHEOPS SET</span>
            <div className="flex items-center gap-2">
              <Link
                href="/merci?ressource=protocole-du-batisseur"
                className={`px-3 py-1.5 border transition-colors ${
                  isProtocolFlow
                    ? 'border-[#EEB149] bg-[#EEB149] text-[#090909] font-semibold'
                    : 'border-[#565A5C]/40 text-[#A5A5A0] hover:text-[#FFFFFF]'
                }`}
              >
                Protocole Gratuit
              </Link>
              <Link
                href="/merci"
                className={`px-3 py-1.5 border transition-colors ${
                  !isProtocolFlow
                    ? 'border-[#EEB149] bg-[#EEB149] text-[#090909] font-semibold'
                    : 'border-[#565A5C]/40 text-[#A5A5A0] hover:text-[#FFFFFF]'
                }`}
              >
                Commande Chariow
              </Link>
            </div>
          </div>

          {isProtocolFlow ? (
            /* Flux Dynamique : ?ressource=protocole-du-batisseur (1. Téléchargement -> 2. WhatsApp -> 3. Facebook -> 4. Livres payants) */
            <ThankYouResourceFlow />
          ) : (
            /* Flux Standard : Retour après paiement Chariow + accès direct au Protocole */
            <div className="space-y-10">
              <div className="p-8 sm:p-12 border border-[#565A5C]/50 bg-[#151515] space-y-6">
                <div className="flex items-center justify-between border-b border-[#565A5C]/35 pb-4 font-mono text-xs">
                  <span className="text-[#EEB149]">INFORMATION D’ACCÈS CHARIOW</span>
                  <span className="text-[#A5A5A0]">KHEOPS SET</span>
                </div>

                <div className="space-y-4">
                  <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#FFFFFF]">
                    Merci.
                  </h1>

                  <p className="text-lg sm:text-xl text-[#F3F1EB] leading-relaxed">
                    Si ton paiement a été validé, Chariow t’enverra les informations pour accéder à ton ebook.
                  </p>

                  <p className="text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
                    Vérifie aussi tes courriers indésirables si tu ne vois pas l’email.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#565A5C]/35 flex flex-wrap items-center gap-4">
                  <Link
                    href="/ebooks/le-capital-du-batisseur"
                    className="px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors whitespace-nowrap"
                  >
                    VOIR LE LIVRE
                  </Link>

                  <Link
                    href="/contact"
                    className="px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wider border border-[#565A5C] text-[#FFFFFF] hover:border-[#FFFFFF] transition-colors whitespace-nowrap"
                  >
                    CONTACTER KHEOPS SET
                  </Link>
                </div>
              </div>

              <ProductUpsellCards />
            </div>
          )}
          </div>
          </PageImmersion>
        </div>
      </main>

      <Footer />
    </div>
  );
}
