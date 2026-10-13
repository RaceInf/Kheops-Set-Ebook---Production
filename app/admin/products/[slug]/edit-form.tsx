'use client';

import React, { useActionState, useState, useRef, useTransition } from 'react';
import { updateProductConfigAction, type UpdateProductState } from '../actions';
import {
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  UploadCloud,
  Image as ImageIcon,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { uploadMediaAction } from '@/lib/media-actions';

interface ProductEditFormProps {
  slug: string;
  initialTitle: string;
  initialPriceXaf: number;
  initialSalePriceXaf: number | null;
  initialIsOnSale: boolean;
  initialCoverImage: string;
}

const initialState: UpdateProductState = {};

export function ProductEditForm({
  slug,
  initialTitle,
  initialPriceXaf,
  initialSalePriceXaf,
  initialIsOnSale,
  initialCoverImage,
}: ProductEditFormProps) {
  const [isOnSale, setIsOnSale] = useState(initialIsOnSale);
  const [basePrice, setBasePrice] = useState(initialPriceXaf);
  const [salePrice, setSalePrice] = useState(initialSalePriceXaf ?? Math.round(initialPriceXaf / 2));
  const [coverImage, setCoverImage] = useState(initialCoverImage);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, startUploadTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateActionWithSlug = updateProductConfigAction.bind(null, slug);
  const [state, formAction, isPending] = useActionState(updateActionWithSlug, initialState);

  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'covers');

    startUploadTransition(async () => {
      const res = await uploadMediaAction(formData);
      if (res.success && res.url) {
        setCoverImage(res.url);
      } else {
        setUploadError(res.error || 'Erreur lors de l’envoi de l’image.');
      }
    });
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-2xl bg-[#151515] border border-[#565A5C]/40 p-6 sm:p-8 shadow-2xl relative font-mono">
      {/* Technical corner indicators */}
      <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[#EEB149]" />
      <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-[#EEB149]" />
      <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-[#EEB149]" />
      <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-[#EEB149]" />

      <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#565A5C]/20">
        <div>
          <span className="text-[10px] text-[#EEB149] uppercase tracking-widest block mb-1">
            PARAMÈTRES TARIFAIRES & VISUELS
          </span>
          <h2 className="font-display text-xl font-bold text-[#FFFFFF] uppercase">
            {initialTitle}
          </h2>
          <span className="text-xs text-[#565A5C] block">
            Identifiant : {slug}
          </span>
        </div>

        <Link
          href="/admin/products"
          className="text-xs text-[#A5A5A0] hover:text-[#FFFFFF] flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour</span>
        </Link>
      </div>

      <form action={formAction} className="space-y-6">
        {state.success && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Configuration et tarifs enregistrés dans PostgreSQL avec succès.</span>
          </div>
        )}

        {state.error && (
          <div className="p-4 bg-red-950/40 border border-red-500/50 text-red-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Section Image de Couverture */}
        <div className="p-4 sm:p-5 bg-[#090909] border border-[#565A5C]/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#EEB149]" />
              <label className="text-xs font-semibold uppercase tracking-wider text-[#FFFFFF]">
                Image de Couverture du Manuel
              </label>
            </div>

            <Link
              href="/admin/media"
              target="_blank"
              className="text-[11px] text-[#EEB149] hover:text-[#FFFFFF] flex items-center gap-1 transition-colors"
            >
              <span>Médiathèque</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Miniature de prévisualisation */}
            <div className="relative w-28 h-36 bg-[#151515] border border-[#565A5C]/40 shrink-0 overflow-hidden flex items-center justify-center">
              {coverImage ? (
                <Image
                  src={coverImage}
                  alt={`Couverture ${initialTitle}`}
                  fill
                  sizes="112px"
                  className="object-cover"
                  unoptimized={coverImage.startsWith('/uploads/')}
                />
              ) : (
                <span className="text-[10px] text-[#565A5C] text-center p-2">Aucune image</span>
              )}
            </div>

            {/* Téléversement & URL */}
            <div className="flex-1 w-full space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={onFileChange}
                disabled={isUploading}
              />

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3.5 py-2 bg-[#151515] border border-[#EEB149]/60 hover:border-[#EEB149] text-xs text-[#EEB149] hover:text-[#FFFFFF] flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <UploadCloud className={`w-3.5 h-3.5 ${isUploading ? 'animate-bounce' : ''}`} />
                  <span>{isUploading ? 'Téléversement...' : 'Téléverser une image'}</span>
                </button>

                {coverImage !== initialCoverImage && (
                  <button
                    type="button"
                    onClick={() => setCoverImage(initialCoverImage)}
                    className="px-3 py-2 text-xs text-[#A5A5A0] hover:text-[#FFFFFF] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Rétablir l’original</span>
                  </button>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="coverImage"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://... ou /images/..."
                  className="w-full bg-[#151515] border border-[#565A5C]/40 px-3 py-2 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#EEB149] transition-colors"
                />
                <span className="text-[10px] text-[#565A5C] mt-1 block">
                  URL publique du fichier (automatiquement renseignée lors du téléversement).
                </span>
              </div>

              {uploadError && (
                <span className="text-[11px] text-red-400 block">{uploadError}</span>
              )}
            </div>
          </div>
        </div>

        {/* Prix de Base */}
        <div>
          <label
            htmlFor="priceXaf"
            className="block text-xs uppercase tracking-wider text-[#A5A5A0] mb-2"
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
              className="w-full bg-[#090909] border border-[#565A5C]/40 px-4 py-3 text-sm text-[#FFFFFF] focus:outline-none focus:border-[#EEB149] focus:ring-1 focus:ring-[#EEB149] transition-colors"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-xs text-[#565A5C]">
              FCFA
            </div>
          </div>
          <p className="text-[11px] text-[#565A5C] mt-1.5">
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
                className="text-xs font-semibold uppercase tracking-wider text-[#FFFFFF] cursor-pointer"
              >
                Activer la Promotion Exceptionnelle
              </label>
            </div>
            <p className="text-[11px] text-[#565A5C] mt-1">
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
            className="block text-xs uppercase tracking-wider text-[#EEB149]"
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
              className="w-full bg-[#090909] border border-[#EEB149]/50 px-4 py-3 text-sm text-[#FFFFFF] focus:outline-none focus:border-[#EEB149] focus:ring-1 focus:ring-[#EEB149] transition-colors disabled:border-[#565A5C]/30"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-xs text-[#EEB149]">
              FCFA PROMO
            </div>
          </div>
          {isOnSale && basePrice > 0 && salePrice < basePrice && (
            <p className="text-[11px] text-emerald-400 mt-1">
              Remise affichée au lecteur : -{Math.round(((basePrice - salePrice) / basePrice) * 100)}% (Économie : {basePrice - salePrice} FCFA)
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-[#565A5C]/20 flex items-center justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 text-xs uppercase text-[#A5A5A0] hover:text-[#FFFFFF] transition-colors"
          >
            Annuler
          </Link>

          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-3 bg-[#EEB149] hover:bg-[#EEB149]/90 disabled:opacity-50 text-[#090909] text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>{isPending ? 'Enregistrement...' : 'Enregistrer la configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
