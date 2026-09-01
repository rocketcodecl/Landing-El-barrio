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

  return (
    <section
      id="seguridad"
      className="relative overflow-hidden bg-white py-20 text-slate-950"
      style={{ backgroundImage: "url('/landing-media/barrio-comunidad.jpg')", backgroundPosition: 'center 48%', backgroundSize: 'cover' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-white/90" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18B68B] text-white text-xs font-bold uppercase tracking-wider border border-[#18B68B]">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>{badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            {title}
          </h2>

          <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
            {description}
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pilar, idx) => (
            <div 
              key={idx}
              className="bg-white/90 p-6 rounded-2xl border border-slate-200 hover:border-[#18B68B]/60 transition-all group shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                {iconMap[idx] || <CheckCircle className="w-6 h-6 text-[#18B68B]" />}
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-2 group-hover:text-[#0E8067] transition-colors">
                {pilar.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {pilar.description}
              </p>
            </div>
          ))}
        </div>

        {/* Transparency Commitment Note */}
        <div className="mt-14 max-w-4xl mx-auto bg-white/85 rounded-2xl p-6 border border-slate-200 text-center space-y-2 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
            {trust.transparencyTitle || 'Compromiso de Transparencia'}
          </p>
          <p className="text-xs sm:text-sm text-slate-600">
            {commitmentText}
          </p>
        </div>

      </div>
    </section>
  );
}
