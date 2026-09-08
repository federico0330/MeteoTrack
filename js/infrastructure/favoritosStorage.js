/**
 * favoritosStorage — caja fuerte de favoritos en localStorage.
 * Solo leo/escribo JSON. Las reglas (agregar, ordenar) viven en application.
 */

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
        // Si alguien rompió el JSON a mano en DevTools, prefiero lista vacía.
        return [];
    }
}

export function guardarFavoritos(lista) {
    localStorage.setItem(CLAVE, JSON.stringify(lista));
}
