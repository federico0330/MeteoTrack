// Historial en localStorage. Misma idea que favoritos, otra clave.

const CLAVE = "meteotrack.historial";

export function leerHistorial() {
    const crudo = localStorage.getItem(CLAVE);
    if (!crudo) {
        return [];
    }

    try {
        const datos = JSON.parse(crudo);
        if (!Array.isArray(datos)) {
            return [];
        }
        return datos;
    } catch {
        return [];
    }
}

export function guardarHistorial(lista) {
    localStorage.setItem(CLAVE, JSON.stringify(lista));
}
