
"use strict";

const NUMERO_WHATSAPP = "573239086199";

const productos = [
  {
    nombre: "Chocorazones diseñados con relleno especial",
    precio: 86000,
    categoria: "CHOCOLATES",
    fotos: ["Chocorazones diseñados 1.jpeg"]
  },
  {
    nombre: "Caja de vino, chocolates con relleno y rosas",
    precio: 95000,
    categoria: "REGALOS ESPECIALES",
    fotos: ["Caja de vino con rosas.jpeg"]
  },
  {
    nombre: "Caja de vino y chocolates con relleno",
    precio: 85000,
    categoria: "REGALOS ESPECIALES",
    fotos: ["Caja de vino sin rosas.jpeg"]
  },
  {
    nombre: "Caja con 6 chocofresas diseñadas",
    precio: 69000,
    categoria: "CHOCOLATES",
    fotos: ["Caja con 6 chocofresas1.jpeg"]
  },
  {
    nombre: "Donas de chocolate con relleno especial",
    precio: 96000,
    categoria: "CHOCOLATES",
    fotos: ["Donas1.jpeg"]
  },
  {
    nombre: "Par de chocorazones grandes diseñados",
    precio: 72000,
    categoria: "CHOCOLATES",
    fotos: [
      "Par de chocorazones1.jpeg",
      "par chocorazones2.jpeg",
      "par chocorazones 3.jpeg"
    ]
  },
  {
    nombre: "Ancheta con rosas, vino pequeño y 9 chocolates",
    precio: 110000,
    categoria: "ANCHETAS",
    fotos: ["ancheta 9 chocolates1.jpeg", "ancheta 9 chocolates 2.jpeg"]
  },
  {
    nombre: "Ancheta pequeña con fresas, vino y caja de madera",
    precio: 110000,
    categoria: "ANCHETAS",
    fotos: ["ancheta oso cafe arequipe1.jpeg"]
  },
  {
    nombre: "Ancheta con 2 corazones, fresas y base de madera",
    precio: 99000,
    categoria: "ANCHETAS",
    fotos: ["Ancheta con 2 corazones1.jpeg", "ancheta con 2 corazones 2.jpeg"]
  },
  {
    nombre: "Bandeja decorada con vino, café, arequipe y oso",
    precio: 220000,
    categoria: "REGALOS ESPECIALES",
    fotos: [
      "Bandeja decorada con vino, café, arequipe y oso.jpeg",
      "Bandeja decorada con vino, café, arequipe y oso2.jpeg"
    ]
  },
  {
    nombre: "Ancheta con rosas eternas y caja de chocolate en madera",
    precio: 129000,
    categoria: "ANCHETAS",
    fotos: [
      "Ancheta con rosas eternas1.jpeg",
      "Ancheta con rosas eternas2.jpeg",
      "Ancheta rosas eternas3.jpeg"
    ]
  },
  {
    nombre: "Ancheta con yeso de la Virgen y rosas eternas",
    precio: 149000,
    categoria: "ANCHETAS",
    fotos: ["Ancheta con yeso1.jpeg", "Ancheta con yeso 2.jpeg"]
  },
  {
    nombre: "Recordatorios para eventos con fresa cubierta de chocolate",
    precio: 17000,
    categoria: "RECORDATORIOS",
    fotos: ["Rec fresa1.jpeg"]
  },
  {
    nombre: "Recordatorios para eventos (bombones, chocorazones, etc.) con relleno especial",
    precio: 10000,
    categoria: "RECORDATORIOS",
    fotos: ["Rec con relleno.jpeg", "rec con relleno 2.jpeg"]
  },
  {
    nombre: "Recordatorio de chocorazones decorados sin relleno",
    precio: 15000,
    categoria: "RECORDATORIOS",
    fotos: ["recordatorio empresarial1.jpeg"]
  },
  {
    nombre: "Ramo de chocorazones sin relleno",
    precio: 62000,
    categoria: "CHOCOLATES",
    fotos: ["Ramo chocorazones1.jpeg", "ramo chocorazones 2.jpeg"]
  },
  {
    nombre: "Caja de chocolates finos",
    precio: 76000,
    categoria: "CHOCOLATES",
    fotos: ["caja fina1 .jpeg", "caja fina2.jpeg", "caja fina 3.jpeg"]
  },
  {
    nombre: "Ancheta chocolate de frutos secos, rosas, oso de peluche, vino pequeño y vela de chocolate",
    precio: 120000,
    categoria: "ANCHETAS",
    fotos: ["Ancheta chocolate de frutos secos1.jpeg"]
  }
];

const rellenos = [
  ["Limón (Pie de Limón)", "Frescura cítrica con el equilibrio entre dulce y ácido."],
  ["Maracuyá Premium", "Sabor tropical e intenso."],
  ["Fresa Natural", "Dulzura frutal y delicada."],
  ["Nutella con Almendras", "Cremosidad de avellana y textura de almendra."],
  ["Oreo Cookies & Cream", "Galleta crujiente y suave crema."],
  ["Chocolate Semiamargo Intenso", "Sabor profundo para amantes del cacao."],
  ["Coco (Beijinho)", "Sabor suave y tropical."],
  ["Café con Arequipe", "Café colombiano y dulzura de arequipe."],
  ["Frutos Rojos (Mora y Fresa)", "Matices frutales con un toque ácido."],
  ["Pistacho Cremoso", "Sabor refinado y delicado."],
  ["Chocomaní (Chocolate con Maní)", "Chocolate con el toque tostado del maní."]
];

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("productos-grid");
  const gridRellenos = document.getElementById("rellenos-grid");
  const selectorProducto = document.getElementById("producto");
  const selectorRelleno = document.getElementById("relleno");
  const selectorVino = document.getElementById("tamano-vino");
  const opcionVino = document.getElementById("opcion-vino");
  const formulario = document.getElementById("formulario-pedido");
  const campoComentarios = document.getElementById("comentarios");

  function formatoPrecio(precio) {
    return "$" + precio.toLocaleString("es-CO") + " COP";
  }

  // Crear las tarjetas del catálogo.
  productos.forEach((producto, indiceProducto) => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "producto";

    const contenedorImagen = document.createElement("div");
    contenedorImagen.className = "producto-imagen";

    const carrusel = document.createElement("div");
    carrusel.className = "carrusel";
    carrusel.dataset.carrusel = "";

    const pista = document.createElement("div");
    pista.className = "carrusel-pista";

    producto.fotos.forEach((archivo, indiceFoto) => {
      const imagen = document.createElement("img");
      imagen.src = archivo;
      imagen.alt = producto.nombre + ", fotografía " + (indiceFoto + 1);
      imagen.loading = "lazy";
      imagen.onerror = () => {
        imagen.alt = "No se pudo cargar la imagen: " + archivo;
        imagen.classList.add("imagen-rota");
        console.error("Revisa el nombre del archivo:", archivo);
      };
      pista.appendChild(imagen);
    });

    carrusel.appendChild(pista);

    const anterior = document.createElement("button");
    anterior.type = "button";
    anterior.className = "carrusel-flecha anterior";
    anterior.setAttribute("aria-label", "Fotografía anterior");
    anterior.textContent = "‹";

    const siguiente = document.createElement("button");
    siguiente.type = "button";
    siguiente.className = "carrusel-flecha siguiente";
    siguiente.setAttribute("aria-label", "Fotografía siguiente");
    siguiente.textContent = "›";

    const controles = document.createElement("div");
    controles.className = "carrusel-controles";

    carrusel.append(anterior, siguiente, controles);
    contenedorImagen.appendChild(carrusel);

    const info = document.createElement("div");
    info.className = "producto-info";

    const categoria = document.createElement("p");
    categoria.className = "producto-categoria";
    categoria.textContent = producto.categoria;

    const titulo = document.createElement("h3");
    titulo.textContent = producto.nombre;

    const precio = document.createElement("p");
    precio.className = "precio";
    precio.textContent = formatoPrecio(producto.precio);

    const botonPedido = document.createElement("button");
    botonPedido.type = "button";
    botonPedido.className = "boton-producto";
    botonPedido.textContent = "Quiero este producto ↗";
    botonPedido.dataset.producto = producto.nombre;

    info.append(categoria, titulo, precio, botonPedido);
    tarjeta.append(contenedorImagen, info);
    grid.appendChild(tarjeta);

    // Carrusel independiente para cada producto.
    const imagenes = Array.from(pista.querySelectorAll("img"));
    let indiceActual = 0;
    const puntos = [];

    function mostrarImagen(nuevoIndice) {
      indiceActual = (nuevoIndice + imagenes.length) % imagenes.length;

      imagenes.forEach((imagen, posicion) => {
        const activa = posicion === indiceActual;
        imagen.classList.toggle("activa", activa);
        imagen.setAttribute("aria-hidden", String(!activa));
      });

      puntos.forEach((punto, posicion) => {
        punto.classList.toggle("activo", posicion === indiceActual);

        if (posicion === indiceActual) {
          punto.setAttribute("aria-current", "true");
        } else {
          punto.removeAttribute("aria-current");
        }
      });
    }

    imagenes.forEach((imagen, posicion) => {
      const punto = document.createElement("button");
      punto.type = "button";
      punto.className = "carrusel-punto";
      punto.setAttribute("aria-label", "Mostrar foto " + (posicion + 1));
      punto.addEventListener("click", () => mostrarImagen(posicion));
      controles.appendChild(punto);
      puntos.push(punto);
    });

    anterior.addEventListener("click", () => {
      mostrarImagen(indiceActual - 1);
    });

    siguiente.addEventListener("click", () => {
      mostrarImagen(indiceActual + 1);
    });

    if (imagenes.length < 2) {
      anterior.hidden = true;
      siguiente.hidden = true;
      controles.hidden = true;
    }

    mostrarImagen(0);

    // Seleccionar el producto desde su tarjeta.
    botonPedido.addEventListener("click", () => {
      selectorProducto.value = producto.nombre;
      actualizarOpcionVino();
      document.getElementById("pedidos").scrollIntoView({
        behavior: "smooth"
      });
    });
  });

  // Mostrar los rellenos disponibles.
  rellenos.forEach(([nombre, descripcion], indice) => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "relleno";

    const numero = document.createElement("span");
    numero.textContent = String(indice + 1).padStart(2, "0");

    const titulo = document.createElement("p");
    titulo.textContent = nombre;

    const detalle = document.createElement("small");
    detalle.textContent = descripcion;

    tarjeta.append(numero, titulo, detalle);
    gridRellenos.appendChild(tarjeta);

    const opcion = document.createElement("option");
    opcion.value = nombre;
    opcion.textContent = nombre;
    selectorRelleno.appendChild(opcion);
  });

  // Llenar el selector del formulario con los 18 productos.
  productos.forEach((producto) => {
    const opcion = document.createElement("option");
    opcion.value = producto.nombre;
    opcion.textContent = producto.nombre + " — " + formatoPrecio(producto.precio);
    selectorProducto.appendChild(opcion);
  });

  function actualizarOpcionVino() {
    const producto = selectorProducto.value.toLowerCase();
    const incluyeVino = producto.includes("vino");

    opcionVino.classList.toggle("visible", incluyeVino);
    selectorVino.required = incluyeVino;

    if (!incluyeVino) selectorVino.value = "";
  }

  selectorProducto.addEventListener("change", actualizarOpcionVino);

  // Enviar el pedido por WhatsApp.
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

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
      "*Nombre:* " + nombre,
      "*Producto:* " + producto
    ];

    if (tamanoVino && producto.toLowerCase().includes("vino")) {
      lineas.push("*Tamaño del vino:* " + tamanoVino);
    }

    if (relleno) lineas.push("*Relleno elegido:* " + relleno);
    if (comentarios) lineas.push("*Detalles adicionales:* " + comentarios);

    lineas.push("", "¿Me pueden confirmar la disponibilidad y el precio final?");

    const enlace = "https://wa.me/" + NUMERO_WHATSAPP +
      "?text=" + encodeURIComponent(lineas.join("\n"));

    window.open(enlace, "_blank", "noopener,noreferrer");
  });

  document.getElementById("anio").textContent = new Date().getFullYear();
});
