'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  ShoppingCart,
  Users,
  Mail,
  Info,
  Clock,
  X,
} from 'lucide-react';
import {
  getNotificationsAction,
  markNotificationReadAction,
  type NotificationItem,
} from '@/lib/settings-actions';

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

interface NotificationBellProps {
  initialNotifications?: NotificationItem[];
  initialUnreadCount?: number;
}

export function NotificationBell({
  initialNotifications = [],
  initialUnreadCount = 0,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Polling toutes les 30 secondes pour les notifications en direct
    const interval = setInterval(async () => {
      try {
        const data = await getNotificationsAction();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } catch {
        // Ignorer si la base n'est pas encore connectée
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Fermer le dropdown en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleMarkAllRead = () => {
    startTransition(async () => {
      await markNotificationReadAction();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    });
  };

  const handleMarkSingleRead = (id: string) => {
    startTransition(async () => {
      await markNotificationReadAction(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    });
  };

  return (
    <div className="relative font-mono" ref={dropdownRef}>
      {/* Bouton Cloche */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-[#151515] hover:bg-[#090909] border border-[#565A5C]/40 text-[#A5A5A0] hover:text-[#FFFFFF] transition-all cursor-pointer shadow-md focus:outline-none focus:border-[#EEB149]"
        aria-label="Notifications"
        title="Notifications internes"
      >
        <Bell className="w-4 h-4" />

        {/* Badge rouge avec compteur non lu */}
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-md">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Volet Déroulant des Notifications */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#151515] border border-[#EEB149] shadow-2xl z-50 overflow-hidden text-xs">
          {/* Header Volet */}
          <div className="p-3.5 bg-[#090909] border-b border-[#565A5C]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#FFFFFF] uppercase tracking-wider text-[11px]">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 bg-red-600/20 text-red-400 border border-red-500/30 text-[9px] font-bold">
                  {unreadCount} NOUVELLE{unreadCount > 1 ? 'S' : ''}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  disabled={isPending}
                  className="text-[10px] text-[#EEB149] hover:text-[#FFFFFF] transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  title="Tout marquer comme lu"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tout lire</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#565A5C] hover:text-[#FFFFFF] p-0.5"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Liste des Notifications */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[#565A5C]/20">
            {notifications.length > 0 ? (
              notifications.map((notif) => {
                const isOrder = notif.type === 'order';
                const isLead = notif.type === 'lead';
                const isContact = notif.type === 'contact';

                return (
                  <div
                    key={notif.id}
                    onClick={() => !notif.isRead && handleMarkSingleRead(notif.id)}
                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                      notif.isRead
                        ? 'bg-[#151515] hover:bg-[#090909]/60 opacity-70'
                        : 'bg-[#151515]/90 hover:bg-[#090909] border-l-2 border-[#EEB149]'
                    }`}
                  >
                    {/* Icône selon le type */}
                    <div
                      className={`p-1.5 shrink-0 mt-0.5 ${
                        isOrder
                          ? 'bg-[#EEB149]/10 text-[#EEB149] border border-[#EEB149]/30'
                          : isLead
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                            : isContact
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                              : 'bg-[#565A5C]/20 text-[#A5A5A0]'
                      }`}
                    >
                      {isOrder ? (
                        <ShoppingCart className="w-3.5 h-3.5" />
                      ) : isLead ? (
                        <Users className="w-3.5 h-3.5" />
                      ) : isContact ? (
                        <Mail className="w-3.5 h-3.5" />
                      ) : (
                        <Info className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-[#F3F1EB] leading-snug break-words">
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-1.5 text-[9px] text-[#565A5C] mt-1.5">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(notif.createdAt)}</span>
                        {!notif.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#EEB149] inline-block ml-1" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-[11px] text-[#565A5C] space-y-1">
                <Bell className="w-6 h-6 mx-auto opacity-30 text-[#EEB149]" />
                <p>Aucune notification enregistrée.</p>
                <p className="text-[10px] text-[#565A5C]">
                  Les nouvelles commandes et inscriptions apparaîtront ici.
                </p>
              </div>
            )}
          </div>

          <div className="p-2.5 bg-[#090909] border-t border-[#565A5C]/30 text-center text-[10px] text-[#565A5C]">
            Système d&apos;alerte en direct Kheops Set
          </div>
        </div>
      )}
    </div>
  );
}
