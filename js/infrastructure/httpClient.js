export async function getJson(url) {
    let respuesta;

    try {
        respuesta = await fetch(url);
    }
    catch (error) {
        throw new Error("No hay conexión. Compruebe tu red e intenta de nuevo.");
    }

    if (!respuesta.ok) {
        let detalle = 'La API respondió con error HTTP ${respuesta.status}.';
        try {
            const cuerpo = await respuesta.json();
            if (cuerpo.reason) {
                detalle = cuerpo.reason;
            }
        }
        catch {
            //Si el cuerpo no es JSON, dejamos el mensaje con el código HTTP.
        }
        throw new Error(detalle);
    }

    return respuesta.json();
}