import { agregarAlCarrito } from './api.js';
import { showToast } from './productos.js';
import { actualizarCarrito } from './carrito.js'; // Importar actualizarCarrito

async function cargarOfertas() {
    try {
        const response = await fetch('/api/productosConDescuento/ofertas');
        if (!response.ok) {
            throw new Error('Error al cargar ofertas');
        }
        const ofertas = await response.json();
        if (!ofertas || !Array.isArray(ofertas)) {
            throw new Error('Datos de ofertas inválidos');
        }
        renderizarOfertas(ofertas);
    } catch (error) {
        console.error('Error:', error);
        const container = document.getElementById('ofertas-container');
        if (container) {
            container.innerHTML = '<p class="text-center text-danger">Error al cargar las ofertas</p>';
        }
    }
}

function renderizarOfertas(ofertas) {
    const container = document.getElementById('ofertas-container');
    if (!container) {
        console.error('Contenedor de ofertas no encontrado');
        return;
    }
    container.innerHTML = ofertas.map(producto => {
        const precioConDescuento = producto.getPrecioFinal ? 
            producto.getPrecioFinal() : 
            producto.precio * (1 - (producto.descuento.porcentaje / 100));
        
        return `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="position-absolute top-0 end-0 p-2">
                            <span class="badge bg-danger">-${producto.descuento.porcentaje}%</span>
                        </div>
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">${producto.descripcion}</p>
                        <div class="precio-container mb-3">
                            <span class="text-decoration-line-through text-muted">$${producto.precio}</span>
                            <h4 class="text-primary mb-0">$${precioConDescuento.toFixed(2)}</h4>
                        </div>
                        <p class="card-text">
                            <small class="text-muted">Stock disponible: ${producto.stock}</small>
                        </p>
                        <button 
                            class="btn btn-primary w-100 add-to-cart" 
                            data-product-id="${producto._id}"
                            ${producto.stock <= 0 ? 'disabled' : ''}
                        >
                            ${producto.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Agregar event listeners
    attachAddToCartListeners();
}

/**
 * Añade event listeners a los botones de agregar al carrito
 */
function attachAddToCartListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
}

/**
 * Maneja el evento de agregar al carrito
 * @param {Event} event - Evento del click
 */
async function handleAddToCart(event) {
    const button = event.target;
    const productId = button.getAttribute('data-product-id');
    
    try {
        button.disabled = true;
        const response = await agregarAlCarrito(productId, 1); // Llama a la función agregarAlCarrito
        showToast('Producto agregado al carrito');
        await actualizarCarrito(); // Llama a actualizarCarrito importada
    } catch (error) {
        console.error("Error al agregar producto:", error);
        showToast('Error al agregar producto al carrito', true);
    } finally {
        button.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', cargarOfertas);