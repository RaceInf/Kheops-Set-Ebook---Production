import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  label?: string;
}

function BaseIcon({ children, label, className = 'w-5 h-5', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={className}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      {...props}
    >
      {children}
    </svg>
  );
}

/** 1. COUPE — Lame / Ciseau de coupe nette */
export function IconCut({ className, label, ...props }: IconProps) {
  return (
    <BaseIcon className={className} label={label} {...props}>
      <path d="M4 12H20" />
      <path d="M14 6L20 12L14 18" />
      <path d="M4 6V18" strokeDasharray="2 2" />
    </BaseIcon>
  );
}

/** 2. PROTÈGE — Mur / Bouclier architectural & Cadenas */
export function IconProtect({ className, label, ...props }: IconProps) {
  return (
    <BaseIcon className={className} label={label} {...props}>
      <rect x="4" y="10" width="16" height="10" />
      <path d="M8 10V6H16V10" />
      <path d="M12 14V16" />
    </BaseIcon>
  );
}

/** 3. CONSTRUIS — Briques d'assise & Fondation */
export function IconConstruct({ className, label, ...props }: IconProps) {
  return (
    <BaseIcon className={className} label={label} {...props}>
      <rect x="3" y="14" width="18" height="6" />
      <rect x="3" y="8" width="9" height="6" />
      <rect x="12" y="8" width="9" height="6" />
      <rect x="7.5" y="3" width="9" height="5" />
    </BaseIcon>
  );
}

/** 4. RÉPÈTE — Cadence / Sablier de structure */
export function IconRepeat({ className, label, ...props }: IconProps) {
  return (
    <BaseIcon className={className} label={label} {...props}>
      <path d="M5 4H19" />
      <path d="M5 20H19" />
      <path d="M7 4L17 20" />
      <path d="M17 4L7 20" />
      <path d="M9 17H15" />
    </BaseIcon>
  );
}

/** Plan technique / Équerre & Compas */
export function IconBlueprint({ className, label, ...props }: IconProps) {
  return (
    <BaseIcon className={className} label={label} {...props}>
      <path d="M3 21V3H21L3 21Z" />
      <path d="M7 17V11H13" />
      <path d="M3 7H5" />
      <path d="M3 11H5" />
      <path d="M3 15H5" />
    </BaseIcon>
  );
}

/** Règle de mesure */
export function IconRuler({ className, label, ...props }: IconProps) {
  return (
    <BaseIcon className={className} label={label} {...props}>
      <rect x="2" y="8" width="20" height="8" />
      <path d="M6 8V12" />
      <path d="M10 8V11" />
      <path d="M14 8V12" />
      <path d="M18 8V11" />
    </BaseIcon>
  );
}

/** Document PDF technique */
export function IconPdf({ className, label, ...props }: IconProps) {
  return (
    <BaseIcon className={className} label={label} {...props}>
      <path d="M6 3H15L19 7V21H6V3Z" />
      <path d="M14 3V8H19" />
      <path d="M9 13H16" />
      <path d="M9 17H13" />
    </BaseIcon>
  );
}

/** Check sobre angulaire */
export function IconCheck({ className, label, ...props }: IconProps) {
  return (
    <BaseIcon className={className} label={label} {...props}>
      <path d="M4 12.5L9.5 18L20 6" />
    </BaseIcon>
  );
}

/** Flèche directionnelle haut-droite */
export function IconArrowUpRight({ className, label, ...props }: IconProps) {
  return (
    <BaseIcon className={className} label={label} {...props}>
      <path d="M7 17L17 7" />
      <path d="M8 7H17V16" />
    </BaseIcon>
  );
}

/** Repère technique (+) */
export function IconCrosshair({ className, label, ...props }: IconProps) {
  return (
    <BaseIcon className={className} label={label} {...props}>
      <path d="M12 5V19" />
      <path d="M5 12H19" />
    </BaseIcon>
  );
}

/** Icône SVG Facebook */
export function IconFacebook({ className, label, ...props }: IconProps) {
  return (
    <BaseIcon className={className} label={label} {...props}>
      <path d="M17 3H14C11.7909 3 10 4.79086 10 7V10H7V14H10V21H14V14H17L18 10H14V7C14 6.44772 14.4477 6 15 6H17V3Z" />
    </BaseIcon>
  );
}

/** Icône SVG Instagram */
export function IconInstagram({ className, label, ...props }: IconProps) {
  return (
    <BaseIcon className={className} label={label} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" />
    </BaseIcon>
  );
}

/** Icône SVG WhatsApp */
export function IconWhatsApp({ className, label, ...props }: IconProps) {
  return (
    <BaseIcon className={className} label={label} {...props}>
      <path d="M3 21L4.65 17.2C3.58 15.66 3 13.84 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12C21 16.97 16.97 21 12 21C10.16 21 8.34 20.42 6.8 19.35L3 21Z" />
      <path d="M9.5 8.5C9.2 8.5 8.5 9 8.5 10.2C8.5 11.7 10.1 13.6 11.4 14.4C12.7 15.2 14.2 15.5 15 15C15.5 14.7 15.8 14 15.5 13.6L14 12.8L13.1 13.5C12.2 13.1 11.1 12.1 10.7 11.1L11.4 10.2L10.6 8.7C10.4 8.5 9.8 8.5 9.5 8.5Z" />
    </BaseIcon>
  );
}

export const KHEOPS_SOCIAL_LINKS = [
  {
    name:'Facebook',
    label: 'Page Facebook Kheops Set',
    handle: 'facebook.com/kheops.set',
    href: 'https://www.facebook.com/kheops.set/',
    Icon: IconFacebook,
  },
  {
    name: 'Instagram',
    label: 'Page Instagram Kheops Set',
    handle: '@kheopset.motivation',
    href: 'https://www.instagram.com/kheopset.motivation/',
    Icon: IconInstagram,
  },
  {
    name: 'Groupe WhatsApp',
    label: 'Groupe WhatsApp Kheops Set',
    handle: 'Canal / Groupe WhatsApp',
    href: 'https://chat.whatsapp.com/JM5y9X4rV3lEmds6fVr5vz',
    Icon: IconWhatsApp,
  },
] as const;
