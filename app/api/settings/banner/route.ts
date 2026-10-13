import { NextResponse } from 'next/server';
import { getGlobalSettings } from '@/lib/settings-actions';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getGlobalSettings();
    if (settings.announcementBannerActive && settings.announcementBannerText) {
      return NextResponse.json({
        active: true,
        text: settings.announcementBannerText,
        link: settings.announcementBannerLink,
      });
    }
    return NextResponse.json({ active: false });
  } catch {
    return NextResponse.json({ active: false });
  }
}
