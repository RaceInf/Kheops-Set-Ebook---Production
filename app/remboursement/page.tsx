import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { LegalDocumentLayout } from '@/components/legal/legal-document-layout';

export const metadata: Metadata = {
  title: 'Politique de Rétractation & Remboursement — Kheops Set',
  description:
    'Règles applicables aux produits numériques téléchargeables, garantie de délivrabilité et gestion des incidents de paiement via Chariow.',
  alternates: { canonical: '/remboursement' },
};

const REMBOURSEMENT_SECTIONS = [
  { id: 'nature-immatérielle', title: 'Nature des Contenus Numériques' },
  { id: 'droit-retractation', title: 'Droit de Rétractation (Digitaux)' },
  { id: 'garantie-fichier', title: 'Garantie d’Accès & Fichier Défectueux' },
  { id: 'doubles-debits', title: 'Incidents & Doublons Chariow' },
  { id: 'procedure-support', title: 'Procédure d’Assistance & Délais' },
];

export default function RemboursementPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090909] text-[#FFFFFF]">
      <Navbar />

      <main id="main-content" className="flex-1 pt-28 pb-32 sm:pb-40">
        <LegalDocumentLayout
          title="Politique de Rétractation & Remboursement"
          subtitle="Ce document explicite les conditions applicables aux manuels numériques à délivrabilité instantanée et les garanties techniques offertes en cas d’anomalie de téléchargement."
          documentType="POLITIQUE DE REMBOURSEMENT"
          lastUpdated="OCTOBRE 2026"
          sections={REMBOURSEMENT_SECTIONS}
          activePath="/remboursement"
        >
          <div className="space-y-12">
            {/* Article 1 */}
            <section id="nature-immatérielle" className="space-y-4 p-6 sm:p-8 bg-[#151515] border border-[#565A5C]/40">
              <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-3 font-mono text-xs">
                <span className="text-[#EEB149] font-semibold">ARTICLE 01</span>
                <span className="text-[#A5A5A0]">LIVRAISON DIRECTE & DÉFINITIVE</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                1. Nature des Contenus Numériques à Exécution Immédiate
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
                <p>
                  Les publications proposées par Kheops Set (<em className="text-[#FFFFFF]">Le Capital du Bâtisseur</em> et <em className="text-[#FFFFFF]">Le Code du Bâtisseur</em>) sont des fichiers immatériels au format PDF téléchargeable.
                </p>
                <p>
                  L’accès au fichier est généré et transmis par voie électronique immédiatement après confirmation de la transaction financière opérée sur Chariow.
                </p>
              </div>
            </section>

            {/* Article 2 */}
            <section id="droit-retractation" className="space-y-4 p-6 sm:p-8 bg-[#151515] border border-[#565A5C]/40">
              <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-3 font-mono text-xs">
                <span className="text-[#EEB149] font-semibold">ARTICLE 02</span>
                <span className="text-[#A5A5A0]">EXCEPTION LÉGALE DE FOURNITURE NUMÉRIQUE</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                2. Droit de Rétractation sur les Produits Digitaux
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
                <p>
                  Conformément aux dispositions internationales régissant la fourniture de contenus numériques non fournis sur un support matériel dont l’exécution commence immédiatement après le paiement avec l’accord préalable du client, <strong className="text-[#FFFFFF]">aucun droit de rétractation ni remboursement standard ne s’applique une fois le lien de téléchargement mis à disposition ou le fichier téléchargé</strong>.
                </p>
                <p>
                  En validant son achat sur Chariow, l’acquéreur renonce expressément à son délai de rétractation afin de bénéficier de la consultation instantanée de son manuel.
                </p>
              </div>
            </section>

            {/* Article 3 */}
            <section id="garantie-fichier" className="space-y-4 p-6 sm:p-8 bg-[#151515] border border-[#565A5C]/40">
              <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-3 font-mono text-xs">
                <span className="text-[#EEB149] font-semibold">ARTICLE 03</span>
                <span className="text-[#A5A5A0]">ENGAGEMENT DE CONFORMITÉ TECHNIQUE</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                3. Garantie d’Accès & Fichier Défectueux
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
                <p>
                  Nous garantissons l’intégrité et la lisibilité complète de nos fichiers. Si un acquéreur rencontre une difficulté technique (lien d’accès expiré prématurément, fichier PDF corrompu, problème d’ouverture logicielle), Kheops Set s’engage à :
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-[#F3F1EB]">
                  <li>Vérifier la validité de la commande enregistrée sur Chariow.</li>
                  <li>Réémettre un lien direct de téléchargement ou acheminer le fichier PDF certifié par email de secours.</li>
                </ul>
              </div>
            </section>

            {/* Article 4 */}
            <section id="doubles-debits" className="space-y-4 p-6 sm:p-8 bg-[#151515] border border-[#565A5C]/40">
              <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-3 font-mono text-xs">
                <span className="text-[#EEB149] font-semibold">ARTICLE 04</span>
                <span className="text-[#A5A5A0]">ANOMALIES BANCAIRES</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                4. Incidents de Paiement & Double Prélèvement
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
                <p>
                  En cas de défaillance réseau lors du paiement Mobile Money ou de double facturation accidentelle avérée sur la plateforme Chariow pour une même commande, l’acheteur doit nous contacter sans délai avec les preuves de débit.
                </p>
                <p>
                  Après confirmation conjointe avec Chariow, la transaction en double fera l’objet d’un remboursement immédiat sur le compte émetteur.
                </p>
              </div>
            </section>

            {/* Article 5 */}
            <section id="procedure-support" className="space-y-4 p-6 sm:p-8 bg-[#151515] border border-[#565A5C]/40">
              <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-3 font-mono text-xs">
                <span className="text-[#EEB149] font-semibold">ARTICLE 05</span>
                <span className="text-[#A5A5A0]">ASSISTANCE SOUS 24 À 48H</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                5. Procédure d’Assistance & Contact
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
                <p>
                  Pour toute réclamation technique ou demande relative à votre commande, utilisez notre formulaire de <Link href="/contact" className="text-[#EEB149] underline hover:text-[#FFFFFF]">Contact</Link> ou écrivez directement à :
                </p>
                <div className="p-4 bg-[#090909] border border-[#565A5C]/30 font-mono text-xs text-[#F3F1EB]">
                  <p><strong className="text-[#EEB149]">Email support :</strong> kheopset@gmail.com</p>
                  <p className="text-[#A5A5A0] pt-1">
                    Merci d’indiquer : Numéro de commande Chariow, adresse email de paiement et description précise de l’incident.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </LegalDocumentLayout>
      </main>

      <Footer />
    </div>
  );
}
