import { useEffect } from 'react';
import { useSiteContent } from '../context/SiteContentContext';

function setMeta(name: string, content: string, property = false) {
  const attribute = property ? 'property' : 'name';
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.content = content;
}

export function SiteRuntimeSettings({ includeCustomCss = true }: { includeCustomCss?: boolean }) {
  const { content } = useSiteContent();
  const { theme, seo } = content;

  useEffect(() => {
    const root = document.documentElement;
    const variables: Record<string, string> = {
      '--cms-font-family': `'${theme.fontFamily}', system-ui, sans-serif`,
      '--cms-base-size': `${theme.baseFontSize}px`,
      '--cms-nav-size': `${theme.navigationFontSize}px`,
      '--cms-hero-desktop': `${theme.heroTitleDesktop}px`,
      '--cms-hero-mobile': `${theme.heroTitleMobile}px`,
      '--cms-title-desktop': `${theme.sectionTitleDesktop}px`,
      '--cms-title-mobile': `${theme.sectionTitleMobile}px`,
      '--cms-body-size': `${theme.bodyFontSize}px`,
      '--cms-button-size': `${theme.buttonFontSize}px`,
      '--cms-content-width': `${theme.contentMaxWidth}px`,
      '--cms-section-desktop': `${theme.sectionSpacingDesktop}px`,
      '--cms-section-mobile': `${theme.sectionSpacingMobile}px`,
      '--cms-card-radius': `${theme.cardRadius}px`,
      '--cms-button-radius': `${theme.buttonRadius}px`,
      '--cms-border-width': `${theme.borderWidth}px`,
      '--cms-shadow-opacity': String(theme.shadowOpacity),
      '--cms-primary': theme.primaryColor,
      '--cms-primary-dark': theme.primaryDarkColor,
      '--cms-page-bg': theme.pageBackground,
      '--cms-surface': theme.surfaceColor,
      '--cms-text': theme.textColor,
      '--cms-muted': theme.mutedTextColor,
    };
    Object.entries(variables).forEach(([name, value]) => root.style.setProperty(name, value));

    const fontLinkId = 'cms-custom-font';
    document.getElementById(fontLinkId)?.remove();
    if (/^https:\/\//i.test(theme.customFontImportUrl)) {
      const link = document.createElement('link');
      link.id = fontLinkId;
      link.rel = 'stylesheet';
      link.href = theme.customFontImportUrl;
      document.head.appendChild(link);
    }

    document.title = seo.siteTitle;
    setMeta('description', seo.description);
    setMeta('keywords', seo.keywords);
    setMeta('robots', seo.robots);
    setMeta('og:title', seo.siteTitle, true);
    setMeta('og:description', seo.description, true);
    setMeta('og:image', seo.socialImageUrl, true);
    setMeta('og:url', seo.canonicalUrl, true);
    setMeta('twitter:card', 'summary_large_image');

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = seo.canonicalUrl;

    let favicon = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = seo.faviconUrl;
  }, [seo, theme]);

  return includeCustomCss ? <style id="cms-custom-css">{theme.customCss}</style> : null;
}
