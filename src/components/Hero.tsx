import { ArrowRight, CheckCircle2, Store } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface HeroProps {
  onSelectRole: (role: 'vecino' | 'comercio' | 'servicio') => void;
  onScrollToForm: () => void;
}

export function Hero({ onSelectRole, onScrollToForm }: HeroProps) {
  const { content } = useSiteContent();
  const hero = content.hero;

  const selectRole = (role: 'vecino' | 'comercio') => {
    onSelectRole(role);
    onScrollToForm();
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAFDFB] via-[#F1F9F6] to-[#FAFDFB] pb-16 pt-8 md:pb-24 md:pt-14">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-96 w-full max-w-7xl -translate-x-1/2 bg-radial from-[#18B68B]/10 via-transparent to-transparent blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col items-start space-y-6 text-left lg:col-span-7">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#18B68B]/30 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-xs sm:text-sm">
              <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#18B68B] opacity-75" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#18B68B]" /></span>
              <span>{hero.badge}</span>
            </div>
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              {hero.titlePart1} <br className="hidden sm:inline" />
              <span className="relative inline-block text-5xl font-extrabold italic text-[#18B68B] sm:text-6xl lg:text-7xl">
                {hero.titleHighlight}
                <svg className="absolute -bottom-2 left-0 h-3 w-full text-[#18B68B]/30" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none" aria-hidden="true"><path d="M2 9C50 3 150 3 198 9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>
              </span>
              {hero.titlePart2}
            </h1>
            <p className="max-w-2xl text-lg font-normal leading-relaxed text-slate-600 sm:text-xl">{hero.description}</p>
            <div className="flex flex-wrap items-center gap-4 py-1 text-xs font-medium text-slate-700 sm:text-sm">
              {hero.highlights.map((highlight) => <div key={highlight} className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#18B68B]" /><span>{highlight}</span></div>)}
            </div>
            <div className="flex w-full flex-col items-stretch gap-4 pt-2 sm:w-auto sm:flex-row sm:items-center">
              <button onClick={() => selectRole('vecino')} className="flex cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#18B68B] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#18B68B]/30 transition-all hover:bg-[#15a27c] active:scale-[0.98]"><span>{hero.ctaVecino}</span><ArrowRight className="h-5 w-5" /></button>
              <button onClick={() => selectRole('comercio')} className="flex cursor-pointer items-center justify-center gap-2.5 rounded-xl border-2 border-emerald-800/20 bg-white px-6 py-4 text-base font-bold text-slate-800 transition-all hover:border-[#18B68B] hover:bg-emerald-50/50"><Store className="h-5 w-5 text-[#18B68B]" /><span>{hero.ctaComercio}</span></button>
            </div>
          </div>

          <div className="flex justify-center lg:col-span-5">
            <figure className="relative w-full max-w-[360px] sm:max-w-[390px]">
              <figcaption className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{hero.previewLabel}</figcaption>
              <div className="pointer-events-none absolute -right-8 top-12 h-40 w-40 rounded-full bg-[#18B68B]/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-6 -left-8 h-36 w-36 rounded-full bg-[#18B68B]/20 blur-3xl" />
              <img src={hero.previewImageUrl} alt={hero.previewImageAlt} className="relative z-10 mx-auto block max-h-[650px] w-auto max-w-full rounded-[2.4rem] object-contain shadow-2xl ring-1 ring-slate-900/10" />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
