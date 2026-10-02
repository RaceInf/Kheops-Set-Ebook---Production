# KHEOPS SET — Site Officiel, Catalogue, Tunnel d’Entrée & Sécurité Backend

Site web Next.js 15 (App Router + TypeScript strict + Tailwind CSS + GSAP ScrollTrigger) pour la marque éditoriale anonyme **Kheops Set** (*L’Acier Bienveillant* — *« Une vie est un chantier »*).

---

## 1. Produits & Ressource Gratuite Configurés (`/lib/products.ts`)

1. **Produit 1 — Le Capital du Bâtisseur** (`/ebooks/le-capital-du-batisseur`)
   - Statut : Disponible
   - Étiquette : `LE PLAN PRINCIPAL`
   - Prix normal : `10 000 FCFA` (barré si promo active)
   - Prix promotionnel : `7 990 FCFA` (`-20,1 %`, badge `PROMO`)
   - Format : PDF · 49 pages · Français
   - CTA : `PRENDRE LE PLAN` (*Paiement et accès via Chariow.*)

2. **Produit 2 — Le Code du Bâtisseur** (`/ebooks/le-code-du-batisseur`)
   - Statut : Disponible
   - Étiquette : `L’OUTIL DE BASE`
   - Prix normal : `5 000 FCFA` (barré si promo active)
   - Prix promotionnel : `3 995 FCFA` (`-20,1 %`, badge `PROMO`)
   - Format : PDF · 24 pages · Français
   - CTA : `VOIR LE CODE` (*Paiement et accès via Chariow.*)

3. **Produit 3 — L’Audace de transcender** (`laudace-de-transcender`)
   - Statut : `PROCHAINEMENT` (via `ComingSoonBookCard` + liste d’attente Brevo `Livres à venir`)

4. **Produit 4 — Éveille le cerveau entrepreneurial** (`eveille-le-cerveau-entrepreneurial`)
   - Statut : `PROCHAINEMENT` (via `ComingSoonBookCard` + liste d’attente Brevo `Livres à venir`)

5. **Ressource Gratuite — Le Protocole du Bâtisseur** (`/ressource-gratuite`)
   - Type : Guide PDF gratuit (6 pages)
   - Étiquette : `LE PREMIER PLAN`
   - Sous-titre : *« Une fiche simple pour voir ce qui vide ton temps, ton argent et ton attention. »*
   - Tunnel après inscription : redirection vers `/merci?ressource=protocole-du-batisseur` avec téléchargement prioritaire immédiat, suivi du canal WhatsApp (`https://chat.whatsapp.com/JM5y9X4rV3lEmds6fVr5vz`), de Facebook et de la présentation discrète des 2 ebooks payants.

---

## 2. Modèle d’Email Brevo Prêt à Copier-Coller

- **Objet** : `Ton Protocole du Bâtisseur`
- **Pré-header** : `Ton guide est prêt à télécharger.`

```text
Bonjour {{ contact.FIRSTNAME }},

Voici ton guide.

[BOUTON : TÉLÉCHARGER LE PROTOCOLE]
Lien : [LIEN_PDF_PROTOCOLE_À_AJOUTER]

---

Le chantier continue sur WhatsApp.
Rejoins le canal pour recevoir les prochains outils, les annonces et les publications de Kheops Set :

[BOUTON : REJOINDRE LE CANAL]
Lien : https://chat.whatsapp.com/JM5y9X4rV3lEmds6fVr5vz

---

Tu peux aussi suivre Kheops Set sur Facebook :

[BOUTON : SUIVRE SUR FACEBOOK]
Lien : [LIEN_FACEBOOK_À_AJOUTER]

---
Tu reçois cet email parce que tu as demandé Le Protocole du Bâtisseur.
Tu peux te désinscrire à tout moment.
```

---

## 3. Configuration des Variables d’Environnement & Déploiement Vercel

1. Dans Vercel, ouvrir **Settings > Environment Variables**.
2. Ajouter les variables publiques (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_CLARITY_ID`).
3. Ajouter les variables privées en activant l’option **Sensitive / Secret** :
   - `BREVO_API_KEY`
   - `BREVO_PROTOCOL_LIST_ID` (ID numérique de la liste *Protocole du Bâtisseur*)
   - `BREVO_UPCOMING_BOOKS_LIST_ID` (ID numérique de la liste *Livres à venir*)
   - `BREVO_CAPITAL_CUSTOMERS_LIST_ID`
   - `BREVO_CODE_CUSTOMERS_LIST_ID`
   - `TURNSTILE_SECRET_KEY`
   - `CHARIOW_API_KEY`
   - `CHARIOW_WEBHOOK_SECRET`
   - `RATE_LIMIT_SECRET`
4. Séparer les environnements **Development**, **Preview** (clés et listes de test) et **Production** (vraies clés).
5. Redéployer le projet après toute modification de variable. Ne jamais commiter `.env.local` sur GitHub.

---

## 4. Check-list de Sécurité

- [x] Aucune clé privée (`BREVO_API_KEY`, `TURNSTILE_SECRET_KEY`, `CHARIOW_API_KEY`, `CHARIOW_WEBHOOK_SECRET`) n’utilise le préfixe `NEXT_PUBLIC_`.
- [x] Validation serveur obligatoire avec Zod (`NewsletterSchema.strict()`) dans `POST /api/newsletter`.
- [x] Vérification serveur du token Cloudflare Turnstile (`verifyTurnstileToken`).
- [x] Champ Honeypot invisible (`website`) traité silencieusement côté serveur.
- [x] Rate limiting par IP (5 requêtes max / 15 minutes) sur `/api/newsletter` et `/api/contact`.
- [x] Réponse API neutre `{ "success": true }` empêchant l’énumération d’emails existants.
- [x] Liste blanche stricte sur les paramètres URL (`?ressource=protocole-du-batisseur`) et sur les domaines de redirection.
- [x] Headers HTTP de sécurité (`Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`).

---

## 5. Check-list de Test (20 Points)

1. **Formulaire valide** : Prénom + Email valide + Consentement coché → retourne `{ "success": true }` et redirige vers `/merci?ressource=protocole-du-batisseur`.
2. **Formulaire avec email invalide** : Affiche *« Entre une adresse email valide. »*.
3. **Formulaire sans consentement** : Affiche *« Accepte les conditions pour recevoir le guide. »*.
4. **Formulaire avec honeypot rempli** : Répond `{ "success": true }` sans appeler Brevo.
5. **Formulaire sans token Turnstile** : Rejeté avec *« Vérifie les informations saisies. »*.
6. **Formulaire avec token Turnstile invalide (en production)** : Rejeté côté serveur sans appeler Brevo.
7. **Plusieurs envois rapides depuis la même IP (> 5 en 15 min)** : Retourne HTTP 429 *« Trop de demandes. Réessaie dans quelques minutes. »*.
8. **Email déjà existant dans Brevo** : Mis à jour silencieusement (`updateEnabled: true`) et renvoie `{ "success": true }`.
9. **Formulaire sur téléphone (375px)** : Champs empilés, lisibles, cibles tactiles $\ge 44\text{px}$.
10. **Formulaire avec JavaScript lent** : Bouton verrouillé pendant l’envoi (`PRÉPARATION EN COURS...`) contre les doubles clics.
11. **Téléchargement du Protocole** : Accessible en premier sur `/merci?ressource=protocole-du-batisseur` sans obligation WhatsApp.
12. **Clic WhatsApp** : Ouvre `https://chat.whatsapp.com/JM5y9X4rV3lEmds6fVr5vz` dans un nouvel onglet avec `rel="noopener noreferrer"`.
13. **Clic Facebook** : Secondaire sous WhatsApp.
14. **Clic Chariow** : Redirige vers l’URL Chariow du produit avec paramètres UTM.
15. **Bundle navigateur** : Aucun secret serveur présent dans le code client.
16. **DevTools > Network** : La réponse de `/api/newsletter` ne contient que `{ "success": true }`.
17. **Erreurs API** : Messages courts et génériques, aucune stack trace exposée.
18. **Variables Vercel Preview vs Production** : Listes et secrets isolables par environnement.
19. **Headers de sécurité** : CSP, HSTS, `nosniff`, `Referrer-Policy` actifs dans `next.config.ts`.
20. **Clavier et lecteur d’écran** : Navigation `Tab` complète, labels explicites, `role="alert"` et `aria-live="polite"`.
