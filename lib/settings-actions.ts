'use server';

export async function getCachedGlobalSettings() {
  return {
    maintenanceMode: false,
    siteTitle: 'Kheops Set — Le Capital du Bâtisseur',
  };
}

export async function getNotificationsAction() {
  return {
    notifications: [],
    unreadCount: 0,
  };
}
