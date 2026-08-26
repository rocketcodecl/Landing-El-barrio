import { useCallback, useEffect, useState } from 'react';
import { Copy, Image, LoaderCircle, Trash2, Upload } from 'lucide-react';

interface MediaFile {
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

export function AdminMediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadFiles = useCallback(async () => {
    const response = await fetch('/api/media', { credentials: 'same-origin' });
    if (response.ok) setFiles((await response.json()).files || []);
  }, []);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  const uploadFile = async (file: File) => {
    setPending(true);
    setMessage(null);
    try {
      const dataBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('No fue posible leer la imagen'));
        reader.readAsDataURL(file);
      });
      const response = await fetch('/api/media', {
        method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, mimeType: file.type, dataBase64 }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'No fue posible subir la imagen');
      await navigator.clipboard.writeText(new URL(body.url, window.location.origin).toString());
      setMessage('Imagen subida. Su URL quedó copiada para pegarla en cualquier campo de imagen.');
      await loadFiles();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Error al subir');
    } finally {
      setPending(false);
    }
  };

  const deleteFile = async (file: MediaFile) => {
    if (!window.confirm(`¿Eliminar ${file.name}? Las secciones que usen esta imagen dejarán de mostrarla.`)) return;
    const response = await fetch(`/api/media/${encodeURIComponent(file.name)}`, { method: 'DELETE', credentials: 'same-origin' });
    if (response.ok) await loadFiles();
  };

  return <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
    <div><h3 className="text-lg font-black text-slate-900">Biblioteca de imágenes</h3><p className="text-xs text-slate-500">Sube imágenes propias de hasta 5 MB. Puedes copiar la URL y utilizarla en cualquier imagen, logo, publicación, comercio o SEO.</p></div>
    <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 p-6 text-center hover:bg-emerald-100">
      {pending ? <LoaderCircle className="mb-2 h-7 w-7 animate-spin text-[#18B68B]" /> : <Upload className="mb-2 h-7 w-7 text-[#18B68B]" />}
      <span className="text-sm font-black text-emerald-900">{pending ? 'Subiendo…' : 'Seleccionar imagen'}</span><span className="mt-1 text-xs text-emerald-700">PNG, JPG, WEBP o GIF</span>
      <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={pending} onChange={(event) => { const file = event.target.files?.[0]; if (file) uploadFile(file); event.target.value = ''; }} className="hidden" />
    </label>
    {message && <p className="rounded-xl bg-slate-100 p-3 text-xs font-bold text-slate-700">{message}</p>}
    {files.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{files.map((file) => <article key={file.name} className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><img src={file.url} alt={file.name} className="h-36 w-full bg-slate-100 object-cover" /><div className="space-y-2 p-3"><p className="truncate text-xs font-bold">{file.name}</p><p className="text-[10px] text-slate-400">{(file.size / 1024).toFixed(1)} KB</p><div className="flex gap-2"><button onClick={async () => { await navigator.clipboard.writeText(new URL(file.url, window.location.origin).toString()); setMessage('URL copiada.'); }} className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-slate-900 px-2 py-2 text-[10px] font-black text-white"><Copy className="h-3 w-3" />Copiar URL</button><button onClick={() => deleteFile(file)} className="rounded-lg border border-red-200 p-2 text-red-600" aria-label="Eliminar imagen"><Trash2 className="h-3.5 w-3.5" /></button></div></div></article>)}</div> : <div className="rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-400"><Image className="mx-auto mb-2 h-6 w-6" />Todavía no hay imágenes subidas.</div>}
  </div>;
}
