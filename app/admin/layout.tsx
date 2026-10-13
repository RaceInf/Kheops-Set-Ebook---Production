import React from 'react';
import type { Metadata } from 'next';
import { AdminSidebar } from './components/AdminSidebar';
import { NotificationBell } from './components/NotificationBell';

export const metadata: Metadata = {
  title: 'Console Admin | Kheops Set',
  robots: {
    index: false,
    follow: false,
  },
};

import { getNotificationsAction } from '@/lib/settings-actions';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { notifications, unreadCount } = await getNotificationsAction();

  return (
    <div className="min-h-screen bg-[#090909] text-[#FFFFFF] flex flex-col md:flex-row selection:bg-[#EEB149] selection:text-[#090909]">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-y-auto flex flex-col">
        {/* Top Header bar with Notification Bell */}
        <div className="sticky top-0 z-30 bg-[#090909]/90 backdrop-blur-md border-b border-[#565A5C]/30 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#565A5C]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="hidden sm:inline">CONSOLE DE GESTION &middot; KHEOPS SET</span>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell
              initialNotifications={notifications}
              initialUnreadCount={unreadCount}
            />
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex-1 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
