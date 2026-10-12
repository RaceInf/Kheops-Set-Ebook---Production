'use server';

import { GoogleGenAI } from '@google/genai';
import { prisma } from '@/lib/db';

export interface AIInsightResult {
  success: boolean;
  insight?: string;
  error?: string;
  meta?: {
    totalRevenue7d: number;
    ordersCount7d: number;
    leadsCount7d: number;
    errorsCount7d: number;
  };
}

export async function generateAIInsight(): Promise<AIInsightResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    return {
      success: false,
      error:
        'Clé GEMINI_API_KEY manquante. Veuillez la renseigner dans les variables d’environnement (.env.local).',
    };
  }

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 1. Récupération des données opérationnelles des 7 derniers jours
    const [ordersAgg, ordersCount, leadsCount, errorsCount] = await Promise.all([
      prisma.order.aggregate({
        _sum: { amount: true },
        where: {
          createdAt: { gte: sevenDaysAgo },
          status: { in: ['COMPLETED', 'completed', 'PAID', 'paid'] },
        },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: sevenDaysAgo },
        },
      }),
      prisma.lead.count({
        where: {
          createdAt: { gte: sevenDaysAgo },
        },
      }),
      prisma.systemLog.count({
        where: {
          createdAt: { gte: sevenDaysAgo },
          level: { in: ['ERROR', 'error'] },
        },
      }),
    ]);

    const totalRevenue7d = ordersAgg._sum.amount ?? 0;
    const ordersCount7d = ordersCount;
    const leadsCount7d = leadsCount;
    const errorsCount7d = errorsCount;

    // 2. Formatage des données pour l'analyse
    const dataContext = `
Données opérationnelles de Kheops Set (Derniers 7 jours) :
- Chiffre d'Affaires encaissé : ${totalRevenue7d} FCFA
- Nombre de commandes : ${ordersCount7d}
- Nouveaux leads capturés (Protocole / Contact) : ${leadsCount7d}
- Erreurs critiques système / blocages : ${errorsCount7d}
    `.trim();

    // 3. Appel au SDK @google/genai
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Analyse ces données de la semaine et génère ton rapport :\n${dataContext}`,
      config: {
        systemInstruction: `Tu es le Directeur de Stratégie et l'IA stratégique de Kheops Set.
La philosophie de la marque est "L'Acier Bienveillant" : ton direct, calme, exigeant, lucide, sans fioritures ni motivation creuse.
Une vie est un chantier, une entreprise est une structure.
Analyse les datas de la semaine fournies et donne STRICTEMENT 3 bullet points :
1. LE CONSTAT : Une observation factuelle, froide et précise sur les chiffres de la semaine.
2. L'ALERTE : Un point de vigilance opérationnel, technique (erreurs, conversions faibles) ou d'exécution.
3. LA RECOMMANDATION : Une action prioritaire concrète, immédiatement exécutable (marketing ou technique).

Format attendu :
• CONSTAT : [ton texte concis]
• ALERTE : [ton texte concis]
• RECOMMANDATION : [ton texte concis]

Sois bref, percutant et professionnel. Pas de bavardage introductif ni de conclusion.`,
        temperature: 0.2,
      },
    });

    const insightText = response.text || 'Analyse indisponible.';

    return {
      success: true,
      insight: insightText,
      meta: {
        totalRevenue7d,
        ordersCount7d,
        leadsCount7d,
        errorsCount7d,
      },
    };
  } catch (error) {
    console.error('[generateAIInsight Error]:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? `Échec de l’analyse IA : ${error.message}`
          : 'Erreur inattendue lors de la génération du rapport IA.',
    };
  }
}
