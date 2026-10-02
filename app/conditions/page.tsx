import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Conditions Générales — Kheops Set',
  description: 'Conditions générales d’utilisation et de vente des ebooks Kheops Set via Chariow.',
  alternates: { canonical: '/conditions' },
};

export default function ConditionsPage() {
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
                Conditions générales
              </li>
            </ol>
          </nav>

          <header className="border-b border-[#565A5C]/35 pb-8 space-y-3">
            <p className="font-mono text-xs text-[#EEB149]">CONDITIONS D’UTILISATION</p>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#FFFFFF]">
              Conditions générales
            </h1>
          </header>

          <div className="space-y-8 text-sm sm:text-base text-[#F3F1EB] leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-display text-xl font-bold text-[#FFFFFF]">
                1. Nature des produits
              </h2>
              <p className="text-[#A5A5A0]">
                Kheops Set édite des ouvrages numériques au format PDF téléchargeable (notamment <em>Le Capital du Bâtisseur</em>, 49 pages). Aucun livre physique imprimé n’est expédié.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-xl font-bold text-[#FFFFFF]">
                2. Prix et devises
              </h2>
              <p className="text-[#A5A5A0]">
                Les prix affichés sur le site pour chaque ouvrage (notamment <em>Le Capital du Bâtisseur</em> et <em>Le Code du Bâtisseur</em>) sont identiques à ceux appliqués lors du paiement sur Chariow. Le sélecteur de devise permet d’afficher les tarifs en XAF, EUR ou USD.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-xl font-bold text-[#FFFFFF]">
                3. Processus de paiement et livraison via Chariow
              </h2>
              <p className="text-[#A5A5A0]">
                Lorsque tu cliques sur « PRENDRE LE PLAN », tu es redirigé vers la plateforme externe Chariow. Le paiement et la mise à disposition du fichier PDF sont assurés par Chariow dès confirmation de la transaction.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-xl font-bold text-[#FFFFFF]">
                4. Licence d’usage personnel
              </h2>
              <p className="text-[#A5A5A0]">
                L’achat d’un ebook confère un droit d’usage strictement personnel et non cessible. Il est interdit de partager publiquement, revendre ou distribuer le fichier PDF à des tiers.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
