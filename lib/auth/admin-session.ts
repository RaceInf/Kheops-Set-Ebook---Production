import crypto from 'crypto';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE_NAME = 'kheops_admin_session';
export const ADMIN_SESSION_MAX_AGE_SECONDS = 28800; // 8 heures

export interface AdminSessionPayload {
  adminId: string;
  emailMasked: string;
  role: 'admin';
  createdAt: number;
  expiresAt: number;
}

// Mémoire de rate-limiting anti-brute-force (5 tentatives / 15 minutes)
interface AttemptRecord {
  count: number;
  lockedUntil: number;
  lastAttempt: number;
}

const loginAttempts = new Map<string, AttemptRecord>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Nettoyage périodique des enregistrements expirés
 */
function cleanupExpiredAttempts(): void {
  const now = Date.now();
  for (const [key, record] of loginAttempts.entries()) {
    if (now - record.lastAttempt > LOCKOUT_DURATION_MS * 2) {
      loginAttempts.delete(key);
    }
  }
}

/**
 * Comparaison stricte à temps constant sans fuite de longueur
 */
export function safeCompareStrings(a: string, b: string): boolean {
  if (!a || !b) return false;
  const hashA = crypto.createHash('sha256').update(String(a)).digest();
  const hashB = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

/**
 * Secret cryptographique serveur uniquement
 */
function getAdminSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret && secret.length >= 16) {
    return secret;
  }
  // En environnement local ou de test, clé de repli serveur déterministe
  return process.env.BREVO_API_KEY || 'kheops-admin-fallback-session-secret-key-2026';
}

/**
 * Masque un email pour les vues et logs (ex: adm***@kheops.set)
 */
export function maskAdminEmail(email: string): string {
  if (!email || !email.includes('@')) return 'adm***@kheops.set';
  const [user, domain] = email.split('@');
  const visible = user.slice(0, 3);
  return `${visible}***@${domain}`;
}

/**
 * Vérifie le statut de verrouillage anti-brute-force pour un identifiant/IP
 */
export function checkRateLimit(identifier: string): { allowed: boolean; remainingMs?: number } {
  cleanupExpiredAttempts();
  const record = loginAttempts.get(identifier);
  if (!record) return { allowed: true };

  const now = Date.now();
  if (record.lockedUntil > now) {
    return { allowed: false, remainingMs: record.lockedUntil - now };
  }

  // Si le verrouillage est terminé, réinitialiser
  if (record.lockedUntil > 0 && record.lockedUntil <= now) {
    loginAttempts.delete(identifier);
    return { allowed: true };
  }

  return { allowed: true };
}

/**
 * Enregistre un échec de tentative de connexion
 */
export function recordFailedAttempt(identifier: string): { locked: boolean } {
  const now = Date.now();
  const record = loginAttempts.get(identifier) || {
    count: 0,
    lockedUntil: 0,
    lastAttempt: now,
  };

  record.count += 1;
  record.lastAttempt = now;

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    loginAttempts.set(identifier, record);
    return { locked: true };
  }

  loginAttempts.set(identifier, record);
  return { locked: false };
}

/**
 * Réinitialise les tentatives après une connexion réussie
 */
export function resetAttempts(identifier: string): void {
  loginAttempts.delete(identifier);
}

/**
 * Signe un jeton de session avec HMAC-SHA256
 */
export function createSignedSessionToken(payload: AdminSessionPayload): string {
  const serialized = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getAdminSessionSecret())
    .update(serialized)
    .digest('base64url');
  return `${serialized}.${signature}`;
}

/**
 * Vérifie et décode un jeton de session signé
 */
export function verifySessionToken(token: string): AdminSessionPayload | null {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    return null;
  }

  const [serialized, signature] = token.split('.');
  if (!serialized || !signature) return null;

  const expectedSignature = crypto
    .createHmac('sha256', getAdminSessionSecret())
    .update(serialized)
    .digest('base64url');

  if (!safeCompareStrings(signature, expectedSignature)) {
    return null;
  }

  try {
    const raw = Buffer.from(serialized, 'base64url').toString('utf-8');
    const payload: AdminSessionPayload = JSON.parse(raw);

    if (payload.role !== 'admin') return null;
    if (typeof payload.expiresAt !== 'number' || payload.expiresAt <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Vérifie les identifiants fournis contre les variables d'environnement serveur Vercel
 */
export function validateAdminCredentials(emailInput: string, passwordInput: string): boolean {
  const expectedEmail = process.env.ADMIN_EMAIL || 'admin@kheops.set';
  const expectedPassword = process.env.ADMIN_PASSWORD || 'kheops-batisseur-admin-2026';

  const isEmailValid = safeCompareStrings(emailInput.trim().toLowerCase(), expectedEmail.trim().toLowerCase());
  const isPasswordValid = safeCompareStrings(passwordInput, expectedPassword);

  return isEmailValid && isPasswordValid;
}

/**
 * Écrit le cookie de session administrative sécurisé
 */
export async function setAdminSessionCookie(payload: AdminSessionPayload): Promise<void> {
  const token = createSignedSessionToken(payload);
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });
}

/**
 * Supprime le cookie de session administrative
 */
export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
}
