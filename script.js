
"use strict";

// ========================================
// CONFIGURACIÓN DE ALBORADA
// ========================================

const NUMERO_WHATSAPP = "573239086199";

const formulario = document.getElementById("formulario-pedido");
const selectorProducto = document.getElementById("producto");
const opcionVino = document.getElementById("opcion-vino");
const selectorVino = document.getElementById("tamano-vino");
const campoComentarios = document.getElementById("comentarios");

// ========================================
// CARRUSELES DE IMÁGENES
// ========================================

document.querySelectorAll("[data-carrusel]").forEach((carrusel) => {
    const pista = carrusel.querySelector(".carrusel-pista");
    const botonAnterior = carrusel.querySelector(".carrusel-flecha.anterior");
    const botonSiguiente = carrusel.querySelector(".carrusel-flecha.siguiente");
    const controles = carrusel.querySelector(".carrusel-controles");

    // Comprobar que existan los elementos del carrusel.
    if (!pista || !controles || !botonAnterior || !botonSiguiente) {
        console.warn("No se pudo inicializar un carrusel:", carrusel);
        return;
    }

    const imagenes = Array.from(pista.querySelectorAll("img"));

    if (imagenes.length === 0) {
        console.warn("Este carrusel no tiene imágenes:", carrusel);
        return;
    }

    let indiceActual = 0;
    let inicioToqueX = 0;
    let finToqueX = 0;

    // Si solo existe una foto, ocultar las flechas y los puntos.
    if (imagenes.length === 1) {
        botonAnterior.hidden = true;
        botonSiguiente.hidden = true;
        controles.hidden = true;
        return;
    }

    // Crear los puntos de navegación automáticamente.
    controles.innerHTML = "";

    const puntos = imagenes.map((imagen, indice) => {
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

        return punto;
    });

    // Mostrar una fotografía concreta.
    function mostrarImagen(indice) {
        // Volver al principio o al final cuando sea necesario.
        if (indice < 0) {
            indice = imagenes.length - 1;
        }

        if (indice >= imagenes.length) {
            indice = 0;
        }

        indiceActual = indice;

        // Mover la pista exactamente el ancho de una imagen.
        pista.style.transform =
            `translate3d(-${indiceActual * 100}%, 0, 0)`;

        // Actualizar los puntos inferiores.
        puntos.forEach((punto, posicion) => {
            const activo = posicion === indiceActual;

            punto.classList.toggle("activo", activo);

            if (activo) {
                punto.setAttribute("aria-current", "true");
            } else {
                punto.removeAttribute("aria-current");
            }
        });
    }

    // Botón para retroceder una fotografía.
    botonAnterior.addEventListener("click", (evento) => {
        evento.preventDefault();
        evento.stopPropagation();

        mostrarImagen(indiceActual - 1);
    });

    // Botón para avanzar una fotografía.
    botonSiguiente.addEventListener("click", (evento) => {
        evento.preventDefault();
        evento.stopPropagation();

        mostrarImagen(indiceActual + 1);
    });

    // Permitir cambiar de foto deslizando el dedo en móviles.
    carrusel.addEventListener("touchstart", (evento) => {
        inicioToqueX = evento.changedTouches[0].screenX;
    }, { passive: true });

    carrusel.addEventListener("touchend", (evento) => {
        finToqueX = evento.changedTouches[0].screenX;

        const diferencia = finToqueX - inicioToqueX;

        if (Math.abs(diferencia) < 40) {
            return;
        }

        if (diferencia < 0) {
            mostrarImagen(indiceActual + 1);
        } else {
            mostrarImagen(indiceActual - 1);
        }
    }, { passive: true });

    // Inicializar el carrusel en la primera fotografía.
    mostrarImagen(0);
});

// ========================================
// CAMPO DEL TAMAÑO DEL VINO
// ========================================

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
    selectorProducto.addEventListener(
        "change",
        actualizarOpcionVino
    );
}

// ========================================
// SELECCIONAR PRODUCTO DESDE EL CATÁLOGO
// ========================================

document.querySelectorAll("[data-producto]").forEach((boton) => {
    boton.addEventListener("click", () => {
        if (!selectorProducto) {
            return;
        }

        const nombreProducto = boton.dataset.producto;

        const opcionEncontrada = Array.from(
            selectorProducto.options
        ).find((opcion) => opcion.value === nombreProducto);

        if (opcionEncontrada) {
            selectorProducto.value = opcionEncontrada.value;
        } else {
            const opcionOtro = Array.from(
                selectorProducto.options
            ).find(
                (opcion) =>
                    opcion.value === "Otro producto o diseño personalizado"
            );

            if (opcionOtro) {
                selectorProducto.value = opcionOtro.value;
            }

            if (campoComentarios) {
                campoComentarios.value =
                    "Me interesa este producto: " + nombreProducto;
            }
        }

        actualizarOpcionVino();

        const seccionPedidos = document.getElementById("pedidos");

        if (seccionPedidos) {
            seccionPedidos.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});

// ========================================
// FORMULARIO DE PEDIDOS POR WHATSAPP
// ========================================

if (formulario) {
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const campoNombre = document.getElementById("nombre");
        const selectorRelleno = document.getElementById("relleno");

        const nombre = campoNombre ? campoNombre.value.trim() : "";
        const producto = selectorProducto
            ? selectorProducto.value
            : "";
        const tamanoVino = selectorVino
            ? selectorVino.value
            : "";
        const relleno = selectorRelleno
            ? selectorRelleno.value
            : "";
        const comentarios = campoComentarios
            ? campoComentarios.value.trim()
            : "";

        if (!nombre || !producto) {
            alert(
                "Por favor, escribe tu nombre y selecciona un producto."
            );
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

// ========================================
// AÑO AUTOMÁTICO EN EL PIE DE PÁGINA
// ========================================

const elementoAnio = document.getElementById("anio");

if (elementoAnio) {
    elementoAnio.textContent = new Date().getFullYear();
}
