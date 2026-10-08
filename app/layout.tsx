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
  icons: {
    icon: [
      { url: '/icon', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.svg',
  },
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                window.addEventListener('error', function(e) {
                  var msg = e && e.message ? String(e.message) : '';
                  if (msg.indexOf('ChunkLoadError') !== -1 || msg.indexOf('Loading chunk') !== -1 || (msg.indexOf('timeout') !== -1 && msg.indexOf('chunk') !== -1)) {
                    var lastReload = sessionStorage.getItem('kheops_chunk_reload');
                    var now = Date.now();
                    if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
                      sessionStorage.setItem('kheops_chunk_reload', String(now));
                      window.location.reload();
                    }
                  }
                });
              }
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="font-sans bg-[#090909] text-[#FFFFFF] antialiased selection:bg-[#EEB149] selection:text-[#090909]"
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-[#EEB149] focus:text-[#090909] font-mono text-xs font-bold border border-[#090909] shadow-xl focus:outline-none"
        >
          Passer au contenu principal
        </a>
        <CurrencyProvider>
          <PrivacyAnalytics />
          {children}
          <ScrollToTopButton />
        </CurrencyProvider>
      </body>
    </html>
  );
}
