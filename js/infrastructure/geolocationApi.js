export function obtenerPosicionActual() {
    if (!navigator.geolocation) {
        return Promise.reject(
            new Error("Este navegador no puede leer la ubicación.")
        );
    }

    const promesa = new Promise(function (resolve, reject) {
        function cuandoLlegaLaPosicion(posicion) {
            const latitud = posicion.coords.latitude;
            const longitud = posicion.coords.longitude;
            resolve({
                latitud: latitud,
                longitud: longitud
            });
        }

        function cuandoFalla(errorDeGps) {
            if (errorDeGps.code === errorDeGps.PERMISSION_DENIED) {
                reject(
                    new Error("No diste permiso de ubicación. Podés buscar la localidad a mano.")
                );
                return;
            }

            if (errorDeGps.code === errorDeGps.POSITION_UNAVAILABLE) {
                reject(
                    new Error("El dispositivo no pudo obtener la posición.")
                );
                return;
            }

            reject(
                new Error("Se agotó el tiempo esperando la ubicación.")
            );
        }

        const opciones = {
            enableHighAccuracy: false, //Es más rápido, y para ser climas de ciudad alcanza.
            timeout: 10000, //10 seg max
            maximumAge: 0 //No usar posición vieja en la caché del sistema
        };

        navigator.geolocation.getCurrentPosition(
            cuandoLlegaLaPosicion,
            cuandoFalla,
            opciones
        );
    });

    return promesa;
}