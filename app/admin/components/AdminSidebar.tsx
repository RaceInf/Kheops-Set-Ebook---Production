'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  BookOpen,
  Terminal,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Shield,
  Activity,
} from 'lucide-react';
import { logoutAdminAction } from '../login/actions';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: "Vue d'ensemble", href: '/admin', icon: LayoutDashboard },
  { label: 'Analytics', href: '/admin/analytics', icon: Activity },
  { label: 'Ventes', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Leads', href: '/admin/leads', icon: Users },
  { label: 'Catalogue', href: '/admin/products', icon: BookOpen },
  { label: 'Logs Système', href: '/admin/logs', icon: Terminal },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === '/admin/login') {
    return null;
  }

  const NavContent = (
    <div className="flex flex-col h-full bg-[#151515] border-r border-[#565A5C]/40">
      <div className="p-6 border-b border-[#565A5C]/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#090909] border border-[#EEB149]/50 flex items-center justify-center text-[#EEB149]">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-display text-sm font-bold tracking-tight text-[#FFFFFF] uppercase block">
              KHEOPS SET
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#EEB149] uppercase block">
              CONSOLE ADMIN
            </span>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden text-[#A5A5A0] hover:text-[#FFFFFF] p-1"
          aria-label="Fermer le menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#565A5C]">
            Navigation
          </span>
        </div>

        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-mono uppercase tracking-wider transition-all ${
                isActive
                  ? 'bg-[#090909] text-[#EEB149] border-l-2 border-[#EEB149] font-medium shadow-sm'
                  : 'text-[#A5A5A0] hover:text-[#FFFFFF] hover:bg-[#090909]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-[#EEB149]' : 'text-[#A5A5A0]'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#EEB149]" />
              )}
            </Link>
          );
        })}

        <div className="pt-6 px-3 pb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#565A5C]">
            Ressources
          </span>
        </div>

        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2.5 text-xs font-mono text-[#A5A5A0] hover:text-[#FFFFFF] hover:bg-[#090909]/60 uppercase tracking-wider"
        >
          <div className="flex items-center gap-3">
            <ExternalLink className="w-4 h-4 text-[#565A5C]" />
            <span>Site Public</span>
          </div>
          <span className="text-[9px] text-[#565A5C]">EXT</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-[#565A5C]/30 space-y-3 bg-[#090909]/40">
        <div className="flex items-center justify-between px-2 py-1.5 bg-[#090909] border border-[#565A5C]/20 text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-[#A5A5A0]">Statut :</span>
          </div>
          <span className="text-emerald-400 font-bold">EN LIGNE</span>
        </div>

        <form action={logoutAdminAction}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#151515] hover:bg-[#090909] border border-[#565A5C]/40 text-xs font-mono text-red-400 hover:text-red-300 transition-colors cursor-pointer uppercase tracking-wider"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden sticky top-0 z-40 bg-[#151515] border-b border-[#565A5C]/40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#090909] border border-[#EEB149]/50 flex items-center justify-center text-[#EEB149]">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <span className="font-display text-xs font-bold tracking-tight text-[#FFFFFF] uppercase">
            KHEOPS SET <span className="text-[#EEB149]">·</span> ADMIN
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-[#A5A5A0] hover:text-[#FFFFFF] p-1.5 bg-[#090909] border border-[#565A5C]/30"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full z-10">
            {NavContent}
          </div>
        </div>
      )}

      <aside className="hidden md:block w-64 h-screen sticky top-0 shrink-0">
        {NavContent}
      </aside>
    </>
  );
}
