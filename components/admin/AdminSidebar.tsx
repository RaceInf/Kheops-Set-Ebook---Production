'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Sliders,
  Coins,
  Webhook,
  History,
  LogOut,
  Shield,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Vue d’ensemble', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Produits', icon: BookOpen },
  { href: '/admin/settings', label: 'Paramètres', icon: Sliders },
  { href: '/admin/currencies', label: 'Devises', icon: Coins },
  { href: '/admin/webhooks', label: 'Webhooks Chariow', icon: Webhook },
  { href: '/admin/audit-log', label: 'Journal d’activité', icon: History },
];

export function AdminSidebar({ emailMasked }: { emailMasked: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } finally {
      router.push('/admin/login');
      router.refresh();
    }
  };

  return (
    <aside className="w-64 bg-[#151515] border-r border-[#565A5C]/40 flex flex-col justify-between shrink-0 min-h-screen">
      <div className="p-5 space-y-6">
        {/* Brand Header */}
        <div className="space-y-1.5 pb-4 border-b border-[#565A5C]/35">
          <div className="flex items-center gap-2 text-[#EEB149]">
            <Shield className="w-5 h-5 shrink-0" />
            <span className="font-mono text-xs tracking-widest uppercase font-bold">
              KHEOPS SET
            </span>
          </div>
          <p className="font-mono text-[10px] text-[#A5A5A0] tracking-wider uppercase">
            Console Privée Administrateur
          </p>
        </div>

        {/* Navigation Items */}
        <nav aria-label="Navigation d’administration" className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-mono transition-colors border-l-2 ${
                  isActive
                    ? 'bg-[#090909] text-[#EEB149] border-[#EEB149] font-bold'
                    : 'text-[#A5A5A0] hover:text-[#FFFFFF] hover:bg-[#090909]/60 border-transparent'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer User Info & Logout */}
      <div className="p-4 border-t border-[#565A5C]/35 space-y-3 bg-[#090909]/60">
        <div className="space-y-0.5">
          <p className="font-mono text-[10px] text-[#A5A5A0] uppercase tracking-wider">
            Administrateur
          </p>
          <p className="font-mono text-xs text-[#FFFFFF] font-semibold truncate">
            {emailMasked}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#151515] border border-[#565A5C]/50 hover:border-red-500 hover:text-red-400 text-xs font-mono text-[#A5A5A0] transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>DÉCONNEXION</span>
        </button>
      </div>
    </aside>
  );
}
