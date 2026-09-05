import { getJson } from "./httpClient.js";

const BASE = "https://geocoding-api.open-meteo.com/v1/search";

export async function buscarPorNombre({ nombre, codigoPais, cantidad = 100}) {
    const params = new URLSearchParams({
        name: nombre,
        count: String(cantidad),
        language: "es",
        format: "json",
    });

    if (codigoPais) {
        params.set("countryCode", codigoPais);
    }

    const data = await getJson(`${BASE}?${params.toString()}`);
    
    const crudos = data.results ?? [];
    return crudos.map(mapearLocalidad);
}

export async function obtenerPorId(id) {
    const data = await getJson(
        `https://geocoding-api.open-meteo.com/v1/get?id=${id}`
    );
    if (data.error || data.id == null) {
        throw new Error("No encontramos esa localidad.");
    }
    return mapearLocalidad(data);
}

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