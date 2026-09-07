import { obtenerPosicionActual } from "../infrastructure/geolocationApi.js";

const botonUbicacion = document.querySelector("#boton-ubicacion");
const cajaError = document.querySelector("#error-ubicacion");

botonUbicacion.addEventListener("click", function() {
    void usarUbicacion();
});

async function usarUbicacion() {
    cajaError.textContent = "";
    //disabled = true evita doble clic mientras el GPS piensa.
    botonUbicacion.disabled = true;
    botonUbicacion.textContent = "Obteniendo ubicación...";

    try {
        const posicion = await obtenerPosicionActual();
        const lat = posicion.latitud;
        const lon = posicion.longitud;
        //Para evitar que un número con signos raros rompa la URL está encodeURIComponent
        //Respetando la arquitectura MPA cargo otra página usando window.
        window.location.href = "detalle.html?lat=" + encodeURIComponent(lat) + "&lon=" + encodeURIComponent(lon);
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

    const hora = new Date().getHours();
    const esDeNoche = hora >= 20;

    if (!esDeNoche) {
        //De día no mostramos nada (el html ya tiene el hidden).
        return;
    }

    aviso.hidden = false;
    aviso.className = "aviso-nocturno";
    aviso.textContent = "Ya es de noche: usá GPS o la búsqueda para mirar el briefing de mañana en el detalle.";
}