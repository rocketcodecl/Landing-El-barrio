import { useState } from 'react';
import { ChevronDown, HelpCircle, Shield, Store, MessageCircle, Sparkles } from 'lucide-react';
import { FAQCategory } from '../types';
import { useSiteContent } from '../context/SiteContentContext';

export function FAQSection() {
  const { content } = useSiteContent();
  const faqs = content.faqs || [];

  const [activeCategory, setActiveCategory] = useState<FAQCategory | 'all'>('all');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-2': true
  });

  const toggleItem = (id: string) => {
    setOpenIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredItems = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(item => item.category === activeCategory);

  return (
    <section id="faq" className="py-24 bg-[#FAFDFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-slate-200/80 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-[#18B68B] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Transparencia & Respuestas</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Preguntas Frecuentes
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Todo lo que necesitas saber sobre el funcionamiento, seguridad y activación comunitaria en tu barrio.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Todas las preguntas
            </button>
            <button
              onClick={() => setActiveCategory('general')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeCategory === 'general'
                  ? 'bg-[#18B68B] text-white shadow-md shadow-[#18B68B]/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>General</span>
            </button>
            <button
              onClick={() => setActiveCategory('seguridad')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeCategory === 'seguridad'
                  ? 'bg-[#18B68B] text-white shadow-md shadow-[#18B68B]/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Seguridad & Privacidad</span>
            </button>
            <button
              onClick={() => setActiveCategory('comercios')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeCategory === 'comercios'
                  ? 'bg-[#18B68B] text-white shadow-md shadow-[#18B68B]/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Comercios & Locales</span>
            </button>
          </div>
        </div>

        {/* 1 per line Full-Width List */}
        <div className="space-y-4 w-full">
          {filteredItems.map((item) => {
            const isOpen = !!openIds[item.id];
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden w-full ${
                  isOpen 
                    ? 'border-[#18B68B]/60 shadow-md ring-1 ring-[#18B68B]/20' 
                    : 'border-slate-200/90 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-extrabold text-slate-900 text-base sm:text-lg leading-snug">
                    {item.question}
                  </span>
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 ${
                      isOpen ? 'bg-[#18B68B] text-white rotate-180' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 bg-slate-50/40">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Additional Help Callout */}
        <div className="mt-14 bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold">¿Tienes otra consulta sobre tu comuna?</h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl">
              Estamos respondiendo directamente a coordinadores vecinales, juntas de vecinos y dueños de locales comerciales.
            </p>
          </div>
          <a
            href="https://api.whatsapp.com/send?phone=56912345678&text=Hola%20tengo%20una%20consulta%20sobre%20El%20Barrio"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#18B68B] hover:bg-[#15a27c] text-white font-bold px-7 py-3.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shrink-0 text-sm"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Hablar con el equipo por WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
}
