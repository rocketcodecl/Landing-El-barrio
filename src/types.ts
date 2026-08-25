export type RegistrationType = 'vecino' | 'comercio' | 'servicio';
export type FAQCategory = 'general' | 'seguridad' | 'comercios';

export interface WaitlistEntry {
  id: string;
  nombre: string;
  correo: string;
  whatsapp: string;
  comuna: string;
  tipo_registro: RegistrationType;
  nombreNegocio?: string;
  rubro?: string;
  fecha: string;
}

export interface NeighborhoodPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    commune: string;
    verified: boolean;
    badge?: string;
    reputation: number;
  };
  type: 'venta' | 'regalo' | 'arriendo' | 'ayuda' | 'servicio' | 'comercio' | 'alerta' | 'evento';
  title: string;
  description: string;
  price?: string;
  distance: string;
  timeAgo: string;
  likes: number;
  commentsCount: number;
  tags?: string[];
  image: string;
  urgent?: boolean;
}

export interface LocalBusiness {
  id: string;
  name: string;
  category: string;
  owner: string;
  commune: string;
  addressApprox: string;
  discount: string;
  description: string;
  verified: boolean;
  avatar: string;
  coverImage: string;
  whatsapp?: string;
  rating: number;
  reviewsCount: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
}

export interface SiteAnalytics {
  activeVisitors: number;
  dailyVisits: number;
  totalVisits: number;
  uniqueVisitors: number;
  topPages: { path: string; visits: number }[];
  visitorSources: { source: string; percentage: number }[];
}

export interface BrandingConfig {
  appName: string;
  slogan: string;
  customLogoUrl?: string;
  customIsotypeUrl?: string;
  primaryColor: string;
  supportEmail: string;
  supportWhatsapp: string;
  officialDomain: string;
}

export interface HeroConfig {
  badge: string;
  titlePart1: string;
  titleHighlight: string;
  titlePart2: string;
  description: string;
  ctaVecino: string;
  ctaComercio: string;
  communesHighlight: string;
  simulatorSector: string;
  simulatorNeighborsCount: string;
}

export interface BenefitItemConfig {
  tag: string;
  title: string;
  description: string;
  points: string[];
  sampleTitle: string;
  sampleSubtitle: string;
  samplePrice?: string;
  sampleTag?: string;
}

export interface BenefitsConfig {
  badge: string;
  title: string;
  subtitle: string;
  benefit1: BenefitItemConfig;
  benefit2: BenefitItemConfig;
  benefit3: BenefitItemConfig;
}

export interface TrustPillarConfig {
  id: string;
  title: string;
  description: string;
}

export interface TrustConfig {
  badge: string;
  title: string;
  subtitle: string;
  pillars: TrustPillarConfig[];
  transparencyTitle: string;
  transparencyText: string;
}

export interface LocalAdsConfig {
  badge: string;
  title: string;
  description: string;
  ctaButton: string;
  bullet1: string;
  bullet2: string;
  bullet3: string;
}

export interface WaitlistFormConfig {
  badge: string;
  title: string;
  subtitle: string;
  quadrantsTitle: string;
  quadrant1Name: string;
  quadrant1Progress: string;
  quadrant2Name: string;
  quadrant2Progress: string;
  quadrant3Name: string;
  quadrant3Progress: string;
  privacyText: string;
  btnVecino: string;
  btnComercio: string;
  btnServicio: string;
}

export interface FooterConfig {
  description: string;
  officialDomainText: string;
  supportEmail: string;
  locationNotice: string;
  copyrightText: string;
}

export interface SiteContent {
  branding: BrandingConfig;
  hero: HeroConfig;
  posts: NeighborhoodPost[];
  benefits: BenefitsConfig;
  trust: TrustConfig;
  businesses: LocalBusiness[];
  localAds: LocalAdsConfig;
  faqs: FAQItem[];
  waitlistForm: WaitlistFormConfig;
  footer: FooterConfig;
}
