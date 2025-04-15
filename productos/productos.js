// Guardar el producto simple actual en localStorage
function guardarProductoSimple(productId) {
  localStorage.setItem("productoSimple", productId);
}

// Cargar el producto simple desde localStorage
function cargarProductoSimple() {
  const productoSimple = localStorage.getItem("productoSimple");
  if (productoSimple) {
    const params = new URLSearchParams(window.location.search);
    params.set("product", productoSimple);
    window.location.search = params.toString(); // Redirigir al producto simple
  }
}

// Guardar el producto simple actual al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const product = params.get("product");
  if (product) {
    guardarProductoSimple(product);
  } else {
    cargarProductoSimple(); // Si no hay producto en la URL, cargar el último guardado
  }
});

// Función para maximizar la imagen
function maximizarImagen(imagenSrc) {
  const overlay = document.getElementById("imageOverlay");
  const expandedImage = document.getElementById("expandedImage");
  expandedImage.src = imagenSrc;
  overlay.style.display = "flex";
  document.body.style.overflow = "hidden";
}

// Función para cerrar la imagen maximizada
function cerrarImagenMaximizada() {
  const overlay = document.getElementById("imageOverlay");
  overlay.style.display = "none";
  document.body.style.overflow = "auto";
}

// Crear el contenedor de la imagen maximizada si no existe
document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("imageOverlay")) {
    const overlayHTML = `
      <div class="image-overlay" id="imageOverlay">
        <div class="overlay-background" onclick="cerrarImagenMaximizada()"></div>
        <div class="overlay-content">
          <img id="expandedImage" src="" alt="Imagen Maximizada" class="expanded-image" />
          <button class="close-btn" onclick="cerrarImagenMaximizada()">
            <i class="fa-solid fa-down-left-and-up-right-to-center"></i>
          </button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", overlayHTML);
  }
});

// Función para cargar productos en una sección específica
function cargarProductos(seccionId, productos) {
  const contenedor = document.querySelector(`#${seccionId} .product-grid`);
  contenedor.innerHTML = ""; // Limpia los productos existentes

  productos.forEach((producto) => {
    const productoHTML = `
      <div class="product-card">
        <div class="product-img-wrapper">
          <img src="${producto.imagen}" alt="${producto.nombre}" class="product-img" />
          <div class="view-icon" onclick="maximizarImagen('${producto.imagen}')">
            <i class="fa-solid fa-maximize"></i>
          </div>
        </div>
        <h3 class="product-title">${producto.nombre}</h3>
        <p class="product-price">${producto.precio}</p>
        <a href="../detalles/detalles.html?product=${producto.id}" class="product-details-btn">Detalles</a>
      </div>
    `;
    contenedor.insertAdjacentHTML("beforeend", productoHTML);
  });
}

// Ejemplo de uso
document.addEventListener("DOMContentLoaded", () => {
  const productosLazos = [
    { id: "lazo1", nombre: "Lazo Coquette", precio: "$2.000", imagen: "../images/lazo1.png" },
    { id: "lazo2", nombre: "Mini Lazo", precio: "$1.200", imagen: "../images/lazo2.png" },
  ];

  const productosColitas = [
    { id: "colita1", nombre: "Colita Elegante", precio: "$800", imagen: "../images/colita1.png" },
  ];

  cargarProductos("lazos", productosLazos);
  cargarProductos("colitas", productosColitas);
});

document.addEventListener("DOMContentLoaded", () => {
  const sectionTitles = document.querySelectorAll(".section-title");

  sectionTitles.forEach((title) => {
    // Retrasar la animación para cada título
    setTimeout(() => {
      title.style.opacity = "1"; // Asegura que sea visible después de la animación
    }, 200); // Retraso de 200ms
  });
});

// Función para obtener los productos de una sección
function obtenerProductosPorSeccion(seccionId) {
  if (seccionId === "inicio") {
    return [
      { id: "scrunchie47", nombre: "Scrunchie 1", precio: "$4.000", imagen: "../images/scrunchie1.png" },
      { id: "lazo6", nombre: "Moño Coquete 6", precio: "$2.000", imagen: "../images/lazo14.png" },
      // Agrega más productos aquí...
    ];
  } else if (seccionId === "lazos") {
    return [
      { id: "lazo1", nombre: "Moño Coquette 1", precio: "$2.000", imagen: "../images/lazo1.png" },
      { id: "lazo2", nombre: "Moño Coquette 2", precio: "$1.200", imagen: "../images/lazo7.png" },
      // Agrega más productos aquí...
    ];
  } else if (seccionId === "colitas") {
    return [
      { id: "colita40", nombre: "Moño 1", precio: "$1.200", imagen: "../images/colita1.png" },
      { id: "colita41", nombre: "Moño 2", precio: "$1.200", imagen: "../images/colita2.png" },
      // Agrega más productos aquí...
    ];
  } else if (seccionId === "scrunchies") {
    return [
      { id: "scrunchie47", nombre: "Scrunchie 1", precio: "$4.000", imagen: "../images/scrunchie1.png" },
      { id: "scrunchie48", nombre: "Scrunchie 2", precio: "$4.000", imagen: "../images/scrunchie2.png" },
      // Agrega más productos aquí...
    ];
  }
  return [];
}

// Cargar los primeros productos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  cargarProductos("lazos", obtenerProductosPorSeccion("lazos"));
  cargarProductos("colitas", obtenerProductosPorSeccion("colitas"));
  cargarProductos("scrunchies", obtenerProductosPorSeccion("scrunchies"));
});

// Función para obtener productos desde detalles.js
function obtenerProductosDesdeDetalles() {
  return Object.keys(productData).map((key) => ({
    id: key,
    ...productData[key],
  }));
}

// Función para obtener productos desde productos.html
function obtenerProductosDesdeHTML() {
  const productos = [];
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card) => {
    const id = card.querySelector("a").getAttribute("href").split("=")[1]; // Extraer el id del enlace
    const nombre = card.querySelector(".product-title").textContent.trim();
    const precio = card.querySelector(".product-price").textContent.trim();
    const imagen = card.querySelector(".product-img").getAttribute("src");

    productos.push({ id, nombre, precio, imagen });
  });

  return productos;
}

// Inicializar el buscador
document.addEventListener("DOMContentLoaded", () => {
  ["inicio", "lazos", "colitas", "scrunchies"].forEach((seccionId) => {
    const input = document.getElementById(`search-${seccionId}`);
    input.addEventListener("input", () => buscarProductos(seccionId));
  });
});
