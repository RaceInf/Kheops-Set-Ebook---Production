import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kheops Set — Le Capital du Bâtisseur',
    short_name: 'Kheops Set',
    description:
      'Marque éditoriale anonyme. Outils de réflexion, ingénierie financière et protocoles d’action.',
    start_url: '/',
    display: 'standalone',
    background_color: '#090909',
    theme_color: '#090909',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
