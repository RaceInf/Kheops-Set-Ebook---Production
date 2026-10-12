'use server';

import { prisma } from '@/lib/db';

export interface DashboardStats {
  totalRevenue: number;
  totalOrdersCount: number;
  totalLeadsCount: number;
  conversionRate: string;
  recentOrders: Array<{
    id: string;
    email: string;
    productSlug: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: Date;
  }>;
  recentLeads: Array<{
    id: string;
    email: string;
    firstName: string | null;
    source: string | null;
    createdAt: Date;
  }>;
  dbConnected: boolean;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [ordersAgg, totalOrdersCount, totalLeadsCount, recentOrders, recentLeads] =
      await Promise.all([
        prisma.order.aggregate({
          _sum: {
            amount: true,
          },
          where: {
            status: {
              in: ['COMPLETED', 'completed', 'PAID', 'paid'],
            },
          },
        }),
        prisma.order.count(),
        prisma.lead.count(),
        prisma.order.findMany({
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.lead.findMany({
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
        }),
      ]);

    const totalRevenue = ordersAgg._sum.amount ?? 0;

    return {
      totalRevenue,
      totalOrdersCount,
      totalLeadsCount,
      conversionRate: '0.0%',
      recentOrders,
      recentLeads,
      dbConnected: true,
    };
  } catch (error) {
    console.error('[Dashboard Stats Error]:', error);
    // Retour sécurisé si la base de données n'est pas encore migrée ou configurée
    return {
      totalRevenue: 0,
      totalOrdersCount: 0,
      totalLeadsCount: 0,
      conversionRate: '0.0%',
      recentOrders: [],
      recentLeads: [],
      dbConnected: false,
    };
  }
}
