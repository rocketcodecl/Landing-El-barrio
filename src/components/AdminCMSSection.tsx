import React, { useState } from 'react';
import { useSiteContent } from '../context/SiteContentContext';
import { NeighborhoodPost, LocalBusiness, FAQItem } from '../types';
import { UniversalContentEditor } from './UniversalContentEditor';
import { AdminMediaLibrary } from './AdminMediaLibrary';
import {
  Palette,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Store,
  HelpCircle,
  FileText,
  Save,
  RotateCcw,
  Download,
  Upload,
  Plus,
  Trash2,
  Image,
  ExternalLink,
  CheckCircle,
  Eye,
  Layers,
  ChevronRight,
  ChevronDown,
  Settings2,
  Code2,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export function AdminCMSSection() {
  const {
    content,
    updateContent,
    updateSection,
    updatePost,
    addPost,
    deletePost,
    updateBusiness,
    addBusiness,
    deleteBusiness,
    updateFAQ,
    addFAQ,
    deleteFAQ,
    resetToDefaults,
    exportContentJSON,
    importContentJSON,
    isVisualEditMode,
    setIsVisualEditMode,
    saveStatus,
    saveError
  } = useSiteContent();

  const [activeSubTab, setActiveSubTab] = useState<
    'design' | 'seo' | 'media' | 'layout' | 'all' | 'branding' | 'hero' | 'posts' | 'benefits' | 'trust' | 'businesses' | 'localAds' | 'faqs' | 'waitlistForm' | 'footer'
  >('design');

  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingBusinessId, setEditingBusinessId] = useState<string | null>(null);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [heroImageUploading, setHeroImageUploading] = useState(false);
  const [heroImageMessage, setHeroImageMessage] = useState<string | null>(null);
  const [fullEditorText, setFullEditorText] = useState(() => JSON.stringify(content, null, 2));
  const [fullEditorError, setFullEditorError] = useState<string | null>(null);

  const notifySaved = () => {
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 2500);
  };

  const uploadHeroImage = async (file: File) => {
    setHeroImageUploading(true);
    setHeroImageMessage(null);
    try {
      const dataBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('No fue posible leer la imagen'));
        reader.readAsDataURL(file);
      });
      const response = await fetch('/api/media', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, mimeType: file.type, dataBase64 }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body.url) throw new Error(body.error || 'No fue posible subir la imagen');
      updateSection('hero', { previewImageUrl: body.url });
      notifySaved();
      setHeroImageMessage('Imagen actualizada. Se guardará automáticamente.');
    } catch (error) {
      setHeroImageMessage(error instanceof Error ? error.message : 'Error al subir la imagen');
    } finally {
      setHeroImageUploading(false);
    }
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= content.layout.sections.length) return;
    const sections = [...content.layout.sections];
    [sections[index], sections[nextIndex]] = [sections[nextIndex], sections[index]];
    updateSection('layout', { sections });
    notifySaved();
  };

  const applyFullEditor = () => {
    try {
      const parsed = JSON.parse(fullEditorText);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('El contenido debe ser un objeto JSON');
      updateContent(parsed);
      setFullEditorError(null);
      notifySaved();
    } catch (error) {
      setFullEditorError(error instanceof Error ? error.message : 'JSON inválido');
    }
  };

  const handleAddNewPost = () => {
    const newId = `post-${Date.now()}`;
    const newPost: NeighborhoodPost = {
      id: newId,
      author: {
        name: 'Nuevo Vecino',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        commune: 'Las Condes',
        verified: true,
        badge: 'Vecino Activo',
        reputation: 5.0,
      },
      type: 'servicio',
      title: 'Título de la nueva publicación vecinal',
      description: 'Describe el producto, arriendo, regalo o servicio para la comunidad de Las Condes.',
      price: '$5.000',
      distance: 'A 200m de ti',
      timeAgo: 'Hace 5 min',
      likes: 1,
      commentsCount: 0,
      tags: ['Comunidad', 'Las Condes'],
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    };
    addPost(newPost);
    setEditingPostId(newId);
    notifySaved();
  };

  const handleAddNewBusiness = () => {
    const newId = `b-${Date.now()}`;
    const newBiz: LocalBusiness = {
      id: newId,
      name: 'Nuevo Comercio de Barrio',
      category: 'Almacén & Servicios',
      owner: 'Nombre del Dueño/a',
      commune: 'Las Condes',
      addressApprox: 'Sector El Golf',
      avatar: 'https://images.unsplash.com/photo-1556742049-0a67e55722c3?auto=format&fit=crop&w=120&q=80',
      coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      discount: '10% de descuento para vecinos de Las Condes',
      description: 'Excelente atención de barrio con productos frescos y atención personalizada.',
      verified: true,
      whatsapp: '+56912345678',
      rating: 5.0,
      reviewsCount: 10
    };
    addBusiness(newBiz);
    setEditingBusinessId(newId);
    notifySaved();
  };

  const handleAddNewFAQ = () => {
    const newId = `faq-${Date.now()}`;
    const newFaq: FAQItem = {
      id: newId,
      category: 'general',
      question: '¿Nueva pregunta frecuente sobre El Barrio?',
      answer: 'Escribe aquí la respuesta detallada y transparente para los vecinos y comerciantes.'
    };
    addFAQ(newFaq);
    setEditingFaqId(newId);
    notifySaved();
  };

  const sampleImageSuggestions = [
    { label: 'Cortadora / Jardín', url: 'https://images.unsplash.com/photo-1558904541-efa8c4a08931?auto=format&fit=crop&w=600&q=80' },
    { label: 'Plantas / Terraza', url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80' },
    { label: 'Empanadas / Panadería', url: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=600&q=80' },
    { label: 'Gasfitería / Hogar', url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80' },
    { label: 'Corte de Agua / Alerta', url: 'https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&w=600&q=80' },
    { label: 'Taller Bicicletas', url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80' },
    { label: 'Cafetería de Especialidad', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80' },
    { label: 'Minimarket Frutería', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Toolbar */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 sm:p-5 rounded-2xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-700">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-[#18B68B] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
              CMS conectado
            </span>
            <h4 className="font-extrabold text-base text-white">Editor Global de Contenido, Textos, Imágenes y Logos</h4>
          </div>
          <p className="text-xs text-slate-300">
            Los cambios se aplican en tiempo real y se guardan automáticamente en el servidor.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {saveStatus === 'saved' && (
            <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Guardado
            </span>
          )}
          {saveStatus === 'saving' && <span className="rounded-xl border border-amber-400/30 bg-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-200">Guardando…</span>}
          {saveStatus === 'error' && <span title={saveError || ''} className="rounded-xl border border-red-400/30 bg-red-500/20 px-3 py-1.5 text-xs font-bold text-red-200">Error al guardar</span>}

          <button
            onClick={exportContentJSON}
            className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer border border-slate-600 transition-colors"
            title="Exportar copia de seguridad en JSON"
          >
            <Download className="w-3.5 h-3.5" /> Exportar JSON
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer border border-slate-600 transition-colors"
            title="Importar configuración desde JSON"
          >
            <Upload className="w-3.5 h-3.5" /> Importar JSON
          </button>

          <button
            onClick={() => {
              if (window.confirm('¿Deseas restablecer todos los textos e imágenes a los valores iniciales predeterminados?')) {
                resetToDefaults();
                notifySaved();
              }
            }}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer border border-red-500/30 transition-colors"
            title="Restaurar contenido original de fábrica"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restaurar Original
          </button>
        </div>
      </div>

      {/* Sub Tabs Bar */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/80 rounded-2xl border border-slate-300">
        {[
          { id: 'design', label: 'Diseño Global', icon: Palette },
          { id: 'seo', label: 'SEO & Compartir', icon: ExternalLink },
          { id: 'media', label: 'Imágenes', icon: Image },
          { id: 'layout', label: 'Estructura & Orden', icon: Settings2 },
          { id: 'all', label: 'Control Total', icon: Code2 },
          { id: 'branding', label: 'Marca & Logos', icon: Palette },
          { id: 'hero', label: 'Hero Principal', icon: Sparkles },
          { id: 'posts', label: 'Feed ("Así se vive")', icon: MessageSquare },
          { id: 'benefits', label: '3 Beneficios', icon: Layers },
          { id: 'trust', label: 'Seguridad', icon: ShieldCheck },
          { id: 'businesses', label: 'Comercios', icon: Store },
          { id: 'localAds', label: 'Publicidad Local', icon: Eye },
          { id: 'faqs', label: 'Preguntas (FAQ)', icon: HelpCircle },
          { id: 'waitlistForm', label: 'Formulario', icon: FileText },
          { id: 'footer', label: 'Footer & Pie', icon: GlobeIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id as any);
                if (tab.id === 'all') setFullEditorText(JSON.stringify(content, null, 2));
              }}
              className={`text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-[#18B68B] shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeSubTab === 'design' && (
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="border-b border-slate-100 pb-3"><h3 className="text-lg font-black text-slate-900">Diseño global y tipografía responsive</h3><p className="text-xs text-slate-500">Controla la apariencia completa. Los tamaños se expresan en píxeles y se guardan automáticamente.</p></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <label className="text-xs font-bold text-slate-700">Familia tipográfica<input value={content.theme.fontFamily} onChange={(event) => updateSection('theme', { fontFamily: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5" /></label>
            <label className="text-xs font-bold text-slate-700 md:col-span-2">URL de Google Fonts u otra hoja tipográfica<input type="url" value={content.theme.customFontImportUrl} onChange={(event) => updateSection('theme', { customFontImportUrl: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label>
            {[
              ['baseFontSize', 'Tamaño base', 12, 24], ['navigationFontSize', 'Navegación', 10, 24], ['bodyFontSize', 'Párrafos', 12, 28], ['buttonFontSize', 'Botones', 10, 24],
              ['heroTitleDesktop', 'Título portada · escritorio', 30, 100], ['heroTitleMobile', 'Título portada · móvil', 24, 72], ['sectionTitleDesktop', 'Títulos de sección · escritorio', 24, 72], ['sectionTitleMobile', 'Títulos de sección · móvil', 20, 56],
              ['contentMaxWidth', 'Ancho máximo del contenido', 900, 1800], ['sectionSpacingDesktop', 'Espaciado de secciones · escritorio', 20, 180], ['sectionSpacingMobile', 'Espaciado de secciones · móvil', 20, 140], ['cardRadius', 'Redondeo de tarjetas', 0, 48], ['buttonRadius', 'Redondeo de botones', 0, 40], ['borderWidth', 'Grosor de bordes', 0, 6],
            ].map(([key, label, min, max]) => {
              const value = content.theme[key as keyof typeof content.theme] as number;
              return <label key={String(key)} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-700"><span className="flex justify-between"><span>{label}</span><strong>{value}px</strong></span><input type="range" min={Number(min)} max={Number(max)} value={value} onChange={(event) => updateSection('theme', { [key]: Number(event.target.value) })} className="mt-3 w-full accent-[#18B68B]" /></label>;
            })}
            <label className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-700"><span className="flex justify-between"><span>Intensidad de sombras</span><strong>{content.theme.shadowOpacity.toFixed(2)}</strong></span><input type="range" min="0" max="0.5" step="0.01" value={content.theme.shadowOpacity} onChange={(event) => updateSection('theme', { shadowOpacity: Number(event.target.value) })} className="mt-3 w-full accent-[#18B68B]" /></label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['primaryColor', 'Color principal'], ['primaryDarkColor', 'Color principal oscuro'], ['pageBackground', 'Fondo de página'], ['surfaceColor', 'Fondo de tarjetas'], ['textColor', 'Texto principal'], ['mutedTextColor', 'Texto secundario'],
            ].map(([key, label]) => <label key={key} className="text-xs font-bold text-slate-700"><span>{label}</span><div className="mt-1 flex gap-2"><input type="color" value={String(content.theme[key as keyof typeof content.theme])} onChange={(event) => updateSection('theme', { [key]: event.target.value })} className="h-10 w-12 rounded border" /><input value={String(content.theme[key as keyof typeof content.theme])} onChange={(event) => updateSection('theme', { [key]: event.target.value })} className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2 font-mono" /></div></label>)}
          </div>
          <label className="block text-xs font-bold text-slate-700">CSS personalizado<textarea rows={10} spellCheck={false} value={content.theme.customCss} onChange={(event) => updateSection('theme', { customCss: event.target.value })} placeholder="/* Tus reglas CSS adicionales */" className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-950 p-4 font-mono text-xs text-emerald-200" /></label>
        </div>
      )}

      {activeSubTab === 'seo' && (
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="border-b border-slate-100 pb-3"><h3 className="text-lg font-black text-slate-900">SEO, buscadores y enlaces compartidos</h3><p className="text-xs text-slate-500">Edita el título del navegador, descripción, indexación, imagen social, URL canónica y favicon.</p></div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ['siteTitle', 'Título del sitio'], ['keywords', 'Palabras clave'], ['canonicalUrl', 'URL canónica'], ['socialImageUrl', 'Imagen para redes sociales'], ['faviconUrl', 'Favicon'], ['robots', 'Directiva robots'],
            ].map(([key, label]) => <label key={key} className="text-xs font-bold text-slate-700">{label}<input value={content.seo[key as keyof typeof content.seo]} onChange={(event) => updateSection('seo', { [key]: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label>)}
            <label className="text-xs font-bold text-slate-700 md:col-span-2">Descripción<textarea rows={4} value={content.seo.description} onChange={(event) => updateSection('seo', { description: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label>
          </div>
        </div>
      )}

      {activeSubTab === 'media' && <AdminMediaLibrary />}

      {activeSubTab === 'layout' && (
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-lg font-black text-slate-900">Estructura completa de la landing</h3>
            <p className="text-xs text-slate-500">Muestra, oculta y cambia el orden de todas las secciones públicas. Los cambios se guardan automáticamente.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-sm font-bold text-slate-800">
              Mostrar encabezado
              <input type="checkbox" checked={content.layout.headerVisible} onChange={(event) => updateSection('layout', { headerVisible: event.target.checked })} className="h-5 w-5 accent-[#18B68B]" />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-sm font-bold text-slate-800">
              Mostrar pie de página
              <input type="checkbox" checked={content.layout.footerVisible} onChange={(event) => updateSection('layout', { footerVisible: event.target.checked })} className="h-5 w-5 accent-[#18B68B]" />
            </label>
          </div>
          <div className="space-y-2">
            {content.layout.sections.map((section, index) => (
              <div key={section.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="w-7 text-center text-xs font-black text-slate-400">{index + 1}</span>
                <input value={section.label} onChange={(event) => updateSection('layout', { sections: content.layout.sections.map((item) => item.id === section.id ? { ...item, label: event.target.value } : item) })} className="min-w-[180px] flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold" />
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <input type="checkbox" checked={section.visible} onChange={(event) => updateSection('layout', { sections: content.layout.sections.map((item) => item.id === section.id ? { ...item, visible: event.target.checked } : item) })} className="h-4 w-4 accent-[#18B68B]" />
                  Visible
                </label>
                <button onClick={() => moveSection(index, -1)} disabled={index === 0} className="rounded-lg border border-slate-300 bg-white p-2 disabled:opacity-30" aria-label="Subir sección"><ArrowUp className="h-4 w-4" /></button>
                <button onClick={() => moveSection(index, 1)} disabled={index === content.layout.sections.length - 1} className="rounded-lg border border-slate-300 bg-white p-2 disabled:opacity-30" aria-label="Bajar sección"><ArrowDown className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'all' && (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-lg font-black text-slate-900">Control total del contenido</h3>
            <p className="text-xs leading-relaxed text-slate-500">Aquí puedes cambiar absolutamente todos los textos, imágenes, listas, botones, documentos legales, ejemplos, etiquetas y configuraciones guardadas por la landing. Exporta una copia antes de hacer cambios grandes.</p>
          </div>
          <UniversalContentEditor value={content as any} onChange={(nextContent) => { updateContent(nextContent as any); notifySaved(); }} />
          <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <summary className="cursor-pointer text-sm font-black text-slate-800">Editor JSON avanzado</summary>
            <div className="mt-4 space-y-3">
              <textarea value={fullEditorText} onChange={(event) => setFullEditorText(event.target.value)} spellCheck={false} className="min-h-[480px] w-full rounded-xl border border-slate-300 bg-slate-950 p-4 font-mono text-xs leading-relaxed text-emerald-200 focus:ring-2 focus:ring-[#18B68B]" />
              {fullEditorError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-800">{fullEditorError}</p>}
              <div className="flex flex-wrap gap-3"><button onClick={applyFullEditor} className="rounded-xl bg-[#18B68B] px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-[#15a27c]"><Save className="mr-2 inline h-4 w-4" />Aplicar JSON</button><button onClick={() => { setFullEditorText(JSON.stringify(content, null, 2)); setFullEditorError(null); }} className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700">Descartar cambios</button></div>
            </div>
          </details>
        </div>
      )}

      {/* SUB TAB 1: BRANDING & LOGOS */}
      {activeSubTab === 'branding' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-black text-lg text-slate-900">Identidad de Marca, Logos y Colores</h3>
            <p className="text-xs text-slate-500">
              Personaliza el nombre de la app, logotipo personalizado por URL, isotipo, color principal de acento y datos de contacto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de la Aplicación</label>
                <input
                  type="text"
                  value={content.branding.appName}
                  onChange={(e) => {
                    updateSection('branding', { appName: e.target.value });
                    notifySaved();
                  }}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#18B68B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Slogan Principal</label>
                <input
                  type="text"
                  value={content.branding.slogan}
                  onChange={(e) => {
                    updateSection('branding', { slogan: e.target.value });
                    notifySaved();
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#18B68B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Color Principal de Marca (Hex)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={content.theme.primaryColor || '#18B68B'}
                    onChange={(e) => {
                      updateSection('branding', { primaryColor: e.target.value });
                      updateSection('theme', { primaryColor: e.target.value });
                      notifySaved();
                    }}
                    className="w-10 h-10 rounded-xl border border-slate-300 p-0.5 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={content.theme.primaryColor || '#18B68B'}
                    onChange={(e) => {
                      updateSection('branding', { primaryColor: e.target.value });
                      updateSection('theme', { primaryColor: e.target.value });
                      notifySaved();
                    }}
                    className="flex-1 text-xs font-mono font-bold p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#18B68B]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL de Logotipo Personalizado (Opcional - Imagen PNG/SVG)
                </label>
                <input
                  type="url"
                  placeholder="https://... (Deja vacío para usar el logo oficial dibujado a mano)"
                  value={content.branding.customLogoUrl || ''}
                  onChange={(e) => {
                    updateSection('branding', { customLogoUrl: e.target.value });
                    notifySaved();
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#18B68B]"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Si este campo está vacío, se muestra automáticamente el dibujo original vectorizado del logotipo El Barrio.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL de Isotipo Personalizado (Icono / Símbolo)
                </label>
                <input
                  type="url"
                  placeholder="https://... (Opcional)"
                  value={content.branding.customIsotypeUrl || ''}
                  onChange={(e) => {
                    updateSection('branding', { customIsotypeUrl: e.target.value });
                    notifySaved();
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#18B68B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Correo Oficial</label>
                  <input
                    type="email"
                    value={content.branding.supportEmail}
                    onChange={(e) => {
                      updateSection('branding', { supportEmail: e.target.value });
                      notifySaved();
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#18B68B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dominio Oficial</label>
                  <input
                    type="text"
                    value={content.branding.officialDomain}
                    onChange={(e) => {
                      updateSection('branding', { officialDomain: e.target.value });
                      notifySaved();
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#18B68B]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 2: HERO PRINCIPAL */}
      {activeSubTab === 'hero' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-black text-lg text-slate-900">Sección Hero Principal</h3>
            <p className="text-xs text-slate-500">
              Modifica los encabezados principales, llamadas a la acción, comunas y textos de la maqueta móvil.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
              <div className="grid items-center gap-4 md:grid-cols-[150px_1fr]">
                <img src={content.hero.previewImageUrl === '/hero-app-preview.jpg' ? '/hero-phone-v2.png' : content.hero.previewImageUrl} alt={content.hero.previewImageAlt} className="mx-auto max-h-60 w-auto max-w-full rounded-2xl bg-white object-contain shadow-sm" />
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Imagen del celular en la portada</h4>
                    <p className="text-xs text-slate-600">Sube una imagen vertical y reemplázala sin tocar código.</p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#18B68B] px-4 py-2.5 text-xs font-black text-white hover:bg-[#15a27c]">
                    <Upload className="h-4 w-4" />{heroImageUploading ? 'Subiendo…' : 'Cambiar imagen'}
                    <input type="file" accept="image/png,image/jpeg,image/webp" disabled={heroImageUploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) uploadHeroImage(file); event.target.value = ''; }} className="hidden" />
                  </label>
                  {heroImageMessage && <p className="text-xs font-bold text-slate-700">{heroImageMessage}</p>}
                  <label className="block text-xs font-bold text-slate-700">URL de la imagen<input value={content.hero.previewImageUrl} onChange={(event) => updateSection('hero', { previewImageUrl: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-normal" /></label>
                  <label className="block text-xs font-bold text-slate-700">Descripción accesible<input value={content.hero.previewImageAlt} onChange={(event) => updateSection('hero', { previewImageAlt: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-normal" /></label>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Badge Superior</label>
              <input
                type="text"
                value={content.hero.badge}
                onChange={(e) => {
                  updateSection('hero', { badge: e.target.value });
                  notifySaved();
                }}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#18B68B]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título Parte 1</label>
                <input
                  type="text"
                  value={content.hero.titlePart1}
                  onChange={(e) => {
                    updateSection('hero', { titlePart1: e.target.value });
                    notifySaved();
                  }}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#18B68B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Palabra Destacada (Verde)</label>
                <input
                  type="text"
                  value={content.hero.titleHighlight}
                  onChange={(e) => {
                    updateSection('hero', { titleHighlight: e.target.value });
                    notifySaved();
                  }}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-[#18B68B] bg-emerald-50/50 text-[#18B68B] focus:ring-2 focus:ring-[#18B68B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título Parte 2</label>
                <input
                  type="text"
                  value={content.hero.titlePart2}
                  onChange={(e) => {
                    updateSection('hero', { titlePart2: e.target.value });
                    notifySaved();
                  }}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#18B68B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Descripción Principal</label>
              <textarea
                rows={3}
                value={content.hero.description}
                onChange={(e) => {
                  updateSection('hero', { description: e.target.value });
                  notifySaved();
                }}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#18B68B]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Texto Botón Vecino (CTA 1)</label>
                <input
                  type="text"
                  value={content.hero.ctaVecino}
                  onChange={(e) => {
                    updateSection('hero', { ctaVecino: e.target.value });
                    notifySaved();
                  }}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#18B68B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Texto Botón Comercio (CTA 2)</label>
                <input
                  type="text"
                  value={content.hero.ctaComercio}
                  onChange={(e) => {
                    updateSection('hero', { ctaComercio: e.target.value });
                    notifySaved();
                  }}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#18B68B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Texto Destacado de Comunas</label>
              <input
                type="text"
                value={content.hero.communesHighlight}
                onChange={(e) => {
                  updateSection('hero', { communesHighlight: e.target.value });
                  notifySaved();
                }}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#18B68B]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Simulador: Nombre del Sector</label>
                <input
                  type="text"
                  value={content.hero.simulatorSector}
                  onChange={(e) => {
                    updateSection('hero', { simulatorSector: e.target.value });
                    notifySaved();
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#18B68B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Simulador: Contador de Vecinos</label>
                <input
                  type="text"
                  value={content.hero.simulatorNeighborsCount}
                  onChange={(e) => {
                    updateSection('hero', { simulatorNeighborsCount: e.target.value });
                    notifySaved();
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#18B68B]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 3: FEED & PUBLICACIONES ("ASÍ SE VIVE") */}
      {activeSubTab === 'posts' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-black text-lg text-slate-900">Feed Vecinal en Vivo ("Así se vive El Barrio")</h3>
              <p className="text-xs text-slate-500">
                Edita individualmente cada publicación: imagen, título, descripción, autor, precio y comuna.
              </p>
            </div>

            <button
              onClick={handleAddNewPost}
              className="bg-[#18B68B] hover:bg-[#15a27c] text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Agregar Publicación
            </button>
          </div>

          {/* Quick Image Presets Palette */}
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 space-y-2">
            <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5 text-[#18B68B]" /> Imágenes sugeridas en alta resolución para publicaciones:
            </span>
            <div className="flex flex-wrap gap-2">
              {sampleImageSuggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    navigator.clipboard.writeText(s.url);
                    alert(`URL copiada al portapapeles: ${s.label}`);
                  }}
                  className="text-[11px] bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-colors"
                >
                  📋 Copiar {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {content.posts.map((post, idx) => {
              const isExpanded = editingPostId === post.id;
              return (
                <div
                  key={post.id}
                  className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-4 hover:border-slate-300 transition-all"
                >
                  {/* Collapsed Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img
                        src={post.image}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                            #{idx + 1} {post.type}
                          </span>
                          <span className="text-xs text-slate-500 font-semibold">{post.author.name}</span>
                          <span className="text-xs text-[#18B68B] font-bold">{post.price || 'Gratis'}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">{post.title}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingPostId(isExpanded ? null : post.id)}
                        className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        {isExpanded ? 'Cerrar' : 'Editar'}
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm('¿Eliminar esta publicación?')) {
                            deletePost(post.id);
                            notifySaved();
                          }
                        }}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar publicación"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Editor */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-xl border">
                      <div className="space-y-3 sm:col-span-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Título de la Publicación</label>
                          <input
                            type="text"
                            value={post.title}
                            onChange={(e) => {
                              updatePost(post.id, { title: e.target.value });
                              notifySaved();
                            }}
                            className="w-full text-xs font-bold p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#18B68B]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Descripción</label>
                          <textarea
                            rows={2}
                            value={post.description}
                            onChange={(e) => {
                              updatePost(post.id, { description: e.target.value });
                              notifySaved();
                            }}
                            className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#18B68B]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">URL de la Imagen Principal</label>
                        <input
                          type="url"
                          value={post.image}
                          onChange={(e) => {
                            updatePost(post.id, { image: e.target.value });
                            notifySaved();
                          }}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#18B68B]"
                        />
                        {post.image && (
                          <div className="mt-2 relative w-full h-24 rounded-lg overflow-hidden border border-slate-200">
                            <img src={post.image} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Tipo de Publicación</label>
                          <select
                            value={post.type}
                            onChange={(e) => {
                              updatePost(post.id, { type: e.target.value as any });
                              notifySaved();
                            }}
                            className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#18B68B]"
                          >
                            <option value="arriendo">Arriendo de herramienta / objeto</option>
                            <option value="regalo">Regalo / Donación</option>
                            <option value="comercio">Comercio / Promoción</option>
                            <option value="ayuda">Ayuda / Pregunta vecinal</option>
                            <option value="alerta">Alerta de Seguridad / Servicio</option>
                            <option value="servicio">Servicio Técnico / Profesional</option>
                            <option value="venta">Venta local</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Precio o Etiqueta</label>
                            <input
                              type="text"
                              value={post.price || ''}
                              onChange={(e) => {
                                updatePost(post.id, { price: e.target.value });
                                notifySaved();
                              }}
                              className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#18B68B]"
                              placeholder="Ej: $5.000 / día"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Distancia estimada</label>
                            <input
                              type="text"
                              value={post.distance}
                              onChange={(e) => {
                                updatePost(post.id, { distance: e.target.value });
                                notifySaved();
                              }}
                              className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#18B68B]"
                              placeholder="A 200m de ti"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Author details */}
                      <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Nombre Autor/a</label>
                          <input
                            type="text"
                            value={post.author.name}
                            onChange={(e) => {
                              updatePost(post.id, { author: { ...post.author, name: e.target.value } });
                              notifySaved();
                            }}
                            className="w-full text-xs font-bold p-1.5 rounded border border-slate-300"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Comuna / Sector</label>
                          <input
                            type="text"
                            value={post.author.commune}
                            onChange={(e) => {
                              updatePost(post.id, { author: { ...post.author, commune: e.target.value } });
                              notifySaved();
                            }}
                            className="w-full text-xs p-1.5 rounded border border-slate-300"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Insignia Autor</label>
                          <input
                            type="text"
                            value={post.author.badge || ''}
                            onChange={(e) => {
                              updatePost(post.id, { author: { ...post.author, badge: e.target.value } });
                              notifySaved();
                            }}
                            className="w-full text-xs p-1.5 rounded border border-slate-300"
                            placeholder="Vecino Verificado"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB TAB 4: 3 BENEFICIOS */}
      {activeSubTab === 'benefits' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-black text-lg text-slate-900">Sección: Tres Grandes Beneficios</h3>
            <p className="text-xs text-slate-500">
              Personaliza los textos de los 3 pilares: 01. Conecta, 02. Resuelve y 03. Cuida.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Título de la Sección</label>
              <input
                type="text"
                value={content.benefits.title}
                onChange={(e) => {
                  updateSection('benefits', { title: e.target.value });
                  notifySaved();
                }}
                className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#18B68B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subtítulo</label>
              <input
                type="text"
                value={content.benefits.subtitle}
                onChange={(e) => {
                  updateSection('benefits', { subtitle: e.target.value });
                  notifySaved();
                }}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#18B68B]"
              />
            </div>
          </div>

          {/* Benefit 1 */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-3">
            <span className="text-xs font-black text-[#18B68B] uppercase tracking-wider">Pilar 1 (Conecta)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Título Principal</label>
                <input
                  type="text"
                  value={content.benefits.benefit1.title}
                  onChange={(e) => {
                    updateSection('benefits', {
                      benefit1: { ...content.benefits.benefit1, title: e.target.value }
                    });
                    notifySaved();
                  }}
                  className="w-full text-xs font-bold p-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Testimonio / Nombre Vecino</label>
                <input
                  type="text"
                  value={content.benefits.benefit1.sampleTitle}
                  onChange={(e) => {
                    updateSection('benefits', {
                      benefit1: { ...content.benefits.benefit1, sampleTitle: e.target.value }
                    });
                    notifySaved();
                  }}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Descripción</label>
              <textarea
                rows={2}
                value={content.benefits.benefit1.description}
                onChange={(e) => {
                  updateSection('benefits', {
                    benefit1: { ...content.benefits.benefit1, description: e.target.value }
                  });
                  notifySaved();
                }}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200 space-y-3">
            <span className="text-xs font-black text-purple-700 uppercase tracking-wider">Pilar 2 (Resuelve)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Título Principal</label>
                <input
                  type="text"
                  value={content.benefits.benefit2.title}
                  onChange={(e) => {
                    updateSection('benefits', {
                      benefit2: { ...content.benefits.benefit2, title: e.target.value }
                    });
                    notifySaved();
                  }}
                  className="w-full text-xs font-bold p-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Ejemplo de Arriendo/Objeto</label>
                <input
                  type="text"
                  value={content.benefits.benefit2.sampleTitle}
                  onChange={(e) => {
                    updateSection('benefits', {
                      benefit2: { ...content.benefits.benefit2, sampleTitle: e.target.value }
                    });
                    notifySaved();
                  }}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Descripción</label>
              <textarea
                rows={2}
                value={content.benefits.benefit2.description}
                onChange={(e) => {
                  updateSection('benefits', {
                    benefit2: { ...content.benefits.benefit2, description: e.target.value }
                  });
                  notifySaved();
                }}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="p-4 rounded-xl bg-red-50/50 border border-red-200 space-y-3">
            <span className="text-xs font-black text-red-700 uppercase tracking-wider">Pilar 3 (Cuida)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Título Principal</label>
                <input
                  type="text"
                  value={content.benefits.benefit3.title}
                  onChange={(e) => {
                    updateSection('benefits', {
                      benefit3: { ...content.benefits.benefit3, title: e.target.value }
                    });
                    notifySaved();
                  }}
                  className="w-full text-xs font-bold p-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Ejemplo Alerta de Cuadrante</label>
                <input
                  type="text"
                  value={content.benefits.benefit3.sampleTitle}
                  onChange={(e) => {
                    updateSection('benefits', {
                      benefit3: { ...content.benefits.benefit3, sampleTitle: e.target.value }
                    });
                    notifySaved();
                  }}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Descripción</label>
              <textarea
                rows={2}
                value={content.benefits.benefit3.description}
                onChange={(e) => {
                  updateSection('benefits', {
                    benefit3: { ...content.benefits.benefit3, description: e.target.value }
                  });
                  notifySaved();
                }}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 5: SEGURIDAD */}
      {activeSubTab === 'trust' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-black text-lg text-slate-900">Sección: Seguridad & Escudo de Confianza</h3>
            <p className="text-xs text-slate-500">
              Edita el título, subtítulo, los 6 pilares de seguridad y la nota de transparencia.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Título</label>
              <input
                type="text"
                value={content.trust.title}
                onChange={(e) => {
                  updateSection('trust', { title: e.target.value });
                  notifySaved();
                }}
                className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#18B68B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subtítulo</label>
              <input
                type="text"
                value={content.trust.subtitle}
                onChange={(e) => {
                  updateSection('trust', { subtitle: e.target.value });
                  notifySaved();
                }}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#18B68B]"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-xs text-slate-900 uppercase">Los 6 Pilares de Confianza:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.trust.pillars.map((pillar, idx) => (
                <div key={pillar.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-extrabold text-[#18B68B]">Pilar #{idx + 1}</span>
                  <input
                    type="text"
                    value={pillar.title}
                    onChange={(e) => {
                      const updated = content.trust.pillars.map((p) =>
                        p.id === pillar.id ? { ...p, title: e.target.value } : p
                      );
                      updateSection('trust', { pillars: updated });
                      notifySaved();
                    }}
                    className="w-full text-xs font-bold p-1.5 rounded border border-slate-300 bg-white"
                  />
                  <textarea
                    rows={2}
                    value={pillar.description}
                    onChange={(e) => {
                      const updated = content.trust.pillars.map((p) =>
                        p.id === pillar.id ? { ...p, description: e.target.value } : p
                      );
                      updateSection('trust', { pillars: updated });
                      notifySaved();
                    }}
                    className="w-full text-xs p-1.5 rounded border border-slate-300 bg-white"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Compromiso de Transparencia (Texto inferior)</label>
            <textarea
              rows={2}
              value={content.trust.transparencyText}
              onChange={(e) => {
                updateSection('trust', { transparencyText: e.target.value });
                notifySaved();
              }}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#18B68B]"
            />
          </div>
        </div>
      )}

      {/* SUB TAB 6: COMERCIOS */}
      {activeSubTab === 'businesses' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-black text-lg text-slate-900">Comercios y Servicios de Barrio Destacados</h3>
              <p className="text-xs text-slate-500">
                Edita imágenes de portada, nombres, ofertas, dueños y teléfonos de los locales participantes.
              </p>
            </div>

            <button
              onClick={handleAddNewBusiness}
              className="bg-[#18B68B] hover:bg-[#15a27c] text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Agregar Comercio
            </button>
          </div>

          <div className="space-y-4">
            {content.businesses.map((biz) => {
              const isExpanded = editingBusinessId === biz.id;
              return (
                <div
                  key={biz.id}
                  className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-4 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img
                        src={biz.coverImage}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-slate-900 truncate">{biz.name}</h4>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                            {biz.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{biz.discount}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingBusinessId(isExpanded ? null : biz.id)}
                        className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        {isExpanded ? 'Cerrar' : 'Editar'}
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm('¿Eliminar este comercio?')) {
                            deleteBusiness(biz.id);
                            notifySaved();
                          }
                        }}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-xl border">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Nombre del Local</label>
                        <input
                          type="text"
                          value={biz.name}
                          onChange={(e) => {
                            updateBusiness(biz.id, { name: e.target.value });
                            notifySaved();
                          }}
                          className="w-full text-xs font-bold p-2 rounded-lg border border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Rubro / Categoría</label>
                        <input
                          type="text"
                          value={biz.category}
                          onChange={(e) => {
                            updateBusiness(biz.id, { category: e.target.value });
                            notifySaved();
                          }}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">URL Foto de Portada</label>
                        <input
                          type="url"
                          value={biz.coverImage}
                          onChange={(e) => {
                            updateBusiness(biz.id, { coverImage: e.target.value });
                            notifySaved();
                          }}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300"
                        />
                        {biz.coverImage && (
                          <div className="mt-2 h-20 rounded-lg overflow-hidden border border-slate-200">
                            <img src={biz.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Descuento o Beneficio Vecinal</label>
                          <input
                            type="text"
                            value={biz.discount}
                            onChange={(e) => {
                              updateBusiness(biz.id, { discount: e.target.value });
                              notifySaved();
                            }}
                            className="w-full text-xs font-bold text-[#18B68B] p-2 rounded-lg border border-emerald-300 bg-emerald-50/30"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Ubicación Aprox / Comuna</label>
                          <input
                            type="text"
                            value={biz.addressApprox}
                            onChange={(e) => {
                              updateBusiness(biz.id, { addressApprox: e.target.value });
                              notifySaved();
                            }}
                            className="w-full text-xs p-2 rounded-lg border border-slate-300"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Descripción del Comercio</label>
                        <textarea
                          rows={2}
                          value={biz.description}
                          onChange={(e) => {
                            updateBusiness(biz.id, { description: e.target.value });
                            notifySaved();
                          }}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB TAB 7: PUBLICIDAD LOCAL */}
      {activeSubTab === 'localAds' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-black text-lg text-slate-900">Sección: Difusión y Publicidad Local</h3>
            <p className="text-xs text-slate-500">
              Ajusta los textos del banner oscuro de publicidad ética hiperlocal.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Título</label>
              <input
                type="text"
                value={content.localAds.title}
                onChange={(e) => {
                  updateSection('localAds', { title: e.target.value });
                  notifySaved();
                }}
                className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Descripción</label>
              <textarea
                rows={2}
                value={content.localAds.description}
                onChange={(e) => {
                  updateSection('localAds', { description: e.target.value });
                  notifySaved();
                }}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Beneficio 1</label>
                <input
                  type="text"
                  value={content.localAds.bullet1}
                  onChange={(e) => {
                    updateSection('localAds', { bullet1: e.target.value });
                    notifySaved();
                  }}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Beneficio 2</label>
                <input
                  type="text"
                  value={content.localAds.bullet2}
                  onChange={(e) => {
                    updateSection('localAds', { bullet2: e.target.value });
                    notifySaved();
                  }}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Beneficio 3</label>
                <input
                  type="text"
                  value={content.localAds.bullet3}
                  onChange={(e) => {
                    updateSection('localAds', { bullet3: e.target.value });
                    notifySaved();
                  }}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Texto del Botón CTA</label>
              <input
                type="text"
                value={content.localAds.ctaButton}
                onChange={(e) => {
                  updateSection('localAds', { ctaButton: e.target.value });
                  notifySaved();
                }}
                className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 8: PREGUNTAS FRECUENTES (FAQS) */}
      {activeSubTab === 'faqs' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-black text-lg text-slate-900">Preguntas Frecuentes (FAQ)</h3>
              <p className="text-xs text-slate-500">
                Edita cada una de las preguntas, respuestas y categorías desplegadas en pantalla completa.
              </p>
            </div>

            <button
              onClick={handleAddNewFAQ}
              className="bg-[#18B68B] hover:bg-[#15a27c] text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Agregar Pregunta
            </button>
          </div>

          <div className="space-y-4">
            {content.faqs.map((faq, idx) => {
              const isExpanded = editingFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-[10px] font-extrabold text-[#18B68B] bg-emerald-100 px-2 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate">{faq.question}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingFaqId(isExpanded ? null : faq.id)}
                        className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        {isExpanded ? 'Cerrar' : 'Editar'}
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm('¿Eliminar esta pregunta?')) {
                            deleteFAQ(faq.id);
                            notifySaved();
                          }
                        }}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-200 space-y-3 bg-white p-4 rounded-xl border">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Pregunta</label>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => {
                              updateFAQ(faq.id, { question: e.target.value });
                              notifySaved();
                            }}
                            className="w-full text-xs font-bold p-2 rounded-lg border border-slate-300"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Categoría</label>
                          <select
                            value={faq.category}
                            onChange={(e) => {
                              updateFAQ(faq.id, { category: e.target.value as any });
                              notifySaved();
                            }}
                            className="w-full text-xs p-2 rounded-lg border border-slate-300"
                          >
                            <option value="general">General</option>
                            <option value="seguridad">Seguridad & Privacidad</option>
                            <option value="comercios">Comercios & Servicios</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Respuesta Detallada</label>
                        <textarea
                          rows={3}
                          value={faq.answer}
                          onChange={(e) => {
                            updateFAQ(faq.id, { answer: e.target.value });
                            notifySaved();
                          }}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB TAB 9: FORMULARIO DE ESPERA */}
      {activeSubTab === 'waitlistForm' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-black text-lg text-slate-900">Sección: Formulario de Inscripción y Cuadrantes</h3>
            <p className="text-xs text-slate-500">
              Edita los encabezados, nombres de cuadrantes de Las Condes y porcentajes de avance vecinal.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título Principal</label>
                <input
                  type="text"
                  value={content.waitlistForm.title}
                  onChange={(e) => {
                    updateSection('waitlistForm', { title: e.target.value });
                    notifySaved();
                  }}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtítulo</label>
                <input
                  type="text"
                  value={content.waitlistForm.subtitle}
                  onChange={(e) => {
                    updateSection('waitlistForm', { subtitle: e.target.value });
                    notifySaved();
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            {/* Quadrants status */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase">Estado de Cuadrantes Territoriales:</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-700">Cuadrante 1</label>
                  <input
                    type="text"
                    value={content.waitlistForm.quadrant1Name}
                    onChange={(e) => {
                      updateSection('waitlistForm', { quadrant1Name: e.target.value });
                      notifySaved();
                    }}
                    className="w-full text-xs font-semibold p-1.5 rounded border border-slate-300 bg-white"
                  />
                  <input
                    type="text"
                    value={content.waitlistForm.quadrant1Progress}
                    onChange={(e) => {
                      updateSection('waitlistForm', { quadrant1Progress: e.target.value });
                      notifySaved();
                    }}
                    className="w-full text-[11px] text-emerald-800 p-1.5 rounded border border-emerald-300 bg-emerald-50/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-700">Cuadrante 2</label>
                  <input
                    type="text"
                    value={content.waitlistForm.quadrant2Name}
                    onChange={(e) => {
                      updateSection('waitlistForm', { quadrant2Name: e.target.value });
                      notifySaved();
                    }}
                    className="w-full text-xs font-semibold p-1.5 rounded border border-slate-300 bg-white"
                  />
                  <input
                    type="text"
                    value={content.waitlistForm.quadrant2Progress}
                    onChange={(e) => {
                      updateSection('waitlistForm', { quadrant2Progress: e.target.value });
                      notifySaved();
                    }}
                    className="w-full text-[11px] text-emerald-800 p-1.5 rounded border border-emerald-300 bg-emerald-50/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-700">Cuadrante 3</label>
                  <input
                    type="text"
                    value={content.waitlistForm.quadrant3Name}
                    onChange={(e) => {
                      updateSection('waitlistForm', { quadrant3Name: e.target.value });
                      notifySaved();
                    }}
                    className="w-full text-xs font-semibold p-1.5 rounded border border-slate-300 bg-white"
                  />
                  <input
                    type="text"
                    value={content.waitlistForm.quadrant3Progress}
                    onChange={(e) => {
                      updateSection('waitlistForm', { quadrant3Progress: e.target.value });
                      notifySaved();
                    }}
                    className="w-full text-[11px] text-emerald-800 p-1.5 rounded border border-emerald-300 bg-emerald-50/50"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Aviso de Privacidad</label>
              <textarea
                rows={2}
                value={content.waitlistForm.privacyText}
                onChange={(e) => {
                  updateSection('waitlistForm', { privacyText: e.target.value });
                  notifySaved();
                }}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 10: FOOTER & PIE */}
      {activeSubTab === 'footer' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-black text-lg text-slate-900">Sección: Footer y Pie de Página</h3>
            <p className="text-xs text-slate-500">
              Personaliza el texto institucional, copyright y notas territoriales.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Descripción Institucional</label>
              <textarea
                rows={2}
                value={content.footer.description}
                onChange={(e) => {
                  updateSection('footer', { description: e.target.value });
                  notifySaved();
                }}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ubicación y Estado Territorial</label>
                <input
                  type="text"
                  value={content.footer.locationNotice}
                  onChange={(e) => {
                    updateSection('footer', { locationNotice: e.target.value });
                    notifySaved();
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Texto de Copyright</label>
                <input
                  type="text"
                  value={content.footer.copyrightText}
                  onChange={(e) => {
                    updateSection('footer', { copyrightText: e.target.value });
                    notifySaved();
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h4 className="font-extrabold text-base text-slate-900">Importar Configuración en JSON</h4>
            <p className="text-xs text-slate-500">
              Pega a continuación el código JSON exportado previamente para restaurar todos los textos e imágenes.
            </p>
            <textarea
              rows={8}
              placeholder="Pega aquí el JSON..."
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              className="w-full text-xs font-mono p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#18B68B]"
            />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="text-xs font-bold text-slate-600 px-4 py-2 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const ok = importContentJSON(importJsonText);
                  if (ok) {
                    setShowImportModal(false);
                    setImportJsonText('');
                    notifySaved();
                    alert('¡Configuración importada exitosamente!');
                  } else {
                    alert('El JSON ingresado no es válido. Revisa el formato.');
                  }
                }}
                className="bg-[#18B68B] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#15a27c] cursor-pointer"
              >
                Cargar Configuración
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GlobeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}
