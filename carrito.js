// Seleccion de 'IDs'
const nav = document.querySelector("#nav");
const abrir = document.querySelector("#carro");
const cerrar = document.querySelector("#close");
const cartCount = document.querySelector("#cart-count");
const cartItemsContainer = document.querySelector("#cart-items");
const izq_panel = document.querySelector("#izq-panel");

// LocalStorage
let products = JSON.parse(localStorage.getItem("cart")) || [];

// Eventos para que el panel del carrito sea visible y sea ocultado
abrir.addEventListener("click", () => {
    nav.style.visibility = "visible";
    izq_panel.style.visibility = "visible";
    actualizarDisplayCarro();
});

cerrar.addEventListener("click", () => {
    nav.style.visibility = "hidden";
    izq_panel.style.visibility = "hidden";
});

// Funcion de agregado de productos al carrito
function agregarAlCarrito(product) {
    const existingProduct = products.find(p => p.id === product.id);
    if (existingProduct) {
        existingProduct.cantidad++;
    } else {
        products.push({ ...product, cantidad: 1 });
    }

    // Mensaje de agregado de productos al carrito
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Producto agregado al carrito",
        showConfirmButton: false,
        timer: 1500,
        background: 'linear-gradient(to bottom, #f5f6f6 0%,#f5f6f6 7%,#f5f6f6 7%,#dbdce2 79%,#dbdce2 95%,#dbdce2 95%,#b8bac6 100%,#dddfe3 100%,#b8bac6 101%)'
        });

    actualizarDisplayCarro();
    guardarCarroEnLocalStorage();
}

// Eliminacion de carrito, llamado de funcion actuaclizacion y guardado del LoLocalStorage
function eliminarDelCarrito(index) {
    products.splice(index, 1);
    actualizarDisplayCarro();
    guardarCarroEnLocalStorage();
}

// Visualizacion del carrito
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

// Funcion de discminucion de cantidad de productos
function decrementarCantidad(index) {
    const product = products[index];
    if (product.cantidad > 1) {
        product.cantidad--;
        actualizarDisplayCarro();
        guardarCarroEnLocalStorage();
    }
}

// Funcion de aumento de cantidad de productos
function incrementarCantidad(index) {
    const product = products[index];
    product.cantidad++;
    actualizarDisplayCarro();
    guardarCarroEnLocalStorage();
}

// Funcion para de cantidad de productos
function actualizarTotal(total) {
    const totalElement = document.createElement("tr");
    totalElement.innerHTML = `
        <td colspan="3"><strong>Total:</strong></td>
        <td colspan="5">$${total.toFixed(2)}</td>
        
    `;
    cartItemsContainer.appendChild(totalElement);
}

// Funcion de guardado de productos en LocalStorage
function guardarCarroEnLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(products));
}

// Carga los productos desde el archivo "data.json"
async function cargarProductos() {
    try {
        const response = await fetch("productos/data.json");
        const data = await response.json();

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
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

cargarProductos();

// Agrega un evento de clic a cada botón "Eliminar" en el carrito
cartItemsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-from-cart")) {
        const index = parseInt(event.target.dataset.index);
        eliminarDelCarrito(index);
    }
});

const clearCartButton = document.getElementById('vaciar-carrito');

// Evento de vaciado del carrito
clearCartButton.addEventListener('click', () => {
    clearCart();
});

function clearCart() {
    // Eliminar todos los productos del carrito
    products = [];

    // Mensaje para cuado el carrito es vaciado
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Vaciaste el carrito",
        showConfirmButton: false,
        timer: 1500,
        background: 'linear-gradient(to bottom, #f5f6f6 0%,#f5f6f6 7%,#f5f6f6 7%,#dbdce2 79%,#dbdce2 95%,#dbdce2 95%,#b8bac6 100%,#dddfe3 100%,#b8bac6 101%)'
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
    
    // Limpiar los campos del Carrito
    clearCart();

    // Mensaje de Finalización de compra
    Swal.fire({
        title: "Gracias por su compra",
        icon: "success",
        confirmButtonText: 'Confimado',
        cursor: 'point',
        background: 'linear-gradient(to bottom, #f5f6f6 0%,#f5f6f6 7%,#f5f6f6 7%,#dbdce2 79%,#dbdce2 95%,#dbdce2 95%,#b8bac6 100%,#dddfe3 100%,#b8bac6 101%)'
      });
});

    