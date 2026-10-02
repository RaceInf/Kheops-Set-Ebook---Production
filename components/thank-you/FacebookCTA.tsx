'use client';

import React from 'react';
import { FREE_PROTOCOL_RESOURCE } from '@/lib/products';
import { trackEvent } from '@/lib/analytics';

export function FacebookCTA() {
  const facebookUrl = FREE_PROTOCOL_RESOURCE.facebookPageUrl;
  const hasConfiguredUrl =
    Boolean(facebookUrl) &&
    facebookUrl.startsWith('https://') &&
    !facebookUrl.includes('À_AJOUTER');

  const handleFacebookClick = () => {
    trackEvent('facebook_follow_clicked', {
      location: 'thank_you_page',
    });
  };

  return (
    <section
      aria-labelledby="facebook-cta-heading"
      className="p-6 bg-[#090909] border border-[#565A5C]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div className="space-y-1">
        <p className="font-mono text-[11px] text-[#A5A5A0]">RÉSEAU SECONDAIRE</p>
        <h2
          id="facebook-cta-heading"
          className="font-display text-lg sm:text-xl font-bold text-[#FFFFFF]"
        >
          RETROUVE AUSSI KHEOPS SET SUR FACEBOOK.
        </h2>
      </div>

      {hasConfiguredUrl ? (
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleFacebookClick}
          className="inline-flex items-center justify-center px-5 py-3 text-xs font-mono font-semibold border border-[#565A5C] text-[#F3F1EB] hover:border-[#FFFFFF] hover:text-[#FFFFFF] transition-colors whitespace-nowrap shrink-0"
        >
          SUIVRE SUR FACEBOOK
        </a>
      ) : (
        <span
          aria-disabled="true"
          title="Lien Facebook à configurer"
          className="inline-flex items-center justify-center px-5 py-3 text-xs font-mono font-semibold border border-[#565A5C]/40 text-[#A5A5A0] whitespace-nowrap shrink-0 select-none"
        >
          SUIVRE SUR FACEBOOK
        </span>
      )}
    </section>
  );
}
