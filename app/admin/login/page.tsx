'use client';

import React, { useActionState } from 'react';
import { loginAdminAction, type LoginActionState } from './actions';
import { Shield, KeyRound, ArrowRight, Lock } from 'lucide-react';

const initialState: LoginActionState = {};

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAdminAction, initialState);

  return (
    <div className="min-h-screen bg-[#090909] text-[#FFFFFF] flex items-center justify-center p-4 selection:bg-[#EEB149] selection:text-[#090909]">
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#FFFFFF_1px,transparent_1px),linear-gradient(to_bottom,#FFFFFF_1px,transparent_1px)] bg-[size:4rem_4rem]"
        aria-hidden="true" 
      />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-none border border-[#EEB149]/40 bg-[#151515] mb-4 text-[#EEB149] shadow-lg shadow-[#EEB149]/5">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#FFFFFF] uppercase">
            KHEOPS SET <span className="text-[#EEB149]">·</span> ADMIN
          </h1>
          <p className="text-xs font-mono text-[#A5A5A0] mt-1 tracking-wider uppercase">
            Espace de Contrôle Privé · Accès Restreint
          </p>
        </div>

        <div className="bg-[#151515] border border-[#565A5C]/40 p-8 shadow-2xl relative">
          <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[#EEB149]" />
          <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-[#EEB149]" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-[#EEB149]" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-[#EEB149]" />

          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#565A5C]/20">
            <Lock className="w-4 h-4 text-[#EEB149]" />
            <span className="text-xs font-mono tracking-widest text-[#F3F1EB] uppercase">
              Authentification Chiffrée
            </span>
          </div>

          <form action={formAction} className="space-y-6">
            {state.error && (
              <div 
                role="alert"
                className="bg-red-950/40 border border-red-500/40 text-red-200 text-xs font-mono p-3 rounded-none flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                <span>{state.error}</span>
              </div>
            )}

            <div>
              <label 
                htmlFor="password" 
                className="block text-xs font-mono uppercase tracking-wider text-[#A5A5A0] mb-2"
              >
                Clé de Sécurité / Mot de Passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#565A5C]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoFocus
                  placeholder="••••••••••••••••"
                  className="w-full bg-[#090909] border border-[#565A5C]/40 pl-10 pr-4 py-3 text-sm font-mono text-[#FFFFFF] placeholder:text-[#565A5C] focus:outline-none focus:border-[#EEB149] focus:ring-1 focus:ring-[#EEB149] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#EEB149] hover:bg-[#EEB149]/90 disabled:opacity-50 text-[#090909] font-mono text-xs uppercase tracking-widest font-bold py-3.5 px-4 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{isPending ? 'Vérification...' : 'Ouvrir la session'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#565A5C]/20 text-center">
            <span className="text-[11px] font-mono text-[#565A5C]">
              IP journalisée · Sécurité active Kheops
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
