'use client';

import React from 'react';
import { useCheckoutModal } from '@/context/checkout-modal-context';

interface ChariowBuyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  ctaName?: 'capital_checkout' | 'code_checkout';
  ctaLocation?: 'home' | 'catalogue' | 'product_page' | string;
  productSlug?: 'le-capital-du-batisseur' | 'le-code-du-batisseur' | string;
  children: React.ReactNode;
}

export function ChariowBuyButton({
  href,
  ctaName = 'capital_checkout',
  ctaLocation = 'product_page',
  productSlug,
  children,
  onClick,
  type = 'button',
  className = '',
  ...props
}: ChariowBuyButtonProps) {
  const { openCheckout } = useCheckoutModal();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

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
    <button
      type={type}
      onClick={handleClick}
      className={className}
      data-fallback-url={href}
      {...props}
    >
      {children}
    </button>
  );
}
