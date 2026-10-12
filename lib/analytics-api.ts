import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { prisma } from '@/lib/db';

export interface AnalyticsTrafficSource {
  source: string;
  sessions: number;
  percentage: number;
}

export interface AnalyticsTopPage {
  path: string;
  title: string;
  views: number;
  percentage: number;
}

export interface ProductConversionRate {
  productSlug: string;
  productTitle: string;
  views: number;
  sales: number;
  conversionRate: string;
}

export interface AnalyticsDashboardData {
  configured: boolean;
  totalUsers7d: number;
  totalSessions7d: number;
  topPages: AnalyticsTopPage[];
  trafficSources: AnalyticsTrafficSource[];
  conversions: ProductConversionRate[];
  dailyVisitors: Array<{
    date: string;
    visitors: number;
  }>;
  errorMessage?: string;
}

/**
 * Crée le client Google Analytics Data avec compte de service
 */
function getAnalyticsClient(): { client: BetaAnalyticsDataClient; propertyId: string } | null {
  const propertyId = process.env.GA_PROPERTY_ID;
  const clientEmail = process.env.GA_CLIENT_EMAIL;
  let privateKey = process.env.GA_PRIVATE_KEY;

  if (!propertyId || !clientEmail || !privateKey) {
    return null;
  }

  // Remplacement des sauts de ligne échappés
  privateKey = privateKey.replace(/\\n/g, '\n');

  try {
    const client = new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    });
    return { client, propertyId };
  } catch (error) {
    console.error('[GA Client Init Error]:', error);
    return null;
  }
}

/**
 * Récupère les données Google Analytics 4 et croise avec les ventes Prisma
 */
export async function getAnalyticsDashboardData(): Promise<AnalyticsDashboardData> {
  const gaSetup = getAnalyticsClient();

  // Récupération des ventes Prisma pour le calcul de conversion (7 derniers jours)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  let capitalSales7d = 0;
  let codeSales7d = 0;

  try {
    const [capitalOrders, codeOrders] = await Promise.all([
      prisma.order.count({
        where: {
          createdAt: { gte: sevenDaysAgo },
          productSlug: { in: ['le-capital-du-batisseur', 'captaldubatisseur'] },
          status: { in: ['COMPLETED', 'completed', 'PAID', 'paid'] },
        },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: sevenDaysAgo },
          productSlug: { in: ['le-code-du-batisseur', 'codedubatisseur'] },
          status: { in: ['COMPLETED', 'completed', 'PAID', 'paid'] },
        },
      }),
    ]);
    capitalSales7d = capitalOrders;
    codeSales7d = codeOrders;
  } catch (err) {
    console.error('[Prisma Sales for Analytics Error]:', err);
  }

  // Si GA4 n'est pas encore configuré dans .env.local, renvoyer des données par défaut structurées
  if (!gaSetup) {
    return {
      configured: false,
      totalUsers7d: 0,
      totalSessions7d: 0,
      topPages: [
        { path: '/', title: 'Accueil — Kheops Set', views: 0, percentage: 0 },
        { path: '/ebooks/le-capital-du-batisseur', title: 'Le Capital du Bâtisseur', views: 0, percentage: 0 },
        { path: '/ebooks', title: 'La Salle des Plans', views: 0, percentage: 0 },
        { path: '/ressource-gratuite', title: 'Le Protocole d’Isolation', views: 0, percentage: 0 },
        { path: '/ebooks/le-code-du-batisseur', title: 'Le Code du Bâtisseur', views: 0, percentage: 0 },
      ],
      trafficSources: [
        { source: 'Direct', sessions: 0, percentage: 0 },
        { source: 'Organic Search', sessions: 0, percentage: 0 },
        { source: 'Social', sessions: 0, percentage: 0 },
        { source: 'Referral', sessions: 0, percentage: 0 },
      ],
      conversions: [
        {
          productSlug: 'le-capital-du-batisseur',
          productTitle: 'Le Capital du Bâtisseur',
          views: 0,
          sales: capitalSales7d,
          conversionRate: '0.0%',
        },
        {
          productSlug: 'le-code-du-batisseur',
          productTitle: 'Le Code du Bâtisseur',
          views: 0,
          sales: codeSales7d,
          conversionRate: '0.0%',
        },
      ],
      dailyVisitors: [],
      errorMessage: 'Identifiants GA4 manquants (GA_PROPERTY_ID, GA_CLIENT_EMAIL, GA_PRIVATE_KEY).',
    };
  }

  const { client, propertyId } = gaSetup;

  try {
    // 1. Visiteurs totaux & sessions des 7 derniers jours + ventilation quotidienne
    const [usersResponse, topPagesResponse, trafficSourcesResponse] = await Promise.all([
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
        orderBys: [{ dimension: { dimensionName: 'date' } }],
      }),
      // 2. Top 5 des pages
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 5,
      }),
      // 3. Sources de trafic
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 5,
      }),
    ]);

    // Extraction des totaux et journaliers
    let totalUsers7d = 0;
    let totalSessions7d = 0;
    const dailyVisitors: Array<{ date: string; visitors: number }> = [];

    if (usersResponse[0]?.rows) {
      for (const row of usersResponse[0].rows) {
        const rawDate = row.dimensionValues?.[0]?.value || '';
        const users = Number(row.metricValues?.[0]?.value) || 0;
        const sessions = Number(row.metricValues?.[1]?.value) || 0;

        totalUsers7d += users;
        totalSessions7d += sessions;

        // Format Date : YYYYMMDD -> DD/MM
        const formattedDate =
          rawDate.length === 8
            ? `${rawDate.slice(6, 8)}/${rawDate.slice(4, 6)}`
            : rawDate;

        dailyVisitors.push({ date: formattedDate, visitors: users });
      }
    }

    // Extraction des Top Pages
    let totalPageViews = 0;
    const rawPages: Array<{ path: string; title: string; views: number }> = [];

    if (topPagesResponse[0]?.rows) {
      for (const row of topPagesResponse[0].rows) {
        const path = row.dimensionValues?.[0]?.value || '/';
        const title = row.dimensionValues?.[1]?.value || 'Page';
        const views = Number(row.metricValues?.[0]?.value) || 0;
        totalPageViews += views;
        rawPages.push({ path, title, views });
      }
    }

    const topPages: AnalyticsTopPage[] = rawPages.map((p) => ({
      ...p,
      percentage: totalPageViews > 0 ? Math.round((p.views / totalPageViews) * 100) : 0,
    }));

    // Extraction des Sources de Trafic
    let totalSourceSessions = 0;
    const rawSources: Array<{ source: string; sessions: number }> = [];

    if (trafficSourcesResponse[0]?.rows) {
      for (const row of trafficSourcesResponse[0].rows) {
        const source = row.dimensionValues?.[0]?.value || 'Autre';
        const sessions = Number(row.metricValues?.[0]?.value) || 0;
        totalSourceSessions += sessions;
        rawSources.push({ source, sessions });
      }
    }

    const trafficSources: AnalyticsTrafficSource[] = rawSources.map((s) => ({
      ...s,
      percentage:
        totalSourceSessions > 0 ? Math.round((s.sessions / totalSourceSessions) * 100) : 0,
    }));

    // 4. Calcul du Taux de conversion par produit (Acheteurs Prisma / Visiteurs GA4 de la page)
    const capitalPageViews =
      topPages.find((p) => p.path.includes('capital-du-batisseur'))?.views ||
      (totalUsers7d > 0 ? Math.round(totalUsers7d * 0.45) : 0);

    const codePageViews =
      topPages.find((p) => p.path.includes('code-du-batisseur'))?.views ||
      (totalUsers7d > 0 ? Math.round(totalUsers7d * 0.25) : 0);

    const capitalRate =
      capitalPageViews > 0
        ? `${((capitalSales7d / capitalPageViews) * 100).toFixed(1)}%`
        : '0.0%';

    const codeRate =
      codePageViews > 0
        ? `${((codeSales7d / codePageViews) * 100).toFixed(1)}%`
        : '0.0%';

    return {
      configured: true,
      totalUsers7d,
      totalSessions7d,
      topPages,
      trafficSources,
      conversions: [
        {
          productSlug: 'le-capital-du-batisseur',
          productTitle: 'Le Capital du Bâtisseur',
          views: capitalPageViews,
          sales: capitalSales7d,
          conversionRate: capitalRate,
        },
        {
          productSlug: 'le-code-du-batisseur',
          productTitle: 'Le Code du Bâtisseur',
          views: codePageViews,
          sales: codeSales7d,
          conversionRate: codeRate,
        },
      ],
      dailyVisitors,
    };
  } catch (err) {
    console.error('[GA Report Error]:', err);
    return {
      configured: false,
      totalUsers7d: 0,
      totalSessions7d: 0,
      topPages: [],
      trafficSources: [],
      conversions: [],
      dailyVisitors: [],
      errorMessage: err instanceof Error ? err.message : 'Erreur API Google Analytics.',
    };
  }
}
