// js/api.js - Archivo para manejar las llamadas a la API
const API_URL = 'http://localhost:5000/api';

export async function obtenerProductos() {
    const respuesta = await fetch(`${API_URL}/productos`);
    return respuesta.json();
}

export async function obtenerOfertas() {
    const respuesta = await fetch(`${API_URL}/productosConDescuento/ofertas`);
    return respuesta.json();
}

export async function agregarAlCarrito(productoId) {
    await fetch(`${API_URL}/carrito`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productoId })
    });
}

export async function obtenerCarrito() {
    const respuesta = await fetch(`${API_URL}/carrito`);
    return respuesta.json();
}

export async function eliminarDelCarrito(productoId) {
    await fetch(`${API_URL}/carrito/${productoId}`, { method: 'DELETE' });
}

export async function comprarCarrito() {
    await fetch(`${API_URL}/carrito/comprar`, { method: 'POST' });
}
