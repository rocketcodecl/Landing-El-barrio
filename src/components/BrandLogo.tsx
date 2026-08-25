import React from 'react';
import { useSiteContent } from '../context/SiteContentContext';

interface BrandProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'iso' | 'wordmark';
  light?: boolean;
}

/**
 * Isotipo El Barrio — Dibujo original a mano alzada
 * (La 'b' con puerta interior, 3 rayos y base curva) o imagen personalizada
 */
export function BrandIsotype({
  className = '',
  size = 'md',
  light = false,
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  light?: boolean;
}) {
  let contentBranding: any = null;
  try {
    const ctx = useSiteContent();
    contentBranding = ctx.content?.branding;
  } catch (e) {
    // context optional
  }

  const sizeMap = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20',
  };

  const customIso = contentBranding?.customIsotypeUrl;
  if (customIso) {
    return (
      <img
        src={customIso}
        alt="Isotipo Personalizado"
        className={`${sizeMap[size]} w-auto object-contain shrink-0 ${className}`}
        referrerPolicy="no-referrer"
      />
    );
  }

  const color = light ? '#FFFFFF' : (contentBranding?.primaryColor || '#00C888');

  return (
    <svg
      viewBox="0 0 130 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeMap[size]} w-auto shrink-0 ${className}`}
      aria-label="Isotipo El Barrio"
    >
      {/* Bucle principal a mano 'b' */}
      <path
        d="M 44 104 C 26 94 20 66 28 44 C 36 22 56 14 74 20 C 92 26 98 50 96 74 C 94 96 80 110 56 110 C 40 110 32 98 30 84 C 28 68 38 46 48 26 C 52 18 56 12 58 12"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Puertita interior */}
      <path
        d="M 52 108 C 52 88 64 84 70 84 C 76 84 84 88 84 108"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Picaporte */}
      <circle cx="68" cy="98" r="2.5" fill={color} />

      {/* 3 Rayos superiores */}
      <path d="M 84 26 L 102 18" stroke={color} strokeWidth="6" strokeLinecap="round" />
      <path d="M 94 42 L 112 36" stroke={color} strokeWidth="6" strokeLinecap="round" />
      <path d="M 96 60 L 115 60" stroke={color} strokeWidth="6" strokeLinecap="round" />

      {/* Base curva inferior */}
      <path
        d="M 24 124 C 42 128 76 130 102 120"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Logotipo Completo El Barrio (Isotipo + Texto a mano "el barrio") o logo personalizado
 */
export function BrandLogo({
  className = '',
  size = 'md',
  variant = 'full',
  light = false,
}: BrandProps) {
  let contentBranding: any = null;
  try {
    const ctx = useSiteContent();
    contentBranding = ctx.content?.branding;
  } catch (e) {
    // context optional
  }

  const sizeMap = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20',
  };

  const customLogo = contentBranding?.customLogoUrl;
  if (customLogo) {
    return (
      <img
        src={customLogo}
        alt={contentBranding?.appName || 'Logotipo'}
        className={`${sizeMap[size]} w-auto object-contain shrink-0 ${className}`}
        referrerPolicy="no-referrer"
      />
    );
  }

  if (variant === 'iso') {
    return <BrandIsotype size={size} light={light} className={className} />;
  }

  const color = light ? '#FFFFFF' : (contentBranding?.primaryColor || '#00C888');

  return (
    <svg
      viewBox="0 0 400 135"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeMap[size]} w-auto shrink-0 ${className}`}
      aria-label={contentBranding?.appName || 'Logo El Barrio'}
    >
      {/* ===== ISOTIPO IZQUIERDO ===== */}
      <g transform="translate(-8, -4)">
        {/* Bucle b */}
        <path
          d="M 46 98 C 30 88 24 64 32 44 C 38 24 56 16 72 22 C 88 28 94 50 92 72 C 90 92 78 104 56 104 C 42 104 34 94 32 82 C 30 68 38 48 46 30 C 50 20 54 14 56 14"
          stroke={color}
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Puertita */}
        <path
          d="M 52 102 C 52 86 62 82 68 82 C 74 82 80 86 80 102"
          stroke={color}
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        <circle cx="66" cy="94" r="2.2" fill={color} />

        {/* 3 Rayos */}
        <path d="M 82 24 L 98 18" stroke={color} strokeWidth="5.5" strokeLinecap="round" />
        <path d="M 91 39 L 108 35" stroke={color} strokeWidth="5.5" strokeLinecap="round" />
        <path d="M 93 55 L 110 55" stroke={color} strokeWidth="5.5" strokeLinecap="round" />

        {/* Base curva */}
        <path
          d="M 28 116 C 44 120 74 122 98 114"
          stroke={color}
          strokeWidth="6.5"
          strokeLinecap="round"
        />
      </g>

      {/* ===== TEXTO A MANO ALZADA "el barrio" ===== */}
      <g transform="translate(10, 0)">
        {/* 'e' */}
        <path
          d="M 130 76 C 124 60 140 46 154 52 C 164 56 166 70 158 80 C 148 92 134 90 128 82 C 124 76 126 68 140 66 C 152 64 160 66 160 68"
          stroke={color}
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 'l' */}
        <path
          d="M 170 86 C 174 68 190 36 198 20 C 204 10 212 12 208 26 C 200 54 186 82 184 88 C 182 94 190 92 198 86"
          stroke={color}
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 'b' de barrio */}
        <path
          d="M 220 88 C 224 68 240 36 248 20 C 254 10 262 12 258 26 C 250 54 238 82 236 86 C 234 92 246 92 256 82 C 264 74 266 62 256 62 C 248 62 240 72 242 84"
          stroke={color}
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 'a' */}
        <path
          d="M 284 70 C 277 62 266 66 264 76 C 262 86 272 92 282 88 C 286 86 288 80 286 74 C 284 68 286 60 290 60 C 294 60 292 74 290 88"
          stroke={color}
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 'r' (1) */}
        <path
          d="M 302 88 L 304 68 C 306 62 314 60 320 64 C 322 68 318 74 312 76 L 314 88"
          stroke={color}
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 'r' (2) */}
        <path
          d="M 326 88 L 328 68 C 330 62 338 60 344 64 C 346 68 342 74 336 76 L 338 88"
          stroke={color}
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 'i' */}
        <path
          d="M 352 68 L 350 88"
          stroke={color}
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        <circle cx="354" cy="54" r="3.5" fill={color} />

        {/* 'o' */}
        <path
          d="M 370 66 C 362 66 358 76 360 84 C 362 92 374 94 380 86 C 386 78 382 66 370 66 Z"
          stroke={color}
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Subrayado curvado continuo desde 'o' hacia atrás */}
        <path
          d="M 216 100 C 260 108 322 114 378 94"
          stroke={color}
          strokeWidth="6.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function BrandWordmark({
  className = '',
  size = 'md',
  light = false,
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  light?: boolean;
}) {
  return <BrandLogo className={className} size={size} light={light} />;
}
