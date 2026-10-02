'use client';

import React, { useEffect } from 'react';
import { DownloadButton } from '@/components/thank-you/DownloadButton';
import { WhatsAppCTA } from '@/components/thank-you/WhatsAppCTA';
import { FacebookCTA } from '@/components/thank-you/FacebookCTA';
import { ProductUpsellCards } from '@/components/products/ProductUpsellCards';
import { trackEvent } from '@/lib/analytics';

export function ThankYouResourceFlow() {
  useEffect(() => {
    trackEvent('view_thank_you_page', {
      resource_slug: 'protocole-du-batisseur',
    });
  }, []);

  return (
    <div className="mx-auto w-full max-w-[920px] space-y-10">
      {/* 1. BLOC PRIORITAIRE : TÉLÉCHARGEMENT DU PROTOCOLE (Jamais bloqué par WhatsApp) */}
      <section
        aria-labelledby="protocol-ready-heading"
        className="p-8 sm:p-12 bg-[#151515] border-2 border-[#EEB149] space-y-6"
      >
        <div className="flex items-center justify-between border-b border-[#565A5C]/35 pb-4 font-mono text-xs">
          <span className="text-[#EEB149] font-semibold">
            ÉTAPE 1 · ACCÈS IMMÉDIAT AU GUIDE GRATUIT
          </span>
          <span className="text-[#F3F1EB]">PDF · 6 PAGES</span>
        </div>

        <div className="space-y-3">
          <h1
            id="protocol-ready-heading"
            className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFFFF]"
          >
            TON PROTOCOLE EST PRÊT.
          </h1>
          <p className="text-lg sm:text-xl text-[#F3F1EB] leading-relaxed">
            Tu peux le télécharger maintenant.
          </p>
        </div>

        <DownloadButton />
      </section>

      {/* 2. BLOC WHATSAPP (Recommandé mais facultatif) */}
      <WhatsAppCTA />

      {/* 3. BLOC FACEBOOK (Secondaire) */}
      <FacebookCTA />

      {/* 4. BLOC PRODUITS PAYANTS DISCRETS (Le Capital du Bâtisseur & Le Code du Bâtisseur) */}
      <ProductUpsellCards />
    </div>
  );
}
