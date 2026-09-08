/**
 * sw.js — Service Worker.
 * Decidí Cache First para el shell (HTML/CSS/JS/íconos) y Network Only
 * para Open-Meteo: sin clima “mentiroso” offline.
 * Si cambio mucho el shell y no se refresca, subo CACHE_NOMBRE (v4, v5…).
 */
const CACHE_NOMBRE = "meteotrack-shell-v4";

const ARCHIVOS_SHELL = [
    "./",
    "./index.html",
    "./busqueda.html",
    "./detalle.html",
    "./lista-deseos.html",
    "./historial.html",
    "./contacto.html",
    "./css/styles.css",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
    "./js/infrastructure/httpClient.js",
    "./js/infrastructure/geocodingApi.js",
    "./js/infrastructure/forecastApi.js",
    "./js/infrastructure/geolocationApi.js",
    "./js/infrastructure/osmMapa.js",
    "./js/infrastructure/favoritosStorage.js",
    "./js/infrastructure/historialStorage.js",
    "./js/infrastructure/notificaciones.js",
    "./js/domain/codigosWmo.js",
    "./js/application/buscarLocalidades.js",
    "./js/application/obtenerDetalle.js",
    "./js/application/armarBriefManana.js",
    "./js/application/gestionarFavoritos.js",
    "./js/application/gestionarHistorial.js",
    "./js/ui/inicio.js",
    "./js/ui/busqueda.js",
    "./js/ui/detalle.js",
    "./js/ui/graficoTemperaturas.js",
    "./js/ui/contacto.js",
    "./js/ui/listaDeseos.js",
    "./js/ui/historial.js",
    "./js/pwa-init.js",
];

// --- install: precacheo el shell ---
self.addEventListener("install", function (evento) {
    evento.waitUntil(
        caches.open(CACHE_NOMBRE).then(function (cache) {
            return cache.addAll(ARCHIVOS_SHELL);
        })
    );
});

// --- activate: borro cajas viejas si cambié el nombre ---
self.addEventListener("activate", function (evento) {
    evento.waitUntil(
        caches.keys().then(function (nombres) {
            return Promise.all(
                nombres.map(function (nombre) {
                    if (nombre !== CACHE_NOMBRE) {
                        return caches.delete(nombre);
                    }
                })
            );
        })
    );
});

// --- fetch: reglas por tipo de pedido ---
self.addEventListener("fetch", function (evento) {
    const pedido = evento.request;
    const url = new URL(pedido.url);

    // Open-Meteo → no intercepto (Network Only).
    if (
        url.hostname === "api.open-meteo.com" ||
        url.hostname === "geocoding-api.open-meteo.com"
    ) {
        return;
    }

    if (pedido.method !== "GET") {
        return;
    }

    // Solo mi origen (evito chrome-extension:// rompiendo cache.put).
    if (url.origin !== self.location.origin) {
        return;
    }

    // Shell → Cache First.
    evento.respondWith(
        caches.match(pedido).then(function (respuestaCache) {
            if (respuestaCache) {
                return respuestaCache;
            }

            return fetch(pedido).then(function (respuestaRed) {
                if (!respuestaRed || !respuestaRed.ok) {
                    return respuestaRed;
                }

                const copia = respuestaRed.clone();
                caches.open(CACHE_NOMBRE).then(function (cache) {
                    cache.put(pedido, copia);
                });
                return respuestaRed;
            });
        })
    );
});
