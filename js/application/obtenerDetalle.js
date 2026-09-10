// Junta localidad + pronóstico. Por id (búsqueda) o por coordenadas (GPS).
import { obtenerPorId } from "../infrastructure/geocodingApi.js";
import { obtenerPronostico } from "../infrastructure/forecastApi.js";

export async function obtenerDetalle(id) {
    const numero = Number(id);
    if (!id || Number.isNaN(numero)) {
        throw new Error("Falta la localidad. Volvé a la búsqueda y elegí una.");
    }

    const localidad = await obtenerPorId(numero);
    const pronostico = await obtenerPronostico({
        latitud: localidad.latitud,
        longitud: localidad.longitud,
    });

    return { localidad, pronostico };
}

export async function obtenerDetallePorCoordenadas(latitud, longitud) {
    const lat = Number(latitud);
    const lon = Number(longitud);

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
        throw new Error("Las coordenadas no son válidas.");
    }

    // Sin reverse geocoding: Open-Meteo no devuelve el nombre del lugar.
    const localidad = {
        id: null,
        nombre: "Tu ubicación",
        latitud: lat,
        longitud: lon,
        pais: "",
        codigoPais: "",
        provincia: "",
        poblacion: 0,
    };

    const pronostico = await obtenerPronostico({
        latitud: lat,
        longitud: lon,
    });

    return { localidad, pronostico };
}
