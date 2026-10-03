/**
 * ==============================================================================
 * POINT D'ENTRÉE DES VARIABLES D'ENVIRONNEMENT SÉCURISÉES
 * ==============================================================================
 *
 * Ce module réexporte UNIQUEMENT les variables d'environnement publiques
 * pour garantir qu'aucun secret ne puisse être accidentellement consommé
 * par un composant client.
 *
 * Pour les secrets serveurs (routes API, webhooks), importer EXCLUSIVEMENT :
 * import { requireNewsletterConfig, ... } from '@/lib/env/server';
 */

export { publicEnv, type PublicEnv } from './env/public';
