import { ArrowDown, ArrowUp, Copy, Plus, Trash2 } from 'lucide-react';

type EditableValue = string | number | boolean | null | EditableValue[] | { [key: string]: EditableValue };

interface UniversalContentEditorProps {
  value: EditableValue;
  onChange: (value: EditableValue) => void;
}

const labels: Record<string, string> = {
  layout: 'Estructura', navigation: 'Navegación', branding: 'Marca', hero: 'Portada', scene: 'Así se vive', posts: 'Publicaciones', benefits: 'Beneficios', trust: 'Seguridad', businesses: 'Comercios', businessSection: 'Sección comercios', localAds: 'Publicidad local', faqs: 'Preguntas frecuentes', faqSection: 'Presentación de preguntas', waitlistForm: 'Formulario', formUI: 'Etiquetas del formulario', footer: 'Pie de página', legal: 'Documentos legales',
};

function humanize(key: string) {
  if (labels[key]) return labels[key];
  return key.replace(/([a-z])([A-Z])/g, '$1 $2').replaceAll('_', ' ').replace(/^./, (letter) => letter.toUpperCase());
}

function cloneItem(value: EditableValue): EditableValue {
  const cloned = JSON.parse(JSON.stringify(value)) as EditableValue;
  if (cloned && typeof cloned === 'object' && !Array.isArray(cloned) && 'id' in cloned) {
    cloned.id = `${String(cloned.id || 'item')}-${Date.now()}`;
  }
  return cloned;
}

function ValueEditor({ name, value, onChange, depth = 0 }: { name: string; value: EditableValue; onChange: (value: EditableValue) => void; depth?: number }) {
  if (typeof value === 'boolean') {
    return <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700"><span>{humanize(name)}</span><input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 accent-[#18B68B]" /></label>;
  }

  if (typeof value === 'number') {
    return <label className="block text-xs font-bold text-slate-700"><span className="mb-1 block">{humanize(name)}</span><input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} className="w-full rounded-xl border border-slate-300 px-3 py-2.5" /></label>;
  }

  if (typeof value === 'string' || value === null) {
    const text = typeof value === 'string' ? value : '';
    return <label className="block text-xs font-bold text-slate-700"><span className="mb-1 block">{humanize(name)}</span>{text.length > 90 || text.includes('\n') ? <textarea rows={3} value={text} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal leading-relaxed" /> : <input value={text} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" />}</label>;
  }

  if (Array.isArray(value)) {
    return <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-center justify-between"><h5 className="text-xs font-black uppercase tracking-wide text-slate-700">{humanize(name)} <span className="text-slate-400">({value.length})</span></h5>{value.length > 0 && <button type="button" onClick={() => onChange([...value, cloneItem(value[value.length - 1])])} className="flex items-center gap-1 rounded-lg bg-emerald-100 px-2.5 py-1.5 text-[10px] font-black text-emerald-800"><Plus className="h-3 w-3" />Duplicar último</button>}</div>{value.map((item, index) => <div key={index} className="rounded-xl border border-slate-200 bg-white p-3"><div className="mb-3 flex justify-end gap-1"><button type="button" disabled={index === 0} onClick={() => { const next = [...value]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; onChange(next); }} className="rounded border p-1 disabled:opacity-25" aria-label="Subir"><ArrowUp className="h-3 w-3" /></button><button type="button" disabled={index === value.length - 1} onClick={() => { const next = [...value]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; onChange(next); }} className="rounded border p-1 disabled:opacity-25" aria-label="Bajar"><ArrowDown className="h-3 w-3" /></button><button type="button" onClick={() => onChange([...value.slice(0, index + 1), cloneItem(item), ...value.slice(index + 1)])} className="rounded border p-1" aria-label="Duplicar"><Copy className="h-3 w-3" /></button><button type="button" onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))} className="rounded border border-red-200 p-1 text-red-600" aria-label="Eliminar"><Trash2 className="h-3 w-3" /></button></div><ValueEditor name={`${humanize(name)} ${index + 1}`} value={item} onChange={(nextItem) => onChange(value.map((current, itemIndex) => itemIndex === index ? nextItem : current))} depth={depth + 1} /></div>)}</div>;
  }

  const entries = Object.entries(value);
  return <details open={depth < 1} className="rounded-2xl border border-slate-200 bg-white p-4"><summary className="cursor-pointer text-sm font-black text-slate-900">{humanize(name)}</summary><div className="mt-4 grid gap-4 md:grid-cols-2">{entries.map(([key, child]) => <div key={key} className={typeof child === 'object' && child !== null ? 'md:col-span-2' : ''}><ValueEditor name={key} value={child} onChange={(nextChild) => onChange({ ...value, [key]: nextChild })} depth={depth + 1} /></div>)}</div></details>;
}

export function UniversalContentEditor({ value, onChange }: UniversalContentEditorProps) {
  return <ValueEditor name="Contenido completo" value={value} onChange={onChange} />;
}
