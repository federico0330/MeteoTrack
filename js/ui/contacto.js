// Contacto: cuelga el mapa de la UNAJ (Florencio Varela).
import { crearBloqueMapa } from "../infrastructure/osmMapa.js";

// Sede central, Av. Calchaquí 6200. Coords de Wikipedia/Wikidata.
const UNAJ_LATITUD = -34.7751535;
const UNAJ_LONGITUD = -58.2678955;
const UNAJ_ETIQUETA = "Universidad Nacional Arturo Jauretche";

const hueco = document.querySelector("#mapa-contacto");
const mapa = crearBloqueMapa(UNAJ_LATITUD, UNAJ_LONGITUD, UNAJ_ETIQUETA);
hueco.appendChild(mapa);
