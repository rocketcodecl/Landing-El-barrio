# AI Context — Landing pública de El Barrio

Última actualización: 2 de septiembre de 2026.

Este documento entrega continuidad a cualquier nuevo chat o agente que trabaje en la landing. El código vigente tiene prioridad si algo de este archivo queda desactualizado.

## Identidad y alcance

- Producto: landing pública para presentar El Barrio a vecinos, comercios y prestadores.
- Producción: `https://elbarrio.lat/`.
- Proyecto local: `/Users/fenha/Desktop/Landing-El-barrio-design-review`.
- Repositorio: `https://github.com/rocketcodecl/Landing-El-barrio.git`.
- Rama de trabajo vigente: `codex/design-review-20260825`.
- Último commit al crear este documento: `180df62`.
- Punto de retorno anterior al bloque visual: rama y tag `checkpoint/landing-antes-ajuste-visual-20260830` / `landing-antes-ajuste-visual-20260830`.
- Esta carpeta es independiente del repositorio principal de la app.
- No modificar desde aquí la app móvil, Supabase, el panel `admin.elbarrio.lat` ni el código de `business-portal`.

## Objetivo de producto

La landing debe explicar de manera visual y directa que El Barrio es una aplicación hiperlocal para personas que viven cerca. Sus ejes son:

- Comunidad y vecinos verificados.
- Mercado local: comprar, vender, regalar, trocar y arrendar sin pagos dentro de la app.
- Servicios y comercios cercanos.
- Eventos, noticias, alertas e información territorial.
- Privacidad de la dirección y comunidades delimitadas.
- Visibilidad comercial y publicidad segmentada por barrio.

La página no debe parecer una web técnica, un dashboard ni una colección monótona de tarjetas. Debe combinar fotografía real de barrio, espacios claros, jerarquía editorial y demostraciones breves de la app.

## Tecnología

- React 19 + TypeScript.
- Vite 6.
- Tailwind CSS 4.
- Iconos Lucide React.
- Backend Express en `server/index.mjs`.
- Tipografía Lato cargada localmente.
- El sitio no usa Supabase directamente.

Comandos principales:

```bash
npm run dev
npm run lint
npm run build
npm run server
```

## Arquitectura de la página

`src/App.tsx` renderiza las secciones según el orden y visibilidad definidos por el CMS:

1. `Header`
2. `Hero`
3. `LiveNeighborhoodScene`
4. `ThreeBenefits`
5. `TrustSection`
6. `BusinessSection`
7. `LocalAdSection`
8. `FAQSection`
9. `WaitlistFormSection`
10. `Footer`

Archivos centrales:

- `src/data/defaultSiteContent.ts`: textos y valores predeterminados.
- `src/types.ts`: contrato completo del contenido editable.
- `src/context/SiteContentContext.tsx`: carga, mezcla y guardado del contenido remoto.
- `src/components/AdminPanelModal.tsx`: acceso administrativo de la landing.
- `src/components/AdminCMSSection.tsx`: edición de contenido y apariencia.
- `src/components/AdminMediaLibrary.tsx`: biblioteca de archivos.
- `src/index.css`: tipografía, variables visuales del CMS y estilos globales.
- `server/index.mjs`: autenticación, contenido, medios, lista de espera y analítica.

## Estado visual vigente

### Hero

- Fondo en video: `/landing-media/hero-barrio.mp4`.
- Póster: `/landing-media/hero-barrio-poster.jpg`.
- El video debe ser visible bajo una única trama blanca; no volver a superponer capas que lo oculten.
- Texto principal a la izquierda.
- Mockup de la app a la derecha usando `/landing-media/hero-app-preview.svg`.
- El mockup no lleva sombra ni texto inferior.
- Altura reducida respecto de la versión original: aproximadamente 600–640 px.
- El CTA vecinal baja al formulario.
- El CTA de comercio o servicio abre `https://negocios.elbarrio.lat/`.

### Beneficios

- Título en una línea en escritorio usando el ancho disponible.
- Tres bloques: conecta, resuelve y cuida.
- Las demostraciones visuales tienen altura mínima de 360 px en escritorio, llenan su fila y centran el contenido verticalmente.

### Seguridad

- Usa fotografía de comunidad con tratamiento blanco claro.
- La pill tiene fondo verde de marca y texto/icono blancos.
- El título usa el ancho disponible y permanece en una línea cuando hay espacio de escritorio.

### Comercios y servicios

- Incluye una fotografía visible de comercio local: `/landing-media/comercio-local.jpg`.
- La fotografía se presenta junto a las cuatro ventajas, no oculta tras una capa blanca.
- Los botones de comercio y servicio abren `https://negocios.elbarrio.lat/`.
- El mismo destino se usa desde el hero, el menú móvil y el bloque de publicidad.

### Publicidad local

- La pill “Difusión Local Dirigida” tiene fondo verde y texto blanco.
- “Posts patrocinados geolocalizados” debe permanecer en una línea.
- Las tres características pueden desplazarse horizontalmente en pantallas estrechas antes que quebrar su texto.

### Preguntas frecuentes

- Los filtros cambian la lista con fade.
- Las respuestas se abren y cierran con una transición suave de altura y opacidad.
- El contacto abre WhatsApp al número comercial oficial `+56 9 3530 4705` con mensaje precargado.

### Formulario

- Acepta registros de vecino, comercio y servicio como lista de interés.
- La etiqueta territorial visible es “Comuna”.
- Los accesos comerciales principales no deben usar este formulario: deben dirigir al portal especializado.

## CMS y backend propio

- Ruta administrativa: `https://elbarrio.lat/admin/`.
- El contenido remoto se consulta en `GET /api/site-content` y se combina recursivamente con los valores por defecto.
- El guardado del CMS usa `PUT /api/site-content` con sesión administrativa.
- Los cambios de contenido se guardan automáticamente con espera breve.
- La biblioteca usa `/api/media` y sirve archivos desde `/api/media/files`.
- La lista de espera usa `/api/waitlist` y permite exportar CSV.
- La analítica propia registra visitas y presencia aproximada mediante `/api/analytics/visit` y `/api/analytics/live`.
- Nunca documentar usuarios, contraseñas, cookies ni secretos en Git.

## Publicación

- El build estático sale en `dist/`.
- Producción corre en Plesk/nginx y el backend Express se gestiona por separado.
- Publicar primero los assets con hash y finalmente `index.html`, evitando referencias temporales rotas.
- Después de publicar, verificar `HTTP 200`, los hashes CSS/JS del HTML y los recursos multimedia relevantes.
- No afirmar que una modificación está publicada sin compilar y verificar producción.

## Reglas para futuros cambios

- Hacer cambios mínimos y específicos.
- No generar imágenes con IA salvo autorización explícita.
- Reutilizar los recursos de `public/landing-media/` cuando corresponda.
- No cambiar textos, orden, formularios o enlaces que no formen parte de la solicitud.
- Mantener responsive real; una línea en escritorio puede quebrarse naturalmente en móvil.
- No ocultar fotos o videos con overlays excesivos.
- Antes de publicar: `git diff --check`, `npm run build` y revisión del artefacto resultante.
- Crear commits claros. No hacer push sin autorización explícita para este repositorio.

## Historial reciente relevante

- `48a1a74`: hero claro con video y mockup.
- `3efc023`: video del hero visible.
- `fc7c191`: imagen comercial, textos y flujo hacia el portal.
- `44f2446`: contacto FAQ cambiado a WhatsApp.
- `8a572b0`: títulos, pills y transiciones FAQ.
- `180df62`: altura completa y centrado de las demostraciones de beneficios.

