import { NextRequest, NextResponse } from 'next/server';
import {
  checkRateLimit,
  recordFailedAttempt,
  resetAttempts,
  validateAdminCredentials,
  setAdminSessionCookie,
  maskAdminEmail,
  ADMIN_SESSION_MAX_AGE_SECONDS,
} from '@/lib/auth/admin-session';
import { recordAuditLog } from '@/lib/admin/audit-log';

export async function POST(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : 'local_client';

    // 1. Protection anti-brute-force (5 tentatives / 15 minutes)
    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Trop de tentatives infructueuses. Accès temporairement verrouillé pour 15 minutes.' },
        {
          status: 429,
          headers: {
            'X-Robots-Tag': 'noindex, nofollow, noarchive',
          },
        }
      );
    }

    const body = await req.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      recordFailedAttempt(clientIp);
      return NextResponse.json(
        { error: 'Identifiants invalides.' },
        { status: 401 }
      );
    }

    // 2. Vérification cryptographique à temps constant
    const isValid = validateAdminCredentials(email, password);

    if (!isValid) {
      const lockResult = recordFailedAttempt(clientIp);
      const errorMessage = lockResult.locked
        ? 'Compte temporairement verrouillé suite à 5 tentatives infructueuses.'
        : 'Identifiants invalides.';

      return NextResponse.json(
        { error: errorMessage },
        { status: 401 }
      );
    }

    // 3. Réinitialiser le compteur de tentatives en cas de succès
    resetAttempts(clientIp);

    const maskedEmail = maskAdminEmail(email);
    const now = Date.now();

    // 4. Écrire le cookie de session chiffré et signé
    await setAdminSessionCookie({
      adminId: 'admin_primary',
      emailMasked: maskedEmail,
      role: 'admin',
      createdAt: now,
      expiresAt: now + ADMIN_SESSION_MAX_AGE_SECONDS * 1000,
    });

    // 5. Tracer la connexion dans l'audit log
    await recordAuditLog(
      'admin_login',
      'auth',
      'Connexion administrateur réussie',
      'session_admin',
      maskedEmail
    );

    return NextResponse.json({
      success: true,
      message: 'Authentification réussie',
    });
  } catch (error) {
    console.error('[Admin Auth] Error:', error);
    return NextResponse.json(
      { error: 'Une erreur technique est survenue.' },
      { status: 500 }
    );
  }
}
