import {
    obtenerDetalle,
    obtenerDetallePorCoordenadas
} from "../application/obtenerDetalle.js";
import { textoClima } from "../domain/codigosWmo.js";
import { crearBloqueMapa } from "../infrastructure/osmMapa.js";
import { crearGraficoTemperaturas } from "./graficoTemperaturas.js";

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

    const titulo = document.createElement("h1");
    titulo.textContent = localidad.nombre;

    const meta = document.createElement("p");
    const lugar = localidad.provincia ? `${localidad.provincia}, ${localidad.pais}` : localidad.pais;
    meta.textContent = lugar;

    const principal = document.createElement("section");
    principal.className = "detalle-principal";

    const etiquetaMapa = localidad.nombre;
    const mapa = crearBloqueMapa(
        localidad.latitud,
        localidad.longitud,
        etiquetaMapa
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
    extras.textContent = `Sensacion ${Math.round(pronostico.actual.sensacion)} °C · Humedad ${pronostico.actual.humedad}% · Viento ${Math.round(pronostico.actual.viento)} km/h`;
    ahora.append(h2Ahora, temp, desc, extras);
    principal.append(mapa, ahora)

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
        item.append(t,g,l);
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
        item.append(f,c,mm);
        listaDias.appendChild(item);
    }
    seccionDias.append(h2Dias, listaDias);

    caja.append(titulo, meta, principal, seccionHoras, seccionDias);
}

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
    return new Date(`${isoFecha}T12:00:00`).toLocaleDateString("es-AR", {
        weekday: "short",
        day: "numeric",
        month: "short",
    });
}