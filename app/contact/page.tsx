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
    'Une question sur un ebook ou une commande Chariow ? Contacte l’atelier Kheops Set ou suis les prochaines parutions sur nos canaux officiels.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact — Kheops Set | Support & Suivi de Commande',
    description:
      'Une question sur un ebook ou une commande Chariow ? Contacte l’atelier Kheops Set ou suis les prochaines parutions sur nos canaux officiels.',
    url: '/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact — Kheops Set | Support & Suivi de Commande',
    description:
      'Une question sur un ebook ou une commande Chariow ? Contacte l’atelier Kheops Set ou suis les prochaines parutions sur nos canaux officiels.',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090909] text-[#FFFFFF]">
      <Navbar />

      <main id="main-content" className="flex-1 pt-28 pb-32 sm:pb-40 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1360px] space-y-16">
          <PageImmersion>
            {/* Breadcrumb Navigation */}
            <nav
              aria-label="Fil d’Ariane"
              className="font-mono text-xs text-[#A5A5A0] pb-2"
            >
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

            {/* Header */}
            <header className="space-y-4 border-b border-[#565A5C]/35 pb-8">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#EEB149]" aria-hidden="true" />
                <span className="font-mono text-xs text-[#EEB149] tracking-widest uppercase">
                  SUPPORT & ÉCHANGES
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FFFFFF]">
                Contacter l’atelier Kheops Set.
              </h1>

              <p className="text-base sm:text-lg text-[#A5A5A0] max-w-3xl leading-relaxed">
                Notre équipe répond sous 24 à 48 heures ouvrées pour toute question
                concernant une commande Chariow, la délivrabilité d’un manuel ou un échange éditorial.
              </p>
            </header>

            {/* 2-Column Grid: Left Form + Right Info & Socials */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Form Card */}
              <div className="lg:col-span-7 bg-[#151515] border border-[#565A5C]/40 p-6 sm:p-10 space-y-6">
                <div className="space-y-2 border-b border-[#565A5C]/30 pb-4">
                  <span className="font-mono text-xs text-[#EEB149] font-semibold">
                    FORMULAIRE SÉCURISÉ
                  </span>
                  <h2 className="font-display text-2xl font-bold text-[#FFFFFF]">
                    Transmettre un message
                  </h2>
                  <p className="text-xs text-[#A5A5A0]">
                    Tous les champs marqués d’une astérisque sont requis.
                  </p>
                </div>

                <ContactForm />
              </div>

              {/* Right Column: Support Guidelines & Official Channels */}
              <div className="lg:col-span-5 space-y-8">
                {/* Guidelines Box */}
                <div className="p-6 sm:p-8 bg-[#151515] border border-[#565A5C]/40 space-y-4 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#EEB149]" />
                    <span className="text-[#EEB149] uppercase font-bold tracking-wider">
                      CONSIGNES DE SUPPORT
                    </span>
                  </div>

                  <ul className="space-y-3 text-[#F3F1EB] leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-[#EEB149] font-bold">•</span>
                      <span>
                        <strong className="text-[#FFFFFF]">Commande Chariow :</strong> Merci
                        d’indiquer ton numéro de commande ou l’email utilisé lors du paiement.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#EEB149] font-bold">•</span>
                      <span>
                        <strong className="text-[#FFFFFF]">Délai :</strong> Traitement sous
                        24 à 48h ouvrées du lundi au vendredi.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#EEB149] font-bold">•</span>
                      <span>
                        <strong className="text-[#FFFFFF]">Vie privée :</strong> Ton message est
                        transmis via protocole crypté sans stockage publicitaire.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Official Community Channels */}
                <div className="p-6 sm:p-8 bg-[#090909] border border-[#565A5C]/35 space-y-4">
                  <p className="font-mono text-xs text-[#A5A5A0] uppercase tracking-wider">
                    CANAUX DE DIFFUSION OFFICIELS
                  </p>
                  <p className="text-xs text-[#A5A5A0]">
                    Rejoins nos canaux pour suivre les prochaines publications et annonces éditoriales.
                  </p>

                  <div className="flex flex-col gap-3 pt-2">
                    {KHEOPS_SOCIAL_LINKS.map((link) => {
                      const SocialIcon = link.Icon;
                      return (
                        <a
                          key={link.name}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3.5 bg-[#151515] border border-[#565A5C]/40 hover:border-[#EEB149] hover:text-[#EEB149] transition-colors font-mono text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-5 h-5 flex items-center justify-center shrink-0">
                              <SocialIcon className="w-4 h-4 text-[#EEB149] shrink-0" />
                            </div>
                            <span className="font-semibold text-[#FFFFFF]">{link.label}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[#EEB149]">
                            <span className="text-[11px]">{link.handle}</span>
                            <IconArrowUpRight className="w-3.5 h-3.5" />
                          </div>
                        </a>
                      );
                    })}
                  </div>
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
