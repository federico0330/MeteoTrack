import { crearBloqueMapa } from "../infrastructure/osmMapa.js";

const CATEDRAL_LATITUD = -34.9215;
const CATEDRAL_LONGITUD = -57.9536;

const hueco = document.querySelector("#mapa-contacto");
const mapa = crearBloqueMapa(
    CATEDRAL_LATITUD,
    CATEDRAL_LONGITUD,
    "Catedral de La Plata"
);
hueco.appendChild(mapa);