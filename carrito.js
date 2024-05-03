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
    updateCartDisplay();
});

cerrar.addEventListener("click", () => {
    nav.style.visibility = "hidden";
});

function addToCart(product) {
    const existingProduct = products.find(p => p.id === product.id);
    if (existingProduct) {
        existingProduct.cantidad++;
    } else {
        products.push({ ...product, cantidad: 1 });
    }
    updateCartDisplay();
    saveCartToLocalStorage();
}

function removeFromCart(index) {
    products.splice(index, 1);
    updateCartDisplay();
    saveCartToLocalStorage();
}

function updateCartDisplay() {
    cartItemsContainer.innerHTML = "";
    let total = 0;
    products.forEach((product, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.nombre}</td>
            <td>${product.cantidad}</td>
            <td>$${product.precio.toFixed(2)}</td>
            <td>$${(product.precio * product.cantidad).toFixed(2)}</td>
            <td><button class="remove-from-cart" data-index="${index}">Eliminar</button></td>
        `;
        cartItemsContainer.appendChild(row);
        total += product.precio * product.cantidad;
    });
    cartCount.textContent = products.length;
    updateTotal(total);
}

function updateTotal(total) {
    const totalElement = document.createElement("tr");
    totalElement.innerHTML = `
        <td colspan="3"><strong>Total:</strong></td>
        <td>$${total.toFixed(2)}</td>
        <td></td>
    `;
    cartItemsContainer.appendChild(totalElement);
}

function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(products));
}

// Agrega un evento de clic a cada botón "Agregar al carrito"
const addToCartButtons = document.querySelectorAll(".add-to-cart");
addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const product = productosTienda.find(p => p.nombre === button.closest(".product-card").querySelector(".product-title").textContent);
        if (product) {
            addToCart(product);
        }
    });
});

// Agrega un evento de clic a cada botón "Eliminar" en el carrito
cartItemsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-from-cart")) {
        const index = parseInt(event.target.dataset.index);
        removeFromCart(index);
    }
});

// Cargar el carrito desde el LocalStorage al iniciar
updateCartDisplay();


// class Prodcuto {
//     constructor (id, nombre, precio, categoria, stock){
//         this.id;
//         this.nombre;
//         this.precio;
//         this.categoria;
//         this.stock;
//     };
// }

// const productosTienda = [
//     {id: 1, nombre: "Auricular", precio: 5000, categoria: "Electrónica", stock: 25},
//     {id: 2, nombre: "Pendrive", precio: 2500, categoria: "Electrónica", stock: 10},
//     {id: 3, nombre: "Mouse", precio: 1500, categoria: "Electrónica", stock: 50}
//     ];

// // const productos = JSON.parse(localStorage.getItem("productos")) || [] 
// // let carrito = JSON.parse(localStorage.getItem("carrito")) || []
// // const pedidos = JSON.parse(localStorage.getItem("pedidos")) || []

// const nav = document.querySelector("#nav");
// const abrir = document.querySelector("#carro");
// const cerrar = document.querySelector("#close");
// const cartCount = document.querySelector("#cart-count");

// // Variable para guardar productos
// let products = 0;

// abrir.addEventListener("click", () => {
//     nav.style.visibility = "visible";
// });
// cerrar.addEventListener("click", () => {
//     nav.style.visibility = "hidden";
// });

// function addToCart() {
//     products++;
//     updateCartCount();
// }

// function updateCartCount() {
//     cartCount.textContent = products;
// }

// // Agrega un evento de clic a cada botón "Agregar al carrito"
// const addToCartButtons = document.querySelectorAll(".add-to-cart");
// addToCartButtons.forEach((button) => {
//     button.addEventListener("click", addToCart);
// });
// const dropdownToggle = document.querySelector('.dropdown-toggle');
// const dropdownMenu = document.querySelector('.dropdown-menu');

// dropdownToggle.addEventListener('click', () => {
//     dropdownMenu.classList.toggle('show');
// });
