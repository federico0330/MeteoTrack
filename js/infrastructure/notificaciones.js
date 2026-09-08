/**
 * notificaciones.js — Notification local del navegador (no push en segundo plano).
 * Si el browser no soporta, si niegan permiso o si algo raro pasa: no rompo la app.
 */

export async function avisarLocal(titulo, cuerpo) {
    if (!("Notification" in window)) {
        return;
    }

    try {
        let permiso = Notification.permission;

        // "default" = todavía no pregunté. Ojo: sin gesto de usuario Chrome
        // a veces niega en silencio; por eso en detalle pido permiso al agregar favorito.
        if (permiso === "default") {
            permiso = await Notification.requestPermission();
        }

        if (permiso !== "granted") {
            return;
        }

        new Notification(titulo, { body: cuerpo });
    } catch {
        // La app de clima tiene que seguir igual aunque falle el aviso.
    }
}
