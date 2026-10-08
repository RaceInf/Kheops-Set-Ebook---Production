import React from 'react';
import Link from 'next/link';
import { IconArrowUpRight } from '@/components/icons/kheops-icons';

export function AboutPreviewSection() {
  return (
    <section
      id="a-propos-apercu"
      aria-labelledby="about-preview-heading"
      className="w-full bg-[#151515] text-[#FFFFFF] py-32 sm:py-40 px-4 sm:px-6 lg:px-8 border-b border-[#565A5C]/30"
    >
      <div className="mx-auto max-w-[1360px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center border border-[#565A5C]/45 bg-[#090909] p-8 sm:p-12 lg:p-16">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2 text-xs font-mono text-[#A5A5A0]">
              <span>SECTION I · IDENTITÉ ÉDITORIALE</span>
            </div>

            <h2
              id="about-preview-heading"
              className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#FFFFFF] leading-[1.08]"
              style={{ textWrap: 'balance' }}
            >
              Ce n’est pas une personne à suivre.{' '}
              <span className="text-[#F3F1EB] block mt-1">
                C’est un code à appliquer.
              </span>
            </h2>
          </div>

          <div className="lg:col-span-5 space-y-6 border-t lg:border-t-0 lg:border-l border-[#565A5C]/35 pt-6 lg:pt-0 lg:pl-10">
            <p className="text-base sm:text-lg text-[#F3F1EB] leading-relaxed">
              Kheops Set crée des outils pour les personnes qui veulent mieux décider, mieux protéger leur temps et construire plus loin.
            </p>

            <div className="pt-2">
              <Link
                href="/a-propos"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wider border border-[#EEB149] text-[#EEB149] hover:bg-[#EEB149] hover:text-[#090909] transition-colors whitespace-nowrap"
              >
                <span>DÉCOUVRIR LE MANIFESTE</span>
                <IconArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
