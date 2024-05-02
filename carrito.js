class Prodcuto {
    constructor (id, nombre, precio, categoria, stock){
        this.id;
        this.nombre;
        this.precio;
        this.categoria;
        this.stock;
    };
}

const productosTienda = [
    {id: 1, nombre: "Auricular", precio: 5000, categoria: "Electrónica", stock: 25},
    {id: 2, nombre: "Pendrive", precio: 2500, categoria: "Electrónica", stock: 10},
    {id: 3, nombre: "Mouse", precio: 1500, categoria: "Electrónica", stock: 50}
    ];

const productos = JSON.parse(localStorage.getItem("productos")) || [] 
let carrito = JSON.parse(localStorage.getItem("carrito")) || []
const pedidos = JSON.parse(localStorage.getItem("pedidos")) || []

const dropdownToggle = document.querySelector('.dropdown-toggle');
const dropdownMenu = document.querySelector('.dropdown-menu');

dropdownToggle.addEventListener('click', () => {
    dropdownMenu.classList.toggle('show');
});
