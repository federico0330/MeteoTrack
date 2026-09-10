// Único fetch de la app. Separa "no hay red" de error HTTP.
export async function getJson(url) {
    let respuesta;

    try {
        respuesta = await fetch(url);
    } catch (error) {
        throw new Error("No hay conexión. Revisá tu red e intentá de nuevo.");
    }

    if (!respuesta.ok) {
        let detalle = `La API respondió con error HTTP ${respuesta.status}.`;
        try {
            const cuerpo = await respuesta.json();
            if (cuerpo.reason) {
                detalle = cuerpo.reason;
            }
        } catch {
            // Si no viene JSON, dejo el mensaje del status.
        }
        throw new Error(detalle);
    }

    return respuesta.json();
}
