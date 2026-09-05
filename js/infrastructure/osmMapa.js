const DELTA = 0.02;

export function armarUrlEmbed(latitud, longitud) {
    const minLongitud = longitud - DELTA;
    const minLatitud = latitud - DELTA;
    const maxLongitud = longitud + DELTA;
    const maxLatitud = latitud + DELTA;

    const bbox = minLongitud + "," + minLatitud + "," + maxLongitud + "," + maxLatitud;

    const marcador = latitud + "," + longitud;

    const url = "https://www.openstreetmap.org/export/embed.html" + "?bbox=" + encodeURIComponent(bbox) + "&layer=mapnik" + "&marker=" + encodeURIComponent(marcador);

    return url;
}

export function armarUrlMapaGrande(latitud, longitud) {
    return ("https://www.openstreetmap.org/" + "?mlat=" + encodeURIComponent(latitud) + "&mlon=" + encodeURIComponent(longitud) + "#map=14/" + latitud + "/" + longitud);
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
    //Abre otra pestaña y no le da a OSM control sobre la mía.
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
    enlace.textContent = "Abrir en OpenStreetMap";

    const atribucion = document.createElement("p");
    atribucion.className = "mapa-atribucion";
    atribucion.textContent = "© colaboradores de OpenStreetMap";

    figura.append(titulo, iframe, enlace, atribucion);
    return figura;

}