import { type ReactNode } from 'react';
import { ShieldCheck, Lock, UserCheck, Flag, MapPin, EyeOff, CheckCircle } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

export function TrustSection() {
  const { content } = useSiteContent();
  const trust = content.trust || {
    badge: 'Escudo de Confianza',
    title: 'Seguridad pensada para que te sientas tranquilo',
    subtitle: 'Sabemos que la confianza es la base de todo trato local. Diseñamos un entorno protegido donde sabes exactamente con quién estás hablando.',
    pillars: [
      {
        id: 'p-1',
        title: 'Vecinos Verificados',
        description: 'Proceso de validación de identidad y comprobante de residencia para asegurar que quienes interactúan realmente habiten en el sector.'
      },
      {
        id: 'p-2',
        title: 'Privacidad de Dirección Exacta',
        description: 'Tu dirección física nunca se muestra públicamente. La app solo proyecta tu cuadrante aproximado (ej: "A 200m") para resguardar tu hogar.'
      },
      {
        id: 'p-3',
        title: 'Comunidades Delimitadas',
        description: 'Redes locales acotadas por manzanas y cuadrantes reales. Evitamos los grupos masivos o caóticos con desconocidos de otras ciudades.'
      },
      {
        id: 'p-4',
        title: 'Reputación & Insignias',
        description: 'Sistema transparente de valoraciones tras cada trato o favor realizado, destacando a vecinos comprometidos y comercios honestos.'
      },
      {
        id: 'p-5',
        title: 'Moderación & Reportes',
        description: 'Herramientas de reporte y revisión de contenido para abordar publicaciones inapropiadas o conductas abusivas.'
      },
      {
        id: 'p-6',
        title: 'Trazabilidad & Control',
        description: 'Registro seguro de interacciones y alertas para mantener un ambiente de convivencia sano, directo y confiable.'
      }
    ],
    transparencyTitle: 'Compromiso de Transparencia',
    transparencyText: 'El Barrio es un sistema independiente de interacción vecinal directa. Todos los tratos, coordinaciones y pagos son gestionados libremente por las personas involucradas, sin comisiones de intermediación.'
  };

  const badge = trust.badge || 'Escudo de Confianza';
  const title = trust.title || 'Seguridad pensada para que te sientas tranquilo';
  const description = (trust as any).description || trust.subtitle || 'Sabemos que la confianza es la base de todo trato local.';
  const commitmentText = (trust as any).commitmentText || trust.transparencyText || 'El Barrio es un sistema independiente de interacción vecinal directa.';
  const pillars = trust.pillars || [];

  const iconMap: Record<number, ReactNode> = {
    0: <UserCheck className="w-6 h-6 text-[#18B68B]" />,
    1: <EyeOff className="w-6 h-6 text-[#18B68B]" />,
    2: <Lock className="w-6 h-6 text-[#18B68B]" />,
    3: <ShieldCheck className="w-6 h-6 text-[#18B68B]" />,
    4: <Flag className="w-6 h-6 text-[#18B68B]" />,
    5: <MapPin className="w-6 h-6 text-[#18B68B]" />
  };

  const mobileCore = [
    {
      label: 'Identidad',
      title: pillars[0]?.title || 'Vecinos Verificados',
      text: 'Personas reales vinculadas a tu sector.',
      icon: UserCheck,
      iconWrap: 'bg-emerald-100 text-emerald-700',
      line: 'bg-emerald-300',
    },
    {
      label: 'Privacidad',
      title: pillars[1]?.title || 'Privacidad de Dirección Exacta',
      text: 'Tu domicilio exacto nunca se publica.',
      icon: EyeOff,
      iconWrap: 'bg-sky-100 text-sky-700',
      line: 'bg-sky-300',
    },
    {
      label: 'Territorio',
      title: pillars[2]?.title || 'Comunidades Delimitadas',
      text: 'Interacción dentro de cuadrantes definidos.',
      icon: Lock,
      iconWrap: 'bg-indigo-100 text-indigo-700',
      line: 'bg-indigo-300',
    },
  ];

  return (
    <section id="seguridad" className="relative overflow-hidden bg-[#F6FCF9] py-14 text-slate-950 sm:bg-white sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 hidden sm:block"
        style={{ backgroundImage: "url('/landing-media/barrio-comunidad.jpg')", backgroundPosition: 'center 48%', backgroundSize: 'cover' }}
      />
      <div className="pointer-events-none absolute inset-0 hidden bg-white/90 sm:block" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Mobile: unified brand trust system */}
        <div className="sm:hidden">
          <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#0B6F5B] via-[#0E8067] to-[#159A78] px-5 py-6 text-white shadow-[0_20px_50px_rgba(14,128,103,0.18)]">
            <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -right-4 top-2 h-24 w-24 rounded-full border border-white/10" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#C8F1E4] bg-[#E8F8F2] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#0B6F5B]">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{badge}</span>
              </div>

              <h2 className="mt-4 text-[28px] font-extrabold leading-[1.06] tracking-tight text-white">{title}</h2>
              <p className="mt-3 max-w-[330px] text-[13px] leading-5 text-[#DDF6ED]">{description}</p>

              <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
                {mobileCore.map((item, index) => {
                  const ItemIcon = item.icon;
                  return (
                    <div key={item.label} className="flex gap-3 py-4">
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DDF6ED] ring-1 ring-[#BFEBDD]">
                        <ItemIcon className="h-[18px] w-[18px] text-[#0B6F5B]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-extrabold uppercase tracking-[0.15em] text-[#A7F3D0]">0{index + 1}</span>
                          <span className="h-1 w-1 rounded-full bg-emerald-200/60" />
                          <span className="text-[8px] font-extrabold uppercase tracking-[0.15em] text-[#D1FAE5]">{item.label}</span>
                        </div>
                        <h3 className="mt-1 text-[14px] font-extrabold leading-5 text-white">{item.title}</h3>
                        <p className="mt-1 text-[11px] leading-[1.45] text-[#DDF6ED]">{item.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 border-t border-white/12 pt-4">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.16em] text-[#B8F3DD]">Confianza en cada interacción</p>
                <div className="mt-3 grid grid-cols-3 divide-x divide-white/12">
                  <div className="px-2 text-center">
                    <ShieldCheck className="mx-auto h-4 w-4 text-[#B8F3DD]" />
                    <p className="mt-1.5 text-[10px] font-extrabold text-white">Reputación</p>
                  </div>
                  <div className="px-2 text-center">
                    <Flag className="mx-auto h-4 w-4 text-[#FCD34D]" />
                    <p className="mt-1.5 text-[10px] font-extrabold text-white">Moderación</p>
                  </div>
                  <div className="px-2 text-center">
                    <MapPin className="mx-auto h-4 w-4 text-[#BAE6FD]" />
                    <p className="mt-1.5 text-[10px] font-extrabold text-white">Trazabilidad</p>
                  </div>
                </div>
              </div>

              <details className="group mt-4 border-t border-white/10 pt-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.13em] text-[#DDF6ED]">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#A7F3D0]" />
                    {trust.transparencyTitle || 'Compromiso de Transparencia'}
                  </span>
                  <span className="text-[9px] font-bold text-[#A7F3D0]">Ver detalle</span>
                </summary>
                <p className="pt-2 text-[10.5px] leading-[1.5] text-[#DDF6ED]">{commitmentText}</p>
              </details>
            </div>
          </div>
        </div>

        {/* Tablet / desktop: stable presentation */}
        <div className="hidden sm:block">
          <div className="text-center max-w-6xl mx-auto mb-10 sm:mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18B68B] text-white text-xs font-bold uppercase tracking-wider border border-[#18B68B]">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>{badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight lg:whitespace-nowrap">{title}</h2>
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed">{description}</p>
          </div>

          <div className="md:grid md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {pillars.map((pilar, idx) => (
              <div key={idx} className="bg-white/90 p-6 rounded-2xl border border-slate-200 hover:border-[#18B68B]/60 transition-all group shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  {iconMap[idx] || <CheckCircle className="w-6 h-6 text-[#18B68B]" />}
                </div>
                <h3 className="text-lg font-bold text-slate-950 mb-2 group-hover:text-[#0E8067] transition-colors">{pilar.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{pilar.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 max-w-4xl mx-auto bg-white/85 rounded-2xl p-6 border border-slate-200 text-center space-y-2 shadow-sm">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{trust.transparencyTitle || 'Compromiso de Transparencia'}</p>
            <p className="text-sm text-slate-600">{commitmentText}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
