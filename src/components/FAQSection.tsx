import { useState } from 'react';
import { ArrowUpRight, ChevronDown, HelpCircle, Mail, ShieldCheck, Store } from 'lucide-react';
import { FAQCategory } from '../types';
import { useSiteContent } from '../context/SiteContentContext';

type CategoryFilter = FAQCategory | 'all';

const categoryLabels: Record<FAQCategory, string> = {
  general: 'General',
  seguridad: 'Seguridad',
  comercios: 'Comercios',
};

export function FAQSection() {
  const { content } = useSiteContent();
  const faqs = content.faqs || [];
  const supportEmail = content.branding?.supportEmail || 'contacto@elbarrio.lat';

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const filteredItems = activeCategory === 'all'
    ? faqs
    : faqs.filter((item) => item.category === activeCategory);

  const selectCategory = (category: CategoryFilter) => {
    setActiveCategory(category);
    const nextItems = category === 'all'
      ? faqs
      : faqs.filter((item) => item.category === category);
    setOpenId(nextItems[0]?.id || null);
  };

  const categories = [
    { id: 'all' as const, label: 'Todas', icon: HelpCircle, count: faqs.length },
    { id: 'general' as const, label: 'General', icon: HelpCircle, count: faqs.filter((item) => item.category === 'general').length },
    { id: 'seguridad' as const, label: 'Seguridad', icon: ShieldCheck, count: faqs.filter((item) => item.category === 'seguridad').length },
    { id: 'comercios' as const, label: 'Comercios', icon: Store, count: faqs.filter((item) => item.category === 'comercios').length },
  ];

  return (
    <section id="faq" className="relative overflow-hidden bg-[#F3F8F6] py-20 sm:py-24">
      <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-[#18B68B]/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-emerald-200/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div className="lg:col-span-4">
          <div className="space-y-6 lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-800 shadow-sm">
              <HelpCircle className="h-4 w-4" aria-hidden="true" />
              Respuestas claras
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
                Lo importante, <span className="text-[#0E8067]">sin letra chica.</span>
              </h2>
              <p className="max-w-md text-base leading-relaxed text-slate-600 sm:text-lg">
                Cómo funciona El Barrio, qué protegemos y cómo pueden participar vecinos, comercios y servicios locales.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">¿Te quedó alguna duda?</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Escríbenos y conversemos sobre tu comuna o tu negocio local.
              </p>
              <a
                href={`mailto:${supportEmail}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-[#0E8067] transition-colors hover:text-emerald-950"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {supportEmail}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div
            className="mb-5 flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm"
            role="group"
            aria-label="Filtrar preguntas frecuentes"
          >
            {categories.map(({ id, label, icon: Icon, count }) => {
              const isActive = activeCategory === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectCategory(id)}
                  aria-pressed={isActive}
                  className={`flex min-w-max flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-extrabold transition-all sm:text-sm ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-300' : 'text-[#0E8067]'}`} aria-hidden="true" />
                  <span>{label}</span>
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${isActive ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_-42px_rgba(15,23,42,0.45)]">
            {filteredItems.map((item, index) => {
              const isOpen = openId === item.id;
              const panelId = `faq-panel-${item.id}`;

              return (
                <article key={item.id} className="border-b border-slate-200 last:border-b-0">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="group flex w-full items-start gap-4 px-5 py-5 text-left sm:gap-5 sm:px-7 sm:py-6"
                    >
                      <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold transition-colors ${
                        isOpen ? 'bg-[#0E8067] text-white' : 'bg-emerald-50 text-[#0E8067] group-hover:bg-emerald-100'
                      }`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#0E8067]">
                          {categoryLabels[item.category]}
                        </span>
                        <span className="block text-base font-extrabold leading-snug text-slate-900 sm:text-lg">
                          {item.question}
                        </span>
                      </span>

                      <span className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all ${
                        isOpen
                          ? 'rotate-180 border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-500 group-hover:border-emerald-300 group-hover:text-[#0E8067]'
                      }`}>
                        <ChevronDown className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </button>
                  </h3>

                  {isOpen && (
                    <div id={panelId} role="region" className="px-5 pb-6 pl-[4.25rem] sm:px-7 sm:pb-7 sm:pl-[5rem]">
                      <p className="max-w-2xl border-l-2 border-emerald-200 pl-4 text-sm leading-7 text-slate-600 sm:text-base">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
