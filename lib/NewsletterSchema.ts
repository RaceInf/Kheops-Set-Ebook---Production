import { z } from 'zod';

export const ALLOWED_SOURCES = [
  'protocole-du-batisseur',
  'livres-a-venir',
] as const;

export type NewsletterSource = (typeof ALLOWED_SOURCES)[number];

// Regex interdisant les caractères de contrôle ASCII et les balises HTML
const SAFE_NAME_REGEX = /^[^\u0000-\u001F\u007F<>]+$/;

export const NewsletterSchema = z
  .object({
    firstName: z
      .string({ message: 'Entre ton prénom.' })
      .trim()
      .min(2, { message: 'Entre ton prénom.' })
      .max(60, { message: 'Entre ton prénom.' })
      .regex(SAFE_NAME_REGEX, { message: 'Entre ton prénom.' }),
    email: z
      .string({ message: 'Entre une adresse email valide.' })
      .trim()
      .toLowerCase()
      .email({ message: 'Entre une adresse email valide.' })
      .max(160, { message: 'Entre une adresse email valide.' }),
    consent: z.literal(true, {
      message: 'Accepte les conditions pour recevoir le guide.',
    }),
    source: z.enum(ALLOWED_SOURCES, {
      message: 'Vérifie les informations saisies.',
    }),
    turnstileToken: z
      .string({ message: 'Vérifie les informations saisies.' })
      .trim()
      .min(1, { message: 'Vérifie les informations saisies.' })
      .max(2048, { message: 'Vérifie les informations saisies.' }),
    bookSlug: z
      .string()
      .trim()
      .max(80)
      .optional(),
    // Honeypot anti-spam : doit rester vide
    website: z
      .string()
      .max(0, { message: 'Vérifie les informations saisies.' })
      .optional(),
  })
  .strict();

export type NewsletterInput = z.infer<typeof NewsletterSchema>;
