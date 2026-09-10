// Detalle: lee id o lat/lon de la URL y pinta el pronóstico.
import {
    obtenerDetalle,
    obtenerDetallePorCoordenadas,
} from "../application/obtenerDetalle.js";
import { textoClima } from "../domain/codigosWmo.js";
import { crearBloqueMapa } from "../infrastructure/osmMapa.js";
import { crearGraficoTemperaturas } from "./graficoTemperaturas.js";
import { armarBriefingManana } from "../application/armarBriefManana.js";
import {
    agregarFavorito,
    borrarFavorito,
    esFavorito,
} from "../application/gestionarFavoritos.js";
import { registrarVisita } from "../application/gestionarHistorial.js";
import { avisarLocal } from "../infrastructure/notificaciones.js";

function proximas24Horas(pronostico) {
    const ahora = pronostico.actual.tiempo;
    let indice = pronostico.horario.findIndex((h) => h.tiempo >= ahora);
    if (indice < 0) {
        indice = 0;
    }
    return pronostico.horario.slice(indice, indice + 24);
}

function formatearHora(iso) {
    return new Date(iso).toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatearFecha(isoFecha) {
    // T12:00 para no correr el día por el huso al mostrar solo la fecha.
    return new Date(`${isoFecha}T12:00:00`).toLocaleDateString("es-AR", {
        weekday: "short",
        day: "numeric",
        month: "short",
    });
}

const caja = document.querySelector("#detalle-contenido");
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const lat = params.get("lat");
const lon = params.get("lon");

void cargar();

async function cargar() {
    try {
        let detalle;

        if (id) {
            detalle = await obtenerDetalle(id);
        } else if (lat !== null && lon !== null) {
            detalle = await obtenerDetallePorCoordenadas(lat, lon);
        } else {
            throw new Error("Falta la localidad. Volvé al inicio o a la búsqueda.");
        }

        const localidad = detalle.localidad;
        const pronostico = detalle.pronostico;

        registrarVisita(localidad);
        pintar(localidad, pronostico);
    } catch (error) {
        caja.innerHTML = "";
        const p = document.createElement("p");
        p.className = "mensaje-error";
        p.textContent = error.message;
        caja.appendChild(p);
    }
}

function pintar(localidad, pronostico) {
    caja.innerHTML = "";

    const mensajeFav = document.createElement("p");
    mensajeFav.className = "favorito-feedback";

    const cabecera = document.createElement("div");
    cabecera.className = "detalle-cabecera";

    const titulo = document.createElement("h1");
    titulo.textContent = localidad.nombre;

    if (localidad.id == null) {
        const avisoGps = document.createElement("p");
        avisoGps.className = "aviso-favorito-gps";
        avisoGps.textContent =
            "Vista por GPS: para guardar en favoritos, buscá la localidad por nombre.";
        cabecera.append(titulo, avisoGps);
    } else {
        const botonFav = document.createElement("button");
        botonFav.type = "button";
        botonFav.className = "boton-favorito";

        function refrescarBotonFavorito() {
            if (esFavorito(localidad.id)) {
                botonFav.textContent = "Quitar de favoritos";
                botonFav.classList.add("boton-favorito-activo");
            } else {
                botonFav.textContent = "Agregar a favoritos";
                botonFav.classList.remove("boton-favorito-activo");
            }
        }

        refrescarBotonFavorito();

        botonFav.addEventListener("click", function () {
            mensajeFav.textContent = "";
            mensajeFav.className = "favorito-feedback";
            try {
                if (esFavorito(localidad.id)) {
                    borrarFavorito(localidad.id);
                    mensajeFav.classList.add("mensaje-ok");
                    mensajeFav.textContent = "Quitado de favoritos.";
                } else {
                    agregarFavorito(localidad);
                    mensajeFav.classList.add("mensaje-ok");
                    mensajeFav.textContent = "Agregado a favoritos.";
                    void avisarLocal(
                        "MeteoTrack",
                        "Guardado en favoritos: " + localidad.nombre
                    );
                }
                refrescarBotonFavorito();
            } catch (error) {
                mensajeFav.classList.add("mensaje-error");
                mensajeFav.textContent = error.message;
            }
        });

        cabecera.append(titulo, botonFav);
    }

    const meta = document.createElement("p");
    meta.textContent = localidad.provincia
        ? `${localidad.provincia}, ${localidad.pais}`
        : localidad.pais;

    const principal = document.createElement("section");
    principal.className = "detalle-principal";

    const mapa = crearBloqueMapa(
        localidad.latitud,
        localidad.longitud,
        localidad.nombre
    );

    const ahora = document.createElement("section");
    ahora.className = "clima-actual";
    const h2Ahora = document.createElement("h2");
    h2Ahora.textContent = "Ahora";
    const temp = document.createElement("p");
    temp.className = "temperatura";
    temp.textContent = `${Math.round(pronostico.actual.temperatura)} °C`;
    const desc = document.createElement("p");
    desc.textContent = textoClima(pronostico.actual.codigo);
    const extras = document.createElement("p");
    extras.textContent =
        `Sensacion ${Math.round(pronostico.actual.sensacion)} °C · ` +
        `Humedad ${pronostico.actual.humedad}% · ` +
        `Viento ${Math.round(pronostico.actual.viento)} km/h`;
    ahora.append(h2Ahora, temp, desc, extras);
    principal.append(mapa, ahora);

    const briefingDatos = armarBriefingManana(pronostico);
    let seccionBriefing = null;

    if (briefingDatos) {
        seccionBriefing = document.createElement("section");
        seccionBriefing.className = briefingDatos.esDeNoche
            ? "briefing briefing-noche"
            : "briefing";

        const h2Briefing = document.createElement("h2");
        h2Briefing.textContent = "Briefing de mañana";
        const pBriefing = document.createElement("p");
        pBriefing.textContent = briefingDatos.frase;
        seccionBriefing.append(h2Briefing, pBriefing);

        // Si ya dio permiso, aviso; pedirlo al cargar Chrome a veces lo niega solo.
        if (Notification.permission === "granted") {
            void avisarLocal("Briefing de mañana", briefingDatos.frase);
        }
    }

    const proximas = proximas24Horas(pronostico);
    const seccionHoras = document.createElement("section");
    const h2Horas = document.createElement("h2");
    h2Horas.textContent = "Próximas 24 horas";
    const listaHoras = document.createElement("div");
    listaHoras.className = "lista-horas";
    const grafico = crearGraficoTemperaturas(proximas);

    for (const hora of proximas) {
        const item = document.createElement("p");
        item.className = "card";
        const t = document.createElement("p");
        t.textContent = formatearHora(hora.tiempo);
        const g = document.createElement("p");
        g.textContent = `${Math.round(hora.temperatura)} °C`;
        const l = document.createElement("p");
        l.textContent = `${hora.lluvia ?? "-"}% lluvia`;
        item.append(t, g, l);
        listaHoras.appendChild(item);
    }
    seccionHoras.append(h2Horas, grafico, listaHoras);

    const seccionDias = document.createElement("section");
    const h2Dias = document.createElement("h2");
    h2Dias.textContent = "Próximos 7 días";
    const listaDias = document.createElement("div");
    listaDias.className = "lista-cards";

    for (const dia of pronostico.diario) {
        const item = document.createElement("article");
        item.className = "card";
        const f = document.createElement("h3");
        f.textContent = formatearFecha(dia.fecha);
        const c = document.createElement("p");
        c.textContent = textoClima(dia.codigo);
        const mm = document.createElement("p");
        mm.textContent = `${Math.round(dia.max)}° / ${Math.round(dia.min)}°`;
        item.append(f, c, mm);
        listaDias.appendChild(item);
    }
    seccionDias.append(h2Dias, listaDias);

    const piezas = [cabecera, mensajeFav, meta, principal];
    if (seccionBriefing) {
        piezas.push(seccionBriefing);
    }
    piezas.push(seccionHoras, seccionDias);
    caja.append(...piezas);
}
