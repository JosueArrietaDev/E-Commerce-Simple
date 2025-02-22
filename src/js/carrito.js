const API_URL = "http://localhost:5000/api";
import { obtenerCarrito, eliminarDelCarrito, comprarCarrito } from './api.js';
import { showToast } from './productos.js';

/**
 * Estado global del carrito
 */
let carritoState = {
    productos: [],
    subtotal: 0,
    descuentoTotal: 0,
    total: 0
};

/**
 * Inicializa el carrito
 */
export async function initializeCart() {
    await actualizarCarrito();
    setupEventListeners();
}

/**
 * Configura los event listeners del carrito
 */
function setupEventListeners() {
    const btnComprar = document.getElementById('btn-comprar');
    if (btnComprar) {
        btnComprar.addEventListener('click', handleCompra);
    }
    // Observer para actualizar el carrito cuando se muestra el offcanvas
    const carritoOffcanvas = document.getElementById('carritoOffcanvas');
    if (carritoOffcanvas) {
        carritoOffcanvas.addEventListener('show.bs.offcanvas', () => {
            actualizarCarrito();
        });
    }
}

/**
 * Actualiza el estado y la visualización del carrito
 */
export async function actualizarCarrito() {
    try {
        const cart = await obtenerCarrito(); // Obtener datos actualizados del carrito
        if (!cart || !cart.productos) throw new Error("El carrito está vacío o no se obtuvo correctamente");

        actualizarEstadoCarrito(cart); // Actualiza el estado global
        renderizarCarrito(); // Muestra los productos en el offcanvas
        actualizarContadores(); // Refresca la cantidad de ítems en el icono del carrito
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        showToast('Error al actualizar el carrito', true);
    }
}


/**
 * Actualiza el estado interno del carrito
 * @param {Object} cart - Datos del carrito
 */
export function actualizarEstadoCarrito(cart) {
    carritoState.productos = cart.productos || [];
    calcularTotales();
}

/**
 * Calcula los totales del carrito
 */
export function calcularTotales() {
    carritoState.subtotal = carritoState.productos.reduce((total, item) => {
        return total + (item.precio * item.cantidad);
    }, 0);

    carritoState.descuentoTotal = carritoState.productos.reduce((total, item) => {
        if (item.descuento?.activo) {
            return total + (item.precio * item.cantidad * (item.descuento.porcentaje / 100));
        }
        return total;
    }, 0);

    carritoState.total = carritoState.subtotal - carritoState.descuentoTotal;
}

/**
 * Renderiza los productos del carrito
 */
export function renderizarCarrito() {
    const carritoContainer = document.getElementById('carrito-items');
    if (!carritoContainer) return;

    if (carritoState.productos.length === 0) {
        carritoContainer.innerHTML = '<p class="text-center py-3">Tu carrito está vacío</p>';
        return;
    }

    carritoContainer.innerHTML = carritoState.productos.map(item => `
        <div class="d-flex justify-content-between align-items-center border-bottom py-2">
            <div class="flex-grow-1">
                <p class="mb-0">${item.nombre}</p>
                <small class="text-muted">$${item.precio} c/u</small>
            </div>
            <div class="d-flex align-items-center">
                <button class="btn btn-sm btn-outline-secondary me-2" 
                        onclick="reducirCantidad('${item.productoId}')">-</button>
                <span class="mx-2">${item.cantidad}</span>
                <button class="btn btn-sm btn-outline-secondary ms-2" 
                        onclick="aumentarCantidad('${item.productoId}')">+</button>
                <button class="btn btn-sm btn-danger ms-3" 
                        onclick="eliminarProducto('${item.productoId}')">🗑</button>
            </div>
            <div class="text-end ms-3">
                <p class="mb-0">$${(item.precio * item.cantidad).toFixed(2)}</p>
                ${item.descuento?.activo ? 
                    `<small class="text-success">-$${(item.precio * item.cantidad * (item.descuento.porcentaje / 100)).toFixed(2)}</small>` : 
                    ''}
            </div>
        </div>
    `).join('');
}

/**
 * Actualiza los contadores y totales en la UI
 */
export function actualizarContadores() {
    const elementos = {
        cantidad: document.getElementById('cantidad-carrito'),
        subtotal: document.getElementById('carrito-subtotal'),
        descuento: document.getElementById('descuento-total'),
        total: document.getElementById('carrito-total')
    };

    for (const [key, element] of Object.entries(elementos)) {
        if (element) {
            if (key === 'cantidad') {
                element.textContent = carritoState.productos.reduce((total, item) => total + item.cantidad, 0);
            } else {
                element.textContent = carritoState[key === 'subtotal' ? 'subtotal' : 
                                                key === 'descuento' ? 'descuentoTotal' : 
                                                'total'].toFixed(2);
            }
        }
    }
}

/**
 * Maneja el proceso de compra
 */
async function handleCompra() {
    const btnComprar = document.getElementById('btn-comprar');
    if (!btnComprar) return;

    try {
        btnComprar.disabled = true;
        const response = await fetch(`${API_URL}/purchase/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al procesar la compra');
        }

        showToast('¡Compra realizada con éxito!');
        await actualizarCarrito();
        
        // Cerrar el offcanvas
        const offcanvas = document.getElementById('carritoOffcanvas');
        if (offcanvas) {
            const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
            if (bsOffcanvas) {
                bsOffcanvas.hide();
            }
        }

        // Mostrar resumen de la compra
        if (data.resumen) {
            mostrarResumenCompra(data.resumen);
        }

    } catch (error) {
        showToast('Error al procesar la compra: ' + error.message, true);
    } finally {
        btnComprar.disabled = false;
    }
}

function mostrarResumenCompra(resumen) {
    const modal = new bootstrap.Modal(document.createElement('div'));
    modal.element.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Resumen de Compra</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p><strong>Fecha:</strong> ${new Date(resumen.fecha).toLocaleString()}</p>
                    <h6>Productos:</h6>
                    <ul>
                        ${resumen.detalleProductos.map(item => `
                            <li>${item.producto} x${item.cantidad} - $${item.total.toFixed(2)}</li>
                        `).join('')}
                    </ul>
                    <div class="mt-3">
                        <p><strong>Subtotal:</strong> $${resumen.resumenFinanciero.subtotal.toFixed(2)}</p>
                        <p><strong>Descuento:</strong> $${resumen.resumenFinanciero.descuentoTotal.toFixed(2)}</p>
                        <p><strong>Total:</strong> $${resumen.resumenFinanciero.total.toFixed(2)}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal.element);
    modal.show();
}

/**
 * Maneja la eliminación de un producto
 * @param {string} productoId - ID del producto a eliminar
 */
export async function eliminarProducto(productoId) {
    try {
        const response = await fetch(`${API_URL}/carrito/${productoId}`, {
            method: 'DELETE'
        });
        console.log('Respuesta del servidor:', response);

        if (!response.ok) {
            console.error('Error al eliminar el producto:', error);
            throw new Error('Error al eliminar el producto');
        }

        await actualizarCarrito();
        showToast('Producto eliminado del carrito');
    } catch (error) {
        showToast('Error al eliminar el producto', true);
    }
}

/**
 * Aumenta la cantidad de un producto en el carrito
 * @param {string} productoId - ID del producto
 */
window.aumentarCantidad = async function(productoId) {
    try {
        await cambiarCantidad(productoId, 'aumentar');
    } catch (error) {
        console.error('Error al aumentar cantidad:', error);
        showToast('Error al aumentar la cantidad', true);
    }
};

/**
 * Reduce la cantidad de un producto en el carrito
 * @param {string} productoId - ID del producto
 */
window.reducirCantidad = async function(productoId) {
    try {
        await cambiarCantidad(productoId, 'reducir');
    } catch (error) {
        console.error('Error al reducir cantidad:', error);
        showToast('Error al reducir la cantidad', true);
    }
};

/**
 * Cambia la cantidad de un producto en el carrito
 * @param {string} productoId - ID del producto
 * @param {string} accion - Acción a realizar ('aumentar' o 'reducir')
 */
async function cambiarCantidad(productoId, accion) {
    const response = await fetch(`${API_URL}/cantidad/${productoId}/${accion}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad: 1 })
    });
    if (!response.ok) {
        throw new Error(`Error al ${accion} la cantidad`);
    }
    await actualizarCarrito();
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', initializeCart);

export {
    carritoState,
    cambiarCantidad
};

window.eliminarProducto = eliminarProducto;
