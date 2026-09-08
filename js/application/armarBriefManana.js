/**
 * armarBriefManana — armo la frase del briefing con diario[1] (mañana).
 * Sin DOM ni fetch: solo datos + hora del celular.
 */
import { textoClima } from "../domain/codigosWmo.js";

export function armarBriefingManana(pronostico, ahora = new Date()) {
    if (
        !pronostico ||
        !Array.isArray(pronostico.diario) ||
        pronostico.diario.length < 2
    ) {
        return null;
    }

    const manana = pronostico.diario[1];
    const descripcion = textoClima(manana.codigo);
    const max = Math.round(manana.max);
    const min = Math.round(manana.min);

    const frase = `Mañana: ${descripcion}, máx ${max}° / mín ${min}°`;

    // Consigna: “de noche” a partir de las 20:00 hora local.
    const esDeNoche = ahora.getHours() >= 20;

    return { frase, esDeNoche };
}
