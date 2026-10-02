import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité — Kheops Set',
  description: 'Politique de protection des données personnelles du site Kheops Set.',
  alternates: { canonical: '/confidentialite' },
};

export default function ConfidentialitePage() {
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
                Politique de confidentialité
              </li>
            </ol>
          </nav>

          <header className="border-b border-[#565A5C]/35 pb-8 space-y-3">
            <p className="font-mono text-xs text-[#EEB149]">PROTECTION DES DONNÉES</p>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#FFFFFF]">
              Politique de confidentialité
            </h1>
          </header>

          <div className="space-y-8 text-sm sm:text-base text-[#F3F1EB] leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-display text-xl font-bold text-[#FFFFFF]">
                1. Données collectées
              </h2>
              <p className="text-[#A5A5A0]">
                Nous collectons uniquement les informations que tu nous transmets volontairement :
              </p>
              <ul className="list-disc pl-5 text-[#A5A5A0] space-y-1">
                <li>
                  Ton adresse email et ton prénom lorsque tu demandes le guide gratuit « Le Protocole d’Isolation ».
                </li>
                <li>
                  Ton nom, ton email et ton message lorsque tu nous écris via la page Contact.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-xl font-bold text-[#FFFFFF]">
                2. Paiement via Chariow
              </h2>
              <p className="text-[#A5A5A0]">
                Le site Kheops Set ne traite aucun paiement directement et ne stocke jamais tes coordonnées bancaires ou Mobile Money. Lors de l’achat d’un ebook, tu es redirigé vers la plateforme sécurisée Chariow qui gère la transaction selon sa propre politique de sécurité.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-xl font-bold text-[#FFFFFF]">
                3. Préférences locales
              </h2>
              <p className="text-[#A5A5A0]">
                Le site enregistre localement dans ton navigateur ta préférence d’affichage de devise (XAF, EUR ou USD) uniquement pour faciliter ta lecture.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-xl font-bold text-[#FFFFFF]">
                4. Droit d’accès, de modification et de suppression
              </h2>
              <p className="text-[#A5A5A0]">
                Ton adresse reste privée et n’est jamais revendue. Tu peux te désinscrire de nos envois à tout moment ou demander la suppression complète de tes données en écrivant à <span className="text-[#FFFFFF]">kheopset@gmail.com</span>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
