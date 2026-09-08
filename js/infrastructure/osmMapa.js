/**
 * osmMapa — mapa con iframe de OpenStreetMap (sin Leaflet ni token).
 * Armo la URL del embed, el link “abrir grande” y el bloque DOM listo para colgar.
 */

// Qué tan “zoomeado” se ve el bbox alrededor del pin.
const DELTA = 0.02;

// ---------- URLs ----------

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

// ---------- DOM ----------

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
    enlace.rel = "noopener noreferrer"; // otra pestaña, sin control sobre la mía
    enlace.textContent = "Abrir en OpenStreetMap";

    const atribucion = document.createElement("p");
    atribucion.className = "mapa-atribucion";
    atribucion.textContent = "© colaboradores de OpenStreetMap";

    figura.append(titulo, iframe, enlace, atribucion);
    return figura;
}
