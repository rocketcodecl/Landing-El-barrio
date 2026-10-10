# Landing — matriz de coherencia de contenido

Última verificación: 10 de octubre de 2026.

## Regla de fuente de verdad

La Landing puede tener presentaciones distintas en desktop y móvil, pero no debe mantener dos relatos editoriales independientes.

- Contenido editorial: SiteContent servido por GET /api/site-content y administrado desde https://elbarrio.lat/admin/.
- Defaults/contrato: src/data/defaultSiteContent.ts + src/types.ts.
- Destinos operativos estables: src/lib/landingRuntime.ts.
- Diseño desktop: componentes estándar de src/components/.
- Diseño móvil: MobileLandingOneToOne.tsx, consumiendo el mismo SiteContent.
- El stage preview-launch-20260916 lee contenido real, pero no debe escribir lista de espera, analytics ni contenido.

## Matriz desktop ↔ móvil

| Área | Fuente canónica | Desktop | Móvil stage |
| --- | --- | --- | --- |
| Marca | branding | BrandLogo, Footer | header/footer móvil |
| Hero | hero | Hero.tsx | hero móvil |
| Historia | story | NeighborhoodStory | manifiesto + relato móvil |
| Así se vive / muestra | scene + posts | LiveNeighborhoodScene | feed móvil, solo si la sección está visible |
| Beneficios | benefits | ThreeBenefits | tarjetas móviles |
| Seguridad | trust | TrustSection | bloque móvil de confianza |
| Comercios/servicios | businessSection | BusinessSection | bloque móvil comercial |
| Publicidad local | localAds | LocalAdSection | bloque móvil solo si está visible |
| FAQ | faqSection + faqs | FAQSection | acordeón móvil |
| Lista de espera vecino | waitlistForm + formUI | WaitlistFormSection | modal móvil |
| Footer/legal | footer + legal + navigation | Footer + LegalModal | footer móvil + LegalModal |
| Visibilidad/orden | layout | render desktop | móvil respeta visibilidad de secciones |
| Portal comercial | BUSINESS_PORTAL_URL | CTA comerciales | CTA comerciales |
| WhatsApp oficial | OFFICIAL_WHATSAPP_DIGITS | FAQ | FAQ/footer móvil |

## Reglas de flujo

### Vecinos
- CTA de vecino abre la lista de espera de la Landing.
- En producción, POST /api/waitlist persiste el registro.
- En stage, el envío se simula y no persiste datos.

### Comercios y servicios
- No usan la lista de espera de vecinos como flujo principal.
- Los CTA llevan a https://negocios.elbarrio.lat/, donde existe creación de acceso y perfil comercial.

### Stage
Ruta: https://elbarrio.lat/preview-launch-20260916/.

Debe:
- leer el CMS vivo para revisar información real;
- permitir probar visualmente formularios;
- no persistir registros de prueba;
- no registrar visitas/heartbeats en analytics de producción;
- no guardar cambios de contenido en el CMS.

## Hallazgos editoriales todavía pendientes de decisión

Estos puntos pertenecen al contenido vivo y no se cambiaron durante el trabajo de coherencia del stage:

- El CMS vivo conserva bastante terminología histórica de “cuadrante”.
- App/Admin actuales usan principalmente barrio, territorio y Unidad Vecinal.
- Antes de cambiar copy de producción conviene fijar una convención pública:
  - barrio como término humano principal;
  - sector cuando se necesite una subdivisión informal;
  - territorio para cobertura/operación;
  - Unidad Vecinal cuando se necesite precisión administrativa.
- El valor branding.supportWhatsapp del CMS vivo no es la autoridad técnica del contacto: el contacto operativo oficial se centraliza en landingRuntime.ts para evitar divergencias entre superficies.

## Regla de publicación

No promover el stage a producción solo por pasar build. Antes de publicar:
1. backup de frontend y site-content.json;
2. npm run lint;
3. build de producción;
4. QA desktop + móvil;
5. confirmar que CMS/media no cambian;
6. autorización explícita del propietario;
7. assets primero e index.html al final;
8. verificación HTTP/hashes posterior.


## QA del stage — 10 de octubre de 2026

- TypeScript: OK.
- Build Vite: OK.
- QA headless móvil 390×844: OK.
- QA headless desktop 1440×1000: OK.
- Hero, Beneficios, Seguridad, Negocios y FAQ comprobados contra el contenido real del CMS.
- Secciones desactivadas en layout no se renderizan en stage.
- CTA comercial comprobado hacia negocios.elbarrio.lat.
- Cero errores de consola y cero respuestas HTTP 4xx/5xx en la corrida.
- Cero escrituras desde stage a /api/analytics/*, /api/waitlist o /api/site-content.
- waitlist.json, visits.json y site-content.json conservaron exactamente sus hashes antes/después del QA.
- Producción no fue modificada y continúa sirviendo los bundles previos del 17 de septiembre.
