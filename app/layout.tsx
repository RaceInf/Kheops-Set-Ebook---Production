import type { Metadata } from 'next';
import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { CurrencyProvider } from '@/context/currency-context';
import { ScrollToTopButton } from '@/components/ui/scroll-to-top-button';
import { PrivacyAnalytics } from '@/components/analytics/PrivacyAnalytics';
import { getValidSiteUrl } from '@/lib/safe-url';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

const siteUrl = getValidSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL
);
const appUrlString = siteUrl.toString().replace(/\/$/, '');

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: 'Kheops Set — Le Capital du Bâtisseur | Outils de Décision',
  description:
    'Marque éditoriale anonyme. Découvre Le Capital du Bâtisseur (49 pages PDF) pour reprendre le contrôle de ton argent, de ton temps et de tes décisions.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Kheops Set — Le Capital du Bâtisseur | Outils de Décision',
    description:
      'Un guide de 49 pages pour arrêter de subir tes choix financiers et commencer à construire une base solide. Paiement et accès via Chariow.',
    url: appUrlString,
    siteName: 'Kheops Set',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/images/monolith-gold-fissure.jpg',
        width: 900,
        height: 1200,
        alt: 'Couverture Le Capital du Bâtisseur — Kheops Set',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kheops Set — Le Capital du Bâtisseur',
    description:
      'Reprends le contrôle de ton argent, de ton temps et de tes décisions. Ebook PDF 49 pages.',
    images: ['/images/monolith-gold-fissure.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${syne.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="font-sans bg-[#090909] text-[#FFFFFF] antialiased selection:bg-[#EEB149] selection:text-[#090909]"
      >
        <CurrencyProvider>
          <PrivacyAnalytics />
          {children}
          <ScrollToTopButton />
        </CurrencyProvider>
      </body>
    </html>
  );
}
