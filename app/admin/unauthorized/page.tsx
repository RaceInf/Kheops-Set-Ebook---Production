import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: '403 — Accès Refusé | Kheops Set',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminUnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#090909] text-[#F3F1EB] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#151515] border border-[#565A5C]/40 p-8 space-y-6 text-center shadow-2xl">
        <div className="w-14 h-14 mx-auto rounded-full bg-red-950/40 border border-red-800/60 flex items-center justify-center text-red-400">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-red-400 font-semibold">
            ERREUR 403 · ACCÈS RESTREINT
          </p>
          <h1 className="font-display text-2xl font-bold text-[#FFFFFF]">
            Privilèges insuffisants
          </h1>
          <p className="text-xs sm:text-sm text-[#A5A5A0] leading-relaxed">
            Cette zone est strictement réservée à l’administrateur unique de la marque Kheops Set.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 bg-[#EEB149] text-[#090909] font-mono text-xs font-bold tracking-wider hover:bg-[#FFFFFF] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETOURNER À LA CONNEXION</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
