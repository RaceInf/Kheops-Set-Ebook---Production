# KHEOPS SET — Architecture, Sécurité & Configuration des Environnements

Site web Next.js 15 (App Router + TypeScript strict + Tailwind CSS + GSAP ScrollTrigger) pour la marque éditoriale anonyme **Kheops Set** (*L’Acier Bienveillant* — *« Une vie est un chantier »*).

---

## 1. Guide de Configuration des Variables d'Environnement

### A. Règle Absolue de Sécurité
* **Aucun secret dans le navigateur** : Aucune clé privée ne doit jamais être préfixée par `NEXT_PUBLIC_`.
* **Aucun secret dans le code ou Git** : Le fichier `.gitignore` ignore formellement `.env`, `.env.local`, `.env.*.local` et `.vercel`.
* **Séparation étanche** : `lib/env/server.ts` utilise `import "server-only";` et un runtime guard interdisant formellement l'accès depuis le client.

### B. Configuration Locale (`.env.local`)
1. Copier le fichier d'exemple :
   ```bash
   cp .env.example .env.local
   ```
2. Renseigner les variables publiques minimales pour tester l'application en local.
3. En développement local (`NODE_ENV === 'development'`), si un secret (Brevo, Turnstile, Upstash) est absent, les routes API retournent une erreur explicite `HTTP 503 SERVICE_NOT_CONFIGURED` avec la mention *« Simulation locale : le service n’est pas configuré. Aucune donnée n’a été envoyée. »*. **Aucun faux succès n'est simulé**.

### C. Configuration sur Vercel (Production & Preview)
Dans le tableau de bord Vercel (**Settings** > **Environment Variables**) :
* Assigner les variables publiques (`NEXT_PUBLIC_*`) aux environnements **Production**, **Preview** et **Development**.
* Assigner les variables de production réelles uniquement à l'environnement **Production**.
* Configurer des clés de test séparées pour l'environnement **Preview** (ex: compte Brevo de test, clés de staging).

---

## 2. Tableau Exhaustif des Variables d'Environnement

| Variable | Type | Environnement | Service | Statut | Où l'obtenir ? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Publique | Dev, Preview, Prod | Next.js / SEO | Obligatoire (Prod) | Domaine officiel Vercel actuel : `https://kheops-set-ebook-mu.vercel.app` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Publique | Dev, Preview, Prod | Cloudflare Turnstile | Obligatoire | Dashboard Cloudflare > Turnstile > Add site |
| `NEXT_PUBLIC_GA_ID` | Publique | Prod | Google Analytics 4 | Facultative | Google Analytics > Administration > Flux de données (`G-XXXXX`) |
| `NEXT_PUBLIC_CLARITY_ID` | Publique | Prod | Microsoft Clarity | Facultative | Dashboard Microsoft Clarity > Settings (`xxxxxxx`) |
| `NEXT_PUBLIC_PROTOCOL_PDF_URL` | Publique | Dev, Preview, Prod | Hébergement PDF | Obligatoire | Lien de téléchargement direct Google Drive ou S3 |
| `NEXT_PUBLIC_CHARIOW_CAPITAL_URL` | Publique | Dev, Preview, Prod | Chariow | Obligatoire | Boutique Chariow > Lien public du produit *Le Capital du Bâtisseur* |
| `NEXT_PUBLIC_CHARIOW_CODE_URL` | Publique | Dev, Preview, Prod | Chariow | Obligatoire | Boutique Chariow > Lien public du produit *Le Code du Bâtisseur* |
| `NEXT_PUBLIC_WHATSAPP_CHANNEL_URL` | Publique | Dev, Preview, Prod | WhatsApp | Obligatoire | Lien d'invitation officiel au canal WhatsApp |
| `NEXT_PUBLIC_FACEBOOK_URL` | Publique | Dev, Preview, Prod | Facebook | Facultative | Page Facebook officielle de la marque |
| `BREVO_API_KEY` | **Secrète** | Serveur (Preview, Prod) | Brevo | Obligatoire (Prod) | Brevo > Clés API > Générer une clé API v3 |
| `BREVO_PROTOCOL_LIST_ID` | **Secrète** | Serveur (Preview, Prod) | Brevo | Obligatoire (Prod) | Brevo > Contacts > Listes (ID numérique de la liste Le Protocole) |
| `BREVO_CAPITAL_CUSTOMERS_LIST_ID` | **Secrète** | Serveur (Preview, Prod) | Brevo | Obligatoire (Prod) | Brevo > Contacts > Listes (ID numérique de la liste acheteurs Capital) |
| `BREVO_CODE_CUSTOMERS_LIST_ID` | **Secrète** | Serveur (Preview, Prod) | Brevo | Obligatoire (Prod) | Brevo > Contacts > Listes (ID numérique de la liste acheteurs Code) |
| `TURNSTILE_SECRET_KEY` | **Secrète** | Serveur (Preview, Prod) | Cloudflare Turnstile | Obligatoire (Prod) | Dashboard Cloudflare > Turnstile > Secret Key |
| `CHARIOW_API_KEY` | **Secrète** | Serveur (Prod) | Chariow | Facultative (usage futur) | Dashboard Chariow > Développeurs / API |
| `CHARIOW_WEBHOOK_SECRET` | **Secrète** | Serveur (Preview, Prod) | Chariow | Obligatoire (Prod) | Dashboard Chariow > Webhooks / Pulses > Secret partagé HMAC |
| `CHARIOW_CAPITAL_PRODUCT_ID` | **Secrète** | Serveur (Preview, Prod) | Chariow | Obligatoire (Prod) | Identifiant technique produit Chariow (`captaldubatisseur`) |
| `CHARIOW_CODE_PRODUCT_ID` | **Secrète** | Serveur (Preview, Prod) | Chariow | Obligatoire (Prod) | Identifiant technique produit Chariow (`codedubatisseur`) |
| `UPSTASH_REDIS_REST_URL` | **Secrète** | Serveur (Preview, Prod) | Upstash Redis | Obligatoire (Prod) | Console Upstash > Database > REST API URL (`https://...upstash.io`) |
| `UPSTASH_REDIS_REST_TOKEN` | **Secrète** | Serveur (Preview, Prod) | Upstash Redis | Obligatoire (Prod) | Console Upstash > Database > REST API Token |

---

## 3. Architecture Serveur & Helpers Typés (`lib/env/server.ts`)

Pour éliminer les accès directs non vérifiés à `process.env`, les routes API utilisent des fonctions d'assertion typées :

1. **`requireNewsletterConfig()`** :
   Exige `BREVO_API_KEY`, `BREVO_PROTOCOL_LIST_ID`, `TURNSTILE_SECRET_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.
2. **`requireContactConfig()`** :
   Exige `TURNSTILE_SECRET_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.
3. **`requireChariowWebhookConfig()`** :
   Exige `CHARIOW_WEBHOOK_SECRET`, `CHARIOW_CAPITAL_PRODUCT_ID`, `CHARIOW_CODE_PRODUCT_ID`, `BREVO_CAPITAL_CUSTOMERS_LIST_ID`, `BREVO_CODE_CUSTOMERS_LIST_ID`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.

---

## 4. Produits & Ressource Gratuite Configurés (`/lib/products.ts`)

1. **Produit 1 — Le Capital du Bâtisseur** (`/ebooks/le-capital-du-batisseur`)
   - Statut : Disponible
   - Prix normal : `10 000 FCFA` | Prix promo : `7 990 FCFA` (`-20,1 %`)
   - Format : PDF · 49 pages · Français
   - CTA : `PRENDRE LE PLAN` (*Paiement et accès via Chariow.*)

2. **Produit 2 — Le Code du Bâtisseur** (`/ebooks/le-code-du-batisseur`)
   - Statut : Disponible
   - Prix normal : `5 000 FCFA` | Prix promo : `3 995 FCFA` (`-20,1 %`)
   - Format : PDF · 24 pages · Français
   - CTA : `VOIR LE CODE` (*Paiement et accès via Chariow.*)

3. **Ressource Gratuite — Le Protocole du Bâtisseur** (`/ressource-gratuite`)
   - Format : PDF (guide gratuit)
   - Sous-titre : *« Une fiche simple pour voir ce qui vide ton temps, ton argent et ton attention. »*
   - Redirection après inscription vers `/merci?ressource=protocole-du-batisseur`.

---

## 5. Configuration du Domaine & Migration Future

### Domaine Officiel Actuel (Production)
L'URL officielle active et vérifiée est :
**`https://kheops-set-ebook-mu.vercel.app`**

Toutes les fonctionnalités SEO (`metadataBase`, `canonical`, `sitemap.xml`, `robots.txt`, Open Graph, JSON-LD) et la sécurité (`isAllowedOrigin`) s'appuient sur cette valeur unique certifiée.

### Procédure de Migration vers un Futur Domaine Personnalisé
Lorsqu'un domaine personnalisé sera prêt à être connecté :
1. **Vercel Settings** : Déclarer le domaine dans *Settings > Domains* et valider les DNS (CNAME / ALIAS).
2. **Variable d'environnement** : Mettre à jour `NEXT_PUBLIC_SITE_URL` sur Vercel avec le nouveau domaine (ex: `https://kheopsset.com`).
3. **Chariow** : Mettre à jour l'URL cible du webhook Pulse dans le dashboard Chariow vers le nouveau domaine (`https://nouveau-domaine/api/webhooks/chariow`).
4. **Redirections 301** : Configurer la redirection permanente de l'ancien sous-domaine Vercel vers le domaine personnalisé.
5. **Sitemap** : Next.js reconstruira automatiquement le sitemap et les URLs canoniques sans aucune modification de code.

