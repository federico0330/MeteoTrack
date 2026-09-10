// Cache First para HTML/CSS/JS/íconos. Open-Meteo va siempre por red.
// Si el shell no se actualiza, subir CACHE_NOMBRE (v5, v6…).
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

self.addEventListener("install", function (evento) {
    evento.waitUntil(
        caches.open(CACHE_NOMBRE).then(function (cache) {
            return cache.addAll(ARCHIVOS_SHELL);
        })
    );
});

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

self.addEventListener("fetch", function (evento) {
    const pedido = evento.request;
    const url = new URL(pedido.url);

    if (
        url.hostname === "api.open-meteo.com" ||
        url.hostname === "geocoding-api.open-meteo.com"
    ) {
        return;
    }

    if (pedido.method !== "GET") {
        return;
    }

    if (url.origin !== self.location.origin) {
        return;
    }

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
