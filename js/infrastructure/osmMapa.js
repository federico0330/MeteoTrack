// Mapa con iframe de OpenStreetMap. El bbox es un delta fijo alrededor del pin.
const DELTA = 0.02;

export function armarUrlEmbed(latitud, longitud) {
    const minLongitud = longitud - DELTA;
    const minLatitud = latitud - DELTA;
    const maxLongitud = longitud + DELTA;
    const maxLatitud = latitud + DELTA;

    const bbox =
        minLongitud + "," + minLatitud + "," + maxLongitud + "," + maxLatitud;
    const marcador = latitud + "," + longitud;

    return (
        "https://www.openstreetmap.org/export/embed.html" +
        "?bbox=" +
        encodeURIComponent(bbox) +
        "&layer=mapnik" +
        "&marker=" +
        encodeURIComponent(marcador)
    );
}

export function armarUrlMapaGrande(latitud, longitud) {
    return (
        "https://www.openstreetmap.org/" +
        "?mlat=" +
        encodeURIComponent(latitud) +
        "&mlon=" +
        encodeURIComponent(longitud) +
        "#map=14/" +
        latitud +
        "/" +
        longitud
    );
}

export function crearBloqueMapa(latitud, longitud, etiqueta) {
    const figura = document.createElement("figure");
    figura.className = "mapa-localidad";

    const titulo = document.createElement("figcaption");
    titulo.textContent = etiqueta;

    const iframe = document.createElement("iframe");
    iframe.title = "Mapa de " + etiqueta;
    iframe.src = armarUrlEmbed(latitud, longitud);
    iframe.width = "100%";
    iframe.height = "280";
    iframe.setAttribute("loading", "lazy");

    const enlace = document.createElement("a");
    enlace.href = armarUrlMapaGrande(latitud, longitud);
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
    enlace.textContent = "Abrir en OpenStreetMap";

    const atribucion = document.createElement("p");
    atribucion.className = "mapa-atribucion";
    atribucion.textContent = "© colaboradores de OpenStreetMap";

    figura.append(titulo, iframe, enlace, atribucion);
    return figura;
}
