import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Politique de Remboursement — Kheops Set',
  description: 'Conditions de remboursement et d’assistance pour les produits numériques Kheops Set.',
  alternates: { canonical: '/remboursement' },
};

export default function RemboursementPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090909] text-[#FFFFFF]">
      <Navbar />

      <main className="flex-1 pt-28 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[840px] space-y-10">
          <nav aria-label="Fil d'Ariane" className="font-mono text-xs text-[#A5A5A0]">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-[#FFFFFF] transition-colors">
                  Accueil
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-[#EEB149]" aria-current="page">
                Politique de remboursement
              </li>
            </ol>
          </nav>

          <header className="border-b border-[#565A5C]/35 pb-8 space-y-3">
            <p className="font-mono text-xs text-[#EEB149]">PRODUITS NUMÉRIQUES</p>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#FFFFFF]">
              Politique de remboursement
            </h1>
          </header>

          <div className="space-y-8 text-sm sm:text-base text-[#F3F1EB] leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-display text-xl font-bold text-[#FFFFFF]">
                1. Produits numériques téléchargeables
              </h2>
              <p className="text-[#A5A5A0]">
                Les ouvrages proposés par Kheops Set sont des fichiers numériques PDF livrés immédiatement après paiement via Chariow. En raison de la nature immatérielle et téléchargeable du produit, tout fichier téléchargé ne fait pas l’objet d’un remboursement automatique après livraison.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-xl font-bold text-[#FFFFFF]">
                2. Problème technique ou double prélèvement
              </h2>
              <p className="text-[#A5A5A0]">
                Si tu rencontres un problème technique empêchant l’ouverture de ton fichier PDF, si tu n’as pas reçu ton lien d’accès après un paiement validé, ou en cas d’erreur de double paiement sur Chariow, contacte-nous immédiatement via la page <Link href="/contact" className="text-[#EEB149] underline">Contact</Link> ou à <span className="text-[#FFFFFF]">kheopset@gmail.com</span>.
              </p>
              <p className="text-[#A5A5A0]">
                Nous vérifions chaque demande rapidement afin de te renvoyer ton fichier ou de régulariser la situation.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
