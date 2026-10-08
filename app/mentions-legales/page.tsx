import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { LegalDocumentLayout } from '@/components/legal/legal-document-layout';

export const metadata: Metadata = {
  title: 'Mentions Légales — Kheops Set',
  description:
    'Informations légales, identification éditoriale, hébergement et propriété intellectuelle de la marque Kheops Set.',
  alternates: { canonical: '/mentions-legales' },
};

const MENTIONS_SECTIONS = [
  { id: 'editeur', title: 'Éditeur & Marque Éditoriale' },
  { id: 'hebergement', title: 'Hébergement & Infrastructure' },
  { id: 'propriete', title: 'Propriété Intellectuelle' },
  { id: 'plateforme-chariow', title: 'Plateforme Marchande (Chariow)' },
  { id: 'avertissement-legal', title: 'Portée Éducative & Avertissement' },
];

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090909] text-[#FFFFFF]">
      <Navbar />

      <main id="main-content" className="flex-1 pt-28 pb-32 sm:pb-40">
        <LegalDocumentLayout
          title="Mentions Légales & Identification Éditoriale"
          subtitle="Informations obligatoires relatives à la publication du site web Kheops Set et à la distribution de nos manuels d’ingénierie personnelle."
          documentType="MENTIONS LÉGALES"
          lastUpdated="OCTOBRE 2026"
          sections={MENTIONS_SECTIONS}
          activePath="/mentions-legales"
        >
          <div className="space-y-12">
            {/* Article 1 */}
            <section id="editeur" className="space-y-4 p-6 sm:p-8 bg-[#151515] border border-[#565A5C]/40">
              <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-3 font-mono text-xs">
                <span className="text-[#EEB149] font-semibold">ARTICLE 01</span>
                <span className="text-[#A5A5A0]">MARQUE ÉDITORIALE</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                1. Éditeur de la Publication
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
                <p>
                  Le présent site est édité sous la marque éditoriale indépendante <strong className="text-[#FFFFFF]">Kheops Set</strong>.
                </p>
                <p>
                  Kheops Set est un atelier éditorial anonyme dédié à la conception de manuels pratiques, de grilles d’audit et de protocoles de décision pour le développement de l’autonomie financière et personnelle.
                </p>
                <div className="p-4 bg-[#090909] border border-[#565A5C]/30 font-mono text-xs text-[#F3F1EB] space-y-1">
                  <p><strong className="text-[#EEB149]">Contact officiel :</strong> kheopset@gmail.com</p>
                  <p><strong className="text-[#EEB149]">Canal web :</strong> https://kheops-set-ebook-mu.vercel.app</p>
                </div>
              </div>
            </section>

            {/* Article 2 */}
            <section id="hebergement" className="space-y-4 p-6 sm:p-8 bg-[#151515] border border-[#565A5C]/40">
              <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-3 font-mono text-xs">
                <span className="text-[#EEB149] font-semibold">ARTICLE 02</span>
                <span className="text-[#A5A5A0]">SERVEURS & RÉSEAU DE DISTRIBUTION</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                2. Hébergement & Infrastructure Cloud
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
                <p>
                  Le site est déployé sur une infrastructure cloud haute performance et sécurisée :
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-[#F3F1EB]">
                  <li><strong className="text-[#FFFFFF]">Hébergement web :</strong> Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.</li>
                  <li><strong className="text-[#FFFFFF]">Protection & DNS :</strong> Cloudflare Inc., 101 Townsend St, San Francisco, CA 94107, USA.</li>
                </ul>
              </div>
            </section>

            {/* Article 3 */}
            <section id="propriete" className="space-y-4 p-6 sm:p-8 bg-[#151515] border border-[#565A5C]/40">
              <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-3 font-mono text-xs">
                <span className="text-[#EEB149] font-semibold">ARTICLE 03</span>
                <span className="text-[#A5A5A0]">PROTECTION INTERNATIONALE DU DROIT D’AUTEUR</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                3. Propriété Intellectuelle & Droits Réservés
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
                <p>
                  L’ensemble des contenus, schémas, maquettes, marques et ouvrages numériques (notamment <em className="text-[#FFFFFF]">Le Capital du Bâtisseur</em>, <em className="text-[#FFFFFF]">Le Code du Bâtisseur</em> et <em className="text-[#FFFFFF]">Le Protocole du Bâtisseur</em>) sont la propriété exclusive de Kheops Set et sont protégés par les traités internationaux relatifs à la propriété littéraire et artistique.
                </p>
                <p>
                  Toute copie, extraction substantielle, diffusion publique non autorisée ou contrefaçon expose son auteur à des poursuites civiles et pénales.
                </p>
              </div>
            </section>

            {/* Article 4 */}
            <section id="plateforme-chariow" className="space-y-4 p-6 sm:p-8 bg-[#151515] border border-[#565A5C]/40">
              <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-3 font-mono text-xs">
                <span className="text-[#EEB149] font-semibold">ARTICLE 04</span>
                <span className="text-[#A5A5A0]">TIERS MARCHAND AGRÉÉ</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                4. Distribution Marchande via Chariow
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
                <p>
                  La commercialisation et la délivrance des accès aux ebooks sont confiées à la plateforme marchande <strong className="text-[#FFFFFF]">Chariow</strong>.
                </p>
                <p>
                  Chariow opère comme vendeur agréé du produit numérique et gère la conformité des règlements (Mobile Money et cartes bancaires).
                </p>
              </div>
            </section>

            {/* Article 5 */}
            <section id="avertissement-legal" className="space-y-4 p-6 sm:p-8 bg-[#151515] border border-[#565A5C]/40">
              <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-3 font-mono text-xs">
                <span className="text-[#EEB149] font-semibold">ARTICLE 05</span>
                <span className="text-[#A5A5A0]">NATURE DES PUBLICATIONS</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                5. Portée Éducative & Avertissement
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
                <p>
                  Les publications de Kheops Set constituent des guides méthodologiques d’auto-formation et d’organisation personnelle.
                </p>
                <p>
                  Elles ne se substituent en aucune manière à un conseil juridique, fiscal, comptable ou financier personnalisé émis par un professionnel dûment accrédité.
                </p>
              </div>
            </section>
          </div>
        </LegalDocumentLayout>
      </main>

      <Footer />
    </div>
  );
}
