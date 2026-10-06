import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { PageImmersion } from '@/components/animations/page-immersion';
import {
  CAPITAL_PRODUCT,
  CODE_PRODUCT,
  getChariowCheckoutUrl,
} from '@/lib/products';
import {
  IconCheck,
  IconCrosshair,
  IconBlueprint,
  IconArrowUpRight,
  IconPdf,
  IconRuler,
} from '@/components/icons/kheops-icons';
import { ChariowBuyButton } from '@/components/ui/chariow-buy-button';
import { PriceDisplay } from '@/components/ui/price-display';

export const metadata: Metadata = {
  title: 'À propos de Kheops Set — Le Manifeste de l’Acier Bienveillant',
  description:
    'Kheops Set est une marque éditoriale anonyme. Les mots ne construisent rien. Les actes, oui. Découvre notre posture et nos manuels de décision financière.',
  alternates: {
    canonical: '/a-propos',
  },
  openGraph: {
    title: 'À propos de Kheops Set — Le Manifeste de l’Acier Bienveillant',
    description:
      'Kheops Set est une marque éditoriale anonyme. Les mots ne construisent rien. Les actes, oui. Découvre notre posture et nos manuels de décision financière.',
    url: '/a-propos',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'À propos de Kheops Set — Le Manifeste de l’Acier Bienveillant',
    description:
      'Kheops Set est une marque éditoriale anonyme. Les mots ne construisent rien. Les actes, oui. Découvre notre posture et nos manuels de décision financière.',
  },
};

const DISMANTLE_PARADOXES = [
  {
    code: 'PARADOXE 01',
    label: 'LE BRUIT VS LE PLAN',
    verdict: 'L’agitation n’est pas de la vitesse.',
    critique:
      'Internet déborde de conseils génériques et d’injonctions contradictoires. Plus tu écoutes les avis sans méthode, plus tu disperses tes ressources.',
    reponse:
      'Kheops Set remplace les discours par des plans mesurables. Nous n’enseignons pas à paraître occupé, nous fournissons les chiffres pour être libre.',
  },
  {
    code: 'PARADOXE 02',
    label: 'LA DETTE SOCIALE VS LE CAPITAL',
    verdict: 'Consommer pour prouver appauvrit.',
    critique:
      'La pression sociale et l’obligation de paraître consument le fruit de ton travail avant même qu’il n’ait pu générer un début de sécurité.',
    reponse:
      'Chaque franc CFA dépensé pour impressionner un tiers est un franc volé à ta descendance. Nous rétablissons la priorité absolue : bâtir le capital avant d’acheter le décor.',
  },
  {
    code: 'PARADOXE 03',
    label: 'L’ILLUSION DU DÉCLIC VS LA RÉPÉTITION',
    verdict: 'La motivation baisse. La structure reste.',
    critique:
      'Attendre un événement providentiel ou un sursaut d’enthousiasme condamne à l’irrégularité. Les élans émotionnels ne paient aucune facture sur la durée.',
    reponse:
      'Une vie solide est un chantier de briques empilées jour après jour. Nous créons des règles d’acier qui fonctionnent même les matins où tu n’as pas envie.',
  },
];

const FOUR_STEEL_LINES = [
  {
    number: '01',
    title: 'Dire la vérité sans flatter',
    description:
      'Nous refusons les promesses d’enrichissement miraculeux et les formules de complaisance. Un diagnostic rigoureux commence par l’examen froid de la réalité.',
  },
  {
    number: '02',
    title: 'Mesurer sans mentir',
    description:
      'Ce qui ne se compte pas ne se contrôle pas. Nous convertissons chaque intention en ratio clair, en seuil de sécurité et en allocation budgétaire inviolable.',
  },
  {
    number: '03',
    title: 'Protéger son temps et son énergie',
    description:
      'Poser des limites nettes face aux sollicitations toxiques n’est pas de l’arrogance : c’est le devoir élémentaire de tout bâtisseur envers son avenir.',
  },
  {
    number: '04',
    title: 'Bâtir pour transmettre',
    description:
      'Nos manuels ne visent pas le gain éphémère du week-end, mais la constitution d’un socle patrimonial capable de protéger ta famille sur plusieurs générations.',
  },
];

export default function AboutPage() {
  const capitalCheckoutUrl = getChariowCheckoutUrl(
    CAPITAL_PRODUCT.chariowUrl,
    CAPITAL_PRODUCT.slug
  );
  const codeCheckoutUrl = getChariowCheckoutUrl(
    CODE_PRODUCT.chariowUrl,
    CODE_PRODUCT.slug
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#090909] text-[#FFFFFF]">
      <Navbar />

      <main className="flex-1 pt-28 pb-24 px-4 sm:px-6 lg:px-8 bg-blueprint-grid-dark">
        <div className="mx-auto max-w-[1200px]">
          <PageImmersion coordinates="MANIFESTE ÉDITORIAL · L’ACIER BIENVEILLANT">
            <div className="space-y-24">
              {/* Fil d'Ariane technique */}
              <nav aria-label="Fil d'Ariane" className="font-mono text-xs text-[#A5A5A0]">
                <ol className="flex items-center gap-2">
                  <li>
                    <Link href="/" className="hover:text-[#FFFFFF] transition-colors">
                      Accueil
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className="text-[#EEB149]" aria-current="page">
                    À propos · Le Manifeste
                  </li>
                </ol>
              </nav>

              {/* 1. HERO MANIFESTE */}
              <header className="space-y-8 border-b border-[#565A5C]/35 pb-16">
                <div className="inline-flex items-center gap-3 font-mono text-xs text-[#EEB149] border border-[#EEB149]/35 bg-[#151515] px-3.5 py-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#EEB149] animate-pulse" />
                  <span>REV. 2026 // POSTURE ÉDITORIALE ANONYME</span>
                </div>

                <div className="space-y-6 max-w-4xl">
                  <h1
                    className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FFFFFF] leading-[1.05]"
                    style={{ textWrap: 'balance' }}
                  >
                    Les mots ne construisent rien.{' '}
                    <span className="text-[#EEB149] block mt-2">
                      Les actes, oui.
                    </span>
                  </h1>

                  <p className="text-lg sm:text-xl text-[#F3F1EB] leading-relaxed font-normal">
                    Kheops Set n’est pas une figure d’influence à admirer. C’est un atelier
                    technique d’ingénierie personnelle conçu pour ceux qui refusent de gaspiller
                    leur existence dans l’apparence.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 font-mono text-xs">
                  <div className="p-4 bg-[#151515] border border-[#565A5C]/40 space-y-1">
                    <span className="text-[#A5A5A0]">01 // IDENTITÉ</span>
                    <p className="text-[#FFFFFF] font-semibold">Anonymat Garanti</p>
                    <p className="text-[#A5A5A0] text-[11px]">Le message avant l’ego du créateur.</p>
                  </div>
                  <div className="p-4 bg-[#151515] border border-[#565A5C]/40 space-y-1">
                    <span className="text-[#A5A5A0]">02 // MÉTHODE</span>
                    <p className="text-[#FFFFFF] font-semibold">L’Acier Bienveillant</p>
                    <p className="text-[#A5A5A0] text-[11px]">Vérité stricte sans mépris ni flatterie.</p>
                  </div>
                  <div className="p-4 bg-[#151515] border border-[#565A5C]/40 space-y-1">
                    <span className="text-[#A5A5A0]">03 // FINALITÉ</span>
                    <p className="text-[#EEB149] font-semibold">Souveraineté Réelle</p>
                    <p className="text-[#A5A5A0] text-[11px]">Protéger son temps, forger son capital.</p>
                  </div>
                </div>
              </header>

              {/* 2. SECTION I — LE DÉMANTÈLEMENT DU PARAÎTRE */}
              <section aria-labelledby="dismantle-heading" className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#565A5C]/35 pb-4">
                  <div className="space-y-1">
                    <p className="font-mono text-xs text-[#EEB149] tracking-wider">
                      SECTION I · DIAGNOSTIC OPÉRATIONNEL
                    </p>
                    <h2
                      id="dismantle-heading"
                      className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#FFFFFF]"
                    >
                      Le Démantèlement du Paraître
                    </h2>
                  </div>
                  <p className="font-mono text-xs text-[#A5A5A0] max-w-sm">
                    Trois pièges culturels qui bloquent l’accumulation et vident l’énergie.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {DISMANTLE_PARADOXES.map((item) => (
                    <article
                      key={item.code}
                      className="p-7 bg-[#151515] border border-[#565A5C]/40 hover:border-[#EEB149]/60 transition-colors flex flex-col justify-between space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-[#565A5C]/25 pb-3">
                          <span className="font-mono text-xs text-[#EEB149] font-semibold">
                            {item.code}
                          </span>
                          <span className="font-mono text-[10px] text-[#A5A5A0]">AUDIT</span>
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-display text-lg font-bold text-[#FFFFFF] tracking-tight">
                            {item.label}
                          </h3>
                          <p className="text-sm font-mono text-[#EEB149] font-medium">
                            « {item.verdict} »
                          </p>
                        </div>

                        <p className="text-sm text-[#A5A5A0] leading-relaxed">
                          {item.critique}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#565A5C]/25 space-y-1.5">
                        <span className="font-mono text-[10px] text-[#EEB149] uppercase tracking-wider">
                          La Réponse Kheops Set
                        </span>
                        <p className="text-xs text-[#F3F1EB] leading-relaxed">
                          {item.reponse}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* 3. SECTION II — LES QUATRE LIGNES DE MIRE DE L'ACIER BIENVEILLANT */}
              <section aria-labelledby="steel-heading" className="space-y-8">
                <div className="p-8 sm:p-12 bg-[#151515] border border-[#EEB149]/50 space-y-10">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#565A5C]/40 pb-6">
                    <div className="space-y-2">
                      <p className="font-mono text-xs text-[#EEB149] tracking-wider">
                        SECTION II · CODE DE CONDUITE
                      </p>
                      <h2
                        id="steel-heading"
                        className="font-display text-3xl sm:text-4xl font-bold text-[#FFFFFF]"
                      >
                        Les Quatre Lignes de Mire
                      </h2>
                    </div>
                    <p className="font-mono text-xs text-[#A5A5A0] max-w-sm">
                      Une éthique d’exigence. Zéro culpabilisation, 100 % de responsabilité.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {FOUR_STEEL_LINES.map((pillar) => (
                      <div
                        key={pillar.number}
                        className="p-6 bg-[#090909] border border-[#565A5C]/40 space-y-3.5 relative group hover:border-[#EEB149] transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold px-2.5 py-1 bg-[#151515] border border-[#EEB149]/50 text-[#EEB149]">
                            LIGNE // {pillar.number}
                          </span>
                          <IconCheck className="w-4 h-4 text-[#EEB149]" />
                        </div>
                        <h3 className="font-display text-xl font-bold text-[#FFFFFF]">
                          {pillar.title}
                        </h3>
                        <p className="text-sm text-[#A5A5A0] leading-relaxed">
                          {pillar.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 4. SECTION III — L'ARMEMENT TECHNIQUE (PRIORITÉ CAPITAL N°1 / CODE EN COMPLÉMENT) */}
              <section aria-labelledby="weapons-heading" className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#565A5C]/35 pb-4">
                  <div className="space-y-1">
                    <p className="font-mono text-xs text-[#EEB149] tracking-wider">
                      SECTION III · OUTILS ÉDITORIAUX
                    </p>
                    <h2
                      id="weapons-heading"
                      className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#FFFFFF]"
                    >
                      L’Armement Technique
                    </h2>
                  </div>
                  <p className="font-mono text-xs text-[#A5A5A0] max-w-sm">
                    Deux manuels sans théorie inutile. Deux feuilles de route opérationnelles.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  {/* Carte VEDETTE N°1 : Le Capital du Bâtisseur (Largeur majeure) */}
                  <div className="lg:col-span-7 bg-[#151515] border-2 border-[#EEB149] p-8 sm:p-10 flex flex-col justify-between space-y-8 relative overflow-hidden">
                    <div className="space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="font-mono text-xs font-bold px-3 py-1 bg-[#EEB149] text-[#090909]">
                          OUVRAGE MAJEUR // VEDETTE N°1
                        </span>
                        <span className="font-mono text-xs text-[#A5A5A0]">
                          49 PAGES · FORMAT PDF
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                        <div className="sm:col-span-5 relative aspect-[3/4] bg-[#090909] border border-[#565A5C]/40 overflow-hidden shadow-2xl">
                          <Image
                            src={CAPITAL_PRODUCT.coverImage}
                            alt={CAPITAL_PRODUCT.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 240px"
                            priority
                          />
                        </div>

                        <div className="sm:col-span-7 space-y-3">
                          <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#FFFFFF] leading-snug">
                            {CAPITAL_PRODUCT.title}
                          </h3>
                          <p className="font-mono text-xs text-[#EEB149]">
                            {CAPITAL_PRODUCT.subtitle}
                          </p>
                          <p className="text-sm text-[#A5A5A0] leading-relaxed">
                            {CAPITAL_PRODUCT.shortDescription}
                          </p>

                          <div className="pt-2">
                            <PriceDisplay
                              amountInXAF={CAPITAL_PRODUCT.price}
                              showSelector={false}
                              size="md"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[#565A5C]/35 space-y-3">
                      <ChariowBuyButton
                        href={capitalCheckoutUrl}
                        ctaName="capital_checkout"
                        ctaLocation="product_page"
                        className="flex items-center justify-center w-full py-4 px-6 text-sm font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors"
                      >
                        PRENDRE LE CAPITAL DU BÂTISSEUR
                      </ChariowBuyButton>
                      <p className="font-mono text-[11px] text-center text-[#A5A5A0]">
                        Paiement sécurisé et accès immédiat via Chariow.
                      </p>
                    </div>
                  </div>

                  {/* Carte SATELLITE COMPLÉMENTAIRE : Le Code du Bâtisseur */}
                  <div className="lg:col-span-5 bg-[#151515] border border-[#565A5C]/40 p-8 flex flex-col justify-between space-y-6">
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-[#090909] border border-[#565A5C]/50 text-[#F3F1EB]">
                          MODULE COMPLÉMENTAIRE
                        </span>
                        <span className="font-mono text-xs text-[#A5A5A0]">
                          42 PAGES · PDF
                        </span>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                          {CODE_PRODUCT.title}
                        </h3>
                        <p className="font-mono text-xs text-[#EEB149]">
                          {CODE_PRODUCT.subtitle}
                        </p>
                        <p className="text-sm text-[#A5A5A0] leading-relaxed">
                          {CODE_PRODUCT.shortDescription}
                        </p>
                      </div>

                      <PriceDisplay
                        amountInXAF={CODE_PRODUCT.price}
                        showSelector={false}
                        size="sm"
                      />
                    </div>

                    <div className="pt-4 border-t border-[#565A5C]/25 space-y-2.5">
                      <ChariowBuyButton
                        href={codeCheckoutUrl}
                        ctaName="code_checkout"
                        ctaLocation="product_page"
                        className="flex items-center justify-center w-full py-3 px-4 text-xs font-semibold tracking-wider border border-[#565A5C] text-[#FFFFFF] hover:border-[#EEB149] hover:text-[#EEB149] transition-colors"
                      >
                        COMMANDER LE CODE EN COMPLÉMENT
                      </ChariowBuyButton>
                      <Link
                        href={`/ebooks/${CODE_PRODUCT.slug}`}
                        className="flex items-center justify-center gap-1.5 font-mono text-xs text-[#A5A5A0] hover:text-[#FFFFFF] transition-colors pt-1"
                      >
                        <span>Consulter le sommaire détaillé</span>
                        <IconArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. AVERTISSEMENT RESPONSABLE ÉDUCATIF */}
              <section
                aria-labelledby="disclaimer-heading"
                className="p-6 sm:p-8 border border-[#565A5C]/40 bg-[#151515] space-y-2.5"
              >
                <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#EEB149] tracking-wider">
                  <IconBlueprint className="w-4 h-4" />
                  <h2 id="disclaimer-heading">CADRE LÉGAL & RESPONSABILITÉ ÉDITORIALE</h2>
                </div>
                <p className="text-sm text-[#F3F1EB] font-medium leading-relaxed">
                  Le contenu publié par Kheops Set est strictement pédagogique et méthodologique.
                </p>
                <p className="text-xs text-[#A5A5A0] leading-relaxed">
                  Nos ouvrages ne constituent en aucun cas des conseils en investissement personnalisés, des recommandations financières au sens réglementaire, ni des avis juridiques ou fiscaux. Pour toute décision engageant votre patrimoine ou votre situation personnelle, l’arbitrage d’un professionnel habilité et certifié demeure indispensable.
                </p>
              </section>

              {/* 6. DÉCISION FINALE & CTA PRINCIPAL UNIQUE */}
              <section
                aria-labelledby="final-decision-heading"
                className="p-10 sm:p-14 bg-[#090909] border-2 border-[#565A5C]/40 text-center space-y-8 relative overflow-hidden"
              >
                <div
                  aria-hidden="true"
                  className="mx-auto max-w-[280px] h-px bg-gradient-to-r from-transparent via-[#EEB149] to-transparent"
                />

                <div className="space-y-4 max-w-2xl mx-auto">
                  <p className="font-mono text-xs text-[#EEB149] tracking-widest uppercase">
                    PASSAGE À L’ACTE
                  </p>
                  <h2
                    id="final-decision-heading"
                    className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FFFFFF] leading-tight"
                  >
                    La lucidité n’a de valeur que si elle débouche sur un chantier.
                  </h2>
                  <p className="text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
                    Tu n’as pas besoin d’un nouveau discours de motivation. Tu as besoin d’un plan d’action qui protège ton temps et ton capital.
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center space-y-4 pt-2">
                  <ChariowBuyButton
                    href={capitalCheckoutUrl}
                    ctaName="capital_checkout"
                    ctaLocation="product_page"
                    className="inline-flex items-center justify-center px-10 py-4 text-xs sm:text-sm font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors whitespace-nowrap"
                  >
                    PRENDRE LE CAPITAL DU BÂTISSEUR
                  </ChariowBuyButton>

                  <p className="font-mono text-xs text-[#A5A5A0]">
                    Paiement sécurisé et accès immédiat via Chariow.
                  </p>

                  <div className="pt-4 border-t border-[#565A5C]/25 max-w-md w-full">
                    <Link
                      href="/ressource-gratuite"
                      className="font-mono text-xs text-[#A5A5A0] hover:text-[#EEB149] transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>Télécharger d’abord le Protocole d’Isolation gratuit</span>
                      <IconArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
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
