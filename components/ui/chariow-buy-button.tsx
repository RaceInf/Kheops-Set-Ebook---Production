'use client';

import React from 'react';
import { useCheckoutModal } from '@/context/checkout-modal-context';

interface ChariowBuyButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  ctaName: 'capital_checkout' | 'code_checkout';
  ctaLocation: 'home' | 'catalogue' | 'product_page' | string;
  productSlug?: 'le-capital-du-batisseur' | 'le-code-du-batisseur' | string;
  children: React.ReactNode;
}

export function ChariowBuyButton({
  href,
  ctaName,
  ctaLocation,
  productSlug,
  children,
  onClick,
  ...props
}: ChariowBuyButtonProps) {
  const { openCheckout } = useCheckoutModal();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const resolvedSlug =
      productSlug ||
      (ctaName === 'code_checkout' ? 'le-code-du-batisseur' : 'le-capital-du-batisseur');

    openCheckout({
      slug: resolvedSlug,
      location: ctaLocation,
      triggerElement: e.currentTarget,
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
