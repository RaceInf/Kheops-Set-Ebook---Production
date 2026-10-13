'use client';

import React, { useState, useRef, useTransition } from 'react';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Filter,
  AlertCircle,
  FileCode,
  Sparkles,
} from 'lucide-react';
import Image from 'next/image';
import { uploadMediaAction, deleteMediaAction, type MediaItem } from '@/lib/media-actions';

interface MediaManagerProps {
  initialMedia: MediaItem[];
  isBlobConfigured: boolean;
}

export function MediaManager({ initialMedia, isBlobConfigured }: MediaManagerProps) {
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = async (url: string) => {
    try {
      const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2500);
    } catch {
      // Fallback
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2500);
    }
  };

  const handleFileProcess = async (file: File, category = 'general') => {
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    startTransition(async () => {
      const res = await uploadMediaAction(formData);
      if (res.success && res.url) {
        setUploadSuccess(`Fichier « ${res.name} » téléversé avec succès.`);
        setMediaList((prev) => [
          {
            id: `media-${Date.now()}`,
            name: res.name || file.name,
            url: res.url!,
            size: res.size || file.size,
            mimeType: res.mimeType || file.type,
            category,
            createdAt: new Date(),
          },
          ...prev,
        ]);
      } else {
        setUploadError(res.error || 'Erreur lors du téléversement.');
      }
    });
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileProcess(file);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileProcess(file);
    }
  };

  const handleDelete = async (id: string, url: string) => {
    if (!confirm('Supprimer définitivement ce fichier média ?')) return;

    startTransition(async () => {
      const res = await deleteMediaAction(id, url);
      if (res.success) {
        setMediaList((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert(res.error || 'Erreur lors de la suppression.');
      }
    });
  };

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;
  };

  const filteredMedia = mediaList.filter((m) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'covers') return m.category === 'covers' || m.name.toLowerCase().includes('couverture');
    if (selectedCategory === 'documents') return m.category === 'documents' || m.mimeType?.includes('pdf') || m.name.toLowerCase().includes('pdf');
    return m.category === selectedCategory;
  });

  return (
    <div className="space-y-8 font-mono">
      {/* Zone de Dropzone au design Kheops Set */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer bg-[#151515] ${
          isDragging
            ? 'border-[#EEB149] bg-[#EEB149]/10'
            : 'border-[#565A5C]/60 hover:border-[#EEB149] hover:bg-[#151515]/80'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,application/pdf"
          onChange={onFileChange}
          disabled={isPending}
        />

        {/* Technical Corner Markers */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#EEB149]" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#EEB149]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#EEB149]" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#EEB149]" />

        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 mx-auto bg-[#090909] border border-[#565A5C]/40 flex items-center justify-center text-[#EEB149] shadow-lg">
            <UploadCloud className={`w-6 h-6 ${isPending ? 'animate-bounce text-[#EEB149]' : ''}`} />
          </div>

          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-[#FFFFFF] block">
              {isPending
                ? 'Téléversement en cours vers le cloud...'
                : 'Glisse un fichier ici ou clique pour parcourir'}
            </span>
            <span className="text-xs text-[#A5A5A0] mt-1 block">
              Images de couverture (JPG, PNG, WebP) ou guides PDF (jusqu’à 30 Mo)
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#090909] border border-[#565A5C]/40 text-[11px] text-[#A5A5A0]">
            <Sparkles className="w-3 h-3 text-[#EEB149]" />
            <span>
              {isBlobConfigured
                ? 'Stockage actif : Vercel Blob Cloud'
                : 'Stockage local actif (BLOB_READ_WRITE_TOKEN en option)'}
            </span>
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="p-4 bg-red-950/40 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Barre de Filtres */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#565A5C]/30">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#EEB149]" />
          <span className="text-xs text-[#565A5C] uppercase tracking-wider">Filtrer :</span>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {[
              { id: 'all', label: 'Tous les fichiers' },
              { id: 'covers', label: 'Couvertures' },
              { id: 'documents', label: 'Documents PDF' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 text-[11px] uppercase tracking-wider border transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#EEB149] text-[#090909] border-[#EEB149] font-bold'
                    : 'bg-[#151515] text-[#A5A5A0] border-[#565A5C]/40 hover:text-[#FFFFFF]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-[#565A5C]">
          {filteredMedia.length} élément{filteredMedia.length > 1 ? 's' : ''} répertorié{filteredMedia.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Grille des Médias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedia.map((media) => {
          const isPdf = media.mimeType?.includes('pdf') || media.name.toLowerCase().endsWith('.pdf');
          const isImage = media.mimeType?.startsWith('image') || media.url.match(/\.(jpeg|jpg|png|webp|svg)$/i);
          const isCopied = copiedUrl === media.url;

          return (
            <div
              key={media.id}
              className="bg-[#151515] border border-[#565A5C]/40 overflow-hidden flex flex-col justify-between group hover:border-[#EEB149]/60 transition-all shadow-xl"
            >
              {/* Preview Area */}
              <div className="h-44 bg-[#090909] relative flex items-center justify-center border-b border-[#565A5C]/30 overflow-hidden">
                {isImage ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={media.url}
                      alt={media.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain p-2"
                      unoptimized={media.url.startsWith('/uploads/')}
                    />
                  </div>
                ) : isPdf ? (
                  <div className="flex flex-col items-center gap-2 text-red-400">
                    <FileText className="w-12 h-12" />
                    <span className="text-[10px] tracking-wider uppercase text-[#A5A5A0]">
                      Document PDF
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[#565A5C]">
                    <FileCode className="w-12 h-12" />
                    <span className="text-[10px] tracking-wider uppercase">Fichier</span>
                  </div>
                )}

                {/* Badge format */}
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-0.5 bg-[#090909]/80 border border-[#565A5C]/40 text-[9px] uppercase tracking-wider text-[#EEB149]">
                    {isPdf ? 'PDF' : isImage ? 'IMAGE' : 'ASSET'}
                  </span>
                </div>
              </div>

              {/* Info Area */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-xs font-bold text-[#FFFFFF] truncate" title={media.name}>
                    {media.name}
                  </h3>
                  <div className="flex items-center justify-between text-[10px] text-[#565A5C] mt-1">
                    <span>{formatFileSize(media.size)}</span>
                    <span className="truncate max-w-[140px] text-right">
                      {media.category || 'général'}
                    </span>
                  </div>
                </div>

                {/* URL Bar */}
                <div className="p-2 bg-[#090909] border border-[#565A5C]/30 flex items-center justify-between gap-2 text-[10px]">
                  <span className="truncate text-[#A5A5A0]" title={media.url}>
                    {media.url}
                  </span>

                  <button
                    onClick={() => handleCopy(media.url)}
                    className="p-1 text-[#EEB149] hover:text-[#FFFFFF] transition-colors shrink-0 cursor-pointer"
                    title="Copier l'URL"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-between text-xs">
                  <a
                    href={media.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A5A5A0] hover:text-[#FFFFFF] inline-flex items-center gap-1 text-[11px] transition-colors"
                  >
                    <span>Ouvrir</span>
                    <ExternalLink className="w-3 h-3 text-[#565A5C]" />
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(media.url)}
                      className={`px-2.5 py-1 text-[10px] uppercase tracking-wider border transition-colors cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-[#EEB149] text-[#090909] border-[#EEB149] font-bold hover:bg-[#EEB149]/90'
                      }`}
                    >
                      {isCopied ? 'URL Copiée !' : 'Copier l’URL'}
                    </button>

                    {!media.id.startsWith('default-') && (
                      <button
                        onClick={() => handleDelete(media.id, media.url)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
