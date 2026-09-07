import { leerHistorial, guardarHistorial } from "../infrastructure/historialStorage.js";

/** Tope para que no crezca hacia el infinito en el celular */
const MAX_ITEMS = 30;

/**
 * Registra una visita al detalle de una localidad con id.
 * Si ya estaba, la saca de donde esté y la pone primera (unshift).
 */
export function registarVisita(localidad) {
    if (!localidad || localidad.id == null) {
        return; //GPS u otro caso sin id: no historial.
    }

    const entrada = {
        id: localidad.id,
        nombre: localidad.nombre,
        pais: localidad.pais ?? "",
        provincia: localidad.provincia ?? "",
        
    }
}