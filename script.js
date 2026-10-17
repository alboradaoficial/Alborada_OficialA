
"use strict";

// Número comercial de WhatsApp de Alborada.
const NUMERO_WHATSAPP = "573239086199";

// Elementos del formulario.
const formulario = document.getElementById("formulario-pedido");
const selectorProducto = document.getElementById("producto");
const opcionVino = document.getElementById("opcion-vino");
const selectorVino = document.getElementById("tamano-vino");
const campoComentarios = document.getElementById("comentarios");

// Mostrar u ocultar la selección del tamaño del vino.
function actualizarOpcionVino() {
    if (!selectorProducto || !opcionVino || !selectorVino) return;

    const producto = selectorProducto.value.toLowerCase();
    const incluyeVino = producto.includes("vino");

    opcionVino.classList.toggle("visible", incluyeVino);
    selectorVino.required = incluyeVino;

    if (!incluyeVino) {
        selectorVino.value = "";
    }
}

if (selectorProducto) {
    selectorProducto.addEventListener("change", actualizarOpcionVino);
    actualizarOpcionVino();
}

// Inicializar todos los carruseles de fotografías.
document.querySelectorAll("[data-carrusel]").forEach((carrusel) => {
    const pista = carrusel.querySelector(".carrusel-pista");
    const botonAnterior = carrusel.querySelector(".carrusel-flecha.anterior");
    const botonSiguiente = carrusel.querySelector(".carrusel-flecha.siguiente");
    const controles = carrusel.querySelector(".carrusel-controles");

    if (!pista) {
        console.error("No se encontró .carrusel-pista:", carrusel);
        return;
    }

    const imagenes = Array.from(pista.querySelectorAll("img"));

    if (imagenes.length === 0) {
        console.error("Este carrusel no contiene imágenes:", carrusel);
        return;
    }

    let indiceActual = 0;
    const puntos = [];

    // Preparar la pista horizontal y las fotografías.
    pista.style.display = "flex";
    pista.style.width = "100%";
    pista.style.height = "100%";
    pista.style.transition = "transform 0.35s ease";
    pista.style.willChange = "transform";

    imagenes.forEach((imagen, indice) => {
        imagen.style.display = "block";
        imagen.style.flex = "0 0 100%";
        imagen.style.minWidth = "100%";
        imagen.style.width = "100%";
        imagen.style.height = "100%";
        imagen.style.objectFit = "contain";
        imagen.draggable = false;

        // Informar si alguna imagen no carga.
        imagen.addEventListener("error", () => {
            console.error(
                "No se pudo cargar la imagen del carrusel:",
                imagen.getAttribute("src"),
                "| Ruta interpretada:",
                imagen.src
            );
        });

        imagen.addEventListener("load", () => {
            console.log("Imagen cargada correctamente:", imagen.src);
        });

        // Crear los puntos de navegación.
        if (controles && imagenes.length > 1) {
            const punto = document.createElement("button");

            punto.type = "button";
            punto.className = "carrusel-punto";
            punto.setAttribute(
                "aria-label",
                "Mostrar fotografía " + (indice + 1)
            );

            punto.addEventListener("click", () => {
                mostrarImagen(indice);
            });

            controles.appendChild(punto);
            puntos.push(punto);
        }
    });

    // Ocultar flechas cuando solo hay una imagen.
    if (imagenes.length <= 1) {
        if (botonAnterior) botonAnterior.hidden = true;
        if (botonSiguiente) botonSiguiente.hidden = true;
        if (controles) controles.hidden = true;
    } else {
        if (botonAnterior) botonAnterior.hidden = false;
        if (botonSiguiente) botonSiguiente.hidden = false;
        if (controles) controles.hidden = false;
    }

    // Mostrar una fotografía y actualizar los puntos.
    function mostrarImagen(indice) {
        indiceActual =
            (indice + imagenes.length) % imagenes.length;

        pista.style.transform =
            `translateX(-${indiceActual * 100}%)`;

        puntos.forEach((punto, posicion) => {
            punto.classList.toggle(
                "activo",
                posicion === indiceActual
            );

            punto.setAttribute(
                "aria-current",
                posicion === indiceActual ? "true" : "false"
            );
        });
    }

    // Flecha anterior.
    if (botonAnterior) {
        botonAnterior.addEventListener("click", () => {
            mostrarImagen(indiceActual - 1);
        });
    }

    // Flecha siguiente.
    if (botonSiguiente) {
        botonSiguiente.addEventListener("click", () => {
            mostrarImagen(indiceActual + 1);
        });
    }

    // Mostrar la primera imagen al iniciar.
    mostrarImagen(0);
});

// Seleccionar productos desde las tarjetas del catálogo.
if (selectorProducto) {
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
                selectorProducto.value =
                    "Otro producto o diseño personalizado";

                if (campoComentarios) {
                    campoComentarios.value =
                        "Me interesa este producto: " + nombreProducto;
                }
            }

            actualizarOpcionVino();

            const seccionPedidos = document.getElementById("pedidos");

            if (seccionPedidos) {
                seccionPedidos.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });
}

// Preparar el mensaje del pedido y abrir WhatsApp.
if (formulario) {
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const campoNombre = document.getElementById("nombre");
        const campoRelleno = document.getElementById("relleno");

        const nombre = campoNombre ? campoNombre.value.trim() : "";
        const producto = selectorProducto
            ? selectorProducto.value
            : "";
        const tamanoVino = selectorVino
            ? selectorVino.value
            : "";
        const relleno = campoRelleno
            ? campoRelleno.value
            : "";
        const comentarios = campoComentarios
            ? campoComentarios.value.trim()
            : "";

        if (!nombre || !producto) {
            alert("Por favor, escribe tu nombre y selecciona un producto.");
            return;
        }

        if (
            producto.toLowerCase().includes("vino") &&
            !tamanoVino
        ) {
            alert("Por favor, selecciona el tamaño del vino.");

            if (selectorVino) {
                selectorVino.focus();
            }

            return;
        }

        const lineas = [
            "¡Hola, Alborada! Quiero hacer un pedido.",
            "",
            "*Nombre:* " + nombre,
            "*Producto:* " + producto
        ];

        if (
            producto.toLowerCase().includes("vino") &&
            tamanoVino
        ) {
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
            "https://wa.me/" +
            NUMERO_WHATSAPP +
            "?text=" +
            mensaje;

        window.open(
            enlaceWhatsApp,
            "_blank",
            "noopener,noreferrer"
        );
    });
}

// Actualizar automáticamente el año del pie de página.
const elementoAnio = document.getElementById("anio");

if (elementoAnio) {
    elementoAnio.textContent = new Date().getFullYear();
}
