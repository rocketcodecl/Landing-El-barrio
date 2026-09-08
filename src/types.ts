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
  visitorSources: { source: string; percentage: number; visits?: number }[];
  pathsViewed24h: number;
  visitsLast7: { date: string; label: string; visits: number }[];
  liveVisitors: { path: string; referrer: string; lastSeen: number }[];
  recentVisitors: { path: string; referrer: string; createdAt: string }[];
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
  highlights: string[];
  previewLabel: string;
  previewImageUrl: string;
  previewImageAlt: string;
  backgroundVideoUrl: string;
  backgroundPosterUrl: string;
  verifiedLabel: string;
  tabFeed: string;
  tabMarket: string;
  tabMap: string;
  tabAlerts: string;
}

export interface StoryConfig {
  visible: boolean;
  eyebrow: string;
  titlePart1: string;
  titleHighlight: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  closingText: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  mediaPosterUrl: string;
  mediaAlt: string;
  mediaCaption: string;
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
  cta: string;
  sampleBody?: string;
  sampleMetaLeft?: string;
  sampleMetaRight?: string;
  secondarySampleTitle?: string;
  secondarySampleSubtitle?: string;
  secondarySamplePrice?: string;
  tertiarySampleTitle?: string;
  tertiarySampleSubtitle?: string;
  tertiarySamplePrice?: string;
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
  imageUrl: string;
  imageAlt: string;
  note: string;
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
  navigationTitle: string;
  legalTitle: string;
  contactTitle: string;
  privacyLabel: string;
  termsLabel: string;
  communityLabel: string;
  madeForText: string;
}

export type LandingSectionId = 'hero' | 'scene' | 'benefits' | 'trust' | 'businesses' | 'localAds' | 'faq' | 'waitlist';

export interface LandingSectionConfig {
  id: LandingSectionId;
  label: string;
  visible: boolean;
}

export interface LayoutConfig {
  headerVisible: boolean;
  footerVisible: boolean;
  sections: LandingSectionConfig[];
}

export interface NavigationConfig {
  sceneLabel: string;
  benefitsLabel: string;
  trustLabel: string;
  businessesLabel: string;
  faqLabel: string;
  desktopCta: string;
  mobileNeighborCta: string;
  mobileBusinessCta: string;
}

export interface SectionIntroConfig {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
}

export interface SceneConfig extends SectionIntroConfig {
  filterAll: string;
  filterRent: string;
  filterGifts: string;
  filterBusinesses: string;
  filterHelp: string;
  filterAlerts: string;
  bannerTitle: string;
  bannerText: string;
  bannerCta: string;
}

export interface BusinessFeatureConfig {
  title: string;
  description: string;
}

export interface BusinessSectionConfig extends SectionIntroConfig {
  imageUrl: string;
  imageAlt: string;
  imageCaption: string;
  features: BusinessFeatureConfig[];
  profilesTitle: string;
  actionTitle: string;
  actionText: string;
  commerceCta: string;
  serviceCta: string;
}

export interface FAQSectionConfig extends SectionIntroConfig {
  allLabel: string;
  generalLabel: string;
  securityLabel: string;
  businessesLabel: string;
  contactEyebrow: string;
  contactText: string;
  contactButton: string;
}

export interface FormUIConfig {
  activationLabel: string;
  privacyBadge: string;
  noHiddenCostsBadge: string;
  roleNeighbor: string;
  roleBusiness: string;
  roleService: string;
  nameLabel: string;
  namePlaceholder: string;
  businessNameLabel: string;
  businessNamePlaceholder: string;
  businessCategoryLabel: string;
  businessCategoryPlaceholder: string;
  serviceCategoryLabel: string;
  serviceCategoryPlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  communeLabel: string;
  otherCommuneLabel: string;
  otherCommunePlaceholder: string;
  submittingText: string;
  successTitle: string;
  successMessage: string;
  savedText: string;
  shareEyebrow: string;
  shareText: string;
  whatsappMessage: string;
  shareWhatsapp: string;
  copyLink: string;
  copiedLink: string;
}

export interface LegalBlock {
  heading: string;
  body: string;
}

export interface LegalDocumentConfig {
  title: string;
  intro: string;
  blocks: LegalBlock[];
}

export interface LegalConfig {
  privacy: LegalDocumentConfig;
  terms: LegalDocumentConfig;
  community: LegalDocumentConfig;
}

export interface ThemeConfig {
  fontFamily: string;
  customFontImportUrl: string;
  baseFontSize: number;
  navigationFontSize: number;
  heroTitleDesktop: number;
  heroTitleMobile: number;
  sectionTitleDesktop: number;
  sectionTitleMobile: number;
  bodyFontSize: number;
  buttonFontSize: number;
  contentMaxWidth: number;
  sectionSpacingDesktop: number;
  sectionSpacingMobile: number;
  cardRadius: number;
  buttonRadius: number;
  borderWidth: number;
  shadowOpacity: number;
  primaryColor: string;
  primaryDarkColor: string;
  pageBackground: string;
  surfaceColor: string;
  textColor: string;
  mutedTextColor: string;
  customCss: string;
}

export interface SEOConfig {
  siteTitle: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  socialImageUrl: string;
  faviconUrl: string;
  robots: string;
}

export interface SiteContent {
  theme: ThemeConfig;
  seo: SEOConfig;
  layout: LayoutConfig;
  navigation: NavigationConfig;
  branding: BrandingConfig;
  hero: HeroConfig;
  story: StoryConfig;
  scene: SceneConfig;
  posts: NeighborhoodPost[];
  benefits: BenefitsConfig;
  trust: TrustConfig;
  businesses: LocalBusiness[];
  businessSection: BusinessSectionConfig;
  localAds: LocalAdsConfig;
  faqs: FAQItem[];
  faqSection: FAQSectionConfig;
  waitlistForm: WaitlistFormConfig;
  formUI: FormUIConfig;
  footer: FooterConfig;
  legal: LegalConfig;
}
