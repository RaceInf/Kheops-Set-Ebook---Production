/**
 * SOURCE UNIQUE DE VÉRITÉ — DOMAINE ET URL DU SITE KHEOPS SET
 *
 * Cette constante est la SEULE occurrence en dur du domaine officiel de repli
 * dans tout le code source de l'application.
 *
 * Tout changement futur de domaine (ex: passage à un domaine personnalisé)
 * sera pris en compte automatiquement via la variable d'environnement
 * NEXT_PUBLIC_SITE_URL sur Vercel, avec OFFICIAL_SITE_URL comme filet
 * de sécurité générique en cas d'absence ou de valeur mal formée.
 */
export const OFFICIAL_SITE_URL = 'https://kheops-set-ebook-mu.vercel.app';
