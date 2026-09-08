/**
 * gestionarHistorial — visitas al detalle con id.
 * Lo más reciente va primero (unshift). Tope para no hinchar localStorage.
 */
import { leerHistorial, guardarHistorial } from "../infrastructure/historialStorage.js";

const MAX_ITEMS = 30;

export function listarHistorial() {
    return leerHistorial();
}

export function registrarVisita(localidad) {
    // GPS u otro caso sin id: no historial (no tengo link estable ?id=).
    if (!localidad || localidad.id == null) {
        return;
    }

    const entrada = {
        id: localidad.id,
        nombre: localidad.nombre,
        pais: localidad.pais ?? "",
        provincia: localidad.provincia ?? "",
        visitadoEn: new Date().toISOString(),
    };

    const listaAnterior = leerHistorial();

    // Saco duplicados de la misma ciudad y la pongo al frente.
    const listaSinEstaCiudad = listaAnterior.filter(function (item) {
        return item.id !== entrada.id;
    });
    listaSinEstaCiudad.unshift(entrada);

    const listaRecortada = listaSinEstaCiudad.slice(0, MAX_ITEMS);
    guardarHistorial(listaRecortada);
}
