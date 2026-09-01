import { Store, MapPin, Tag, MessageSquare, ArrowRight, Star, TrendingUp, CheckCircle } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface BusinessProps {
  onSelectRole: (role: 'comercio' | 'servicio') => void;
  onScrollToForm: () => void;
}

export function BusinessSection({ onSelectRole, onScrollToForm }: BusinessProps) {
  const { content } = useSiteContent();
  const businesses = content.businesses || [];
  const section = content.businessSection;
  const featureIcons = [MapPin, Tag, MessageSquare, TrendingUp];
  const openBusinessPortal = () => window.location.assign('https://negocios.elbarrio.lat/');

  return (
    <section id="comercios" className="relative overflow-hidden border-b border-emerald-900/10 bg-white py-20">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
            <Store className="w-4 h-4 text-[#18B68B]" />
            <span>{section.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {section.title} <span className="text-[#18B68B]">{section.titleHighlight}</span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            {section.subtitle}
          </p>
        </div>

        {/* Local business image + key benefits */}
        <div className="mb-16 grid grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1.25fr]">
          <figure className="relative min-h-[340px] overflow-hidden rounded-3xl lg:min-h-[430px]">
            <img src="/landing-media/comercio-local.jpg" alt="Comercio local de barrio" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
            <figcaption className="absolute bottom-0 left-0 p-6 text-lg font-extrabold text-white sm:p-8">
              Tu negocio, visible para quienes viven cerca.
            </figcaption>
          </figure>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {section.features.map((feature, index) => {
              const Icon = featureIcons[index % featureIcons.length];
              return (
                <div key={`${feature.title}-${index}`} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#18B68B] transition-all">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#18B68B] flex items-center justify-center font-bold mb-4"><Icon className="w-5 h-5" /></div>
                  <h3 className="font-bold text-slate-900 text-base mb-1.5">{feature.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Local Business Cards */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-slate-900 text-center mb-6">
            {section.profilesTitle}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {businesses.map(biz => (
              <div key={biz.id} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-start gap-4">
                <img 
                  loading="lazy"
                  decoding="async"
                  src={biz.avatar} 
                  alt={biz.name}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=120&q=80';
                  }}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#18B68B] bg-emerald-50 px-2 py-0.5 rounded">
                      {biz.category}
                    </span>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" /> {biz.rating}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm truncate mt-1">{biz.name}</h4>
                  <p className="text-xs text-slate-500">{biz.addressApprox} • <span className="text-slate-700 font-medium">{biz.commune}</span></p>
                  <p className="text-xs font-semibold text-emerald-700 mt-1">{biz.discount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Callout Card */}
        <div className="mt-12 bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40 rounded-3xl p-6 sm:p-8 lg:p-10 border border-emerald-100 shadow-sm w-full text-center space-y-5">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {section.actionTitle}
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {section.actionText}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={openBusinessPortal}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm text-sm"
            >
              <Store className="w-4 h-4 text-[#18B68B]" />
              <span>{section.commerceCta}</span>
            </button>
            <button
              onClick={openBusinessPortal}
              className="w-full sm:w-auto bg-[#18B68B] hover:bg-[#15a27c] text-white font-bold px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{section.serviceCta}</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
