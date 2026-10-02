'use client';

import React, { createContext, useContext, useState } from 'react';

const PreviewReaderContext = createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

export function PreviewReaderProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <PreviewReaderContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </PreviewReaderContext.Provider>
  );
}

export function usePreviewReader() {
  return useContext(PreviewReaderContext);
}
