'use client';

import React, { createContext, useContext, useCallback } from 'react';
import {
  CAPITAL_PRODUCT,
  CODE_PRODUCT,
  CHARIOW_CAPITAL_SNAP_ID,
  CHARIOW_CODE_SNAP_ID,
  CHARIOW_CAPITAL_IFRAME_URL,
  CHARIOW_CODE_IFRAME_URL,
  OFFICIAL_CHARIOW_CAPITAL_CHECKOUT,
  OFFICIAL_CHARIOW_CODE_CHECKOUT,
} from '@/lib/products';
import { trackCtaClick, trackEvent } from '@/lib/analytics';

export type CheckoutProductSlug = 'le-capital-du-batisseur' | 'le-code-du-batisseur';

export interface CheckoutProductConfig {
  slug: CheckoutProductSlug;
  title: string;
  subtitle: string;
  snapId: string;
  priceXaf: number;
  originalPriceXaf?: number;
  pageCount: number | string;
  directCheckoutUrl: string;
  iframeUrl: string;
  ctaName: 'capital_checkout' | 'code_checkout';
}

export const CHECKOUT_PRODUCTS: Record<CheckoutProductSlug, CheckoutProductConfig> = {
  'le-capital-du-batisseur': {
    slug: 'le-capital-du-batisseur',
    title: CAPITAL_PRODUCT.title,
    subtitle: CAPITAL_PRODUCT.subtitle,
    snapId: CHARIOW_CAPITAL_SNAP_ID,
    priceXaf: CAPITAL_PRODUCT.salePriceXaf ?? CAPITAL_PRODUCT.priceXaf,
    originalPriceXaf: CAPITAL_PRODUCT.originalPriceXaf,
    pageCount: CAPITAL_PRODUCT.pageCount,
    directCheckoutUrl: OFFICIAL_CHARIOW_CAPITAL_CHECKOUT,
    iframeUrl: CHARIOW_CAPITAL_IFRAME_URL,
    ctaName: 'capital_checkout',
  },
  'le-code-du-batisseur': {
    slug: 'le-code-du-batisseur',
    title: CODE_PRODUCT.title,
    subtitle: CODE_PRODUCT.subtitle,
    snapId: CHARIOW_CODE_SNAP_ID,
    priceXaf: CODE_PRODUCT.salePriceXaf ?? CODE_PRODUCT.priceXaf,
    originalPriceXaf: CODE_PRODUCT.originalPriceXaf,
    pageCount: CODE_PRODUCT.pageCount,
    directCheckoutUrl: OFFICIAL_CHARIOW_CODE_CHECKOUT,
    iframeUrl: CHARIOW_CODE_IFRAME_URL,
    ctaName: 'code_checkout',
  },
};

interface OpenCheckoutOptions {
  slug?: CheckoutProductSlug | string;
  location: string;
  triggerElement?: HTMLElement | null;
}

interface CheckoutModalContextType {
  isOpen: boolean;
  activeProduct: CheckoutProductConfig | null;
  openCheckout: (options: OpenCheckoutOptions) => void;
  closeCheckout: () => void;
}

const CheckoutModalContext = createContext<CheckoutModalContextType | undefined>(undefined);

export function CheckoutModalProvider({ children }: { children: React.ReactNode }) {
  const openCheckout = useCallback(({ slug, location }: OpenCheckoutOptions) => {
    const resolvedSlug: CheckoutProductSlug =
      slug === 'le-code-du-batisseur' || slug === 'code'
        ? 'le-code-du-batisseur'
        : 'le-capital-du-batisseur';

    const productConfig = CHECKOUT_PRODUCTS[resolvedSlug];

    // 1. Envoyer l'événement GA4 cta_click (avec transport beacon)
    trackCtaClick({
      cta_name: productConfig.ctaName,
      cta_location: location,
      link_url: productConfig.directCheckoutUrl,
    });

    trackEvent('click_buy_chariow', {
      product_slug: resolvedSlug,
      location,
    });

    // 2. Ouvrir le checkout Chariow dans un nouvel onglet sécurisé
    // (Évite le blocage d'iframe par checkout.orqex.com lors du clic sur Payer maintenant)
    if (typeof window !== 'undefined') {
      window.open(productConfig.directCheckoutUrl, '_blank', 'noopener,noreferrer');
    }
  }, []);

  const closeCheckout = useCallback(() => {
    // No-op for direct secure tab redirect
  }, []);

  return (
    <CheckoutModalContext.Provider
      value={{
        isOpen: false,
        activeProduct: null,
        openCheckout,
        closeCheckout,
      }}
    >
      {children}
    </CheckoutModalContext.Provider>
  );
}

export function useCheckoutModal() {
  const context = useContext(CheckoutModalContext);
  if (!context) {
    throw new Error('useCheckoutModal must be used within a CheckoutModalProvider');
  }
  return context;
}
