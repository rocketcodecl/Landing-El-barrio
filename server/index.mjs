import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcryptjs';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const app = express();
const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = path.resolve(process.env.ELBARRIO_DATA_DIR || process.env.DATA_DIR || './data');
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
  const digits = sanitizeText(value, 30).replace(/\D/g, '');
  if (!digits) return null;
  return digits.startsWith('56') ? `+${digits}` : `+56${digits}`;
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
  if (participantType === 'comercio' && (!nombreNegocio || !rubro)) return res.status(400).json({ error: 'Nombre y rubro del comercio son requeridos' });
  if (participantType === 'servicio' && !rubro) return res.status(400).json({ error: 'El servicio u oficio es requerido' });

  const entries = await readJson('waitlist.json', []);
  if (entries.some((entry) => String(entry.correo).toLowerCase() === correo)) {
    return res.status(409).json({ error: 'Ya existe una inscripción con ese correo', duplicate: true });
  }
  const entry = {
    id: randomBytes(12).toString('hex'),
    participantType,
    nombre,
    correo,
    whatsapp: normalizeWhatsapp(req.body?.whatsapp),
    comuna,
    nombreNegocio: nombreNegocio || null,
    rubro: rubro || null,
    referralCode: referralCode(entries),
    createdAt: new Date().toISOString(),
  };
  entries.push(entry);
  await writeJson('waitlist.json', entries);
  res.status(201).json({ success: true, id: entry.id, referralCode: entry.referralCode, position: entries.length });
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
  const entries = await readJson('waitlist.json', []);
  const next = entries.filter((entry) => entry.id !== req.params.id);
  if (next.length === entries.length) return res.status(404).json({ error: 'Registro no encontrado' });
  await writeJson('waitlist.json', next);
  res.json({ success: true });
});

app.get('/api/waitlist.csv', requireAdmin, async (_req, res) => {
  const entries = await readJson('waitlist.json', []);
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const rows = entries.map((entry) => [entry.id, entry.nombre, entry.correo, entry.whatsapp, entry.comuna, entry.participantType, entry.nombreNegocio, entry.rubro, entry.createdAt].map(escape).join(','));
  res.type('text/csv').attachment(`elbarrio-registros-${new Date().toISOString().slice(0, 10)}.csv`).send(['ID,Nombre,Correo,WhatsApp,Comuna,Tipo,Negocio,Rubro,Fecha', ...rows].join('\n'));
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
