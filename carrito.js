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
    Swal.fire({
        title: "Compra",
        text: "Agregaste un producto al carrito",
        icon: "success",
        confirmButtonText: 'Confimado',
        cursor: 'point'
      });

    actualizarDisplayCarro();
    guardarCarroEnLocalStorage();
}

function eliminarDelCarrito(index) {
    products.splice(index, 1);
    Swal.fire({
        title: "Compra",
        text: "Eliminaste un producto del carrito",
        icon: "success",
        confirmButtonText: 'Confimado',
        cursor: 'point'
      });
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
            <td>
                <button class="decrement-qty" data-index="${index}"> - </button>
                <span class="qty">${product.cantidad}</span>
                <button class="increment-qty" data-index="${index}"> + </button>
            </td>
            <td>$${product.precio.toFixed(2)}</td>
            <td>$${(product.precio * product.cantidad).toFixed(2)}</td>
            <td><button class="remove-from-cart" data-index="${index}">X</button></td>
        `;
        cartItemsContainer.appendChild(row);
        total += product.precio * product.cantidad;
    });
    cartCount.textContent = products.length;
    actualizarTotal(total);

    // Agrega eventos de clic a los botones de incremento y decremento
    const decrementQtyButtons = document.querySelectorAll(".decrement-qty");
    const incrementQtyButtons = document.querySelectorAll(".increment-qty");

    decrementQtyButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const index = parseInt(button.dataset.index);
            decrementarCantidad(index);
        });
    });

    incrementQtyButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const index = parseInt(button.dataset.index);
            incrementarCantidad(index);
        });
    });

}

function decrementarCantidad(index) {
    const product = products[index];
    if (product.cantidad > 1) {
        product.cantidad--;
        actualizarDisplayCarro();
        guardarCarroEnLocalStorage();
    }
}

function incrementarCantidad(index) {
    const product = products[index];
    product.cantidad++;
    actualizarDisplayCarro();
    guardarCarroEnLocalStorage();
}


function actualizarTotal(total) {
    const totalElement = document.createElement("tr");
    totalElement.innerHTML = `
        <td colspan="3"><strong>Total:</strong></td>
        <td colspan="5">$${total.toFixed(2)}</td>
        
    `;
    cartItemsContainer.appendChild(totalElement);
}

function guardarCarroEnLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(products));
}

// Agrega un evento de clic a cada botón "Agregar al carrito"
// const addToCartButtons = document.querySelectorAll(".add-to-cart");
// addToCartButtons.forEach((button) => {
//     button.addEventListener("click", () => {
//         const product = productosTienda.find(p => p.nombre === button.closest(".product-card").querySelector(".product-title").textContent);
//         if (product) {
//             agregarAlCarrito(product);
//         }
//     });
// });

// Carga los productos desde el archivo "data.json"
fetch("productos/data.json")
    .then(response => response.json())
    .then(data => {
        // Agregar los botones "Agregar al carrito" a cada producto
        const productCards = document.querySelectorAll(".product-card");
        productCards.forEach(card => {
            const productName = card.querySelector(".product-title").textContent;
            const product = data.find(p => p.nombre === productName);
            if (product) {
                const addToCartButton = document.createElement("button");
                addToCartButton.classList.add("add-to-cart");
                addToCartButton.textContent = "Agregar al carrito";
                addToCartButton.addEventListener("click", () => {
                    agregarAlCarrito(product);
                });
                card.appendChild(addToCartButton);
            }
        });
    })
    .catch(error => {
        console.error('Error al cargar los productos:', error);
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

    Swal.fire({
        title: "Compra",
        text: "Vaciaste el carrito",
        icon: "success",
        confirmButtonText: 'Confimado',
        cursor: 'point'
      });
    // Actualizar el display del carrito
    actualizarDisplayCarro();

    // Guardar el carrito vacío en el localStorage
    guardarCarroEnLocalStorage();
}

actualizarDisplayCarro();


// Seleccionar el formulario
const form = document.querySelector(".form");

// Agregar el evento de envío del formulario
form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Obtener los valores de los campos del formulario
    const name = document.querySelector("#nombre").value;
    const surname = document.querySelector("#apellido").value;

    // Guardar los datos del formulario en el localStorage
    localStorage.setItem("formData", JSON.stringify({ name, surname }));

    // Guardar los datos del carrito en el localStorage
    guardarCarroEnLocalStorage();

    // Limpiar los campos del formulario
    form.reset();
});

    