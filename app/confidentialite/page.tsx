import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { LegalDocumentLayout } from '@/components/legal/legal-document-layout';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité & Protection des Données — Kheops Set',
  description:
    'Règles de collecte minimale, de protection de la vie privée et de traitement des données personnelles par l’atelier Kheops Set.',
  alternates: { canonical: '/confidentialite' },
};

const PRIVACY_SECTIONS = [
  { id: 'donnees-collectees', title: 'Données Personnelles Collectées' },
  { id: 'finalites-conservation', title: 'Finalités & Durée de Conservation' },
  { id: 'paiement-chariow', title: 'Paiement & Coordonnées Bancaires' },
  { id: 'cookies-preferences', title: 'Traceurs & Stockage Local' },
  { id: 'sous-traitants', title: 'Sous-traitants Techniques' },
  { id: 'droits-utilisateurs', title: 'Exercice de vos Droits (RGPD)' },
];

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090909] text-[#FFFFFF]">
      <Navbar />

      <main id="main-content" className="flex-1 pt-28 pb-32 sm:pb-40">
        <LegalDocumentLayout
          title="Politique de Confidentialité & Traitement des Données"
          subtitle="Chez Kheops Set, la discrétion et la souveraineté sont des principes cardinaux. Nous appliquons une collecte minimale de données sans régie publicitaire ni profilage intrusif."
          documentType="CONFIDENTIALITÉ & RGPD"
          lastUpdated="OCTOBRE 2026"
          sections={PRIVACY_SECTIONS}
          activePath="/confidentialite"
        >
          <div className="space-y-12">
            {/* Article 1 */}
            <section id="donnees-collectees" className="space-y-4 p-6 sm:p-8 bg-[#151515] border border-[#565A5C]/40">
              <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-3 font-mono text-xs">
                <span className="text-[#EEB149] font-semibold">ARTICLE 01</span>
                <span className="text-[#A5A5A0]">COLLECTE STRICTE DU STRICT NÉCESSAIRE</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                1. Données Personnelles Collectées
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
                <p>
                  Kheops Set ne collecte que les données que tu nous transmets de manière volontaire et explicite :
                </p>
                <ul className="list-disc pl-5 space-y-2 text-[#F3F1EB]">
                  <li>
                    <strong className="text-[#FFFFFF]">Demande du guide gratuit (Protocole) :</strong> Ton adresse email et ton prénom (facultatif).
                  </li>
                  <li>
                    <strong className="text-[#FFFFFF]">Formulaire de contact :</strong> Ton nom, ton adresse email, l’objet et le texte de ton message.
                  </li>
                  <li>
                    <strong className="text-[#FFFFFF]">Commandes Chariow :</strong> Lorsque tu achètes un ebook sur Chariow, Chariow nous transmet ton adresse email et l’identifiant du produit pour valider ton inscription à notre liste de diffusion des acheteurs.
                  </li>
                </ul>
              </div>
            </section>

            {/* Article 2 */}
            <section id="finalites-conservation" className="space-y-4 p-6 sm:p-8 bg-[#151515] border border-[#565A5C]/40">
              <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-3 font-mono text-xs">
                <span className="text-[#EEB149] font-semibold">ARTICLE 02</span>
                <span className="text-[#A5A5A0]">FINALITÉS LÉGITIMES</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                2. Finalités & Durée de Conservation
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
                <p>
                  Tes données sont utilisées exclusivement pour :
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-[#F3F1EB]">
                  <li>Te faire parvenir le lien de téléchargement de ton document PDF.</li>
                  <li>Répondre à tes demandes d’assistance et assurer le service après-vente.</li>
                  <li>T’informer occasionnellement des nouvelles publications majeures de l’atelier Kheops Set.</li>
                </ul>
                <p>
                  Les données sont conservées pour une durée maximale de 3 ans après ta dernière interaction, ou supprimées immédiatement sur simple demande.
                </p>
              </div>
            </section>

            {/* Article 3 */}
            <section id="paiement-chariow" className="space-y-4 p-6 sm:p-8 bg-[#151515] border border-[#565A5C]/40">
              <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-3 font-mono text-xs">
                <span className="text-[#EEB149] font-semibold">ARTICLE 03</span>
                <span className="text-[#A5A5A0]">AUCUNE DONNÉE BANCAIRE HÉBERGÉE</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                3. Paiement Sécurisé & Données Bancaires
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
                <p>
                  Le site Kheops Set n’enregistre et ne traite <strong className="text-[#FFFFFF]">aucun numéro de carte bancaire, aucun code de sécurité ni aucune coordonnée Mobile Money</strong>.
                </p>
                <p>
                  La saisie des éléments de paiement s’effectue sur les serveurs sécurisés et conformes PCI-DSS de notre partenaire marchand <strong className="text-[#FFFFFF]">Chariow</strong>.
                </p>
              </div>
            </section>

            {/* Article 4 */}
            <section id="cookies-preferences" className="space-y-4 p-6 sm:p-8 bg-[#151515] border border-[#565A5C]/40">
              <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-3 font-mono text-xs">
                <span className="text-[#EEB149] font-semibold">ARTICLE 04</span>
                <span className="text-[#A5A5A0]">STOCKAGE LOCAL NAVIGATEUR</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                4. Traceurs, Cookies & Préférences Locales
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
                <p>
                  Nous n’utilisons aucun cookie de ciblage publicitaire ni aucun traceur inter-sites.
                </p>
                <p>
                  Nous enregistrons uniquement dans le stockage local de ton navigateur (<code className="text-[#EEB149]">localStorage</code>) ta devise préférée (XAF, EUR ou USD) afin de conserver ton confort de lecture lors de tes visites.
                </p>
              </div>
            </section>

            {/* Article 5 */}
            <section id="sous-traitants" className="space-y-4 p-6 sm:p-8 bg-[#151515] border border-[#565A5C]/40">
              <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-3 font-mono text-xs">
                <span className="text-[#EEB149] font-semibold">ARTICLE 05</span>
                <span className="text-[#A5A5A0]">INFRASTRUCTURE TECHNIQUE</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                5. Sous-traitants Techniques de Confiance
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
                <p>
                  Pour assurer le bon fonctionnement du service, nous faisons appel à des prestataires reconnus pour leur niveau élevé de sécurité :
                </p>
                <ul className="list-disc pl-5 space-y-2 text-[#F3F1EB]">
                  <li><strong className="text-[#FFFFFF]">Brevo :</strong> Gestion sécurisée des listes d’envoi et délivrabilité des emails transactionnels.</li>
                  <li><strong className="text-[#FFFFFF]">Cloudflare Turnstile :</strong> Protection anti-spam intelligente préservant la vie privée (sans capture de données comportementales invasives).</li>
                  <li><strong className="text-[#FFFFFF]">Chariow :</strong> Processeur de paiement marchand et génération sécurisée des accès aux ebooks.</li>
                </ul>
              </div>
            </section>

            {/* Article 6 */}
            <section id="droits-utilisateurs" className="space-y-4 p-6 sm:p-8 bg-[#151515] border border-[#565A5C]/40">
              <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-3 font-mono text-xs">
                <span className="text-[#EEB149] font-semibold">ARTICLE 06</span>
                <span className="text-[#A5A5A0]">CONTRÔLE TOTAL DE VOS DONNÉES</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                6. Exercice de vos Droits & Désinscription
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
                <p>
                  Conformément aux réglementations sur la protection des données personnelles, tu disposes d’un droit d’accès, de rectification, de portabilité et d’effacement de l’ensemble de tes informations.
                </p>
                <p>
                  Tu peux à tout instant te désinscrire via le lien présent au bas de chacun de nos emails ou demander l’effacement définitif de tes coordonnées en écrivant à : <code className="text-[#FFFFFF] bg-[#090909] px-2 py-1 border border-[#565A5C]/40">kheopset@gmail.com</code>.
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
