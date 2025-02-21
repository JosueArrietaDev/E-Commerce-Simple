const API_URL = "http://localhost:5000/api";
import { showToast } from './productos.js'; 

/**
 * Obtiene la lista de productos desde la API
 * @returns {Promise<Array>} - Promesa que resuelve con un array de productos
 */
export async function obtenerProductos() {
    const response = await fetch(`${API_URL}/productos`);
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return await response.json();
}

/**
 * Agrega un producto al carrito
 * @param {string} productId - ID del producto a agregar
 * @param {number} cantidad - Cantidad del producto a agregar
 * @returns {Promise<Object>} - Promesa que resuelve con la respuesta de la API
 */
export async function agregarAlCarrito(productId, cantidad) { 
    try {
        const response = await fetch(`${API_URL}/carrito`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, cantidad })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error al agregar al carrito');
        }

        return { ok: true, data }; // Prueba Retornar un objeto con la respuesta y los datos
    } catch (error) {
        return { ok: false, error: error.message };
    }
}

/**
 * Obtiene el carrito desde la API
 * @returns {Promise<Object>} - Promesa que resuelve con los datos del carrito prueba
 */
export async function obtenerCarrito() {
    const response = await fetch(`${API_URL}/carrito`);
    if (!response.ok) {
        throw new Error('Failed to fetch cart');
    }
    return await response.json();
}

/**
 * Elimina un producto del carrito
 * @param {string} productId - ID del producto a eliminar
 * @returns {Promise<Object>} - Promesa que resuelve con la respuesta de la API
 */
export async function eliminarDelCarrito(productId) {
    try {
        const response = await fetch(`${API_URL}/carrito/${productId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el producto del carrito');
        }

        const cart = await response.json(); // Obtener carrito actualizado
        actualizarEstadoCarrito(cart);
        renderizarCarrito(); // Refrescar la interfaz
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        showToast('Error al eliminar producto', true);
    }
}


/**
 * Procesa la compra del carrito
 * @returns {Promise<Object>} - Promesa que resuelve con la respuesta de la API
 */
export async function comprarCarrito() {
    const response = await fetch(`${API_URL}/comprar`, {
        method: 'POST'
    });
    if (!response.ok) {
        throw new Error('Failed to process purchase');
    }
    return await response.json();
}

/**
 * Obtiene las ofertas desde la API
 * @returns {Promise<Array>} - Promesa que resuelve con un array de ofertas
 */
export async function obtenerOfertas() {
    const response = await fetch(`${API_URL}/ofertas`);
    if (!response.ok) {
        throw new Error('Failed to fetch offers');
    }
    return await response.json();
}