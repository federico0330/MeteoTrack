# MeteoTrack
Trabajo integrador Web + PWA. App de clima: buscar una localidad, ver el pronóstico, guardarla en favoritos y volver desde el historial.

## Cómo levantarlo en local

Hace falta un navegador actual (Chrome o Firefox) y un servidor HTTP. No abrir los HTML con `file://`: el Service Worker y el manifest no arrancan así.

Con Python:

```bash
cd MeteoTrack
python3 -m http.server 8765
```
Después abrir `http://127.0.0.1:8765/`.

También sirve Live Server en VS Code: clic derecho en `index.html` → Open with Live Server.

## Enfoque

No usé framework. El trabajo pide trabajar con fetch, DOM, localStorage, geolocalización, un mapa y un Service Worker; con js vanilla y módulos ES pude implementar cada uno de esos requerimientos que pedía el TP.

Cada vista es un HTML (`index.html`, `busqueda.html`, `detalle.html`, `lista-deseos.html`, `historial.html`, `contacto.html`). El CSS está en `css/styles.css`. El JS está separado por capa:

- `js/ui/` — una pantalla
- `js/application/` — validar búsqueda, armar el briefing, favoritos e historial
- `js/infrastructure/` — fetch, GPS, localStorage, OSM, Notification
- `js/domain/` — códigos WMO a texto

La PWA es `manifest.json` + `sw.js` (`js/pwa-init.js` lo registra). Los íconos van en `icons/`.

Tecnologías según lo que hace la app:

- Búsqueda y detalle: Open-Meteo Geocoding y Forecast
- GPS: `navigator.geolocation`
- Mapa: iframe de OpenStreetMap (detalle y sede UNAJ en Contacto)
- Gráfico de 24 h: SVG, sin Chart.js
- Favoritos e historial: `localStorage`
- Aviso local: API `Notification` (no push)
- Offline: el Service Worker cachea el HTML/CSS/JS; el clima siempre va por red
