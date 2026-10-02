'use client';

import React from 'react';
import Link from 'next/link';
import { IconCheck, IconArrowUpRight } from '@/components/icons/kheops-icons';

interface EmailCaptureSuccessProps {
  message?: string;
  showProtocolLink?: boolean;
}

export function EmailCaptureSuccess({
  message = 'C’est bon. Ton protocole est prêt.',
  showProtocolLink = true,
}: EmailCaptureSuccessProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="p-6 sm:p-8 bg-[#090909] border border-[#EEB149] text-[#FFFFFF] space-y-5"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#EEB149] text-[#090909] flex items-center justify-center shrink-0">
          <IconCheck className="w-4 h-4" />
        </div>
        <p className="font-display text-lg sm:text-xl font-bold text-[#FFFFFF]">
          {message}
        </p>
      </div>

      {showProtocolLink && (
        <div className="space-y-3 pt-2 border-t border-[#565A5C]/35">
          <p className="text-xs sm:text-sm text-[#F3F1EB] leading-relaxed">
            Redirection vers ta page de téléchargement en cours… Si la page ne s’ouvre pas automatiquement :
          </p>
          <Link
            href="/merci?ressource=protocole-du-batisseur"
            className="inline-flex items-center gap-2 px-5 py-3 text-xs font-mono font-semibold bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors"
          >
            <span>ACCÉDER À MON PROTOCOLE MAINTENANT</span>
            <IconArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
