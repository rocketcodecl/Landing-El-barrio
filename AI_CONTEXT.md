# AI Context — Landing pública de El Barrio

Última actualización: 9 de septiembre de 2026.

Este documento entrega continuidad a cualquier nuevo chat o agente que trabaje en la landing. El código vigente tiene prioridad si algo de este archivo queda desactualizado.

## Identidad y alcance

- Producto: landing pública para presentar El Barrio a vecinos, comercios y prestadores.
- Producción: `https://elbarrio.lat/`.
- Proyecto local: `/Users/fenha/Desktop/Landing-El-barrio-design-review`.
- Repositorio: `https://github.com/rocketcodecl/Landing-El-barrio.git`.
- Rama de trabajo vigente: `codex/design-review-20260825`.
- Último commit funcional documentado: `87de085`.
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
- El video de fondo puede reemplazarse desde el CMS mediante una URL MP4/WebM.
- El póster puede reemplazarse mediante URL o carga directa de una imagen.
- El video debe ser visible bajo una única trama blanca; no volver a superponer capas que lo oculten.
- Texto principal a la izquierda.
- El mockup/teléfono que aparecía a la derecha fue eliminado.
- Altura reducida respecto de la versión original: aproximadamente 600–640 px.
- El CTA vecinal baja al formulario.
- El CTA de comercio o servicio abre `https://negocios.elbarrio.lat/`.

### Relato editorial

- Después del hero se muestra el bloque “Volver a sentir que vivimos en un barrio”.
- Explica el propósito humano de El Barrio antes del detalle funcional.
- Su imagen o video, póster, textos, texto alternativo y pie son editables desde su propia sección del CMS.
- Recurso visual predeterminado: `/landing-media/historia-barrio.webp`.

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
- La presentación, imagen principal, cuatro ventajas, perfiles y CTA horizontal son editables desde la sección correspondiente del CMS.
- La fotografía se presenta junto a las cuatro ventajas, no oculta tras una capa blanca.
- Los botones de comercio y servicio abren `https://negocios.elbarrio.lat/`.
- El mismo destino se usa desde el hero, el menú móvil y el bloque de publicidad.

### Publicidad local

- La pill “Difusión Local Dirigida” tiene fondo verde y texto blanco.
- Incluye una imagen editable sobre el botón, con el mismo ancho que este.
- “Posts patrocinados geolocalizados” debe permanecer en una línea.
- Las tres características pueden desplazarse horizontalmente en pantallas estrechas antes que quebrar su texto.

### Preguntas frecuentes

- Los filtros cambian la lista con fade.
- Las respuestas se abren y cierran con una transición suave de altura y opacidad.
- La presentación izquierda, título, bajada, etiquetas de filtros y CTA de contacto son editables desde la sección FAQ del CMS.
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
- Los editores habituales están organizados por sección y en el mismo orden de la landing: Hero, Corazón, Así se vive, Beneficios, Seguridad, Negocios y Servicios, Publicidad Local, FAQ, Formulario y Footer.
- Marca, diseño global, visibilidad/orden, biblioteca, SEO y herramientas avanzadas permanecen separados como configuración general.
- El editor JSON completo está dentro de “Herramientas avanzadas y respaldo” y permanece plegado de forma predeterminada.
- El Footer completo, incluidos sus enlaces de navegación visibles, es editable desde su propia sección.
- La biblioteca usa `/api/media` y sirve archivos desde `/api/media/files`.
- La lista de espera usa `/api/waitlist` y permite exportar CSV.
- La analítica propia registra visitas y presencia aproximada mediante `/api/analytics/visit` y `/api/analytics/live`.
- Nunca documentar usuarios, contraseñas, cookies ni secretos en Git.

## Publicación

- El build estático sale en `dist/`.
- Producción corre en Plesk/nginx y el backend Express se gestiona por separado.
- Publicar primero los assets con hash y finalmente `index.html`, evitando referencias temporales rotas.
- Una publicación del frontend nunca debe subir, reemplazar ni inicializar `/private/landing-data`, `site-content.json` o la carpeta `media` del CMS.
- Antes de cada publicación se debe descargar una copia fechada de `site-content.json` y registrar el inventario de `media`.
- Después de cada publicación se debe comparar el contenido remoto con la copia previa y confirmar que textos, imágenes y orden se conservaron.
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
- `e14b812`: eliminación del teléfono/mockup del hero.
- `3e7cc8a`: jerarquía tipográfica light/bold del título del hero.
- `ac5391a`: incorporación del relato editorial central.
- `874e665`: administración del contenido y medios del relato editorial.
- `87de085`: reorganización del CMS y edición completa de Hero, Negocios, CTA, Publicidad Local, FAQ y Footer.

## Estado comprobado al 9 de septiembre de 2026

- Producción sirve `assets/index-CM3mPZM1.js` y `assets/index-D4FlGxtn.css`.
- La landing y `/admin/` respondieron HTTP 200 tras la publicación de `87de085`.
- Los bundles descargados desde FTP coincidieron byte por byte con el build local.
- El contenido remoto del CMS y las seis imágenes cargadas el 8 de septiembre seguían presentes en `/private/landing-data` después de la publicación.
- El orden remoto comprobado comenzaba con Hero, Beneficios y Así se vive.

## Revisión móvil del Hero — 15 de septiembre de 2026

- Se revisó la landing publicada en `https://elbarrio.lat/` con emulación móvil real a 360, 390 y 430 px.
- No se modificó código del Hero durante esta revisión.
- El Hero actual es técnicamente responsive, pero la composición móvil es deficiente: demasiada información antes del CTA, contraste inconsistente sobre el video y jerarquía visual poco clara.
- El overlay actual es un degradado horizontal pensado para escritorio; en móvil deja partes del texto sobre zonas visualmente ruidosas del video.
- A 360 px el Hero mide aproximadamente 837 px de alto y el primer CTA comienza cerca de los 550 px, por lo que la primera pantalla queda sobrecargada.
- Próximo paso acordado: diseñar una variante móvil específica sin afectar desktop, priorizando badge + titular + bajada breve + CTA principal, mejor contraste y encuadre del video; luego validar a 360/390/430 px antes de decidir si se publica.
- Punto de partida de código antes de esta revisión: `725d230` en `codex/design-review-20260825`.

## Checkpoint previo al rediseño móvil de Beneficios — 16 de septiembre de 2026

- Checkpoint funcional aprobado: `91f9ac7` (`feat: cerrar mejoras moviles previas al lanzamiento`).
- Ese checkpoint fue publicado en `https://elbarrio.lat/` el 16/09/2026 antes de iniciar el rediseño móvil de “Tres grandes beneficios”.
- Backup del frontend previo en servidor: `/var/www/vhosts/elbarrio.lat/private/deploy-backups/20260916-171453/`.
- Producción verificada en 390 px: ancho 390 sin overflow horizontal, Hero 528 px y título móvil 36 px.
- Hero móvil aprobado como base: un solo CTA vecinal; el CTA comercial fue retirado del Hero, pero los datos CMS correspondientes no se eliminaron.
- El Hero usa video visible con protección localizada de lectura y fade inferior hacia `#F3F8F5` para fundirse con la sección siguiente.
- Indicador inferior: mouse animado con dos chevrons sutiles. Se considera suficiente por ahora; no bloquear el avance por este detalle.
- Menú desktop/móvil ahora oculta enlaces cuyas secciones están desactivadas en el CMS; “Así se vive” no aparece mientras esa sección esté oculta.
- Se eliminaron fallbacks externos problemáticos de Unsplash en el render inicial y se sustituyeron por assets locales estables.
- QA del preview/producción: 0 requests fallidos y 0 respuestas HTTP 4xx/5xx al recorrer la landing.
- `/admin/` sigue aislado de la landing pública y muestra acceso protegido; no renderiza el Hero.
- `site-content.json` no fue modificado por el despliegue y el backend no se publicó ni reinició.
- No se hizo `git push`.
- Próximo trabajo: rediseñar SOLO la experiencia móvil de “Tres grandes beneficios”, manteniendo desktop y contenido CMS intactos. Dirección acordada: tabs `Conecta / Resuelve / Cuida` + un panel visible a la vez, swipe opcional y demostración compacta tipo app.

## Preview de lanzamiento y flujo de despliegue — 16 de septiembre de 2026

- Preview remoto de revisión: `https://elbarrio.lat/preview-launch-20260916/`.
- Ruta física verificada: `/var/www/vhosts/elbarrio.lat/httpdocs/preview-launch-20260916`.
- Servidor verificado: `144.126.129.239`, acceso SSH como `root` mediante `~/.ssh/elbarrio_remote_ed25519`.
- El preview es el entorno de revisión; no usar localhost como sustituto cuando se acuerde revisar en stage.
- Para producción: compilar `dist/`, copiar primero assets/archivos estáticos y `index.html` al final. No usar `--delete` ni tocar backend/CMS.
- Para el preview en subruta, no asumir que un build con rutas absolutas `/assets/...` funciona dentro de `/preview-launch-20260916/`; el método exacto de base/rutas del preview debe verificarse antes de cada subida.
- Producción sigue en `/var/www/vhosts/elbarrio.lat/httpdocs/` y solo se publica con autorización explícita “publica”.
- Git: el push que había quedado pendiente en la sesión anterior fue completado el 16/09/2026; `origin/codex/design-review-20260825` quedó creado correctamente desde HEAD `5cd3872`.

## Publicación producción — 16 de septiembre de 2026

- Commit publicado: `e7e4552` (`feat: redisenar beneficios movil con tabs`).
- Rama remota verificada: `origin/codex/design-review-20260825` apunta a `e7e4552`.
- Backup frontend previo: `/var/www/vhosts/elbarrio.lat/private/deploy-backups/20260916-174154/`.
- Copia local de seguridad CMS: `/Users/fenha/Desktop/elbarrio-deploy-backups/20260916-174154/site-content.json`.
- Bundles publicados: `assets/index-B8gCsXK8.js` y `assets/index-CLJfxuGb.css`.
- Producción verificada HTTP 200 para raíz, JS y CSS.
- `site-content.json` conservó SHA-256 `c44ae40e77b9ff2b277da0bd756abf4b5fccd91ed0e6930c3c743ff52b0bc22a` antes/después.
- Inventario de medios permaneció en 8 archivos. Backend/CMS no se reinició ni reemplazó.

## Cierre móvil Beneficios + Escudo de Confianza — 17 de septiembre de 2026

- Commit funcional publicado: `64eb3fa` (`feat: cerrar beneficios y confianza movil`).
- Cambios incluidos: rediseño móvil de Beneficios bajo 640 px con tabs/swipe, nueva presentación móvil de Escudo de Confianza y botón flotante para volver arriba.
- Desktop/tablet se mantuvieron sin cambios estructurales en estas secciones.
- Producción publicada en `https://elbarrio.lat/` el 17/09/2026.
- Backup frontend/CMS previo: `/var/www/vhosts/elbarrio.lat/private/deploy-backups/20260917-113727/`.
- Copia local de seguridad: `/Users/fenha/Desktop/elbarrio-deploy-backups/20260917-113727/`.
- Bundles publicados: `assets/index-DPNNe8hE.js` y `assets/index-B3GIlMLE.css`.
- Producción verificada HTTP 200 para raíz, JS y CSS.
- Hashes remotos de `index.html`, JS y CSS coinciden con el build local.
- `site-content.json` conservó SHA-256 `c44ae40e77b9ff2b277da0bd756abf4b5fccd91ed0e6930c3c743ff52b0bc22a` antes/después.
- Inventario CMS permaneció en 8 archivos dentro de `private/landing-data/media`.
- Backend/CMS no se reinició ni reemplazó.
- Producción se publicó copiando assets primero e `index.html` al final; no se usó `--delete`.

## Checkpoint previo al rediseño 1:1 basado en AI Studio — 17 de septiembre de 2026

- Punto de partida aprobado/publicado antes del rediseño: `cdbae2f` en `codex/design-review-20260825`.
- Se descartaron las pruebas locales no aprobadas de `BusinessSection.tsx`; el repo quedó limpio antes de marcar este checkpoint.
- Nueva referencia maestra de diseño: landing del usuario en AI Studio (`ais-pre-5nozbgvh7hlizfxm4tliqd-331265398129.us-east1.run.app`).
- Objetivo: reconstruir la experiencia móvil siguiendo esa referencia de forma muy fiel, no solo una sección aislada.
- Excluir del nuevo flujo las secciones `Despliegue Territorial` y `Voz Comunitaria`.
- Hero: adoptar la composición del demo, usando el video y poster locales actuales en lugar de una imagen estática.
- Formulario: conservar exactamente el contrato funcional actual (campos, roles, submit, backend y recepción en `/admin/`), pero presentarlo dentro de un modal.
- CTA flotante: mantener disponible una acción persistente para abrir el modal desde cualquier punto de la landing.
- CMS: conservar las claves/campos actuales y usar el nuevo diseño solo como capa de presentación; no renombrar ni eliminar contratos de datos sin migración explícita.
- Backend, `/admin/`, `private/landing-data` y producción quedan fuera del rediseño visual hasta aprobación explícita.
- Todo el trabajo del rediseño se revisará primero en `https://elbarrio.lat/preview-launch-20260916/`.
