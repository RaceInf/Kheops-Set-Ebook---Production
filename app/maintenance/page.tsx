import React from 'react';
import type { Metadata } from 'next';
import { Hammer, Shield, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Chantier en Maintenance | Kheops Set',
  description: 'Le site est temporairement en maintenance pour recalibrage technique.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#090909] text-[#FFFFFF] flex items-center justify-center p-6 selection:bg-[#EEB149] selection:text-[#090909] font-mono">
      {/* Background blueprint grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#FFFFFF_1px,transparent_1px),linear-gradient(to_bottom,#FFFFFF_1px,transparent_1px)] bg-[size:4rem_4rem]"
        aria-hidden="true"
      />

      <div className="w-full max-w-xl bg-[#151515] border border-[#565A5C]/40 p-8 sm:p-12 shadow-2xl relative text-center">
        {/* Technical corner indicators */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#EEB149]" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#EEB149]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#EEB149]" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#EEB149]" />

        <div className="w-14 h-14 mx-auto bg-[#090909] border border-[#EEB149]/50 flex items-center justify-center text-[#EEB149] mb-6 shadow-lg shadow-[#EEB149]/5">
          <Hammer className="w-7 h-7" />
        </div>

        <span className="text-[11px] text-[#EEB149] uppercase tracking-widest block mb-2 font-bold">
          CODE OPÉRATIONNEL &middot; KHEOPS SET
        </span>

        <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#FFFFFF] mb-4">
          CHANTIER TEMPORAIREMENT FERMÉ
        </h1>

        <p className="text-xs sm:text-sm text-[#A5A5A0] leading-relaxed mb-8 max-w-md mx-auto font-sans">
          Une mise à niveau technique et structurelle est actuellement en cours sur nos systèmes. L&apos;accès à la salle des plans et aux manuels reprendra sous peu.
        </p>

        <div className="p-4 bg-[#090909] border border-[#565A5C]/30 flex items-center justify-center gap-3 text-xs text-[#565A5C] mb-8">
          <Clock className="w-4 h-4 text-[#EEB149]" />
          <span>Statut : Recalibrage en cours &middot; Reprise imminente</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs">
          <Link
            href="/contact"
            className="w-full sm:w-auto px-5 py-3 bg-[#EEB149] text-[#090909] font-bold uppercase tracking-wider hover:bg-[#EEB149]/90 transition-colors inline-flex items-center justify-center gap-2"
          >
            <span>Contacter l&apos;Atelier</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/admin"
            className="w-full sm:w-auto px-5 py-3 border border-[#565A5C]/40 text-[#A5A5A0] hover:text-[#FFFFFF] uppercase tracking-wider hover:border-[#EEB149] transition-colors"
          >
            Accès Administrateur
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-[#565A5C]/20 text-[10px] text-[#565A5C]">
          KHEOPS SET &middot; L&apos;Acier Bienveillant &middot; Les mots ne construisent rien. Les actes, oui.
        </div>
      </div>
    </div>
  );
}
