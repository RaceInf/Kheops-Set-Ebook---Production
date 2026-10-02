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
      {/* Main Hero Grid: Left Problem/Result & Cover + Right Lead Capture Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center bg-[#FFFFFF] text-[#090909] border border-[#090909] p-6 sm:p-10 lg:p-14">
        {/* Left Column: Accroche orientée résultat & Couverture (sans spoiler le PDF) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
              <span className="px-2.5 py-1 bg-[#090909] text-[#EEB149] font-semibold tracking-wider">
                {FREE_PROTOCOL_RESOURCE.tag}
              </span>
              <span className="text-[#565A5C]">·</span>
              <span className="text-[#090909] font-semibold">
                GUIDE PDF GRATUIT · 6 PAGES
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#090909] leading-[1.06]">
              {FREE_PROTOCOL_RESOURCE.title}
            </h1>

            <p className="text-lg sm:text-xl font-medium text-[#151515] leading-snug">
              “{FREE_PROTOCOL_RESOURCE.subtitle}”
            </p>

            <p className="text-sm sm:text-base text-[#151515]/85 leading-relaxed">
              {FREE_PROTOCOL_RESOURCE.leadPhrase} {FREE_PROTOCOL_RESOURCE.shortDescription}
            </p>
          </div>

          {/* Cover Photo + 3 Promesses de résultat */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pt-4 border-t border-[#565A5C]/25">
            {/* 3D Protocol Cover Photo */}
            <div className="sm:col-span-5 flex justify-center py-5 bg-[#090909] border border-[#090909]">
              <div className="perspective-1200">
                <div
                  className="relative w-[170px] aspect-[3/4.2] bg-[#090909] border border-[#EEB149]/50 shadow-[14px_18px_36px_rgba(0,0,0,0.85)] overflow-hidden p-4 flex flex-col justify-between text-[#FFFFFF]"
                  style={{ transform: 'rotateY(-10deg) rotateX(3deg)' }}
                >
                  <div
                    aria-hidden="true"
                    className="absolute top-0 left-0 right-0 h-[2px] bg-[#EEB149]"
                  />
                  <img
                    src={FREE_PROTOCOL_RESOURCE.coverImage}
                    alt={FREE_PROTOCOL_RESOURCE.title}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-90"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-b from-[#090909]/85 via-transparent to-[#090909]/92"
                  />

                  <div className="relative z-10 flex items-center justify-between font-mono text-[8px] text-[#F3F1EB]">
                    <span>KHEOPS SET</span>
                    <span className="text-[#EEB149]">PDF · 6 P.</span>
                  </div>

                  <div className="relative z-10 mt-auto space-y-1 border-l-2 border-[#EEB149] pl-2.5">
                    <p className="font-mono text-[8px] tracking-[0.2em] text-[#EEB149]">
                      LE PREMIER PLAN
                    </p>
                    <p className="font-display text-sm font-extrabold tracking-tight text-[#FFFFFF] leading-tight">
                      LE PROTOCOLE D’ISOLATION
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Résultats concrets */}
            <div className="sm:col-span-7 space-y-4">
              <p className="font-mono text-xs font-semibold text-[#090909] tracking-wider">
                CE QUE TU VAS OBTENIR EN LE LISANT :
              </p>

              <ul className="space-y-3">
                {FREE_PROTOCOL_RESOURCE.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-3 p-3 bg-[#F3F1EB] border-l-2 border-[#090909] text-xs sm:text-sm font-medium text-[#090909]"
                  >
                    <IconCheck className="w-4 h-4 text-[#090909] shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#565A5C]">
                <IconPdf className="w-4 h-4 text-[#090909]" />
                <span>Téléchargement immédiat après validation.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: LeadCaptureForm */}
        <div className="lg:col-span-5 w-full">
          <LeadCaptureForm
            source="protocole-du-batisseur"
            submitLabel="RECEVOIR LE PROTOCOLE"
            redirectOnSuccess={true}
          />
        </div>
      </div>
    </div>
  );
}
