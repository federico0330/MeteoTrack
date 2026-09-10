// Notification local. Si no hay permiso o falla, la app sigue.

export async function avisarLocal(titulo, cuerpo) {
    if (!("Notification" in window)) {
        return;
    }

    try {
        let permiso = Notification.permission;

        // default = todavía no preguntó. En detalle se pide al guardar un favorito
        // (si se pide al cargar, Chrome a veces lo niega solo).
        if (permiso === "default") {
            permiso = await Notification.requestPermission();
        }

        if (permiso !== "granted") {
            return;
        }

        new Notification(titulo, { body: cuerpo });
    } catch {
        // Si el aviso falla, no corto el resto de la app.
    }
}
