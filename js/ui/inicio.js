/**
 * inicio.js — home: GPS + aviso nocturno del briefing.
 */
import { obtenerPosicionActual } from "../infrastructure/geolocationApi.js";

// ---------- referencias DOM ----------
const botonUbicacion = document.querySelector("#boton-ubicacion");
const cajaError = document.querySelector("#error-ubicacion");

// ---------- GPS ----------
botonUbicacion.addEventListener("click", function () {
    void usarUbicacion();
});

async function usarUbicacion() {
    cajaError.textContent = "";
    botonUbicacion.disabled = true;
    botonUbicacion.textContent = "Obteniendo ubicación...";

    try {
        const posicion = await obtenerPosicionActual();
        // MPA: salto a otra página con lat/lon en la query.
        window.location.href =
            "detalle.html?lat=" +
            encodeURIComponent(posicion.latitud) +
            "&lon=" +
            encodeURIComponent(posicion.longitud);
    } catch (error) {
        cajaError.textContent = error.message;
        cajaError.className = "mensaje-error";
        botonUbicacion.disabled = false;
        botonUbicacion.textContent = "Usar mi ubicación";
    }
}

// ---------- aviso de noche (misma regla ≥ 20 h que el briefing) ----------
mostrarAvisoNocturnoSiCorresponde();

function mostrarAvisoNocturnoSiCorresponde() {
    const aviso = document.querySelector("#aviso-nocturno");
    if (!aviso) {
        return;
    }

    if (new Date().getHours() < 20) {
        return;
    }

    aviso.hidden = false;
    aviso.className = "aviso-nocturno";
    aviso.textContent =
        "Ya es de noche: usá GPS o la búsqueda para mirar el briefing de mañana en el detalle.";
}
