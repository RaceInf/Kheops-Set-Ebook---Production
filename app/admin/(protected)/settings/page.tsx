import React from 'react';
import { requireAdminSession } from '@/lib/auth/admin-guard';
import { getAdminSettings } from '@/lib/admin/db';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { SettingsManagementClient } from '@/components/admin/SettingsManagementClient';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const session = await requireAdminSession();
  const settings = await getAdminSettings();

  return (
    <>
      <AdminHeader
        emailMasked={session.emailMasked}
        title="Paramètres Généraux"
        subtitle="Activation des intégrations, tracking et options du site"
      />

      <main className="p-6 sm:p-8 space-y-6">
        <SettingsManagementClient initialSettings={settings} />
      </main>
    </>
  );
}
