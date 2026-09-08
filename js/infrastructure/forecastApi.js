/**
 * forecastApi — pedí el pronóstico a Open-Meteo Forecast.
 * Armo un objeto con .actual, .horario y .diario para que el resto
 * de la app no dependa de los nombres raros de la API.
 */
import { getJson } from "./httpClient.js";

const BASE = "https://api.open-meteo.com/v1/forecast";

// ---------- mapeo ----------

function mapearPronostico(data) {
    return {
        actual: {
            tiempo: data.current.time,
            temperatura: data.current.temperature_2m,
            sensacion: data.current.apparent_temperature,
            humedad: data.current.relative_humidity_2m,
            codigo: data.current.weather_code,
            viento: data.current.wind_speed_10m,
        },
        // Las series horarias vienen en arrays paralelos: mismo índice = misma hora.
        horario: data.hourly.time.map((tiempo, i) => ({
            tiempo,
            temperatura: data.hourly.temperature_2m[i],
            lluvia: data.hourly.precipitation_probability[i],
            codigo: data.hourly.weather_code[i],
        })),
        diario: data.daily.time.map((fecha, i) => ({
            fecha,
            codigo: data.daily.weather_code[i],
            max: data.daily.temperature_2m_max[i],
            min: data.daily.temperature_2m_min[i],
            precipitacion: data.daily.precipitation_sum[i],
        })),
    };
}

// ---------- API pública ----------

export async function obtenerPronostico({ latitud, longitud }) {
    const params = new URLSearchParams({
        latitude: String(latitud),
        longitude: String(longitud),
        current:
            "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day",
        hourly: "temperature_2m,precipitation_probability,weather_code",
        daily:
            "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum",
        forecast_days: "7",
        timezone: "auto",
    });

    const data = await getJson(`${BASE}?${params.toString()}`);
    return mapearPronostico(data);
}
