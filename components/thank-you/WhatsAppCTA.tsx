'use client';

import React from 'react';
import { FREE_PROTOCOL_RESOURCE } from '@/lib/products';
import { trackEvent } from '@/lib/analytics';

export function WhatsAppCTA() {
  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_channel_clicked', {
      location: 'thank_you_page',
    });
  };

  return (
    <section
      aria-labelledby="whatsapp-cta-heading"
      className="p-6 sm:p-8 bg-[#090909] border border-[#EEB149]/60 space-y-5"
    >
      <div className="space-y-2">
        <span className="inline-block font-mono text-xs text-[#EEB149] tracking-wider">
          CANAL RECOMMANDÉ (FACULTATIF)
        </span>
        <h2
          id="whatsapp-cta-heading"
          className="font-display text-2xl sm:text-3xl font-bold text-[#FFFFFF]"
        >
          LE CHANTIER CONTINUE.
        </h2>
        <p className="text-sm sm:text-base text-[#F3F1EB] leading-relaxed">
          Rejoins le canal WhatsApp pour recevoir les prochains outils, les annonces et les publications de Kheops Set.
        </p>
      </div>

      <div>
        <a
          href={FREE_PROTOCOL_RESOURCE.whatsappChannelUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          className="inline-flex items-center justify-center gap-3 px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wider border border-[#EEB149] text-[#EEB149] hover:bg-[#EEB149] hover:text-[#090909] transition-colors whitespace-nowrap"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 shrink-0"
            role="img"
            aria-label="Icône WhatsApp"
          >
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
          </svg>
          <span>REJOINDRE LE CANAL WHATSAPP</span>
        </a>
      </div>
    </section>
  );
}
