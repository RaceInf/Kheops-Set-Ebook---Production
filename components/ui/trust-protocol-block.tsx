import React from 'react';
import { Lock } from 'lucide-react';
import {
  IconPdf,
  IconProtect,
  IconCheck,
} from '@/components/icons/kheops-icons';

interface TrustProtocolBlockProps {
  className?: string;
  variant?: 'full' | 'compact';
  title?: string;
}

const TRUST_POINTS = [
  {
    id: '01',
    label: 'TRANSACTION SÉCURISÉE',
    title: 'Routage Crypté Chariow',
    description:
      'Paiement sécurisé par Mobile Money (MTN, Orange, Wave) ou Carte bancaire. Aucune donnée bancaire n’est stockée sur nos serveurs.',
    Icon: Lock,
  },
  {
    id: '02',
    label: 'DÉLIVRABILITÉ IMMÉDIATE',
    title: 'Accès Garanti par Email',
    description:
      'Lien d’accès instantané généré et transmis en moins de 60 secondes après validation. Téléchargement direct et permanent.',
    Icon: IconCheck,
  },
  {
    id: '03',
    label: 'STANDARD TECHNIQUE',
    title: 'Format PDF Universel',
    description:
      'Document vectoriel optimisé pour une lecture haute définition sur smartphone, liseuse, tablette et ordinateur, même hors connexion.',
    Icon: IconPdf,
  },
  {
    id: '04',
    label: 'SOUVERAINETÉ & VIE PRIVÉE',
    title: 'Confidentialité Absolue',
    description:
      '0 spam, 0 régie publicitaire, 0 revente de données. Ton adresse email sert uniquement à la délivrabilité et à l’information éditoriale.',
    Icon: IconProtect,
  },
];

export function TrustProtocolBlock({
  className = '',
  variant = 'full',
  title = 'PROTOCOLE DE SÉCURITÉ & RÉASSURANCE TECHNIQUE',
}: TrustProtocolBlockProps) {
  return (
    <div
      aria-label="Engagements de sécurité et réassurance technique"
      className={`border border-[#565A5C]/40 bg-[#151515] p-6 sm:p-8 lg:p-10 relative overflow-hidden ${className}`}
    >
      {/* Decorative Technical Corner Accents */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#EEB149]"
      />
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#EEB149]"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#EEB149]"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#EEB149]"
      />

      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#565A5C]/30 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#EEB149]" aria-hidden="true" />
            <p className="font-mono text-xs text-[#EEB149] tracking-wider uppercase">
              {title}
            </p>
          </div>
          <span className="font-mono text-[11px] text-[#A5A5A0]">
            STANDARD QUALITÉ KHEOPS SET
          </span>
        </div>

        <div
          className={`grid grid-cols-1 ${
            variant === 'compact'
              ? 'sm:grid-cols-2 gap-4'
              : 'sm:grid-cols-2 lg:grid-cols-4 gap-6'
          }`}
        >
          {TRUST_POINTS.map((point) => {
            const IconComponent = point.Icon;
            return (
              <div
                key={point.id}
                className="p-5 bg-[#090909] border border-[#565A5C]/30 flex flex-col justify-between space-y-4 hover:border-[#EEB149]/60 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#EEB149] tabular-nums font-semibold">
                      § {point.id}
                    </span>
                    <div className="w-7 h-7 border border-[#565A5C]/40 flex items-center justify-center text-[#F3F1EB]">
                      <IconComponent className="w-3.5 h-3.5 text-[#EEB149]" />
                    </div>
                  </div>

                  <div>
                    <p className="font-mono text-[10px] text-[#A5A5A0] uppercase tracking-wider mb-1">
                      {point.label}
                    </p>
                    <h3 className="font-display text-sm font-bold text-[#FFFFFF]">
                      {point.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-[#A5A5A0] leading-relaxed">
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
