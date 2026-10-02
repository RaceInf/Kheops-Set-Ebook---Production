export type CurrencyCode = 'XAF' | 'EUR' | 'USD';

export type ProductStatus = 'available' | 'coming_soon';

export interface ProductChapter {
  partNumber?: string;
  partTitle?: string;
  partSubtitle?: string;
  chapterNumber: string;
  title: string;
  summary: string;
  page?: number;
}

export interface ProductFAQItem {
  question: string;
  answer: string;
}

export interface ProductPreviewPage {
  pageNumberLabel: string;
  sectionLabel: string;
  heading: string;
  quote?: string;
  paragraphs: string[];
  lockedTeaser?: {
    title: string;
    blurredLines: string[];
    ctaPrompt: string;
  };
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  tag: string;
  category: string;
  status: ProductStatus;
  productType: 'Ebook PDF';
  priceXaf: number;
  originalPriceXaf?: number;
  salePriceXaf?: number;
  salePercentage?: number;
  isOnSale: boolean;
  saleEndsAt?: string;
  chariowUrl: string;
  ctaLabel: string;
  ctaSubtext: string;
  coverImage: string;
  coverAlt: string;
  shortDescription: string;
  longDescription: string;
  pageCount: number | string;
  format: 'PDF';
  language: 'Français';
  publicationDate?: string;
  updatedDate?: string;
  author: string;
  benefits: string[];
  tableOfContents: ProductChapter[];
  whoIsItFor: string[];
  whoIsItNotFor: string[];
  excerpt?: {
    title: string;
    quote: string;
    body: string;
    reference: string;
  };
  previewPages?: ProductPreviewPage[];
  faq: ProductFAQItem[];
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  availability: 'InStock' | 'PreOrder' | 'ComingSoon';
  isFeatured: boolean;
  isComingSoon: boolean;
  relatedEbooks: string[];
  price: number;
  currency: CurrencyCode;
}

export interface CalculatedPriceInfo {
  activePriceXaf: number;
  originalPriceXaf: number | null;
  isOnSale: boolean;
  salePercentageText: string | null;
  formattedActiveXaf: string;
  formattedOriginalXaf: string | null;
  saleEndsAt: string | null;
}

/**
 * Formate un montant XAF avec espace standard (ex: "7 990 FCFA" ou "10 000 FCFA")
 */
export function formatXafPrice(amount: number): string {
  const rounded = Math.round(amount);
  const formatted = new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  })
    .format(rounded)
    .replace(/\u202f/g, ' ')
    .replace(/\u00a0/g, ' ');
  return `${formatted} FCFA`;
}

/**
 * Calcule de manière sûre et typée les informations de prix et de promotion d'un produit.
 */
export function calculatePriceInfo(product: {
  priceXaf: number;
  originalPriceXaf?: number;
  salePriceXaf?: number;
  salePercentage?: number;
  isOnSale: boolean;
  saleEndsAt?: string;
}): CalculatedPriceInfo {
  const hasValidSale =
    Boolean(product.isOnSale) &&
    typeof product.salePriceXaf === 'number' &&
    product.salePriceXaf > 0 &&
    product.salePriceXaf < product.priceXaf;

  if (!hasValidSale) {
    return {
      activePriceXaf: product.priceXaf,
      originalPriceXaf: null,
      isOnSale: false,
      salePercentageText: null,
      formattedActiveXaf: formatXafPrice(product.priceXaf),
      formattedOriginalXaf: null,
      saleEndsAt: null,
    };
  }

  const baseOriginal = product.originalPriceXaf ?? product.priceXaf;
  const activeSale = product.salePriceXaf!;
  const rawPct =
    typeof product.salePercentage === 'number'
      ? product.salePercentage
      : Number((((baseOriginal - activeSale) / baseOriginal) * 100).toFixed(1));

  const formattedPct = `-${String(rawPct).replace('.', ',')} %`;

  let validSaleEndsAt: string | null = null;
  if (product.saleEndsAt) {
    const parsedDate = Date.parse(product.saleEndsAt);
    if (!Number.isNaN(parsedDate) && parsedDate > Date.now()) {
      validSaleEndsAt = product.saleEndsAt;
    }
  }

  return {
    activePriceXaf: activeSale,
    originalPriceXaf: baseOriginal,
    isOnSale: true,
    salePercentageText: formattedPct,
    formattedActiveXaf: formatXafPrice(activeSale),
    formattedOriginalXaf: formatXafPrice(baseOriginal),
    saleEndsAt: validSaleEndsAt,
  };
}

const DEFAULT_CAPITAL_CHARIOW_URL =
  process.env.NEXT_PUBLIC_CHARIOW_MAIN_URL ||
  'https://fovqbyzx.mychariow.shop/captaldubatisseur';

const DEFAULT_CODE_CHARIOW_URL =
  process.env.NEXT_PUBLIC_CHARIOW_CODE_URL ||
  'https://fovqbyzx.mychariow.shop/codedubatisseur';

export function getChariowCheckoutUrl(
  baseUrl: string = DEFAULT_CAPITAL_CHARIOW_URL,
  campaign: string = 'capital-du-batisseur'
): string {
  try {
    const url = new URL(baseUrl);
    url.searchParams.set('utm_source', 'site');
    url.searchParams.set('utm_medium', 'referral');
    url.searchParams.set('utm_campaign', campaign);
    return url.toString();
  } catch {
    return baseUrl;
  }
}

/**
 * PRODUIT 1 — LE CAPITAL DU BÂTISSEUR (Disponible)
 */
export const CAPITAL_PRODUCT: Product = {
  id: 'ebook-01-capital-du-batisseur',
  slug: 'le-capital-du-batisseur',
  title: 'Le Capital du Bâtisseur',
  subtitle: "S'affranchir du paraître, de la dette familiale et de l'illusion du salaire.",
  tag: 'LE PLAN PRINCIPAL',
  category: 'Ingénierie financière & Décision',
  status: 'available',
  productType: 'Ebook PDF',
  priceXaf: 10000,
  originalPriceXaf: 10000,
  salePriceXaf: 7990,
  salePercentage: 20.1,
  isOnSale: true,
  chariowUrl: DEFAULT_CAPITAL_CHARIOW_URL,
  ctaLabel: 'PRENDRE LE PLAN',
  ctaSubtext: 'Paiement et accès via Chariow.',
  coverImage: '/images/monolith-gold-fissure.jpg',
  coverAlt:
    'Couverture du livre Le Capital du Bâtisseur par Kheops Set — Monolithe noir fendu par une veine dorée',
  shortDescription:
    'Un guide pour reprendre le contrôle de ton argent, de ton temps et de tes décisions.',
  longDescription:
    "Conçu en 49 pages et 3 parties opérationnelles (La Défense, L'Offensive, L'Armure), Le Capital du Bâtisseur démonte les mécanismes qui vident tes revenus : dépenses de statut social, pression familiale sans cadre, crédit à la consommation et dépendance à une seule source de revenu. Chaque chapitre s'appuie sur des cas concrets à Douala, Abidjan, Kinshasa, Dakar et Cotonou, suivis d'un protocole d'action immédiat.",
  pageCount: 49,
  format: 'PDF',
  language: 'Français',
  publicationDate: '2026-01-15',
  updatedDate: '2026-10-01',
  author: 'Kheops Set',
  benefits: [
    'Comment regarder tes dépenses sans te mentir.',
    'Comment poser des limites sans couper tout le monde.',
    'Comment arrêter de payer pour paraître.',
    'Comment construire une base financière simple.',
    'Comment protéger ton temps.',
    'Comment faire des choix plus utiles chaque semaine.',
  ],
  tableOfContents: [
    {
      chapterNumber: '00',
      title: "Introduction — L'Autopsie d'une Génération Fauchée",
      summary:
        "Le constat lucide. Le mensonge du diplôme garant. Le mythe de l'attente et l'ouverture du chantier financier.",
      page: 1,
    },
    {
      partNumber: 'PARTIE 1',
      partTitle: 'LA DÉFENSE : BOUCHER LES TROUS DU SEAU',
      partSubtitle:
        "Il est inutile d'augmenter la pression de l'eau si le réservoir fuit de toutes parts.",
      chapterNumber: '01',
      title: 'Le Suicide du Paraître',
      summary:
        "L'obsession du statut social, l'étude de cas de Fabrice à Douala et la règle de carence à 72 heures.",
      page: 5,
    },
    {
      partNumber: 'PARTIE 1',
      chapterNumber: '02',
      title: 'La Taxe du Sang (Black Tax)',
      summary:
        "L'art de protéger sa famille en posant un budget clair. Étude de cas d'Amadou et Cédric à Abidjan.",
      page: 9,
    },
    {
      partNumber: 'PARTIE 1',
      chapterNumber: '03',
      title: "La Dette et l'Esclavage Volontaire",
      summary:
        'La distinction nette entre la mauvaise dette (passif) et la dette de production (actif). Cas de Marc et Salim à Yaoundé.',
      page: 13,
    },
    {
      partNumber: 'PARTIE 2',
      partTitle: "L'OFFENSIVE : LA MÉCANIQUE DE L'ARGENT",
      partSubtitle:
        "Une forteresse étanche ne sert à rien si elle reste vide. Il est temps d'ouvrir les vannes.",
      chapterNumber: '04',
      title: "L'Actif et le Passif",
      summary:
        'Pourquoi un actif discret qui produit chaque mois vaut mieux qu’une vitrine coûteuse. Cas de Paul et Alain à Kinshasa.',
      page: 18,
    },
    {
      partNumber: 'PARTIE 2',
      chapterNumber: '05',
      title: 'Le Mythe du Petit Salaire',
      summary:
        'La loi de Parkinson, le seau percé et le paiement à soi-même en premier. Cas d’Aline et Joseph à Dakar.',
      page: 22,
    },
    {
      partNumber: 'PARTIE 2',
      chapterNumber: '06',
      title: "Décorréler le Temps et l'Argent",
      summary:
        'Sortir de la vente au détail de ses heures grâce aux 4 leviers. Cas de Moussa et Chloé à Cotonou.',
      page: 26,
    },
    {
      partNumber: 'PARTIE 3',
      partTitle: 'L’ARMURE DU BÂTISSEUR FINANCIER',
      partSubtitle: 'Protéger son édifice et assumer sa valeur sur le long terme.',
      chapterNumber: '07',
      title: 'La Brutalité du Marché',
      summary:
        "Pourquoi le marché paie la rareté et la résolution de problèmes concrets. Cas de Souleymane à Abidjan.",
      page: 31,
    },
    {
      partNumber: 'PARTIE 3',
      chapterNumber: '08',
      title: "L'Isolement Stratégique",
      summary:
        'Protéger ses projets par la discrétion, filtrer son entourage et tenir sur la durée. Cas de Patrice et Hervé à Douala.',
      page: 35,
    },
    {
      chapterNumber: '09',
      title: "Conclusion — Le Plan d'Exécution en 48 Heures",
      summary:
        'Trois actes immédiats (Le Garrot, La Fondation, La Première Brique) pour passer de la lecture aux actes.',
      page: 39,
    },
  ],
  whoIsItFor: [
    'Tu veux arrêter de voir ton salaire disparaître dès le 15 du mois.',
    'Tu cherches une méthode claire pour dire non aux dépenses de pression sociale sans culpabiliser.',
    'Tu veux transformer une partie de tes revenus en capital productif, même en commençant petit.',
    'Tu préfères un plan concret et applicable immédiatement plutôt que des discours de motivation.',
  ],
  whoIsItNotFor: [
    'Tu cherches une formule magique pour devenir riche vite et sans effort.',
    'Tu refuses de remettre en question tes habitudes de consommation actuelles.',
    'Tu attends des promesses de gains garantis sans travail ni discipline.',
  ],
  excerpt: {
    title: 'Extrait — Chapitre 5 : Se Payer en Premier',
    quote:
      '« Si tu ne sais pas gérer dix mille francs aujourd’hui, tu seras incapable de gérer un million de francs demain. »',
    body: 'L’art de l’accumulation ne dépend pas de ta fiche de paie. Il dépend de l’ordre dans lequel tu distribues cet argent le jour où il tombe entre tes mains. Dès l’instant où une somme atterrit sur ton compte, prélève immédiatement un pourcentage fixe — dix pour cent minimum — vers un compte sanctuaire dédié à ta construction.',
    reference: 'Extrait de « Le Capital du Bâtisseur », Partie 2, page 23.',
  },
  previewPages: [
    {
      pageNumberLabel: 'PAGE 01 / 49',
      sectionLabel: 'INTRODUCTION · L’AUTOPSIE',
      heading: 'L’Autopsie d’une Génération Fauchée',
      quote:
        '« Tu travailles dur, tu es intelligent, mais à la fin du mois il ne reste rien. Ce n’est pas une fatalité : c’est un défaut d’architecture. »',
      paragraphs: [
        'Regarde autour de toi avec lucidité. Combien de personnes diplômées, compétentes et travailleuses vivent à une seule urgence médicale de la faillite personnelle ? Dès le 15 du mois, le souffle devient court. Le salaire ne fait que transiter par leur compte bancaire avant de se disperser dans les poches des autres.',
        'On t’a répété pendant vingt ans une promesse rassurante : fais de bonnes études, décroche un poste stable, et ta sécurité financière suivra automatiquement. Sur le terrain réel — que tu vives à Douala, Abidjan, Dakar, Kinshasa, Paris ou Montréal — cette promesse a volé en éclats.',
        'Le problème n’est pas ton manque d’intelligence ni ton manque d’effort. Le problème, c’est qu’on t’a appris à travailler pour de l’argent, mais jamais à construire un système qui protège et multiplie ce que tu gagnes.',
      ],
    },
    {
      pageNumberLabel: 'PAGE 05 / 49',
      sectionLabel: 'PARTIE 1 : LA DÉFENSE · CHAPITRE 01',
      heading: 'Le Suicide du Paraître',
      quote:
        '« Le paraître est un impôt volontaire que tu paies chaque mois pour acheter l’approbation de spectateurs qui ne paieront jamais tes factures. »',
      paragraphs: [
        'Il est inutile d’augmenter la pression de l’eau si le réservoir fuit de toutes parts. Avant de chercher à gagner plus, le Bâtisseur commence par colmater la fuite la plus coûteuse de sa génération : la mise en scène sociale.',
        'À Douala, Fabrice gagne 450 000 FCFA par mois. Sur le papier, il fait partie de ceux qui s’en sortent. Dans la réalité, Fabrice possède le dernier téléphone acheté à crédit, porte des montres et des vêtements qui signalent la réussite, et finance chaque week-end des tables entières pour maintenir sa réputation d’homme généreux.',
        'Le jour où sa mère tombe malade et nécessite 300 000 FCFA d’intervention immédiate, Fabrice découvre la vérité brutale de son bilan : son patrimoine réel est de zéro franc. Il possède des objets qui perdent de la valeur chaque jour, mais aucune fondation.',
      ],
    },
    {
      pageNumberLabel: 'PAGE 08 / 49',
      sectionLabel: 'PARTIE 1 · PROTOCOLE D’EXÉCUTION',
      heading: 'Le Plan d’Action : Désintoxication du Statut',
      quote:
        '« La richesse est ce que tu ne vois pas. C’est la voiture non achetée, la table non payée, le crédit refusé transformé en liberté. »',
      paragraphs: [
        'Comprendre le piège du paraître ne change rien à ton compte en banque tant que tu n’installes pas un garde-fou mécanique entre ton impulsion et ton argent. Voici le protocole exact à appliquer dès aujourd’hui :',
      ],
      lockedTeaser: {
        title: 'SUITE DU PROTOCOLE RÉSERVÉE AUX LECTEURS DU MANUEL COMPLET',
        blurredLines: [
          '1. LA RÈGLE D’ACIER DES 72 HEURES : Tout achat non vital supérieur à 5 % de ton revenu mensuel doit obligatoirement passer par un sas de refroidissement de trois jours complets.',
          '2. LE FILTRE DE L’ÎLE DÉSERTE : Avant de sortir ta carte ou ton téléphone, pose-toi cette unique question chirurgicale : achèterais-je cet objet si absolument personne ne pouvait jamais le voir ?',
          '3. L’AUDIT DE PURGE DES 30 JOURS : Prends tes trois derniers relevés Mobile Money et bancaires, trace deux colonnes et coupe immédiatement les trois postes de représentation.',
        ],
        ctaPrompt:
          'Fin de l’aperçu gratuit (3 pages sur 49). Débloque l’intégralité du livre Le Capital du Bâtisseur pour accéder aux 3 parties complètes et à tous les plans d’exécution.',
      },
    },
  ],
  faq: [
    {
      question: 'Comment acheter le livre ?',
      answer:
        'Clique sur le bouton « PRENDRE LE PLAN ». Tu seras redirigé vers notre page sécurisée sur Chariow pour régler ton achat et télécharger immédiatement ton PDF.',
    },
    {
      question: 'Pourquoi suis-je redirigé vers Chariow ?',
      answer:
        'Chariow est notre partenaire spécialisé pour le paiement sécurisé (Mobile Money, carte bancaire) et la livraison instantanée des fichiers numériques en Afrique et à l’international.',
    },
    {
      question: 'Comment vais-je recevoir le PDF ?',
      answer:
        'Dès la validation de ton paiement sur Chariow, tu reçois un accès direct au téléchargement ainsi qu’un email contenant le lien vers ton ebook PDF.',
    },
    {
      question: 'Puis-je lire le livre sur téléphone et sur ordinateur ?',
      answer:
        'Oui. Le fichier est au format PDF haute lisibilité (49 pages), conçu pour se lire confortablement sur smartphone, tablette et ordinateur.',
    },
  ],
  seoTitle: 'Le Capital du Bâtisseur — Ebook PDF (49 pages) | Kheops Set',
  seoDescription:
    'Un guide de 49 pages pour reprendre le contrôle de ton argent, de ton temps et de tes décisions. Paiement et accès via Chariow.',
  canonicalUrl: 'https://kheopsset.com/ebooks/le-capital-du-batisseur',
  availability: 'InStock',
  isFeatured: true,
  isComingSoon: false,
  relatedEbooks: ['le-code-du-batisseur'],
  price: 7990,
  currency: 'XAF',
};

/**
 * PRODUIT 2 — LE CODE DU BÂTISSEUR (Disponible)
 */
export const CODE_PRODUCT: Product = {
  id: 'ebook-02-code-du-batisseur',
  slug: 'le-code-du-batisseur',
  title: 'Le Code du Bâtisseur',
  subtitle: '7 Principes pour Penser et Agir en Leader, pas en Suiveur.',
  tag: 'L’OUTIL DE BASE',
  category: 'Architecture mentale & Discipline',
  status: 'available',
  productType: 'Ebook PDF',
  priceXaf: 5000,
  originalPriceXaf: 5000,
  salePriceXaf: 3995,
  salePercentage: 20.1,
  isOnSale: true,
  chariowUrl: DEFAULT_CODE_CHARIOW_URL,
  ctaLabel: 'VOIR LE CODE',
  ctaSubtext: 'Paiement et accès via Chariow.',
  coverImage: '/images/code-batisseur-cover.jpg',
  coverAlt:
    'Couverture du livre Le Code du Bâtisseur par Kheops Set — Mains posant une brique dorée dans un pilier de pierre',
  shortDescription:
    'Un guide direct pour construire des habitudes, des limites et une discipline plus solide.',
  longDescription:
    "Condensé en 24 pages directes, Le Code du Bâtisseur pose les 7 murs porteurs de ton architecture mentale avant toute construction extérieure : responsabilité radicale, action imparfaite, discipline comme système, anticonformisme lucide, vision à long terme, application immédiate et solidité intérieure. Chaque principe se termine par un exercice concret (« Votre Chantier ») réalisable en moins de 24 heures.",
  pageCount: 24,
  format: 'PDF',
  language: 'Français',
  publicationDate: '2025-11-10',
  updatedDate: '2026-10-01',
  author: 'Kheops Set',
  benefits: [
    'Remplacer les excuses par la responsabilité directe sur tes choix.',
    'Sortir du perfectionnisme qui bloque grâce à l’action minimale viable.',
    'Construire un système de discipline qui tourne même sans motivation.',
    'Filtrer le bruit des spectateurs pour protéger ta concentration.',
    'Équilibrer les besoins urgents d’aujourd’hui avec ta vision à 10 ans.',
    'Passer de la collection de savoirs à l’application concrète sur le terrain.',
  ],
  tableOfContents: [
    {
      chapterNumber: '00',
      title: 'Introduction — Devenir un Architecte de sa propre vie',
      summary:
        'Pourquoi construire au hasard mène aux regrets, et comment poser des systèmes qui résistent aux jours de doute.',
      page: 6,
    },
    {
      partNumber: 'LES 7 PRINCIPES',
      partTitle: 'LES FONDATIONS DU BÂTISSEUR',
      chapterNumber: '01',
      title: 'Principe 1 — La Responsabilité radicale',
      summary:
        'Comprendre que ton pouvoir commence exactement là où tes excuses s’arrêtent. Le filtre « Et moi, qu’est-ce que je peux faire ? ».',
      page: 8,
    },
    {
      partNumber: 'LES 7 PRINCIPES',
      chapterNumber: '02',
      title: "Principe 2 — L'Action imparfaite",
      summary:
        'Une cabane construite vaut mieux qu’un palais rêvé. La règle de la plus petite action dans la prochaine heure.',
      page: 10,
    },
    {
      partNumber: 'LES 7 PRINCIPES',
      chapterNumber: '03',
      title: 'Principe 3 — La Discipline comme système',
      summary:
        'Bâtir son identité avant l’objectif : comment chaque action quotidienne dépose un vote pour la personne que tu deviens.',
      page: 12,
    },
    {
      partNumber: 'LES 7 PRINCIPES',
      chapterNumber: '04',
      title: "Principe 4 — La Sagesse de l'anticonformisme",
      summary:
        'Différencier le conseil utile d’un bâtisseur de terrain et l’opinion bruyante d’un spectateur.',
      page: 14,
    },
    {
      partNumber: 'LES 7 PRINCIPES',
      chapterNumber: '05',
      title: 'Principe 5 — La Vision à long terme',
      summary:
        'Cultiver les carottes pour nourrir le présent tout en plantant le chêne de ses dix prochaines années.',
      page: 16,
    },
    {
      partNumber: 'LES 7 PRINCIPES',
      chapterNumber: '06',
      title: "Principe 6 — L'Application comme pouvoir",
      summary:
        'Sortir du piège de la « distraction intelligente » grâce au cycle en 5 étapes de la pratique délibérée.',
      page: 18,
    },
    {
      partNumber: 'LES 7 PRINCIPES',
      chapterNumber: '07',
      title: "Principe 7 — La Mentalité d'Abondance",
      summary:
        'Faire de la paix intérieure et de la solidité mentale le point de départ de ses décisions.',
      page: 20,
    },
    {
      chapterNumber: '08',
      title: 'Conclusion — Le Chantier ne finit jamais',
      summary:
        'Pourquoi chaque jour est le Jour 1 et comment maintenir ses standards dans la durée.',
      page: 22,
    },
  ],
  whoIsItFor: [
    'Tu lis ou regardes beaucoup de contenus mais tu as du mal à passer à l’exécution régulière.',
    'Tu veux poser des règles personnelles simples pour ne plus dépendre de ton humeur du matin.',
    'Tu cherches un cadre mental exigeant et clair avant d’attaquer tes projets financiers.',
  ],
  whoIsItNotFor: [
    'Tu cherches des citations douces pour te rassurer sans rien changer à ton quotidien.',
    'Tu refuses de faire les exercices pratiques proposés à la fin de chaque chapitre.',
  ],
  excerpt: {
    title: 'Extrait — Principe 2 : L’Action imparfaite',
    quote: '« La clarté ne précède pas l’action, elle en est la conséquence. »',
    body: 'La meilleure façon de savoir si le pont va tenir, ce n’est pas de faire mille calculs sur papier : c’est de poser la première pierre et de voir comment le terrain réagit. Ne te demande pas quel est le plan parfait pour les cinq prochaines années. Demande-toi quelle est la plus petite action utile que tu peux faire dans la prochaine heure.',
    reference: 'Extrait de « Le Code du Bâtisseur », Principe 2, page 10.',
  },
  previewPages: [
    {
      pageNumberLabel: 'PAGE 06 / 24',
      sectionLabel: 'INTRODUCTION · L’ARCHITECTE',
      heading: 'Devenir un Architecte de sa propre vie',
      quote:
        '« La motivation est une étincelle émotionnelle : elle allume le feu, mais elle est incapable de maintenir la forge chaude quand il pleut. »',
      paragraphs: [
        'La plupart des gens traversent leur existence comme des passagers. Ils réagissent aux urgences, attendent de « se sentir prêts » pour agir, et confient la solidité de leurs journées à leur humeur du matin.',
        'Un Bâtisseur ne compte jamais sur son humeur. Il sait que l’émotion monte et descend sans prévenir. Ce qui distingue celui qui construit une œuvre durable de celui qui abandonne au troisième obstacle, ce n’est pas le talent : c’est la présence d’un Code.',
        'Les sept principes qui suivent ne sont pas des théories à réciter. Ce sont sept murs porteurs conçus pour remplacer l’hésitation par des décisions nettes.',
      ],
    },
    {
      pageNumberLabel: 'PAGE 08 / 24',
      sectionLabel: 'PRINCIPE 01 · LES FONDATIONS',
      heading: 'Principe 1 — La Responsabilité radicale',
      quote:
        '« Ton pouvoir réel sur ta trajectoire commence à la seconde exacte où tes excuses s’arrêtent. »',
      paragraphs: [
        'Il existe une frontière invisible entre ta faute et ta responsabilité. Ce qui t’est arrivé hier — le contexte économique, les promesses non tenues par d’autres, le point de départ difficile — n’est peut-être pas de ta faute. Mais la décision que tu prends aujourd’hui à 14h00 avec ce que tu as entre les mains est à cent pour cent ta responsabilité.',
        'Chaque fois que tu blâmes une cause extérieure, tu lui donnes les clés de ton chantier. Reprendre la responsabilité radicale ne sert pas à te culpabiliser : cela sert à récupérer le volant.',
      ],
      lockedTeaser: {
        title: 'EXERCICE PRATIQUE « VOTRE CHANTIER » VERROUILLÉ DANS L’APERÇU',
        blurredLines: [
          'VOTRE CHANTIER (À EXÉCUTER EN MOINS DE 24 HEURES) : Prends une feuille blanche et note la situation exacte qui te bloque le plus aujourd’hui.',
          'Raye toutes les phrases qui commencent par « C’est parce que les autres... » et remplace-les par le Filtre du Bâtisseur : « Quelle est la seule variable sous mon contrôle direct dès ce soir ? ».',
          'PRINCIPE 2 — L’ACTION IMPARFAITE : Pourquoi une cabane construite aujourd’hui bat toujours un palais rêvé depuis cinq ans...',
        ],
        ctaPrompt:
          'Fin de l’aperçu gratuit (2 pages sur 24). Accède aux 7 Principes complets et aux 7 exercices « Votre Chantier » dans Le Code du Bâtisseur.',
      },
    },
  ],
  faq: [
    {
      question: 'Quelle est la différence entre Le Code du Bâtisseur et Le Capital du Bâtisseur ?',
      answer:
        'Le Code du Bâtisseur (24 pages) pose LA FONDATION : les 7 principes d’architecture mentale, de discipline et d’exécution. Le Capital du Bâtisseur (49 pages) est le manuel d’ingénierie financière pour gérer ton argent, couper la Black Tax et bâtir ton capital.',
    },
    {
      question: 'Pourquoi lire Le Code du Bâtisseur avec Le Protocole d’Isolation ?',
      answer:
        'Le Protocole d’Isolation colmate les brèches urgentes dans ton entourage. Le Code du Bâtisseur construit les murs porteurs pour que ta discipline tienne dans le temps.',
    },
    {
      question: 'Comment se passe le paiement et la réception ?',
      answer:
        'Le paiement sécurisé et l’envoi immédiat du fichier PDF se font via notre partenaire Chariow.',
    },
  ],
  seoTitle: 'Le Code du Bâtisseur — 7 Principes d’Exécution (PDF) | Kheops Set',
  seoDescription:
    'Un guide direct de 24 pages pour construire des habitudes, des limites et une discipline plus solide. Paiement et accès via Chariow.',
  canonicalUrl: 'https://kheopsset.com/ebooks/le-code-du-batisseur',
  availability: 'InStock',
  isFeatured: true,
  isComingSoon: false,
  relatedEbooks: ['le-capital-du-batisseur'],
  price: 3995,
  currency: 'XAF',
};

/**
 * PRODUIT 3 — L'AUDACE DE TRANSCENDER (Prochainement)
 */
export const AUDACE_PRODUCT: Product = {
  id: 'ebook-03-audace-de-transcender',
  slug: 'laudace-de-transcender',
  title: 'L’Audace de transcender',
  subtitle: 'Édition Kheops Set en préparation.',
  tag: 'PROCHAINEMENT',
  category: 'Dépassement & Discipline',
  status: 'coming_soon',
  productType: 'Ebook PDF',
  priceXaf: 0,
  isOnSale: false,
  chariowUrl: '',
  ctaLabel: 'ÊTRE INFORMÉ À LA SORTIE',
  ctaSubtext: 'Inscription à la liste d’attente.',
  coverImage: '/images/monolith-gold-fissure.jpg',
  coverAlt: 'L’Audace de transcender — Prochainement chez Kheops Set',
  shortDescription: 'Ouvrage en préparation dans les ateliers Kheops Set.',
  longDescription: '',
  pageCount: '',
  format: 'PDF',
  language: 'Français',
  author: 'Kheops Set',
  benefits: [],
  tableOfContents: [],
  whoIsItFor: [],
  whoIsItNotFor: [],
  faq: [],
  seoTitle: 'L’Audace de transcender (Prochainement) | Kheops Set',
  seoDescription: 'Prochain ouvrage de la marque éditoriale Kheops Set.',
  canonicalUrl: 'https://kheopsset.com/ebooks',
  availability: 'ComingSoon',
  isFeatured: false,
  isComingSoon: true,
  relatedEbooks: [],
  price: 0,
  currency: 'XAF',
};

/**
 * PRODUIT 4 — ÉVEILLE LE CERVEAU ENTREPRENEURIAL (Prochainement)
 */
export const CERVEAU_PRODUCT: Product = {
  id: 'ebook-04-eveille-le-cerveau-entrepreneurial',
  slug: 'eveille-le-cerveau-entrepreneurial',
  title: 'Éveille le cerveau entrepreneurial',
  subtitle: 'Édition Kheops Set en préparation.',
  tag: 'PROCHAINEMENT',
  category: 'Transition & Stratégie',
  status: 'coming_soon',
  productType: 'Ebook PDF',
  priceXaf: 0,
  isOnSale: false,
  chariowUrl: '',
  ctaLabel: 'ÊTRE INFORMÉ À LA SORTIE',
  ctaSubtext: 'Inscription à la liste d’attente.',
  coverImage: '/images/monolith-gold-fissure.jpg',
  coverAlt: 'Éveille le cerveau entrepreneurial — Prochainement chez Kheops Set',
  shortDescription: 'Ouvrage en préparation dans les ateliers Kheops Set.',
  longDescription: '',
  pageCount: '',
  format: 'PDF',
  language: 'Français',
  author: 'Kheops Set',
  benefits: [],
  tableOfContents: [],
  whoIsItFor: [],
  whoIsItNotFor: [],
  faq: [],
  seoTitle: 'Éveille le cerveau entrepreneurial (Prochainement) | Kheops Set',
  seoDescription: 'Prochain ouvrage de la marque éditoriale Kheops Set.',
  canonicalUrl: 'https://kheopsset.com/ebooks',
  availability: 'ComingSoon',
  isFeatured: false,
  isComingSoon: true,
  relatedEbooks: [],
  price: 0,
  currency: 'XAF',
};

export const ALL_PRODUCTS: Product[] = [
  CAPITAL_PRODUCT,
  CODE_PRODUCT,
  AUDACE_PRODUCT,
  CERVEAU_PRODUCT,
];

export const AVAILABLE_PRODUCTS: Product[] = [CAPITAL_PRODUCT, CODE_PRODUCT];

export const COMING_SOON_PRODUCTS: Product[] = [AUDACE_PRODUCT, CERVEAU_PRODUCT];

export function getProductBySlug(slug: string): Product | undefined {
  return ALL_PRODUCTS.find((p) => p.slug === slug);
}

/**
 * RESSOURCE GRATUITE — LE PROTOCOLE D'ISOLATION (Le Protocole du Bâtisseur)
 * Fidèle à 100 % au PDF officiel de 6 pages :
 * "LE PROTOCOLE D'ISOLATION — Outil de Haute Qualité pour Bâtisseurs Épuisés. Par Kheops Set."
 */
export interface FreeResource {
  id: string;
  slug: 'protocole-du-batisseur';
  title: string;
  documentTitle: string;
  tag: string;
  subtitle: string;
  leadPhrase: string;
  shortDescription: string;
  foundationWarning: string;
  productType: 'Guide PDF gratuit';
  status: 'Disponible gratuitement';
  pageCount: number;
  format: 'PDF';
  coverImage: string;
  downloadUrl: string;
  whatsappChannelUrl: string;
  facebookPageUrl: string;
  benefits: string[];
  includedItems: {
    stepNumber: string;
    title: string;
    subtitle: string;
    description: string;
    highlights: string[];
  }[];
  cercleRestreint: {
    title: string;
    subtitle: string;
    invariants: { name: string; desc: string }[];
  };
}

export const FREE_PROTOCOL_RESOURCE: FreeResource = {
  id: 'free-01-protocole-du-batisseur',
  slug: 'protocole-du-batisseur',
  title: 'LE PROTOCOLE D’ISOLATION',
  documentTitle: 'Outil de Haute Qualité pour Bâtisseurs Épuisés',
  tag: 'LE PREMIER PLAN',
  subtitle:
    'Arrête de laisser ton entourage et ton téléphone décider de tes journées. Récupère ton temps, ton calme et ta capacité d’action.',
  leadPhrase:
    'Tu rentres souvent le soir vidé — pas à cause de ton travail, mais à cause des sollicitations permanentes, des urgences des autres et du bruit.',
  shortDescription:
    'En 6 pages directes, ce protocole te donne une méthode simple pour fermer les brèches, poser des limites respectées et protéger tes heures de construction dès aujourd’hui.',
  foundationWarning:
    'Ce guide gratuit colmate l’urgence autour de toi. Pour bâtir toute ta discipline intérieure sur le long terme, la suite logique est « Le Code du Bâtisseur ».',
  productType: 'Guide PDF gratuit',
  status: 'Disponible gratuitement',
  pageCount: 6,
  format: 'PDF',
  coverImage: '/images/protocole-isolation-cover.jpg',
  downloadUrl:
    process.env.NEXT_PUBLIC_PROTOCOL_PDF_URL ||
    '/ressource-gratuite?download=protocole-du-batisseur',
  whatsappChannelUrl: 'https://chat.whatsapp.com/JM5y9X4rV3lEmds6fVr5vz',
  facebookPageUrl:
    process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://www.facebook.com/kheops.set/',
  benefits: [
    'Repérer immédiatement ce qui vide ton énergie et ton temps sans que tu t’en rendes compte.',
    'Dire « Non » calmement, sans culpabiliser et sans avoir à te justifier pendant une heure.',
    'Retrouver des heures de calme chaque semaine pour enfin avancer sur tes propres projets.',
  ],
  includedItems: [
    {
      stepNumber: 'RÉSULTAT 01',
      title: 'Clarté sur ton entourage',
      subtitle: 'Cesser de subir les sollicitations',
      description:
        'Tu vois enfin clairement qui te tire vers le bas et où part ton énergie chaque semaine.',
      highlights: [],
    },
    {
      stepNumber: 'RÉSULTAT 02',
      title: 'Des limites respectées',
      subtitle: 'La fin de la disponibilité permanente',
      description:
        'Tu poses un cadre net avec tes proches et sur ton téléphone, sans conflit inutile.',
      highlights: [],
    },
    {
      stepNumber: 'RÉSULTAT 03',
      title: 'Attention récupérée',
      subtitle: 'Un espace protégé pour bâtir',
      description:
        'Tu récupères la concentration nécessaire pour exécuter ton plan sans dispersion.',
      highlights: [],
    },
  ],
  cercleRestreint: {
    title: '',
    subtitle: '',
    invariants: [],
  },
};
