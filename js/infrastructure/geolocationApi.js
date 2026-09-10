// GPS: getCurrentPosition envuelto en Promise para poder usar await.

export function obtenerPosicionActual() {
    if (!navigator.geolocation) {
        return Promise.reject(
            new Error("Este navegador no puede leer la ubicación.")
        );
    }

    return new Promise(function (resolve, reject) {
        function cuandoLlegaLaPosicion(posicion) {
            resolve({
                latitud: posicion.coords.latitude,
                longitud: posicion.coords.longitude,
            });
        }

        function cuandoFalla(errorDeGps) {
            if (errorDeGps.code === errorDeGps.PERMISSION_DENIED) {
                reject(
                    new Error(
                        "No diste permiso de ubicación. Podés buscar la localidad a mano."
                    )
                );
                return;
            }
            if (errorDeGps.code === errorDeGps.POSITION_UNAVAILABLE) {
                reject(new Error("El dispositivo no pudo obtener la posición."));
                return;
            }
            reject(new Error("Se agotó el tiempo esperando la ubicación."));
        }

        const opciones = {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 0,
        };

        navigator.geolocation.getCurrentPosition(
            cuandoLlegaLaPosicion,
            cuandoFalla,
            opciones
        );
    });
}
