import React from 'react';
import {
  IconCheck,
  IconBlueprint,
  IconPdf,
  IconProtect,
} from '@/components/icons/kheops-icons';

interface TrustProtocolBlockProps {
  className?: string;
  context?: 'resource' | 'contact' | 'checkout';
}

const TRUST_PILLARS = [
  {
    code: 'PILIER 01',
    title: 'Délivrabilité Immédiate',
    subtitle: 'Moins de 60 secondes',
    description:
      'Lien de téléchargement sécurisé généré instantanément et doublé par email sécurisé.',
    Icon: IconCheck,
  },
  {
    code: 'PILIER 02',
    title: 'Standard PDF Universel',
    subtitle: 'Tous écrans sans DRM invasif',
    description:
      'Lecture vectorielle nette sur smartphone, tablette et ordinateur avec recherche plein texte.',
    Icon: IconPdf,
  },
  {
    code: 'PILIER 03',
    title: 'Transaction Sécurisée',
    subtitle: 'Routage crypté Chariow',
    description:
      'Paiements Mobile Money et cartes bancaires traités par Chariow. Zéro stockage bancaire local.',
    Icon: IconProtect,
  },
  {
    code: 'PILIER 04',
    title: 'Souveraineté des Données',
    subtitle: 'Confidentialité absolue',
    description:
      'Zéro revente d’adresses, zéro régie publicitaire tierce. Désinscription en 1 clic.',
    Icon: IconBlueprint,
  },
];

export function TrustProtocolBlock({
  className = '',
  context = 'resource',
}: TrustProtocolBlockProps) {
  return (
    <section
      aria-labelledby="trust-protocol-heading"
      className={`relative bg-[#151515] border border-[#565A5C]/40 p-6 sm:p-10 ${className}`}
    >
      {/* Micro-repères dorés aux angles techniques */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#EEB149]"
      />
      <span
        aria-hidden="true"
        className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#EEB149]"
      />
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#EEB149]"
      />
      <span
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#EEB149]"
      />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#565A5C]/30 pb-4">
          <div className="space-y-1">
            <span className="font-mono text-xs text-[#EEB149] tracking-wider font-semibold">
              PROTOCOLE DE CONFIANCE & SÉCURITÉ
            </span>
            <h2
              id="trust-protocol-heading"
              className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]"
            >
              Garanties Techniques & Souveraineté
            </h2>
          </div>
          <span className="font-mono text-[11px] text-[#A5A5A0]">
            KHEOPS SET · STANDARD 2026
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {TRUST_PILLARS.map((pillar) => {
            const IconComp = pillar.Icon;
            return (
              <div
                key={pillar.code}
                className="p-5 bg-[#090909] border border-[#565A5C]/35 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#EEB149] font-bold">
                      {pillar.code}
                    </span>
                    <IconComp className="w-4 h-4 text-[#EEB149]" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-[#FFFFFF]">
                      {pillar.title}
                    </h3>
                    <p className="font-mono text-[11px] text-[#A5A5A0]">
                      {pillar.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#A5A5A0] leading-relaxed pt-2 border-t border-[#565A5C]/20">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
