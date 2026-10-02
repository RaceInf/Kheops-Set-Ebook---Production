import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kheops Set — Le Capital du Bâtisseur',
    short_name: 'Kheops Set',
    description:
      'Marque éditoriale anonyme. Outils de réflexion et d’ingénierie financière.',
    start_url: '/',
    display: 'standalone',
    background_color: '#090909',
    theme_color: '#090909',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
