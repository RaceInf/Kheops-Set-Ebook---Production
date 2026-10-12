'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface LoginActionState {
  error?: string;
  success?: boolean;
}

export async function loginAdminAction(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const password = formData.get('password') as string;

  if (!password || typeof password !== 'string') {
    return { error: 'Mot de passe requis.' };
  }

  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword || expectedPassword.trim() === '') {
    return {
      error: 'Configuration serveur incomplète. Veuillez définir ADMIN_PASSWORD.',
    };
  }

  if (password !== expectedPassword) {
    return { error: 'Mot de passe incorrect.' };
  }

  const cookieStore = await cookies();
  cookieStore.set('kheops_admin_session', 'authenticated_admin', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect('/admin');
}

export async function logoutAdminAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('kheops_admin_session');
  redirect('/admin/login');
}
