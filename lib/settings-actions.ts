'use server';

import { prisma } from '@/lib/db';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';

export interface GlobalSettingsData {
  id: string;
  maintenanceMode: boolean;
  announcementBannerText: string | null;
  announcementBannerLink: string | null;
  announcementBannerActive: boolean;
}

export interface NotificationItem {
  id: string;
  message: string;
  isRead: boolean;
  type: string | null;
  createdAt: Date;
}

/**
 * Récupère les paramètres globaux (avec cache Next.js)
 */
export const getCachedGlobalSettings = unstable_cache(
  async (): Promise<GlobalSettingsData> => {
    try {
      const settings = await prisma.globalSettings.findUnique({
        where: { id: 'global' },
      });

      if (settings) {
        return {
          id: settings.id,
          maintenanceMode: settings.maintenanceMode,
          announcementBannerText: settings.announcementBannerText,
          announcementBannerLink: settings.announcementBannerLink,
          announcementBannerActive: settings.announcementBannerActive,
        };
      }

      // Initialisation par défaut si inexistant
      return {
        id: 'global',
        maintenanceMode: false,
        announcementBannerText: null,
        announcementBannerLink: null,
        announcementBannerActive: false,
      };
    } catch {
      return {
        id: 'global',
        maintenanceMode: false,
        announcementBannerText: null,
        announcementBannerLink: null,
        announcementBannerActive: false,
      };
    }
  },
  ['global-settings'],
  { tags: ['global-settings'], revalidate: 30 }
);

export async function getGlobalSettings(): Promise<GlobalSettingsData> {
  return await getCachedGlobalSettings();
}

/**
 * Met à jour les paramètres globaux (Mode maintenance & Bannière)
 */
export async function updateGlobalSettingsAction(
  _prevState: { success?: boolean; error?: string },
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const maintenanceMode = formData.get('maintenanceMode') === 'on' || formData.get('maintenanceMode') === 'true';
  const announcementBannerActive = formData.get('announcementBannerActive') === 'on' || formData.get('announcementBannerActive') === 'true';
  const announcementBannerText = (formData.get('announcementBannerText') as string)?.trim() || null;
  const announcementBannerLink = (formData.get('announcementBannerLink') as string)?.trim() || null;

  try {
    await prisma.globalSettings.upsert({
      where: { id: 'global' },
      update: {
        maintenanceMode,
        announcementBannerActive,
        announcementBannerText,
        announcementBannerLink,
      },
      create: {
        id: 'global',
        maintenanceMode,
        announcementBannerActive,
        announcementBannerText,
        announcementBannerLink,
      },
    });

    revalidateTag('global-settings');
    revalidatePath('/', 'layout');
    revalidatePath('/admin/settings');

    return { success: true };
  } catch (error) {
    console.error('[updateGlobalSettingsAction Error]:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur de mise à jour.',
    };
  }
}

/**
 * Récupère les notifications et le compteur non lu
 */
export async function getNotificationsAction(): Promise<{
  notifications: NotificationItem[];
  unreadCount: number;
}> {
  try {
    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.notification.count({
        where: { isRead: false },
      }),
    ]);

    return { notifications, unreadCount };
  } catch {
    return { notifications: [], unreadCount: 0 };
  }
}

/**
 * Marque une ou toutes les notifications comme lues
 */
export async function markNotificationReadAction(notificationId?: string): Promise<{ success: boolean }> {
  try {
    if (notificationId) {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
      });
    } else {
      await prisma.notification.updateMany({
        where: { isRead: false },
        data: { isRead: true },
      });
    }

    revalidatePath('/admin');
    return { success: true };
  } catch {
    return { success: false };
  }
}
