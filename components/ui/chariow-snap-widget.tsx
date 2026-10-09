'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { trackCtaClick, trackEvent } from '@/lib/analytics';

export interface ChariowSnapWidgetProps {
  productId?: string;
  storeDomain?: string;
  productName: string;
  className?: string;
}

declare global {
  interface Window {
    chariowSnapLoaded?: boolean;
    Chariow?: {
      initializeWidget?: (options?: Record<string, unknown>) => void;
    };
  }
}

export function ChariowSnapWidget({
  productId,
  storeDomain = 'fovqbyzx.mychariow.shop',
  productName,
  className = '',
}: ChariowSnapWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);

  const effectiveProductId =
    productId ||
    (productName.toLowerCase().includes('code')
      ? (process.env.NEXT_PUBLIC_CHARIOW_CODE_SNAP_ID || 'codedubatisseur')
      : (process.env.NEXT_PUBLIC_CHARIOW_CAPITAL_SNAP_ID || 'prd_09id6x'));

  const effectiveStoreDomain = storeDomain || 'fovqbyzx.mychariow.shop';
  const isCodeBook = productName.toLowerCase().includes('code');
  const fallbackUrl = `https://${effectiveStoreDomain}/${
    isCodeBook ? 'codedubatisseur' : 'captaldubatisseur'
  }/checkout`;

  // Écouter les demandes d'ouverture de modale Chariow (depuis d'autres boutons sur la page)
  useEffect(() => {
    const handleGlobalOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ productId?: string; productName?: string }>;
      if (
        !customEvent.detail?.productId ||
        customEvent.detail.productId === effectiveProductId ||
        (customEvent.detail.productName &&
          customEvent.detail.productName.toLowerCase().includes(isCodeBook ? 'code' : 'capital'))
      ) {
        setIsModalOpen(true);
      }
    };

    window.addEventListener('kheops:open-chariow-modal', handleGlobalOpen);
    return () => {
      window.removeEventListener('kheops:open-chariow-modal', handleGlobalOpen);
    };
  }, [effectiveProductId, isCodeBook]);

  // Charger le CSS et le JS du widget Chariow
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!document.getElementById('chariow-widget-css')) {
      const link = document.createElement('link');
      link.id = 'chariow-widget-css';
      link.rel = 'stylesheet';
      link.href = 'https://js.chariowcdn.com/v1/widget.min.css';
      document.head.appendChild(link);
    }

    if (!window.chariowSnapLoaded) {
      window.chariowSnapLoaded = true;
      const script = document.createElement('script');
      script.id = 'chariow-widget-js';
      script.src = 'https://js.chariowcdn.com/v1/widget.min.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // Gestion du scroll du body et touche ESC lorsque la modale est ouverte
  useEffect(() => {
    if (!isModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Initialisation éventuelle du widget si la librairie est disponible
    if (typeof window !== 'undefined' && typeof window.Chariow?.initializeWidget === 'function') {
      try {
        window.Chariow.initializeWidget({
          productId: effectiveProductId,
          storeDomain: effectiveStoreDomain,
          style: 'frame',
          borderStyle: 'rounded',
          ctaWidth: 'xs',
          ctaAnimation: 'none',
          locale: 'en',
          backgroundColor: '#FFFFFF',
        });
      } catch (err) {
        console.warn('Erreur initialisation widget Chariow modal:', err);
      }
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, effectiveProductId, effectiveStoreDomain]);

  const handleOpenModal = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      const ctaName = isCodeBook ? 'code_checkout' : 'capital_checkout';

      trackCtaClick({
        cta_name: ctaName,
        cta_location: 'product_page',
        link_url: fallbackUrl,
      });

      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'cta_click', {
          cta_name: ctaName,
          cta_location: 'product_page',
          link_url: fallbackUrl,
        });
      }

      trackEvent('click_buy_chariow', {
        product_slug: isCodeBook ? 'le-code-du-batisseur' : 'le-capital-du-batisseur',
        location: 'product_page_snap_widget',
      });

      setIsModalOpen(true);
    },
    [isCodeBook, fallbackUrl]
  );

  const iframeSrc = `https://${effectiveStoreDomain}/widget/${effectiveProductId}/checkout?background_color=%23FFFFFF&primary_color=%23EEB149&locale=en`;

  return (
    <>
      <div
        ref={containerRef}
        className={`chariow-snap-widget-wrapper w-full ${className}`}
        aria-label={`Paiement ${productName} via Chariow`}
      >
        <div
          id="chariow-widget"
          data-product-id={effectiveProductId}
          data-store-domain={effectiveStoreDomain}
          data-style="frame"
          data-border-style="rounded"
          data-cta-width="xs"
          data-cta-animation="none"
          data-locale="en"
          data-background-color="#FFFFFF"
          className="w-full flex items-center justify-center min-h-[48px]"
        >
          {/* Bouton principal pour ouvrir le widget Chariow */}
          <a
            href={fallbackUrl}
            onClick={handleOpenModal}
            role="button"
            aria-haspopup="dialog"
            aria-expanded={isModalOpen}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[#EEB149] text-[#090909] font-mono text-sm sm:text-base font-bold tracking-wider hover:bg-[#FFFFFF] transition-all duration-200 text-center cursor-pointer shadow-lg active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EEB149]"
          >
            <span>{isCodeBook ? 'VOIR LE CODE' : 'PRENDRE LE PLAN'}</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      {/* =========================================================================
          MODALE CHARIOW CHECKOUT : S'OUVRE AU CLIC SUR "PRENDRE LE PLAN"
         ========================================================================= */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="chariow-checkout-modal-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#090909]/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false);
            }
          }}
        >
          <div
            className="relative w-full max-w-xl bg-[#151515] border border-[#EEB149]/50 shadow-2xl rounded-sm overflow-hidden my-auto flex flex-col max-h-[94vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Entête de la modale */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#090909] border-b border-[#565A5C]/40 text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EEB149] animate-pulse" />
                <div>
                  <h3
                    id="chariow-checkout-modal-title"
                    className="font-mono text-xs sm:text-sm uppercase tracking-wider text-[#EEB149] font-bold"
                  >
                    {productName}
                  </h3>
                  <p className="font-mono text-[10px] text-[#A5A5A0]">
                    Paiement sécurisé et accès instantané via Chariow
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 bg-[#151515] hover:bg-[#EEB149] hover:text-[#090909] text-[#A5A5A0] font-mono text-xs border border-[#565A5C]/40 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EEB149]"
                aria-label="Fermer la fenêtre de paiement"
              >
                FERMER ✕
              </button>
            </div>

            {/* Conteneur du Widget Chariow */}
            <div className="relative w-full bg-[#FFFFFF] flex-1 min-h-[580px] sm:min-h-[640px] overflow-hidden flex flex-col justify-center">
              {iframeLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#FFFFFF] text-[#090909] gap-3">
                  <div className="w-8 h-8 border-2 border-[#090909] border-t-[#EEB149] rounded-full animate-spin" />
                  <p className="font-mono text-xs text-[#565A5C]">
                    Ouverture du terminal sécurisé Chariow...
                  </p>
                </div>
              )}

              {/* Conteneur Chariow Widget HTML officiel */}
              <div
                id="chariow-modal-embed"
                data-product-id={effectiveProductId}
                data-store-domain={effectiveStoreDomain}
                data-style="frame"
                data-border-style="rounded"
                data-cta-width="xs"
                data-cta-animation="none"
                data-locale="en"
                data-background-color="#FFFFFF"
                className="w-full h-full flex flex-col"
              >
                <iframe
                  src={iframeSrc}
                  title={`Paiement sécurisé Chariow — ${productName}`}
                  className="w-full h-[600px] sm:h-[660px] border-0 block flex-1"
                  onLoad={() => setIframeLoading(false)}
                  allow="payment; camera; clipboard-write; fullscreen"
                  referrerPolicy="no-referrer-when-downgrade"
                  loading="eager"
                />
              </div>
            </div>

            {/* Pied de la modale */}
            <div className="px-4 sm:px-6 py-3 bg-[#090909] border-t border-[#565A5C]/40 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#A5A5A0] shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-[#EEB149]">✓ Mobile Money</span>
                <span>✓ Cartes Bancaires</span>
                <span>✓ Chiffrement SSL</span>
              </div>
              <a
                href={fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#EEB149] hover:text-[#FFFFFF] hover:underline"
              >
                Ouvrir en plein écran ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
