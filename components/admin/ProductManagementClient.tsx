'use client';

import React, { useState } from 'react';
import type { AdminProductItem } from '@/lib/admin/types';
import { Check, Loader2, Save, AlertCircle } from 'lucide-react';

export function ProductManagementClient({
  initialProducts,
}: {
  initialProducts: AdminProductItem[];
}) {
  const [products, setProducts] = useState<AdminProductItem[]>(initialProducts);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFieldChange = (
    id: string,
    field: keyof AdminProductItem,
    value: string | boolean
  ) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSave = async (product: AdminProductItem) => {
    setSavingId(product.id);
    setSuccessId(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          cta_label: product.cta_label,
          chariow_url: product.chariow_url,
          chariow_product_id: product.chariow_product_id,
          is_active: product.is_active,
          is_published_chariow: product.is_published_chariow,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Erreur lors de la mise à jour');
      }

      setSuccessId(product.id);
      setTimeout(() => setSuccessId(null), 3000);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Erreur technique lors de la sauvegarde'
      );
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="p-3 bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {products.map((product) => {
          const isSaving = savingId === product.id;
          const isSuccess = successId === product.id;

          return (
            <div
              key={product.id}
              className="p-6 bg-[#151515] border border-[#565A5C]/40 space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#565A5C]/30">
                <div className="space-y-0.5">
                  <span className="font-mono text-[10px] text-[#EEB149] uppercase tracking-wider">
                    {product.slug}
                  </span>
                  <h2 className="font-display text-lg font-bold text-[#FFFFFF]">
                    {product.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-[#090909] border border-[#EEB149]/50 text-[#EEB149] font-mono text-xs font-bold">
                    PRIX MAÎTRE : {product.price_xaf.toLocaleString('fr-FR')} FCFA
                  </div>
                </div>
              </div>

              {/* Formulaire des champs modifiables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[#A5A5A0]">
                    Libellé du CTA principal
                  </label>
                  <input
                    type="text"
                    value={product.cta_label}
                    onChange={(e) =>
                      handleFieldChange(product.id, 'cta_label', e.target.value)
                    }
                    className="w-full bg-[#090909] border border-[#565A5C]/50 text-xs text-[#FFFFFF] px-3 py-2.5 font-mono focus:border-[#EEB149] focus:outline-none"
                  />
                  <p className="font-mono text-[10px] text-[#A5A5A0]">
                    Texte affiché sur le bouton d’achat du site
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[#A5A5A0]">
                    ID Produit Chariow (Snap Widget)
                  </label>
                  <input
                    type="text"
                    value={product.chariow_product_id}
                    onChange={(e) =>
                      handleFieldChange(
                        product.id,
                        'chariow_product_id',
                        e.target.value
                      )
                    }
                    className="w-full bg-[#090909] border border-[#565A5C]/50 text-xs text-[#FFFFFF] px-3 py-2.5 font-mono focus:border-[#EEB149] focus:outline-none"
                  />
                  <p className="font-mono text-[10px] text-[#A5A5A0]">
                    Identifiant passé au Snap Widget Chariow
                  </p>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[#A5A5A0]">
                    URL directe de secours Chariow (Checkout)
                  </label>
                  <input
                    type="url"
                    value={product.chariow_url}
                    onChange={(e) =>
                      handleFieldChange(product.id, 'chariow_url', e.target.value)
                    }
                    className="w-full bg-[#090909] border border-[#565A5C]/50 text-xs text-[#FFFFFF] px-3 py-2.5 font-mono focus:border-[#EEB149] focus:outline-none"
                  />
                  <p className="font-mono text-[10px] text-[#A5A5A0]">
                    Lien sécurisé vers lequel le fallback redirige
                  </p>
                </div>

                {/* Toggles de visibilité et d'activation */}
                <div className="flex items-center gap-6 md:col-span-2 pt-2">
                  <label className="inline-flex items-center gap-2.5 cursor-pointer font-mono text-xs">
                    <input
                      type="checkbox"
                      checked={product.is_active}
                      onChange={(e) =>
                        handleFieldChange(product.id, 'is_active', e.target.checked)
                      }
                      className="w-4 h-4 accent-[#EEB149]"
                    />
                    <span className="text-[#F3F1EB]">Produit actif sur le site</span>
                  </label>

                  <label className="inline-flex items-center gap-2.5 cursor-pointer font-mono text-xs">
                    <input
                      type="checkbox"
                      checked={product.is_published_chariow}
                      onChange={(e) =>
                        handleFieldChange(
                          product.id,
                          'is_published_chariow',
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 accent-[#EEB149]"
                    />
                    <span className="text-[#F3F1EB]">
                      Publié sur la boutique Chariow
                    </span>
                  </label>
                </div>
              </div>

              {/* Barre d'action */}
              <div className="pt-4 border-t border-[#565A5C]/30 flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#A5A5A0]">
                  Dernière modification : {new Date(product.updated_at).toLocaleString('fr-FR')}
                </span>

                <button
                  type="button"
                  onClick={() => handleSave(product)}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#EEB149] text-[#090909] font-mono text-xs font-bold hover:bg-[#FFFFFF] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>ENREGISTREMENT...</span>
                    </>
                  ) : isSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>MODIFIÉ AVEC SUCCÈS</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>ENREGISTRER CE PRODUIT</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
