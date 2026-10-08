import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { LegalDocumentLayout } from '@/components/legal/legal-document-layout';

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente & d’Utilisation — Kheops Set',
  description:
    'Conditions régissant l’achat des manuels numériques Kheops Set via la plateforme marchande Chariow et l’usage de nos publications.',
  alternates: { canonical: '/conditions' },
};

const CONDITIONS_SECTIONS = [
  { id: 'nature-produits', title: 'Nature des Manuels Numériques' },
  { id: 'tarification', title: 'Tarification & Devises' },
  { id: 'routage-chariow', title: 'Paiement & Délivrabilité Chariow' },
  { id: 'propriete-licence', title: 'Licence d’Usage Personnel' },
  { id: 'avertissement', title: 'Avertissement & Responsabilité' },
  { id: 'litiges', title: 'Droit Applicable & Support' },
];

export default function ConditionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090909] text-[#FFFFFF]">
      <Navbar />

      <main id="main-content" className="flex-1 pt-28 pb-32 sm:pb-40">
        <LegalDocumentLayout
          title="Conditions Générales de Vente & d’Utilisation"
          subtitle="Ce document définit les règles contractuelles applicables à la consultation de nos supports et à l’acquisition de nos manuels numériques via notre partenaire Chariow."
          documentType="CONDITIONS GÉNÉRALES // CGV & CGU"
          lastUpdated="OCTOBRE 2026"
          sections={CONDITIONS_SECTIONS}
          activePath="/conditions"
        >
          <div className="space-y-12">
            {/* Article 1 */}
            <section id="nature-produits" className="space-y-4 p-6 sm:p-8 bg-[#151515] border border-[#565A5C]/40">
              <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-3 font-mono text-xs">
                <span className="text-[#EEB149] font-semibold">ARTICLE 01</span>
                <span className="text-[#A5A5A0]">FORMAT ÉLECTRONIQUE EXCLUSIF</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                1. Nature des Manuels Numériques
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
                <p>
                  Kheops Set conçoit et édite exclusivement des ouvrages et protocoles au format numérique téléchargeable (documents PDF haute résolution).
                </p>
                <p>
                  Nos deux manuels principaux sont :
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-[#F3F1EB]">
                  <li><strong className="text-[#FFFFFF]">Le Capital du Bâtisseur :</strong> Ebook PDF d’environ 49 pages.</li>
                  <li><strong className="text-[#FFFFFF]">Le Code du Bâtisseur :</strong> Ebook PDF d’environ 38 pages.</li>
                </ul>
                <p>
                  Aucun exemplaire physique imprimé n’est fabriqué ni expédié par voie postale. La livraison s’effectue sous forme d’un lien de téléchargement dématérialisé.
                </p>
              </div>
            </section>

            {/* Article 2 */}
            <section id="tarification" className="space-y-4 p-6 sm:p-8 bg-[#151515] border border-[#565A5C]/40">
              <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-3 font-mono text-xs">
                <span className="text-[#EEB149] font-semibold">ARTICLE 02</span>
                <span className="text-[#A5A5A0]">DEVISE DE RÉFÉRENCE & CONVERSION</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                2. Tarification, Devises & Transparence
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
                <p>
                  La devise de référence et de base de nos manuels est le <strong className="text-[#FFFFFF]">Franc CFA (XAF)</strong>.
                </p>
                <p>
                  Le convertisseur de devise mis à disposition sur le site présente des montants indicatifs en EUR, USD et XOF calculés selon les cours de change usuels. Le montant exact facturé et les options de paiement locales (Mobile Money, cartes bancaires) sont confirmés sur la page de paiement sécurisée de notre partenaire Chariow.
                </p>
              </div>
            </section>

            {/* Article 3 */}
            <section id="routage-chariow" className="space-y-4 p-6 sm:p-8 bg-[#151515] border border-[#565A5C]/40">
              <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-3 font-mono text-xs">
                <span className="text-[#EEB149] font-semibold">ARTICLE 03</span>
                <span className="text-[#A5A5A0]">PROCESSUS MARCHAND EXTERNALISÉ</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                3. Paiement Sécurisé & Délivrabilité via Chariow
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
                <p>
                  Les transactions d’achat sont intégralement opérées par la plateforme marchande externe <strong className="text-[#FFFFFF]">Chariow</strong>.
                </p>
                <p>
                  Lorsque tu cliques sur un bouton d’achat (« PRENDRE LE PLAN » ou « VOIR LE CODE »), tu es redirigé vers l’interface de paiement cryptée SSL de Chariow. Chariow assure la conformité bancaire, la vérification anti-fraude, la collecte du règlement et l’émission immédiate du lien de téléchargement par email.
                </p>
              </div>
            </section>

            {/* Article 4 */}
            <section id="propriete-licence" className="space-y-4 p-6 sm:p-8 bg-[#151515] border border-[#565A5C]/40">
              <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-3 font-mono text-xs">
                <span className="text-[#EEB149] font-semibold">ARTICLE 04</span>
                <span className="text-[#A5A5A0]">DROITS D’AUTEUR & USAGE STRICT</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                4. Licence d’Usage Personnel & Propriété Intellectuelle
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
                <p>
                  L’acquisition d’un manuel numérique Kheops Set confère à l’acheteur une <strong className="text-[#FFFFFF]">licence d’utilisation personnelle, non exclusive et non transférable</strong>.
                </p>
                <p>
                  Sont strictement interdits sous peine de poursuites :
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-[#F3F1EB]">
                  <li>La redistribution, le partage sur des canaux publics (Telegram, WhatsApp, Drive).</li>
                  <li>La revente ou la sous-licence sous quelque forme que ce soit.</li>
                  <li>La reproduction ou l’exploitation commerciale des textes, schémas et graphiques.</li>
                </ul>
              </div>
            </section>

            {/* Article 5 */}
            <section id="avertissement" className="space-y-4 p-6 sm:p-8 bg-[#151515] border border-[#565A5C]/40">
              <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-3 font-mono text-xs">
                <span className="text-[#EEB149] font-semibold">ARTICLE 05</span>
                <span className="text-[#A5A5A0]">RESPONSABILITÉ DÉCISIONNELLE</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                5. Avertissement & Responsabilité Personnelle
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
                <p>
                  Les publications de Kheops Set ont une visée éducative, stratégique et méthodologique. Elles fournissent des repères de structuration financière et de discipline personnelle.
                </p>
                <p>
                  Elles ne constituent en aucun cas un conseil en investissement personnalisé, un conseil juridique ou une promesse de rentabilité garantie. Chaque lecteur demeure pleinement responsable de l’évaluation de ses risques et de ses propres décisions financières.
                </p>
              </div>
            </section>

            {/* Article 6 */}
            <section id="litiges" className="space-y-4 p-6 sm:p-8 bg-[#151515] border border-[#565A5C]/40">
              <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-3 font-mono text-xs">
                <span className="text-[#EEB149] font-semibold">ARTICLE 06</span>
                <span className="text-[#A5A5A0]">SUPPORT CLIENT & CONTACT</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                6. Droit Applicable & Résolution des Réclamations
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
                <p>
                  En cas de difficulté liée au téléchargement d’un fichier après validation du paiement, l’acheteur est invité à contacter notre support technique via la page <strong className="text-[#FFFFFF]">Contact</strong> en précisant son numéro de référence Chariow.
                </p>
                <p>
                  Nous nous engageons à réémettre un lien d’accès fonctionnel sous 24 à 48 heures ouvrées.
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
