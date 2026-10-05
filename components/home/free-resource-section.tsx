'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FREE_PROTOCOL_RESOURCE } from '@/lib/products';
import { LeadCaptureForm } from '@/components/resource/LeadCaptureForm';
import { IconCheck, IconPdf, IconArrowUpRight } from '@/components/icons/kheops-icons';

export function FreeResourceSection() {
  return (
    <section
      id="ressource-gratuite"
      aria-labelledby="free-resource-heading"
      className="w-full bg-[#F3F1EB] bg-blueprint-grid-light text-[#090909] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-[#565A5C]/30"
    >
      <div className="mx-auto max-w-[1360px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center bg-[#FFFFFF] border border-[#090909] p-6 sm:p-12 lg:p-16">
          {/* Left Column: Problème résolu, Résultat concret & Couverture (sans dévoiler le contenu des 6 pages) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#565A5C]">
              <span className="px-2.5 py-1 bg-[#090909] text-[#EEB149] font-semibold tracking-wider">
                {FREE_PROTOCOL_RESOURCE.tag}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-[#090909] font-semibold">
                GUIDE GRATUIT · 6 PAGES
              </span>
            </div>

            <h2
              id="free-resource-heading"
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#090909]"
            >
              {FREE_PROTOCOL_RESOURCE.title}
            </h2>

            <p className="text-lg sm:text-xl font-medium text-[#151515] leading-snug">
              “{FREE_PROTOCOL_RESOURCE.subtitle}”
            </p>

            <p className="text-sm sm:text-base text-[#565A5C] leading-relaxed">
              {FREE_PROTOCOL_RESOURCE.leadPhrase}
            </p>

            {/* Cover Photo + Ce que ce guide change concrètement */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pt-4 border-t border-[#565A5C]/25">
              {/* 3D Cover Photo */}
              <div className="sm:col-span-4 flex justify-center py-4 bg-[#090909] border border-[#090909]">
                <div className="relative w-[145px] aspect-[3/4.2] bg-[#090909] border border-[#EEB149]/50 shadow-[12px_16px_32px_rgba(0,0,0,0.85)] overflow-hidden p-3.5 flex flex-col justify-between text-[#FFFFFF]">
                  <div
                    aria-hidden="true"
                    className="absolute top-0 left-0 right-0 h-[2px] bg-[#EEB149]"
                  />
                  <Image
                    src={FREE_PROTOCOL_RESOURCE.coverImage}
                    alt={FREE_PROTOCOL_RESOURCE.title}
                    fill
                    loading="lazy"
                    sizes="145px"
                    referrerPolicy="no-referrer"
                    className="object-cover object-center opacity-90"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-b from-[#090909]/85 via-transparent to-[#090909]/90"
                  />

                  <div className="relative z-10 flex items-center justify-between font-mono text-[8px] text-[#F3F1EB]">
                    <span>KHEOPS SET</span>
                    <span className="text-[#EEB149]">PDF</span>
                  </div>

                  <div className="relative z-10 mt-auto pt-2 border-t border-[#EEB149]/40">
                    <p className="font-display text-xs font-extrabold tracking-tight text-[#FFFFFF] leading-tight">
                      LE PROTOCOLE D’ISOLATION
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 Résultats concrets (sans spoiler la méthode interne) */}
              <div className="sm:col-span-8 space-y-3">
                <p className="font-mono text-xs text-[#090909] font-semibold tracking-wider">
                  CE QUE CE PROTOCOLE VA CHANGER POUR TOI :
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#151515]">
                  {FREE_PROTOCOL_RESOURCE.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2.5 p-2.5 bg-[#F3F1EB] border-l-2 border-[#090909]"
                    >
                      <IconCheck className="w-4 h-4 text-[#090909] shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-[#090909] text-xs font-mono text-[#EEB149]">
                <IconPdf className="w-4 h-4 text-[#EEB149]" />
                <span>LECTURE RAPIDE (6 PAGES) · APPLICATION IMMÉDIATE</span>
              </div>

              <Link
                href="/ressource-gratuite"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#090909] hover:text-[#565A5C] underline underline-offset-4"
              >
                <span>Accéder à la page dédiée</span>
                <IconArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: LeadCaptureForm */}
          <div className="lg:col-span-5 w-full">
            <LeadCaptureForm
              submitLabel="RECEVOIR LE PROTOCOLE"
              redirectOnSuccess={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
