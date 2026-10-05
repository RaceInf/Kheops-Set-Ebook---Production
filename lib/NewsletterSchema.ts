import { z } from 'zod';

// Regex interdisant les caractères de contrôle ASCII et les balises HTML
const SAFE_NAME_REGEX = /^[^\u0000-\u001F\u007F<>]+$/;

/**
 * Schéma Zod strict pour la souscription au guide gratuit Le Protocole du Bâtisseur
 */
export const ProtocolSchema = z
  .object({
    firstName: z
      .string({ message: 'Entre ton prénom.' })
      .trim()
      .min(2, { message: 'Entre ton prénom.' })
      .max(60, { message: 'Entre ton prénom (60 caractères maximum).' })
      .regex(SAFE_NAME_REGEX, { message: 'Entre un prénom valide.' }),
    email: z
      .string({ message: 'Entre une adresse email valide.' })
      .trim()
      .toLowerCase()
      .email({ message: 'Entre une adresse email valide.' })
      .max(160, { message: 'Entre une adresse email valide.' }),
    consent: z.literal(true, {
      message: 'Accepte les conditions pour recevoir le guide.',
    }),
    turnstileToken: z
      .string({ message: 'Vérifie les informations saisies.' })
      .trim()
      .min(1, { message: 'La vérification de sécurité est requise.' })
      .max(2048),
    // Honeypot anti-spam : doit rester strictement vide
    website: z
      .string()
      .max(0, { message: 'Vérifie les informations saisies.' })
      .optional(),
  })
  .strict();

export type ProtocolInput = z.infer<typeof ProtocolSchema>;
