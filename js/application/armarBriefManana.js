import {textoClima} from "../domain/codigosWmo.js";

/**
 * Arma el texto de la carta de mañana a partir del pronóstico diario.
 * No usa DOM ni fetch, solo datos + hora del dispositivo.
 * 
 * @param {object} pronostico - Lo que devolvió mapearPronostico (tiene .diario).
 * @param {Date} ahora - La hora actual del dispositivo.
 * @returns {{frase: string, esDeNoche: boolean } | null} El texto de la carta de mañana.
 */

export function armarBriefingManana(pronostico, ahora = new Date()) {
    //Necesitamos al menos 2 días: [0] = hoy, [1] = mañana.
    if (!pronostico || !Array.isArray(pronostico.diario) || pronostico.diario.length < 2) {
        return null;
    }

    const mañana = pronostico.diario[1];
    const descripcion = textoClima(mañana.codigo);
    const max = Math.round(mañana.max);
    const min = Math.round(mañana.min);

    const frase = `Mañana: ${descripcion}, máx ${max}° / mín ${min}°`;

    //"De noche" para la consigna: o a partir de las 20:00 (hora local del celular).
    const esDeNoche = ahora.getHours() >= 20;

    return {frase, esDeNoche};
}