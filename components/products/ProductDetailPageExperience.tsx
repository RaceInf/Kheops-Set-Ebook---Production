'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/products';
import { getChariowCheckoutUrl, AVAILABLE_PRODUCTS } from '@/lib/products';
import { PriceDisplay } from '@/components/ui/price-display';
import { ChariowSnapWidget } from '@/components/ui/chariow-snap-widget';
import { ProductDossier } from '@/components/products/ProductDossier';
import { BookPreviewReader } from '@/components/products/BookPreviewReader';
import { TrustProtocolBlock } from '@/components/ui/trust-protocol-block';
import { Book, BookOpen } from 'lucide-react';
import {
  IconPdf,
  IconArrowUpRight,
  IconRuler,
} from '@/components/icons/kheops-icons';

interface ProductDetailPageExperienceProps {
  product: Product;
}

export function ProductDetailPageExperience({
  product,
}: ProductDetailPageExperienceProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Verrouille le défilement de l'arrière-plan quand la liseuse modale est ouverte
  useEffect(() => {
    if (isPreviewOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isPreviewOpen]);

  const snapProductId =
    product.slug === 'le-capital-du-batisseur'
      ? (process.env.NEXT_PUBLIC_CHARIOW_CAPITAL_SNAP_ID || 'prd_09id6x')
      : (process.env.NEXT_PUBLIC_CHARIOW_CODE_SNAP_ID || 'codedubatisseur');

  const checkoutUrl = getChariowCheckoutUrl(product.chariowUrl, product.slug);
  const ctaName =
    product.slug === 'le-code-du-batisseur'
      ? 'code_checkout'
      : 'capital_checkout';

  const hasPreviewPages =
    Boolean(product.previewPages && product.previewPages.length > 0);

  const togglePreview = () => {
    setIsPreviewOpen((prev) => !prev);
  };

  // Companion product
  const companionProduct = AVAILABLE_PRODUCTS.find(
    (p) => p.slug !== product.slug
  );

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* =========================================================================
          HERO MONOLITHE DE LA FICHE PRODUIT
         ========================================================================= */}
      <section
        aria-label="Présentation principale du manuel"
        className="relative bg-[#151515] border border-[#565A5C]/40 p-6 sm:p-10 lg:p-14 overflow-hidden"
      >
        {/* Liseré supérieur or technique */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-[3px] bg-[#EEB149]"
        />

        {/* Top Technical Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#565A5C]/35 pb-5 font-mono text-xs text-[#A5A5A0]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#EEB149]" aria-hidden="true" />
            <span className="text-[#EEB149] font-bold tracking-widest uppercase">
              DOSSIER TECHNIQUE
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-[#F3F1EB]">
              <IconPdf className="w-3.5 h-3.5 text-[#EEB149]" />
              {product.format} · {product.pageCount} PAGES
            </span>
            <span className="hidden sm:inline text-[#565A5C]">|</span>
            <span className="hidden sm:inline text-[#A5A5A0]">
              ÉDITION VÉRIFIÉE KHEOPS SET
            </span>
          </div>
        </div>

        {/* Core Presentation: Book Mockup (Left) + Purchase Spec (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 pt-8 lg:pt-12 items-start">
          {/* Left Column: 3D Book Monolith Cover */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group w-full max-w-[320px] aspect-[3/4.3] bg-[#090909] border border-[#565A5C]/70 shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col justify-between p-7 sm:p-8 transition-transform duration-300 hover:-translate-y-1">
              {/* Liseré or supérieur du livre */}
              <div
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-[3px] bg-[#EEB149]"
              />

              {/* Photo de couverture haute définition en fond */}
              <div className="absolute inset-0 z-0 opacity-85">
                <Image
                  src={product.coverImage}
                  alt={product.coverAlt}
                  fill
                  priority
                  sizes="(max-width: 640px) 300px, 340px"
                  referrerPolicy="no-referrer"
                  className="object-cover object-center"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-b from-[#090909]/90 via-[#090909]/30 to-[#090909]/95"
                />
              </div>

              {/* Header de la couverture */}
              <div className="relative z-10 text-center space-y-1.5">
                <span className="inline-block font-mono text-[10px] tracking-[0.25em] text-[#EEB149] uppercase">
                  {product.tag}
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold tracking-[0.05em] text-[#FFFFFF] leading-tight uppercase">
                  {product.title}
                </h2>
              </div>

              {/* Footer de la couverture */}
              <div className="relative z-10 text-center space-y-2 pt-4 border-t border-[#565A5C]/40">
                <p className="text-xs text-[#F3F1EB] leading-snug line-clamp-2">
                  {product.subtitle}
                </p>
                <p className="font-mono text-[11px] tracking-[0.3em] text-[#EEB149]">
                  KHEOPS SET
                </p>
              </div>
            </div>

            {/* Quick Action: Feuilleter un extrait si disponible */}
            {hasPreviewPages && (
              <button
                type="button"
                onClick={togglePreview}
                className="mt-6 w-full max-w-[320px] py-3 px-4 border border-[#565A5C]/60 bg-[#090909] text-center font-mono text-xs font-semibold text-[#EEB149] hover:bg-[#EEB149] hover:text-[#090909] hover:border-[#EEB149] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPreviewOpen ? (
                  <BookOpen className="w-4 h-4 shrink-0 text-[#EEB149]" aria-hidden="true" />
                ) : (
                  <Book className="w-4 h-4 shrink-0 text-[#EEB149]" aria-hidden="true" />
                )}
                <span>
                  {isPreviewOpen
                    ? 'MASQUER L’APERÇU'
                    : `FEUILLETER UN EXTRAIT (${product.previewPages?.length} PAGES)`}
                </span>
              </button>
            )}

            <div className="mt-4 text-center">
              <span className="font-mono text-[11px] text-[#A5A5A0]">
               {product.id}
              </span>
            </div>
          </div>

          {/* Right Column: Title, Value Proposition, Pricing & Chariow Buy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 bg-[#090909] border border-[#EEB149]/40 font-mono text-xs text-[#EEB149] font-semibold tracking-wider">
                {product.category}
              </span>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FFFFFF] leading-tight">
                {product.title}
              </h1>

              <p className="text-base sm:text-lg text-[#F3F1EB] font-light leading-relaxed">
                {product.subtitle}
              </p>
            </div>

            {/* Technical Characteristics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-[#565A5C]/30 font-mono text-xs">
              <div className="space-y-1">
                <span className="text-[#A5A5A0] block text-[10px]">FORMAT</span>
                <span className="text-[#FFFFFF] font-bold">PDF Haute Définition</span>
              </div>
              <div className="space-y-1">
                <span className="text-[#A5A5A0] block text-[10px]">PAGES</span>
                <span className="text-[#FFFFFF] font-bold">{product.pageCount} Pages nettes</span>
              </div>
              <div className="space-y-1">
                <span className="text-[#A5A5A0] block text-[10px]">SUPPORT</span>
                <span className="text-[#FFFFFF] font-bold">Téléphone &amp; PC</span>
              </div>
              <div className="space-y-1">
                <span className="text-[#A5A5A0] block text-[10px]">LIVRAISON</span>
                <span className="text-[#EEB149] font-bold">Instantanée (&lt; 60s)</span>
              </div>
            </div>

            {/* Core Description Quote */}
            <div className="p-4 sm:p-5 bg-[#090909] border-l-2 border-[#EEB149] text-sm text-[#A5A5A0] leading-relaxed">
              <p>“{product.shortDescription}”</p>
            </div>

            {/* Price Box with Currency Selector & Promotion */}
            <div className="p-5 sm:p-6 bg-[#090909] border border-[#565A5C]/40 space-y-5">
              <PriceDisplay
                amountInXAF={product.priceXaf}
                originalPriceXaf={product.originalPriceXaf}
                salePriceXaf={product.salePriceXaf}
                salePercentage={product.salePercentage}
                isOnSale={product.isOnSale}
                saleEndsAt={product.saleEndsAt}
                size="lg"
                showSelector={true}
              />

              {/* Primary Call to Action via Chariow Snap Widget */}
              <div className="space-y-3 pt-2">
                <ChariowSnapWidget
                  productId={snapProductId}
                  storeDomain="fovqbyzx.mychariow.shop"
                  productName={product.title}
                  className="w-full"
                />

                <p className="text-center font-mono text-xs text-[#A5A5A0]">
                  Paiement sécurisé et accès instantané sans quitter le site.
                </p>
              </div>

              {/* Direct payment methods badges */}
              <div className="pt-3 border-t border-[#565A5C]/30 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#A5A5A0]">
                <span>✓ Mobile Money (Orange, MTN, etc)</span>
                <span>✓ Cartes bancaires internationales</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION DIAGNOSTIC : POURQUOI CE MANUEL EXISTE
         ========================================================================= */}
      <section
        aria-labelledby="diagnostic-heading"
        className="p-6 sm:p-10 lg:p-12 bg-[#090909] border border-[#565A5C]/40 space-y-6"
      >
        <div className="flex items-center gap-2 font-mono text-xs text-[#EEB149]">
          <IconRuler className="w-4 h-4" />
          <span>LE DIAGNOSTIC DE DÉPART</span>
        </div>

        <h2
          id="diagnostic-heading"
          className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#FFFFFF] max-w-3xl leading-snug"
        >
          Ce n’est pas un livre de motivation.
          <span className="block text-[#A5A5A0] font-normal text-xl sm:text-2xl mt-1">
            C’est un protocole pour fermer les brèches et bâtir sur du solide.
          </span>
        </h2>

        <div className="prose prose-invert max-w-none text-base sm:text-lg text-[#F3F1EB] leading-relaxed space-y-4 pt-2">
          <p>{product.longDescription}</p>
        </div>
      </section>

      {/* =========================================================================
          LE DOSSIER TECHNIQUE (Sommaire, Ce que tu vas apprendre, Pour qui, FAQ)
         ========================================================================= */}
      <section aria-label="Dossier technique complet">
        <ProductDossier product={product} />
      </section>

      {/* =========================================================================
          PROTOCOLE DE CONFIANCE & LIVRAISON SÉCURISÉE
         ========================================================================= */}
      <section aria-label="Garanties et livraison">
        <TrustProtocolBlock />
      </section>

      {/* =========================================================================
          OUVRAGE COMPLÉMENTAIRE (L'AUTRE PIERRE DU CHANTIER)
         ========================================================================= */}
      {companionProduct && (
        <section
          aria-labelledby="companion-heading"
          className="p-6 sm:p-10 bg-[#151515] border border-[#565A5C]/40 space-y-6"
        >
          <div className="border-b border-[#565A5C]/35 pb-4">
            <p className="font-mono text-xs text-[#EEB149]">
              ARCHITECTURE COMPLÉMENTAIRE
            </p>
            <h2
              id="companion-heading"
              className="font-display text-2xl font-bold text-[#FFFFFF] mt-1"
            >
              L’autre versant de ta construction : {companionProduct.title}
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#A5A5A0] max-w-3xl leading-relaxed">
            {companionProduct.shortDescription}
          </p>

          <div className="pt-2">
            <Link
              href={`/ebooks/${companionProduct.slug}`}
              className="inline-flex items-center gap-2 py-3 px-5 bg-[#090909] border border-[#565A5C]/60 hover:border-[#EEB149] text-xs font-mono text-[#F3F1EB] hover:text-[#EEB149] transition-colors"
            >
              <span>DÉCOUVRIR {companionProduct.title.toUpperCase()}</span>
              <IconArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* =========================================================================
          CTA FINAL MONOLITHE DE CLÔTURE
         ========================================================================= */}
      <section
        aria-labelledby="final-cta-heading"
        className="relative bg-[#090909] border border-[#EEB149]/40 p-8 sm:p-12 lg:p-16 text-center space-y-6 overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-[2px] bg-[#EEB149]"
        />

        <div className="max-w-2xl mx-auto space-y-4">
          <p className="font-mono text-xs text-[#EEB149] tracking-widest uppercase">
            RÉPÉTER · CONSTRUIRE · PROTÉGER
          </p>

          <h2
            id="final-cta-heading"
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FFFFFF] leading-tight"
          >
            Tu peux continuer à expliquer.
            <span className="block text-[#EEB149]">
              Ou commencer à construire.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
            Rejoins les bâtisseurs qui ont choisi d’arrêter de subir leurs choix
            financiers et de poser des règles claires. Accès direct en moins de 60 secondes.
          </p>
        </div>

        <div className="pt-4 max-w-md mx-auto space-y-3">
          <ChariowSnapWidget
            productId={snapProductId}
            storeDomain="fovqbyzx.mychariow.shop"
            productName={product.title}
            className="w-full"
          />

          <p className="text-center font-mono text-xs text-[#A5A5A0]">
            Paiement et accès immédiat via Chariow.
          </p>
        </div>
      </section>

      {/* =========================================================================
          MODALE / POPUP PLEIN ÉCRAN DE LA LISEUSE
         ========================================================================= */}
      {hasPreviewPages && isPreviewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Liseuse : ${product.title}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-[#090909]/92 backdrop-blur-md overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsPreviewOpen(false);
            }
          }}
        >
          <div className="relative w-full max-w-3xl my-auto bg-[#151515] border border-[#565A5C]/50 p-4 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.95)]">
            <BookPreviewReader
              product={product}
              id={`liseuse-${product.slug}`}
              onClose={() => setIsPreviewOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
