import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ContactForm } from '@/components/contact/contact-form';
import { PageImmersion } from '@/components/animations/page-immersion';
import { KHEOPS_SOCIAL_LINKS, IconArrowUpRight } from '@/components/icons/kheops-icons';

export const metadata: Metadata = {
  title: 'Contact — Kheops Set | Support & Suivi de Commande',
  description:
    'Une question sur un ebook ou une commande Chariow ? Contacte Kheops Set ou suis les prochaines parutions sur WhatsApp.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact — Kheops Set | Support & Suivi de Commande',
    description:
      'Une question sur un ebook ou une commande Chariow ? Contacte Kheops Set ou suis les prochaines parutions sur WhatsApp.',
    url: '/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact — Kheops Set | Support & Suivi de Commande',
    description:
      'Une question sur un ebook ou une commande Chariow ? Contacte Kheops Set ou suis les prochaines parutions sur WhatsApp.',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090909] text-[#FFFFFF]">
      <Navbar />

      <main className="flex-1 pt-28 pb-24 px-4 sm:px-6 lg:px-8 bg-blueprint-grid-dark">
        <div className="mx-auto max-w-[1160px]">
          <PageImmersion coordinates="CANAL DIRECT · KHEOPS SET">
            <div className="space-y-12">
              <nav aria-label="Fil d'Ariane" className="font-mono text-xs text-[#A5A5A0]">
                <ol className="flex items-center gap-2">
                  <li>
                    <Link href="/" className="hover:text-[#FFFFFF] transition-colors">
                      Accueil
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className="text-[#EEB149]" aria-current="page">
                    Contact
                  </li>
                </ol>
              </nav>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-5 space-y-6">
                  <div className="space-y-3">
                    <p className="font-mono text-xs text-[#EEB149] tracking-wider">
                      CANAL DE CONTACT
                    </p>
                    <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFFFF]">
                      Nous écrire.
                    </h1>
                    <p className="text-base text-[#A5A5A0] leading-relaxed">
                      Une question avant d’acheter ou besoin d’aide pour récupérer ton fichier PDF après paiement sur Chariow ? Utilise ce formulaire.
                    </p>
                  </div>

                  <div className="p-6 bg-[#151515] border border-[#565A5C]/40 space-y-4 font-mono text-xs">
                    <div>
                      <span className="block text-[#A5A5A0]">EMAIL DIRECT</span>
                      <span className="text-[#FFFFFF] font-semibold">kheopset@gmail.com</span>
                    </div>
                    <div className="border-t border-[#565A5C]/30 pt-3">
                      <span className="block text-[#A5A5A0]">DÉLAI DE RÉPONSE MOYEN</span>
                      <span className="text-[#EEB149] font-semibold">SOUS 24 À 48 HEURES</span>
                    </div>
                  </div>

                  {/* Bloc Réseaux Sociaux Officiels avec Icônes SVG et Liens Intégrés */}
                  <div className="p-6 bg-[#151515] border border-[#EEB149]/50 space-y-4">
                    <div className="space-y-1">
                      <p className="font-mono text-xs text-[#EEB149] tracking-wider">
                        RÉSEAUX OFFICIELS KHEOPS SET
                      </p>
                      <h2 className="font-display text-lg font-bold text-[#FFFFFF]">
                        Suivre et rejoindre la communauté
                      </h2>
                    </div>

                    <div className="space-y-3 pt-1">
                      {KHEOPS_SOCIAL_LINKS.map(({ name, label, handle, href, Icon }) => (
                        <a
                          key={name}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={label}
                          className="group flex items-center justify-between gap-3 p-3.5 bg-[#090909] border border-[#565A5C]/50 hover:border-[#EEB149] transition-colors"
                        >
                          <div className="flex items-center gap-3.5">
                            <span className="w-10 h-10 bg-[#151515] border border-[#565A5C]/40 group-hover:border-[#EEB149] group-hover:bg-[#EEB149] group-hover:text-[#090909] text-[#EEB149] flex items-center justify-center transition-colors shrink-0">
                              <Icon className="w-5 h-5" />
                            </span>
                            <div>
                              <span className="block font-display text-sm font-bold text-[#FFFFFF] group-hover:text-[#EEB149] transition-colors">
                                {name}
                              </span>
                              <span className="block font-mono text-[11px] text-[#A5A5A0]">
                                {handle}
                              </span>
                            </div>
                          </div>

                          <IconArrowUpRight className="w-4 h-4 text-[#A5A5A0] group-hover:text-[#EEB149] shrink-0 transition-colors" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <ContactForm />
                </div>
              </div>
            </div>
          </PageImmersion>
        </div>
      </main>

      <Footer />
    </div>
  );
}
