'use client';

import React, { useEffect, useRef } from 'react';
import { X, ExternalLink, ShieldCheck } from 'lucide-react';
import { useCheckoutModal } from '@/context/checkout-modal-context';
import { useCurrency } from '@/context/currency-context';
import { ChariowSnapWidget } from '@/components/chariow/ChariowSnapWidget';

export function ChariowCheckoutModal() {
  const { isOpen, activeProduct, closeCheckout } = useCheckoutModal();
  const { formatPrice, currency } = useCurrency();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Gestion du scroll du body et du focus initial
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus sur le bouton de fermeture pour l'accessibilité
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      clearTimeout(timer);
    };
  }, [isOpen]);

  // Gestion de la touche Escape, du Focus Trap et des messages postMessage de Chariow
  useEffect(() => {
    if (!isOpen) return;

    const handleMessage = (event: MessageEvent) => {
      if (!event.origin || !event.origin.includes('chariow.shop')) return;
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'chariow-checkout-redirect' && typeof data.url === 'string') {
        try {
          const parsed = new URL(data.url);
          if (parsed.protocol === 'https:') {
            window.location.href = data.url;
          }
        } catch {}
      } else if (data.eventType === 'PAYMENT_SUCCESSFUL' && data.eventData?.return_url) {
        try {
          const parsed = new URL(data.eventData.return_url);
          if (parsed.protocol === 'https:') {
            window.location.href = data.eventData.return_url;
          }
        } catch {
          window.location.href = '/merci';
        }
      } else if (data.type === 'chariow-purchase-completed') {
        window.location.href = '/merci';
      }
    };

    window.addEventListener('message', handleMessage);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeCheckout();
        return;
      }

      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeCheckout]);

  if (!isOpen || !activeProduct) return null;

  const displayPrice = formatPrice(activeProduct.priceXaf, currency);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="chariow-checkout-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#090909]/85 backdrop-blur-md"
    >
      {/* Backdrop cliquable pour fermer */}
      <div
        className="absolute inset-0 cursor-pointer"
        aria-hidden="true"
        onClick={closeCheckout}
      />

      {/* Boîte de dialogue architecturale Kheops Set */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-2xl h-[92vh] max-h-[820px] bg-[#090909] border border-[#565A5C]/40 flex flex-col shadow-2xl overflow-hidden focus:outline-none"
      >
        {/* En-tête architectural */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#565A5C]/40 bg-[#151515]/90 shrink-0">
          <div className="space-y-0.5 pr-2">
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-[#EEB149] tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Checkout Sécurisé · Chariow</span>
            </div>
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <h2
                id="chariow-checkout-title"
                className="font-display text-sm sm:text-base font-bold text-[#FFFFFF] tracking-tight truncate max-w-[280px] sm:max-w-md"
              >
                {activeProduct.title}
              </h2>
              <span className="text-xs sm:text-sm font-semibold text-[#EEB149] font-mono">
                {displayPrice}
              </span>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeCheckout}
            aria-label="Fermer la fenêtre de commande"
            className="p-2 sm:p-2.5 text-[#A5A5A0] hover:text-[#FFFFFF] hover:bg-[#565A5C]/20 border border-transparent hover:border-[#565A5C]/40 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EEB149] shrink-0"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Corps de la modale avec Chariow Snap Widget */}
        <div className="relative flex-1 w-full bg-[#090909] overflow-y-auto p-2 sm:p-4 md:p-6 flex flex-col items-center justify-start">
          <div className="w-full max-w-xl mx-auto my-auto py-2">
            <ChariowSnapWidget
              key={activeProduct.slug}
              productId={activeProduct.snapId}
              storeDomain="fovqbyzx.mychariow.shop"
              style="frame"
              borderStyle="rounded"
              ctaWidth="xs"
              ctaAnimation="none"
              locale="en"
              backgroundColor="#FFFFFF"
            />
          </div>
        </div>

        {/* Pied de dialogue avec secours et mentions légales */}
        <div className="px-4 sm:px-6 py-2.5 border-t border-[#565A5C]/40 bg-[#151515] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-[#A5A5A0] shrink-0">
          <span>Paiement sécurisé et accès instantané via Chariow</span>
          <a
            href={activeProduct.directCheckoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#EEB149] hover:text-[#FFFFFF] transition-colors underline underline-offset-2"
          >
            <span>Ouvrir dans un nouvel onglet</span>
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
