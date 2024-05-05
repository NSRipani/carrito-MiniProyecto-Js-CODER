class Producto {
    constructor(id, nombre, precio, categoria, stock) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.stock = stock;
    }
}

const productosTienda = [
    new Producto(1, "Auricular", 5000, "Electrónica", 25),
    new Producto(2, "Pendrive", 2500, "Electrónica", 10),
    new Producto(3, "Mouse", 1500, "Electrónica", 50)
];

const nav = document.querySelector("#nav");
const abrir = document.querySelector("#carro");
const cerrar = document.querySelector("#close");
const cartCount = document.querySelector("#cart-count");
const cartItemsContainer = document.querySelector("#cart-items");

// LocalStorage
let products = JSON.parse(localStorage.getItem("cart")) || [];

abrir.addEventListener("click", () => {
    nav.style.visibility = "visible";
    actualizarDisplayCarro();
});

cerrar.addEventListener("click", () => {
    nav.style.visibility = "hidden";
});

function agregarAlCarrito(product) {
    const existingProduct = products.find(p => p.id === product.id);
    if (existingProduct) {
        existingProduct.cantidad++;
    } else {
        products.push({ ...product, cantidad: 1 });
    }
    actualizarDisplayCarro();
    guardarCarroEnLocalStorage();
}

function eliminarDelCarrito(index) {
    products.splice(index, 1);
    actualizarDisplayCarro();
    guardarCarroEnLocalStorage();
}

function actualizarDisplayCarro() {
    cartItemsContainer.innerHTML = "";
    let total = 0;
    products.forEach((product, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.nombre}</td>
            <td>${product.cantidad}</td>
            <td>$${product.precio.toFixed(2)}</td>
            <td>$${(product.precio * product.cantidad).toFixed(2)}</td>
            <td><button class="remove-from-cart" data-index="${index}">X</button></td>
        `;
        cartItemsContainer.appendChild(row);
        total += product.precio * product.cantidad;
    });
    cartCount.textContent = products.length;
    actualizarTotal(total);
}

function actualizarTotal(total) {
    const totalElement = document.createElement("tr");
    totalElement.innerHTML = `
        <td colspan="3"><strong>Total:</strong></td>
        <td>$${total.toFixed(2)}</td>
        <td></td>
    `;
    cartItemsContainer.appendChild(totalElement);
}

function guardarCarroEnLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(products));
}

// Agrega un evento de clic a cada botón "Agregar al carrito"
const addToCartButtons = document.querySelectorAll(".add-to-cart");
addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const product = productosTienda.find(p => p.nombre === button.closest(".product-card").querySelector(".product-title").textContent);
        if (product) {
            agregarAlCarrito(product);
        }
    });
});

// Agrega un evento de clic a cada botón "Eliminar" en el carrito
cartItemsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-from-cart")) {
        const index = parseInt(event.target.dataset.index);
        eliminarDelCarrito(index);
    }
});

const clearCartButton = document.getElementById('vaciar-carrito');

clearCartButton.addEventListener('click', () => {
    clearCart();
});

function clearCart() {
    // Eliminar todos los productos del carrito
    products = [];

    // Actualizar el display del carrito
    actualizarDisplayCarro();

    // Guardar el carrito vacío en el localStorage
    guardarCarroEnLocalStorage();
}


actualizarDisplayCarro();
