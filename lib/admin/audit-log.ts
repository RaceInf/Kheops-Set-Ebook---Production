import crypto from 'crypto';
import type { AdminAuditLog } from '@/lib/admin/types';

// Mémoire tampon serveur pour les logs d'audit V1
const inMemoryAuditLogs: AdminAuditLog[] = [
  {
    id: 'log_init_01',
    admin_identifier_masked: 'adm***@kheops.set',
    action: 'system_initialize',
    entity: 'system',
    entity_id: null,
    summary: 'Initialisation sécurisée du Dashboard Admin Privé V1',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

export async function recordAuditLog(
  action: string,
  entity: string,
  summary: string,
  entityId: string | null = null,
  adminMasked: string = 'adm***@kheops.set'
): Promise<AdminAuditLog> {
  const entry: AdminAuditLog = {
    id: `log_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    admin_identifier_masked: adminMasked,
    action,
    entity,
    entity_id: entityId,
    summary,
    created_at: new Date().toISOString(),
  };

  inMemoryAuditLogs.unshift(entry);

  // Conserver au maximum les 100 derniers logs en mémoire
  if (inMemoryAuditLogs.length > 100) {
    inMemoryAuditLogs.length = 100;
  }

  return entry;
}

export async function getAuditLogsList(limit: number = 30): Promise<AdminAuditLog[]> {
  return inMemoryAuditLogs.slice(0, limit);
}
