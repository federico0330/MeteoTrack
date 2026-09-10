// Búsqueda: tres filtros y resultados de a 10.
import { buscarLocalidades } from "../application/buscarLocalidades.js";

const inputNombre = document.querySelector("#filtro-nombre");
const inputPais = document.querySelector("#filtro-pais");
const inputPoblacion = document.querySelector("#filtro-poblacion");
const boton = document.querySelector("#boton-buscar");
const cajaResultados = document.querySelector("#resultados");

const TAMANIO_PAGINA = 10;
let resultadosActuales = [];
let paginaActual = 1;

boton.addEventListener("click", () => {
    void buscar();
});

async function buscar() {
    cajaResultados.textContent = "Buscando...";

    try {
        resultadosActuales = await buscarLocalidades({
            nombre: inputNombre.value,
            codigoPais: inputPais.value,
            poblacionMinima: inputPoblacion.value,
        });
        paginaActual = 1;
        pintarPagina();
    } catch (error) {
        cajaResultados.innerHTML = "";
        const p = document.createElement("p");
        p.className = "mensaje-error";
        p.textContent = error.message;
        cajaResultados.appendChild(p);
    }
}

function pintarPagina() {
    cajaResultados.innerHTML = "";

    if (resultadosActuales.length === 0) {
        const p = document.createElement("p");
        p.textContent = "No encontramos localidades con esos filtros.";
        cajaResultados.appendChild(p);
        return;
    }

    const desde = (paginaActual - 1) * TAMANIO_PAGINA;
    const pagina = resultadosActuales.slice(desde, desde + TAMANIO_PAGINA);

    const lista = document.createElement("div");
    lista.className = "lista-cards";

    for (const loc of pagina) {
        const articulo = document.createElement("article");
        articulo.className = "card";

        const titulo = document.createElement("h3");
        titulo.textContent = loc.nombre;

        const meta = document.createElement("p");
        const poblacionTexto =
            loc.poblacion > 0 ? loc.poblacion.toLocaleString("es-AR") : "s/d";
        const lugar = loc.provincia
            ? `${loc.provincia}, ${loc.pais}`
            : loc.pais;
        meta.textContent = `${lugar} · ${poblacionTexto} hab.`;

        const enlace = document.createElement("a");
        enlace.href = `detalle.html?id=${loc.id}`;
        enlace.textContent = "Ver detalle";

        articulo.append(titulo, meta, enlace);
        lista.appendChild(articulo);
    }

    cajaResultados.appendChild(lista);
    pintarPaginacion();
}

function pintarPaginacion() {
    const totalPaginas = Math.ceil(resultadosActuales.length / TAMANIO_PAGINA);
    if (totalPaginas <= 1) {
        return;
    }

    const barra = document.createElement("div");
    barra.className = "paginacion";

    const anterior = document.createElement("button");
    anterior.type = "button";
    anterior.textContent = "Anterior";
    anterior.disabled = paginaActual === 1;
    anterior.addEventListener("click", () => {
        paginaActual -= 1;
        pintarPagina();
    });

    const info = document.createElement("span");
    info.textContent = `Pagina ${paginaActual} de ${totalPaginas}`;

    const siguiente = document.createElement("button");
    siguiente.type = "button";
    siguiente.textContent = "Siguiente";
    siguiente.disabled = paginaActual === totalPaginas;
    siguiente.addEventListener("click", () => {
        paginaActual += 1;
        pintarPagina();
    });

    barra.append(anterior, info, siguiente);
    cajaResultados.appendChild(barra);
}
