
"use strict";

/* ========================================
   ALBORADA - FUNCIONES DE LA PÁGINA
   Archivo: script.js
======================================== */

// Número comercial de WhatsApp de Alborada.
const NUMERO_WHATSAPP = "573239086199";

// Elementos del formulario.
const formulario = document.getElementById("formulario-pedido");
const selectorProducto = document.getElementById("producto");
const opcionVino = document.getElementById("opcion-vino");
const selectorVino = document.getElementById("tamano-vino");
const campoComentarios = document.getElementById("comentarios");

/* ========================================
   MOSTRAR U OCULTAR LA OPCIÓN DE VINO
======================================== */

function actualizarOpcionVino() {
    if (!selectorProducto || !opcionVino || !selectorVino) {
        return;
    }

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

/* ========================================
   CARRUSELES DE FOTOGRAFÍAS
======================================== */

document.querySelectorAll("[data-carrusel]").forEach((carrusel) => {
    const pista = carrusel.querySelector(".carrusel-pista");
    const botonAnterior = carrusel.querySelector(
        ".carrusel-flecha.anterior"
    );
    const botonSiguiente = carrusel.querySelector(
        ".carrusel-flecha.siguiente"
    );
    const controles = carrusel.querySelector(".carrusel-controles");

    if (!pista) {
        console.error(
            "No se encontró .carrusel-pista en:",
            carrusel
        );
        return;
    }

    const imagenes = Array.from(pista.querySelectorAll("img"));

    if (imagenes.length === 0) {
        console.error(
            "Este carrusel no contiene fotografías:",
            carrusel
        );
        return;
    }

    let indiceActual = 0;
    const puntos = [];

    // Preparar la pista horizontal.
    pista.style.display = "flex";
    pista.style.width = "100%";
    pista.style.height = "100%";
    pista.style.transition = "transform 0.35s ease";
    pista.style.willChange = "transform";

    // Preparar cada fotografía.
    imagenes.forEach((imagen, indice) => {
        imagen.style.display = "block";
        imagen.style.flex = "0 0 100%";
        imagen.style.minWidth = "100%";
        imagen.style.width = "100%";
        imagen.style.height = "100%";
        imagen.style.objectFit = "contain";
        imagen.draggable = false;

        // Avisar si una imagen no se encuentra.
        imagen.addEventListener("error", () => {
            console.error(
                "No se pudo cargar la imagen:",
                imagen.getAttribute("src"),
                "| Ruta interpretada:",
                imagen.src
            );
        });

        // Confirmar cuando una imagen carga.
        imagen.addEventListener("load", () => {
            console.log(
                "Imagen cargada correctamente:",
                imagen.src
            );
        });

        // Crear un punto por cada fotografía.
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

    // Mostrar las flechas solo si hay varias fotografías.
    if (imagenes.length <= 1) {
        if (botonAnterior) {
            botonAnterior.hidden = true;
        }

        if (botonSiguiente) {
            botonSiguiente.hidden = true;
        }

        if (controles) {
            controles.hidden = true;
        }
    } else {
        if (botonAnterior) {
            botonAnterior.hidden = false;
        }

        if (botonSiguiente) {
            botonSiguiente.hidden = false;
        }

        if (controles) {
            controles.hidden = false;
        }
    }

    // Mostrar la fotografía seleccionada.
    function mostrarImagen(indice) {
        indiceActual =
            (indice + imagenes.length) % imagenes.length;

        pista.style.transform =
            `translateX(-${indiceActual * 100}%)`;

        puntos.forEach((punto, posicion) => {
            const activo = posicion === indiceActual;

            punto.classList.toggle("activo", activo);

            punto.setAttribute(
                "aria-current",
                activo ? "true" : "false"
            );
        });
    }

    // Fotografía anterior.
    if (botonAnterior) {
        botonAnterior.addEventListener("click", () => {
            mostrarImagen(indiceActual - 1);
        });
    }

    // Fotografía siguiente.
    if (botonSiguiente) {
        botonSiguiente.addEventListener("click", () => {
            mostrarImagen(indiceActual + 1);
        });
    }

    // Iniciar en la primera fotografía.
    mostrarImagen(0);
});

/* ========================================
   SELECCIONAR UN PRODUCTO DEL CATÁLOGO
======================================== */

if (selectorProducto) {
    document.querySelectorAll("[data-producto]").forEach((boton) => {
        boton.addEventListener("click", () => {
            const nombreProducto = boton.dataset.producto;

            const opciones = Array.from(
                selectorProducto.options
            );

            // Buscar una opción que coincida con el producto.
            const opcionEncontrada = opciones.find((opcion) => {
                return (
                    opcion.value.trim().toLowerCase() ===
                    nombreProducto.trim().toLowerCase()
                );
            });

            if (opcionEncontrada) {
                selectorProducto.value = opcionEncontrada.value;
            } else {
                // Si no existe, seleccionar la opción personalizada.
                const opcionPersonalizada = opciones.find((opcion) => {
                    return opcion.value
                        .toLowerCase()
                        .includes("personalizado");
                });

                if (opcionPersonalizada) {
                    selectorProducto.value =
                        opcionPersonalizada.value;
                }

                if (campoComentarios) {
                    campoComentarios.value =
                        "Me interesa este producto: " +
                        nombreProducto;
                }
            }

            actualizarOpcionVino();

            // Desplazarse al formulario.
            const seccionPedidos =
                document.getElementById("pedidos");

            if (seccionPedidos) {
                seccionPedidos.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });
}

/* ========================================
   ENVIAR PEDIDO A WHATSAPP
======================================== */

if (formulario) {
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const campoNombre =
            document.getElementById("nombre");

        const campoRelleno =
            document.getElementById("relleno");

        const nombre = campoNombre
            ? campoNombre.value.trim()
            : "";

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

        // Validar los datos principales.
        if (!nombre || !producto) {
            alert(
                "Por favor, escribe tu nombre y selecciona un producto."
            );
            return;
        }

        // Si el producto incluye vino, exigir su tamaño.
        if (
            producto.toLowerCase().includes("vino") &&
            !tamanoVino
        ) {
            alert(
                "Por favor, selecciona el tamaño del vino."
            );

            if (selectorVino) {
                selectorVino.focus();
            }

            return;
        }

        // Construir el mensaje del pedido.
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
            lineas.push(
                "*Tamaño del vino:* " + tamanoVino
            );
        }

        if (relleno) {
            lineas.push(
                "*Relleno elegido:* " + relleno
            );
        }

        if (comentarios) {
            lineas.push(
                "*Detalles adicionales:* " + comentarios
            );
        }

        lineas.push(
            "",
            "¿Me pueden confirmar la disponibilidad y el precio final?"
        );

        // Codificar el mensaje para la URL.
        const mensaje = encodeURIComponent(
            lineas.join("\n")
        );

        const enlaceWhatsApp =
            "https://wa.me/" +
            NUMERO_WHATSAPP +
            "?text=" +
            mensaje;

        // Abrir WhatsApp en otra pestaña.
        const ventana = window.open(
            enlaceWhatsApp,
            "_blank",
            "noopener,noreferrer"
        );

        // Avisar si el navegador bloqueó la ventana.
        if (!ventana) {
            alert(
                "El navegador pudo bloquear la ventana. " +
                "Permite las ventanas emergentes o abre WhatsApp manualmente."
            );
        }
    });
}

/* ========================================
   ACTUALIZAR EL AÑO DEL PIE DE PÁGINA
======================================== */

const elementoAnio = document.getElementById("anio");

if (elementoAnio) {
    elementoAnio.textContent = new Date().getFullYear();
}
