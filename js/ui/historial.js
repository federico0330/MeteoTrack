/**
 * historial.js — listo lo que registré al entrar a un detalle con id.
 */
import { listarHistorial } from "../application/gestionarHistorial.js";

const caja = document.querySelector("#lista-historial");
pintar();

function pintar() {
    caja.innerHTML = "";
    const historial = listarHistorial();

    if (historial.length === 0) {
        const vacio = document.createElement("p");
        vacio.textContent =
            "Todavía no visitaste ninguna localidad con id. Abrí una desde Búsqueda.";
        caja.appendChild(vacio);
        return;
    }

    const lista = document.createElement("div");
    lista.className = "lista-cards";

    for (const item of historial) {
        const card = document.createElement("article");
        card.className = "card";

        const link = document.createElement("a");
        link.href = "detalle.html?id=" + encodeURIComponent(item.id);
        link.textContent = item.nombre;

        const lugar = document.createElement("p");
        const partes = [];
        if (item.provincia) {
            partes.push(item.provincia);
        }
        if (item.pais) {
            partes.push(item.pais);
        }
        lugar.textContent = partes.join(", ");

        card.appendChild(link);
        if (lugar.textContent) {
            card.appendChild(lugar);
        }
        lista.appendChild(card);
    }

    caja.appendChild(lista);
}
