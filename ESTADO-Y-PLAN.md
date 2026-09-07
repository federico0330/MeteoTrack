# MeteoTrack — estado actual vs entrega final

Documento de trabajo para codear **vos** (aprendizaje). El asistente dicta
módulos, explica, revisa; no reemplaza tu escritura salvo typos que pidas
en Agent mode.

- Repo previsto: https://github.com/federico0330/MeteoTrack.git
- App: MPA (un HTML por vista), Vanilla JS, CSS propio, capas
  `ui` → `application` → `infrastructure` / `domain`.
- APIs de datos: Open-Meteo Geocoding + Forecast (sin key).
- Mapa: iframe OSM (sin token; no Leaflet).
- GPS: `navigator.geolocation` (no reverse geocoding).

## Convención por fase (como venimos)

1. Se acuerda **un módulo** (un objetivo visible).
2. El asistente dicta archivos y bloques, con el porqué de cada uno.
3. Vos los escribís, Live Server, recargás fuerte (`Ctrl+Shift+R`).
4. Si pifia, se revisa el archivo real (typos típicos: `length`,
   backticks, extensión `.js` en imports).
5. Recién ahí se pasa al módulo siguiente. No saltear RF5/RF6 por extras.

Responsive (RF8 + pedido del docente): no es un módulo extra. Se agrega
CSS al mismo tiempo que nace el bloque.

| Pieza | ≤767 px | ≥768 px |
|---|---|---|
| Home (Buscar + GPS) | columna | fila |
| Form búsqueda | 3 campos en columna | 3 en fila |
| Detalle mapa + ahora | mapa arriba | dos columnas |
| Cards resultados / 7 días | 1 / 2 / 3 / 4 cols (ya está `.lista-cards`) | |

---

## Fase 0 — Cascarón HTML/CSS (hecho)

**Final y actual:** 6 vistas con nav semántica, `css/styles.css` mobile-first.

| Archivo | Rol |
|---|---|
| `index.html` | Home |
| `busqueda.html` | Form 3 filtros + `#resultados` |
| `detalle.html` | `#detalle-contenido` + script detalle |
| `lista-deseos.html` | Cascarón Favoritos |
| `historial.html` | Cascarón Historial |
| `contacto.html` | Contacto + `#mapa-contacto` |
| `css/styles.css` | Tokens, nav, cards RF8, mapa, gráfico, acciones-inicio |

---

## Fase 1 — Búsqueda + detalle clima (hecho)

**Final y actual:** RF2–RF4 de datos (sin favorito en detalle).

| Archivo | Rol |
|---|---|
| `js/infrastructure/httpClient.js` | Único `fetch`; red vs HTTP |
| `js/infrastructure/geocodingApi.js` | `search` + `get?id=` + `mapearLocalidad` |
| `js/infrastructure/forecastApi.js` | `forecast` + `mapearPronostico` |
| `js/application/buscarLocalidades.js` | Validar 3 filtros; población en cliente |
| `js/application/obtenerDetalle.js` | `id` → ciudad → clima **y** coords GPS |
| `js/domain/codigosWmo.js` | Número WMO → “Nublado” |
| `js/ui/busqueda.js` | Clic, 10 resultados, paginación, `?id=` |
| `js/ui/detalle.js` | `?id=` o `?lat=&lon=`, mapa, gráfico, 24 h, 7 días |

Pendiente menor en esta fase: en `httpClient.js` el mensaje HTTP usa comillas
simples, así que `${respuesta.status}` no se interpola. Cambiar a backticks
cuando se toque ese archivo.

---

## Fase 2 — GPS (hecho)

**Final y actual:** “Usar mi ubicación” saltea la búsqueda.

| Archivo | Rol |
|---|---|
| `js/infrastructure/geolocationApi.js` | Promise sobre `getCurrentPosition` |
| `js/ui/inicio.js` | Clic → `detalle.html?lat=&lon=` |
| `obtenerDetallePorCoordenadas` | Localidad sintética “Tu ubicación” |

Open-Meteo no nombra la ciudad al revés. Título = “Tu ubicación”.

---

## Fase 3 — Mapa OSM (hecho)

**Final y actual:** detalle (pin de la localidad o GPS) + contacto Catedral.

| Archivo | Rol |
|---|---|
| `js/infrastructure/osmMapa.js` | URL embed + “Abrir en OSM” + bloque DOM |
| `js/ui/contacto.js` | (−34.9215, −57.9536) RF7 |

---

## Fase 4 — Gráfico SVG 24 h (hecho)

**Final y actual:** `js/ui/graficoTemperaturas.js` (polyline, `viewBox`,
`length`, `altoUtil`). Se engancha en `detalle.js` con las mismas `proximas`.

---

## Fase 5 — Briefing de mañana (NO hecho — siguiente a codear)

**Estado actual:** no existe `armarBriefingManana.js`. Home no tiene
`#aviso-nocturno`. Detalle no muestra la frase.

**Estado final (dictado, pendiente de que lo escribas):**

- `js/application/armarBriefingManana.js`: `diario[1]` + `textoClima` →
  una frase; `getHours() >= 20` → `esDeNoche`.
- `detalle.js`: sección `.briefing` / `.briefing-noche` entre mapa y 24 h.
- `index.html` + `inicio.js`: de noche, aviso “usá GPS o búsqueda”.
- CSS de briefing (blanco de día, azul de noche).

No es push a las 21 h (haría falta servidor).

---

## Fase 6 — Favoritos variante B + localStorage (hecho — UX rework)

**UX:**
- En **detalle**: botón arriba (junto al nombre) “Agregar a favoritos” /
  “Quitar de favoritos”. Un clic; sin formulario de prioridad.
- GPS (`id: null`): botón deshabilitado; no se guarda.
- En **Favoritos**: filas **compactas** (nombre = acceso directo a
  `detalle.html?id=`); ↑ ↓ para ordenar; panel **Editar** colapsado
  (etiqueta/nota/quitar). Sin fetch de clima por ítem.
- Persistencia: orden del array en `localStorage` = prioridad visual.
- Clave: `id` GeoNames/Open-Meteo.

| Archivo | Rol |
|---|---|
| `js/infrastructure/favoritosStorage.js` | get/set JSON |
| `js/application/gestionarFavoritos.js` | agregar, quitar, listar, mover, actualizar |
| `js/ui/detalle.js` | botón toggle junto al título |
| `js/ui/listaDeseos.js` | filas compactas + link detalle + panel Editar |
| `lista-deseos.html` | `#lista-favoritos` + script |

---

## Fase 7 — Historial + Notification (NO hecho)

**Actual:** `historial.html` es placeholder.

**Final (RF6 + aviso local):**

- `js/infrastructure/historialStorage.js`: al entrar al detalle con `id`,
  unshift, más reciente primero, persistente.
- `js/ui/historial.js`: listar y link a `detalle.html?id=`.
- `Notification` local (permiso; si niegan, no se rompe) reusando la frase
  del briefing o “guardado en favoritos”. No push en segundo plano.

---

## Fase 8 — PWA PLUS (NO hecho)

**Actual:** no hay `manifest.json`, `sw.js`, `pwa-init.js` ni íconos.

**Final:** template de la cátedra (`pwa-template.zip` en Recursos).

- Manifest: name, short_name, íconos 192/512, theme, `standalone`.
- Service Worker: Cache First del **shell** (todos los HTML/CSS/JS).
- API Open-Meteo: **Network Only** (sin clima offline).
- Offline: interfaz + favoritos/historial (localStorage) + mensaje de
  `httpClient` si buscás clima sin red.
- `pwa-init.js` al final de **cada** HTML.

---

## Mapa “si preguntan X”

| Pregunta | Dónde |
|---|---|
| Fetch / errores red-HTTP | `httpClient.js` |
| Tres filtros / población | `buscarLocalidades.js` |
| Open-Meteo ciudades | `geocodingApi.js` |
| Open-Meteo clima | `forecastApi.js` |
| WMO | `codigosWmo.js` |
| GPS | `geolocationApi.js` + `inicio.js` |
| Mapa | `osmMapa.js` |
| Gráfico | `graficoTemperaturas.js` |
| `?id=` vs GPS | `detalle.js` + `obtenerDetalle.js` |
| Favoritos / localStorage | `gestionarFavoritos.js` + `listaDeseos.js` |
| PWA | aún no |

## Fuera de alcance (no codear)

Push con la app cerrada, Nominatim, Leaflet, Chart.js, Google Maps,
°C/°F, radar, satélite, clima en las 100 cards de búsqueda.

## Orden para retomar (vos codeás)

1. Fase 7 historial + Notification.
2. Fase 8 PWA.
3. Typo backticks en `httpClient.js` cuando pases por ahí.
