import { useRef, useState, type TouchEvent } from 'react';
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
  const [activeMobileBenefit, setActiveMobileBenefit] = useState(0);
  const mobileTouchStartX = useRef<number | null>(null);
  const mobileBenefits = [
    { label: b1.tag?.replace(/^\d+\.\s*/, '') || 'Conecta', benefit: b1, icon: Users },
    { label: b2.tag?.replace(/^\d+\.\s*/, '') || 'Resuelve', benefit: b2, icon: ShoppingBag },
    { label: b3.tag?.replace(/^\d+\.\s*/, '') || 'Cuida', benefit: b3, icon: ShieldAlert },
  ];
  const activeMobile = mobileBenefits[activeMobileBenefit];
  const ActiveMobileIcon = activeMobile.icon;

  const handleMobileSwipeStart = (event: TouchEvent<HTMLDivElement>) => {
    mobileTouchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleMobileSwipeEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (mobileTouchStartX.current === null) return;
    const delta = event.changedTouches[0]?.clientX - mobileTouchStartX.current;
    mobileTouchStartX.current = null;
    if (Math.abs(delta) < 45) return;
    setActiveMobileBenefit((current) => delta < 0 ? Math.min(current + 1, 2) : Math.max(current - 1, 0));
  };

  return (
    <section id="beneficios" className="bg-[#FAFDFB] py-14 md:py-20">
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

        {/* Mobile benefits: tabs + single active panel */}
        <div className="md:hidden">
          <div className="grid grid-cols-3 gap-1 rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-sm">
            {mobileBenefits.map((item, index) => {
              const TabIcon = item.icon;
              const isActive = activeMobileBenefit === index;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveMobileBenefit(index)}
                  className={`flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-2 text-[13px] font-extrabold transition-all ${isActive ? 'bg-[#18B68B] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                  aria-pressed={isActive}
                >
                  <TabIcon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div
            onTouchStart={handleMobileSwipeStart}
            onTouchEnd={handleMobileSwipeEnd}
            className="mt-4 overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
          >
            <div className="p-5 pb-4">
              <div className="flex items-start gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${activeMobileBenefit === 0 ? 'bg-emerald-100 text-emerald-700' : activeMobileBenefit === 1 ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-700'}`}>
                  <ActiveMobileIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className={`text-[11px] font-extrabold uppercase tracking-[0.16em] ${activeMobileBenefit === 0 ? 'text-emerald-700' : activeMobileBenefit === 1 ? 'text-purple-700' : 'text-red-700'}`}>
                    {activeMobile.benefit.tag}
                  </span>
                  <h3 className="mt-1 text-[22px] font-extrabold leading-[1.15] tracking-tight text-slate-900">
                    {activeMobile.benefit.title}
                  </h3>
                </div>
              </div>

              <p className="mt-4 text-[14px] leading-6 text-slate-600">
                {activeMobile.benefit.description}
              </p>

              <ul className="mt-4 space-y-2.5">
                {(activeMobile.benefit.points || []).map((bullet, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-[12.5px] font-medium leading-5 text-slate-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#18B68B]/10 text-[#18B68B]">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`mx-3 rounded-[22px] p-3.5 ${activeMobileBenefit === 0 ? 'bg-emerald-50/80' : activeMobileBenefit === 1 ? 'bg-purple-50/80' : 'bg-red-50/80'}`}>
              {activeMobileBenefit === 0 && (
                <div className="rounded-2xl border border-emerald-100 bg-white p-3.5 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#18B68B] text-xs font-extrabold text-white">JV</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 text-[13px] font-extrabold text-slate-900">
                        <span className="truncate">{b1.sampleTitle}</span>
                        <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-[#18B68B]" />
                      </div>
                      <p className="truncate text-[10.5px] text-slate-500">{b1.sampleSubtitle}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-[11.5px] italic leading-5 text-slate-600">“{b1.sampleBody}”</p>
                  <div className="mt-3 flex items-center justify-between gap-3 text-[10.5px] font-bold text-slate-500">
                    <span className="flex min-w-0 items-center gap-1 text-[#18B68B]"><MapPin className="h-3 w-3 shrink-0" /><span className="truncate">{b1.sampleMetaLeft}</span></span>
                    <span className="shrink-0">{b1.sampleMetaRight}</span>
                  </div>
                </div>
              )}

              {activeMobileBenefit === 1 && (
                <div className="space-y-2">
                  {[
                    ['🪜', b2.sampleTitle, b2.sampleSubtitle, b2.samplePrice],
                    ['🎁', b2.secondarySampleTitle, b2.secondarySampleSubtitle, b2.secondarySamplePrice],
                    ['🔧', b2.tertiarySampleTitle, b2.tertiarySampleSubtitle, b2.tertiarySamplePrice],
                  ].map(([emoji, title, subtitle, price]) => (
                    <div key={title} className="flex items-center gap-2.5 rounded-2xl border border-purple-100 bg-white p-3 shadow-sm">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-base">{emoji}</div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-extrabold text-slate-900">{title}</p>
                        <p className="truncate text-[10.5px] text-slate-500">{subtitle}</p>
                      </div>
                      <span className="max-w-[92px] shrink-0 text-right text-[10.5px] font-extrabold leading-4 text-purple-700">{price}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeMobileBenefit === 2 && (
                <div className="rounded-2xl border border-red-100 bg-white p-3.5 shadow-sm">
                  <div className="flex items-center justify-between gap-3 text-[10.5px] font-extrabold text-red-700">
                    <span className="flex items-center gap-1.5"><ShieldAlert className="h-3.5 w-3.5" /> Alerta del cuadrante</span>
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9.5px] text-emerald-700">{b3.sampleTag}</span>
                  </div>
                  <h4 className="mt-3 text-[13px] font-extrabold leading-5 text-slate-900">{b3.sampleTitle}</h4>
                  <p className="mt-1 text-[10.5px] leading-4 text-slate-500">{b3.sampleSubtitle}</p>
                  <div className="mt-3 flex items-center justify-between gap-3 border-t border-red-100 pt-2.5 text-[10px] font-bold text-slate-500">
                    <span>{b3.sampleMetaLeft}</span>
                    <span className="text-[#18B68B]">{b3.sampleMetaRight}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="p-3 pt-4">
              <button
                onClick={() => { onSelectRole('vecino'); onScrollToForm(); }}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#18B68B] px-4 text-sm font-extrabold text-white shadow-sm transition-transform active:scale-[0.99]"
              >
                <span>{activeMobile.benefit.cta}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>


        <div className="hidden md:block">

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

      </div>
    </section>
  );
}
