import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090909] text-[#FFFFFF]">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="mx-auto w-full max-w-[680px] p-8 sm:p-14 border border-[#565A5C]/50 bg-[#151515] space-y-6">
          <p className="font-mono text-xs text-[#EEB149] tracking-wider">
            ERREUR 404 · ZONE HORS PLAN
          </p>

          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFFFF]">
            Cette page n’existe pas.
          </h1>

          <p className="text-base text-[#A5A5A0] leading-relaxed">
            Le lien que tu as suivi est introuvable ou a été déplacé. Reviens au plan principal.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              href="/"
              className="px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors"
            >
              RETOUR À L’ACCUEIL
            </Link>

            <Link
              href="/ebooks/le-capital-du-batisseur"
              className="px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wider border border-[#565A5C] text-[#FFFFFF] hover:border-[#FFFFFF] transition-colors"
            >
              VOIR LE LIVRE
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
