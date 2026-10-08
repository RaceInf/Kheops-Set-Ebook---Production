import React from 'react';
import { Navbar } from '@/components/layout/navbar';
import { OpeningScreen } from '@/components/home/opening-screen';
import { HeroSplit } from '@/components/home/hero-split';
import { AnimatedTicker } from '@/components/home/animated-ticker';
import { DiagnosticSection } from '@/components/home/diagnostic-section';
import { StickyPlanScene } from '@/components/home/sticky-plan-scene';
import { BookMockupShowcase } from '@/components/home/book-mockup-showcase';
import { BookContentsDrawer } from '@/components/home/book-contents-drawer';
import { FaceToFaceSection } from '@/components/home/face-to-face-section';
import { AboutPreviewSection } from '@/components/home/about-preview-section';
import { FreeResourceSection } from '@/components/home/free-resource-section';
import { FAQSection } from '@/components/home/faq-section';
import { FinalCTASection } from '@/components/home/final-cta-section';
import { Footer } from '@/components/layout/footer';
import { MAIN_EBOOK, HOME_FAQ_ITEMS, getChariowCheckoutUrl } from '@/lib/ebooks-data';
import {
  serializeJsonLd,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  buildFaqJsonLd,
} from '@/lib/structured-data';
import { getValidSiteUrl } from '@/lib/safe-url';

export default function HomePage() {
  const appUrl = getValidSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL
  )
    .toString()
    .replace(/\/$/, '');

  const structuredData = [
    buildOrganizationJsonLd(appUrl),
    buildWebSiteJsonLd(appUrl),
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: MAIN_EBOOK.title,
      description: MAIN_EBOOK.shortDescription,
      brand: {
        '@type': 'Brand',
        name: 'Kheops Set',
      },
      offers: {
        '@type': 'Offer',
        price: String(MAIN_EBOOK.price),
        priceCurrency: MAIN_EBOOK.currency,
        availability: 'https://schema.org/InStock',
        url: getChariowCheckoutUrl(MAIN_EBOOK.chariowUrl),
      },
    },
    buildFaqJsonLd(HOME_FAQ_ITEMS),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#090909] text-[#FFFFFF]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />

      {/* Navigation flottante premium avec Convertisseur de devise */}
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* A. Écran d’ouverture */}
        <OpeningScreen />

        {/* B. Hero A vs B */}
        <HeroSplit />

        {/* C. Bande animée (Sens 1) */}
        <AnimatedTicker direction="left" variant="primary" />

        {/* D. Le Diagnostic (5 fiches d'audit) */}
        <DiagnosticSection />

        {/* E. Scène Sticky : Le Plan (4 étapes) */}
        <StickyPlanScene />

        {/* C. Bande animée (Sens 2 inverse) */}
        <AnimatedTicker direction="right" variant="secondary" />

        {/* F. Produit Vedette : Mockup du Capital du Bâtisseur & Convertisseur */}
        <BookMockupShowcase />

        {/* G. Ce que le livre contient (Dossiers techniques) */}
        <BookContentsDrawer />

        {/* H. Face-à-Face (Tu choisis ce que tu nourris) */}
        <FaceToFaceSection />

        {/* I. À propos de Kheops Set */}
        <AboutPreviewSection />

        {/* J. Ressource gratuite : Le Test des Fondations */}
        <FreeResourceSection />

        {/* K. FAQ (11 questions en accordéons) */}
        <FAQSection />

        {/* L. CTA Final */}
        <FinalCTASection />
      </main>

      <Footer />
    </div>
  );
}
