document.addEventListener("DOMContentLoaded", () => {
    const imgPrincipal = document.getElementById("img-principal");
    const zoomContainer = document.querySelector(".zoom-container");
    const miniaturas = document.querySelectorAll(".miniatura");
    const miniEncabezado = document.querySelector(".mini-encabezado");
    const productoSection = document.querySelector(".producto-container");
    const miniaturasContainer = document.querySelector(".miniaturas");

    let zoomActivo = false;
    let startX = 0, startY = 0, moveX = 0, moveY = 0;
    let lastTap = 0;
    let maxMoveX = 0, maxMoveY = 0;

    // Cambiar la imagen principal
    function cambiarImagen(src, miniatura) {
        imgPrincipal.src = src;
        document.querySelectorAll(".miniatura").forEach((m) => m.classList.remove("active"));
        miniatura.classList.add("active");
    }

    // 🖥️ Zoom en PC (pasa el mouse por encima)
    if (window.innerWidth > 768) {
        zoomContainer.addEventListener("mousemove", (e) => {
            const { left, top, width, height } = zoomContainer.getBoundingClientRect();
            const x = ((e.clientX - left) / width) * 100;
            const y = ((e.clientY - top) / height) * 100;

            imgPrincipal.style.transformOrigin = `${x}% ${y}%`;
            imgPrincipal.style.transform = "scale(2.5)";
        });

        zoomContainer.addEventListener("mouseleave", () => {
            imgPrincipal.style.transform = "scale(1)";
        });
    } else {
        // 📱 Zoom en celular con doble toque
        zoomContainer.addEventListener("touchend", (e) => {
            let currentTime = new Date().getTime();
            let tapLength = currentTime - lastTap;

            if (tapLength < 300 && tapLength > 0) {
                e.preventDefault();
                zoomActivo = !zoomActivo;

                if (zoomActivo) {
                    const touch = e.changedTouches[0];
                    const { left, top, width, height } = zoomContainer.getBoundingClientRect();
                    const x = ((touch.clientX - left) / width) * 100;
                    const y = ((touch.clientY - top) / height) * 100;

                    imgPrincipal.style.transformOrigin = `${x}% ${y}%`;
                    imgPrincipal.style.transform = "scale(2.5)";

                    maxMoveX = (width * 1.5 - width) / 2;
                    maxMoveY = (height * 1.5 - height) / 2;

                    document.body.style.overflow = "hidden";
                } else {
                    imgPrincipal.style.transform = "scale(1)";
                    imgPrincipal.style.transformOrigin = "center center";
                    imgPrincipal.style.transform = "translate(0px, 0px)";
                    document.body.style.overflow = "auto";
                }
            }
            lastTap = currentTime;
        });

        // 🖐️ Desplazamiento con el zoom activado
        zoomContainer.addEventListener("touchstart", (e) => {
            if (!zoomActivo) return;

            const touch = e.touches[0];
            startX = touch.clientX - moveX;
            startY = touch.clientY - moveY;
        });

        zoomContainer.addEventListener("touchmove", (e) => {
            if (!zoomActivo) return;

            e.preventDefault();
            const touch = e.touches[0];
            moveX = touch.clientX - startX;
            moveY = touch.clientY - startY;

            moveX = Math.min(Math.max(moveX, -maxMoveX), maxMoveX);
            moveY = Math.min(Math.max(moveY, -maxMoveY), maxMoveY);

            imgPrincipal.style.transform = `scale(2.5) translate(${moveX}px, ${moveY}px)`;
        });

        zoomContainer.addEventListener("touchend", () => {
            if (!zoomActivo) {
                document.body.style.overflow = "auto";
            }
        });
    }

    // Manejar el clic en la imagen para activar/desactivar el zoom
    imgPrincipal.addEventListener("click", () => {
        zoomActivo = !zoomActivo;

        if (zoomActivo) {
            const { width, height } = zoomContainer.getBoundingClientRect();
            maxMoveX = (width * 1.5 - width) / 2;
            maxMoveY = (height * 1.5 - height) / 2;

            imgPrincipal.style.transform = "scale(2.5)";
            imgPrincipal.style.transformOrigin = "center center";
            zoomContainer.style.overflow = "hidden"; // Solo desactiva el overflow dentro del contenedor
        } else {
            imgPrincipal.style.transform = "scale(1)";
            imgPrincipal.style.transformOrigin = "center center";
            moveX = 0;
            moveY = 0;
            imgPrincipal.style.transform = `translate(0px, 0px)`;
            zoomContainer.style.overflow = "auto"; // Reactiva el overflow dentro del contenedor
        }
    });

    // Permitir desplazamiento con el zoom activado
    zoomContainer.addEventListener("mousemove", (e) => {
        if (!zoomActivo) return;

        const { left, top, width, height } = zoomContainer.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        imgPrincipal.style.transformOrigin = `${x}% ${y}%`;
    });

    zoomContainer.addEventListener("touchstart", (e) => {
        if (!zoomActivo) return;

        const touch = e.touches[0];
        startX = touch.clientX - moveX;
        startY = touch.clientY - moveY;
    });

    zoomContainer.addEventListener("touchmove", (e) => {
        if (!zoomActivo) return;

        e.preventDefault();
        const touch = e.touches[0];
        moveX = touch.clientX - startX;
        moveY = touch.clientY - startY;

        moveX = Math.min(Math.max(moveX, -maxMoveX), maxMoveX);
        moveY = Math.min(Math.max(moveY, -maxMoveY), maxMoveY);

        imgPrincipal.style.transform = `scale(2.5) translate(${moveX}px, ${moveY}px)`;
    });

    // Detectar clics fuera de la imagen para desactivar el zoom
    document.addEventListener("click", (event) => {
        if (zoomActivo && !zoomContainer.contains(event.target)) {
            zoomActivo = false;
            imgPrincipal.style.transform = "scale(1)";
            imgPrincipal.style.transformOrigin = "center center";
            moveX = 0;
            moveY = 0;
            imgPrincipal.style.transform = `translate(0px, 0px)`;
            zoomContainer.style.overflow = "auto"; // Reactiva el overflow dentro del contenedor
        }
    });

    console.log("Pie de página cargado correctamente");

    // 📌 Íconos sociales con animación
    document.querySelectorAll(".social-icons a").forEach((icon) => {
        icon.setAttribute("target", "_blank");
        icon.setAttribute("rel", "noopener noreferrer");
    });

    // 📌 Mini encabezado se acopla al producto
    if (miniEncabezado && productoSection) {
        window.addEventListener("scroll", function () {
            let productoTop = productoSection.offsetTop;
            let productoBottom = productoTop + productoSection.offsetHeight;
            let scrollY = window.scrollY;

            if (scrollY >= productoTop && scrollY <= productoBottom) {
                miniEncabezado.style.transform = "translateY(0)";
                miniEncabezado.style.opacity = "1";
            } else {
                miniEncabezado.style.transform = "translateY(-100%)";
                miniEncabezado.style.opacity = "0";
            }
        });
    }

    // 📌 Mostrar etiquetas "Más Vendidos" y "Sin Stock"
    let imagenPrincipal = document.querySelector(".imagen-principal");
    if (imagenPrincipal) {
        let stock = imagenPrincipal.getAttribute("data-stock");
        let etiquetaMasVendidos = imagenPrincipal.querySelector(".mas-vendidos");
        let etiquetaSinStock = imagenPrincipal.querySelector(".sin-stock");

        if (stock === "mas-vendidos" && etiquetaMasVendidos) {
            etiquetaMasVendidos.style.display = "block";
        } else if (stock === "sin-stock" && etiquetaSinStock) {
            etiquetaSinStock.style.display = "block";
        } else {
            console.warn("Estado de stock desconocido:", stock);
        }
    }

    const params = new URLSearchParams(window.location.search);
    const product = params.get("product");

    // Datos de los productos
    const productData = {
//inicio de productos -- --> [ SECCION LAZOS Y MOÑOS ] <-- --
lazo1: {
    title: "Moño Coquette 1",
    price: "$2.000",
    color: "Beige",
    fabric: "Seda",
    description: "Lazo con colita",
    images: ["../images/lazo1.png"],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "9459410600812586", // ID del producto en el catálogo de WhatsApp
  },

// producto       (2imagenes)=  images: ["../images/lazo7.png", "../images/lazo7.png"],
  lazo2: {
    title: "Moño Coquette 2",
    price: "$1.200",
    color: "Verde",
    fabric: "Seda",
    description: "Lazo con colita",
    images: ["../images/lazo7.png"],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "9683377825085142", // ID del producto en el catálogo de WhatsApp
  },
  // producto       (2imagenes)=  images: ["../images/lazo7.png", "../images/lazo7.png"],
  lazo3: {
    title: "Moño Coquette 3",
    price: "$2.000",
    color: "Azul",
    fabric: "Seda",
    description: "Lazo con colita",
    images: ["../images/lazo8.png"],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "8622044534565713", // ID del producto en el catálogo de WhatsApp
  },
  // [ producto ]
  lazo4: {
    title: "Moño Coquette 4",
    price: "$2.000",
    color: "Negro",
    fabric: "Algodón",
    description: "Lazo con colita",
    images: ["../images/lazo9.png"],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "29139034642410358", // ID del producto en el catálogo de WhatsApp
  },
  // [ producto ]
  lazo5: {
    title: "Moño Coquette 5",
    price: "$2.000",
    color: "Azul",
    fabric: "Algodón",
    description: "Lazo con colita",
    images: ["../images/lazo10.png"],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "9677600405688471", // ID del producto en el catálogo de WhatsApp
  },
  // [ producto ]
  lazo6: {
    title: "Moño Coquette 6",
    price: "$2.000",
    color: "Blanco",
    fabric: "Seda",
    description: "Lazo con colita",
    images: ["../images/lazo14.png"],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "24003246802610861", // ID del producto en el catálogo de WhatsApp
  },
  lazo9: {
    title: "Moño Coquette 7",
    price: "$2.000",
    color: "Beige",
    fabric: "Algodon",
    description: "Lazo con colita",
    images: ["../images/lazo18.png",],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "29178302628449665", // ID del producto en el catálogo de WhatsApp
  },
  lazo10: {
    title: "Moño Coquette 8",
    price: "$2.000",
    color: "Beige",
    fabric: "Algodon",
    description: "Lazo con colita, diseño con flores",
    images: ["../images/lazo19.png",],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "9315279441912169", // ID del producto en el catálogo de WhatsApp
  },
  lazo11: {
    title: "Moño Coquette 9",
    price: "$2.000",
    color: "azul",
    fabric: "Algodon",
    description: "Lazo con colita, diseño con flores",
    images: ["../images/lazo20.png",],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "29745115778409011", // ID del producto en el catálogo de WhatsApp
  },
  lazo12: {
    title: "Mini Lazo 1",
    price: "$1.200",
    color: "Verde",
    fabric: "Algodon",
    description: "Mini Lazo con colita",
    images: ["../images/lazo2.png",],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "28871008819213738", // ID del producto en el catálogo de WhatsApp
  },
  lazo31: {
    title: "Mini Lazo 2",
    price: "$1.200",
    color: "Verde",
    fabric: "Algodon",
    description: "Mini Lazo con colita",
    images: ["../images/lazo3.png",],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "8812367682198041", // ID del producto en el catálogo de WhatsApp
  },
  lazo31: {
    title: "Mini Lazo 2",
    price: "$1.200",
    color: "Verde",
    fabric: "Algodon",
    description: "Mini Lazo con colita",
    images: ["../images/lazo3.png",],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "8812367682198041", // ID del producto en el catálogo de WhatsApp
  },
  lazo13: {
    title: "Mini Lazo 3",
    price: "$1.200",
    color: "Azul",
    fabric: "Algodon",
    description: "Mini Lazo con colita",
    images: ["../images/lazo4.png",],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "9492048217516204", // ID del producto en el catálogo de WhatsApp
  },
  lazo14: {
    title: "Mini Lazo 4",
    price: "$1.200",
    color: "Azul",
    fabric: "Algodon",
    description: "Mini Lazo con colita",
    images: ["../images/lazo5.png",],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "9819559878055153", // ID del producto en el catálogo de WhatsApp
  },
  lazo15: {
    title: "Mini Lazo 5",
    price: "$1.200",
    color: "Blanco",
    fabric: "Algodon",
    description: "Mini Lazo con colita",
    images: ["../images/lazo6.png",],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "9092583747531539", // ID del producto en el catálogo de WhatsApp
  },
  lazo16: {
    title: "Mini Lazo 6",
    price: "$1.500",
    color: "Verde",
    fabric: "Algodon",
    description: "Mini Lazo con colita",
    images: ["../images/lazo11.png",],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "29013290978315712", // ID del producto en el catálogo de WhatsApp
  }, 
  lazo17: {
    title: "Mini Lazo 7",
    price: "$1.200",
    color: "Rosa",
    fabric: "Algodon",
    description: "Mini Lazo con colita, diseño con flores rosas, violetas y amarillas",
    images: ["../images/lazo12.png",],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "9460002444081966", // ID del producto en el catálogo de WhatsApp
  }, 
  lazo18: {
    title: "Mini Lazo 8",
    price: "$1.200",
    color: "Amarillo",
    fabric: "Seda",
    description: "Mini Lazo dorado con colita",
    images: ["../images/lazo13.png",],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "9185388688225114", // ID del producto en el catálogo de WhatsApp
  },
  lazo19: {
    title: "Mini Lazo 9",
    price: "$1.200",
    color: "Negro",
    fabric: "Algodon",
    description: "Mini Lazo con colita",
    images: ["../images/lazo15.png",],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "29742732668647242", // ID del producto en el catálogo de WhatsApp
  }, 
  lazo20: {
    title: "Mini Lazo 10",
    price: "$1.200",
    color: "Azul",
    fabric: "Algodon",
    description: "Mini Lazo con colita",
    images: ["../images/lazo16.png",],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "9144072358995208", // ID del producto en el catálogo de WhatsApp
  },    
  lazo21: {
    title: "Mini Lazo 11",
    price: "$1.200",
    color: "Beige",
    fabric: "Algodon",
    description: "Mini Lazo con colita",
    images: ["../images/lazo17.png",],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "23919061774362954", // ID del producto en el catálogo de WhatsApp
  },

//Fin de productos -- --> [ SECCION LAZOS Y MOÑOS ] <-- --
//
//
//inicio productos -- --> [ SECCION COLITAS ] <-- --

  colita40: {
    title: "Moño 1",
    price: "$1.200",
    color: "Violeta",
    fabric: "Algodon",
    description: "Moño con colita",
    images: ["../images/colita1.png",],
    whatsapp: "5491151012889", // Número de WhatsApp
  },
  lazo41: {
    title: "Moño 2",
    price: "$1.200",
    color: "Blanco",
    fabric: "Algodon",
    description: "Moño con colita",
    images: ["../images/colita2.png",],
    whatsapp: "5491151012889", // Número de WhatsApp
  },
  lazo42: {
    title: "Moño 3",
    price: "$2.000",
    color: "Rojo",
    fabric: "Algodon",
    description: "Moño con colita",
    images: ["../images/colita3.png",],
    whatsapp: "5491151012889", // Número de WhatsApp
  },
  lazo43: {
    title: "Moño 4",
    price: "$2.000",
    color: "Beige",
    fabric: "Seda",
    description: "Moño con colita",
    images: ["../images/colita4.png",],
    whatsapp: "5491151012889", // Número de WhatsApp
  },
  lazo44: {
    title: "Moño 5",
    price: "$2.000",
    color: "Verde",
    fabric: "Seda",
    description: "Moño con colita",
    images: ["../images/colita5.png",],
    whatsapp: "5491151012889", // Número de WhatsApp
  },
  lazo45: {
    title: "Moño 6",
    price: "$2.000",
    color: "Beige",
    fabric: "Algodon",
    description: "Moño con colita",
    images: ["../images/colita6.png",],
    whatsapp: "5491151012889", // Número de WhatsApp
  },
  lazo46: {
    title: "Moño 7",
    price: "$2.000",
    color: "Verde",
    fabric: "Algodon",
    description: "Moño con colita",
    images: ["../images/colita7.png",],
    whatsapp: "5491151012889", // Número de WhatsApp
  },
//fin productos -- --> [ SECCION COLITAS ] <-- --
//
//
//inicio productos -- --> [ SECCION SCRUNCHIES ] <-- --
  scrunchie47: {
    title: "Scrunchie 1",
    price: "$4.000",
    color: "Violeta",
    fabric: "Algodon",
    description: "Srunchie",
    images: ["../images/scrunchie1.png", "../images/scrunchie1-parteatrasdetalle.png"],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "9601270626601106", // ID del producto en el catálogo de WhatsApp
  },
  scrunchie48: {
    title: "Scrunchie 2",
    price: "$4.000",
    color: "Rosa",
    fabric: "Algodon",
    description: "Srunchie",
    images: ["../images/scrunchie2.png", "../images/scrunchie2-parteatrasdetalle.png"],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "9133962300062659", // ID del producto en el catálogo de WhatsApp
  },
  lazo49: {
    title: "Scrunchie 3",
    price: "$2.000",
    color: "Azul",
    fabric: "Algodon",
    description: "Srunchie",
    images: ["../images/scrunchie3.png"],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "30252022541078511", // ID del producto en el catálogo de WhatsApp
  },
  lazo50: {
    title: "Scrunchie 4",
    price: "$2.000",
    color: "Beige",
    fabric: "Algodon",
    description: "Srunchie",
    images: ["../images/scrunchie4.png"],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "9325610837505559", // ID del producto en el catálogo de WhatsApp
  },
  lazo51: {
    title: "Scrunchie 5",
    price: "$2.000",
    color: "Animal Print",
    fabric: "Algodon",
    description: "Srunchie",
    images: ["../images/scrunchie5.png"],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "8911461235611249", // ID del producto en el catálogo de WhatsApp
  },
  lazo52: {
    title: "Scrunchie 6",
    price: "$2.000",
    color: "Azul",
    fabric: "Seda",
    description: "Srunchie",
    images: ["../images/scrunchie6.png"],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "9362932863742865", // ID del producto en el catálogo de WhatsApp
  },
  lazo53: {
    title: "Scrunchie 7",
    price: "$2.000",
    color: "Amarillo",
    fabric: "Seda",
    description: "Srunchie Dorado",
    images: ["../images/scrunchie7.png"],
    whatsapp: "5491151012889", // Número de WhatsApp
    catalogId: "9429567863830116", // ID del producto en el catálogo de WhatsApp
  },
    };

    // Actualizar los detalles del producto
    if (product && productData[product]) {
        const data = productData[product];

        // Actualizar el título con animación
        const titulo = document.querySelector(".titulo");
        titulo.textContent = data.title;
        titulo.style.opacity = "1"; // Asegura que sea visible después de la animación

        // Actualizar otros detalles
        document.querySelector(".descripcion").textContent = data.description;
        document.querySelector(".precio").textContent = data.price;
        document.querySelector(".color").textContent = data.color;
        document.querySelector(".material").textContent = data.fabric;

        // Actualizar la imagen principal con la primera imagen del arreglo
        imgPrincipal.src = data.images[0];
        imgPrincipal.alt = data.title;

        // Generar miniaturas dinámicamente con todas las imágenes del arreglo
        miniaturasContainer.innerHTML = "";
        data.images.forEach((src, index) => {
            const img = document.createElement("img");
            img.src = src;
            img.alt = `Miniatura ${index + 1}`;
            img.classList.add("miniatura");
            if (index === 0) img.classList.add("active");
            img.addEventListener("click", () => cambiarImagen(src, img));
            miniaturasContainer.appendChild(img);
        });

        // Actualizar el enlace de WhatsApp
        const whatsappButton = document.getElementById("whatsappButton");
        whatsappButton.href = `https://wa.me/p/${data.catalogId}/${data.whatsapp}`;
    }

    // Lógica del carrusel
    let currentIndex = 0;
    const images = document.querySelectorAll(".carousel-img");
    const prevButton = document.querySelector(".carousel-nav.prev");
    const nextButton = document.querySelector(".carousel-nav.next");

    function updateCarousel() {
        images.forEach((img, index) => {
            img.style.transform = `translateX(${(index - currentIndex) * 100}%)`;
        });
    }

    prevButton.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateCarousel();
    });

    nextButton.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % images.length;
        updateCarousel();
    });

    updateCarousel();
});
