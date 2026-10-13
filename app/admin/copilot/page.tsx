import React from 'react';
import type { Metadata } from 'next';
import { CopilotChat } from './CopilotChat';

export const metadata: Metadata = {
  title: 'Copilote Data Analyst | Kheops Set Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-dynamic';

export default function AdminCopilotPage() {
  return (
    <div className="space-y-4">
      <CopilotChat />
    </div>
  );
}
