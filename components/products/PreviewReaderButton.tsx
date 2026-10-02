'use client';

import React from 'react';
import { usePreviewReader } from './PreviewReaderProvider';

interface PreviewReaderButtonProps {
  pageCount: number;
}

export function PreviewReaderButton({ pageCount }: PreviewReaderButtonProps) {
  const { setIsOpen } = usePreviewReader();
  return (
    <button
      type="button"
      onClick={() => setIsOpen(true)}
      className="mt-6 w-full py-3 px-4 border border-[#EEB149]/60 bg-[#090909] text-center font-mono text-xs font-semibold text-[#EEB149] hover:bg-[#EEB149] hover:text-[#090909] transition-colors"
    >
      FEUILLETER UN EXTRAIT ({pageCount} PAGES)
    </button>
  );
}
