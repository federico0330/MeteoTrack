import { crearBloqueMapa } from "../infrastructure/osmMapa.js";

// Punto de referencia que pedí para Contacto: sede central de la UNAJ
// (Av. Calchaquí 6200, Florencio Varela). Coords según Wikipedia/Wikidata.
const UNAJ_LATITUD = -34.7751535;
const UNAJ_LONGITUD = -58.2678955;
const UNAJ_ETIQUETA = "Universidad Nacional Arturo Jauretche";

// Acá solo armo el mapa y lo cuelgo en el hueco del HTML.
const hueco = document.querySelector("#mapa-contacto");
const mapa = crearBloqueMapa(UNAJ_LATITUD, UNAJ_LONGITUD, UNAJ_ETIQUETA);
hueco.appendChild(mapa);
