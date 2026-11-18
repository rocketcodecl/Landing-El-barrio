import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcryptjs';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const app = express();
const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = path.resolve(process.env.ELBARRIO_DATA_DIR || process.env.DATA_DIR || './data');
const MEDIA_DIR = path.join(DATA_DIR, 'media');
const AUTH_SECRET = process.env.AUTH_SECRET || process.env.ADMIN_TOKEN;
const SESSION_COOKIE = 'barrio_session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const liveVisitors = new Map();
const loginAttempts = new Map();

if (!AUTH_SECRET) {
  throw new Error('AUTH_SECRET is required');
}

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '6mb' }));
app.use((req, res, next) => {
  res.set({
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  });
  next();
});
app.use('/api/media/files', express.static(MEDIA_DIR, { fallthrough: false, maxAge: '7d', immutable: true }));

const filePath = (name) => path.join(DATA_DIR, name);

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson(name, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath(name), 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') return fallback;
    throw error;
  }
}

async function writeJson(name, data) {
  await ensureDataDir();
  const destination = filePath(name);
  const temporary = `${destination}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(data, null, 2), { mode: 0o640 });
  await fs.rename(temporary, destination);
}

function cookies(req) {
  return Object.fromEntries(
    String(req.headers.cookie || '')
      .split(';')
      .map((part) => part.trim().split('='))
      .filter(([key, value]) => key && value)
      .map(([key, value]) => [key, decodeURIComponent(value)]),
  );
}

function signSession(username, expires) {
  const payload = `${username}|${expires}`;
  const signature = createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  return `${payload}|${signature}`;
}

async function authenticated(req) {
  const value = cookies(req)[SESSION_COOKIE];
  if (!value) return false;
  const [username, expiresRaw, signature] = value.split('|');
  const expires = Number(expiresRaw);
  if (!username || !expires || Date.now() > expires || !signature) return false;
  const expected = createHmac('sha256', AUTH_SECRET).update(`${username}|${expires}`).digest('hex');
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  const users = await readJson('users.json', []);
  return users.some((user) => user.username === username);
}

async function requireAdmin(req, res, next) {
  if (await authenticated(req)) return next();
  res.status(401).json({ error: 'No autorizado' });
}

function sanitizeText(value, max = 500) {
  return String(value ?? '').trim().slice(0, max);
}

function normalizeWhatsapp(value) {
  const raw = sanitizeText(value, 30);
  const digits = raw.replace(/\D/g, '');
  if (/^9\d{8}$/.test(digits)) return '+56' + digits;
  if (/^56\d{9}$/.test(digits)) return '+' + digits;
  if (raw.startsWith('+') && /^\d{8,15}$/.test(digits)) return '+' + digits;
  return null;
}

function referralCode(entries) {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const bytes = randomBytes(5);
    const code = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('');
    if (!entries.some((entry) => entry.referralCode === code)) return code;
  }
  return randomBytes(4).toString('hex').toUpperCase();
}

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'elbarrio-landing-api' }));

app.get('/api/auth/status', async (req, res) => {
  const users = await readJson('users.json', []);
  res.json({ installed: users.length > 0, authenticated: await authenticated(req) });
});

app.post('/api/auth/login', async (req, res) => {
  const ip = req.ip || 'unknown';
  const recent = (loginAttempts.get(ip) || []).filter((time) => Date.now() - time < 15 * 60 * 1000);
  if (recent.length >= 8) return res.status(429).json({ error: 'Demasiados intentos. Intenta nuevamente en 15 minutos.' });

  const username = sanitizeText(req.body?.username, 100).toLowerCase();
  const password = String(req.body?.password ?? '');
  const users = await readJson('users.json', []);
  const user = users.find((candidate) => candidate.username === username);
  const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!valid) {
    loginAttempts.set(ip, [...recent, Date.now()]);
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
  }

  loginAttempts.delete(ip);
  const expires = Date.now() + SESSION_TTL_MS;
  res.cookie(SESSION_COOKIE, signSession(username, expires), {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_TTL_MS,
  });
  res.json({ success: true, username });
});

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie(SESSION_COOKIE, { httpOnly: true, secure: true, sameSite: 'strict', path: '/' });
  res.json({ success: true });
});

app.get('/api/site-content', async (_req, res) => {
  res.json({ content: await readJson('site-content.json', null) });
});

app.put('/api/site-content', requireAdmin, async (req, res) => {
  const content = req.body?.content;
  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    return res.status(400).json({ error: 'Contenido inválido' });
  }
  const encoded = JSON.stringify(content);
  if (Buffer.byteLength(encoded) > 5 * 1024 * 1024) {
    return res.status(413).json({ error: 'El contenido supera el máximo permitido' });
  }
  await writeJson('site-content.json', content);
  res.json({ success: true, savedAt: new Date().toISOString() });
});

const mediaMimeTypes = new Map([
  ['image/png', 'png'],
  ['image/jpeg', 'jpg'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
]);

app.get('/api/media', requireAdmin, async (_req, res) => {
  await fs.mkdir(MEDIA_DIR, { recursive: true });
  const names = await fs.readdir(MEDIA_DIR);
  const files = await Promise.all(names.map(async (name) => {
    const stat = await fs.stat(path.join(MEDIA_DIR, name));
    return { name, url: `/api/media/files/${encodeURIComponent(name)}`, size: stat.size, createdAt: stat.birthtime.toISOString() };
  }));
  res.json({ files: files.sort((a, b) => b.createdAt.localeCompare(a.createdAt)) });
});

app.post('/api/media', requireAdmin, async (req, res) => {
  const mimeType = sanitizeText(req.body?.mimeType, 100).toLowerCase();
  const extension = mediaMimeTypes.get(mimeType);
  const encoded = String(req.body?.dataBase64 || '').replace(/^data:[^;]+;base64,/, '');
  if (!extension || !encoded) return res.status(400).json({ error: 'Solo se permiten imágenes PNG, JPG, WEBP o GIF' });
  const buffer = Buffer.from(encoded, 'base64');
  if (!buffer.length || buffer.length > 5 * 1024 * 1024) return res.status(413).json({ error: 'La imagen debe pesar menos de 5 MB' });
  const originalName = sanitizeText(req.body?.filename, 140).replace(/[^a-zA-Z0-9._-]/g, '-').replace(/\.[^.]+$/, '') || 'imagen';
  const name = `${Date.now()}-${randomBytes(4).toString('hex')}-${originalName}.${extension}`;
  await fs.mkdir(MEDIA_DIR, { recursive: true });
  await fs.writeFile(path.join(MEDIA_DIR, name), buffer, { mode: 0o640 });
  res.status(201).json({ success: true, name, url: `/api/media/files/${encodeURIComponent(name)}` });
});

app.delete('/api/media/:name', requireAdmin, async (req, res) => {
  const name = path.basename(req.params.name);
  if (!name || name !== req.params.name) return res.status(400).json({ error: 'Archivo inválido' });
  try {
    await fs.unlink(path.join(MEDIA_DIR, name));
    res.json({ success: true });
  } catch (error) {
    if (error?.code === 'ENOENT') return res.status(404).json({ error: 'Archivo no encontrado' });
    throw error;
  }
});

// Sincronización directa Contabo -> Supabase, sin dependencia de Vercel.
// El servidor guarda primero y reintenta cualquier réplica pendiente.
const SUPABASE_PROJECT_URL = process.env.SUPABASE_PROJECT_URL;
const SUPABASE_PUBLIC_KEY = process.env.SUPABASE_PUBLIC_KEY;
const CONTABO_BRIDGE_TOKEN = process.env.CONTABO_BRIDGE_TOKEN;
if (!SUPABASE_PROJECT_URL?.startsWith('https://') ||
    !SUPABASE_PUBLIC_KEY?.startsWith('sb_publishable_') ||
    !CONTABO_BRIDGE_TOKEN) {
  throw new Error('Configuración de réplica Contabo -> Supabase incompleta');
}
const MIRROR_RPC_URL = SUPABASE_PROJECT_URL + '/rest/v1/rpc/mirror_landing_registration_contabo';
const RESOLVE_UV_RPC_URL = SUPABASE_PROJECT_URL + '/rest/v1/rpc/resolve_landing_uv_contabo';

// Las coordenadas recibidas se usan solo para hallar la UV: no se guardan en waitlist.json.
function normalizeCommune(value) {
  return sanitizeText(value, 120).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toUpperCase().replace(/\s+/g, ' ').replace(/^SANTIAGO CENTRO$/, 'SANTIAGO');
}
function validMapPoint(value) {
  const lat = Number(value?.lat);
  const lng = Number(value?.lng);
  return value && Number.isFinite(lat) && Number.isFinite(lng) &&
    lat >= -56 && lat <= -17 && lng >= -76 && lng <= -66
    ? { lat, lng } : null;
}
async function resolveLandingUv(point, comuna) {
  const response = await fetch(RESOLVE_UV_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: SUPABASE_PUBLIC_KEY },
    body: JSON.stringify({ p_token: CONTABO_BRIDGE_TOKEN, p_lat: point.lat, p_lng: point.lng,
      p_comuna: normalizeCommune(comuna) }),
    signal: AbortSignal.timeout(9000),
  });
  if (!response.ok) throw new Error('UV lookup RPC HTTP ' + response.status);
  const value = await response.json();
  return value?.neighborhoodId && /^[a-f0-9-]{36}$/i.test(value.neighborhoodId)
    ? { neighborhoodId: value.neighborhoodId, uvCode: sanitizeText(value.uvCode, 80) }
    : null;
}
// Control de abuso sobre el endpoint público (no registra latitud/longitud ni IP en disco).
const uvLookupAttempts = new Map();
app.post('/api/territory/resolve', async (req, res) => {
  const point = validMapPoint(req.body);
  const comuna = sanitizeText(req.body?.comuna, 120);
  if (!point || !comuna) return res.status(400).json({ error: 'Selecciona un punto y una comuna válidos.' });
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const recent = (uvLookupAttempts.get(ip) || []).filter(t => now - t < 10 * 60 * 1000);
  if (recent.length >= 20) return res.status(429).json({ error: 'Demasiadas consultas. Intenta más tarde.' });
  if (uvLookupAttempts.size > 5000) uvLookupAttempts.clear();
  uvLookupAttempts.set(ip, [...recent, now]);
  try {
    const uv = await resolveLandingUv(point, comuna);
    res.json(uv ? { found: true, ...uv } : { found: false });
  } catch {
    res.status(503).json({ error: 'La identificación del sector no está disponible temporalmente.' });
  }
});

// Serializar todas las escrituras al archivo JSON para evitar inscripciones perdidas.
let waitlistTail = Promise.resolve();
function queueWaitlistWrite(action) {
  const work = waitlistTail.then(action, action);
  waitlistTail = work.catch(() => undefined);
  return work;
}
let syncBusy = false;

async function mirrorRegistration(entry) {
  const response = await fetch(MIRROR_RPC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_PUBLIC_KEY,
    },
    body: JSON.stringify({
      p_token: CONTABO_BRIDGE_TOKEN,
      p_payload: {
        participantType: entry.participantType,
        nombre: entry.nombre,
        correo: entry.correo,
        whatsapp: entry.whatsapp,
        comuna: entry.comuna,
        nombreNegocio: entry.nombreNegocio,
        rubro: entry.rubro,
        neighborhoodId: entry.neighborhoodId || null,
        uvCode: entry.uvCode || null,
      },
    }),
    signal: AbortSignal.timeout(9000),
  });
  if (!response.ok) throw new Error('Supabase RPC HTTP ' + response.status);
  const id = await response.json();
  if (typeof id !== 'string' || !/^[a-f0-9-]{36}$/i.test(id)) throw new Error('Respuesta inesperada del RPC');
}

async function syncPendingRegistrations() {
  if (syncBusy) return;
  syncBusy = true;
  try {
    const items = await readJson('waitlist.json', []);
    const pending = items.filter((entry) => entry.mirrorStatus === 'pending').slice(0, 25);
    for (const entry of pending) {
      try {
        await mirrorRegistration(entry);
        await queueWaitlistWrite(async () => {
          const current = await readJson('waitlist.json', []);
          const found = current.find((item) => item.id === entry.id && item.mirrorStatus === 'pending');
          if (!found) return;
          found.mirrorStatus = 'synced';
          found.mirroredAt = new Date().toISOString();
          await writeJson('waitlist.json', current);
        });
      } catch (error) {
        // No registrar nombres, correo, WhatsApp ni payloads.
        console.error('[landing-mirror] Réplica pendiente:', error?.name || 'Error');
        break;
      }
    }
  } finally {
    syncBusy = false;
  }
}

setTimeout(() => void syncPendingRegistrations(), 5000).unref();
setInterval(() => void syncPendingRegistrations(), 60000).unref();

app.post('/api/waitlist', async (req, res) => {
  const participantType = sanitizeText(req.body?.participantType ?? req.body?.tipo_registro, 20);
  const nombre = sanitizeText(req.body?.nombre, 160);
  const correo = sanitizeText(req.body?.correo, 200).toLowerCase();
  const comuna = sanitizeText(req.body?.comuna, 120);
  const nombreNegocio = sanitizeText(req.body?.nombreNegocio, 180);
  const rubro = sanitizeText(req.body?.rubro, 180);
  if (!['vecino', 'comercio', 'servicio'].includes(participantType)) return res.status(400).json({ error: 'Tipo de registro inválido' });
  if (!nombre || !correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return res.status(400).json({ error: 'Nombre y correo válido son requeridos' });
  if (!comuna) return res.status(400).json({ error: 'La comuna es requerida' });
  const whatsapp = normalizeWhatsapp(req.body?.whatsapp);
  if (!whatsapp) return res.status(400).json({ error: 'Ingresa un WhatsApp válido. Es obligatorio.' });
  if (participantType === 'comercio' && (!nombreNegocio || !rubro)) return res.status(400).json({ error: 'Nombre y rubro del comercio son requeridos' });
  if (participantType === 'servicio' && !rubro) return res.status(400).json({ error: 'El servicio u oficio es requerido' });

  let uv = null;
  if (req.body?.sector != null) {
    const point = validMapPoint(req.body.sector);
    if (!point) return res.status(400).json({ error: 'El punto del mapa es inválido.' });
    try {
      uv = await resolveLandingUv(point, comuna);
    } catch {
      return res.status(503).json({ error: 'No pudimos confirmar tu sector. Intenta otra vez o continúa solo con tu comuna.' });
    }
    if (!uv) return res.status(422).json({ error: 'El punto no pertenece a una UV reconocida de esta comuna. Elige otro punto o continúa solo con tu comuna.' });
  }

  const result = await queueWaitlistWrite(async () => {
    const entries = await readJson('waitlist.json', []);
    if (entries.some((entry) => String(entry.correo).toLowerCase() === correo)) {
      return { duplicate: true };
    }
    const entry = {
      id: randomBytes(12).toString('hex'),
      participantType,
      nombre,
      correo,
      whatsapp,
      comuna,
      nombreNegocio: nombreNegocio || null,
      rubro: rubro || null,
      neighborhoodId: uv?.neighborhoodId || null,
      uvCode: uv?.uvCode || null,
      referralCode: referralCode(entries),
      createdAt: new Date().toISOString(),
      mirrorStatus: 'pending',
    };
    entries.push(entry);
    await writeJson('waitlist.json', entries);
    return { entry, position: entries.length };
  });

  if (result.duplicate) {
    return res.status(409).json({ error: 'Ya existe una inscripción con ese correo', duplicate: true });
  }
  res.status(201).json({
    success: true, id: result.entry.id,
    referralCode: result.entry.referralCode, position: result.position,
  });
  // Confirmar inscripción desde almacenamiento local; sincronización recuperable.
  void syncPendingRegistrations();
});

app.get('/api/waitlist', requireAdmin, async (req, res) => {
  const search = sanitizeText(req.query.search, 100).toLowerCase();
  const type = sanitizeText(req.query.type, 20);
  let entries = await readJson('waitlist.json', []);
  if (type && type !== 'todos') entries = entries.filter((entry) => entry.participantType === type);
  if (search) entries = entries.filter((entry) => [entry.nombre, entry.correo, entry.comuna].some((value) => String(value || '').toLowerCase().includes(search)));
  entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ entries, total: entries.length });
});

app.delete('/api/waitlist/:id', requireAdmin, async (req, res) => {
  const removed = await queueWaitlistWrite(async () => {
    const entries = await readJson('waitlist.json', []);
    const next = entries.filter((entry) => entry.id !== req.params.id);
    if (next.length === entries.length) return false;
    await writeJson('waitlist.json', next);
    return true;
  });
  if (!removed) return res.status(404).json({ error: 'Registro no encontrado' });
  res.json({ success: true });
});

app.get('/api/waitlist.csv', requireAdmin, async (_req, res) => {
  const entries = await readJson('waitlist.json', []);
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const rows = entries.map((entry) => [entry.id, entry.nombre, entry.correo, entry.whatsapp, entry.comuna, entry.participantType, entry.nombreNegocio, entry.rubro, entry.createdAt, entry.uvCode, entry.neighborhoodId].map(escape).join(','));
  res.type('text/csv').attachment(`elbarrio-registros-${new Date().toISOString().slice(0, 10)}.csv`).send(['ID,Nombre,Correo,WhatsApp,Comuna,Tipo,Negocio,Rubro,Fecha,UV,ID_Territorio', ...rows].join('\n'));
});

app.post('/api/analytics/visit', async (req, res) => {
  const sessionId = sanitizeText(req.body?.sessionId, 128);
  if (!sessionId) return res.status(400).json({ error: 'sessionId requerido' });
  const visits = await readJson('visits.json', []);
  const since = Date.now() - 30 * 60 * 1000;
  if (!visits.some((visit) => visit.sessionId === sessionId && new Date(visit.createdAt).getTime() >= since)) {
    visits.push({
      id: randomBytes(12).toString('hex'),
      sessionId,
      path: sanitizeText(req.body?.path || '/', 300),
      referrer: sanitizeText(req.body?.referrer, 500) || null,
      userAgent: sanitizeText(req.headers['user-agent'], 500) || null,
      createdAt: new Date().toISOString(),
    });
    if (visits.length > 50000) visits.splice(0, visits.length - 50000);
    await writeJson('visits.json', visits);
  }
  res.json({ success: true });
});

app.post('/api/analytics/live', (req, res) => {
  const sessionId = sanitizeText(req.body?.sessionId, 128);
  if (!sessionId) return res.status(400).json({ error: 'sessionId requerido' });
  liveVisitors.set(sessionId, { path: sanitizeText(req.body?.path || '/', 300), referrer: sanitizeText(req.body?.referrer, 500) || 'direct', lastSeen: Date.now() });
  res.json({ success: true });
});

app.get('/api/analytics', requireAdmin, async (_req, res) => {
  const now = Date.now();
  const startToday = new Date();
  startToday.setHours(0, 0, 0, 0);
  for (const [key, value] of liveVisitors) if (now - value.lastSeen > 65000) liveVisitors.delete(key);
  const visits = await readJson('visits.json', []);
  const last24h = visits.filter((visit) => now - new Date(visit.createdAt).getTime() <= 24 * 60 * 60 * 1000);
  const last7Days = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(now - (6 - offset) * 24 * 60 * 60 * 1000);
    const key = date.toISOString().slice(0, 10);
    return {
      date: key,
      label: new Intl.DateTimeFormat('es-CL', { weekday: 'short' }).format(date).replace('.', ''),
      visits: visits.filter((visit) => String(visit.createdAt || '').slice(0, 10) === key).length,
    };
  });
  const countBy = (items, key) => Object.entries(items.reduce((acc, item) => {
    const value = item[key] || 'direct';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {})).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 10);
  res.json({
    activeVisitors: liveVisitors.size,
    dailyVisits: visits.filter((visit) => new Date(visit.createdAt) >= startToday).length,
    totalVisits: visits.length,
    uniqueVisitors: new Set(last24h.map((visit) => visit.sessionId)).size,
    pathsViewed24h: new Set(last24h.map((visit) => visit.path || '/')).size,
    topPages: countBy(last24h, 'path').map(({ name, count }) => ({ path: name, visits: count })),
    visitorSources: countBy(last24h, 'referrer').map(({ name, count }) => ({ source: name, visits: count })),
    visitsLast7: last7Days,
    liveVisitors: [...liveVisitors.values()].sort((a, b) => b.lastSeen - a.lastSeen),
    recentVisitors: visits.slice(-8).reverse().map(({ path: visitPath, referrer, createdAt }) => ({ path: visitPath || '/', referrer: referrer || 'direct', createdAt })),
  });
});

app.use('/api', (_req, res) => res.status(404).json({ error: 'Endpoint no encontrado' }));

await ensureDataDir();
app.listen(PORT, '127.0.0.1', () => {
  console.log(`El Barrio API listening on 127.0.0.1:${PORT}`);
});
