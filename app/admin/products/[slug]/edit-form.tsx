'use client';

import React, { useActionState, useState } from 'react';
import { updateProductConfigAction, type UpdateProductState } from '../actions';
import { Save, ArrowLeft, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface ProductEditFormProps {
  slug: string;
  initialTitle: string;
  initialPriceXaf: number;
  initialSalePriceXaf: number | null;
  initialIsOnSale: boolean;
}

const initialState: UpdateProductState = {};

export function ProductEditForm({
  slug,
  initialTitle,
  initialPriceXaf,
  initialSalePriceXaf,
  initialIsOnSale,
}: ProductEditFormProps) {
  const [isOnSale, setIsOnSale] = useState(initialIsOnSale);
  const [basePrice, setBasePrice] = useState(initialPriceXaf);
  const [salePrice, setSalePrice] = useState(initialSalePriceXaf ?? Math.round(initialPriceXaf / 2));

  const updateActionWithSlug = updateProductConfigAction.bind(null, slug);
  const [state, formAction, isPending] = useActionState(updateActionWithSlug, initialState);

  return (
    <div className="max-w-2xl bg-[#151515] border border-[#565A5C]/40 p-6 sm:p-8 shadow-2xl relative">
      {/* Technical corner indicators */}
      <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[#EEB149]" />
      <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-[#EEB149]" />
      <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-[#EEB149]" />
      <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-[#EEB149]" />

      <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#565A5C]/20">
        <div>
          <span className="text-[10px] font-mono text-[#EEB149] uppercase tracking-widest block mb-1">
            PARAMÈTRES TARIFAIRES
          </span>
          <h2 className="font-display text-xl font-bold text-[#FFFFFF] uppercase">
            {initialTitle}
          </h2>
          <span className="text-xs font-mono text-[#565A5C] block">
            Identifiant : {slug}
          </span>
        </div>

        <Link
          href="/admin/products"
          className="text-xs font-mono text-[#A5A5A0] hover:text-[#FFFFFF] flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour</span>
        </Link>
      </div>

      <form action={formAction} className="space-y-6">
        {state.success && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Tarifs mis à jour avec succès dans PostgreSQL et caches revalidés.</span>
          </div>
        )}

        {state.error && (
          <div className="p-4 bg-red-950/40 border border-red-500/50 text-red-300 text-xs font-mono flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Prix de Base */}
        <div>
          <label
            htmlFor="priceXaf"
            className="block text-xs font-mono uppercase tracking-wider text-[#A5A5A0] mb-2"
          >
            Prix de Base Standard (en FCFA / XAF)
          </label>
          <div className="relative">
            <input
              id="priceXaf"
              name="priceXaf"
              type="number"
              min="500"
              step="500"
              required
              value={basePrice}
              onChange={(e) => setBasePrice(parseInt(e.target.value, 10) || 0)}
              className="w-full bg-[#090909] border border-[#565A5C]/40 px-4 py-3 text-sm font-mono text-[#FFFFFF] focus:outline-none focus:border-[#EEB149] focus:ring-1 focus:ring-[#EEB149] transition-colors"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-xs font-mono text-[#565A5C]">
              FCFA
            </div>
          </div>
          <p className="text-[11px] font-mono text-[#565A5C] mt-1.5">
            Prix régulier appliqué aux visiteurs lorsque la promotion est désactivée.
          </p>
        </div>

        {/* Switch / Checkbox Promotion */}
        <div className="p-4 bg-[#090909] border border-[#565A5C]/30 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className={`w-4 h-4 ${isOnSale ? 'text-[#EEB149]' : 'text-[#565A5C]'}`} />
              <label
                htmlFor="isOnSale"
                className="text-xs font-mono font-semibold uppercase tracking-wider text-[#FFFFFF] cursor-pointer"
              >
                Activer la Promotion Exceptionnelle
              </label>
            </div>
            <p className="text-[11px] font-mono text-[#565A5C] mt-1">
              Bascule immédiatement le site public et le badge sur le prix réduit.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              id="isOnSale"
              name="isOnSale"
              type="checkbox"
              checked={isOnSale}
              onChange={(e) => setIsOnSale(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#151515] peer-focus:outline-none border border-[#565A5C] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#A5A5A0] peer-checked:after:bg-[#090909] peer-checked:bg-[#EEB149] after:border-gray-300 after:border after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        {/* Prix Promotionnel (si actif) */}
        <div className={`space-y-2 transition-opacity ${isOnSale ? 'opacity-100' : 'opacity-40'}`}>
          <label
            htmlFor="salePriceXaf"
            className="block text-xs font-mono uppercase tracking-wider text-[#EEB149]"
          >
            Prix Promotionnel Réduit (en FCFA / XAF)
          </label>
          <div className="relative">
            <input
              id="salePriceXaf"
              name="salePriceXaf"
              type="number"
              min="500"
              step="500"
              disabled={!isOnSale}
              value={salePrice}
              onChange={(e) => setSalePrice(parseInt(e.target.value, 10) || 0)}
              className="w-full bg-[#090909] border border-[#EEB149]/50 px-4 py-3 text-sm font-mono text-[#FFFFFF] focus:outline-none focus:border-[#EEB149] focus:ring-1 focus:ring-[#EEB149] transition-colors disabled:border-[#565A5C]/30"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-xs font-mono text-[#EEB149]">
              FCFA PROMO
            </div>
          </div>
          {isOnSale && basePrice > 0 && salePrice < basePrice && (
            <p className="text-[11px] font-mono text-emerald-400 mt-1">
              Remise affichée au lecteur : -{Math.round(((basePrice - salePrice) / basePrice) * 100)}% (Économie : {basePrice - salePrice} FCFA)
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-[#565A5C]/20 flex items-center justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 text-xs font-mono uppercase text-[#A5A5A0] hover:text-[#FFFFFF] transition-colors"
          >
            Annuler
          </Link>

          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-3 bg-[#EEB149] hover:bg-[#EEB149]/90 disabled:opacity-50 text-[#090909] font-mono text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>{isPending ? 'Enregistrement...' : 'Enregistrer la configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
