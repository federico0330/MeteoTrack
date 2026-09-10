// Reglas de favoritos. Solo entra una localidad con id; el GPS no.
import { leerFavoritos, guardarFavoritos } from "../infrastructure/favoritosStorage.js";

const LARGO_MAX_NOTA = 200;
const LARGO_MAX_ETIQUETA = 60;

export function listarFavoritos() {
    return leerFavoritos();
}

export function esFavorito(id) {
    if (id == null) {
        return false;
    }
    const numero = Number(id);
    return leerFavoritos().some((item) => item.id === numero);
}

export function agregarFavorito(localidad) {
    if (!localidad || localidad.id == null) {
        throw new Error(
            "Esta vista es por GPS y no tiene id. Buscá la ciudad por nombre para guardarla."
        );
    }

    const lista = leerFavoritos();
    if (lista.some((item) => item.id === localidad.id)) {
        return;
    }

    lista.push({
        id: localidad.id,
        nombre: localidad.nombre,
        pais: localidad.pais ?? "",
        provincia: localidad.provincia ?? "",
        latitud: localidad.latitud,
        longitud: localidad.longitud,
        etiqueta: localidad.nombre,
        nota: "",
        guardadoEn: new Date().toISOString(),
    });

    guardarFavoritos(lista);
}

export function borrarFavorito(id) {
    const numero = Number(id);
    guardarFavoritos(leerFavoritos().filter((item) => item.id !== numero));
}

// direccion: -1 sube, +1 baja (el orden de la lista es la prioridad).
export function moverFavorito(id, direccion) {
    const lista = leerFavoritos();
    const numero = Number(id);
    const desde = lista.findIndex((item) => item.id === numero);
    if (desde < 0) {
        return;
    }

    const hacia = desde + direccion;
    if (hacia < 0 || hacia >= lista.length) {
        return;
    }

    const temp = lista[desde];
    lista[desde] = lista[hacia];
    lista[hacia] = temp;
    guardarFavoritos(lista);
}

export function actualizarFavorito(id, { etiqueta, nota }) {
    const etiquetaLimpia = String(etiqueta ?? "").trim();
    if (!etiquetaLimpia) {
        throw new Error("La etiqueta es obligatoria.");
    }
    if (etiquetaLimpia.length > LARGO_MAX_ETIQUETA) {
        throw new Error(
            `La etiqueta no puede superar ${LARGO_MAX_ETIQUETA} caracteres.`
        );
    }

    const notaLimpia = String(nota ?? "").trim();
    if (notaLimpia.length > LARGO_MAX_NOTA) {
        throw new Error(
            `La nota no puede superar ${LARGO_MAX_NOTA} caracteres.`
        );
    }

    const numero = Number(id);
    const lista = leerFavoritos();
    const indice = lista.findIndex((item) => item.id === numero);
    if (indice < 0) {
        throw new Error("Ese favorito ya no existe.");
    }

    lista[indice] = {
        ...lista[indice],
        etiqueta: etiquetaLimpia,
        nota: notaLimpia,
    };
    guardarFavoritos(lista);
}
