// Cliente de Open-Meteo Geocoding. Pasa la respuesta cruda a un objeto localidad.
import { getJson } from "./httpClient.js";

const BASE_BUSQUEDA = "https://geocoding-api.open-meteo.com/v1/search";
const BASE_POR_ID = "https://geocoding-api.open-meteo.com/v1/get";

function mapearLocalidad(crudo) {
    return {
        id: crudo.id,
        nombre: crudo.name,
        latitud: crudo.latitude,
        longitud: crudo.longitude,
        pais: crudo.country,
        codigoPais: crudo.country_code,
        provincia: crudo.admin1 ?? "",
        poblacion: crudo.population ?? 0,
    };
}

export async function buscarPorNombre({ nombre, codigoPais, cantidad = 100 }) {
    const params = new URLSearchParams({
        name: nombre,
        count: String(cantidad),
        language: "es",
        format: "json",
    });

    if (codigoPais) {
        params.set("countryCode", codigoPais);
    }

    const data = await getJson(`${BASE_BUSQUEDA}?${params.toString()}`);
    const crudos = data.results ?? [];
    return crudos.map(mapearLocalidad);
}

export async function obtenerPorId(id) {
    const data = await getJson(`${BASE_POR_ID}?id=${id}`);
    if (data.error || data.id == null) {
        throw new Error("No encontramos esa localidad.");
    }
    return mapearLocalidad(data);
}
