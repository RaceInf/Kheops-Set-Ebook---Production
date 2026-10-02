'use client';

import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Lock, BookOpen, X } from 'lucide-react';
import type { Product } from '@/lib/products';
import { getChariowCheckoutUrl } from '@/lib/products';
import { trackEvent } from '@/lib/analytics';

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
  const checkoutUrl = getChariowCheckoutUrl(product.chariowUrl, product.slug);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < totalPreviewPages - 1 ? prev + 1 : prev));
  }, [totalPreviewPages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Bloque les raccourcis clavier de copie/sauvegarde/impression sur la liseuse
    if ((e.ctrlKey || e.metaKey) && ['c', 's', 'p', 'u'].includes(e.key.toLowerCase())) {
      e.preventDefault();
      return;
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  if (totalPreviewPages === 0 || !currentPage) {
    return null;
  }

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="w-full space-y-6 focus:outline-none print:hidden"
    >
      {/* Header de la liseuse */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#565A5C]/35 pb-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="px-2.5 py-0.5 bg-[#EEB149] text-[#090909] font-bold tracking-wider">
              APERÇU DIRECT ({totalPreviewPages} PAGES)
            </span>
            <span className="text-[#A5A5A0]">·</span>
            <span className="inline-flex items-center gap-1.5 text-[#A5A5A0]">
              <Lock className="w-3.5 h-3.5 text-[#EEB149]" aria-hidden="true" />
              LECTURE SEULE (NON TÉLÉCHARGEABLE)
            </span>
          </div>
          <h2
            id={`${id}-heading`}
            className="font-display text-2xl sm:text-3xl font-bold text-[#FFFFFF]"
          >
            Feuilleter les premières pages — {product.title}
          </h2>
        </div>

        {/* Sélecteur rapide de pages + bouton fermer optionnel */}
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          <div
            role="group"
            aria-label="Pages de l'aperçu"
            className="inline-flex items-center border border-[#565A5C]/50 bg-[#151515] p-1"
          >
            {pages.map((p, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={p.pageNumberLabel}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-pressed={isActive}
                  className={`px-3 py-1.5 font-mono text-xs transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#EEB149] text-[#090909] font-bold'
                      : 'text-[#A5A5A0] hover:text-[#FFFFFF]'
                  }`}
                >
                  Extrait {idx + 1}/{totalPreviewPages}
                </button>
              );
            })}
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer la liseuse d'aperçu"
              className="inline-flex items-center gap-1.5 px-3 py-2 font-mono text-xs font-semibold border border-[#565A5C]/60 bg-[#090909] text-[#A5A5A0] hover:border-[#EEB149] hover:text-[#FFFFFF] transition-colors cursor-pointer"
            >
              <span>FERMER</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Cadre de la Liseuse Protégée */}
      <div
        onContextMenu={(e) => e.preventDefault()}
        onCopy={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        className="relative mx-auto max-w-[880px] border-2 border-[#565A5C]/60 bg-[#151515] p-3 sm:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.85)] select-none"
        style={{
          WebkitUserSelect: 'none',
          userSelect: 'none',
          WebkitTouchCallout: 'none',
        }}
      >
        {/* Barre supérieure technique de la liseuse */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#565A5C]/35 font-mono text-[11px] text-[#A5A5A0]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-[#EEB149]" aria-hidden="true" />
            <span>LISEUSE KHEOPS SET · {product.title.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-3 tabular-nums">
            <span className="text-[#EEB149] font-semibold">
              {currentPage.pageNumberLabel}
            </span>
            <span className="hidden sm:inline text-[#565A5C]">|</span>
            <span className="hidden sm:inline">COPIE & TÉLÉCHARGEMENT DÉSACTIVÉS</span>
          </div>
        </div>

        {/* Feuille de livre (Fond papier éditorial #F3F1EB) */}
        <div className="relative bg-[#F3F1EB] text-[#090909] border border-[#090909] px-6 py-10 sm:px-14 sm:py-14 min-h-[540px] flex flex-col justify-between overflow-hidden">
          {/* FILIGRANE CENTRAL "KHEOPS SET" (Plein milieu, indélébile mais ne gêne pas la lecture) */}
          <div
            aria-hidden="true"
            className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden z-20"
          >
            <div className="-rotate-24 flex flex-col items-center justify-center text-center border-y-2 border-[#090909]/[0.06] py-4 px-8">
              <span className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-[0.26em] text-[#090909]/[0.065] whitespace-nowrap">
                KHEOPS SET
              </span>
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.38em] text-[#090909]/[0.075] mt-1 font-semibold whitespace-nowrap">
                APERÇU PROTÉGÉ · {product.title.toUpperCase()}
              </span>
            </div>
          </div>

          {/* En-tête de la page du livre */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-[#090909]/20 pb-3 font-mono text-[11px] text-[#565A5C]">
              <span>{currentPage.sectionLabel}</span>
              <span className="font-semibold text-[#090909] tabular-nums">
                {currentPage.pageNumberLabel}
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#090909] tracking-tight leading-snug">
              {currentPage.heading}
            </h3>

            {currentPage.quote && (
              <blockquote className="p-4 sm:p-5 bg-[#FFFFFF] border-l-4 border-[#EEB149] font-display text-base sm:text-lg font-semibold text-[#090909] leading-snug">
                {currentPage.quote}
              </blockquote>
            )}

            <div className="space-y-4 text-sm sm:text-base text-[#151515] leading-relaxed">
              {currentPage.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Coupure stratégique sur la dernière page de l'aperçu */}
            {currentPage.lockedTeaser && (
              <div className="mt-6 pt-6 border-t border-[#090909]/20 relative">
                {/* Lignes floutées pour donner envie de lire la suite sans la dévoiler */}
                <div
                  aria-hidden="true"
                  className="space-y-3 text-sm text-[#151515] blur-[4.5px] opacity-60 pointer-events-none select-none"
                >
                  {currentPage.lockedTeaser.blurredLines.map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>

                {/* Carte de déblocage du livre complet */}
                <div className="mt-4 p-5 sm:p-6 bg-[#090909] text-[#FFFFFF] border border-[#EEB149] space-y-4 shadow-xl">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#EEB149]">
                    <Lock className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{currentPage.lockedTeaser.title}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#F3F1EB] leading-relaxed">
                    {currentPage.lockedTeaser.ctaPrompt}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <a
                      href={checkoutUrl}
                      onClick={() =>
                        trackEvent('click_buy_chariow', {
                          product_slug: product.slug,
                          location: 'preview_reader_unlock',
                        })
                      }
                      className="px-6 py-3 text-xs font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors whitespace-nowrap"
                    >
                      {product.ctaLabel} ({product.pageCount} PAGES COMPLÈTES)
                    </a>
                    <span className="font-mono text-[11px] text-[#A5A5A0]">
                      Paiement et accès immédiat via Chariow.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pied de page de la feuille */}
          <div className="relative z-10 mt-10 pt-4 border-t border-[#090909]/20 flex items-center justify-between font-mono text-[10px] text-[#565A5C]">
            <span>KHEOPS SET · L’ACIER BIENVEILLANT</span>
            <span>
              EXTRAIT {currentIndex + 1} SUR {totalPreviewPages} (DOCUMENT COMPLET : {product.pageCount} PAGES)
            </span>
          </div>
        </div>

        {/* Barre de navigation inférieure Précédent / Suivant */}
        <div className="mt-4 pt-3 border-t border-[#565A5C]/35 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 font-mono text-xs font-semibold border border-[#565A5C]/60 bg-[#090909] text-[#FFFFFF] hover:border-[#EEB149] disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-[#EEB149]" />
            <span>PAGE PRÉCÉDENTE</span>
          </button>

          <span className="font-mono text-xs text-[#A5A5A0] tabular-nums">
             {currentIndex + 1} / {totalPreviewPages}
          </span>

          {currentIndex < totalPreviewPages - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-xs font-semibold bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors cursor-pointer"
            >
              <span>PAGE SUIVANTE</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <a
              href={checkoutUrl}
              onClick={() =>
                trackEvent('click_buy_chariow', {
                  product_slug: product.slug,
                  location: 'preview_reader_footer',
                })
              }
              className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-xs font-semibold bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors whitespace-nowrap"
            >
              <span>{product.ctaLabel}</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
