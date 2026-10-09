'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AVAILABLE_PRODUCTS, getChariowCheckoutUrl } from '@/lib/products';
import { PriceDisplay } from '@/components/ui/price-display';
import { ChariowBuyButton } from '@/components/ui/chariow-buy-button';
import { TrustProtocolBlock } from '@/components/ui/trust-protocol-block';
import {
  IconPdf,
  IconCheck,
  IconArrowUpRight,
  IconCut,
  IconProtect,
  IconRepeat,
  IconRuler,
} from '@/components/icons/kheops-icons';

type DiagnosticFilter = 'all' | 'capital' | 'code' | 'bundle';

interface BookTabState {
  [key: string]: 'overview' | 'toc' | 'cas';
}

export function EbooksCatalogExperience() {
  const [selectedFilter, setSelectedFilter] = useState<DiagnosticFilter>('all');
  const [bookTabState, setBookTabState] = useState<BookTabState>({
    'le-capital-du-batisseur': 'overview',
    'le-code-du-batisseur': 'overview',
  });

  const setBookTab = (slug: string, tab: 'overview' | 'toc' | 'cas') => {
    setBookTabState((prev) => ({ ...prev, [slug]: tab }));
  };

  return (
    <div className="space-y-20 sm:space-y-32">
      {/* =========================================================================
          HERO MONOLITHE : LA SALLE DES PLANS
         ========================================================================= */}
      <section
        aria-label="En-tête de la Salle des Plans"
        className="relative bg-[#151515] border border-[#565A5C]/40 p-6 sm:p-12 lg:p-16 overflow-hidden"
      >
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#565A5C]/35 pb-6 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#EEB149]" />
            <span className="text-[#EEB149] font-bold tracking-widest uppercase">
              LA SALLE DES PLANS
            </span>
          </div>
          <span className="text-[#A5A5A0]">
            INDEXATION COMPLÈTE
          </span>
        </div>

        <div className="relative z-10 py-8 sm:py-14 space-y-6 max-w-4xl">
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FFFFFF] leading-[1.04]">
            Des manuels d’ingénierie.
            <span className="block text-[#EEB149] mt-2">
              Zéro fiction.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-[#F3F1EB] font-light leading-relaxed max-w-3xl">
            Nos ouvrages ne sont pas des livres de motivation que l’on lit pour se rassurer.
            Ce sont des protocoles fermés, précis et mathématiques pour arrêter de
            brûler son argent dans le paraître, poser des limites intraitables et
            construire une base solide.
          </p>
        </div>

        {/* Real-time Technical Specs Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-[#565A5C]/35 font-mono text-xs">
          <div className="p-4 bg-[#090909] border border-[#565A5C]/30 space-y-1">
            <span className="text-[#A5A5A0] block text-[10px] uppercase">VOLUMES EN SERVICE</span>
            <span className="text-[#FFFFFF] font-bold">2 Ouvrages (87 pages totales)</span>
          </div>
          <div className="p-4 bg-[#090909] border border-[#565A5C]/30 space-y-1">
            <span className="text-[#A5A5A0] block text-[10px] uppercase">STANDARD TECHNIQUE</span>
            <span className="text-[#FFFFFF] font-bold">PDF Vectoriel Haute Définition</span>
          </div>
          <div className="p-4 bg-[#090909] border border-[#565A5C]/30 space-y-1">
            <span className="text-[#A5A5A0] block text-[10px] uppercase">DÉLIVRABILITÉ</span>
            <span className="text-[#EEB149] font-bold">Immédiate par email en &lt; 60s</span>
          </div>
          <div className="p-4 bg-[#090909] border border-[#565A5C]/30 space-y-1">
            <span className="text-[#A5A5A0] block text-[10px] uppercase">RÈGLEMENT SÉCURISÉ</span>
            <span className="text-[#FFFFFF] font-bold">Mobile Money &amp; Cartes (Chariow)</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          L'AIGUILLEUR STRATÉGIQUE : QUEL PLAN OUVRIR EN PREMIER ?
         ========================================================================= */}
      <section
        aria-labelledby="strategic-heading"
        className="p-6 sm:p-10 bg-[#151515] border border-[#565A5C]/40 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#565A5C]/30 pb-4">
          <div className="space-y-1.5">
            <span className="font-mono text-xs text-[#EEB149] tracking-wider uppercase font-semibold">
              DIAGNOSTIC D’ORIENTATION
            </span>
            <h2
              id="strategic-heading"
              className="font-display text-2xl sm:text-3xl font-bold text-[#FFFFFF]"
            >
              Par quel chantier dois-tu commencer ?
            </h2>
          </div>
          <p className="font-mono text-xs text-[#A5A5A0]">
            SÉLECTIONNE TA SITUATION DOMINANTE
          </p>
        </div>

        {/* Interactive Selector Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <button
            type="button"
            onClick={() => setSelectedFilter(selectedFilter === 'capital' ? 'all' : 'capital')}
            className={`p-4 text-left border transition-all cursor-pointer ${
              selectedFilter === 'capital'
                ? 'border-[#EEB149] bg-[#090909] text-[#FFFFFF] shadow-[0_0_20px_rgba(238,177,73,0.15)]'
                : 'border-[#565A5C]/40 bg-[#090909]/60 text-[#A5A5A0] hover:text-[#FFFFFF] hover:border-[#F3F1EB]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#EEB149] font-bold">SITUATION A</span>
              <IconCut className="w-4 h-4 text-[#EEB149]" />
            </div>
            <p className="font-display text-sm font-bold text-[#FFFFFF] mb-1">
              Fuites d’argent &amp; Paraître
            </p>
            <p className="text-[11px] text-[#A5A5A0] leading-relaxed">
              Le revenu monte mais le compte reste vide. Dépenses de statut, Black Tax non cadrée.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter(selectedFilter === 'code' ? 'all' : 'code')}
            className={`p-4 text-left border transition-all cursor-pointer ${
              selectedFilter === 'code'
                ? 'border-[#EEB149] bg-[#090909] text-[#FFFFFF] shadow-[0_0_20px_rgba(238,177,73,0.15)]'
                : 'border-[#565A5C]/40 bg-[#090909]/60 text-[#A5A5A0] hover:text-[#FFFFFF] hover:border-[#F3F1EB]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#EEB149] font-bold">SITUATION B</span>
              <IconRepeat className="w-4 h-4 text-[#EEB149]" />
            </div>
            <p className="font-display text-sm font-bold text-[#FFFFFF] mb-1">
              Dispersion &amp; Procrastination
            </p>
            <p className="text-[11px] text-[#A5A5A0] leading-relaxed">
              Incapacité à dire non, attente du déclic émotionnel, routines jamais tenues.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter(selectedFilter === 'bundle' ? 'all' : 'bundle')}
            className={`p-4 text-left border transition-all cursor-pointer ${
              selectedFilter === 'bundle'
                ? 'border-[#EEB149] bg-[#090909] text-[#FFFFFF] shadow-[0_0_20px_rgba(238,177,73,0.15)]'
                : 'border-[#565A5C]/40 bg-[#090909]/60 text-[#A5A5A0] hover:text-[#FFFFFF] hover:border-[#F3F1EB]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#EEB149] font-bold">SITUATION C</span>
              <IconProtect className="w-4 h-4 text-[#EEB149]" />
            </div>
            <p className="font-display text-sm font-bold text-[#FFFFFF] mb-1">
              Refonte Totale du Système
            </p>
            <p className="text-[11px] text-[#A5A5A0] leading-relaxed">
              Aligner la forteresse mentale (Le Code) et la construction patrimoniale (Le Capital).
            </p>
          </button>
        </div>

        {/* Directive Advice Banner */}
        <AnimatePresence mode="wait">
          {selectedFilter !== 'all' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-[#090909] border-l-2 border-[#EEB149] font-mono text-xs text-[#F3F1EB] space-y-1"
            >
              <span className="text-[#EEB149] font-bold block uppercase">
                RECOMMANDATION OPÉRATIONNELLE :
              </span>
              <p>
                {selectedFilter === 'capital' &&
                  'Priorité absolue : « Le Capital du Bâtisseur ». Tu dois d’abord colmater les brèches par où s’évacue ton cash avant d’espérer accumuler.'}
                {selectedFilter === 'code' &&
                  'Priorité absolue : « Le Code du Bâtisseur ». Ton problème n’est pas technique mais structurel : réinstalle un blindage mental et la discipline mécanique.'}
                {selectedFilter === 'bundle' &&
                  'Combinaison stratégique : Commence par Le Code pour calibrer ton esprit d’action, puis applique Le Capital pour bâtir ta forteresse patrimoniale.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* =========================================================================
          LES DEUX MANUELS D’EXÉCUTION (PRÉSENTATION ÉDITORIALE SURPRENANTE)
         ========================================================================= */}
      <section aria-label="Fiches techniques des ouvrages" className="space-y-16">
        <div className="space-y-16">
          {AVAILABLE_PRODUCTS.map((product, idx) => {
            const checkoutUrl = getChariowCheckoutUrl(
              product.chariowUrl,
              product.slug
            );
            const ctaName =
              product.slug === 'le-code-du-batisseur'
                ? 'code_checkout'
                : 'capital_checkout';
            const currentTab = bookTabState[product.slug] || 'overview';
            const isCapital = product.slug === 'le-capital-du-batisseur';

            const isHighlighted =
              selectedFilter === 'all' ||
              (selectedFilter === 'capital' && isCapital) ||
              (selectedFilter === 'code' && !isCapital) ||
              selectedFilter === 'bundle';

            return (
              <article
                key={product.id}
                className={`border bg-[#151515] transition-all duration-300 relative overflow-hidden ${
                  isHighlighted
                    ? 'border-[#EEB149]/70 shadow-[0_15px_40px_rgba(0,0,0,0.85)]'
                    : 'border-[#565A5C]/30 opacity-60'
                }`}
              >
                {/* Book Header Bar */}
                <div className="p-6 sm:p-8 border-b border-[#565A5C]/35 flex flex-wrap items-center justify-between gap-4 font-mono text-xs bg-[#090909]">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#EEB149]" />
                    <span className="text-[#EEB149] font-bold tracking-wider uppercase">
                      {product.category.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-[#A5A5A0]">
                    <span className="flex items-center gap-1.5">
                      <IconPdf className="w-3.5 h-3.5 text-[#EEB149]" />
                      {product.pageCount} PAGES (PDF)
                    </span>
                    <span>·</span>
                    <span>FRANÇAIS</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 lg:p-12 items-start">
                  {/* Left Column: 3D Minimalist Book Spine & Quick Visual */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="p-8 bg-[#090909] border border-[#565A5C]/40 flex flex-col justify-between min-h-[360px] relative">
                      <div className="space-y-3">
                        <span className="font-mono text-[10px] text-[#EEB149] tracking-widest block uppercase">
                          KHEOPS SET · ÉDITION 2026
                        </span>
                        <h3 className="font-display text-3xl sm:text-4xl font-bold text-[#FFFFFF] leading-tight">
                          {product.title}
                        </h3>
                        <p className="font-mono text-xs text-[#EEB149] font-medium">
                          {product.subtitle}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-[#565A5C]/30 space-y-2 font-mono text-xs text-[#A5A5A0]">
                        <p>• Objectif : {isCapital ? 'Stopper l’hémorragie & capitaliser' : 'Installer une discipline mécanique'}</p>
                        <p>• Temps d’assimilation : 90 à 120 minutes</p>
                        <p>• Niveau d’application : Immédiat (24 heures)</p>
                      </div>
                    </div>

                    {/* Navigation Buttons for Book Info */}
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <button
                        type="button"
                        onClick={() => setBookTab(product.slug, 'overview')}
                        className={`flex-1 py-2.5 px-3 border transition-colors cursor-pointer text-center ${
                          currentTab === 'overview'
                            ? 'border-[#EEB149] bg-[#EEB149] text-[#090909] font-bold'
                            : 'border-[#565A5C]/40 bg-[#090909] text-[#A5A5A0] hover:text-[#FFFFFF]'
                        }`}
                      >
                        SYNTHÈSE
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookTab(product.slug, 'toc')}
                        className={`flex-1 py-2.5 px-3 border transition-colors cursor-pointer text-center ${
                          currentTab === 'toc'
                            ? 'border-[#EEB149] bg-[#EEB149] text-[#090909] font-bold'
                            : 'border-[#565A5C]/40 bg-[#090909] text-[#A5A5A0] hover:text-[#FFFFFF]'
                        }`}
                      >
                        SOMMAIRE
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookTab(product.slug, 'cas')}
                        className={`flex-1 py-2.5 px-3 border transition-colors cursor-pointer text-center ${
                          currentTab === 'cas'
                            ? 'border-[#EEB149] bg-[#EEB149] text-[#090909] font-bold'
                            : 'border-[#565A5C]/40 bg-[#090909] text-[#A5A5A0] hover:text-[#FFFFFF]'
                        }`}
                      >
                        EXEMPLES
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Dynamic Tab Content & Pricing/CTA */}
                  <div className="lg:col-span-7 flex flex-col justify-between space-y-8 min-h-[360px]">
                    <div className="space-y-6">
                      {currentTab === 'overview' && (
                        <div className="space-y-5">
                          <div className="space-y-2">
                            <h4 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                              La thèse du manuel
                            </h4>
                            <p className="text-sm sm:text-base text-[#F3F1EB] leading-relaxed">
                              {product.shortDescription}
                            </p>
                            <p className="text-xs sm:text-sm text-[#A5A5A0] leading-relaxed">
                              {product.longDescription}
                            </p>
                          </div>

                          <div className="space-y-2.5 pt-2">
                            <span className="font-mono text-[10px] text-[#EEB149] uppercase tracking-wider block font-semibold">
                              CE QUE CE MANUEL INSTALLE DÉFINITIVEMENT :
                            </span>
                            <ul className="space-y-2 text-xs sm:text-sm text-[#F3F1EB]">
                              {product.benefits.slice(0, 4).map((b, i) => (
                                <li key={i} className="flex items-start gap-2.5 bg-[#090909]/60 p-2.5 border border-[#565A5C]/25">
                                  <IconCheck className="w-4 h-4 text-[#EEB149] shrink-0 mt-0.5" />
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {currentTab === 'toc' && (
                        <div className="space-y-4">
                          <h4 className="font-display text-xl font-bold text-[#FFFFFF]">
                            Architecture des chapitres ({product.pageCount} pages)
                          </h4>
                          <div className="space-y-2.5 font-mono text-xs">
                            {product.tableOfContents.slice(0, 5).map((ch, i) => (
                              <div
                                key={i}
                                className="p-3 bg-[#090909] border border-[#565A5C]/30 flex flex-col space-y-1"
                              >
                                <div className="flex items-center justify-between text-[#EEB149]">
                                  <span className="font-bold">CHAPITRE {ch.chapterNumber}</span>
                                  <span>P. {ch.page}</span>
                                </div>
                                <p className="font-display text-sm font-semibold text-[#FFFFFF]">
                                  {ch.title}
                                </p>
                                <p className="text-[11px] text-[#A5A5A0] line-clamp-2">
                                  {ch.summary}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {currentTab === 'cas' && (
                        <div className="space-y-4">
                          <h4 className="font-display text-xl font-bold text-[#FFFFFF]">
                            Études de cas réelles et contextes traités
                          </h4>
                          <div className="space-y-3 text-xs sm:text-sm text-[#F3F1EB] leading-relaxed">
                            {isCapital ? (
                              <>
                                <div className="p-3.5 bg-[#090909] border border-[#565A5C]/35 space-y-1">
                                  <span className="font-mono text-[10px] text-[#EEB149] block">CAS 01 // DOUALA &amp; ABIDJAN</span>
                                  <p className="font-semibold text-[#FFFFFF]">L’étude de cas de Fabrice : 800 000 FCFA de salaire, 0 FCFA d’épargne.</p>
                                  <p className="text-[#A5A5A0] text-xs">Démantèlement de l’impôt du paraître et mise en place de la règle de carence à 72 heures.</p>
                                </div>
                                <div className="p-3.5 bg-[#090909] border border-[#565A5C]/35 space-y-1">
                                  <span className="font-mono text-[10px] text-[#EEB149] block">CAS 02 // LA DIASPORA &amp; LA BLACK TAX</span>
                                  <p className="font-semibold text-[#FFFFFF]">Comment poser une ligne de coupe sans abandonner sa famille.</p>
                                  <p className="text-[#A5A5A0] text-xs">Le budget d’urgence clos et le refus diplomatique non négociable.</p>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="p-3.5 bg-[#090909] border border-[#565A5C]/35 space-y-1">
                                  <span className="font-mono text-[10px] text-[#EEB149] block">PRINCIPE DU COEUR // ACTION IMPARFAITE</span>
                                  <p className="font-semibold text-[#FFFFFF]">Pourquoi une cabane construite bat toujours un palais rêvé.</p>
                                  <p className="text-[#A5A5A0] text-xs">Exécuter la version 1.0 en moins de 60 minutes au lieu d’attendre les conditions idéales.</p>
                                </div>
                                <div className="p-3.5 bg-[#090909] border border-[#565A5C]/35 space-y-1">
                                  <span className="font-mono text-[10px] text-[#EEB149] block">LE VERROU D’ATTENTION // LE SANCTUAIRE</span>
                                  <p className="font-semibold text-[#FFFFFF]">Les 4 heures intouchables de chaque matin.</p>
                                  <p className="text-[#A5A5A0] text-xs">Protocole d’isolation totale contre les sollicitations toxiques et le bruit numérique.</p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Pricing, Conversion & Action Bar */}
                    <div className="pt-6 border-t border-[#565A5C]/35 space-y-5">
                      <PriceDisplay
                        amountInXAF={product.priceXaf}
                        originalPriceXaf={product.originalPriceXaf}
                        salePriceXaf={product.salePriceXaf}
                        salePercentage={product.salePercentage}
                        isOnSale={product.isOnSale}
                        saleEndsAt={product.saleEndsAt}
                        showSelector={true}
                        size="md"
                      />

                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <ChariowBuyButton
                          href={checkoutUrl}
                          ctaName={ctaName}
                          ctaLocation="catalogue"
                          productSlug={product.slug}
                          className="w-full sm:flex-1 py-4 px-6 text-center text-xs font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors whitespace-nowrap font-mono cursor-pointer"
                        >
                          {product.ctaLabel}
                        </ChariowBuyButton>

                        <Link
                          href={`/ebooks/${product.slug}`}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 py-4 px-5 text-xs font-mono font-semibold border border-[#565A5C] text-[#FFFFFF] hover:border-[#FFFFFF] hover:bg-[#090909] transition-colors whitespace-nowrap"
                        >
                          <span>VOIR LA FICHE COMPLÈTE</span>
                          <IconArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      <p className="text-[11px] text-[#A5A5A0] font-mono">
                        Paiement sécurisé via Chariow (Mobile Money / Carte) · Accès immédiat par email.
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          LA TABLE D'ASSEMBLAGE : COMMENT LES 3 OUTILS S'ENGRENENT
         ========================================================================= */}
      <section
        aria-labelledby="assembly-heading"
        className="p-8 sm:p-12 lg:p-16 bg-[#151515] border border-[#565A5C]/40 space-y-10"
      >
        <div className="space-y-2 border-b border-[#565A5C]/35 pb-6">
          <span className="font-mono text-xs text-[#EEB149] tracking-widest uppercase">
            ARCHITECTURE DU BÂTISSEUR
          </span>
          <h2
            id="assembly-heading"
            className="font-display text-2xl sm:text-4xl font-bold text-[#FFFFFF]"
          >
            Comment les outils s’articulent entre eux
          </h2>
          <p className="text-sm sm:text-base text-[#A5A5A0] max-w-2xl">
            Tu ne construis pas un toit avant d’avoir coulé la dalle. Voici la progression
            exacte recommandée pour rebâtir ton autonomie.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="p-6 bg-[#090909] border border-[#565A5C]/35 space-y-4">
            <span className="font-mono text-xs text-[#A5A5A0] block">ÉTAPE 01 · GRATUIT</span>
            <h3 className="font-display text-lg font-bold text-[#FFFFFF]">
              Le Protocole d’Isolation
            </h3>
            <p className="text-xs text-[#A5A5A0] leading-relaxed">
              Fiche d’audit d’urgence (6 pages) pour identifier en 10 minutes tes fuites
              immédiates de temps et tes dépenses d’apparence.
            </p>
            <Link
              href="/ressource-gratuite"
              className="inline-block text-xs font-mono text-[#EEB149] hover:underline pt-2"
            >
              Télécharger le guide gratuit →
            </Link>
          </div>

          <div className="p-6 bg-[#090909] border border-[#EEB149]/60 space-y-4">
            <span className="font-mono text-xs text-[#EEB149] font-bold block">ÉTAPE 02 · DISCIPLINE</span>
            <h3 className="font-display text-lg font-bold text-[#FFFFFF]">
              Le Code du Bâtisseur
            </h3>
            <p className="text-xs text-[#A5A5A0] leading-relaxed">
              Le manuel d’architecture mentale (38 pages). Installe les 7 principes
              pour exécuter à froid et poser des limites imperméables.
            </p>
            <Link
              href="/ebooks/le-code-du-batisseur"
              className="inline-block text-xs font-mono text-[#EEB149] hover:underline pt-2"
            >
              Explorer Le Code →
            </Link>
          </div>

          <div className="p-6 bg-[#090909] border border-[#EEB149]/60 space-y-4">
            <span className="font-mono text-xs text-[#EEB149] font-bold block">ÉTAPE 03 · CAPITAL</span>
            <h3 className="font-display text-lg font-bold text-[#FFFFFF]">
              Le Capital du Bâtisseur
            </h3>
            <p className="text-xs text-[#A5A5A0] leading-relaxed">
              Le manuel patrimonial complet (49 pages). Boucher les fuites de statut,
              cadrer la Black Tax, et créer ta première base de résistance.
            </p>
            <Link
              href="/ebooks/le-capital-du-batisseur"
              className="inline-block text-xs font-mono text-[#EEB149] hover:underline pt-2"
            >
              Explorer Le Capital →
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          RÉASSURANCE TECHNIQUE & TRANSACTIONS CHARIOW
         ========================================================================= */}
      <TrustProtocolBlock
        title="ENGAGEMENTS & DÉLIVRABILITÉ"
        variant="full"
      />

      {/* =========================================================================
          LE PACTE DU BÂTISSEUR : CONCLUSION MONUMENTALE
         ========================================================================= */}
      <section
        aria-label="Action finale"
        className="p-8 sm:p-14 lg:p-20 bg-[#151515] border-2 border-[#EEB149] text-center space-y-8 relative overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
      >
        <div className="space-y-4 max-w-3xl mx-auto">
          <p className="font-mono text-xs text-[#EEB149] tracking-[0.3em] uppercase">
            L’ENGAGEMENT
          </p>

          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-[#FFFFFF] leading-tight">
            Le coût de l’attente dépasse
            <span className="block text-[#EEB149] mt-2">
              toujours le prix d’un plan.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#F3F1EB] leading-relaxed font-light">
            Chaque mois sans système est un mois où le regard des autres prélève
            sa taxe sur ton avenir. Choisis ton manuel et commence à bâtir.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/ebooks/le-capital-du-batisseur"
            className="w-full sm:max-w-md lg:w-auto inline-flex items-center justify-center text-center px-10 py-5 text-xs sm:text-sm font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors whitespace-nowrap font-mono"
          >
            PRENDRE LE CAPITAL DU BÂTISSEUR
          </Link>

          <Link
            href="/ebooks/le-code-du-batisseur"
            className="w-full sm:max-w-md lg:w-auto inline-flex items-center justify-center text-center px-10 py-5 text-xs sm:text-sm font-semibold tracking-wider border border-[#565A5C] text-[#FFFFFF] hover:border-[#FFFFFF] hover:bg-[#090909] transition-colors whitespace-nowrap font-mono"
          >
            PRENDRE LE CODE DU BÂTISSEUR
          </Link>
        </div>

        <p className="text-xs text-[#A5A5A0] font-mono pt-4 border-t border-[#565A5C]/30 max-w-xl mx-auto">
          Paiement sécurisé crypté Chariow · Accès immédiat permanent en PDF.
        </p>
      </section>
    </div>
  );
}
