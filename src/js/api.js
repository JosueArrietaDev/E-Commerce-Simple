/**
 * Obtiene la lista de productos desde la API
 * @returns {Promise<Array>} - Promesa que resuelve con un array de productos
 */
export async function obtenerProductos() {
    const response = await fetch('/api/productos');
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
    const response = await fetch('/api/carrito', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, cantidad })
    });
    if (!response.ok) {
        throw new Error('Failed to add product to cart');
    }
    return await response.json();
}

/**
 * Obtiene el carrito desde la API
 * @returns {Promise<Object>} - Promesa que resuelve con los datos del carrito
 */
export async function obtenerCarrito() {
    const response = await fetch('/api/carrito');
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
    const response = await fetch(`/api/carrito/${productId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Failed to remove product from cart');
    }
    return await response.json();
}

/**
 * Procesa la compra del carrito
 * @returns {Promise<Object>} - Promesa que resuelve con la respuesta de la API
 */
export async function comprarCarrito() {
    const response = await fetch('/api/comprar', {
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
    const response = await fetch('/api/ofertas');
    if (!response.ok) {
        throw new Error('Failed to fetch offers');
    }
    return await response.json();
}