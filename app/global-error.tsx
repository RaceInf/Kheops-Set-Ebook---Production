'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { logger } from '@/lib/logger';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.safeError('root_global_error', error, {
      digest: error?.digest || 'none',
    });
  }, [error]);

  return (
    <html lang="fr">
      <body className="bg-[#090909] text-[#FFFFFF] font-sans antialiased m-0 p-0 selection:bg-[#EEB149] selection:text-[#090909]">
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
          <div className="w-full max-w-[640px] p-8 sm:p-12 border border-[#565A5C]/40 bg-[#151515] space-y-6">
            <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-4">
              <span className="font-mono text-xs font-bold tracking-widest text-[#FFFFFF]">
                KHEOPS SET
              </span>
              <span className="font-mono text-xs text-[#EEB149] tracking-wider">
                INCIDENT SYSTÈME 500
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFFFF]">
              Interruption technique sur la structure.
            </h1>

            <p className="text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
              Une erreur inattendue au niveau de la racine a interrompu l’exécution. Aucun secret ni donnée personnelle n’a été compromis.
            </p>

            {error?.digest && (
              <div className="p-3 bg-[#090909] border border-[#565A5C]/30 font-mono text-xs text-[#A5A5A0]">
                RÉFÉRENCE TECHNIQUE : <span className="text-[#FFFFFF]">{error.digest}</span>
              </div>
            )}

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => reset()}
                className="px-6 py-3 text-xs sm:text-sm font-mono font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors cursor-pointer"
              >
                RÉINITIALISER LA SESSION
              </button>

              <Link
                href="/"
                className="px-6 py-3 text-xs sm:text-sm font-mono font-semibold tracking-wider border border-[#565A5C] text-[#FFFFFF] hover:border-[#EEB149] hover:text-[#EEB149] transition-colors inline-block"
              >
                RETOUR AU SITE
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
