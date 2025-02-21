const API_URL = "http://localhost:5000/api";
import { agregarAlCarrito } from './api.js';
import { showToast, handleAddToCart } from './productos.js';
import { actualizarCarrito } from './carrito.js'; 


async function cargarOfertas() {
    try {
        const response = await fetch(`${API_URL}/productosConDescuento/ofertas`);
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


// Inicializa las ofertas cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    cargarOfertas();
});
