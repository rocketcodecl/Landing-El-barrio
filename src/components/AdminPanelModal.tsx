import { FormEvent, useCallback, useEffect, useState } from 'react';
import { SiteAnalytics, WaitlistEntry } from '../types';
import { X, Users, Eye, Download, Search, CheckCircle, BarChart3, Globe, Filter, Sparkles, SlidersHorizontal, Edit3, LogOut } from 'lucide-react';
import { AdminCMSSection } from './AdminCMSSection';

interface AdminPanelModalProps {
  onClose: () => void;
  defaultTab?: 'cms' | 'registros' | 'analytics' | 'integraciones';
}

const EMPTY_ANALYTICS: SiteAnalytics = {
  activeVisitors: 0,
  dailyVisits: 0,
  totalVisits: 0,
  uniqueVisitors: 0,
  topPages: [],
  visitorSources: [],
  pathsViewed24h: 0,
  visitsLast7: [],
  liveVisitors: [],
  recentVisitors: [],
};

export function AdminPanelModal({ onClose, defaultTab = 'cms' }: AdminPanelModalProps) {
  const [activeTab, setActiveTab] = useState<'cms' | 'registros' | 'analytics' | 'integraciones'>(defaultTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('todos');
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginPending, setLoginPending] = useState(false);
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
  const [analytics, setAnalytics] = useState<SiteAnalytics>(EMPTY_ANALYTICS);

  const loadAdminData = useCallback(async () => {
    const [waitlistResponse, analyticsResponse] = await Promise.all([
      fetch('/api/waitlist', { credentials: 'same-origin' }),
      fetch('/api/analytics', { credentials: 'same-origin' }),
    ]);
    if (waitlistResponse.status === 401 || analyticsResponse.status === 401) {
      setAuthenticated(false);
      return;
    }
    if (waitlistResponse.ok) {
      const data = await waitlistResponse.json();
      setWaitlistEntries((data.entries || []).map((entry: any) => ({
        id: entry.id,
        nombre: entry.nombre,
        correo: entry.correo,
        whatsapp: entry.whatsapp || '',
        comuna: entry.comuna || '',
        tipo_registro: entry.participantType,
        nombreNegocio: entry.nombreNegocio || undefined,
        rubro: entry.rubro || undefined,
        fecha: String(entry.createdAt || '').replace('T', ' ').slice(0, 16),
      })));
    }
    if (analyticsResponse.ok) {
      const data = await analyticsResponse.json();
      const totalSources = (data.visitorSources || []).reduce((sum: number, item: any) => sum + Number(item.visits || 0), 0);
      setAnalytics({
        activeVisitors: data.activeVisitors || 0,
        dailyVisits: data.dailyVisits || 0,
        totalVisits: data.totalVisits || 0,
        uniqueVisitors: data.uniqueVisitors || 0,
        topPages: data.topPages || [],
        visitorSources: (data.visitorSources || []).map((item: any) => ({
          source: item.source,
          visits: item.visits,
          percentage: totalSources ? Math.round((item.visits / totalSources) * 100) : 0,
        })),
        pathsViewed24h: data.pathsViewed24h || 0,
        visitsLast7: data.visitsLast7 || [],
        liveVisitors: data.liveVisitors || [],
        recentVisitors: data.recentVisitors || [],
      });
    }
  }, []);

  useEffect(() => {
    fetch('/api/auth/status', { credentials: 'same-origin' })
      .then((response) => response.json())
      .then((data) => setAuthenticated(Boolean(data.authenticated)))
      .catch(() => setAuthenticated(false));
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    loadAdminData();
    const interval = window.setInterval(loadAdminData, 30000);
    return () => window.clearInterval(interval);
  }, [authenticated, loadAdminData]);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoginPending(true);
    setLoginError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'No fue posible iniciar sesión');
      setPassword('');
      setAuthenticated(true);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'No fue posible iniciar sesión');
    } finally {
      setLoginPending(false);
    }
  };

  const handleExportCSV = () => {
    window.location.assign('/api/waitlist.csv');
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
    setAuthenticated(false);
  };

  const filteredEntries = waitlistEntries.filter(entry => {
    const matchesSearch = 
      entry.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.comuna.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'todos' || entry.tipo_registro === filterType;

    return matchesSearch && matchesType;
  });

  const waitlistByType = {
    vecino: waitlistEntries.filter((entry) => entry.tipo_registro === 'vecino').length,
    comercio: waitlistEntries.filter((entry) => entry.tipo_registro === 'comercio').length,
    servicio: waitlistEntries.filter((entry) => entry.tipo_registro === 'servicio').length,
  };
  const waitlistLast7 = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(Date.now() - (6 - offset) * 86400000);
    const key = date.toISOString().slice(0, 10);
    return {
      key,
      label: new Intl.DateTimeFormat('es-CL', { weekday: 'short' }).format(date).replace('.', ''),
      count: waitlistEntries.filter((entry) => entry.fecha.slice(0, 10) === key).length,
    };
  });
  const communeCounts = (Object.entries(waitlistEntries.reduce<Record<string, number>>((result, entry) => {
    const commune = entry.comuna || 'Sin comuna';
    result[commune] = (result[commune] || 0) + 1;
    return result;
  }, {})) as Array<[string, number]>).sort((a, b) => b[1] - a[1]);

  if (authenticated !== true) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
        <div role="dialog" aria-modal="true" aria-labelledby="admin-login-title" className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl sm:p-9">
          <div className="mb-7 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#0E8067]">Acceso protegido</p>
              <h2 id="admin-login-title" className="mt-2 text-2xl font-extrabold text-slate-950">Administración El Barrio</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">Ingresa con la cuenta administrativa existente.</p>
            </div>
            <button onClick={onClose} aria-label="Cerrar acceso administrativo" className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          {authenticated === null ? (
            <p className="py-8 text-center text-sm font-semibold text-slate-500">Comprobando sesión…</p>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="admin-username" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">Usuario</label>
                <input id="admin-username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-[#0E8067]" required />
              </div>
              <div>
                <label htmlFor="admin-password" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">Contraseña</label>
                <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-[#0E8067]" required />
              </div>
              {loginError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{loginError}</p>}
              <button disabled={loginPending} className="w-full rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-extrabold text-white transition-colors hover:bg-[#0E8067] disabled:opacity-60">
                {loginPending ? 'Ingresando…' : 'Ingresar al panel'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div role="dialog" aria-modal="true" aria-labelledby="admin-panel-title" className="bg-white rounded-3xl max-w-6xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-4 sm:p-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#18B68B] text-white flex items-center justify-center font-black">
              EB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="admin-panel-title" className="font-extrabold text-lg text-white">Panel Administrativo El Barrio</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  Datos persistentes
                </span>
              </div>
              <p className="text-xs text-slate-400">Contenido, registros y métricas conectados al servidor</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar panel administrativo"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Dashboard Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 pt-2.5 flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('cms')}
            className={`py-2.5 px-4 rounded-t-xl transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'cms'
                ? 'bg-white text-[#18B68B] border-[#18B68B] shadow-xs'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-4 h-4 text-[#18B68B]" />
            <span>Editor de Contenidos & Media (CMS)</span>
          </button>

          <button
            onClick={() => setActiveTab('registros')}
            className={`py-2.5 px-4 rounded-t-xl transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'registros'
                ? 'bg-white text-[#18B68B] border-[#18B68B] shadow-xs'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Lista de Espera ({waitlistEntries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2.5 px-4 rounded-t-xl transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-white text-[#18B68B] border-[#18B68B] shadow-xs'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Métricas del sitio</span>
          </button>

          <button
            onClick={() => setActiveTab('integraciones')}
            className={`py-2.5 px-4 rounded-t-xl transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'integraciones'
                ? 'bg-white text-[#18B68B] border-[#18B68B] shadow-xs'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Píxeles & Analytics</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50/50">
          
          {/* TAB 0: CMS LIVE EDITOR */}
          {activeTab === 'cms' && <AdminCMSSection />}

          {/* TAB 1: REGISTROS */}
          {activeTab === 'registros' && (
            <div className="space-y-5">
              
              {/* Top Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre, correo o comuna..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#18B68B]"
                    />
                  </div>

                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-none"
                  >
                    <option value="todos">Todos los tipos</option>
                    <option value="vecino">Vecino</option>
                    <option value="comercio">Comercio</option>
                    <option value="servicio">Servicio</option>
                  </select>
                </div>

                <button
                  onClick={handleExportCSV}
                  className="bg-[#18B68B] hover:bg-[#15a27c] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar CSV</span>
                </button>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Nombre</th>
                        <th className="p-3.5">Contacto</th>
                        <th className="p-3.5">Comuna</th>
                        <th className="p-3.5">Tipo</th>
                        <th className="p-3.5">Fecha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                      {filteredEntries.map((entry) => (
                        <tr key={entry.id} className="hover:bg-emerald-50/40 transition-colors">
                          <td className="p-3.5 font-bold text-slate-900">{entry.nombre}</td>
                          <td className="p-3.5">
                            <div>{entry.correo}</div>
                            <div className="text-slate-400 text-[11px]">{entry.whatsapp}</div>
                          </td>
                          <td className="p-3.5">
                            <span className="bg-slate-100 text-slate-800 font-semibold px-2 py-0.5 rounded">
                              {entry.comuna}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className={`capitalize font-bold px-2 py-0.5 rounded text-[10px] ${
                              entry.tipo_registro === 'vecino' ? 'bg-emerald-100 text-emerald-800' :
                              entry.tipo_registro === 'comercio' ? 'bg-amber-100 text-amber-900' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {entry.tipo_registro}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-500 text-[11px]">{entry.fecha}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredEntries.length === 0 && (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No se encontraron registros con los filtros seleccionados.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-4 text-slate-900">
              <div>
                <h3 className="text-base font-black">Visitantes</h3>
                <p className="text-xs text-slate-500">Quién está viendo tu sitio ahora y de dónde viene.</p>
              </div>

              <section className="rounded-2xl border border-emerald-300 bg-gradient-to-br from-emerald-50 to-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">◉ Visitantes en vivo</p>
                    <div className="mt-1 flex items-center gap-2"><strong className="text-3xl text-[#0E9F7A]">{analytics.activeVisitors}</strong><span className="text-xs text-slate-500">visitantes activos</span><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /></div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black uppercase text-emerald-800">Conectado</span>
                </div>
                <div className="mt-4 grid gap-5 md:grid-cols-2">
                  <div><p className="mb-2 text-[10px] font-black uppercase text-slate-500">Viendo ahora</p>{analytics.liveVisitors.length ? analytics.liveVisitors.map((visitor, index) => <p key={`${visitor.path}-${index}`} className="mb-1 text-xs font-bold">{visitor.path}</p>) : <p className="text-xs text-slate-400">Sin datos todavía</p>}</div>
                  <div><p className="mb-2 text-[10px] font-black uppercase text-slate-500">De dónde vienen</p>{analytics.liveVisitors.length ? analytics.liveVisitors.map((visitor, index) => <p key={`${visitor.referrer}-${index}`} className="mb-1 truncate text-xs">{visitor.referrer}</p>) : <p className="text-xs text-slate-400">Sin datos todavía</p>}</div>
                </div>
                <div className="mt-4 border-t border-emerald-100 pt-3"><p className="mb-2 text-[10px] font-black uppercase text-slate-500">Recientes</p>{analytics.recentVisitors.length ? <div className="grid gap-1 sm:grid-cols-2">{analytics.recentVisitors.slice(0, 6).map((visitor, index) => <p key={`${visitor.createdAt}-${index}`} className="truncate text-xs text-slate-600">{visitor.path} · {visitor.referrer}</p>)}</div> : <p className="text-xs text-slate-400">Sin visitantes recientes</p>}</div>
              </section>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[
                  ['Visitantes hoy', analytics.dailyVisits],
                  ['Visitantes total', analytics.totalVisits],
                  ['Visitas únicas 24h', analytics.uniqueVisitors],
                  ['Páginas vistas 24h', analytics.pathsViewed24h],
                ].map(([label, value], index) => <div key={String(label)} className={`rounded-xl border p-4 ${index === 0 ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white'}`}><p className="text-[10px] font-bold uppercase text-slate-500">{label}</p><strong className="mt-1 block text-2xl">{Number(value).toLocaleString()}</strong></div>)}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <section className="min-h-44 rounded-xl border border-slate-200 bg-white p-4"><h4 className="text-xs font-black">De dónde vienen (24h)</h4><div className="mt-5 space-y-3">{analytics.visitorSources.length ? analytics.visitorSources.map((source) => <div key={source.source}><div className="flex justify-between text-xs"><span className="truncate">{source.source}</span><strong>{source.visits ?? 0}</strong></div><div className="mt-1 h-1.5 overflow-hidden rounded bg-slate-100"><div className="h-full bg-[#18B68B]" style={{ width: `${source.percentage}%` }} /></div></div>) : <p className="py-10 text-center text-xs text-slate-400">Sin datos todavía</p>}</div></section>
                <section className="min-h-44 rounded-xl border border-slate-200 bg-white p-4"><h4 className="text-xs font-black">Visitas · últimos 7 días</h4><div className="mt-6 flex h-24 items-end gap-2">{analytics.visitsLast7.map((day) => { const max = Math.max(1, ...analytics.visitsLast7.map((item) => item.visits)); return <div key={day.date} className="flex h-full flex-1 flex-col justify-end text-center"><span className="text-[10px] font-bold">{day.visits}</span><div className="mt-1 min-h-px bg-[#18B68B]" style={{ height: `${Math.max(2, (day.visits / max) * 70)}px` }} /><span className="mt-1 text-[9px] text-slate-400">{day.label}</span></div>; })}</div></section>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[
                  ['Total lista de espera', waitlistEntries.length],
                  ['Vecinos', waitlistByType.vecino],
                  ['Comercios', waitlistByType.comercio],
                  ['Servicios', waitlistByType.servicio],
                ].map(([label, value], index) => <div key={String(label)} className={`rounded-xl border p-4 ${index === 0 ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white'}`}><p className="text-[10px] font-bold uppercase text-slate-500">{label}</p><strong className="mt-1 block text-2xl">{value}</strong></div>)}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <section className="min-h-40 rounded-xl border border-slate-200 bg-white p-4"><h4 className="text-xs font-black">Registros · últimos 7 días</h4><div className="mt-5 flex h-20 items-end gap-2">{waitlistLast7.map((day) => { const max = Math.max(1, ...waitlistLast7.map((item) => item.count)); return <div key={day.key} className="flex h-full flex-1 flex-col justify-end text-center"><span className="text-[10px] font-bold">{day.count}</span><div className="mt-1 min-h-px bg-[#18B68B]" style={{ height: `${Math.max(2, (day.count / max) * 55)}px` }} /><span className="mt-1 text-[9px] text-slate-400">{day.label}</span></div>; })}</div></section>
                <section className="min-h-40 rounded-xl border border-slate-200 bg-white p-4"><h4 className="text-xs font-black">Por comuna</h4><div className="mt-4 space-y-3">{communeCounts.length ? communeCounts.slice(0, 8).map(([commune, count]) => <div key={commune} className="grid grid-cols-[minmax(90px,auto)_1fr_20px] items-center gap-3 text-xs"><span>{commune}</span><div className="h-1.5 rounded bg-slate-100"><div className="h-full rounded bg-[#18B68B]" style={{ width: `${(count / communeCounts[0][1]) * 100}%` }} /></div><strong>{count}</strong></div>) : <p className="py-8 text-center text-xs text-slate-400">Sin registros todavía</p>}</div></section>
              </div>

              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white"><h4 className="border-b border-slate-200 px-4 py-3 text-xs font-black">Registros recientes</h4>{waitlistEntries.length ? waitlistEntries.slice(0, 8).map((entry) => <div key={entry.id} className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-0"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#18B68B] text-xs font-black text-white">{entry.nombre.charAt(0).toUpperCase()}</span><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold">{entry.nombre}</p><p className="truncate text-[10px] text-slate-400">{entry.correo}</p></div><span className="rounded-full bg-blue-50 px-2 py-1 text-[9px] font-bold capitalize text-blue-700">{entry.tipo_registro}</span><span className="text-[10px] text-slate-500">{entry.comuna}</span><span className="text-[10px] text-slate-400">{entry.fecha.slice(0, 10)}</span></div>) : <p className="p-6 text-center text-xs text-slate-400">Sin registros todavía</p>}</section>
            </div>
          )}

          {/* TAB 3: INTEGRACIONES & PIXELES */}
          {activeTab === 'integraciones' && (
            <div className="space-y-4 max-w-3xl">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Google Analytics 4 (GA4)</h4>
                    <p className="text-xs text-slate-500">Medición de eventos de conversión y tráfico</p>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Pendiente
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Meta / Facebook Pixel</h4>
                    <p className="text-xs text-slate-500">Seguimiento de campañas en Instagram y Facebook</p>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Pendiente
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">TikTok Pixel & Hotjar</h4>
                    <p className="text-xs text-slate-500">Mapas de calor de interacción y métricas sociales</p>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Pendiente
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Bar */}
        <div className="bg-white border-t border-slate-200 p-4 px-6 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <button onClick={handleLogout} className="flex items-center gap-2 font-bold text-slate-500 hover:text-red-700">
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </button>
          <button onClick={onClose} className="bg-slate-900 text-white font-bold px-5 py-2 rounded-xl hover:bg-slate-800 cursor-pointer">Cerrar Panel</button>
        </div>

      </div>
    </div>
  );
}
