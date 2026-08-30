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

  return <section className="bg-[#F7FAF8] py-14 sm:py-20 lg:py-24">
    <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
      <div className="space-y-6 text-left lg:col-span-7">
        <div className="inline-flex items-center gap-2 border-l-4 border-[#18B68B] bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.1em] text-emerald-900 shadow-sm sm:text-sm"><MapPin className="h-4 w-4 text-[#18B68B]" /><span>{hero.badge}</span></div>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">{hero.titlePart1}{' '}<span className="text-[#0E8067]">{hero.titleHighlight}</span>{hero.titlePart2}</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">{hero.description}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-slate-700">{hero.highlights.map((highlight) => <div key={highlight} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#18B68B]" /><span>{highlight}</span></div>)}</div>
        <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row">
          <button onClick={() => selectRole('vecino')} className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#18B68B] px-8 py-4 text-base font-bold text-white shadow-lg shadow-emerald-900/10 transition-colors hover:bg-[#0E8067]">{hero.ctaVecino}<ArrowRight className="h-5 w-5" /></button>
          <button onClick={() => selectRole('comercio')} className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-300 bg-white px-6 py-4 text-base font-bold text-slate-900 transition-colors hover:border-[#18B68B] hover:bg-emerald-50"><Store className="h-5 w-5 text-[#0E8067]" />{hero.ctaComercio}</button>
        </div>
      </div>
      <div className="flex justify-center lg:col-span-5 lg:justify-end">
        <figure className="w-full max-w-[310px] sm:max-w-[340px]"><img src={hero.previewImageUrl} alt={hero.previewImageAlt} className="block h-auto max-h-[650px] w-full object-contain drop-shadow-[0_24px_28px_rgba(15,23,42,0.18)]" loading="eager" fetchPriority="high" />{hero.previewLabel && <figcaption className="mt-4 text-center text-xs font-semibold text-slate-500">{hero.previewLabel}</figcaption>}</figure>
      </div>
    </div>
  </section>;
}
