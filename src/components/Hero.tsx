import { ArrowRight, CheckCircle2, MapPin } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface HeroProps {
  onSelectRole: (role: 'vecino' | 'comercio' | 'servicio') => void;
  onScrollToForm: () => void;
}

export function Hero({ onSelectRole, onScrollToForm }: HeroProps) {
  const { content } = useSiteContent();
  const hero = content.hero;
  const selectNeighbor = () => { onSelectRole('vecino'); onScrollToForm(); };

  return (
    <section className="hero-section relative isolate min-h-[528px] overflow-hidden bg-[#F3F8F5] text-slate-950 sm:min-h-[600px] lg:min-h-[640px]">
      <video className="absolute inset-0 h-full w-full object-cover object-[64%_center] brightness-[0.94] saturate-[0.9] sm:object-center sm:brightness-[0.92] sm:saturate-[0.9]" autoPlay muted loop playsInline preload="auto" poster={hero.backgroundPosterUrl} aria-hidden="true">
        <source src={hero.backgroundVideoUrl} type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_28%_38%,rgba(248,251,250,0.9)_0%,rgba(248,251,250,0.78)_38%,rgba(248,251,250,0.36)_68%,rgba(248,251,250,0)_100%)] sm:bg-[linear-gradient(90deg,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.86)_43%,rgba(255,255,255,0.52)_68%,rgba(255,255,255,0.26)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(180deg,rgba(243,248,245,0)_0%,rgba(243,248,245,0.35)_35%,rgba(243,248,245,0.82)_72%,rgb(243,248,245)_100%)] sm:hidden" />

      <div className="relative mx-auto grid min-h-[528px] max-w-7xl grid-cols-1 items-center gap-6 px-5 pb-14 pt-6 sm:min-h-[600px] sm:px-8 sm:py-12 lg:min-h-[640px] lg:grid-cols-12 lg:gap-10 lg:px-8 lg:py-14">
        <div className="space-y-4 sm:space-y-6 lg:col-span-7">
          <div className="flex max-w-[19rem] items-start gap-2 text-[11px] font-extrabold uppercase leading-4 tracking-[0.12em] text-[#0E8067] sm:max-w-none sm:items-center sm:text-sm sm:leading-normal sm:tracking-[0.14em]">
            <MapPin className="h-4 w-4 text-[#18B68B]" aria-hidden="true" />
            <span>{hero.badge}</span>
          </div>

          <h1 className="hero-title max-w-3xl text-balance font-normal leading-[1.02] tracking-[-0.035em] text-slate-950 sm:text-5xl sm:font-light lg:text-6xl">
            {hero.titlePart1}{' '}
            <span className="font-black text-[#0E8067]">{hero.titleHighlight}</span>
            {hero.titlePart2}
          </h1>

          <p className="max-w-2xl text-pretty text-[15px] leading-6 text-slate-700 sm:text-lg sm:leading-relaxed lg:text-xl">
            {hero.description}
          </p>

          <div className="flex w-full sm:w-auto">
            <button onClick={selectNeighbor} className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#18B68B] px-6 py-3.5 text-[15px] font-extrabold text-white shadow-lg shadow-black/15 transition-colors hover:bg-[#20C99A] sm:w-auto sm:px-7 sm:py-4 sm:text-base sm:shadow-xl">
              {hero.ctaVecino}<ArrowRight className="h-5 w-5" />
            </button>
          </div>

          <div className="hidden flex-wrap gap-x-6 gap-y-3 border-t border-slate-300/80 pt-5 text-sm font-semibold text-slate-700 sm:flex">
            {hero.highlights.map((highlight) => <div key={highlight} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#0E8067]" /><span>{highlight}</span></div>)}
          </div>
        </div>

        <button
          type="button"
          onClick={() => document.querySelector('.story-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className="absolute bottom-2 left-1/2 z-20 flex h-[58px] w-10 -translate-x-1/2 flex-col items-center justify-start text-[#0E8067]/70 transition-colors hover:text-[#0E8067] sm:hidden"
          aria-label="Bajar para conocer la historia de El Barrio"
        >
          <svg className="h-8 w-5 shrink-0 overflow-visible" viewBox="0 0 20 32" fill="none" aria-hidden="true">
            <rect x="1.25" y="1.25" width="17.5" height="29.5" rx="8.75" stroke="currentColor" strokeWidth="1.5" />
            <circle className="hero-scroll-wheel" cx="10" cy="8" r="1.6" fill="currentColor" />
          </svg>
          <span className="hero-scroll-chevrons mt-0.5 flex flex-col items-center gap-0" aria-hidden="true">
            <svg className="h-2.5 w-3" viewBox="0 0 12 10" fill="none">
              <path d="M1 2.5 6 7l5-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg className="-mt-1 h-2.5 w-3 opacity-75" viewBox="0 0 12 10" fill="none">
              <path d="M1 2.5 6 7l5-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      </div>
    </section>
  );
}
