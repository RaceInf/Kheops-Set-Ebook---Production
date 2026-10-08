import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

/**
 * ==============================================================================
 * DIRECTIVES CONTENT-SECURITY-POLICY (CSP) DU NAVIGATEUR
 * ==============================================================================
 *
 * DOCUMENTATION DES DOMAINES AUTORISÉS CÔTÉ CLIENT :
 * - default-src 'self' : Origine locale uniquement.
 * - script-src :
 *   - 'self' : Scripts Next.js.
 *   - 'unsafe-inline' : Requis par Next.js App Router pour l'hydratation des scripts RSC et styles.
 *   - 'unsafe-eval' : Autorisé uniquement en développement (Fast Refresh). STRICTEMENT RETIRÉ en production.
 *   - https://challenges.cloudflare.com : Script du widget anti-bot Cloudflare Turnstile.
 *   - https://www.googletagmanager.com : Google Analytics 4 (si activé).
 *   - https://www.clarity.ms : Microsoft Clarity (si activé).
 * - style-src :
 *   - 'self' 'unsafe-inline' : Styles Tailwind CSS et styles de composants.
 *   - https://fonts.googleapis.com : Polices Google Fonts.
 * - img-src :
 *   - 'self' data: blob: : Assets locaux, icônes SVG et placeholders.
 *   - https://picsum.photos : Illustrations de maquettes.
 *   - https://drive.google.com & https://*.googleusercontent.com : Prévisualisation des couvertures.
 * - font-src :
 *   - 'self' data: https://fonts.gstatic.com : Polices typographiques.
 * - connect-src :
 *   - 'self' : Appels aux routes API locales (/api/newsletter, /api/contact, /api/rates, etc.).
 *   - https://challenges.cloudflare.com : Vérification du widget Turnstile.
 *   - https://www.google-analytics.com : Collecte anonyme des événements GA4.
 *   - https://www.clarity.ms : Collecte anonyme des sessions Microsoft Clarity.
 *   NOTE CRITIQUE : https://api.brevo.com et https://*.upstash.io sont STRICTEMENT EXCLUS
 *   du navigateur car ils ne sont sollicités que côté serveur.
 * - frame-src :
 *   - 'self' https://challenges.cloudflare.com : Iframe du challenge Turnstile.
 * - frame-ancestors :
 *   - 'self' https://*.run.app https://*.google.com https://aistudio.google.com : Prévisualisation AI Studio.
 * - form-action 'self' : Formulaires internes uniquement.
 * - base-uri 'self', object-src 'none'.
 */
const scriptSrc = isProd
  ? "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com https://www.clarity.ms"
  : "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://www.googletagmanager.com https://www.clarity.ms";

const cspDirectives = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://picsum.photos https://drive.google.com https://*.googleusercontent.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://challenges.cloudflare.com https://www.google-analytics.com https://www.clarity.ms",
  "frame-src 'self' https://challenges.cloudflare.com",
  "frame-ancestors 'self' https://*.run.app https://*.google.com https://aistudio.google.com",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  ...(isProd ? ['upgrade-insecure-requests'] : []),
].join('; ');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.output = config.output || {};
      config.output.chunkLoadTimeout = 300000;
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: '/ebooks/laudace-de-transcender',
        destination: '/ebooks',
        permanent: true, // HTTP 308
      },
      {
        source: '/ebooks/eveille-le-cerveau-entrepreneurial',
        destination: '/ebooks',
        permanent: true, // HTTP 308
      },
    ];
  },
  async headers() {
    const securityHeaders = [
      {
        key: 'Content-Security-Policy',
        value: cspDirectives,
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), payment=()',
      },
      {
        key: 'Cross-Origin-Opener-Policy',
        value: 'same-origin-allow-popups',
      },
      {
        key: 'X-DNS-Prefetch-Control',
        value: 'on',
      },
      ...(isProd
        ? [
            {
              key: 'Strict-Transport-Security',
              // NOTE SÉCURITÉ DOMAINE :
              // Le domaine actuel est un sous-domaine Vercel (kheops-set-ebook-mu.vercel.app).
              // Réactiver includeSubDomains et preload uniquement après migration vers un
              // domaine personnalisé que Kheops Set contrôle entièrement, avec HTTPS garanti
              // sur tous les sous-domaines.
              value: 'max-age=63072000',
            },
          ]
        : []),
    ];

    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
