import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  ADMIN_COOKIE_NAME,
  verifySessionToken,
  type AdminSessionPayload,
} from '@/lib/auth/admin-session';

/**
 * Garde serveur d'authentification pour le dashboard admin.
 * Doit être appelé en tête de chaque Server Component, Server Action
 * et Route Handler API sous /admin et /api/admin.
 */
export async function requireAdminSession(): Promise<AdminSessionPayload> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    redirect('/admin/login');
  }

  const session = verifySessionToken(sessionCookie.value);

  if (!session) {
    redirect('/admin/login');
  }

  if (session.role !== 'admin') {
    redirect('/admin/unauthorized');
  }

  return session;
}

/**
 * Vérification non-bloquante pour la pré-validation (ex: route de statut de session)
 */
export async function getOptionalAdminSession(): Promise<AdminSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) return null;
    return verifySessionToken(sessionCookie.value);
  } catch {
    return null;
  }
}
