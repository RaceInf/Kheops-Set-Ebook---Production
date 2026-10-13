import React from 'react';
import { getMediaListAction } from '@/lib/media-actions';
import { MediaManager } from './media-manager';
import { FolderOpen, Cloud, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminMediaPage() {
  const mediaList = await getMediaListAction();
  const isBlobConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN && process.env.BLOB_READ_WRITE_TOKEN.trim() !== '');

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#565A5C]/30">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-semibold text-[#EEB149] uppercase tracking-widest flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5" />
              MÉDIATHÈQUE DU CHANTIER
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFFFF] uppercase">
            GESTIONNAIRE DE FICHIERS & CLOUD
          </h1>
          <p className="text-xs font-mono text-[#A5A5A0] mt-1">
            Téléversement et hébergement des couvertures officielles, bannières et documents PDF.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-[#151515] border border-[#565A5C]/40 text-xs font-mono flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isBlobConfigured ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="text-[#F3F1EB]">
              {isBlobConfigured ? 'Vercel Blob : Connecté' : 'Stockage Local Actif (Option Vercel Blob)'}
            </span>
          </div>
        </div>
      </div>

      <MediaManager initialMedia={mediaList} isBlobConfigured={isBlobConfigured} />
    </div>
  );
}
