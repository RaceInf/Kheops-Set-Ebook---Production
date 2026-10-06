'use client';

import React from 'react';
import { trackCtaClick } from '@/lib/analytics';

interface ChariowBuyButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  ctaName: 'capital_checkout' | 'code_checkout';
  ctaLocation: 'home' | 'catalogue' | 'product_page' | string;
  children: React.ReactNode;
}

export function ChariowBuyButton({
  href,
  ctaName,
  ctaLocation,
  children,
  onClick,
  ...props
}: ChariowBuyButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackCtaClick({
      cta_name: ctaName,
      cta_location: ctaLocation,
      link_url: href,
    });
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
}
