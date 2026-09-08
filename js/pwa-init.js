/**
 * pwa-init.js — registro el Service Worker en cada HTML (MPA).
 * Sin type=module a propósito: no necesito import/export acá.
 */
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("./sw.js")
            .then(function (registro) {
                console.log("Service Worker registrado:", registro.scope);
            })
            .catch(function (error) {
                // La app online sigue igual aunque falle el registro.
                console.warn("No se pudo registrar el Service Worker:", error);
            });
    });
}
