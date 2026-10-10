'use client';

import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    Chariow?: {
      initializeWidget?: (options?: Record<string, unknown>) => void;
    };
  }
}

export interface ChariowSnapWidgetProps {
  productId?: string;
  storeDomain?: string;
  style?: 'frame' | 'tap' | string;
  borderStyle?: 'rounded' | 'square' | string;
  ctaWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'full' | string;
  ctaAnimation?: 'none' | 'pulse' | string;
  locale?: 'en' | 'fr' | string;
  backgroundColor?: string;
  className?: string;
}

export function ChariowSnapWidget({
  productId = 'prd_09id6x',
  storeDomain = 'fovqbyzx.mychariow.shop',
  style = 'frame',
  borderStyle = 'rounded',
  ctaWidth = 'xs',
  ctaAnimation = 'none',
  locale = 'en',
  backgroundColor = '#FFFFFF',
  className = '',
}: ChariowSnapWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initWidget = () => {
      if (window.Chariow && typeof window.Chariow.initializeWidget === 'function') {
        window.Chariow.initializeWidget();
      }
    };

    // 1. Initialisation immédiate si Chariow est déjà disponible
    initWidget();

    // 2. Si le script est en cours de chargement, écouter son chargement
    const script = document.querySelector<HTMLScriptElement>(
      'script[src*="chariowcdn.com/v1/widget.min.js"]'
    );
    if (script && !window.Chariow) {
      script.addEventListener('load', initWidget, { once: true });
    }

    // 3. Timers de rappel échelonnés pour garantir l'exécution
    const t1 = setTimeout(initWidget, 100);
    const t2 = setTimeout(initWidget, 300);
    const t3 = setTimeout(initWidget, 700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [productId, style, storeDomain]);

  return (
    <div
      className={`w-full overflow-hidden ${className}`}
      suppressHydrationWarning
    >
      <div
        ref={containerRef}
        id="chariow-widget"
        data-product-id={productId}
        data-store-domain={storeDomain}
        data-style={style}
        data-border-style={borderStyle}
        data-cta-width={ctaWidth}
        data-cta-animation={ctaAnimation}
        data-locale={locale}
        data-background-color={backgroundColor}
        suppressHydrationWarning
      />
    </div>
  );
}
