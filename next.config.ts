import type { NextConfig } from 'next';

/**
 * Note sur Content-Security-Policy :
 * - 'unsafe-inline' est requis par Next.js App Router pour l'hydratation des scripts RSC et styles Tailwind.
 * - challenges.cloudflare.com est autorisé pour le widget anti-bot Cloudflare Turnstile.
 * - frame-ancestors inclut 'self' et *.run.app / *.google.com pour permettre l'aperçu dans AI Studio tout en protégeant l'application.
 */
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://www.googletagmanager.com https://www.clarity.ms",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://picsum.photos",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://challenges.cloudflare.com https://open.er-api.com https://www.google-analytics.com https://www.clarity.ms",
  "frame-src 'self' https://challenges.cloudflare.com",
  "frame-ancestors 'self' https://*.run.app https://*.google.com https://aistudio.google.com",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
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
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
    ];
  },
  webpack: (config, { dev }) => {
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
