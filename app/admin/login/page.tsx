'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMessage(data?.error || 'Identifiants invalides.');
        setLoading(false);
        return;
      }

      // Succès -> redirection vers la racine du dashboard
      router.push('/admin');
      router.refresh();
    } catch {
      setErrorMessage('Une erreur de communication est survenue.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090909] text-[#F3F1EB] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm bg-[#151515] border border-[#565A5C]/40 p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* En-tête sobre et technique */}
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#090909] border border-[#EEB149]/50 flex items-center justify-center text-[#EEB149]">
            <Shield className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="font-mono text-[10px] tracking-widest text-[#EEB149] uppercase font-semibold">
              ACCÈS PRIVÉ · KHEOPS SET
            </p>
            <h1 className="font-display text-xl font-bold text-[#FFFFFF]">
              Administration
            </h1>
          </div>
          <p className="text-xs text-[#A5A5A0]">
            Session sécurisée avec chiffrement et protection anti-brute-force.
          </p>
        </div>

        {/* Message d'erreur neutre */}
        {errorMessage && (
          <div
            role="alert"
            className="p-3 bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Formulaire de connexion */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="admin-email"
              className="block font-mono text-[11px] uppercase tracking-wider text-[#A5A5A0]"
            >
              Identifiant Administrateur
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#565A5C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@kheops.set"
                className="w-full bg-[#090909] border border-[#565A5C]/50 text-xs text-[#FFFFFF] pl-9 pr-3 py-2.5 focus:border-[#EEB149] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="admin-password"
              className="block font-mono text-[11px] uppercase tracking-wider text-[#A5A5A0]"
            >
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#565A5C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#090909] border border-[#565A5C]/50 text-xs text-[#FFFFFF] pl-9 pr-3 py-2.5 focus:border-[#EEB149] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#EEB149] text-[#090909] font-mono text-xs font-bold tracking-wider hover:bg-[#FFFFFF] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>VÉRIFICATION...</span>
                </>
              ) : (
                <span>OUVRIR LA SESSION</span>
              )}
            </button>
          </div>
        </form>

        <div className="pt-2 border-t border-[#565A5C]/30 text-center">
          <p className="font-mono text-[10px] text-[#565A5C]">
            Session chiffrée · Rôle admin unique · Cookie strict
          </p>
        </div>
      </div>
    </div>
  );
}
