/**
 * httpClient — único lugar donde hago fetch.
 * Decidí centralizar acá para que todos los errores de red/HTTP
 * digan lo mismo, y para que offline (PWA) también use este mensaje.
 */

export async function getJson(url) {
    let respuesta;

    // 1) Red: si no hay internet, fetch tira excepción (no es un status HTTP).
    try {
        respuesta = await fetch(url);
    } catch (error) {
        throw new Error("No hay conexión. Compruebe tu red e intenta de nuevo.");
    }

    // 2) HTTP: llegó respuesta pero la API no está OK (4xx/5xx).
    if (!respuesta.ok) {
        // Uso backticks para que ${respuesta.status} se interpolate de verdad.
        let detalle = `La API respondió con error HTTP ${respuesta.status}.`;
        try {
            const cuerpo = await respuesta.json();
            if (cuerpo.reason) {
                detalle = cuerpo.reason;
            }
        } catch {
            // Si el cuerpo no es JSON, me quedo con el mensaje del status.
        }
        throw new Error(detalle);
    }

    return respuesta.json();
}
