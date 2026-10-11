import { NextResponse } from 'next/server';
import { clearAdminSessionCookie } from '@/lib/auth/admin-session';
import { recordAuditLog } from '@/lib/admin/audit-log';
import { getOptionalAdminSession } from '@/lib/auth/admin-guard';

export async function POST() {
  const session = await getOptionalAdminSession();
  const maskedEmail = session?.emailMasked || 'adm***@kheops.set';

  await clearAdminSessionCookie();

  await recordAuditLog(
    'admin_logout',
    'auth',
    'Déconnexion administrateur effectuée',
    'session_admin',
    maskedEmail
  );

  return NextResponse.json({
    success: true,
    message: 'Déconnexion effectuée',
  });
}
