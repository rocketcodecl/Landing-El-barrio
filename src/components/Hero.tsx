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
    <section className="relative isolate min-h-[690px] overflow-hidden bg-[#071D18] text-white lg:min-h-[760px]">
      <img
        src={hero.previewImageUrl}
        alt={hero.previewImageAlt}
        className="absolute inset-0 h-full w-full object-cover object-[62%_center]"
        loading="eager"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,25,20,0.98)_0%,rgba(5,25,20,0.92)_42%,rgba(5,25,20,0.48)_70%,rgba(5,25,20,0.16)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,25,20,0.68)_0%,transparent_38%)] lg:hidden" />

      <div className="relative mx-auto flex min-h-[690px] max-w-7xl items-end px-5 pb-12 pt-28 sm:px-8 lg:min-h-[760px] lg:items-center lg:px-8 lg:pb-20 lg:pt-24">
        <div className="max-w-3xl space-y-7">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200 sm:text-sm">
            <MapPin className="h-4 w-4 text-[#49D7AE]" aria-hidden="true" />
            <span>{hero.badge}</span>
          </div>

          <h1 className="text-4xl font-black leading-[1.02] tracking-[-0.035em] text-white sm:text-5xl lg:text-7xl">
            {hero.titlePart1}{' '}
            <span className="text-[#49D7AE]">{hero.titleHighlight}</span>
            {hero.titlePart2}
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-slate-200 sm:text-xl lg:text-[1.35rem]">
            {hero.description}
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button onClick={() => selectRole('vecino')} className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#18B68B] px-7 py-4 text-base font-extrabold text-white shadow-xl shadow-black/15 transition-colors hover:bg-[#20C99A]">
              {hero.ctaVecino}<ArrowRight className="h-5 w-5" />
            </button>
            <button onClick={() => selectRole('comercio')} className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/45 bg-white/10 px-6 py-4 text-base font-extrabold text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-slate-950">
              <Store className="h-5 w-5" />{hero.ctaComercio}
            </button>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-white/20 pt-5 text-sm font-semibold text-slate-200">
            {hero.highlights.map((highlight) => <div key={highlight} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#49D7AE]" /><span>{highlight}</span></div>)}
          </div>
        </div>
      </div>

      {hero.previewLabel && <p className="absolute bottom-5 right-6 hidden text-xs font-bold uppercase tracking-[0.12em] text-white/75 lg:block">{hero.previewLabel}</p>}
    </section>
  );
}
