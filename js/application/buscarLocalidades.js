/**
 * buscarLocalidades — caso de uso de la búsqueda.
 * Valido los 3 filtros acá y filtro población en el cliente
 * (Open-Meteo no siempre me lo resuelve como quiero).
 */
import { buscarPorNombre } from "../infrastructure/geocodingApi.js";

export async function buscarLocalidades({ nombre, codigoPais, poblacionMinima }) {
    // --- validaciones ---
    const nombreLimpio = nombre.trim();
    if (nombreLimpio.length < 2) {
        throw new Error("Escribí al menos 2 letras para el nombre.");
    }

    const codigo = codigoPais.trim().toUpperCase();
    if (codigo && !/^[A-Z]{2}$/.test(codigo)) {
        throw new Error("El país tiene que ser un código de 2 letras, por ejemplo AR.");
    }

    const minimo = poblacionMinima === "" ? 0 : Number(poblacionMinima);
    if (Number.isNaN(minimo) || minimo < 0) {
        throw new Error("La población mínima tiene que ser un número mayor o igual a 0.");
    }

    // --- red + filtro local ---
    const resultados = await buscarPorNombre({
        nombre: nombreLimpio,
        codigoPais: codigo,
    });

    return resultados.filter((loc) => loc.poblacion >= minimo);
}
