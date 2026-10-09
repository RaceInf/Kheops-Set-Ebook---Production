'use client';

import React, { useEffect, useRef } from 'react';
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

  const effectiveProductId =
    productId ||
    (productName.toLowerCase().includes('code')
      ? (process.env.NEXT_PUBLIC_CHARIOW_CODE_SNAP_ID || 'codedubatisseur')
      : (process.env.NEXT_PUBLIC_CHARIOW_CAPITAL_SNAP_ID || 'prd_09id6x'));

  const effectiveStoreDomain = storeDomain || 'fovqbyzx.mychariow.shop';

  useEffect(() => {
    // 1. Charger le CSS Chariow Snap une seule fois
    if (!document.getElementById('chariow-snap-css')) {
      const link = document.createElement('link');
      link.id = 'chariow-snap-css';
      link.rel = 'stylesheet';
      link.href = 'https://js.chariowcdn.com/v1/widget.min.css';
      document.head.appendChild(link);
    }

    const initWidget = () => {
      try {
        if (
          typeof window !== 'undefined' &&
          typeof window.Chariow?.initializeWidget === 'function'
        ) {
          window.Chariow.initializeWidget({
            productId: effectiveProductId,
            storeDomain: effectiveStoreDomain,
            style: 'frame',
            borderStyle: 'rounded',
            ctaWidth: 'xs',
            ctaAnimation: 'none',
            locale: 'fr',
            backgroundColor: '#090909',
            primaryColor: '#EEB149',
          });
        }
      } catch (err) {
        console.warn('Erreur initialisation widget Chariow Snap:', err);
      }
    };

    // 2. Charger le script JS Chariow Snap une seule fois
    if (!window.chariowSnapLoaded) {
      window.chariowSnapLoaded = true;
      const script = document.createElement('script');
      script.id = 'chariow-snap-js';
      script.src = 'https://js.chariowcdn.com/v1/widget.min.js';
      script.async = true;
      script.onload = () => {
        setTimeout(initWidget, 80);
      };
      document.head.appendChild(script);
    } else {
      setTimeout(initWidget, 80);
    }
  }, [effectiveProductId, effectiveStoreDomain]);

  // Écouteur de clic pour le tracking GA4
  const handleWidgetClick = () => {
    const isCode = productName.toLowerCase().includes('code');
    const ctaName = isCode ? 'code_checkout' : 'capital_checkout';
    const linkUrl = `https://${effectiveStoreDomain}/${
      isCode ? 'codedubatisseur' : 'captaldubatisseur'
    }/checkout`;

    // 1. Tracking GA4 via helper existant
    trackCtaClick({
      cta_name: ctaName,
      cta_location: 'product_page',
      link_url: linkUrl,
    });

    // 2. Appel direct gtag pour conformité stricte
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'cta_click', {
        cta_name: ctaName,
        cta_location: 'product_page',
        link_url: linkUrl,
      });
    }

    // 3. Tracking interne
    trackEvent('click_buy_chariow', {
      product_slug: isCode ? 'le-code-du-batisseur' : 'le-capital-du-batisseur',
      location: 'product_page_snap_widget',
    });
  };

  const isCodeBook = productName.toLowerCase().includes('code');
  const fallbackUrl = `https://${effectiveStoreDomain}/${
    isCodeBook ? 'codedubatisseur' : 'captaldubatisseur'
  }/checkout`;

  return (
    <div
      ref={containerRef}
      onClick={handleWidgetClick}
      className={`chariow-snap-widget-wrapper w-full ${className}`}
      aria-label={`Paiement ${productName} via Chariow`}
    >
      <div
        id="chariow-widget"
        data-product-id={effectiveProductId}
        data-product={effectiveProductId}
        data-store-domain={effectiveStoreDomain}
        data-store={effectiveStoreDomain}
        data-style="frame"
        data-border-style="rounded"
        data-cta-width="xs"
        data-cta-animation="none"
        data-locale="fr"
        data-background-color="#090909"
        data-primary-color="#EEB149"
        className="w-full flex items-center justify-center min-h-[48px]"
      >
        {/* Bouton de secours élégant (visible immédiatement en attendant l'injection Chariow) */}
        <a
          href={fallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[#EEB149] text-[#090909] font-mono text-sm sm:text-base font-bold tracking-wider hover:bg-[#FFFFFF] transition-colors text-center cursor-pointer"
        >
          <span>{isCodeBook ? 'VOIR LE CODE' : 'PRENDRE LE PLAN'}</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}
