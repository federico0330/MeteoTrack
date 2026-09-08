# MeteoTrack

Trabajo integrador Web + PWA. Una app de clima para mirar el pronóstico de una localidad, guardarla en favoritos y volver a las que ya abrí.

No usé un framework de frontend. Es una **MPA** (una página HTML por vista) con **JavaScript vanilla**, CSS propio y módulos ES. Los datos salen de **Open-Meteo** (Geocoding + Forecast, sin API key). El mapa es un iframe de **OpenStreetMap**. El GPS es `navigator.geolocation`.

Repo: https://github.com/federico0330/MeteoTrack

---

## Cómo correrla en local

Requisitos:

- Un navegador actual (Chrome o Firefox van bien).
- Un servidor HTTP local. No abras los HTML con `file://`: el Service Worker, el manifest y a veces las notificaciones no arrancan así.

Opción A — extensión **Live Server** en VS Code / Cursor: clic derecho en `index.html` → *Open with Live Server*. Recargá fuerte (`Ctrl+Shift+R`) si cambiaste JS o CSS.

Opción B — Python (viene en casi cualquier distro):

```bash
cd AppMeteo   # o la carpeta del repo
python3 -m http.server 8765
```

Después abrí `http://127.0.0.1:8765/`.

No hay `npm install` ni variables de entorno. No hace falta cuenta en Open-Meteo.

Para ver la PWA: DevTools → Application → Manifest y Service Workers. Para probar offline: Network → Offline; el cascarón sigue, el clima no (la API va siempre por red).

---

## Enfoque del proyecto

Elegí no meter React, Vue ni un bundler. El trabajo pide entender fetch, el DOM, localStorage, geolocalización, un mapa y un Service Worker. Un framework me hubiera tapado justo eso.

La estructura de recursos es la de una web clásica:

```text
index.html, busqueda.html, detalle.html,
lista-deseos.html, historial.html, contacto.html
css/styles.css
js/ui/            → cada pantalla
js/application/   → casos de uso (validar, armar briefing, favoritos…)
js/infrastructure/→ fetch, GPS, localStorage, OSM, Notification
js/domain/        → códigos WMO → texto
manifest.json, sw.js, js/pwa-init.js, icons/
```

La regla que me impuse: la UI no llama a `fetch` directo. Pasa por `application`, y `application` usa `infrastructure`. Así, si me preguntan “¿dónde está el error de red?”, abro un solo archivo: `js/infrastructure/httpClient.js`.

---

## Tecnologías y requisitos funcionales

| Qué | Con qué lo resolví |
|---|---|
| Buscar localidad (nombre, país, población) | Open-Meteo Geocoding + validación en `buscarLocalidades.js`. La población la filtro en el cliente. |
| Detalle: ahora, 24 h, 7 días | Open-Meteo Forecast (`forecastApi.js`). Los códigos WMO los traduzco en `codigosWmo.js`. |
| GPS (“usar mi ubicación”) | `navigator.geolocation` en `geolocationApi.js`. Open-Meteo no nombra la ciudad al revés, así que el título queda “Tu ubicación”. |
| Mapa | iframe de OSM, sin Leaflet ni token (`osmMapa.js`). En Contacto pincho la UNAJ (Florencio Varela). |
| Gráfico de temperaturas | SVG a mano (`graficoTemperaturas.js`), sin Chart.js. |
| Briefing de mañana | `armarBriefManana.js`: tomo el día `[1]` del diario. De noche (≥ 20 h) cambio el estilo y aviso en el home. |
| Favoritos | `localStorage` (`meteotrack.favoritos`). Solo localidades con `id` de geocoding. El GPS no se guarda: sin dirección tipo Maps, un pin suelto no nombra un lugar distinto al clima de la zona. |
| Historial | `localStorage` (`meteotrack.historial`). Al entrar a un detalle con `id`, lo pongo primero. Tope de 30. |
| Notification | API `Notification` local (no push). Pedí permiso al agregar un favorito, porque si lo pido al cargar la página Chrome a veces lo niega en silencio. |
| Responsive | CSS mobile-first. Al pasar a 768 px se reacomodan home, form, mapa + ahora, nav y las horas. |
| PWA | `manifest.json` + Service Worker. **Cache First** del shell (HTML/CSS/JS). Open-Meteo es **Network Only**: sin clima inventado offline. |

---

## Decisiones que quiero poder explicar

- **MPA, no SPA.** Cada vista es un HTML con su script. La navegación son links de verdad.
- **Un solo `httpClient`.** Ahí separo “no hay red” de “la API respondió mal”. Offline, ese mensaje es el que se ve.
- **Favoritos = ciudad con id.** El GPS es una consulta al momento.
- **Sin Nominatim, Leaflet ni Chart.js.** Quedan fuera de alcance a propósito.

---

## Autor

Federico — Trabajo integrador, Aplicaciones Móviles / UNAJ.
