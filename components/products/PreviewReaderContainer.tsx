'use client';

import React from 'react';
import { usePreviewReader } from './PreviewReaderProvider';
import { BookPreviewReader } from './BookPreviewReader';
import type { Product } from '@/lib/products';

interface PreviewReaderContainerProps {
  product: Product;
}

export function PreviewReaderContainer({ product }: PreviewReaderContainerProps) {
  const { isOpen, setIsOpen } = usePreviewReader();
  if (!isOpen) return null;
  return (
    <div className="py-12 border-b border-[#565A5C]/35">
      <BookPreviewReader product={product} id="apercu-liseuse" onClose={() => setIsOpen(false)} />
    </div>
  );
}
