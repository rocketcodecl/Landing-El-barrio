import { Target, Eye, Sparkles, MapPin } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface LocalAdSectionProps {
  onSelectRole: (role: 'comercio' | 'servicio') => void;
  onScrollToForm: () => void;
}

export function LocalAdSection({ onSelectRole, onScrollToForm }: LocalAdSectionProps) {
  const { content } = useSiteContent();
  const localAds = content.localAds || {
    badge: 'Difusión Local Dirigida',
    title: 'Publicidad local hiperlocal sin desperdiciar presupuesto',
    description: 'Promociona tu marca, servicio o evento con alta visibilidad en cuadrantes específicos. Todo el contenido patrocinado está claramente identificado con transparencia comunitaria.',
    ctaButton: 'Consultar opciones de visibilidad',
    bullet1: 'Banners destacados en feed',
    bullet2: 'Posts patrocinados geolocalizados',
    bullet3: 'Filtro por cuadrante exacto'
  };

  const badge = localAds.badge || 'Difusión Local Dirigida';
  const title = localAds.title || 'Publicidad local hiperlocal sin desperdiciar presupuesto';
  const description = localAds.description || 'Promociona tu marca, servicio o evento con alta visibilidad en cuadrantes específicos.';
  const buttonText = (localAds as any).buttonText || localAds.ctaButton || 'Consultar opciones de visibilidad';
  const bullet1 = localAds.bullet1 || 'Banners destacados en feed';
  const bullet2 = localAds.bullet2 || 'Posts patrocinados geolocalizados';
  const bullet3 = localAds.bullet3 || 'Filtro por cuadrante exacto';
  const note = (localAds as any).note || 'Espacios limitados por cuadrante para proteger la experiencia vecinal.';

  return (
    <section className="py-16 bg-white border-b border-emerald-900/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18B68B] text-white text-xs font-bold uppercase tracking-wider border border-[#18B68B]">
                <Target className="w-3.5 h-3.5 text-white" />
                <span>{badge}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {title}
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {description}
              </p>

              <div className="flex flex-nowrap gap-3 overflow-x-auto pt-2 text-xs font-semibold text-emerald-200">
                <div className="flex shrink-0 items-center gap-2 whitespace-nowrap bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/80">
                  <Sparkles className="w-4 h-4 text-[#18B68B]" />
                  <span>{bullet1}</span>
                </div>
                <div className="flex shrink-0 items-center gap-2 whitespace-nowrap bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/80">
                  <Eye className="w-4 h-4 text-[#18B68B]" />
                  <span>{bullet2}</span>
                </div>
                <div className="flex shrink-0 items-center gap-2 whitespace-nowrap bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/80">
                  <MapPin className="w-4 h-4 text-[#18B68B]" />
                  <span>{bullet3}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-stretch sm:items-end justify-center">
              <div className="w-full max-w-sm space-y-2 flex flex-col items-stretch">
                <button
                  onClick={() => window.location.assign('https://negocios.elbarrio.lat/')}
                  className="w-full bg-[#18B68B] hover:bg-[#15a27c] text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-sm cursor-pointer text-center"
                >
                  {buttonText}
                </button>
                <p className="text-[11px] text-slate-400 text-center w-full leading-tight">
                  {note}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
