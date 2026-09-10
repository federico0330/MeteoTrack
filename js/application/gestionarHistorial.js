// Historial de visitas al detalle con id. Lo más nuevo primero, tope 30.
import { leerHistorial, guardarHistorial } from "../infrastructure/historialStorage.js";

const MAX_ITEMS = 30;

export function listarHistorial() {
    return leerHistorial();
}

export function registrarVisita(localidad) {
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

    const listaSinEstaCiudad = listaAnterior.filter(function (item) {
        return item.id !== entrada.id;
    });
    listaSinEstaCiudad.unshift(entrada);

    const listaRecortada = listaSinEstaCiudad.slice(0, MAX_ITEMS);
    guardarHistorial(listaRecortada);
}
