'use server';

import { put, del, list } from '@vercel/blob';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

export interface UploadMediaResult {
  success: boolean;
  url?: string;
  name?: string;
  size?: number;
  mimeType?: string;
  error?: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  pathname?: string | null;
  size?: number | null;
  mimeType?: string | null;
  category?: string | null;
  createdAt: Date;
}

/**
 * Uploade un fichier vers Vercel Blob Storage (ou stockage public local en secours)
 */
export async function uploadMediaAction(formData: FormData): Promise<UploadMediaResult> {
  const file = formData.get('file') as File | null;
  const category = (formData.get('category') as string) || 'general';

  if (!file || !(file instanceof File) || file.size === 0) {
    return { success: false, error: 'Aucun fichier sélectionné ou fichier vide.' };
  }

  // Limite de taille : 50 Mo
  const MAX_SIZE = 50 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { success: false, error: 'Le fichier dépasse la limite autorisée de 50 Mo.' };
  }

  // Nettoyage du nom de fichier
  const extension = path.extname(file.name) || '';
  const baseName = path.basename(file.name, extension).replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeFilename = `${Date.now()}-${baseName}${extension}`;

  let finalUrl = '';
  let finalPathname = safeFilename;

  try {
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    if (blobToken && blobToken.trim() !== '') {
      // 1. Upload officiel vers Vercel Blob Storage
      const blob = await put(safeFilename, file, {
        access: 'public',
        token: blobToken,
      });
      finalUrl = blob.url;
      finalPathname = blob.pathname;
    } else {
      // 2. Fallback local dans public/uploads pour environnement de développement
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });

      const buffer = Buffer.from(await file.arrayBuffer());
      const localFilePath = path.join(uploadsDir, safeFilename);
      await fs.writeFile(localFilePath, buffer);

      finalUrl = `/uploads/${safeFilename}`;
      finalPathname = safeFilename;
    }

    // 3. Sauvegarde dans Prisma
    try {
      await prisma.media.create({
        data: {
          name: file.name,
          url: finalUrl,
          pathname: finalPathname,
          size: file.size,
          mimeType: file.type || 'application/octet-stream',
          category,
        },
      });
    } catch (dbErr) {
      console.warn('[Prisma Media save warning]:', dbErr);
    }

    revalidatePath('/admin/media');
    revalidatePath('/admin/products');

    return {
      success: true,
      url: finalUrl,
      name: file.name,
      size: file.size,
      mimeType: file.type,
    };
  } catch (error) {
    console.error('[Upload Media Error]:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors du téléversement du fichier.',
    };
  }
}

/**
 * Récupère tous les médias enregistrés, synchronise Vercel Blob si configuré, et fusionne avec les assets système
 */
export async function getMediaListAction(): Promise<MediaItem[]> {
  const defaultAssets: MediaItem[] = [
    {
      id: 'default-capital-cover',
      name: 'Couverture — Le Capital du Bâtisseur (Officielle)',
      url: '/images/monolith-gold-fissure.jpg',
      size: 420000,
      mimeType: 'image/jpeg',
      category: 'covers',
      createdAt: new Date('2026-01-01'),
    },
    {
      id: 'default-code-cover',
      name: 'Couverture — Le Code du Bâtisseur (Officielle)',
      url: '/images/code-du-batisseur-cover.jpg',
      size: 480000,
      mimeType: 'image/jpeg',
      category: 'covers',
      createdAt: new Date('2026-01-01'),
    },
    {
      id: 'default-protocol-cover',
      name: 'Couverture — Le Protocole d’Isolation (Guide Gratuit)',
      url: '/images/protocole-isolation-cover.jpg',
      size: 380000,
      mimeType: 'image/jpeg',
      category: 'covers',
      createdAt: new Date('2026-01-01'),
    },
    {
      id: 'default-protocol-pdf',
      name: 'Document PDF — Le Protocole du Bâtisseur (6 pages)',
      url: 'https://drive.google.com/uc?export=download&id=1EZoPGy-w4Vh9LQSFsG2LChd1r9QMUN3-',
      size: 1540000,
      mimeType: 'application/pdf',
      category: 'documents',
      createdAt: new Date('2026-01-01'),
    },
  ];

  try {
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    // Si Vercel Blob est configuré, récupérer les blobs réels pour synchroniser
    if (blobToken && blobToken.trim() !== '') {
      try {
        const { blobs } = await list({ token: blobToken });
        for (const blob of blobs) {
          // Vérifier si le blob existe déjà en base Prisma
          const existing = await prisma.media.findFirst({
            where: { url: blob.url },
          });
          if (!existing) {
            await prisma.media.create({
              data: {
                name: blob.pathname.split('/').pop() || 'Fichier Vercel Blob',
                url: blob.url,
                pathname: blob.pathname,
                size: blob.size,
                mimeType: blob.pathname.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
                category: blob.pathname.endsWith('.pdf') ? 'documents' : 'covers',
                createdAt: new Date(blob.uploadedAt),
              },
            }).catch(() => {});
          }
        }
      } catch (blobErr) {
        console.warn('[Vercel Blob sync warning]:', blobErr);
      }
    }

    const dbMedia = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (dbMedia.length === 0) {
      return defaultAssets;
    }

    // Fusionner en évitant les doublons d'URL
    const dbUrls = new Set(dbMedia.map((m) => m.url));
    const unlistedDefaults = defaultAssets.filter((d) => !dbUrls.has(d.url));

    return [...dbMedia, ...unlistedDefaults];
  } catch {
    return defaultAssets;
  }
}

/**
 * Supprime un fichier média
 */
export async function deleteMediaAction(id: string, url: string): Promise<{ success: boolean; error?: string }> {
  try {
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    // Suppression Vercel Blob
    if (url.includes('vercel-storage.com') && blobToken) {
      try {
        await del(url, { token: blobToken });
      } catch (e) {
        console.warn('[Vercel Blob del warning]:', e);
      }
    } else if (url.startsWith('/uploads/')) {
      // Suppression fichier local
      try {
        const localPath = path.join(process.cwd(), 'public', url);
        await fs.unlink(localPath);
      } catch (e) {
        console.warn('[Local file unlink warning]:', e);
      }
    }

    // Suppression DB
    try {
      await prisma.media.delete({
        where: { id },
      });
    } catch {
      // Si c'est un asset système sans ID Prisma, ignorer
    }

    revalidatePath('/admin/media');
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Erreur de suppression.',
    };
  }
}
