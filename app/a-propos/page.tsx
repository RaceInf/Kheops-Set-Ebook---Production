import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { PageImmersion } from '@/components/animations/page-immersion';
import { AboutManifestoExperience } from '@/components/about/AboutManifestoExperience';
import { serializeJsonLd } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'À propos de Kheops Set — Le Manifeste de l’Acier Bienveillant',
  description:
    'Découvre Kheops Set : un atelier éditorial anonyme. Nous refusons les promesses creuses et concevons des manuels concrets pour reprendre le contrôle de ton temps et de tes décisions.',
  alternates: {
    canonical: '/a-propos',
  },
  openGraph: {
    title: 'À propos de Kheops Set — Le Manifeste de l’Acier Bienveillant',
    description:
      'Découvre Kheops Set : un atelier éditorial anonyme. Nous refusons les promesses creuses et concevons des manuels concrets pour reprendre le contrôle de ton temps et de tes décisions.',
    url: '/a-propos',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'À propos de Kheops Set — Le Manifeste de l’Acier Bienveillant',
    description:
      'Découvre Kheops Set : un atelier éditorial anonyme. Nous refusons les promesses creuses et concevons des manuels concrets pour reprendre le contrôle de ton temps et de tes décisions.',
  },
};

export default function AboutPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: 'https://kheops-set-ebook-mu.vercel.app/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'À propos',
        item: 'https://kheops-set-ebook-mu.vercel.app/a-propos',
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090909] text-[#FFFFFF]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <Navbar />

      <main id="main-content" className="flex-1 pt-28 pb-32 sm:pb-40 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1360px] space-y-12">
          <PageImmersion>
            {/* Breadcrumb Navigation */}
            <nav
              aria-label="Fil d'Ariane"
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
                  À propos
                </li>
              </ol>
            </nav>

            {/* Complete Interactive Inspired Manifesto Experience */}
            <AboutManifestoExperience />
          </PageImmersion>
        </div>
      </main>

      <Footer />
    </div>
  );
}
