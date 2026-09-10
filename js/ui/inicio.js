// Inicio: GPS y aviso si ya es de noche (misma hora que el briefing).
import { obtenerPosicionActual } from "../infrastructure/geolocationApi.js";

const botonUbicacion = document.querySelector("#boton-ubicacion");
const cajaError = document.querySelector("#error-ubicacion");

botonUbicacion.addEventListener("click", function () {
    void usarUbicacion();
});

async function usarUbicacion() {
    cajaError.textContent = "";
    botonUbicacion.disabled = true;
    botonUbicacion.textContent = "Obteniendo ubicación...";

    try {
        const posicion = await obtenerPosicionActual();
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
