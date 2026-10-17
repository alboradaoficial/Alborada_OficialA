
"use strict";

// Número comercial de WhatsApp de Alborada.
const NUMERO_WHATSAPP = "573239086199";

const formulario = document.getElementById("formulario-pedido");
const selectorProducto = document.getElementById("producto");
const opcionVino = document.getElementById("opcion-vino");
const selectorVino = document.getElementById("tamano-vino");
const campoComentarios = document.getElementById("comentarios");
const selectorRelleno = document.getElementById("relleno");

// ==================================================
// TAMAÑO DEL VINO
// ==================================================

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

// ==================================================
// SELECCIONAR UN PRODUCTO DESDE EL CATÁLOGO
// ==================================================

document.querySelectorAll("[data-producto]").forEach((boton) => {
  boton.addEventListener("click", () => {
    if (!selectorProducto) return;

    const nombreProducto = boton.dataset.producto;

    const opcion = Array.from(selectorProducto.options).find(
      (item) => item.value === nombreProducto
    );

    if (opcion) {
      selectorProducto.value = opcion.value;
    } else {
      selectorProducto.value = "Otro producto o diseño personalizado";

      if (campoComentarios) {
        campoComentarios.value =
          "Me interesa este producto: " + nombreProducto;
      }
    }

    actualizarOpcionVino();

    document.getElementById("pedidos")?.scrollIntoView({
      behavior: "smooth"
    });
  });
});

// ==================================================
// CARRUSELES DE FOTOGRAFÍAS
// ==================================================

document.querySelectorAll("[data-carrusel]").forEach((carrusel) => {
  const pista = carrusel.querySelector(".carrusel-pista");
  const anterior = carrusel.querySelector(".carrusel-flecha.anterior");
  const siguiente = carrusel.querySelector(".carrusel-flecha.siguiente");
  const controles = carrusel.querySelector(".carrusel-controles");

  if (!pista || !anterior || !siguiente || !controles) {
    console.error("No se pudo inicializar el carrusel:", carrusel);
    return;
  }

  const imagenes = Array.from(pista.querySelectorAll("img"));
  let indiceActual = 0;

  if (imagenes.length === 0) return;

  if (imagenes.length === 1) {
    anterior.hidden = true;
    siguiente.hidden = true;
    controles.hidden = true;

    imagenes[0].classList.add("activa");
    imagenes[0].setAttribute("aria-hidden", "false");
    return;
  }

  controles.replaceChildren();

  const puntos = imagenes.map((imagen, indice) => {
    const punto = document.createElement("button");

    punto.type = "button";
    punto.className = "carrusel-punto";
    punto.setAttribute(
      "aria-label",
      `Mostrar fotografía ${indice + 1}`
    );

    punto.addEventListener("click", () => {
      mostrarImagen(indice);
    });

    controles.appendChild(punto);
    return punto;
  });

  function mostrarImagen(nuevoIndice) {
    indiceActual =
      (nuevoIndice + imagenes.length) % imagenes.length;

    imagenes.forEach((imagen, indice) => {
      const activa = indice === indiceActual;

      imagen.classList.toggle("activa", activa);
      imagen.setAttribute("aria-hidden", String(!activa));
    });

    puntos.forEach((punto, indice) => {
      const activo = indice === indiceActual;

      punto.classList.toggle("activo", activo);

      if (activo) {
        punto.setAttribute("aria-current", "true");
      } else {
        punto.removeAttribute("aria-current");
      }
    });
  }

  anterior.addEventListener("click", (evento) => {
    evento.preventDefault();
    mostrarImagen(indiceActual - 1);
  });

  siguiente.addEventListener("click", (evento) => {
    evento.preventDefault();
    mostrarImagen(indiceActual + 1);
  });

  // Permite deslizar entre fotografías en teléfonos.
  let inicioX = 0;

  carrusel.addEventListener("touchstart", (evento) => {
    inicioX = evento.changedTouches[0].screenX;
  }, { passive: true });

  carrusel.addEventListener("touchend", (evento) => {
    const finalX = evento.changedTouches[0].screenX;
    const diferencia = finalX - inicioX;

    if (Math.abs(diferencia) < 40) return;

    mostrarImagen(
      indiceActual + (diferencia < 0 ? 1 : -1)
    );
  }, { passive: true });

  mostrarImagen(0);
});

// ==================================================
// VISOR PARA AMPLIAR LAS FOTOGRAFÍAS
// ==================================================

const visor = document.getElementById("visor-imagenes");
const imagenVisor = visor?.querySelector(".visor-foto");
const botonCerrarVisor = visor?.querySelector(".visor-cerrar");

let ultimaImagenPulsada = null;

function abrirVisor(imagen) {
  if (!visor || !imagenVisor || !imagen || !imagen.src) return;

  ultimaImagenPulsada = imagen;

  imagenVisor.src = imagen.currentSrc || imagen.src;
  imagenVisor.alt =
    imagen.alt || "Fotografía ampliada de un producto Alborada";

  visor.classList.add("activo");
  visor.setAttribute("aria-hidden", "false");
  document.body.classList.add("visor-abierto");

  botonCerrarVisor?.focus();
}

function cerrarVisor() {
  if (!visor || !imagenVisor) return;
  if (!visor.classList.contains("activo")) return;

  visor.classList.remove("activo");
  visor.setAttribute("aria-hidden", "true");

  imagenVisor.removeAttribute("src");
  imagenVisor.alt = "";

  document.body.classList.remove("visor-abierto");

  if (ultimaImagenPulsada?.isConnected) {
    ultimaImagenPulsada.focus({ preventScroll: true });
  }
}

// Funciona con imágenes normales y fotografías de los carruseles.
document.addEventListener("click", (evento) => {
  const objetivo = evento.target;

  if (!(objetivo instanceof Element)) return;

  const imagen = objetivo.closest(".producto-imagen img");

  if (imagen) {
    evento.preventDefault();
    abrirVisor(imagen);
  }
});

// Cerrar con la X.
botonCerrarVisor?.addEventListener("click", cerrarVisor);

// Cerrar al hacer clic en el fondo oscuro.
visor?.addEventListener("click", (evento) => {
  if (evento.target === visor) {
    cerrarVisor();
  }
});

// Cerrar con Escape.
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") {
    cerrarVisor();
  }
});

// ==================================================
// FORMULARIO DE PEDIDOS POR WHATSAPP
// ==================================================

if (
  formulario &&
  selectorProducto &&
  selectorVino &&
  campoComentarios &&
  selectorRelleno
) {
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (!formulario.reportValidity()) return;

    const nombre = document.getElementById("nombre").value.trim();
    const producto = selectorProducto.value;
    const tamanoVino = selectorVino.value;
    const relleno = selectorRelleno.value;
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
      `*Nombre:* ${nombre}`,
      `*Producto:* ${producto}`
    ];

    if (producto.toLowerCase().includes("vino") && tamanoVino) {
      lineas.push(`*Tamaño del vino:* ${tamanoVino}`);
    }

    if (relleno) {
      lineas.push(`*Relleno elegido:* ${relleno}`);
    }

    if (comentarios) {
      lineas.push(`*Detalles adicionales:* ${comentarios}`);
    }

    lineas.push(
      "",
      "¿Me pueden confirmar la disponibilidad, el precio final y la forma de pago?"
    );

    const mensaje = encodeURIComponent(lineas.join("\n"));
    const enlaceWhatsApp =
      `https://wa.me/${NUMERO_WHATSAPP}?text=${mensaje}`;

    const ventana = window.open(
      enlaceWhatsApp,
      "_blank",
      "noopener,noreferrer"
    );

    // Alternativa si el navegador bloquea la nueva ventana.
    if (!ventana) {
      window.location.href = enlaceWhatsApp;
    }
  });
}

// ==================================================
// AÑO AUTOMÁTICO EN EL PIE DE PÁGINA
// ==================================================

const elementoAnio = document.getElementById("anio");

if (elementoAnio) {
  elementoAnio.textContent = new Date().getFullYear();
}
