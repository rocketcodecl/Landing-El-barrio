import { useState } from 'react';
import { NeighborhoodPost } from '../types';
import { ShieldCheck, Heart, MessageSquare, Tag, AlertTriangle, Gift, Wrench, Store, Sparkles } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface LiveSceneProps {
  onInteractPost?: (post: NeighborhoodPost) => void;
}

export function LiveNeighborhoodScene({ onInteractPost }: LiveSceneProps) {
  const { content } = useSiteContent();
  const posts = content.posts || [];

  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const [likedPosts, setLikedPosts] = useState<Record<string, number>>({});

  const filteredPosts = posts.filter(post => {
    if (activeFilter === 'todos') return true;
    if (activeFilter === 'mercado') return post.type === 'venta' || post.type === 'arriendo';
    if (activeFilter === 'regalo') return post.type === 'regalo';
    if (activeFilter === 'ayuda') return post.type === 'ayuda' || post.type === 'servicio';
    if (activeFilter === 'comercio') return post.type === 'comercio';
    if (activeFilter === 'alerta') return post.type === 'alerta';
    return true;
  });

  const handleLike = (id: string) => {
    setLikedPosts(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const getBadgeColor = (type: NeighborhoodPost['type']) => {
    switch (type) {
      case 'arriendo': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'regalo': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'comercio': return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'alerta': return 'bg-red-100 text-red-800 border-red-200';
      case 'ayuda': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'servicio': return 'bg-teal-100 text-teal-800 border-teal-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getTypeIcon = (type: NeighborhoodPost['type']) => {
    switch (type) {
      case 'arriendo': return <Wrench className="w-3.5 h-3.5" />;
      case 'regalo': return <Gift className="w-3.5 h-3.5" />;
      case 'comercio': return <Store className="w-3.5 h-3.5" />;
      case 'alerta': return <AlertTriangle className="w-3.5 h-3.5 text-red-600" />;
      default: return <Tag className="w-3.5 h-3.5" />;
    }
  };

  return (
    <section id="asi-se-vive" className="py-20 bg-white border-y border-emerald-900/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#18B68B] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Vista referencial de la experiencia</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Así se vive <span className="text-[#18B68B]">El Barrio</span> cada día
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Ejemplos de cómo vecinos, comercios y servicios podrían encontrarse dentro de un mismo cuadrante.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4" role="group" aria-label="Filtrar ejemplos de publicaciones">
            {[
              { id: 'todos', label: 'Todos los avisos' },
              { id: 'mercado', label: '🛒 Mercado & Arriendos' },
              { id: 'regalo', label: '🎁 Regalos & Trueques' },
              { id: 'ayuda', label: '🤝 Ayuda & Servicios' },
              { id: 'comercio', label: '🏪 Promos Locales' },
              { id: 'alerta', label: '⚠️ Alertas Vecinales' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                aria-pressed={activeFilter === tab.id}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#18B68B] text-white shadow-md shadow-[#18B68B]/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-[#18B68B]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Posts Stream Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => {
            const extraLikes = likedPosts[post.id] || 0;
            return (
              <div
                key={post.id}
                className={`bg-white rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between ${
                  post.urgent 
                    ? 'border-red-300 ring-2 ring-red-400/20 bg-gradient-to-b from-red-50/40 to-white' 
                    : 'border-slate-200/90 hover:border-[#18B68B]/50'
                }`}
              >
                <div>
                  {/* Author Row */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={post.author.avatar} 
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/20"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-slate-900 text-sm">{post.author.name}</h3>
                          {post.author.verified && (
                            <ShieldCheck className="w-4 h-4 text-[#18B68B]" title="Vecino Verificado" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {post.distance} • <span className="text-emerald-700 font-semibold">{post.author.commune}</span>
                        </p>
                      </div>
                    </div>

                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${getBadgeColor(post.type)}`}>
                      {getTypeIcon(post.type)}
                      <span className="capitalize">{post.type}</span>
                    </span>
                  </div>

                  {/* Post Image */}
                  <div className="relative h-48 sm:h-52 rounded-xl overflow-hidden mb-3.5 border border-slate-100 shadow-2xs group-hover:shadow-xs transition-shadow bg-slate-100">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      onError={(e) => {
                        const fallbacks: Record<string, string> = {
                          arriendo: 'https://images.unsplash.com/photo-1558904541-efa8c4a08931?auto=format&fit=crop&w=600&q=80',
                          regalo: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
                          comercio: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=600&q=80',
                          ayuda: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
                          alerta: 'https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&w=600&q=80',
                          servicio: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80'
                        };
                        e.currentTarget.src = fallbacks[post.type] || 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      {getTypeIcon(post.type)}
                      <span>{post.type}</span>
                    </div>
                    {post.price && (
                      <div className="absolute bottom-2.5 left-2.5 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-extrabold shadow-sm">
                        {post.price}
                      </div>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h4 className="font-extrabold text-slate-900 text-base mb-1.5 leading-snug">
                    {post.title}
                  </h4>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                    {post.description}
                  </p>
                </div>

                {/* Footer Interaction Bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer group"
                    >
                      <Heart className={`w-4 h-4 group-hover:scale-110 transition-transform ${extraLikes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                      <span>{post.likes + extraLikes}</span>
                    </button>

                    <div className="flex items-center gap-1 text-slate-500">
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <span>{post.commentsCount} respuestas</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-medium text-slate-400">
                    {post.timeAgo}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 bg-gradient-to-r from-emerald-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold">
              ¿Tienes algo para vender, regalar o arreglar en tu sector?
            </h3>
            <p className="text-emerald-200 text-sm max-w-xl">
              Publica en segundos y conversa directamente con tus vecinos por chat seguro. Sin intermediarios ni cobros.
            </p>
          </div>

          <a 
            href="#registro"
            className="whitespace-nowrap bg-[#18B68B] hover:bg-[#15a27c] text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
          >
            Publicar en mi barrio
          </a>
        </div>

      </div>
    </section>
  );
}
