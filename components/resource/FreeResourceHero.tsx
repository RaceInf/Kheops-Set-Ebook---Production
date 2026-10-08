'use client';

import React, { useEffect } from 'react';
import { FREE_PROTOCOL_RESOURCE } from '@/lib/products';
import { LeadCaptureForm } from '@/components/resource/LeadCaptureForm';
import { IconCheck, IconPdf } from '@/components/icons/kheops-icons';
import { trackEvent } from '@/lib/analytics';

export function FreeResourceHero() {
  useEffect(() => {
    trackEvent('view_free_resource_page', {
      resource_slug: FREE_PROTOCOL_RESOURCE.slug,
    });
  }, []);

  return (
    <div className="space-y-12">
      {/* Main Hero Grid: Left Presentation + Right Lead Capture Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center bg-[#151515] text-[#FFFFFF] border border-[#565A5C]/50 p-6 sm:p-10 lg:p-14 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#EEB149]/10 to-transparent pointer-events-none"
        />

        {/* Left Column: Accroche, Problème & Bénéfices mesurables */}
        <div className="lg:col-span-7 space-y-6 relative z-10">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
              <span className="px-2.5 py-1 bg-[#090909] border border-[#EEB149]/50 text-[#EEB149] font-semibold tracking-wider uppercase">
                {FREE_PROTOCOL_RESOURCE.tag}
              </span>
              <span className="text-[#565A5C]">·</span>
              <span className="text-[#A5A5A0] font-semibold flex items-center gap-1.5">
                <IconPdf className="w-3.5 h-3.5 text-[#EEB149]" />
                FICHE TECHNIQUE · 10 MIN DE LECTURE
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFFFF] leading-[1.06]">
              {FREE_PROTOCOL_RESOURCE.title}
            </h1>

            <p className="text-lg sm:text-xl font-medium text-[#EEB149] leading-snug">
              « {FREE_PROTOCOL_RESOURCE.subtitle} »
            </p>

            <p className="text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
              {FREE_PROTOCOL_RESOURCE.leadPhrase} {FREE_PROTOCOL_RESOURCE.shortDescription}
            </p>
          </div>

          {/* 3 Mesures Concrètes de la Fiche */}
          <div className="pt-6 border-t border-[#565A5C]/35 space-y-3">
            <p className="font-mono text-xs text-[#EEB149] uppercase tracking-wider">
              CE QUE CETTE FICHE ISOLE IMMÉDIATEMENT :
            </p>
            <ul className="space-y-2.5 text-sm text-[#F3F1EB]">
              {FREE_PROTOCOL_RESOURCE.benefits.slice(0, 3).map((benefit, i) => (
                <li key={i} className="flex items-start gap-3 bg-[#090909]/60 p-3 border border-[#565A5C]/30">
                  <IconCheck className="w-4 h-4 text-[#EEB149] shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: High-Focus Lead Capture Card */}
        <div className="lg:col-span-5 relative z-10">
          <div className="bg-[#090909] border border-[#EEB149]/60 p-6 sm:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.8)] space-y-5">
            <div className="space-y-1.5 border-b border-[#565A5C]/30 pb-4">
              <span className="font-mono text-[11px] text-[#EEB149] uppercase tracking-wider font-semibold">
                ACCÈS IMMÉDIAT // FICHE PDF
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                Recevoir le Protocol
              </h2>
              <p className="text-xs text-[#A5A5A0]">
                Renseigne ton adresse pour recevoir ton lien de téléchargement direct.
              </p>
            </div>

            <LeadCaptureForm />

            <div className="pt-2 border-t border-[#565A5C]/25 text-center">
              <p className="font-mono text-[10px] text-[#A5A5A0]">
                Accès direct par email
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
