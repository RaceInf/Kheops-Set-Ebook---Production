import React from 'react';
import Link from 'next/link';
import { KHEOPS_SOCIAL_LINKS } from '@/components/icons/kheops-icons';

export function Footer() {
  return (
    <footer className="w-full bg-[#090909] text-[#A5A5A0] border-t border-[#565A5C]/35">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand & Socials Column */}
          <div className="lg:col-span-5 space-y-5">
            <Link
              href="/"
              className="font-display text-lg font-bold tracking-[0.18em] text-[#FFFFFF] inline-block"
            >
              KHEOPS SET
            </Link>
            <p className="text-sm text-[#A5A5A0] max-w-sm leading-relaxed">
              Marque éditoriale anonyme. Des outils concrets pour reprendre le contrôle de ton argent, de ton temps et de tes décisions.
            </p>
            <p className="font-mono text-xs text-[#F3F1EB]">
              L’ACIER BIENVEILLANT · UNE VIE EST UN CHANTIER.
            </p>

            {/* Réseaux Sociaux avec Icônes SVG et Liens Intégrés */}
            <div className="pt-2 space-y-2.5">
              <p className="font-mono text-[11px] text-[#EEB149] tracking-wider">
                RÉSEAUX OFFICIELS
              </p>
              <div className="flex items-center gap-3">
                {KHEOPS_SOCIAL_LINKS.map(({ name, label, href, Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="inline-flex items-center justify-center w-10 h-10 bg-[#151515] border border-[#565A5C]/50 text-[#F3F1EB] hover:border-[#EEB149] hover:bg-[#EEB149] hover:text-[#090909] transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="lg:col-span-3 space-y-3">
            <p className="font-mono text-xs font-semibold text-[#FFFFFF] tracking-wider">
              NAVIGATION
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-[#FFFFFF] transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/ebooks" className="hover:text-[#FFFFFF] transition-colors">
                  Catalogue ebooks
                </Link>
              </li>
              <li>
                <Link
                  href="/ebooks/le-capital-du-batisseur"
                  className="hover:text-[#EEB149] text-[#F3F1EB] transition-colors"
                >
                  Le Capital du Bâtisseur
                </Link>
              </li>
              <li>
                <Link
                  href="/ressource-gratuite"
                  className="hover:text-[#FFFFFF] transition-colors"
                >
                  Ressource gratuite
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="hover:text-[#FFFFFF] transition-colors">
                  À propos de Kheops Set
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#FFFFFF] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FFFFFF] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="lg:col-span-4 space-y-3">
            <p className="font-mono text-xs font-semibold text-[#FFFFFF] tracking-wider">
              INFORMATIONS LÉGALES
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/mentions-legales"
                  className="hover:text-[#FFFFFF] transition-colors"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  href="/confidentialite"
                  className="hover:text-[#FFFFFF] transition-colors"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/conditions" className="hover:text-[#FFFFFF] transition-colors">
                  Conditions générales
                </Link>
              </li>
              <li>
                <Link
                  href="/remboursement"
                  className="hover:text-[#FFFFFF] transition-colors"
                >
                  Politique de remboursement
                </Link>
              </li>
            </ul>

            <div className="pt-4 border-t border-[#565A5C]/25">
              <p className="text-xs text-[#A5A5A0] leading-relaxed">
                Ce contenu est éducatif. Il ne remplace pas un conseil financier adapté à ta situation.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#565A5C]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-[#A5A5A0]">
          <span>© {new Date().getFullYear()} KHEOPS SET. TOUS DROITS RÉSERVÉS.</span>
          <span>PAIEMENT ET LIVRAISON SÉCURISÉS VIA CHARIOW.</span>
        </div>
      </div>
    </footer>
  );
}
