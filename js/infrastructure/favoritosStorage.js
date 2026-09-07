const Clave = "meteotrack.favoritos";

export function leerFavoritos() {
    const crudo = localStorage.getItem(Clave);
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
        // JSON inválido (alguien tocó DevTools, etc.)
        return [];
    }
}

export function guardarFavoritos(lista) {
    localStorage.setItem(Clave, JSON.stringify(lista));
}