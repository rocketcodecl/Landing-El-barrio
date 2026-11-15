# API independiente del landing — corte 14-11-2026

## Producción y fuente de verdad

- Sitio: https://elbarrio.lat/
- Backend: /var/www/vhosts/elbarrio.lat/landing-backend/server/index.mjs
- Servicio: elbarrio-landing-api.service (Node/Express detrás del proxy Nginx de Plesk)
- Datos: /var/www/vhosts/elbarrio.lat/private/landing-data/waitlist.json
- Administrador antiguo: https://elbarrio.lat/admin/
- Administrador de la app: https://admin.elbarrio.lat/, módulo Consultas
- Frontend nuevo: repositorio rocketcodecl/el-barrio-finalland

## Diseño del formulario

Vecino, comercio y servicio aportan nombre, correo, WhatsApp y comuna. Comercio añade nombre comercial y rubro; servicio añade rubro u oficio. WhatsApp es obligatorio tanto en la interfaz como en la API. Se valida un móvil chileno o un número internacional explícito con prefijo más (+).

La inscripción es una lista de interesados en recibir novedades y enlaces de descarga, NO un usuario de la app ni una verificación territorial.

## Persistencia y réplica directa

La API escribe primero el registro en waitlist.json, con escritura atómica y serialización de operaciones. Cada nuevo registro lleva mirrorStatus=pending; un proceso recuperable usa fetch HTTPS directo a SUPABASE_PROJECT_URL/rest/v1/rpc/mirror_landing_registration_contabo con un token exclusivo de Contabo.

Si falla Supabase, el registro local ya está persistido. Se reintenta después del arranque y cada 60 s. La réplica usa deduplicación por correo y tipo. Al confirmar el RPC, mirrorStatus=synced y mirroredAt quedan registrados en el archivo local. Los registros anteriores, sin mirrorStatus, se preservan y no se reenvían automáticamente.

La función Supabase y la restricción de credenciales se crearon mediante la migración 20261114_landing_contabo_bridge.sql. La huella SHA-256 del token de Contabo vive en landing_bridge_private.bridge_secrets, id=2. El token real solo reside en .env del backend; jamás se publica en GitHub ni en frontend.

Variables del backend: AUTH_SECRET, PORT, DATA_DIR, SUPABASE_PROJECT_URL, SUPABASE_PUBLIC_KEY y CONTABO_BRIDGE_TOKEN. Guardar .env con permisos restrictivos.

El antiguo puente de Vercel ya NO participa en el POST del sitio público. La vieja función de Supabase, mirror_landing_registration, se conserva solo como mecanismo de reversión hasta terminar la baja del despliegue anterior.

## Verificación y seguridad

- Health GET /api/health devuelve 200.
- POST con campos inválidos, WhatsApp ausente o incorrecto devuelve 400 sin crear datos.
- Primer registro válido devuelve 201 y un id/referralCode; duplicado por correo devuelve 409.
- GET /api/waitlist, CSV y DELETE exigen la sesión administrativa y devuelven 401 sin ella.
- QAs aislados: vecino/comercio/servicio 201, los tres mirrorStatus=synced, duplicado 409, WhatsApp ausente/inválido 400. Filas sintéticas borradas después.
- Ningún servidor ni navegador solicita recursos de Vercel en el flujo de registro nuevo.

No exponer datos personales en logs. La sincronización no implica envío de mensajes; para WhatsApp se utiliza el botón manual del administrador.

## Rollback y cuidado de datos

Backup de API previo a independencia: /var/www/vhosts/elbarrio.lat/private/landing-independence-backup-20261114/backend-index-before.mjs
Backup de .env: /var/www/vhosts/elbarrio.lat/private/landing-independence-backup-20261114/landing-backend.env.before

1. Antes de cualquier reversión, revisar registros nuevos y estado de sincronización.
2. Restaurar código anterior únicamente si es compatible con el flujo elegido. No restaurar JSON antiguo sobre registros vivos.
3. Comprobar sintaxis con node --check y luego systemctl restart elbarrio-landing-api.service.
4. Verificar GET /api/health, POST inválido 400 y consulta protegida 401.

La app Android/iOS, Radar y Motor Territorial no están involucrados en este despliegue.
