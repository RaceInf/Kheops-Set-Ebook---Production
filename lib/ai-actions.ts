'use server';

import { GoogleGenAI } from '@google/genai';
import { prisma } from '@/lib/db';

export interface AIInsightResult {
  success: boolean;
  insight?: string;
  error?: string;
  meta?: {
    periodLabel: string;
    totalRevenue: number;
    ordersCount: number;
    leadsCount: number;
    errorsCount: number;
  };
}

export async function generateAIInsight(
  period: '7d' | '30d' | 'year' | 'all' = '7d',
  userPrompt?: string
): Promise<AIInsightResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    return {
      success: false,
      error: 'Clé GEMINI_API_KEY manquante dans les variables d’environnement (.env.local).',
    };
  }

  try {
    const now = new Date();
    const startDate = new Date();
    let periodLabel = '7 derniers jours';

    if (period === '30d') {
      startDate.setDate(now.getDate() - 30);
      periodLabel = '30 derniers jours';
    } else if (period === 'year') {
      startDate.setFullYear(now.getFullYear(), 0, 1); // 1er janvier de cette année
      periodLabel = 'Année en cours';
    } else if (period === 'all') {
      startDate.setFullYear(2020, 0, 1); // Historique complet
      periodLabel = 'Historique complet';
    } else {
      startDate.setDate(now.getDate() - 7);
      periodLabel = '7 derniers jours';
    }

    // Récupération des données Prisma sur la période
    const [ordersAgg, ordersCount, leadsCount, errorsCount, allOrders, allLeads] = await Promise.all([
      prisma.order.aggregate({
        _sum: { amount: true },
        where: {
          createdAt: { gte: startDate },
          status: { in: ['COMPLETED', 'completed', 'PAID', 'paid'] },
        },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: startDate },
        },
      }),
      prisma.lead.count({
        where: {
          createdAt: { gte: startDate },
        },
      }),
      prisma.systemLog.count({
        where: {
          createdAt: { gte: startDate },
          level: { in: ['ERROR', 'error'] },
        },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: startDate } },
        select: { productSlug: true, amount: true, currency: true, createdAt: true },
      }),
      prisma.lead.findMany({
        where: { createdAt: { gte: startDate } },
        select: { source: true, createdAt: true },
      }),
    ]);

    const totalRevenue = ordersAgg._sum.amount ?? 0;

    const dataContext = `
Données opérationnelles de Kheops Set (${periodLabel}, du ${startDate.toLocaleDateString('fr-FR')} au ${now.toLocaleDateString('fr-FR')}) :
- Chiffre d'Affaires encaissé : ${totalRevenue} FCFA
- Nombre de commandes : ${ordersCount}
- Nouveaux leads capturés : ${leadsCount}
- Erreurs critiques système : ${errorsCount}
- Détail des ventes : ${JSON.stringify(allOrders)}
- Sources des leads : ${JSON.stringify(allLeads)}
    `.trim();

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `Tu es le Directeur de Stratégie et l'IA décisionnelle de Kheops Set.
La philosophie de la marque est "L'Acier Bienveillant" : ton direct, calme, exigeant, lucide, sans fioritures ni motivation creuse.
Une vie est un chantier, une entreprise est une structure.
Réponds à la demande de l'administrateur en te basant rigoureusement sur les données chiffrées de la période sélectionnée (${periodLabel}).
Si l'administrateur pose une question précise, réponds-lui directement avec précision et pragmatisme.
Sinon, donne 3 bullet points structurés :
1. LE CONSTAT : Analyse factuelle des chiffres.
2. L'ALERTE : Point de vigilance opérationnel ou technique.
3. LA RECOMMANDATION : Action prioritaire immédiate.`;

    const promptText = userPrompt
      ? `Question de l'administrateur : "${userPrompt}"\n\nContexte des données de la période :\n${dataContext}`
      : `Analyse ces données de la période (${periodLabel}) et génère ton rapport stratégique :\n${dataContext}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    return {
      success: true,
      insight: response.text || 'Analyse indisponible.',
      meta: {
        periodLabel,
        totalRevenue,
        ordersCount,
        leadsCount,
        errorsCount,
      },
    };
  } catch (error) {
    console.error('[generateAIInsight Error]:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? `Échec de l’analyse IA : ${error.message}`
          : 'Erreur inattendue lors de la génération de l’insight IA.',
    };
  }
}
