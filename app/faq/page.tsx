import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { FAQSection } from '@/components/home/faq-section';
import { HOME_FAQ_ITEMS } from '@/lib/ebooks-data';
import { FinalCTASection } from '@/components/home/final-cta-section';
import { PageImmersion } from '@/components/animations/page-immersion';

export const metadata: Metadata = {
  title: 'FAQ — Questions Fréquentes sur Chariow et nos Ebooks | Kheops Set',
  description:
    'Réponses sur l’achat, Chariow, la réception par email et la lecture des ebooks PDF Kheops Set sur téléphone ou ordinateur.',
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: 'FAQ — Questions Fréquentes sur Chariow et nos Ebooks | Kheops Set',
    description:
      'Réponses sur l’achat, Chariow, la réception par email et la lecture des ebooks PDF Kheops Set sur téléphone ou ordinateur.',
    url: '/faq',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ — Questions Fréquentes sur Chariow et nos Ebooks | Kheops Set',
    description:
      'Réponses sur l’achat, Chariow, la réception par email et la lecture des ebooks PDF Kheops Set sur téléphone ou ordinateur.',
  },
};

export default function FAQPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090909] text-[#FFFFFF]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Navbar />

      <main className="flex-1 pt-28 bg-blueprint-grid-dark">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 pb-8">
          <PageImmersion coordinates="BASE DE CONNAISSANCES · KHEOPS SET">
          <div className="space-y-6">
          <nav aria-label="Fil d'Ariane" className="font-mono text-xs text-[#A5A5A0]">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-[#FFFFFF] transition-colors">
                  Accueil
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-[#EEB149]" aria-current="page">
                FAQ
              </li>
            </ol>
          </nav>

          <div className="space-y-3 border-b border-[#565A5C]/35 pb-8">
            <p className="font-mono text-xs text-[#EEB149] tracking-wider">
              ASSISTANCE & QUESTIONS FRÉQUENTES
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFFFF]">
              Réponses avant d’agir.
            </h1>
          </div>
          </div>
          </PageImmersion>
        </div>

        <FAQSection />
        <FinalCTASection />
      </main>

      <Footer />
    </div>
  );
}
