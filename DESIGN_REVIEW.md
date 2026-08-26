# Revisión de diseño, integración y despliegue — El Barrio

Fecha: 2026-08-26  
Rama de trabajo: `codex/design-review-20260825`  
Punto de retorno inicial: `pre-design-review-20260825` (`75a8f9f`)

## Alcance protegido

El trabajo corresponde exclusivamente al clon de `rocketcodecl/Landing-El-barrio`. No se modificaron `rocketcodecl/elbarrio`, la aplicación móvil ni su panel administrativo. La landing fue desplegada en `elbarrio.lat` después de la autorización expresa del propietario. La versión estática anterior y el sitio Next.js anterior quedaron respaldados en el servidor.

## Qué funciona con datos persistentes

- Landing React + Vite + TypeScript con tipografía Lato, siguiendo la familia principal usada por WhatRuns, y el logotipo oficial entregado.
- Formulario de inscripción conectado a `/api/waitlist`, con validación, control de duplicados, código de referido y almacenamiento persistente.
- Panel actual de la landing accesible mediante `?admin=1`, protegido por la cuenta administrativa existente.
- CMS conectado a `/api/site-content`; los cambios se guardan en el servidor. `localStorage` se conserva solo como respaldo del navegador.
- Registros reales consultables en el panel y exportables como CSV.
- Analytics propios: visitas, visitantes únicos, páginas, referencias y presencia en vivo, almacenados o calculados por el backend.
- Dashboard de métricas con actividad en vivo, fuentes, páginas vistas, series de siete días, lista de espera por perfil y comuna, y registros recientes.
- Editor total con controles para todos los campos persistentes, orden y visibilidad de secciones, además de edición JSON avanzada.
- API Express ejecutada como servicio de sistema y expuesta únicamente mediante el proxy HTTPS de `/api/`.
- Copia automática horaria de los datos persistentes, con retención de 30 días.

## Qué continúa siendo demostrativo

- Publicaciones, autores, imágenes, comercios, calificaciones y distancias iniciales provienen de `src/data/mockData.ts` y de URLs de Unsplash.
- Los porcentajes de activación territorial son referenciales.
- Las pantallas de la app, el mapa, chat, alertas, reputación, verificación y moderación son representaciones visuales; no controlan la aplicación móvil.
- GA4, Meta Pixel, TikTok Pixel y Hotjar no están incorporados. El panel muestra analytics propios de esta landing.
- Los textos legales siguen siendo informativos y requieren validación jurídica antes de considerarse definitivos.

## Diseño aplicado

- Se instaló Lato como familia tipográfica principal.
- Se sustituyó la marca tipográfica anterior por el logotipo PNG oficial.
- Se rediseñó por completo la sección de preguntas frecuentes, incluida su jerarquía, navegación por categorías, acordeón, estados y adaptación móvil.
- Se mantuvo oculto el acceso administrativo de la navegación pública.
- Se ajustaron accesibilidad, foco visible, semántica de diálogos y respeto por `prefers-reduced-motion`.

## Dependencias

Se confirmó que Gemini no tenía imports, inicialización ni llamadas y fue retirado. Express inicialmente tampoco se usaba, pero se incorporó después de forma deliberada para servir la API real de la landing; por eso actualmente sí es una dependencia necesaria.

## Validación

- `npm run lint`: aprobado.
- `npm run build`: aprobado.
- `npm audit`: 0 vulnerabilidades reportadas.
- API y servicio de sistema: activos.
- Página, bundle, logo y endpoints públicos: respuesta HTTP correcta.
- Endpoint administrativo sin sesión: bloqueado con HTTP 401.
- Inscripción persistente: verificada de extremo a extremo con un registro técnico que luego fue eliminado.
- Copia de seguridad de datos: ejecutada y verificada.

## Acceso y revisión

- Landing pública: `https://elbarrio.lat/`
- Panel actual de esta landing: `https://elbarrio.lat/?admin=1`

La revisión visual final debe comprobar al menos anchos de 390 px, 768 px, 1280 px y 1440 px, además de los flujos de vecino, comercio y servicio, menú móvil, filtros, FAQ, modales legales y CMS.
