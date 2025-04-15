// Función para cargar un componente (HTML, CSS y JS)
function cargarComponente(ruta, contenedorId) {
  fetch(`${ruta}/${contenedorId}.html`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error al cargar ${ruta}/${contenedorId}.html: ${response.statusText}`);
      }
      return response.text();
    })
    .then((html) => {
      document.getElementById(contenedorId).innerHTML = html;

      // Cargar el archivo CSS del componente
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `${ruta}/${contenedorId}.css`;
      document.head.appendChild(link);

      // Cargar el archivo JS del componente
      const script = document.createElement("script");
      script.src = `${ruta}/${contenedorId}.js`;
      script.defer = true;
      document.body.appendChild(script);
    })
    .catch((error) => console.error(`Error al cargar el componente ${contenedorId}:`, error));
}

// Función para cargar productos desde productos.html
function cargarProductosDesdeHTML(seccionId) {
  fetch("productos/productos.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error al cargar productos.html: ${response.statusText}`);
      }
      return response.text();
    })
    .then((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const seccionProductos = doc.querySelector(`#${seccionId}`);
      const contenedor = document.getElementById(seccionId);

      if (seccionProductos && contenedor) {
        contenedor.innerHTML = seccionProductos.innerHTML; // Copiar contenido de productos.html
      } else {
        console.error(`Sección ${seccionId} no encontrada en productos.html`);
      }
    })
    .catch((error) => console.error("Error al cargar productos:", error));
}

// Productos por categoría
const productosDestacados = [
  { id: "lazo1", nombre: "Lazo Rosa", precio: "$5.00", imagen: "images/lazo1.png" },
  { id: "colita1", nombre: "Colita Negra", precio: "$3.00", imagen: "images/colita1.png" },
  { id: "scrunchie1", nombre: "Scrunchie Floral", precio: "$7.00", imagen: "images/scrunchie1.png" },
];

const productosLazos = [
  { id: "lazo1", nombre: "Lazo Rosa", precio: "$5.00", imagen: "images/lazo1.png" },
  { id: "lazo2", nombre: "Lazo Azul", precio: "$6.00", imagen: "images/lazo2.png" },
];

const productosColitas = [
  { id: "colita1", nombre: "Colita Negra", precio: "$3.00", imagen: "images/colita1.png" },
  { id: "colita2", nombre: "Colita Roja", precio: "$4.00", imagen: "images/colita2.png" },
];

const productosScrunchies = [
  { id: "scrunchie1", nombre: "Scrunchie Floral", precio: "$7.00", imagen: "images/scrunchie1.png" },
  { id: "scrunchie2", nombre: "Scrunchie Seda", precio: "$8.00", imagen: "images/scrunchie2.png" },
];

// Función para cargar productos en una sección específica
function cargarProductos(seccionId, productos) {
  const contenedor = document.getElementById(seccionId);
  contenedor.innerHTML = ""; // Limpia los productos existentes

  productos.forEach((producto) => {
    const productoHTML = `
      <div class="product-card">
        <div class="product-img-wrapper">
          <img src="${producto.imagen}" alt="${producto.nombre}" class="product-img" loading="lazy" />
        </div>
        <h3 class="product-title">${producto.nombre}</h3>
        <p class="product-price">${producto.precio}</p>
      </div>
    `;
    contenedor.insertAdjacentHTML("beforeend", productoHTML);
  });
}

// Mostrar la sección correspondiente al hash
function mostrarSeccion(hash) {
  const secciones = document.querySelectorAll(".section");
  secciones.forEach((seccion) => {
    seccion.classList.remove("active");
  });

  const seccionActiva = document.querySelector(hash);
  if (seccionActiva) {
    seccionActiva.classList.add("active");
  }
}

// Resaltar el enlace activo en el menú
function resaltarEnlaceActivo(hash) {
  const enlaces = document.querySelectorAll(".mini-navbar-menu a");
  enlaces.forEach((enlace) => {
    enlace.classList.remove("active");
    if (enlace.getAttribute("href") === hash) {
      enlace.classList.add("active");
    }
  });
}

// Detectar cambios en el hash de la URL
window.addEventListener("hashchange", () => {
  const hash = window.location.hash || "#inicio";
  mostrarSeccion(hash);
  resaltarEnlaceActivo(hash);
});

// Mostrar el spinner de carga
function mostrarLoader() {
  const loader = document.querySelector(".loader");
  if (loader) {
    loader.style.display = "block"; // Muestra el spinner
  }
}

// Ocultar el spinner de carga y mostrar el contenido con animación
function ocultarLoader() {
  const loader = document.querySelector(".loader");
  const mainContent = document.querySelector("main");
  if (loader) {
    loader.style.display = "none"; // Oculta el spinner
  }
  if (mainContent) {
    mainContent.classList.add("fade-in"); // Aplica la animación de entrada
  }
}

// Agregar feedback visual a botones y enlaces
function agregarFeedbackVisual() {
  const interactivos = document.querySelectorAll("button, a");
  interactivos.forEach((elemento) => {
    elemento.addEventListener("mousedown", () => {
      elemento.style.transform = "scale(0.95)";
    });
    elemento.addEventListener("mouseup", () => {
      elemento.style.transform = "scale(1)";
    });
    elemento.addEventListener("mouseleave", () => {
      elemento.style.transform = "scale(1)";
    });
  });
}

// Inicializar los componentes al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  cargarComponente("headerfooter", "header"); // Carga el encabezado
  cargarComponente("headerfooter", "footer"); // Carga el pie de página

  // Cargar productos en las secciones desde productos.html
  cargarProductosDesdeHTML("inicio");
  cargarProductosDesdeHTML("lazos");
  cargarProductosDesdeHTML("colitas");
  cargarProductosDesdeHTML("scrunchies");

  const enlaces = document.querySelectorAll(".navbar-menu li a");
  enlaces.forEach((enlace) => {
    enlace.addEventListener("click", (event) => {
      event.preventDefault();
      const categoria = enlace.getAttribute("href").substring(1); // Obtener la categoría
      cargarProductos(categoria); // Cargar los productos de la categoría
    });
  });

  // Inicializar la página al cargar
  const hash = window.location.hash || "#inicio";
  mostrarSeccion(hash);
  resaltarEnlaceActivo(hash);

  // Crear el contenedor de la imagen maximizada si no existe
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

  const miniaturas = document.querySelectorAll(".miniatura");
  miniaturas.forEach((miniatura) => {
    miniatura.addEventListener("click", () => cambiarImagen(src, miniatura));
  });

  agregarFeedbackVisual();

  // Simular carga inicial
  mostrarLoader();
  setTimeout(() => {
    ocultarLoader();
  }, 2000); // Oculta el spinner después de 2 segundos
});

// Función para maximizar la imagen
function maximizarImagen(imagenSrc) {
  const overlay = document.getElementById("imageOverlay");
  const expandedImage = document.getElementById("expandedImage");
  expandedImage.src = imagenSrc; // Establece la imagen seleccionada
  overlay.style.display = "flex"; // Muestra el contenedor
  document.body.style.overflow = "hidden"; // Desactiva el scroll
  document.body.style.height = "100%"; // Evita el desplazamiento
}

// Función para cerrar la imagen maximizada
function cerrarImagenMaximizada() {
  const overlay = document.getElementById("imageOverlay");
  overlay.style.display = "none"; // Oculta el contenedor
  document.body.style.overflow = "auto"; // Reactiva el scroll
  document.body.style.height = "auto"; // Reactiva el desplazamiento
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