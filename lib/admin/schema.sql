-- ==============================================================================
-- SCHÉMA POSTGRESQL / SUPABASE — DASHBOARD ADMIN KHEOPS SET (VERSION 1)
-- ==============================================================================

-- 1. Paramètres globaux du site
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Produits et visibilité
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  price_xaf INTEGER NOT NULL CHECK (price_xaf > 0),
  cta_label TEXT NOT NULL DEFAULT 'PROFITER DE L’OFFRE',
  chariow_url TEXT NOT NULL,
  chariow_product_id TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_published_chariow BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Journal des flux Webhooks Chariow (Lecture seule assainie)
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  http_status INTEGER NOT NULL,
  processing_status TEXT NOT NULL CHECK (processing_status IN ('success', 'failed')),
  error_message TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Journal d'Audit d'activité immuable (Traçabilité)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_identifier_masked TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  summary TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Activation systématique de Row Level Security (RLS) sur toutes les tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Le rôle public anonyme ('anon') est formellement bloqué en lecture et écriture
DROP POLICY IF EXISTS deny_anon_site_settings ON site_settings;
CREATE POLICY deny_anon_site_settings ON site_settings FOR ALL TO anon USING (false);

DROP POLICY IF EXISTS deny_anon_products ON products;
CREATE POLICY deny_anon_products ON products FOR ALL TO anon USING (false);

DROP POLICY IF EXISTS deny_anon_webhook_events ON webhook_events;
CREATE POLICY deny_anon_webhook_events ON webhook_events FOR ALL TO anon USING (false);

DROP POLICY IF EXISTS deny_anon_audit_logs ON audit_logs;
CREATE POLICY deny_anon_audit_logs ON audit_logs FOR ALL TO anon USING (false);

-- 2. Le rôle 'authenticated' visiteur n'accède à rien d'administratif directement
DROP POLICY IF EXISTS deny_auth_site_settings ON site_settings;
CREATE POLICY deny_auth_site_settings ON site_settings FOR ALL TO authenticated USING (false);

DROP POLICY IF EXISTS deny_auth_products ON products;
CREATE POLICY deny_auth_products ON products FOR ALL TO authenticated USING (false);

DROP POLICY IF EXISTS deny_auth_webhook_events ON webhook_events;
CREATE POLICY deny_auth_webhook_events ON webhook_events FOR ALL TO authenticated USING (false);

DROP POLICY IF EXISTS deny_auth_audit_logs ON audit_logs;
CREATE POLICY deny_auth_audit_logs ON audit_logs FOR ALL TO authenticated USING (false);

-- 3. Seul le backend serveur Next.js exécuté avec la clé de service (service_role)
-- ou après validation de session serveur peut lire et écrire.
