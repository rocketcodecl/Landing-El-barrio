import { Users, ShoppingBag, ShieldAlert, Check, ArrowRight, MapPin, MessageSquare, BadgeCheck } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface ThreeBenefitsProps {
  onSelectRole: (role: 'vecino' | 'comercio' | 'servicio') => void;
  onScrollToForm: () => void;
}

export function ThreeBenefits({ onSelectRole, onScrollToForm }: ThreeBenefitsProps) {
  const { content } = useSiteContent();
  const benefits = content.benefits;
  const b1 = benefits.benefit1;
  const b2 = benefits.benefit2;
  const b3 = benefits.benefit3;

  return (
    <section id="beneficios" className="py-20 bg-[#FAFDFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-6xl mx-auto mb-10 sm:mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#18B68B] bg-emerald-50 px-3 py-1 rounded-full">
            {benefits.badge || 'Pilares Fundamentales'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight lg:whitespace-nowrap">
            {benefits.title || 'Tres grandes beneficios en una sola aplicación'}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            {benefits.subtitle || 'Todo lo que necesitas para tu vida cotidiana a pasos de tu hogar.'}
          </p>
        </div>

        {/* Benefit 1: CONECTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-12 items-stretch mb-14 sm:mb-20 lg:mb-24">
          <div className="lg:col-span-6 flex flex-col justify-center space-y-4 sm:space-y-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-100 text-[#18B68B] flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            
            <div className="space-y-2">
              <span className="text-sm font-extrabold text-[#18B68B] uppercase tracking-wider">{b1.tag || '01. Conecta'}</span>
              <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                {b1.title}
              </h3>
            </div>

            <p className="text-slate-600 text-[15px] sm:text-base leading-relaxed">
              {b1.description}
            </p>

            <ul className="space-y-2 sm:space-y-3 font-medium text-slate-700 text-[13px] sm:text-sm">
              {(b1.points || []).map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#18B68B] flex items-center justify-center mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => { onSelectRole('vecino'); onScrollToForm(); }}
              className="inline-flex items-center gap-2 text-[#18B68B] font-bold text-sm hover:text-[#15a27c] transition-colors group cursor-pointer"
            >
              <span>{b1.cta}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="lg:col-span-6 flex">
            <div className="relative flex min-h-[220px] w-full flex-1 items-center rounded-3xl border border-emerald-900/10 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-lg sm:min-h-[300px] sm:p-8 lg:min-h-[360px]">
              <div className="w-full bg-white p-4 sm:p-5 rounded-2xl shadow-md border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#18B68B] text-white flex items-center justify-center font-bold text-sm">
                      JV
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        {b1.sampleTitle || 'Javier Valdés'}
                        <BadgeCheck className="w-4 h-4 text-[#18B68B]" />
                      </h4>
                      <p className="text-xs text-slate-500">{b1.sampleSubtitle || 'Vecino Fundador • Sector El Golf, Las Condes'}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
                    {b1.sampleTag || '★ 5.0 reputación'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic">
                  “{b1.sampleBody}”
                </p>

                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-1">
                  <span className="flex items-center gap-1 text-[#18B68B]">
                    <MapPin className="w-3.5 h-3.5" /> {b1.sampleMetaLeft}
                  </span>
                  <span>{b1.sampleMetaRight}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefit 2: RESUELVE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-12 items-stretch mb-14 sm:mb-20 lg:mb-24 lg:flex-row-reverse">
          <div className="lg:col-span-6 lg:order-2 flex flex-col justify-center space-y-4 sm:space-y-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <ShoppingBag className="w-6 h-6" />
            </div>
            
            <div className="space-y-2">
              <span className="text-sm font-extrabold text-purple-700 uppercase tracking-wider">{b2.tag || '02. Resuelve'}</span>
              <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                {b2.title}
              </h3>
            </div>

            <p className="text-slate-600 text-[15px] sm:text-base leading-relaxed">
              {b2.description}
            </p>

            <ul className="space-y-2 sm:space-y-3 font-medium text-slate-700 text-[13px] sm:text-sm">
              {(b2.points || []).map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => { onSelectRole('vecino'); onScrollToForm(); }}
              className="inline-flex items-center gap-2 text-purple-700 font-bold text-sm hover:text-purple-800 transition-colors group cursor-pointer"
            >
              <span>{b2.cta}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="lg:col-span-6 lg:order-1 flex">
            <div className="flex min-h-[220px] w-full flex-1 items-center rounded-3xl border border-purple-900/10 bg-gradient-to-br from-purple-50 to-white p-4 shadow-lg sm:min-h-[300px] sm:p-8 lg:min-h-[360px]">
              <div className="w-full space-y-3">
                
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      🪜
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{b2.sampleTitle || 'Escalera telescópica 3.8m'}</h4>
                      <p className="text-xs text-slate-500">{b2.sampleSubtitle || 'Arriendo por día • A 200m'}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-purple-700 text-sm">{b2.samplePrice || '$4.000 / día'}</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      🎁
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{b2.secondarySampleTitle}</h4>
                      <p className="text-xs text-slate-500">{b2.secondarySampleSubtitle}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-emerald-600 text-sm">{b2.secondarySamplePrice}</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      🔧
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{b2.tertiarySampleTitle}</h4>
                      <p className="text-xs text-slate-500">{b2.tertiarySampleSubtitle}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-[#18B68B]" /> {b2.tertiarySamplePrice}
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Benefit 3: CUIDA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center space-y-4 sm:space-y-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
              <ShieldAlert className="w-6 h-6" />
            </div>
            
            <div className="space-y-2">
              <span className="text-sm font-extrabold text-red-700 uppercase tracking-wider">{b3.tag || '03. Cuida'}</span>
              <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                {b3.title}
              </h3>
            </div>

            <p className="text-slate-600 text-[15px] sm:text-base leading-relaxed">
              {b3.description}
            </p>

            <ul className="space-y-2 sm:space-y-3 font-medium text-slate-700 text-[13px] sm:text-sm">
              {(b3.points || []).map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => { onSelectRole('vecino'); onScrollToForm(); }}
              className="inline-flex items-center gap-2 text-red-700 font-bold text-sm hover:text-red-800 transition-colors group cursor-pointer"
            >
              <span>{b3.cta}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="lg:col-span-6 flex">
            <div className="flex min-h-[220px] w-full flex-1 items-center rounded-3xl border border-red-900/10 bg-gradient-to-br from-red-50 to-white p-4 shadow-lg sm:min-h-[300px] sm:p-8 lg:min-h-[360px]">
              <div className="w-full bg-white p-4 sm:p-5 rounded-2xl border border-red-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-red-700 border-b border-red-100 pb-2">
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" /> Alerta de Cuadrante Activa
                  </span>
                  <span className="text-emerald-700">{b3.sampleTag || 'Confirmado por moderador'}</span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-base">
                  {b3.sampleTitle || 'Corte programado de agua potable por reparaciones'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {b3.sampleSubtitle || 'Sector Apoquindo / Manquehue • Aviso municipal verificado'}
                </p>
                <div className="flex items-center justify-between pt-2 text-xs text-slate-500 font-semibold">
                  <span>{b3.sampleMetaLeft}</span>
                  <span className="text-[#18B68B]">{b3.sampleMetaRight}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
