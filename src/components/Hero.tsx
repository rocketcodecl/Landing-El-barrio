import { ArrowRight, CheckCircle2, MapPin, Store } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface HeroProps {
  onSelectRole: (role: 'vecino' | 'comercio' | 'servicio') => void;
  onScrollToForm: () => void;
}

export function Hero({ onSelectRole, onScrollToForm }: HeroProps) {
  const { content } = useSiteContent();
  const hero = content.hero;
  const selectRole = (role: 'vecino' | 'comercio') => { onSelectRole(role); onScrollToForm(); };

  return (
    <section className="relative isolate min-h-[600px] overflow-hidden bg-[#F8FBFA] text-slate-950 lg:min-h-[640px]">
      <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata" poster={hero.backgroundPosterUrl} aria-hidden="true">
        <source src={hero.backgroundVideoUrl} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-white/78" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.94)_45%,rgba(255,255,255,0.78)_70%,rgba(255,255,255,0.7)_100%)]" />

      <div className="relative mx-auto grid min-h-[600px] max-w-7xl grid-cols-1 items-center gap-6 px-5 py-12 sm:px-8 lg:min-h-[640px] lg:grid-cols-12 lg:gap-10 lg:px-8 lg:py-14">
        <div className="space-y-6 lg:col-span-7">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#0E8067] sm:text-sm">
            <MapPin className="h-4 w-4 text-[#18B68B]" aria-hidden="true" />
            <span>{hero.badge}</span>
          </div>

          <h1 className="max-w-3xl text-4xl font-black leading-[1.03] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-6xl">
            {hero.titlePart1}{' '}
            <span className="text-[#0E8067]">{hero.titleHighlight}</span>
            {hero.titlePart2}
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg lg:text-xl">
            {hero.description}
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button onClick={() => selectRole('vecino')} className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#18B68B] px-7 py-4 text-base font-extrabold text-white shadow-xl shadow-black/15 transition-colors hover:bg-[#20C99A]">
              {hero.ctaVecino}<ArrowRight className="h-5 w-5" />
            </button>
            <button onClick={() => selectRole('comercio')} className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-300 bg-white px-6 py-4 text-base font-extrabold text-slate-950 shadow-sm transition-colors hover:border-[#18B68B] hover:bg-emerald-50">
              <Store className="h-5 w-5" />{hero.ctaComercio}
            </button>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-300/80 pt-5 text-sm font-semibold text-slate-700">
            {hero.highlights.map((highlight) => <div key={highlight} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#0E8067]" /><span>{highlight}</span></div>)}
          </div>
        </div>

        <div className="hidden items-center justify-center lg:col-span-5 lg:flex">
          <figure className="relative w-full max-w-[330px]">
            <img src={hero.previewImageUrl} alt={hero.previewImageAlt} className="block max-h-[545px] w-full object-contain drop-shadow-[0_24px_38px_rgba(15,23,42,0.18)]" loading="eager" fetchPriority="high" />
            {hero.previewLabel && <figcaption className="mt-2 text-center text-xs font-bold text-slate-600">{hero.previewLabel}</figcaption>}
          </figure>
        </div>
      </div>
    </section>
  );
}
