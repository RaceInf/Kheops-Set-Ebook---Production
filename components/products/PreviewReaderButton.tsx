'use client';

import React from 'react';
import { Book, BookOpen } from 'lucide-react';
import { usePreviewReader } from './PreviewReaderProvider';

interface PreviewReaderButtonProps {
  pageCount: number;
}

export function PreviewReaderButton({ pageCount }: PreviewReaderButtonProps) {
  const { isOpen, setIsOpen } = usePreviewReader();
  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className="mt-6 w-full py-3 px-4 border border-[#EEB149]/60 bg-[#090909] text-center font-mono text-xs font-semibold text-[#EEB149] hover:bg-[#EEB149] hover:text-[#090909] transition-colors flex items-center justify-center gap-2 cursor-pointer"
    >
      {isOpen ? (
        <BookOpen className="w-4 h-4 text-[#EEB149]" aria-hidden="true" />
      ) : (
        <Book className="w-4 h-4 text-[#EEB149]" aria-hidden="true" />
      )}
      <span>{isOpen ? 'MASQUER L’APERÇU' : `FEUILLETER UN EXTRAIT (${pageCount} PAGES)`}</span>
    </button>
  );
}
