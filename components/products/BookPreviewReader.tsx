'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, X, ArrowUpRight } from 'lucide-react';
import type { Product } from '@/lib/products';
import { getChariowCheckoutUrl } from '@/lib/products';
import { useCheckoutModal } from '@/context/checkout-modal-context';

interface BookPreviewReaderProps {
  product: Product;
  id?: string;
  onClose?: () => void;
}

export function BookPreviewReader({
  product,
  id = 'apercu-liseuse',
  onClose,
}: BookPreviewReaderProps) {
  const pages = product.previewPages || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalPreviewPages = pages.length;
  const currentPage = pages[currentIndex];
  const pathname = usePathname();
  const { openCheckout } = useCheckoutModal();
  const ctaLocation = pathname === '/' ? 'home' : 'product_page';
  const ctaName =
    product.slug === 'le-code-du-batisseur'
      ? 'code_checkout'
      : 'capital_checkout';
  const checkoutUrl = getChariowCheckoutUrl(product.chariowUrl, product.slug);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < totalPreviewPages - 1 ? prev + 1 : prev));
  }, [totalPreviewPages]);

  // Keyboard navigation: Left, Right, Escape
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handlePrev, handleNext, onClose]);

  if (totalPreviewPages === 0 || !currentPage) {
    return null;
  }

  const isLastPage = currentIndex === totalPreviewPages - 1;

  return (
    <section
      id={id}
      aria-label={`Extrait du manuel : ${product.title}`}
      className="w-full max-w-3xl mx-auto space-y-4 print:hidden"
    >
      {/* Barre supérieure épurée */}
      <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#EEB149]" aria-hidden="true" />
          <span className="text-[#EEB149] font-semibold tracking-wider uppercase">
            EXTRAIT · {product.title}
          </span>
          <span className="text-[#565A5C] hidden sm:inline">|</span>
          <span className="text-[#A5A5A0] hidden sm:inline">
            Page {currentIndex + 1} sur {totalPreviewPages}
          </span>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la liseuse"
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#A5A5A0] hover:text-[#FFFFFF] hover:bg-[#151515] border border-transparent hover:border-[#565A5C]/40 transition-colors cursor-pointer"
          >
            <span>Fermer</span>
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Feuille de lecture pure style papier éditorial */}
      <div
        className="relative bg-[#F3F1EB] text-[#090909] border border-[#565A5C]/40 shadow-2xl p-6 sm:p-10 lg:p-12 transition-all select-none"
        onContextMenu={(e) => e.preventDefault()}
        onCopy={(e) => e.preventDefault()}
      >
        {/* En-tête de la page */}
        <div className="flex items-center justify-between border-b border-[#090909]/15 pb-3 mb-6 font-mono text-[11px] text-[#565A5C]">
          <span className="uppercase tracking-wider">{currentPage.sectionLabel}</span>
          <span className="text-[#090909] font-semibold tabular-nums">
            {currentPage.pageNumberLabel}
          </span>
        </div>

        {/* Titre du chapitre / section */}
        <h3 className="font-display text-xl sm:text-2xl font-bold text-[#090909] leading-snug mb-5">
          {currentPage.heading}
        </h3>

        {/* Citation clé si présente */}
        {currentPage.quote && (
          <blockquote className="border-l-2 border-[#EEB149] pl-4 sm:pl-5 py-1 my-5 font-display text-base sm:text-lg italic text-[#090909]/90 leading-snug">
            {currentPage.quote}
          </blockquote>
        )}

        {/* Paragraphes de lecture aérés */}
        <div className="space-y-4 text-sm sm:text-base text-[#151515] leading-relaxed">
          {currentPage.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Bloc épuré de déblocage sur la dernière page */}
        {isLastPage && currentPage.lockedTeaser && (
          <div className="mt-8 pt-6 border-t border-[#090909]/20 space-y-4">
            <div className="p-5 bg-[#090909] text-[#FFFFFF] border-l-3 border-[#EEB149] space-y-3">
              <div className="font-mono text-xs text-[#EEB149] font-bold">
                FIN DE L’EXTRAIT · {product.pageCount} PAGES COMPLÈTES DANS L’OUVRAGE
              </div>
              <p className="text-xs sm:text-sm text-[#F3F1EB] leading-relaxed">
                {currentPage.lockedTeaser.ctaPrompt}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onClose) onClose();
                    openCheckout({
                      slug: product.slug,
                      location: `${ctaLocation}_preview_reader_unlock`,
                      triggerElement: e.currentTarget,
                    });
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#EEB149] text-[#090909] font-mono text-xs font-bold hover:bg-[#FFFFFF] transition-colors cursor-pointer"
                >
                  <span>{product.ctaLabel}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pied de page du livre */}
        <div className="mt-8 pt-4 border-t border-[#090909]/15 flex items-center justify-between font-mono text-[10px] text-[#565A5C]">
          <span>ÉDITION NUMÉRIQUE</span>
          <span>LECTURE SEULE</span>
        </div>
      </div>

      {/* Barre de navigation inférieure simple */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 font-mono text-xs border border-[#565A5C]/40 bg-[#090909] text-[#FFFFFF] hover:border-[#EEB149] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-[#EEB149]" />
          <span>Précédent</span>
        </button>

        <span className="font-mono text-xs text-[#A5A5A0] tabular-nums">
          {currentIndex + 1} / {totalPreviewPages}
        </span>

        <button
          type="button"
          onClick={handleNext}
          disabled={currentIndex === totalPreviewPages - 1}
          className={`inline-flex items-center gap-1.5 px-4 py-2 font-mono text-xs transition-colors ${
            currentIndex === totalPreviewPages - 1
              ? 'border border-[#565A5C]/40 bg-[#090909] text-[#A5A5A0] opacity-30 pointer-events-none cursor-not-allowed'
              : 'bg-[#EEB149] text-[#090909] font-bold hover:bg-[#FFFFFF] cursor-pointer'
          }`}
        >
          <span>Suivant</span>
          <ChevronRight className={`w-3.5 h-3.5 ${currentIndex === totalPreviewPages - 1 ? 'text-[#565A5C]' : 'text-[#090909]'}`} />
        </button>
      </div>
    </section>
  );
}
