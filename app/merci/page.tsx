import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ThankYouResourceFlow } from '@/components/thank-you/ThankYouResourceFlow';
import { DualBookShowcase } from '@/components/products/DualBookShowcase';
import { PageImmersion } from '@/components/animations/page-immersion';

export const metadata: Metadata = {
  title: 'Merci — Kheops Set',
  description:
    'Accède à ton Protocole du Bâtisseur ou retrouve les informations concernant ta commande Chariow.',
  alternates: {
    canonical: '/merci',
  },
  robots: {
    index: false,
    follow: true,
  },
};

interface MerciPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MerciPage({ searchParams }: MerciPageProps) {
  const resolvedParams = await searchParams;
  const rawResource =
    typeof resolvedParams.ressource ==='string' ? resolvedParams.ressource : '';

  // Validation stricte du paramètre URL contre toute injection (liste blanche)
  const isProtocolFlow = rawResource ==='protocole-du-batisseur';

  return (
    <div className="min-h-screen flex flex-col bg-[#090909] text-[#FFFFFF]">
      <Navbar />

      <main id="main-content" className="flex-1 pt-28 pb-32 sm:pb-40 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1200px]">
          <PageImmersion>
            <div className="space-y-8">
              {/* Sélecteur de mode d’affichage discret */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#565A5C]/30 pb-4 font-mono text-xs">
                <span className="text-[#A5A5A0]">ESPACE DE RÉCEPTION KHEOPS SET</span>
                <div className="flex items-center gap-2">
                  <Link
                    href="/merci?ressource=protocole-du-batisseur"
                    className={`px-3.5 py-1.5 border transition-colors ${
                      isProtocolFlow
                        ? 'border-[#EEB149] bg-[#EEB149] text-[#090909] font-semibold'
                        : 'border-[#565A5C]/40 text-[#A5A5A0] hover:text-[#FFFFFF]'
                    }`}
                  >
                    Protocole Gratuit
                  </Link>
                  <Link
                    href="/merci"
                    className={`px-3.5 py-1.5 border transition-colors ${
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
                /* Flux 1 : Téléchargement du Protocole Gratuit */
                <ThankYouResourceFlow />
              ) : (
                /* Flux 2 : Retour après paiement Chariow */
                <div className="space-y-12">
                  <div className="p-8 sm:p-12 lg:p-14 border border-[#565A5C]/50 bg-[#151515] space-y-6">
                    <div className="flex items-center justify-between border-b border-[#565A5C]/35 pb-4 font-mono text-xs">
                      <span className="text-[#EEB149] font-semibold">
                        INFORMATION D’ACCÈS CHARIOW
                      </span>
                      <span className="text-[#A5A5A0]">RÉCEPTION DIRECTE</span>
                    </div>

                    <div className="space-y-4">
                      <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#FFFFFF]">
                        Merci pour ta commande.
                      </h1>

                      <p className="text-lg sm:text-xl text-[#F3F1EB] leading-relaxed">
                        Si ton paiement a été validé, Chariow t’envoie immédiatement les informations et le lien pour accéder à ton ebook par email.
                      </p>

                      <p className="text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
                        Vérifie tes courriers indésirables ou spams si tu ne vois pas l’email dans les deux minutes.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#565A5C]/35 flex flex-wrap items-center gap-4 font-mono text-xs">
                      <Link
                        href="/ebooks"
                        className="px-6 py-3.5 font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors whitespace-nowrap"
                      >
                        PARCOURIR LE CATALOGUE
                      </Link>

                      <Link
                        href="/contact"
                        className="px-6 py-3.5 font-semibold tracking-wider border border-[#565A5C] text-[#FFFFFF] hover:border-[#FFFFFF] transition-colors whitespace-nowrap"
                      >
                        CONTACTER LE SUPPORT KHEOPS SET
                      </Link>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#565A5C]/30">
                    <DualBookShowcase
                      title="Nos manuels d’ingénierie"
                      subtitle="Retrouve nos deux ouvrages fondamentaux."
                      ctaLocation="thank_you"
                    />
                  </div>
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
