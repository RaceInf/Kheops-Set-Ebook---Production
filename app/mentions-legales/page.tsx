import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Mentions Légales — Kheops Set',
  description: 'Mentions légales et propriété intellectuelle du site éditorial Kheops Set.',
  alternates: { canonical: '/mentions-legales' },
};

export default function MentionsLegalesPage() {
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
                Mentions légales
              </li>
            </ol>
          </nav>

          <header className="border-b border-[#565A5C]/35 pb-8 space-y-3">
            <p className="font-mono text-xs text-[#EEB149]">CADRE JURIDIQUE</p>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#FFFFFF]">
              Mentions légales
            </h1>
          </header>

          <div className="space-y-8 text-sm sm:text-base text-[#F3F1EB] leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-display text-xl font-bold text-[#FFFFFF]">
                1. Éditeur de la publication
              </h2>
              <p className="text-[#A5A5A0]">
                Le présent site est édité sous la marque éditoriale <strong>Kheops Set</strong> (Kheops Set Motivation).
              </p>
              <p className="text-[#A5A5A0]">
                Email de contact : <span className="text-[#FFFFFF]">kheopset@gmail.com</span>
              </p>
              <p className="text-[#A5A5A0]">
                Informations administratives complémentaires : [À REMPLACER SELON LA STRUCTURE JURIDIQUE FINALE]
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-xl font-bold text-[#FFFFFF]">
                2. Hébergement
              </h2>
              <p className="text-[#A5A5A0]">
                Ce site est hébergé sur une infrastructure cloud sécurisée (Vercel Inc. / Google Cloud Platform).
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-xl font-bold text-[#FFFFFF]">
                3. Propriété intellectuelle
              </h2>
              <p className="text-[#A5A5A0]">
                L’ensemble des textes, ouvrages numériques (notamment <em>Le Capital du Bâtisseur</em>, <em>Le Code du Bâtisseur</em> et <em>Le Protocole d’Isolation</em>), visuels et éléments graphiques présents sur ce site sont protégés par le droit d’auteur international. Toute reproduction, revente ou diffusion non autorisée est strictement interdite.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-xl font-bold text-[#FFFFFF]">
                4. Avertissement sur la nature éducative du contenu
              </h2>
              <p className="text-[#A5A5A0]">
                Les contenus publiés par Kheops Set sont fournis à titre strictement éducatif et informatif. Ils ne constituent en aucun cas un conseil financier personnalisé, juridique, fiscal ou médical.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
