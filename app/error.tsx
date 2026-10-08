'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { logger } from '@/lib/logger';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error({
      event: 'app_client_error_boundary',
      message: error?.message || 'Erreur non spécifiée',
      meta: {
        digest: error?.digest || 'aucun',
      },
    });
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#090909] text-[#FFFFFF] px-4 py-24">
      <div className="w-full max-w-[620px] p-8 sm:p-12 border border-[#565A5C]/40 bg-[#151515] space-y-6">
        <p className="font-mono text-xs text-[#EEB149] tracking-wider">
          INCIDENT TECHNIQUE · INTERVENTION
        </p>

        <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#FFFFFF]">
          Le plan a rencontré un obstacle.
        </h1>

        <p className="text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
          Une erreur inattendue est survenue lors de l’affichage de cette page. Tu peux réessayer immédiatement ou revenir à l’accueil.
        </p>

        <div className="pt-4 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-3 text-xs sm:text-sm font-mono font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors cursor-pointer"
          >
            RÉESSAYER
          </button>

          <Link
            href="/"
            className="px-6 py-3 text-xs sm:text-sm font-mono font-semibold tracking-wider border border-[#565A5C] text-[#FFFFFF] hover:border-[#EEB149] hover:text-[#EEB149] transition-colors"
          >
            RETOUR À L’ACCUEIL
          </Link>
        </div>
      </div>
    </div>
  );
}
