'use client';

import React, { useState } from 'react';
import type { Product } from '@/lib/products';
import { LeadCaptureForm } from '@/components/resource/LeadCaptureForm';
import { IconBlueprint } from '@/components/icons/kheops-icons';

interface ComingSoonBookCardProps {
  product: Product;
}

export function ComingSoonBookCard({ product }: ComingSoonBookCardProps) {
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);

  return (
    <article className="border border-[#565A5C]/40 bg-[#151515] p-6 sm:p-8 flex flex-col justify-between space-y-6">
      <div className="space-y-5">
        {/* Top Bar with PROCHAINEMENT Badge */}
        <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-4">
          <span className="font-mono text-xs text-[#A5A5A0]">
            {product.category.toUpperCase()}
          </span>
          <span className="px-2.5 py-0.5 border border-[#EEB149]/50 bg-[#090909] text-[#EEB149] font-mono text-xs font-semibold tracking-wider">
            PROCHAINEMENT
          </span>
        </div>

        {/* Minimalist Architectural Monolith Preview + Title */}
        <div className="flex items-start gap-5">
          <div
            aria-hidden="true"
            className="w-16 sm:w-20 aspect-[3/4] bg-[#090909] border border-[#565A5C]/50 shrink-0 flex flex-col justify-between p-2.5"
          >
            <span className="w-full h-[1.5px] bg-[#EEB149]/60 block" />
            <IconBlueprint className="w-4 h-4 text-[#A5A5A0] mx-auto" />
            <span className="font-mono text-[8px] text-[#A5A5A0] text-center tracking-widest">
              KS
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF] leading-snug">
              {product.title}
            </h3>
            <p className="text-sm text-[#A5A5A0] leading-relaxed">
              {product.shortDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Waitlist Action or Inline Waitlist Form */}
      <div className="pt-4 border-t border-[#565A5C]/30">
        {!showWaitlistForm ? (
          <button
            type="button"
            onClick={() => setShowWaitlistForm(true)}
            className="w-full py-3.5 px-5 text-xs font-mono font-semibold tracking-wider border border-[#565A5C] bg-[#090909] text-[#F3F1EB] hover:border-[#EEB149] hover:text-[#EEB149] transition-colors cursor-pointer"
          >
            ÊTRE INFORMÉ À LA SORTIE
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#EEB149]">
                LISTE D’ATTENTE : {product.title.toUpperCase()}
              </span>
              <button
                type="button"
                onClick={() => setShowWaitlistForm(false)}
                className="font-mono text-xs text-[#A5A5A0] hover:text-[#FFFFFF]"
              >
                Fermer
              </button>
            </div>

            <LeadCaptureForm
              source="livres-a-venir"
              bookSlug={product.slug}
              submitLabel="M’INFORMER À LA SORTIE"
              consentText="J’accepte de recevoir une notification par email à la sortie de ce livre et les outils de Kheops Set. Désinscription possible à tout moment."
              redirectOnSuccess={false}
              compact={true}
            />
          </div>
        )}
      </div>
    </article>
  );
}
