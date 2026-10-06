'use client';

import React from 'react';
import { getChariowCheckoutUrl } from '@/lib/ebooks-data';
import { trackEvent } from '@/lib/analytics';

export function FinalCTASection() {
  const checkoutUrl = getChariowCheckoutUrl();

  return (
    <section
      id="decision-finale"
      aria-labelledby="final-cta-heading"
      className="relative w-full bg-[#090909] bg-blueprint-grid-dark text-[#FFFFFF] py-36 sm:py-48 px-4 sm:px-6 lg:px-8 border-b border-[#565A5C]/30 overflow-hidden"
    >
      {/* Discreet golden architectural lines */}
      <div
        aria-hidden="true"
        className="mx-auto max-w-[960px] mb-12 flex items-center justify-center gap-4"
      >
        <span className="h-px flex-1 bg-[#EEB149]/35" />
        <span className="w-2 h-2 bg-[#EEB149]" />
        <span className="h-px flex-1 bg-[#EEB149]/35" />
      </div>

      <div className="mx-auto max-w-[920px] text-center space-y-10">
        <div className="space-y-4">
          <p className="font-mono text-xs tracking-[0.25em] text-[#A5A5A0]">
            LE CHANTIER EST OUVERT
          </p>

          <h2
            id="final-cta-heading"
            className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FFFFFF] leading-[1.06]"
            style={{ textWrap: 'balance' }}
          >
            Tu peux continuer à expliquer.
            <span className="block mt-2 text-[#EEB149]">
              Ou commencer à construire.
            </span>
          </h2>
        </div>

        <div className="flex flex-col items-center space-y-4 pt-2">
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent('click_buy_chariow', {
                product_slug: 'le-capital-du-batisseur',
                location: 'final_cta',
              })
            }
            className="px-10 py-4 text-xs sm:text-sm font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors duration-150 whitespace-nowrap"
          >
            PRENDRE LE PLAN
          </a>

          <p className="text-xs text-[#A5A5A0]">
            Paiement et accès via Chariow.
          </p>

          <div className="pt-4">
            <a
              href="#contenu-du-livre"
              className="text-xs font-mono text-[#F3F1EB] underline underline-offset-4 decoration-[#565A5C] hover:decoration-[#EEB149] hover:text-[#EEB149] transition-colors"
            >
              Voir ce que contient le livre.
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
