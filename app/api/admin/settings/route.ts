import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/admin-guard';
import { getAdminSettings, updateAdminSettings } from '@/lib/admin/db';

export async function GET() {
  await requireAdminSession();
  const settings = await getAdminSettings();
  return NextResponse.json({ settings });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  const body = await req.json().catch(() => ({}));

  const {
    widget_snap_enabled,
    fallback_link_enabled,
    eur_usd_display_enabled,
    ga4_tracking_enabled,
    brevo_notifications_enabled,
  } = body;

  const updated = await updateAdminSettings(
    {
      widget_snap_enabled: typeof widget_snap_enabled === 'boolean' ? widget_snap_enabled : undefined,
      fallback_link_enabled: typeof fallback_link_enabled === 'boolean' ? fallback_link_enabled : undefined,
      eur_usd_display_enabled: typeof eur_usd_display_enabled === 'boolean' ? eur_usd_display_enabled : undefined,
      ga4_tracking_enabled: typeof ga4_tracking_enabled === 'boolean' ? ga4_tracking_enabled : undefined,
      brevo_notifications_enabled: typeof brevo_notifications_enabled === 'boolean' ? brevo_notifications_enabled : undefined,
    },
    session.emailMasked
  );

  return NextResponse.json({ success: true, settings: updated });
}
