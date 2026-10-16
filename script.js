
"use strict";

// Cambia este número si el WhatsApp comercial es diferente.
// Usa el código de país y el número, sin espacios ni signos.
const NUMERO_WHATSAPP = "573239086199";

const formulario = document.getElementById("formulario-pedido");
const selectorProducto = document.getElementById("producto");
const opcionVino = document.getElementById("opcion-vino");
const selectorVino = document.getElementById("tamano-vino");
const campoComentarios = document.getElementById("comentarios");

// Mostrar el tamaño del vino cuando el producto lo incluye.
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

// Seleccionar un producto desde su tarjeta.
document.querySelectorAll("[data-producto]").forEach((boton) => {
    boton.addEventListener("click", () => {
        const nombreProducto = boton.dataset.producto;
        const opciones = Array.from(selectorProducto.options);

        const opcionEncontrada = opciones.find(
            (opcion) => opcion.text.trim() === nombreProducto
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

    lineas.push("", "¿Me pueden confirmar la disponibilidad y el precio final?");

    const mensaje = encodeURIComponent(lineas.join("\n"));
    const enlaceWhatsApp =
        "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + mensaje;

    window.open(enlaceWhatsApp, "_blank", "noopener,noreferrer");
});
