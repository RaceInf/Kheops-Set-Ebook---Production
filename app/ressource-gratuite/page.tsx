import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { LeadCaptureForm } from '@/components/resource/LeadCaptureForm';
import { TrustProtocolBlock } from '@/components/ui/trust-protocol-block';
import { ChariowBuyButton } from '@/components/ui/chariow-buy-button';
import { PriceDisplay } from '@/components/ui/price-display';
import { PageImmersion } from '@/components/animations/page-immersion';
import {
  FREE_PROTOCOL_RESOURCE,
  CAPITAL_PRODUCT,
  getChariowCheckoutUrl,
} from '@/lib/products';
import {
  IconCheck,
  IconPdf,
  IconArrowUpRight,
  IconBlueprint,
  IconRuler,
  IconProtect,
} from '@/components/icons/kheops-icons';

export const metadata: Metadata = {
  title: 'Le Protocole du Bâtisseur — Guide Gratuit PDF | Kheops Set',
  description:
    'Télécharge Le Protocole du Bâtisseur : un audit opérationnel de 6 pages pour isoler tes fuites de temps et d’argent, poser des limites et retrouver ta clarté.',
  alternates: {
    canonical: '/ressource-gratuite',
  },
  openGraph: {
    title: 'Le Protocole du Bâtisseur — Guide Gratuit PDF | Kheops Set',
    description:
      'Télécharge Le Protocole du Bâtisseur : un audit opérationnel de 6 pages pour isoler tes fuites de temps et d’argent, poser des limites et retrouver ta clarté.',
    url: '/ressource-gratuite',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Le Protocole du Bâtisseur — Guide Gratuit PDF | Kheops Set',
    description:
      'Télécharge Le Protocole du Bâtisseur : un audit opérationnel de 6 pages pour isoler tes fuites de temps et d’argent, poser des limites et retrouver ta clarté.',
  },
};

const PROTOCOL_BREACHES = [
  {
    code: 'BRÈCHE 01',
    title: 'L’Impôt du Paraître',
    tag: 'FUITE FINANCIÈRE',
    subtitle: 'Ce que tu paies pour valider le regard d’autrui',
    description:
      'La fiche t’aide à chiffrer précisément les dépenses de statut social qui siphonnent ton revenu mensuel avant même que tu n’aies pu amorcer une épargne d’étanchéité.',
    Icon: IconRuler,
  },
  {
    code: 'BRÈCHE 02',
    title: 'L’Accès Non Filtré à ton Temps',
    tag: 'FUITE TEMPORELLE',
    subtitle: 'Pourquoi tout le monde décide à ta place',
    description:
      'Comment fermer les canaux de sollicitations permanentes et neutraliser les fausses urgences sans entrer en conflit violent avec ton entourage.',
    Icon: IconProtect,
  },
  {
    code: 'BRÈCHE 03',
    title: 'L’Absence de Solde de Résistance',
    tag: 'DÉFAUT STRUCTUREL',
    subtitle: 'Le premier verrou de sécurité inviolable',
    description:
      'Le calcul immédiat de ton seuil d’invulnérabilité : le montant exact dont tu as besoin pour ne plus jamais négocier ton avenir sous la panique.',
    Icon: IconBlueprint,
  },
];

export default function FreeResourcePage() {
  const capitalCheckoutUrl = getChariowCheckoutUrl(
    CAPITAL_PRODUCT.chariowUrl,
    CAPITAL_PRODUCT.slug
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#090909] text-[#FFFFFF]">
      <Navbar />

      <main className="flex-1 pt-28 pb-24 px-4 sm:px-6 lg:px-8 bg-blueprint-grid-dark">
        <div className="mx-auto max-w-[1280px]">
          <PageImmersion coordinates="LE PREMIER PLAN · PROTOCOLE DU BÂTISSEUR">
            <div className="space-y-20">
              {/* ============================================================ */}
              {/* EN-TÊTE DE PAGE MAJEUR & CARTOUCHE TECHNIQUE D’INGÉNIERIE   */}
              {/* ============================================================ */}
              <header className="space-y-8 border-b border-[#565A5C]/35 pb-12">
                {/* Bandeau d’identification technique supérieur */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 bg-[#151515] border border-[#565A5C]/40 font-mono text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#EEB149] animate-pulse" />
                    <span className="text-[#EEB149] font-semibold">
                      [DOC-GRATUIT // REF-2026-ISOLATION]
                    </span>
                    <span className="text-[#565A5C] hidden sm:inline">|</span>
                    <span className="text-[#A5A5A0] hidden sm:inline">
                      DIFFUSION LIBRE · ÉCHELLE D’INTERVENTION 1:1
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[#A5A5A0]">
                    <span className="text-[#EEB149]">●</span>
                    <span>SOUVERAINETÉ & DISCIPLINE</span>
                  </div>
                </div>

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
                      Ressource Gratuite · Le Protocole
                    </li>
                  </ol>
                </nav>

                {/* Titre H1 & Message d'accroche éditoriale */}
                <div className="space-y-6 max-w-4xl">
                  <div className="inline-flex items-center gap-2 font-mono text-xs px-3 py-1 bg-[#090909] border border-[#EEB149]/60 text-[#EEB149]">
                    <span>PLAN D’ACTION IMMÉDIAT · 6 PAGES PDF · LECTURE EN 10 MIN</span>
                  </div>

                  <h1
                    className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FFFFFF] leading-[1.06]"
                    style={{ textWrap: 'balance' }}
                  >
                    Le Protocole du Bâtisseur
                  </h1>

                  <p className="text-xl sm:text-2xl font-medium text-[#EEB149] leading-snug">
                    « Isole tes fuites de temps et d’argent en 10 minutes d’intervention directe. »
                  </p>

                  <p className="text-base sm:text-lg text-[#A5A5A0] leading-relaxed font-normal">
                    Ce n’est pas un extrait marketing ni une promesse de salon. C’est une feuille
                    d’autopsie froide conçue pour identifier précisément où s’évaporent tes revenus,
                    fermer les accès toxiques à ton attention et verrouiller ton premier seuil de résistance.
                  </p>
                </div>
              </header>

              {/* ============================================================ */}
              {/* HERO DE CONVERSION (2 COLONNES ÉQUILIBRÉES : OUTIL & TERMINAL) */}
              {/* ============================================================ */}
              <section aria-labelledby="resource-conversion-heading" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center bg-[#151515] border border-[#565A5C]/50 p-6 sm:p-10 lg:p-12 relative overflow-hidden">
                  <div
                    aria-hidden="true"
                    className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#EEB149]/10 to-transparent pointer-events-none"
                  />

                  {/* Colonne Gauche : Preuve Visuelle (3D Mockup) & 3 Contrôles */}
                  <div className="lg:col-span-7 space-y-6 relative z-10">
                    <div className="space-y-3">
                      <span className="font-mono text-xs text-[#EEB149] tracking-wider uppercase font-semibold">
                        APERÇU DU DOCUMENT
                      </span>
                      <h2
                        id="resource-conversion-heading"
                        className="font-display text-2xl sm:text-3xl font-bold text-[#FFFFFF]"
                      >
                        L’Armure d’Urgence en 6 Pages
                      </h2>
                      <p className="text-sm text-[#A5A5A0] leading-relaxed">
                        Le document contient 3 diagnostics avec des grilles de calcul chiffrées à remplir directement sur ton écran ou sur papier.
                      </p>
                    </div>

                    {/* Couverture 3D & Spécifications */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pt-4 border-t border-[#565A5C]/35">
                      {/* Mockup 3D */}
                      <div className="sm:col-span-5 flex justify-center py-4 bg-[#090909] border border-[#565A5C]/40">
                        <div className="perspective-1200">
                          <div
                            className="relative w-[150px] aspect-[3/4.2] bg-[#090909] border border-[#EEB149]/60 shadow-[14px_18px_34px_rgba(0,0,0,0.9)] overflow-hidden p-3.5 flex flex-col justify-between text-[#FFFFFF]"
                            style={{ transform: 'rotateY(-8deg) rotateX(2deg)' }}
                          >
                            <div
                              aria-hidden="true"
                              className="absolute top-0 left-0 right-0 h-[2px] bg-[#EEB149]"
                            />
                            <Image
                              src={FREE_PROTOCOL_RESOURCE.coverImage}
                              alt={FREE_PROTOCOL_RESOURCE.title}
                              fill
                              priority
                              sizes="150px"
                              className="object-cover object-center opacity-85"
                            />
                            <div
                              aria-hidden="true"
                              className="absolute inset-0 bg-gradient-to-b from-[#090909]/80 via-transparent to-[#090909]/95"
                            />

                            <div className="relative z-10 flex items-center justify-between font-mono text-[7px] text-[#F3F1EB]">
                              <span>KHEOPS SET</span>
                              <span className="text-[#EEB149]">PDF · 6 P.</span>
                            </div>

                            <div className="relative z-10 mt-auto space-y-0.5 border-l-2 border-[#EEB149] pl-2">
                              <p className="font-mono text-[7px] tracking-[0.18em] text-[#EEB149]">
                                LE PREMIER PLAN
                              </p>
                              <p className="font-display text-xs font-bold text-[#FFFFFF] leading-tight">
                                LE PROTOCOLE D’ISOLATION
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 3 Interventions majeures */}
                      <div className="sm:col-span-7 space-y-3">
                        <p className="font-mono text-xs font-semibold text-[#EEB149] tracking-wider">
                          LES 3 INTERVENTIONS CLÉS :
                        </p>

                        <ul className="space-y-2.5">
                          {FREE_PROTOCOL_RESOURCE.benefits.map((benefit, idx) => (
                            <li
                              key={benefit}
                              className="flex items-start gap-2.5 p-2.5 bg-[#090909] border border-[#565A5C]/40 text-xs text-[#F3F1EB]"
                            >
                              <span className="font-mono text-xs text-[#EEB149] font-bold shrink-0">
                                0{idx + 1}
                              </span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="inline-flex items-center gap-2 font-mono text-[11px] text-[#A5A5A0] pt-1">
                          <IconPdf className="w-3.5 h-3.5 text-[#EEB149]" />
                          <span>Fichier vectoriel haute précision, lisible hors-ligne.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Colonne Droite : Terminal de Réception (Formulaire) */}
                  <div className="lg:col-span-5 w-full relative z-10">
                    <div className="bg-[#090909] border border-[#565A5C]/50 p-6 sm:p-8 space-y-4">
                      <div className="space-y-1.5 border-b border-[#565A5C]/30 pb-4">
                        <span className="font-mono text-[11px] text-[#EEB149] tracking-wider uppercase font-semibold">
                          ACCÈS AU DOCUMENT
                        </span>
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                          Reçois la fiche par email
                        </h3>
                        <p className="text-xs text-[#A5A5A0]">
                          Remplis le formulaire pour débloquer l’accès instantané au PDF.
                        </p>
                      </div>

                      <LeadCaptureForm
                        submitLabel="RECEVOIR LE PROTOCOLE (PDF)"
                        redirectOnSuccess={true}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* ============================================================ */}
              {/* SECTION I — LES TROIS BRÈCHES COLMATÉES PAR LA FICHE         */}
              {/* ============================================================ */}
              <section aria-labelledby="breaches-heading" className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#565A5C]/35 pb-4">
                  <div className="space-y-1">
                    <p className="font-mono text-xs text-[#EEB149] tracking-wider">
                      SECTION I · AUDIT OPÉRATIONNEL
                    </p>
                    <h2
                      id="breaches-heading"
                      className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#FFFFFF]"
                    >
                      Les Trois Brèches Colmatées
                    </h2>
                  </div>
                  <p className="font-mono text-xs text-[#A5A5A0] max-w-sm">
                    Ce que cette fiche isole dès la première lecture pour stopper l’hémorragie.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {PROTOCOL_BREACHES.map((breach) => {
                    const BreachIcon = breach.Icon;
                    return (
                      <article
                        key={breach.code}
                        className="p-7 bg-[#151515] border border-[#565A5C]/40 hover:border-[#EEB149]/60 transition-colors flex flex-col justify-between space-y-5"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-[#565A5C]/25 pb-3">
                            <span className="font-mono text-xs text-[#EEB149] font-bold">
                              {breach.code}
                            </span>
                            <div className="w-8 h-8 border border-[#565A5C]/40 bg-[#090909] flex items-center justify-center text-[#EEB149]">
                              <BreachIcon className="w-4 h-4" />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="font-mono text-[10px] text-[#A5A5A0] tracking-wider uppercase">
                              {breach.tag}
                            </span>
                            <h3 className="font-display text-lg font-bold text-[#FFFFFF]">
                              {breach.title}
                            </h3>
                            <p className="font-mono text-xs text-[#EEB149]">
                              {breach.subtitle}
                            </p>
                          </div>

                          <p className="text-xs sm:text-sm text-[#A5A5A0] leading-relaxed pt-1">
                            {breach.description}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              {/* ============================================================ */}
              {/* SECTION II — BLOC RÉASSURANCE & SOUVERAINETÉ                 */}
              {/* ============================================================ */}
              <TrustProtocolBlock context="resource" />

              {/* ============================================================ */}
              {/* SECTION III — PASSERELLE D’INGÉNIERIE VERS LE CAPITAL        */}
              {/* ============================================================ */}
              <section
                aria-labelledby="bridge-heading"
                className="bg-[#151515] border-2 border-[#565A5C]/40 p-8 sm:p-12 space-y-8 relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#565A5C]/35 pb-6">
                  <div className="space-y-1">
                    <span className="font-mono text-xs text-[#EEB149] tracking-wider uppercase font-semibold">
                      PASSERELLE D’INGÉNIERIE COMPLETE
                    </span>
                    <h2
                      id="bridge-heading"
                      className="font-display text-2xl sm:text-3xl font-bold text-[#FFFFFF]"
                    >
                      Aller plus loin que l’audit d’urgence
                    </h2>
                  </div>
                  <span className="font-mono text-xs text-[#A5A5A0]">
                    LE PLAN MAJEUR · 49 PAGES
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 space-y-4">
                    <p className="text-base sm:text-lg text-[#F3F1EB] leading-relaxed">
                      Le Protocole d’Isolation isole tes fuites immédiates en 10 minutes. Mais pour
                      bâtir ton socle patrimonial, restructurer tes revenus et neutraliser la
                      pression sociale sur le long terme,{' '}
                      <strong className="text-[#EEB149]">Le Capital du Bâtisseur</strong> fournit la
                      méthode d’ingénierie intégrale.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs text-[#A5A5A0]">
                      <div className="flex items-center gap-2">
                        <IconCheck className="w-3.5 h-3.5 text-[#EEB149] shrink-0" />
                        <span>3 Parties : Défense, Offensive, Armure</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconCheck className="w-3.5 h-3.5 text-[#EEB149] shrink-0" />
                        <span>Cas concrets d’arbitrage financier réel</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 p-6 bg-[#090909] border border-[#EEB149]/50 space-y-4 flex flex-col justify-between">
                    <div className="space-y-1">
                      <p className="font-mono text-[10px] text-[#EEB149]">OUVRAGE PRINCIPAL</p>
                      <h3 className="font-display text-lg font-bold text-[#FFFFFF]">
                        {CAPITAL_PRODUCT.title}
                      </h3>
                      <PriceDisplay
                        amountInXAF={CAPITAL_PRODUCT.price}
                        showSelector={false}
                        size="sm"
                      />
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[#565A5C]/30">
                      <ChariowBuyButton
                        href={capitalCheckoutUrl}
                        ctaName="capital_checkout"
                        ctaLocation="product_page"
                        className="flex items-center justify-center w-full py-3 px-4 text-xs font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors"
                      >
                        PRENDRE LE CAPITAL
                      </ChariowBuyButton>

                      <Link
                        href={`/ebooks/${CAPITAL_PRODUCT.slug}`}
                        className="flex items-center justify-center gap-1 font-mono text-[11px] text-[#A5A5A0] hover:text-[#FFFFFF] transition-colors pt-1"
                      >
                        <span>Consulter le sommaire complet</span>
                        <IconArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
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
