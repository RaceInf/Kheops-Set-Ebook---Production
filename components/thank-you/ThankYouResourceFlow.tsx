'use client';

import React, { useEffect } from 'react';
import { DownloadButton } from '@/components/thank-you/DownloadButton';
import { WhatsAppCTA } from '@/components/thank-you/WhatsAppCTA';
import { DualBookShowcase } from '@/components/products/DualBookShowcase';
import { trackEvent } from '@/lib/analytics';

export function ThankYouResourceFlow() {
  useEffect(() => {
    trackEvent('view_thank_you_page', {
      resource_slug: 'protocole-du-batisseur',
    });
  }, []);

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-14">
      {/* 1. BLOC PRIORITAIRE : TÉLÉCHARGEMENT DU PROTOCOLE */}
      <section
        aria-labelledby="protocol-ready-heading"
        className="p-8 sm:p-12 lg:p-14 bg-[#151515] border-2 border-[#EEB149] space-y-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#565A5C]/35 pb-4 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#EEB149]" />
            <span className="text-[#EEB149] font-semibold tracking-wider uppercase">
              ACCÈS IMMÉDIAT // PROTOCOLE D’EXTRACTION
            </span>
          </div>
          <span className="text-[#A5A5A0]">PDF VECTORIEL HAUTE DÉFINITION</span>
        </div>

        <div className="space-y-4">
          <h1
            id="protocol-ready-heading"
            className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FFFFFF] leading-[1.08]"
          >
            Ton Protocole est prêt.
          </h1>
          <p className="text-base sm:text-lg text-[#F3F1EB] max-w-2xl leading-relaxed">
            Clique sur le bouton ci-dessous pour lancer le téléchargement direct du PDF.
            Une copie de secours a également été transmise à ton adresse email.
          </p>
        </div>

        <div className="pt-2">
          <DownloadButton />
        </div>

        <div className="pt-4 border-t border-[#565A5C]/25 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#A5A5A0]">
          <span>• Fichier léger et autonome sans DRM</span>
          <span>• Lecture immédiate sur smartphone & PC</span>
        </div>
      </section>

      {/* 2. CANAL D'ANNONCES WHATSAPP (Secondaire) */}
      <WhatsAppCTA />

      {/* 3. MANUELS D'INGÉNIERIE KHEOPS SET (Présentés à égalité) */}
      <div className="pt-6 border-t border-[#565A5C]/35 space-y-8">
        <DualBookShowcase
          title="Passe de l’audit d’urgence à la construction de ton capital"
          subtitle="Le Protocole isole tes fuites immédiates. Nos manuels d'ingénierie détaillent le système complet pour construire ton autonomie."
          ctaLocation="thank_you"
        />
      </div>
    </div>
  );
}
