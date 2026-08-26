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
          percentage: totalSources ? Math.round((item.visits / totalSources) * 100) : 0,
        })),
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
            <div className="space-y-6">
              
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-500 font-medium">Visitantes Activos</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    <h4 className="text-2xl font-black text-slate-900">{analytics.activeVisitors}</h4>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-500 font-medium">Visitas Hoy</span>
                  <h4 className="text-2xl font-black text-slate-900 mt-1">{analytics.dailyVisits.toLocaleString()}</h4>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-500 font-medium">Visitas Totales</span>
                  <h4 className="text-2xl font-black text-slate-900 mt-1">{analytics.totalVisits.toLocaleString()}</h4>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-500 font-medium">Visitantes Únicos</span>
                  <h4 className="text-2xl font-black text-[#18B68B] mt-1">{analytics.uniqueVisitors.toLocaleString()}</h4>
                </div>
              </div>

              {/* Traffic Sources Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">Origen de Visitantes</h4>
                  <div className="space-y-2 text-xs">
                    {analytics.visitorSources.map((src, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between font-medium text-slate-700">
                          <span>{src.source}</span>
                          <span className="font-bold">{src.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#18B68B] h-full rounded-full" 
                            style={{ width: `${src.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">Páginas Más Visitadas</h4>
                  <div className="space-y-2 text-xs">
                    {analytics.topPages.map((page, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                        <span className="font-mono font-bold text-slate-800">{page.path}</span>
                        <span className="text-slate-500 font-semibold">{page.visits.toLocaleString()} visitas</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

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
