// Favoritos en localStorage. Acá solo JSON; las reglas están en application.

const CLAVE = "meteotrack.favoritos";

export function leerFavoritos() {
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

export function guardarFavoritos(lista) {
    localStorage.setItem(CLAVE, JSON.stringify(lista));
}
