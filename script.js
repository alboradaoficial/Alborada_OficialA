
"use strict";

// Número comercial de WhatsApp de Alborada.
// Incluye el código de Colombia, sin espacios ni signos.
const NUMERO_WHATSAPP = "573239086199";

const formulario = document.getElementById("formulario-pedido");
const selectorProducto = document.getElementById("producto");
const opcionVino = document.getElementById("opcion-vino");
const selectorVino = document.getElementById("tamano-vino");
const campoComentarios = document.getElementById("comentarios");

// Actualizar el campo del vino según el producto elegido.
function actualizarOpcionVino() {
    const producto = selectorProducto.value.toLowerCase();
    const incluyeVino = producto.includes("vino");

    opcionVino.classList.toggle("visible", incluyeVino);
    selectorVino.required = incluyeVino;

    if (!incluyeVino) {
        selectorVino.value = "";
    }
}

selectorProducto.addEventListener("change", actualizarOpcionVino);

// Inicializar todos los carruseles de manera independiente.
document.querySelectorAll("[data-carrusel]").forEach((carrusel) => {
    const pista = carrusel.querySelector(".carrusel-pista");
    const imagenes = Array.from(pista.querySelectorAll("img"));
    const botonAnterior = carrusel.querySelector(".anterior");
    const botonSiguiente = carrusel.querySelector(".siguiente");
    const controles = carrusel.querySelector(".carrusel-controles");

    let indiceActual = 0;

    // Si solo hay una fotografía, no se necesitan controles.
    if (imagenes.length <= 1) {
        botonAnterior.hidden = true;
        botonSiguiente.hidden = true;
        controles.hidden = true;
        return;
    }

    // Crear un punto por cada fotografía.
    const puntos = imagenes.map((imagen, indice) => {
        const punto = document.createElement("button");

        punto.type = "button";
        punto.className = "carrusel-punto";
        punto.setAttribute("aria-label", "Mostrar fotografía " + (indice + 1));

        punto.addEventListener("click", () => {
            mostrarImagen(indice);
        });

        controles.appendChild(punto);
        return punto;
    });

    function mostrarImagen(indice) {
        indiceActual = (indice + imagenes.length) % imagenes.length;

        pista.style.transform =
            "translateX(-" + (indiceActual * 100) + "%)";

        puntos.forEach((punto, posicion) => {
            punto.classList.toggle("activo", posicion === indiceActual);
            punto.setAttribute(
                "aria-current",
                posicion === indiceActual ? "true" : "false"
            );
        });
    }

    botonAnterior.addEventListener("click", () => {
        mostrarImagen(indiceActual - 1);
    });

    botonSiguiente.addEventListener("click", () => {
        mostrarImagen(indiceActual + 1);
    });

    mostrarImagen(0);
});

// Elegir un producto directamente desde su tarjeta.
document.querySelectorAll("[data-producto]").forEach((boton) => {
    boton.addEventListener("click", () => {
        const nombreProducto = boton.dataset.producto;
        const opciones = Array.from(selectorProducto.options);

        const opcionEncontrada = opciones.find(
            (opcion) => opcion.value === nombreProducto
        );

        if (opcionEncontrada) {
            selectorProducto.value = opcionEncontrada.value;
        } else {
            selectorProducto.value = "Otro producto o diseño personalizado";
            campoComentarios.value =
                "Me interesa este producto: " + nombreProducto;
        }

        actualizarOpcionVino();

        document.getElementById("pedidos").scrollIntoView({
            behavior: "smooth"
        });
    });
});

// Preparar el mensaje y abrir WhatsApp.
formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const producto = selectorProducto.value;
    const tamanoVino = selectorVino.value;
    const relleno = document.getElementById("relleno").value;
    const comentarios = campoComentarios.value.trim();

    if (!nombre || !producto) {
        alert("Por favor, escribe tu nombre y selecciona un producto.");
        return;
    }

    if (producto.toLowerCase().includes("vino") && !tamanoVino) {
        alert("Por favor, selecciona el tamaño del vino.");
        selectorVino.focus();
        return;
    }

    const lineas = [
        "¡Hola, Alborada! Quiero hacer un pedido.",
        "",
        "*Nombre:* " + nombre,
        "*Producto:* " + producto
    ];

    if (producto.toLowerCase().includes("vino") && tamanoVino) {
        lineas.push("*Tamaño del vino:* " + tamanoVino);
    }

    if (relleno) {
        lineas.push("*Relleno elegido:* " + relleno);
    }

    if (comentarios) {
        lineas.push("*Detalles adicionales:* " + comentarios);
    }

    lineas.push(
        "",
        "¿Me pueden confirmar la disponibilidad y el precio final?"
    );

    const mensaje = encodeURIComponent(lineas.join("\n"));
    const enlaceWhatsApp =
        "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + mensaje;

    window.open(enlaceWhatsApp, "_blank", "noopener,noreferrer");
});

// Actualizar el año del pie de página.
const elementoAnio = document.getElementById("anio");

if (elementoAnio) {
    elementoAnio.textContent = new Date().getFullYear();
}
