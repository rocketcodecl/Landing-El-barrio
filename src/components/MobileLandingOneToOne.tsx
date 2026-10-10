import { useEffect, useState } from 'react';
import {
  AlertTriangle, ArrowRight, ArrowUp, Award, Check, ChevronDown, ChevronUp, Heart,
  HelpCircle, Lock, MapPin, Menu, MessageCircle, MessageSquare, Play, ShieldCheck,
  Store, Users, WalletCards, Wrench, X
} from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { NeighborhoodPost, RegistrationType } from '../types';
import { LegalModal } from './LegalModal';
import { BUSINESS_PORTAL_URL, OFFICIAL_WHATSAPP_URL, isLandingPreviewPath } from '../lib/landingRuntime';

interface MobileLandingOneToOneProps {
  onOpenWaitlist: (role?: RegistrationType) => void;
}

const patternCream = {
  backgroundColor: '#FFF9ED',
  backgroundImage: 'radial-gradient(rgba(245,158,11,.16) .8px, transparent .8px)',
  backgroundSize: '15px 15px',
};

const patternDark = {
  backgroundColor: '#033C32',
  backgroundImage: 'radial-gradient(rgba(45,212,191,.15) .8px, transparent .8px)',
  backgroundSize: '16px 16px',
};

const glassPillLight = 'inline-flex min-h-[46px] items-center rounded-full border border-emerald-200/90 bg-white/82 px-5 py-3 text-[14px] font-black uppercase tracking-[0.08em] text-[#0B6F5B] shadow-[0_12px_30px_rgba(15,23,42,.12)] ring-1 ring-white/90 backdrop-blur-2xl';
const glassPillDark = 'inline-flex min-h-[46px] items-center rounded-full border border-white/35 bg-white/14 px-5 py-3 text-[14px] font-black uppercase tracking-[0.08em] text-white shadow-[0_12px_30px_rgba(0,0,0,.24)] ring-1 ring-white/10 backdrop-blur-2xl';

export function MobileLandingOneToOne({ onOpenWaitlist }: MobileLandingOneToOneProps) {
  const { content } = useSiteContent();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('todos');
  const [openFaq, setOpenFaq] = useState(content.faqs?.[0]?.id || '');
  const [videoOpen, setVideoOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [legalModal, setLegalModal] = useState<'privacidad' | 'terminos' | 'normas' | null>(null);

  const hero = content.hero;
  const story = content.story;
  const scene = content.scene;
  const benefits = content.benefits;
  const trust = content.trust;
  const business = content.businessSection;
  const localAds = content.localAds;
  const faqSection = content.faqSection;
  const navigation = content.navigation;
  const footer = content.footer;
  const posts = content.posts || [];
  const faqs = content.faqs || [];

  const sectionVisible = (sectionId: string) =>
    content.layout.sections.some((section) => section.id === sectionId && section.visible);

  const preview = isLandingPreviewPath();
  const mobilePublicBase = preview ? '/preview-launch-20260916/' : '/';
  const mobileAssetBase = `${mobilePublicBase}landing-media/`;
  const brandBase = `${mobilePublicBase}brand/`;
  const brandIsoGreen = `${brandBase}iso-el-barrio.svg`;
  const brandIsoWhite = `${brandBase}iso-el-barrio-blanco.svg`;
  const brandWordmarkWhite = `${brandBase}wordmark-barrio-blanco.svg`;
  const brandWordmarkGreen = `${brandBase}wordmark-barrio-verde.svg`;
  const aiPlaza = `${mobileAssetBase}ai-barrio-plaza.jpg`;
  const aiTools = `${mobileAssetBase}ai-barrio-herramientas.jpg`;
  const aiStore = `${mobileAssetBase}ai-comercio-local.jpg`;

  const waitlistVisible = sectionVisible('waitlist');
  const menuItems: Array<{ id: string; label: string }> = [];
  if (sectionVisible('scene')) menuItems.push({ id: 'feed-movil', label: navigation.sceneLabel });
  if (sectionVisible('benefits')) menuItems.push({ id: 'beneficios', label: navigation.benefitsLabel });
  if (sectionVisible('trust')) menuItems.push({ id: 'seguridad', label: navigation.trustLabel });
  if (sectionVisible('businesses')) menuItems.push({ id: 'comercios', label: navigation.businessesLabel });
  if (sectionVisible('localAds')) menuItems.push({ id: 'publicidad-local', label: localAds.badge });
  if (sectionVisible('faq')) menuItems.push({ id: 'faq', label: navigation.faqLabel });

  const firstContent = menuItems[0] || { id: 'inicio', label: 'Inicio' };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 900);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const filters = [
    ['todos', scene.filterAll], ['mercado', scene.filterRent], ['regalo', scene.filterGifts],
    ['alerta', scene.filterAlerts], ['comercio', scene.filterBusinesses], ['ayuda', scene.filterHelp],
  ];

  const filteredPosts = posts.filter((post) => {
    if (activeFilter === 'todos') return true;
    if (activeFilter === 'mercado') return post.type === 'venta' || post.type === 'arriendo';
    if (activeFilter === 'regalo') return post.type === 'regalo';
    if (activeFilter === 'alerta') return post.type === 'alerta';
    if (activeFilter === 'comercio') return post.type === 'comercio';
    if (activeFilter === 'ayuda') return post.type === 'ayuda' || post.type === 'servicio';
    return true;
  });

  const postTone = (type: NeighborhoodPost['type']) => {
    if (type === 'arriendo') return 'bg-violet-100 text-violet-800';
    if (type === 'regalo') return 'bg-emerald-100 text-emerald-800';
    if (type === 'alerta') return 'bg-red-100 text-red-700';
    if (type === 'comercio') return 'bg-amber-100 text-amber-800';
    if (type === 'ayuda' || type === 'servicio') return 'bg-sky-100 text-sky-700';
    return 'bg-slate-100 text-slate-700';
  };

  const PostTypeIcon = ({ type }: { type: NeighborhoodPost['type'] }) => {
    if (type === 'arriendo') return <Wrench className="h-3 w-3" />;
    if (type === 'alerta') return <AlertTriangle className="h-3 w-3" />;
    if (type === 'comercio') return <Store className="h-3 w-3" />;
    return <MessageCircle className="h-3 w-3" />;
  };

  const BenefitCard = ({ index }: { index: 0 | 1 | 2 }) => {
    const items = [benefits.benefit1, benefits.benefit2, benefits.benefit3];
    const item = items[index];
    const config = index === 0
      ? { border: 'border-emerald-300', panel: 'bg-emerald-50', icon: Users, iconBg: 'bg-emerald-500', image: aiPlaza }
      : index === 1
        ? { border: 'border-amber-300', panel: 'bg-amber-50', icon: Wrench, iconBg: 'bg-orange-500', image: aiTools }
        : { border: 'border-sky-300', panel: 'bg-sky-50', icon: AlertTriangle, iconBg: 'bg-sky-500', image: '' };
    const Icon = config.icon;

    return (
      <article className={`rounded-[18px] border ${config.border} bg-white p-4 shadow-sm`}>
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.iconBg} text-white shadow-sm`}><Icon className="h-5 w-5" /></div>
          <div className="min-w-0">
            <span className="rounded-full bg-white px-2 py-1 text-[8px] font-extrabold tracking-[0.12em] text-slate-500 ring-1 ring-slate-200">{item.tag}</span>
            <h3 className="mt-2 text-[14px] font-extrabold leading-5 text-slate-950">{item.title}</h3>
          </div>
        </div>
        {config.image && (
          <div className="relative mt-3 h-32 overflow-hidden rounded-xl">
            <img src={config.image} alt={item.sampleTitle} className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 to-transparent px-3 pb-2.5 pt-8 text-[9px] font-bold text-white">{item.sampleTitle}</div>
          </div>
        )}
        <p className="mt-3 text-[11px] leading-[1.55] text-slate-600">{item.description}</p>
        <div className={`mt-3 rounded-xl border ${config.border} ${config.panel} px-3 py-2.5`}>
          {(item.points || []).slice(0, 2).map((point) => <div key={point} className="flex gap-2 py-0.5 text-[9.5px] leading-4 text-slate-700"><Check className="mt-0.5 h-3 w-3 shrink-0 text-[#18B68B]" /><span>{point}</span></div>)}
        </div>
      </article>
    );
  };

  const businessIcons = [MapPin, Store, MessageCircle, ShieldCheck];
  const storyCards = [
    { image: aiPlaza, text: story.paragraph1 },
    { image: aiTools, text: story.paragraph2 },
    { image: aiStore, text: story.paragraph3 },
  ];

  return (
    <div className="min-h-screen bg-white pb-[72px] text-slate-900">
      {content.layout.headerVisible && (
        <header className="sticky top-0 z-50 border-b border-emerald-900/10 bg-white/96 backdrop-blur-xl">
          <div className="flex h-[62px] items-center justify-between px-4">
            <button type="button" onClick={() => scrollTo('inicio')} className="flex items-center gap-2.5" aria-label="Volver al inicio">
              <img src={brandIsoGreen} alt="" aria-hidden="true" className="h-9 w-9 shrink-0 object-contain" />
              <img src={brandWordmarkGreen} alt={content.branding.appName} className="h-[26px] w-auto max-w-[122px] object-contain object-left" />
            </button>
            <div className="flex items-center gap-2">
              {waitlistVisible && (
                <button type="button" onClick={() => onOpenWaitlist('vecino')} className="flex max-w-[190px] items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-2 text-[10px] font-extrabold text-emerald-900 shadow-sm">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#18B68B]" /><span className="truncate">{hero.simulatorSector || hero.badge}</span>
                </button>
              )}
              <button type="button" onClick={() => setMenuOpen((value) => !value)} className="rounded-xl p-2.5 text-slate-700 transition hover:bg-slate-50" aria-label="Abrir menú">
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {menuOpen && (
            <div className="border-t border-slate-100 bg-white px-4 py-3 shadow-lg">
              <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-700">
                {menuItems.map((item) => <button key={item.id} type="button" onClick={() => scrollTo(item.id)} className="rounded-xl bg-slate-50 px-3 py-3 text-left">{item.label}</button>)}
                <button type="button" onClick={() => scrollTo('inicio')} className="rounded-xl bg-slate-50 px-3 py-3 text-left">Inicio</button>
              </div>
            </div>
          )}
        </header>
      )}

      <section id="inicio" className="relative min-h-[calc(100svh-62px)] overflow-hidden bg-[#E9F8F2] px-4 pb-10 pt-7">
        <div className="pointer-events-none absolute -right-24 top-8 h-80 w-80 rounded-full bg-[#18B68B]/[0.06] blur-3xl" />
        <img src={brandIsoGreen} alt="" aria-hidden="true" className="pointer-events-none absolute -right-24 top-28 h-72 w-72 opacity-[0.025]" />

        <div className="relative z-10 mx-auto max-w-[430px]">
          <h1 className="max-w-[365px] text-[36px] font-black leading-[0.98] tracking-[-0.04em] text-slate-950">
            {hero.titlePart1}{' '}<span className="text-[#18B68B]">{hero.titleHighlight}</span>{hero.titlePart2}
          </h1>
          <p className="mt-4 max-w-[350px] text-[14px] leading-[1.58] text-slate-600">{hero.description}</p>

          <div className="relative mt-6 h-[210px] overflow-hidden rounded-[24px] border border-white/80 bg-slate-900 shadow-[0_20px_44px_rgba(15,23,42,.20)]">
            <video className="h-full w-full object-cover" src={hero.backgroundVideoUrl} poster={hero.backgroundPosterUrl} muted autoPlay loop playsInline preload="metadata" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/82 via-slate-950/8 to-slate-950/10" />
            <div className="absolute left-3 top-3 flex max-w-[85%] items-center gap-1.5 rounded-full border border-white/25 bg-slate-950/30 px-3 py-1.5 text-[10px] font-extrabold text-white backdrop-blur-xl">
              <Heart className="h-3.5 w-3.5 shrink-0 fill-[#18B68B] text-[#18B68B]" /><span>{hero.badge}</span>
            </div>
            <div className="absolute inset-0 z-10 grid place-items-center">
              <button type="button" onClick={() => setVideoOpen(true)} aria-label="Reproducir video de El Barrio" className="group relative grid h-[64px] w-[64px] place-items-center rounded-full border border-white/55 bg-white/16 text-white shadow-[0_16px_40px_rgba(0,0,0,.34)] backdrop-blur-xl transition active:scale-95">
                <span className="pointer-events-none absolute -inset-[8px] rounded-full border border-white/15" />
                <Play className="relative ml-1 h-[26px] w-[26px] fill-current drop-shadow-md" />
              </button>
            </div>
            <div className="absolute inset-x-0 bottom-0 z-10 p-4 text-white">
              <p className="text-[13px] font-extrabold leading-5">{story.titlePart1} {story.titleHighlight}</p>
              <p className="mt-1 text-[10px] font-medium text-white/75">{story.mediaCaption || story.eyebrow}</p>
            </div>
          </div>

          {waitlistVisible && (
            <button type="button" onClick={() => onOpenWaitlist('vecino')} className="mt-5 flex w-full items-center justify-center gap-2 rounded-[16px] bg-[#18B68B] px-4 py-4 text-[14px] font-extrabold text-white shadow-[0_14px_30px_rgba(24,182,139,.28)] transition active:scale-[.99]">
              {hero.ctaVecino}<ArrowRight className="h-4 w-4" />
            </button>
          )}
          {firstContent.id !== 'inicio' && (
            <button type="button" onClick={() => scrollTo(firstContent.id)} className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-[16px] border border-emerald-200 bg-white/80 px-4 py-3.5 text-[12.5px] font-extrabold text-slate-800 shadow-sm backdrop-blur">
              {firstContent.label}<ArrowRight className="h-3.5 w-3.5 text-[#18B68B]" />
            </button>
          )}

          {story.visible && (
            <div className="relative mt-8 overflow-hidden rounded-[22px] border border-emerald-200/90 bg-white/88 p-5 shadow-[0_14px_34px_rgba(15,23,42,.07)] backdrop-blur-xl">
              <img src={brandIsoGreen} alt="" aria-hidden="true" className="pointer-events-none absolute -bottom-12 -right-10 h-44 w-44 opacity-[0.04]" />
              <p className="relative z-10 flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.10em] text-[#18B68B]"><MapPin className="h-4 w-4" /> {story.eyebrow}</p>
              <p className="relative z-10 mt-3 text-[13px] italic leading-[1.72] text-slate-700">“{story.paragraph1}”</p>
            </div>
          )}
        </div>
      </section>

      {sectionVisible('scene') && (
        <section id="feed-movil" className="border-t-[14px] border-white bg-[#F7FBF9] px-4 py-10 shadow-[inset_0_1px_0_rgba(15,23,42,.04)]">
          <div className="flex items-end justify-between gap-3"><div><div className={glassPillLight}>{scene.badge}</div><h2 className="mt-3 text-[20px] font-black text-slate-950">{scene.title} <span className="text-[#18B68B]">{scene.titleHighlight}</span></h2></div></div>
          <p className="mt-2 text-[10px] leading-4 text-slate-500">{scene.subtitle}</p>
          <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2">{filters.map(([filterId,label]) => <button key={filterId} type="button" onClick={() => setActiveFilter(filterId)} className={`shrink-0 rounded-full px-3 py-2 text-[9px] font-extrabold ${activeFilter === filterId ? 'bg-[#18B68B] text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600'}`}>{label}</button>)}</div>
          <div className="mt-3 space-y-3">
            {filteredPosts.slice(0, 6).map((post) => (
              <article key={post.id} className="overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm">
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5"><img src={post.author.avatar} alt={post.author.name} className="h-9 w-9 rounded-full object-cover ring-2 ring-emerald-100" /><div className="min-w-0"><p className="truncate text-[11px] font-extrabold text-slate-900">{post.author.name} {post.author.verified && <ShieldCheck className="inline h-3.5 w-3.5 text-[#18B68B]" />}</p><p className="text-[8.5px] text-slate-400">{post.distance} · {post.author.commune}</p></div></div>
                    <span className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[8px] font-extrabold ${postTone(post.type)}`}><PostTypeIcon type={post.type} /><span className="capitalize">{post.type}</span></span>
                  </div>
                  <h3 className="mt-3 text-[13px] font-extrabold leading-[1.35] text-slate-950">{post.title}</h3>
                  <p className="mt-1.5 text-[10px] leading-[1.5] text-slate-600">{post.description}</p>
                </div>
                {post.image && <div className="h-40 overflow-hidden bg-slate-100"><img loading="lazy" src={post.image} alt={post.title} className="h-full w-full object-cover" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = post.type === 'comercio' ? aiStore : aiPlaza; }} /></div>}
                <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-[8.5px] font-bold text-slate-400"><div className="flex gap-4"><span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{post.likes}</span><span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5 text-[#18B68B]" />{post.commentsCount}</span></div><span>{scene.bannerCta}</span></div>
              </article>
            ))}
          </div>
        </section>
      )}

      {sectionVisible('benefits') && (
        <section id="beneficios" className="border-t-[14px] border-white bg-[#EEF8F4] px-4 py-10 shadow-[inset_0_1px_0_rgba(15,23,42,.04)]">
          <div className="flex items-center gap-3"><div className={glassPillLight}>{benefits.badge}</div><span className="h-px flex-1 bg-emerald-300/60" /></div>
          <h2 className="mt-2 text-[20px] font-black leading-[1.18] text-slate-950">{benefits.title}</h2>
          <p className="mt-2 text-[10px] leading-4 text-slate-500">{benefits.subtitle}</p>
          <div className="mt-4 space-y-4"><BenefitCard index={0} /><BenefitCard index={1} /><BenefitCard index={2} /></div>
        </section>
      )}

      {story.visible && (
        <section id="comunidad" className="border-t-[14px] border-white px-4 py-10 shadow-[inset_0_1px_0_rgba(15,23,42,.04)]" style={patternCream}>
          <div className="flex items-center gap-3"><div className={glassPillLight}>{story.eyebrow}</div><span className="h-px flex-1 bg-amber-300/60" /></div>
          <h2 className="mt-3 text-[20px] font-black leading-[1.25] text-slate-950">{story.titlePart1} <span className="text-[#18B68B]">{story.titleHighlight}</span></h2>
          <div className="mt-4 space-y-3">
            {storyCards.map((card, index) => <article key={index} className="overflow-hidden rounded-[18px] border border-amber-300 bg-white shadow-sm"><div className="relative h-36"><img src={card.image} alt={story.mediaAlt} className="h-full w-full object-cover" /><span className="absolute bottom-2 left-3 rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] font-extrabold text-white">0{index + 1}</span></div><div className="p-4"><p className="text-[10.5px] leading-[1.55] text-slate-600">{card.text}</p></div></article>)}
          </div>
          <div className="mt-4 rounded-[18px] bg-[#075D50] p-5 text-center text-white shadow-lg"><Users className="mx-auto h-7 w-7 text-white" /><p className="mx-auto mt-2 max-w-[315px] text-[13px] font-extrabold leading-[1.55] text-white">{story.closingText}</p>{waitlistVisible && <button type="button" onClick={() => onOpenWaitlist('vecino')} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#18B68B] px-4 py-3 text-[10px] font-extrabold">{hero.ctaVecino}<ArrowRight className="h-3.5 w-3.5" /></button>}</div>
        </section>
      )}

      {sectionVisible('trust') && (
        <section id="seguridad" className="relative overflow-hidden border-t-[14px] border-white px-4 py-10 text-white" style={patternDark}>
          <img src={brandIsoWhite} alt="" aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 opacity-[0.055]" />
          <div className="relative z-10 flex items-center gap-3"><div className={glassPillDark}><Lock className="mr-2 h-4 w-4 text-white" /> {trust.badge}</div><span className="h-px flex-1 bg-white/25" /></div>
          <h2 className="mt-3 text-[20px] font-black leading-[1.2]">{trust.title}</h2>
          <p className="mt-2 text-[10px] leading-4 text-emerald-100/75">{trust.subtitle}</p>
          <div className="mt-4 space-y-3">
            {[
              [Lock, trust.pillars?.[1]?.title || '', trust.pillars?.[1]?.description || ''],
              [Award, trust.pillars?.[3]?.title || '', trust.pillars?.[3]?.description || ''],
              [ShieldCheck, trust.pillars?.[4]?.title || '', trust.pillars?.[4]?.description || ''],
              [WalletCards, trust.transparencyTitle, trust.transparencyText],
            ].map(([Icon,title,text]) => { const SecurityIcon = Icon as typeof Lock; return <article key={String(title)} className="relative z-10 flex gap-3 rounded-[16px] border border-emerald-500/35 bg-white/[0.08] p-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-transparent text-white"><SecurityIcon className="h-[18px] w-[18px] text-white" /></div><div><h3 className="text-[13px] font-extrabold leading-5 text-white">{String(title)}</h3><p className="mt-1 text-[10.5px] leading-[1.45] text-emerald-50/80">{String(text)}</p></div></article>; })}
          </div>
        </section>
      )}

      {sectionVisible('businesses') && (
        <section id="comercios" className="border-t-[14px] border-white px-4 py-10 shadow-[inset_0_1px_0_rgba(15,23,42,.04)]" style={patternCream}>
          <div className="flex items-center gap-3"><div className={glassPillLight}><Store className="mr-2 h-4 w-4 text-[#18B68B]" /> {business.badge}</div><span className="h-px flex-1 bg-amber-300/60" /></div>
          <h2 className="mt-4 text-[20px] font-black leading-[1.22] text-slate-950">{business.title} <span className="text-[#18B68B]">{business.titleHighlight}</span></h2>
          <p className="mt-2 text-[10px] leading-4 text-slate-600">{business.subtitle}</p>
          <div className="relative mt-4 h-40 overflow-hidden rounded-[16px] border border-amber-300 shadow-sm"><img src={aiStore} alt={business.imageAlt} className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" /><div className="absolute inset-x-0 bottom-0 px-3 pb-3 text-white"><p className="text-[10px] font-extrabold">{business.imageCaption}</p></div></div>
          <div className="mt-4 space-y-3">
            {business.features.map((feature, index) => { const BizIcon = businessIcons[index % businessIcons.length]; return <article key={`${feature.title}-${index}`} className="flex gap-3 rounded-[16px] border border-amber-300 bg-white p-4 shadow-sm"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><BizIcon className="h-4 w-4" /></div><div><h3 className="text-[11px] font-extrabold text-slate-950">{feature.title}</h3><p className="mt-1 text-[9.5px] leading-4 text-slate-600">{feature.description}</p></div></article>; })}
          </div>
          <div className="mt-4 rounded-[18px] bg-[#0F172A] p-4 text-white shadow-xl"><p className="text-[12px] font-extrabold text-white">{business.actionTitle}</p><p className="mt-3 text-[10px] leading-4 text-slate-300">{business.actionText}</p><div className="mt-4 grid gap-2"><button type="button" onClick={() => window.location.assign(BUSINESS_PORTAL_URL)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#18B68B] px-4 py-3 text-[10px] font-extrabold text-white shadow">{business.commerceCta}<ArrowRight className="h-3.5 w-3.5" /></button><button type="button" onClick={() => window.location.assign(BUSINESS_PORTAL_URL)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-[10px] font-extrabold text-white">{business.serviceCta}<ArrowRight className="h-3.5 w-3.5" /></button></div></div>
        </section>
      )}

      {sectionVisible('localAds') && (
        <section id="publicidad-local" className="border-t-[14px] border-white bg-[#F7FBF9] px-4 py-10">
          <div className={glassPillLight}>{localAds.badge}</div>
          <h2 className="mt-3 text-[20px] font-black leading-[1.22] text-slate-950">{localAds.title}</h2>
          <p className="mt-2 text-[10px] leading-4 text-slate-600">{localAds.description}</p>
          <img src={localAds.imageUrl} alt={localAds.imageAlt} className="mt-4 h-40 w-full rounded-[16px] object-cover" />
          <div className="mt-4 space-y-2 rounded-[16px] border border-slate-200 bg-white p-4 text-[10px] leading-4 text-slate-600">
            {[localAds.bullet1, localAds.bullet2, localAds.bullet3].map((item) => <div key={item} className="flex gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#18B68B]" /><span>{item}</span></div>)}
          </div>
          <p className="mt-3 text-[9px] leading-4 text-slate-500">{localAds.note}</p>
          <button type="button" onClick={() => window.location.assign(BUSINESS_PORTAL_URL)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-[11px] font-extrabold text-white">{localAds.ctaButton}<ArrowRight className="h-3.5 w-3.5" /></button>
        </section>
      )}

      {sectionVisible('faq') && (
        <section id="faq" className="border-t-[14px] border-white bg-[#EEF3F7] px-4 py-10 shadow-[inset_0_1px_0_rgba(15,23,42,.04)]">
          <div className="flex items-center gap-3"><div className={glassPillLight}><HelpCircle className="mr-2 h-4 w-4 text-[#18B68B]" /> {faqSection.badge}</div><span className="h-px flex-1 bg-slate-300/80" /></div>
          <h2 className="mt-3 text-[20px] font-black text-slate-950">{faqSection.title} <span className="text-[#18B68B]">{faqSection.titleHighlight}</span></h2>
          <p className="mt-2 text-[10px] leading-4 text-slate-600">{faqSection.subtitle}</p>
          <div className="mt-4 space-y-2.5">
            {faqs.map((faq) => { const isOpen = openFaq === faq.id; return <article key={faq.id} className={`overflow-hidden rounded-[16px] border bg-white shadow-sm ${isOpen ? 'border-[#18B68B]' : 'border-slate-200'}`}><button type="button" onClick={() => setOpenFaq(isOpen ? '' : faq.id)} className="flex w-full items-start gap-3.5 px-5 py-4.5 text-left"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${isOpen ? 'bg-[#18B68B]' : 'bg-slate-200'}`} /><span className="flex-1 text-[15px] font-extrabold leading-[1.45] text-slate-950">{faq.question}</span>{isOpen ? <ChevronUp className="h-4 w-4 text-[#18B68B]" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}</button>{isOpen && <div className="border-t border-slate-100 px-5 pb-5 pt-4 text-[14px] leading-[1.65] text-slate-600">{faq.answer}</div>}</article>; })}
          </div>
          <a href={OFFICIAL_WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-4 flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-[11px] font-extrabold text-slate-800">{faqSection.contactButton}</a>
        </section>
      )}

      {content.layout.footerVisible && (
        <footer className="px-4 py-8 text-white" style={{ ...patternDark, backgroundColor: '#071525' }}>
          <div className="flex items-center gap-3"><img src={brandIsoWhite} alt={content.branding.appName} className="h-9 w-9 object-contain" /><img src={brandWordmarkWhite} alt={content.branding.appName} className="h-7 w-auto object-contain" /></div>
          <p className="mt-3 max-w-sm text-[9.5px] leading-4 text-slate-400">{footer.description}</p>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-3 text-[8.5px] text-slate-400"><span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-[#18B68B]" />{footer.locationNotice}</span><span className="h-2 w-2 rounded-full bg-[#18B68B]" /></div>
          <div className="mt-5 grid grid-cols-2 gap-5 text-[9px] text-slate-300">
            <div><p className="mb-2 text-[8px] font-extrabold uppercase tracking-[0.12em] text-slate-500">{footer.navigationTitle}</p><div className="space-y-2">{menuItems.map((item) => <div key={item.id}><button onClick={() => scrollTo(item.id)}>{item.label}</button></div>)}</div></div>
            <div><p className="mb-2 text-[8px] font-extrabold uppercase tracking-[0.12em] text-slate-500">{footer.legalTitle}</p><div className="space-y-2"><button onClick={() => setLegalModal('privacidad')}>{footer.privacyLabel}</button><br /><button onClick={() => setLegalModal('terminos')}>{footer.termsLabel}</button><br /><button onClick={() => setLegalModal('normas')}>{footer.communityLabel}</button><br /><a href={OFFICIAL_WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-[#18B68B]">{footer.contactTitle}</a></div></div>
          </div>
          <div className="mt-5 border-t border-slate-700 pt-4 text-[8px] leading-4 text-slate-500"><p>{footer.officialDomainText}</p><p className="mt-2">© 2026 {footer.copyrightText}</p><button type="button" onClick={() => scrollTo('inicio')} className="mt-4 text-slate-400">↑ Subir al inicio</button></div>
        </footer>
      )}

      {videoOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Video El Barrio">
          <button type="button" onClick={() => setVideoOpen(false)} className="absolute inset-0" aria-label="Cerrar video" />
          <div className="relative z-10 w-full max-w-[430px] overflow-hidden rounded-[22px] bg-black shadow-2xl">
            <button type="button" onClick={() => setVideoOpen(false)} className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur" aria-label="Cerrar"><X className="h-5 w-5" /></button>
            <video src={hero.backgroundVideoUrl} poster={hero.backgroundPosterUrl} controls autoPlay playsInline className="aspect-video w-full bg-black object-contain" />
          </div>
        </div>
      )}

      {legalModal && <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />}

      {showScrollTop && (
        <button type="button" onClick={() => scrollTo('inicio')} aria-label="Volver arriba" className="fixed bottom-[76px] right-4 z-[65] flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/88 text-[#0E8067] shadow-[0_10px_28px_rgba(15,23,42,.14)] backdrop-blur-xl transition active:scale-95">
          <ArrowUp className="h-5 w-5 stroke-[2.5]" />
        </button>
      )}

      {waitlistVisible && (
        <button
          type="button"
          onClick={() => onOpenWaitlist('vecino')}
          className="fixed bottom-4 right-4 z-[60] flex h-12 items-center gap-2 rounded-full border border-white/70 bg-[#18B68B] px-4 text-[11px] font-extrabold text-white shadow-[0_12px_30px_rgba(24,182,139,.34)] transition active:scale-95"
          aria-label="Abrir inscripción"
        >
          <img src={brandIsoWhite} alt="" aria-hidden="true" className="h-5 w-5 object-contain" />
          <span>{navigation.desktopCta}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
