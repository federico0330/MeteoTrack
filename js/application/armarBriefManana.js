// Frase del briefing con el día de mañana (diario[1]).
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

    const esDeNoche = ahora.getHours() >= 20;

    return { frase, esDeNoche };
}
