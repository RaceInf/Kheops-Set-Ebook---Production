import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { PageImmersion } from '@/components/animations/page-immersion';
import { getChariowCheckoutUrl } from '@/lib/ebooks-data';
import { IconCheck } from '@/components/icons/kheops-icons';

export const metadata: Metadata = {
  title: 'À propos de Kheops Set — La Philosophie de l’Acier Bienveillant',
  description:
    'Découvre Kheops Set : des outils clairs pour structurer ton temps, protéger ton argent et construire des décisions qui durent.',
  alternates: {
    canonical: '/a-propos',
  },
  openGraph: {
    title: 'À propos de Kheops Set — La Philosophie de l’Acier Bienveillant',
    description:
      'Découvre Kheops Set : des outils clairs pour structurer ton temps, protéger ton argent et construire des décisions qui durent.',
    url: '/a-propos',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'À propos de Kheops Set — La Philosophie de l’Acier Bienveillant',
    description:
      'Découvre Kheops Set : des outils clairs pour structurer ton temps, protéger ton argent et construire des décisions qui durent.',
  },
};

const PILLARS = [
  {
    number: '01',
    title: 'Dire la vérité sans faire semblant',
    text: 'Nous refusons les discours flatteurs qui rassurent sur le moment mais maintiennent dans l’immobilité.',
  },
  {
    number: '02',
    title: 'Donner des outils concrets',
    text: 'Chaque publication est construite comme un plan d’action mesurable, avec des règles simples à appliquer.',
  },
  {
    number: '03',
    title: 'Protéger son temps et son argent',
    text: 'Apprendre à poser des limites saines face à la dispersion et au besoin de paraître.',
  },
  {
    number: '04',
    title: 'Penser et agir sur le long terme',
    text: 'Une vie solide ne repose pas sur l’humeur du jour, mais sur de petites décisions répétées.',
  },
];

export default function AboutPage() {
  const checkoutUrl = getChariowCheckoutUrl();

  return (
    <div className="min-h-screen flex flex-col bg-[#090909] text-[#FFFFFF]">
      <Navbar />

      <main className="flex-1 pt-28 pb-24 px-4 sm:px-6 lg:px-8 bg-blueprint-grid-dark">
        <div className="mx-auto max-w-[1080px]">
          <PageImmersion coordinates="MANIFESTE · L’ACIER BIENVEILLANT">
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
                À propos
              </li>
            </ol>
          </nav>

          {/* Hero H1 */}
          <header className="space-y-6 border-b border-[#565A5C]/35 pb-12">
            <p className="font-mono text-xs text-[#EEB149] tracking-wider">
              ENTITÉ ÉDITORIALE ANONYME
            </p>
            <h1
              className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FFFFFF] leading-[1.06]"
              style={{ textWrap: 'balance' }}
            >
              Kheops Set ne te demande pas de croire.{' '}
              <span className="text-[#F3F1EB] block mt-2">
                Il te demande de regarder.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-[#A5A5A0] max-w-2xl leading-relaxed">
              Tu ne trouveras aucun visage, aucune mise en scène personnelle et aucune promesse facile sur ce site. Seuls comptent les outils et ce que tu construis avec.
            </p>
          </header>

          {/* Meaning of the Name & Anonymity in Industrial Panels */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#565A5C]/40 pb-3 font-mono text-xs text-[#EEB149]">
              <span>[DOC-01] IDENTITÉ & SENS DE LA STRUCTURE</span>
              <span className="text-[#A5A5A0]">ARCHIVE INTERNE</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-[#151515] border border-[#565A5C]/50 space-y-4 relative overflow-hidden">
                <div
                  aria-hidden="true"
                  className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#EEB149]/10 to-transparent pointer-events-none"
                />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#EEB149] px-2.5 py-1 bg-[#090909] border border-[#EEB149]/40 font-bold">
                    01 // KHEOPS
                  </span>
                  <span className="font-mono text-[10px] text-[#A5A5A0]">DURABILITÉ</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-[#FFFFFF]">
                  L’édifice qui traverse le temps
                </h2>
                <p className="text-sm sm:text-base text-[#F3F1EB] leading-relaxed">
                  Le nom « Kheops » rappelle qu’une œuvre durable ne se bâtit pas avec de l’agitation, mais avec de la précision, des fondations solides et des briques posées l’une après l’autre.
                </p>
              </div>

              <div className="p-8 bg-[#151515] border border-[#565A5C]/50 space-y-4 relative overflow-hidden">
                <div
                  aria-hidden="true"
                  className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#565A5C]/10 to-transparent pointer-events-none"
                />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#EEB149] px-2.5 py-1 bg-[#090909] border border-[#EEB149]/40 font-bold">
                    02 // SET
                  </span>
                  <span className="font-mono text-[10px] text-[#A5A5A0]">CADRE & SYSTÈME</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-[#FFFFFF]">
                  La structure et le cadre
                </h2>
                <p className="text-sm sm:text-base text-[#F3F1EB] leading-relaxed">
                  « Set » désigne la structure, l’ancrage et le système de décision. Quand l’émotion baisse, c’est la structure qui maintient le cap et permet d’exécuter.
                </p>
              </div>
            </div>
          </section>

          {/* Philosophy: L'Acier Bienveillant - Industrial Manifest Panel */}
          <section className="space-y-8 p-8 sm:p-12 bg-[#151515] border border-[#EEB149]/50">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#565A5C]/40 pb-6">
              <div className="space-y-2">
                <p className="font-mono text-xs text-[#EEB149] tracking-wider">
                  CHARTE OPÉRATIONNELLE
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#FFFFFF]">
                  L’Acier Bienveillant
                </h2>
              </div>
              <p className="font-mono text-xs text-[#A5A5A0] max-w-sm">
                Exigeant sans mépriser. Focalisé sur les décisions et les systèmes mesurables.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PILLARS.map((pillar) => (
                <div
                  key={pillar.number}
                  className="p-6 bg-[#090909] border border-[#565A5C]/40 space-y-3 relative group hover:border-[#EEB149]/60 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 bg-[#151515] border border-[#EEB149]/50 text-[#EEB149]">
                      PILIER // {pillar.number}
                    </span>
                    <IconCheck className="w-4 h-4 text-[#EEB149]" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#FFFFFF]">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-[#A5A5A0] leading-relaxed">{pillar.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Mandatory Responsible Educational Disclaimer */}
          <section
            aria-labelledby="disclaimer-heading"
            className="p-6 sm:p-8 border border-[#565A5C]/50 bg-[#151515] space-y-3"
          >
            <h2
              id="disclaimer-heading"
              className="font-mono text-xs font-semibold text-[#EEB149] tracking-wider"
            >
              AVERTISSEMENT RESPONSABLE
            </h2>
            <p className="text-sm sm:text-base text-[#F3F1EB] font-medium">
              Ce contenu est éducatif. Il ne remplace pas un conseil financier adapté à ta situation.
            </p>
            <p className="text-xs sm:text-sm text-[#A5A5A0] leading-relaxed">
              Kheops Set crée des outils éditoriaux de réflexion et d’organisation personnelle. Nos ouvrages ne remplacent pas l’accompagnement d’un conseiller financier agréé, d’un expert-comptable, d’un avocat ou d’un professionnel de santé selon le sujet abordé.
            </p>
          </section>

          {/* Bottom CTA */}
          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-[#565A5C]/35">
            <div className="space-y-1">
              <p className="font-display text-2xl font-bold text-[#FFFFFF]">
                Découvre le premier ouvrage de la marque.
              </p>
              <p className="text-sm text-[#A5A5A0]">
                Le Capital du Bâtisseur — Ebook PDF de 49 pages.
              </p>
            </div>

            <div className="space-y-2">
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 text-xs sm:text-sm font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors whitespace-nowrap"
              >
                PRENDRE LE PLAN
              </a>
              <p className="text-[11px] text-[#A5A5A0] text-center">
                Paiement et accès via Chariow.
              </p>
            </div>
          </div>
          </div>
          </PageImmersion>
        </div>
      </main>

      <Footer />
    </div>
  );
}
