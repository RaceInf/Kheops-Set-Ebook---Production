import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, tool, convertToModelMessages, stepCountIs } from 'ai';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  // 1. Contrôle d'accès strict administrateur
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('kheops_admin_session');

  if (!sessionCookie || !sessionCookie.value) {
    return NextResponse.json(
      { error: 'Accès non autorisé. Session administrateur requise.' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { messages, dateRange } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Format de requête invalide : messages requis.' },
        { status: 400 }
      );
    }

    const fromDateStr = dateRange?.from ? String(dateRange.from) : undefined;
    const toDateStr = dateRange?.to ? String(dateRange.to) : undefined;

    // Conversion des messages UI vers messages modèle (support multi-tours et tool results)
    const modelMessages = await convertToModelMessages(messages);

    // 2. Définition des outils Prisma pour l'Agent Data Analyst
    const getSalesData = tool({
      description:
        'Interroge la table Order de Prisma pour extraire les données réelles de vente (CA en XAF, volume, répartition par ebook, commandes récentes).',
      inputSchema: z.object({
        startDate: z
          .string()
          .optional()
          .describe('Date de début au format YYYY-MM-DD ou ISO (optionnel).'),
        endDate: z
          .string()
          .optional()
          .describe('Date de fin au format YYYY-MM-DD ou ISO (optionnel).'),
        status: z
          .string()
          .optional()
          .describe('Statut de commande (ex: COMPLETED).'),
      }),
      execute: async ({ startDate, endDate, status }: { startDate?: string; endDate?: string; status?: string }) => {
        try {
          const effectiveStart = startDate || fromDateStr;
          const effectiveEnd = endDate || toDateStr;

          const where: Record<string, unknown> = {};
          if (effectiveStart || effectiveEnd) {
            where.createdAt = {};
            if (effectiveStart) {
              (where.createdAt as Record<string, unknown>).gte = new Date(effectiveStart);
            }
            if (effectiveEnd) {
              const end = new Date(effectiveEnd);
              end.setHours(23, 59, 59, 999);
              (where.createdAt as Record<string, unknown>).lte = end;
            }
          }
          if (status) {
            where.status = status;
          }

          const orders = await prisma.order.findMany({
            where,
            orderBy: { createdAt: 'desc' },
          });

          const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
          const totalOrders = orders.length;

          const byProduct: Record<string, { count: number; revenue: number }> = {};
          for (const order of orders) {
            const slug = order.productSlug || 'autre';
            if (!byProduct[slug]) {
              byProduct[slug] = { count: 0, revenue: 0 };
            }
            byProduct[slug].count += 1;
            byProduct[slug].revenue += order.amount || 0;
          }

          return {
            success: true,
            period: {
              startDate: effectiveStart || 'Tous les temps',
              endDate: effectiveEnd || 'Ce jour',
            },
            totalOrders,
            totalRevenueXAF: totalRevenue,
            byProduct,
            recentOrders: orders.slice(0, 10).map((o) => ({
              id: o.id,
              productSlug: o.productSlug,
              amount: o.amount,
              currency: o.currency,
              status: o.status,
              date: o.createdAt.toISOString(),
            })),
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur requête Prisma Order',
          };
        }
      },
    });

    const getLeadsData = tool({
      description:
        'Interroge la table Lead de Prisma pour extraire les acquisitions réelles (Protocole, contact, newsletter, répartition par source).',
      inputSchema: z.object({
        startDate: z
          .string()
          .optional()
          .describe('Date de début au format YYYY-MM-DD ou ISO (optionnel).'),
        endDate: z
          .string()
          .optional()
          .describe('Date de fin au format YYYY-MM-DD ou ISO (optionnel).'),
        source: z
          .string()
          .optional()
          .describe('Source optionnelle (ex: protocole_du_batisseur, formulaire_contact).'),
      }),
      execute: async ({ startDate, endDate, source }: { startDate?: string; endDate?: string; source?: string }) => {
        try {
          const effectiveStart = startDate || fromDateStr;
          const effectiveEnd = endDate || toDateStr;

          const where: Record<string, unknown> = {};
          if (effectiveStart || effectiveEnd) {
            where.createdAt = {};
            if (effectiveStart) {
              (where.createdAt as Record<string, unknown>).gte = new Date(effectiveStart);
            }
            if (effectiveEnd) {
              const end = new Date(effectiveEnd);
              end.setHours(23, 59, 59, 999);
              (where.createdAt as Record<string, unknown>).lte = end;
            }
          }
          if (source) {
            where.source = source;
          }

          const leads = await prisma.lead.findMany({
            where,
            orderBy: { createdAt: 'desc' },
          });

          const totalLeads = leads.length;
          const bySource: Record<string, number> = {};
          for (const lead of leads) {
            const s = lead.source || 'non_specifie';
            bySource[s] = (bySource[s] || 0) + 1;
          }

          return {
            success: true,
            period: {
              startDate: effectiveStart || 'Tous les temps',
              endDate: effectiveEnd || 'Ce jour',
            },
            totalLeads,
            bySource,
            recentLeadsCount: leads.length,
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur requête Prisma Lead',
          };
        }
      },
    });

    const getSystemLogs = tool({
      description:
        'Interroge la table SystemLog de Prisma pour récupérer les logs techniques, erreurs, audits et événements.',
      inputSchema: z.object({
        level: z
          .string()
          .optional()
          .describe('Niveau de log: INFO, WARN, ERROR ou AUDIT (optionnel).'),
        date: z
          .string()
          .optional()
          .describe('Date spécifique au format YYYY-MM-DD (optionnel).'),
        limit: z
          .number()
          .optional()
          .describe('Nombre maximum de logs (défaut: 15).'),
      }),
      execute: async ({ level, date, limit = 15 }: { level?: string; date?: string; limit?: number }) => {
        try {
          const where: Record<string, unknown> = {};
          if (level) {
            where.level = level.toUpperCase();
          }
          if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            where.createdAt = { gte: start, lte: end };
          }

          const logs = await prisma.systemLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
          });

          return {
            success: true,
            count: logs.length,
            logs: logs.map((l) => ({
              id: l.id,
              level: l.level,
              event: l.event,
              message: l.message,
              date: l.createdAt.toISOString(),
            })),
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur requête Prisma SystemLog',
          };
        }
      },
    });

    // 3. System Prompt chirurgical style "Acier Bienveillant"
    const nowIso = new Date().toISOString();
    const periodContext = fromDateStr && toDateStr
      ? `Plage temporelle activement sélectionnée dans l'interface : du ${fromDateStr.slice(0, 10)} au ${toDateStr.slice(0, 10)}.`
      : `Plage temporelle : aucune restriction stricte (analyse globale).`;

    const systemPrompt = `Tu es l'Analyste Stratégique de Kheops Set. Ton ton est froid, précis, chirurgical (style 'Acier Bienveillant'). N'invente jamais de chiffres. Si l'admin te pose une question, utilise tes outils (tools) pour chercher les données exactes dans la base de données entre les dates sélectionnées, puis réponds de manière concise, souvent avec des listes à puces ou des petits tableaux. Ne donne pas d'avis non sollicité.

Horloge serveur : ${nowIso}
${periodContext}

Règles impératives :
1. Si l'utilisateur demande des chiffres de ventes, de CA ou de commandes, appelle TOUJOURS 'getSalesData'.
2. Si l'utilisateur demande des informations sur les leads, abonnés ou contacts, appelle TOUJOURS 'getLeadsData'.
3. Si l'utilisateur demande des erreurs, alertes ou statuts techniques, appelle TOUJOURS 'getSystemLogs'.
4. Si la période n'est pas spécifiée dans la question de l'admin, utilise la plage temporelle sélectionnée par défaut.
5. Formatage : Met en valeur les chiffres clés et montants en FCFA/XAF. Réponses courtes, denses, sans flatterie ni bavardage.`;

    // 4. Exécution du stream de génération avec function calling multi-étapes
    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages: modelMessages,
      tools: {
        getSalesData,
        getLeadsData,
        getSystemLogs,
      },
      stopWhen: stepCountIs(5),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('[Admin Copilot Error]:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Erreur interne lors de la consultation du Copilote IA.',
      },
      { status: 500 }
    );
  }
}
