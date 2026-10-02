'use client';

import React from 'react';
import { FREE_PROTOCOL_RESOURCE } from '@/lib/products';
import { IconPdf } from '@/components/icons/kheops-icons';
import { trackEvent } from '@/lib/analytics';

interface DownloadButtonProps {
  downloadUrl?: string;
}

export function DownloadButton({
  downloadUrl = FREE_PROTOCOL_RESOURCE.downloadUrl,
}: DownloadButtonProps) {
  const handleDownloadClick = () => {
    trackEvent('free_resource_download_clicked', {
      resource_slug: FREE_PROTOCOL_RESOURCE.slug,
    });
  };

  return (
    <div className="space-y-3">
      <a
        href={downloadUrl}
        onClick={handleDownloadClick}
        className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 text-xs sm:text-sm font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors whitespace-nowrap"
      >
        <IconPdf className="w-4 h-4 shrink-0" />
        <span>TÉLÉCHARGER LE PROTOCOLE</span>
      </a>

      <p className="text-xs text-[#A5A5A0]">
        Le lien est aussi envoyé dans ta boîte email.
      </p>
    </div>
  );
}
