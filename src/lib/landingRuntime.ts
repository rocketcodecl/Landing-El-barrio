export const LANDING_PREVIEW_PATH = '/preview-launch-20260916';
export const BUSINESS_PORTAL_URL = 'https://negocios.elbarrio.lat/';
export const OFFICIAL_WHATSAPP_DIGITS = '56935304705';
export const OFFICIAL_WHATSAPP_URL = `https://wa.me/${OFFICIAL_WHATSAPP_DIGITS}`;

export function isLandingPreviewPath(pathname?: string) {
  const currentPath = pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '');
  return currentPath.startsWith(LANDING_PREVIEW_PATH);
}
