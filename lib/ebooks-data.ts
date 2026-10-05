export {
  type CurrencyCode,
  type Product as Ebook,
  type ProductChapter as EbookChapter,
  type ProductFAQItem as EbookFAQItem,
  CAPITAL_PRODUCT,
  CAPITAL_PRODUCT as MAIN_EBOOK,
  CODE_PRODUCT,
  ALL_PRODUCTS,
  AVAILABLE_PRODUCTS,
  FREE_PROTOCOL_RESOURCE,
  getChariowCheckoutUrl,
  calculatePriceInfo,
  formatXafPrice,
  getProductBySlug,
} from '@/lib/products';

import type { ProductFAQItem } from '@/lib/products';

export const HOME_FAQ_ITEMS: ProductFAQItem[] = [
  {
    question: 'Comment acheter le livre ?',
    answer:
      'Clique sur le bouton « PRENDRE LE PLAN ». Tu es redirigé vers notre page officielle sur Chariow où tu peux finaliser ta commande en quelques secondes.',
  },
  {
    question: 'Pourquoi suis-je redirigé vers Chariow ?',
    answer:
      'Chariow est la plateforme sécurisée qui gère l’encaissement et la livraison automatique de ton fichier PDF. Le site Kheops Set ne stocke aucune coordonnée bancaire.',
  },
  {
    question: 'Comment vais-je recevoir le PDF ?',
    answer:
      'Une fois ton paiement validé sur Chariow, le lien de téléchargement s’affiche directement et t’est également envoyé par email.',
  },
  {
    question: 'Puis-je lire le livre sur téléphone ?',
    answer:
      'Oui. La mise en page est aérée et conçue pour se lire facilement sur n’importe quel smartphone, sans avoir besoin de zoomer.',
  },
  {
    question: 'Puis-je lire le livre sur ordinateur ?',
    answer:
      'Oui. Le fichier est un PDF standard lisible sur tous les ordinateurs (Windows, Mac, Linux) et tablettes.',
  },
  {
    question: 'Puis-je acheter depuis un autre pays ?',
    answer:
      'Oui. Que tu sois au Cameroun, en Côte d’Ivoire, au Sénégal, en RDC, en France, au Canada ou ailleurs, Chariow accepte les moyens de paiement locaux et internationaux.',
  },
  {
    question: 'Dans quelle monnaie vais-je payer ?',
    answer:
      'Les prix affichés sur le site sont les mêmes que sur Chariow. Tu peux consulter les tarifs en XAF, EUR ou USD grâce au sélecteur de devise en haut de page.',
  },
  {
    question: 'Que faire si je ne reçois pas mon ebook ?',
    answer:
      'Vérifie d’abord tes courriers indésirables (spams). Si tu ne vois toujours rien après quelques minutes, écris-nous via la page Contact avec l’email utilisé lors de l’achat.',
  },
  {
    question: 'Puis-je poser une question avant d’acheter ?',
    answer:
      'Bien sûr. Utilise le formulaire de la page Contact pour nous poser ta question directement.',
  },
  {
    question: 'Est-ce que le livre est imprimé ?',
    answer:
      'Non. Il s’agit uniquement d’ebooks numériques au format PDF téléchargeables immédiatement. Aucun livre papier n’est expédié par la poste.',
  },
  {
    question: 'Puis-je partager mon ebook ?',
    answer:
      'Non. Chaque ebook est réservé à ton usage strictement personnel. Respecter ce travail fait partie de la discipline du Bâtisseur.',
  },
];
