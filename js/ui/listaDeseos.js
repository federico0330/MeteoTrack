import {
    listarFavoritos,
    borrarFavorito,
    moverFavorito,
    actualizarFavorito,
} from "../application/gestionarFavoritos.js";

const caja = document.querySelector("#lista-favoritos");
pintar();

function pintar() {
    caja.innerHTML = "";
    const favoritos = listarFavoritos();

    if (favoritos.length === 0) {
        const vacio = document.createElement("p");
        vacio.textContent = "Todavía no hay localidades guardadas.";
        caja.appendChild(vacio);
        return;
    }

    const lista = document.createElement("div");
    lista.className = "lista-favoritos-ordenada";

    favoritos.forEach((fav, indice) => {
        const card = document.createElement("article");
        card.className = "card favorito-card";

        // --- Fila compacta (siempre visible) ---
        const fila = document.createElement("div");
        fila.className = "favorito-fila";

        const orden = document.createElement("div");
        orden.className = "favorito-orden";

        const subir = document.createElement("button");
        subir.type = "button";
        subir.textContent = "↑";
        subir.title = "Subir";
        subir.setAttribute("aria-label", "Subir en la lista");
        subir.disabled = indice === 0;
        subir.addEventListener("click", function () {
            moverFavorito(fav.id, -1);
            pintar();
        });

        const bajar = document.createElement("button");
        bajar.type = "button";
        bajar.textContent = "↓";
        bajar.title = "Bajar";
        bajar.setAttribute("aria-label", "Bajar en la lista");
        bajar.disabled = indice === favoritos.length - 1;
        bajar.addEventListener("click", function () {
            moverFavorito(fav.id, 1);
            pintar();
        });

        orden.append(subir, bajar);

        // Acceso directo al detalle (mismo flujo que buscar y elegir)
        const linkDetalle = document.createElement("a");
        linkDetalle.className = "favorito-acceso";
        linkDetalle.href = `detalle.html?id=${encodeURIComponent(fav.id)}`;

        const titulo = document.createElement("span");
        titulo.className = "favorito-nombre";
        titulo.textContent = fav.etiqueta || fav.nombre;

        const lugar = document.createElement("span");
        lugar.className = "favorito-lugar";
        lugar.textContent = [fav.provincia, fav.pais].filter(Boolean).join(" · ");

        linkDetalle.append(titulo);
        if (lugar.textContent) {
            linkDetalle.append(lugar);
        }

        const botonEditar = document.createElement("button");
        botonEditar.type = "button";
        botonEditar.className = "favorito-toggle";
        botonEditar.textContent = "Editar";
        botonEditar.setAttribute("aria-expanded", "false");

        fila.append(orden, linkDetalle, botonEditar);
        card.appendChild(fila);

        // --- Panel colapsado (etiqueta / nota / quitar) ---
        const panel = document.createElement("div");
        panel.className = "favorito-panel";
        panel.hidden = true;

        const form = document.createElement("form");
        form.className = "favorito-editar";
        form.noValidate = true;
        form.innerHTML = `
            <label>Etiqueta
              <input name="etiqueta" maxlength="60" />
            </label>
            <label>Nota
              <textarea name="nota" rows="2" maxlength="200"></textarea>
            </label>
            <button type="submit" class="boton">Guardar cambios</button>
        `;
        form.querySelector('[name="etiqueta"]').value = fav.etiqueta;
        form.querySelector('[name="nota"]').value = fav.nota || "";

        const feedback = document.createElement("p");

        form.addEventListener("submit", function (evento) {
            evento.preventDefault();
            try {
                actualizarFavorito(fav.id, {
                    etiqueta: form.querySelector('[name="etiqueta"]').value,
                    nota: form.querySelector('[name="nota"]').value,
                });
                pintar();
            } catch (error) {
                feedback.className = "mensaje-error";
                feedback.textContent = error.message;
            }
        });

        const quitar = document.createElement("button");
        quitar.type = "button";
        quitar.className = "favorito-quitar";
        quitar.textContent = "Quitar de favoritos";
        quitar.addEventListener("click", function () {
            borrarFavorito(fav.id);
            pintar();
        });

        botonEditar.addEventListener("click", function () {
            const abierto = panel.hidden;
            panel.hidden = !abierto;
            botonEditar.textContent = abierto ? "Cerrar" : "Editar";
            botonEditar.setAttribute("aria-expanded", abierto ? "true" : "false");
        });

        panel.append(form, feedback, quitar);
        card.appendChild(panel);
        lista.appendChild(card);
    });

    caja.appendChild(lista);
}
