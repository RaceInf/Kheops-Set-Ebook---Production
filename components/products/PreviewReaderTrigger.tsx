'use client';

import React, { useState } from 'react';
import { BookPreviewReader } from '@/components/products/BookPreviewReader';
import type { Product } from '@/lib/products';

interface PreviewReaderTriggerProps {
  product: Product;
}

export function PreviewReaderTrigger({ product }: PreviewReaderTriggerProps) {
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  if (isReaderOpen) {
    return (
      <div className="py-12 border-b border-[#565A5C]/35">
        <BookPreviewReader product={product} id="apercu-liseuse" onClose={() => setIsReaderOpen(false)} />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsReaderOpen(true)}
      className="mt-6 w-full py-3 px-4 border border-[#EEB149]/60 bg-[#090909] text-center font-mono text-xs font-semibold text-[#EEB149] hover:bg-[#EEB149] hover:text-[#090909] transition-colors"
    >
      FEUILLETER UN EXTRAIT ({product.previewPages?.length || 0} PAGES)
    </button>
  );
}
