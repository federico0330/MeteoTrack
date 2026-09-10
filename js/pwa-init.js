// Registra el Service Worker. Va sin type=module porque no hay imports.
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("./sw.js")
            .then(function (registro) {
                console.log("Service Worker registrado:", registro.scope);
            })
            .catch(function (error) {
                console.warn("No se pudo registrar el Service Worker:", error);
            });
    });
}
