// Códigos WMO de Open-Meteo a texto.

const TEXTOS = {
    0: "Despejado",
    1: "Mayormente despejado",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Niebla",
    48: "Niebla con escarcha",
    51: "Llovizna débil",
    53: "Llovizna",
    55: "Llovizna intensa",
    61: "Lluvia débil",
    63: "Lluvia",
    65: "Lluvia intensa",
    71: "Nieve débil",
    73: "Nieve",
    75: "Nieve intensa",
    80: "Chubascos débiles",
    81: "Chubascos",
    82: "Chubascos fuertes",
    95: "Tormenta",
    96: "Tormenta con granizo",
    99: "Tormenta con granizo fuerte",
};

export function textoClima(codigo) {
    return TEXTOS[codigo] ?? `Código ${codigo}`;
}
