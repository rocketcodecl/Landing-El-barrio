import { useState } from 'react';
import { ArrowRight, ShieldCheck, MapPin, Sparkles, Store, ShoppingBag, Bell, MessageSquare, CheckCircle2 } from 'lucide-react';
import { BrandIsotype } from './BrandLogo';
import { useSiteContent } from '../context/SiteContentContext';

interface HeroProps {
  onSelectRole: (role: 'vecino' | 'comercio' | 'servicio') => void;
  onScrollToForm: () => void;
}

export function Hero({ onSelectRole, onScrollToForm }: HeroProps) {
  const { content } = useSiteContent();
  const hero = content.hero;

  const [activeTab, setActiveTab] = useState<'feed' | 'mercado' | 'mapa' | 'alertas'>('feed');

  const handleNeighborClick = () => {
    onSelectRole('vecino');
    onScrollToForm();
  };

  const handleBusinessClick = () => {
    onSelectRole('comercio');
    onScrollToForm();
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 bg-gradient-to-b from-[#FAFDFB] via-[#F1F9F6] to-[#FAFDFB]">
      {/* Soft Background Accent Spheres */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial from-[#18B68B]/10 via-transparent to-transparent pointer-events-none blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & Action */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            
            {/* Activation Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-[#18B68B]/30 text-emerald-800 text-xs sm:text-sm font-semibold shadow-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#18B68B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#18B68B]"></span>
              </span>
              <span>{hero.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              {hero.titlePart1} <br className="hidden sm:inline" />
              <span className="text-[#18B68B] italic relative inline-block text-5xl sm:text-6xl lg:text-7xl font-extrabold">
                {hero.titleHighlight}
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#18B68B]/30" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
                  <path d="M2 9C50 3 150 3 198 9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
              {hero.titlePart2}
            </h1>

            {/* Subheading Value Prop */}
            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl">
              {hero.description}
            </p>

            {/* Value Highlights */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-700 font-medium py-1">
              {hero.highlights.map((highlight) => (
                <div key={highlight} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#18B68B]" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
              <button
                onClick={handleNeighborClick}
                className="bg-[#18B68B] hover:bg-[#15a27c] text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-[#18B68B]/30 hover:shadow-xl hover:shadow-[#18B68B]/40 transition-all flex items-center justify-center gap-3 text-base cursor-pointer active:scale-[0.98]"
              >
                <span>{hero.ctaVecino}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={handleBusinessClick}
                className="bg-white hover:bg-emerald-50/50 text-slate-800 font-bold px-6 py-4 rounded-xl border-2 border-emerald-800/20 hover:border-[#18B68B] transition-all flex items-center justify-center gap-2.5 text-base cursor-pointer"
              >
                <Store className="w-5 h-5 text-[#18B68B]" />
                <span>{hero.ctaComercio}</span>
              </button>
            </div>

          </div>

          {/* Right Column: Interactive Smartphone App Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[300px] sm:max-w-[320px]">
              <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                {hero.previewLabel}
              </p>
              
              {/* Decorative Glow Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#18B68B]/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-[#18B68B]/25 rounded-full blur-2xl pointer-events-none" />

              {/* Physical Smartphone Shell */}
              <div className="relative bg-slate-950 p-3.5 rounded-[46px] shadow-2xl border-4 border-slate-800 ring-1 ring-white/10">
                
                {/* Side Physical Buttons */}
                <div className="absolute -left-2 top-24 w-1 h-7 bg-slate-700 rounded-l-md" />
                <div className="absolute -left-2 top-34 w-1 h-7 bg-slate-700 rounded-l-md" />
                <div className="absolute -right-2 top-28 w-1 h-10 bg-slate-700 rounded-r-md" />

                {/* iPhone Dynamic Island / Camera Notch */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-950 rounded-full z-30 flex items-center justify-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800" />
                  <div className="w-2 h-2 rounded-full bg-emerald-950/60" />
                </div>

                {/* Smartphone Display Screen (Portrait 9:19 ratio) */}
                <div className="bg-[#FAFDFB] rounded-[36px] overflow-hidden border border-slate-200 h-[560px] sm:h-[580px] flex flex-col relative">
                  
                  {/* App Status Bar & Header */}
                  <div className="bg-white px-4 pt-7 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BrandIsotype size="sm" />
                      <div>
                        <div className="flex items-center gap-1 font-extrabold text-slate-900 text-xs">
                          <span>{hero.simulatorSector}</span>
                          <span className="inline-block w-2 h-2 rounded-full bg-[#18B68B]"></span>
                        </div>
                        <p className="text-[9px] text-slate-500 font-medium">{hero.simulatorNeighborsCount}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] bg-emerald-100 text-[#18B68B] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> {hero.verifiedLabel}
                      </span>
                    </div>
                  </div>

                  {/* App Viewport Switcher Tabs */}
                  <div className="bg-slate-100/80 p-1 flex gap-1 border-b border-slate-200/60 text-xs font-semibold">
                    <button
                      onClick={() => setActiveTab('feed')}
                      aria-pressed={activeTab === 'feed'}
                      className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                        activeTab === 'feed'
                          ? 'bg-white text-[#18B68B] shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {hero.tabFeed}
                    </button>
                    <button
                      onClick={() => setActiveTab('mercado')}
                      aria-pressed={activeTab === 'mercado'}
                      className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                        activeTab === 'mercado'
                          ? 'bg-white text-[#18B68B] shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {hero.tabMarket}
                    </button>
                    <button
                      onClick={() => setActiveTab('mapa')}
                      aria-pressed={activeTab === 'mapa'}
                      className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                        activeTab === 'mapa'
                          ? 'bg-white text-[#18B68B] shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {hero.tabMap}
                    </button>
                    <button
                      onClick={() => setActiveTab('alertas')}
                      aria-pressed={activeTab === 'alertas'}
                      className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                        activeTab === 'alertas'
                          ? 'bg-white text-[#18B68B] shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {hero.tabAlerts}
                    </button>
                  </div>

                  {/* Interactive Tab Body */}
                  <div className="p-3 flex-1 overflow-y-auto space-y-3 bg-[#FAFDFB]">
                    
                    {activeTab === 'feed' && (
                      <>
                        {/* Feed Card 1 */}
                        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img className="w-7 h-7 rounded-full object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Avatar" />
                              <div>
                                <h4 className="text-xs font-bold text-slate-900">Carlos M.</h4>
                                <p className="text-[10px] text-slate-500">A 250m • Hace 15 min</p>
                              </div>
                            </div>
                            <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-md">
                              Arriendo
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-800 leading-snug">
                            Arriendo mi cortadora de césped para el fin de semana 🌿
                          </p>
                          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                            <span className="font-extrabold text-[#18B68B]">$5.000 / día</span>
                            <span className="text-slate-500 font-medium hover:text-[#18B68B] cursor-pointer">💬 4 comentarios</span>
                          </div>
                        </div>

                        {/* Feed Card 2 */}
                        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img className="w-7 h-7 rounded-full object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" alt="Avatar" />
                              <div>
                                <h4 className="text-xs font-bold text-slate-900">María Paz S.</h4>
                                <p className="text-[10px] text-slate-500">A 180m • Hace 42 min</p>
                              </div>
                            </div>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                              ¡Regalo!
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-800 leading-snug">
                            Regalo maceteros de greda y suculentas para balcón.
                          </p>
                          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                            <span className="font-extrabold text-emerald-600">Gratis (Retiro en pasaje)</span>
                            <span className="text-slate-500 font-medium cursor-pointer">💬 8 coordinaciones</span>
                          </div>
                        </div>

                        {/* Feed Card 3 */}
                        <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/80 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                              🍞 Oferta Local
                            </span>
                            <span className="text-[10px] text-amber-700">Panadería Don José</span>
                          </div>
                          <p className="text-xs font-bold text-amber-950">
                            20% dcto en marraquetas calientes a las 18:30 hrs
                          </p>
                        </div>
                      </>
                    )}

                    {activeTab === 'mercado' && (
                      <div className="space-y-2.5">
                        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                          <div className="flex gap-2">
                            <img className="w-14 h-14 rounded-xl object-cover" src="https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=200&q=80" alt="Césped" />
                            <div className="flex-1">
                              <span className="text-[9px] font-bold bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">Herramientas</span>
                              <h5 className="text-xs font-bold text-slate-900 mt-0.5">Cortadora de césped</h5>
                              <p className="text-[10px] text-slate-500">Arriendo directo entre vecinos</p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs font-extrabold text-[#18B68B]">$5.000 / día</span>
                                <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">Enviar Oferta</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                          <div className="flex gap-2">
                            <img className="w-14 h-14 rounded-xl object-cover" src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=200&q=80" alt="Plantas" />
                            <div className="flex-1">
                              <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Donación</span>
                              <h5 className="text-xs font-bold text-slate-900 mt-0.5">Maceteros de greda</h5>
                              <p className="text-[10px] text-slate-500">A 180m de tu ubicación</p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs font-extrabold text-emerald-700">¡Gratis!</span>
                                <span className="text-[10px] font-semibold text-[#18B68B] bg-emerald-50 px-2 py-0.5 rounded-md">Pedir por Chat</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'mapa' && (
                      <div className="space-y-2">
                        <div className="relative h-44 rounded-2xl bg-emerald-950/10 border border-slate-300 overflow-hidden flex items-center justify-center p-4">
                          <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 400 300" fill="none">
                            <path d="M0 50 Q 200 80, 400 30" stroke="#cbd5e1" strokeWidth="8" />
                            <path d="M120 0 Q 150 150, 180 300" stroke="#cbd5e1" strokeWidth="6" />
                            <path d="M0 200 Q 250 180, 400 240" stroke="#cbd5e1" strokeWidth="6" />
                            <circle cx="160" cy="110" r="40" fill="#18B68B" fillOpacity="0.15" stroke="#18B68B" strokeWidth="2" strokeDasharray="4 4" />
                          </svg>

                          <div className="absolute top-10 left-16 bg-white px-2 py-1 rounded-full shadow-md text-[10px] font-bold text-slate-800 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Panadería
                          </div>

                          <div className="absolute bottom-12 right-14 bg-[#18B68B] text-white px-2 py-1 rounded-full shadow-md text-[10px] font-bold flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> Tu Casa
                          </div>

                          <div className="absolute top-14 right-20 bg-amber-500 text-white px-2 py-1 rounded-full shadow-md text-[10px] font-bold flex items-center gap-1">
                            <span>☕ Café Esquina</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-center text-slate-500 font-medium">
                          📍 Tu dirección exacta permanece privada. Solo tu cuadrante aproximado.
                        </p>
                      </div>
                    )}

                    {activeTab === 'alertas' && (
                      <div className="space-y-2">
                        <div className="bg-red-50 p-3 rounded-2xl border border-red-200 space-y-1">
                          <div className="flex items-center justify-between text-red-700 text-[10px] font-bold">
                            <span className="flex items-center gap-1">⚠️ Alerta Territorial</span>
                            <span>Ayer 19:40</span>
                          </div>
                          <h5 className="text-xs font-bold text-red-950">Corte programado de agua potable</h5>
                          <p className="text-[11px] text-red-800">Mañana entre 14:00 y 18:00 hrs en tu cuadrante.</p>
                        </div>

                        <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 space-y-1">
                          <div className="flex items-center justify-between text-[#18B68B] text-[10px] font-bold">
                            <span>📢 Aviso de Seguridad</span>
                            <span>Verificado</span>
                          </div>
                          <h5 className="text-xs font-bold text-slate-900">Mascota encontrada en la plaza</h5>
                          <p className="text-[11px] text-slate-700">Perro Poodle blanco con collar azul. En resguardo por vecina Claudia.</p>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* App Bottom Navigation Bar */}
                  <div className="bg-white border-t border-slate-200 py-2 px-6 flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <div className="flex flex-col items-center text-[#18B68B]">
                      <Sparkles className="w-4 h-4" />
                      <span>Inicio</span>
                    </div>
                    <div className="flex flex-col items-center hover:text-slate-600 cursor-pointer">
                      <ShoppingBag className="w-4 h-4" />
                      <span>Tratos</span>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#18B68B] text-white flex items-center justify-center -mt-4 shadow-md shadow-[#18B68B]/30 cursor-pointer">
                      <span className="text-lg font-light leading-none">+</span>
                    </div>
                    <div className="flex flex-col items-center hover:text-slate-600 cursor-pointer">
                      <Bell className="w-4 h-4" />
                      <span>Alertas</span>
                    </div>
                    <div className="flex flex-col items-center hover:text-slate-600 cursor-pointer">
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat</span>
                    </div>
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
