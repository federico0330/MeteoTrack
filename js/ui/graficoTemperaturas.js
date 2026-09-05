const NS_SVG = "http://www.w3.org/2000/svg";

function crearNodoSvg(nombreDeEtiqueta) {
    return document.createElementNS(NS_SVG, nombreDeEtiqueta);
}

export function crearGraficoTemperaturas(horas) {
    const envoltorio = document.createElement("div");
    envoltorio.className = "grafico-temps";

    if (horas.length < 2) {
        const aviso = document.createElement("p");
        aviso.textContent = "No hay suficientes horas para dibujar el gráfico.";
        envoltorio.appendChild(aviso);
        return envoltorio;
    }

    const ancho = 320;
    const alto = 160;
    const margenIzquierdo = 40;
    const margenDerecho = 12;
    const margenArriba = 16;
    const margenAbajo = 28;

    const anchoUtil = ancho - margenIzquierdo - margenDerecho;
    const altoUtil = alto - margenArriba - margenAbajo;

    let temperaturaMinima = horas[0].temperatura;
    let temperaturaMaxima = horas[0].temperatura;

    for (let i = 0; i < horas.length; i++) {
        const t = horas[i].temperatura;
        if (t < temperaturaMinima) {
            temperaturaMinima = t;
        }
        if (t > temperaturaMaxima) {
            temperaturaMaxima = t;
        }
    }

    let rango = temperaturaMaxima - temperaturaMinima;
    if (rango === 0) {
        rango = 1;
    }

    const svg = crearNodoSvg("svg");
    svg.setAttribute("viewBox", "0 0 " + ancho + " " + alto);
    svg.setAttribute("role", "img");
    svg.setAttribute(
        "aria-label",
        "Grafico de temperatura de las próximas 24 horas"
    );

    const tituloAccesible = crearNodoSvg("title");
    tituloAccesible.textContent = "Temperatura próximas 24 horas.";
    svg.appendChild(tituloAccesible);

    const etiquetaMax = crearNodoSvg("text");
    etiquetaMax.setAttribute("x", "4");
    etiquetaMax.setAttribute("y", String(margenArriba + 4));
    etiquetaMax.setAttribute("class", "grafico-etiqueta");
    etiquetaMax.textContent = Math.round(temperaturaMaxima) + "°";
    svg.appendChild(etiquetaMax);

    const etiquetaMin = crearNodoSvg("text");
    etiquetaMin.setAttribute("x", "4");
    etiquetaMin.setAttribute("y", String(alto - margenAbajo));
    etiquetaMin.setAttribute("class", "grafico-etiqueta");
    etiquetaMin.textContent = Math.round(temperaturaMinima) + "°";
    svg.appendChild(etiquetaMin);
    
    let puntos = "";
    const ultimoIndice = horas.length - 1;

    for (let i = 0; i < horas.length; i++) {
        const t = horas[i].temperatura;
        const x = margenIzquierdo + (i / ultimoIndice) * anchoUtil;
        const normalizado = (t - temperaturaMinima) / rango;
        const y = margenArriba + (1 - normalizado) * altoUtil;

        if (i > 0) {
            puntos = puntos + " ";
        }
        puntos = puntos + x + "," + y;
    }

    const linea = crearNodoSvg("polyline");
    linea.setAttribute("points", puntos);
    linea.setAttribute("fill", "none");
    linea.setAttribute("stroke", "#0b1f33");
    linea.setAttribute("stroke-width", "2");
    linea.setAttribute("stroke-linejoin", "round");
    svg.appendChild(linea);

    const etiquetaInicio = crearNodoSvg("text");
    etiquetaInicio.setAttribute("x", String(margenIzquierdo));
    etiquetaInicio.setAttribute("y", String(alto - 8));
    etiquetaInicio.setAttribute("class", "grafico-etiqueta");
    etiquetaInicio.textContent = formatearHoraCorta(horas[0].tiempo);
    svg.appendChild(etiquetaInicio);

    const etiquetaFin = crearNodoSvg("text");
    etiquetaFin.setAttribute("x", String(ancho - margenDerecho - 36));
    etiquetaFin.setAttribute("y", String(alto - 8));
    etiquetaFin.setAttribute("class", "grafico-etiqueta");
    etiquetaFin.textContent = formatearHoraCorta(horas[ultimoIndice].tiempo);
    svg.appendChild(etiquetaFin);

    envoltorio.appendChild(svg);
    return envoltorio;
}

function formatearHoraCorta(iso) {
    const fecha = new Date(iso);
    return fecha.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit"
    });
}