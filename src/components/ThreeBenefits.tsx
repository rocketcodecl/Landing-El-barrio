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
    {
      label: b1.tag?.replace(/^\d+\.\s*/, '') || 'Conecta',
      benefit: b1,
      icon: Users,
      summary: 'Conecta con vecinos reales de tu entorno, organizados por cuadrantes cercanos.',
      points: ['Vecinos verificados', 'Perfiles con reputación', 'Comunidad cercana, sin ruido'],
      tabActive: 'bg-[#18B68B] text-white shadow-sm',
      tabInactive: 'bg-white text-[#0E8067]',
      accentText: 'text-[#18B68B]',
      indicator: 'bg-[#18B68B]',
    },
    {
      label: b2.tag?.replace(/^\d+\.\s*/, '') || 'Resuelve',
      benefit: b2,
      icon: ShoppingBag,
      summary: 'Compra, vende, arrienda, presta, regala o pide una mano dentro de tu zona.',
      points: ['Arrienda objetos que usarás una vez', 'Regala o intercambia lo que ya no necesitas', 'Coordina directamente con personas cercanas'],
      tabActive: 'bg-purple-600 text-white shadow-sm',
      tabInactive: 'bg-white text-purple-700',
      accentText: 'text-purple-600',
      indicator: 'bg-purple-600',
    },
    {
      label: b3.tag?.replace(/^\d+\.\s*/, '') || 'Cuida',
      benefit: b3,
      icon: ShieldAlert,
      summary: 'Recibe alertas e información relevante de tu cuadrante cuando realmente importa.',
      points: ['Alertas priorizadas', 'Información moderada', 'Privacidad de tu ubicación'],
      tabActive: 'bg-red-600 text-white shadow-sm',
      tabInactive: 'bg-white text-red-700',
      accentText: 'text-red-600',
      indicator: 'bg-red-600',
    },
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
    <section id="beneficios" className="bg-[#FAFDFB] py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto mb-7 max-w-6xl space-y-2 text-center sm:mb-16 sm:space-y-3">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#18B68B] sm:px-3 sm:text-xs">
            {benefits.badge || 'Pilares Fundamentales'}
          </span>
          <h2 className="text-[26px] font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-4xl sm:leading-normal lg:whitespace-nowrap">
            {benefits.title || 'Tres grandes beneficios en una sola aplicación'}
          </h2>
          <p className="mx-auto max-w-[330px] text-[13.5px] leading-5 text-slate-600 sm:max-w-none sm:text-lg sm:leading-normal">
            {benefits.subtitle || 'Todo lo que necesitas para tu vida cotidiana a pasos de tu hogar.'}
          </p>
        </div>

        {/* Mobile benefits: compact app-like tabs + single active panel */}
        <div className="sm:hidden">
          <div className="grid grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            {mobileBenefits.map((item, index) => {
              const TabIcon = item.icon;
              const isActive = activeMobileBenefit === index;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveMobileBenefit(index)}
                  className={`flex h-9 items-center justify-center gap-1.5 rounded-lg px-1.5 text-[11px] font-extrabold transition-colors ${isActive ? item.tabActive : item.tabInactive}`}
                  aria-pressed={isActive}
                >
                  <TabIcon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div
            onTouchStart={handleMobileSwipeStart}
            onTouchEnd={handleMobileSwipeEnd}
            className="mt-4"
          >
            <div className="flex items-start gap-3">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${activeMobileBenefit === 0 ? 'bg-emerald-100 text-emerald-700' : activeMobileBenefit === 1 ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-700'}`}>
                <ActiveMobileIcon className="h-[18px] w-[18px]" />
              </div>
              <div className="min-w-0 flex-1">
                <span className={`text-[9.5px] font-extrabold uppercase tracking-[0.17em] ${activeMobileBenefit === 0 ? 'text-emerald-700' : activeMobileBenefit === 1 ? 'text-purple-700' : 'text-red-700'}`}>
                  {activeMobile.benefit.tag}
                </span>
                <h3 className="mt-0.5 text-[18px] font-extrabold leading-[1.16] tracking-tight text-slate-900">
                  {activeMobile.benefit.title}
                </h3>
              </div>
            </div>

            <p className="mt-2.5 text-[12.5px] leading-[1.5] text-slate-600">
              {activeMobile.summary}
            </p>

            <ul className="mt-3 grid gap-1.5">
              {activeMobile.points.map((bullet) => (
                <li key={bullet} className="flex items-center gap-2 text-[11.5px] font-semibold leading-4 text-slate-700">
                  <Check className={`h-4 w-4 shrink-0 stroke-[3] ${activeMobile.accentText}`} />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className={`mt-4 rounded-2xl border p-2.5 ${activeMobileBenefit === 0 ? 'border-emerald-100 bg-emerald-50/65' : activeMobileBenefit === 1 ? 'border-purple-100 bg-purple-50/65' : 'border-red-100 bg-red-50/65'}`}>
              <div className="mb-2 flex items-center justify-between px-0.5">
                <span className="text-[8.5px] font-extrabold uppercase tracking-[0.15em] text-slate-400">En la app</span>
                <span className="text-[8.5px] font-bold text-slate-400">Desliza para cambiar</span>
              </div>

              {activeMobileBenefit === 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-white px-2.5 py-2 shadow-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#18B68B] text-[10px] font-extrabold text-white">JV</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 text-[11px] font-extrabold text-slate-900"><span className="truncate">{b1.sampleTitle}</span><BadgeCheck className="h-3 w-3 shrink-0 text-[#18B68B]" /></div>
                      <p className="truncate text-[9px] text-slate-500">{b1.sampleSubtitle}</p>
                    </div>
                    <span className="shrink-0 text-[9px] font-bold text-[#18B68B]">{b1.sampleMetaLeft}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-white px-2.5 py-2 text-[10px] shadow-sm">
                    <span className="font-bold text-slate-700">Vecinos verificados del cuadrante</span>
                    <span className="font-extrabold text-slate-500">{b1.sampleMetaRight}</span>
                  </div>
                </div>
              )}

              {activeMobileBenefit === 1 && (
                <div className="space-y-1.5">
                  {[
                    ['🪜', b2.sampleTitle, b2.sampleSubtitle, b2.samplePrice],
                    ['🎁', b2.secondarySampleTitle, b2.secondarySampleSubtitle, b2.secondarySamplePrice],
                    ['🔧', b2.tertiarySampleTitle, b2.tertiarySampleSubtitle, b2.tertiarySamplePrice],
                  ].map(([emoji, title, subtitle, price]) => (
                    <div key={title} className="flex items-center gap-2 rounded-xl border border-purple-100 bg-white px-2.5 py-2 shadow-sm">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-sm">{emoji}</div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[10.5px] font-extrabold text-slate-900">{title}</p>
                        <p className="truncate text-[8.5px] text-slate-500">{subtitle}</p>
                      </div>
                      <span className="max-w-[78px] shrink-0 text-right text-[9px] font-extrabold leading-3 text-purple-700">{price}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeMobileBenefit === 2 && (
                <div className="space-y-1.5">
                  <div className="rounded-xl border border-red-100 bg-white px-2.5 py-2.5 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-[9.5px] font-extrabold text-red-700"><ShieldAlert className="h-3 w-3" /> Alerta del cuadrante</span>
                      <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[8px] font-bold text-emerald-700">Verificada</span>
                    </div>
                    <p className="mt-1.5 text-[10.5px] font-extrabold leading-[1.35] text-slate-900">{b3.sampleTitle}</p>
                    <p className="mt-0.5 truncate text-[8.5px] text-slate-500">{b3.sampleSubtitle}</p>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-red-100 bg-white px-2.5 py-2 text-[9.5px] shadow-sm">
                    <span className="font-bold text-slate-700">Información relevante, sin ruido</span>
                    <span className="font-extrabold text-red-700">{b3.sampleMetaLeft}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 flex justify-center gap-1.5">
              {mobileBenefits.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveMobileBenefit(index)}
                  aria-label={`Ver ${mobileBenefits[index].label}`}
                  className={`h-1.5 rounded-full transition-all ${activeMobileBenefit === index ? 'w-4 bg-[#18B68B]' : 'w-1.5 bg-slate-300'}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="hidden sm:block">

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
