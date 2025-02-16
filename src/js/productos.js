import { obtenerProductos, agregarAlCarrito } from './api.js';
import { actualizarCarrito } from './carrito.js'; // Importar actualizarCarrito

/**
 * Inicializa el carrusel de productos
 */
async function initializeCarousel() {
    try {
        const response = await fetch('/api/productos');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const products = await response.json();
        
        // Tomar los primeros 3 productos
        const featuredProducts = products.slice(0, 3);
        
        const carouselInner = document.querySelector('.carousel-inner');
        const carouselIndicators = document.querySelector('.carousel-indicators');
        
        featuredProducts.forEach((product, index) => {
            const slide = document.createElement('div');
            slide.className = `carousel-item ${index === 0 ? 'active' : ''}`;
            
            slide.innerHTML = `
                <div class="d-flex justify-content-center align-items-center" style="height: 400px;">
                    <div class="card w-75">
                        <div class="card-body text-center">
                            <h2 class="card-title">${product.nombre}</h2>
                            <p class="card-text">${product.descripcion}</p>
                            <h3 class="text-primary">$${product.precio}</h3>
                            <button 
                                class="btn btn-primary add-to-cart" 
                                data-product-id="${product._id}"
                                ${product.stock <= 0 ? 'disabled' : ''}
                            >
                                ${product.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            carouselInner.appendChild(slide);

            const indicator = document.createElement('button');
            indicator.type = 'button';
            indicator.dataset.bsTarget = '#productCarousel';
            indicator.dataset.bsSlideTo = index;
            if (index === 0) {
                indicator.className = 'active';
                indicator.setAttribute('aria-current', 'true');
            }
            carouselIndicators.appendChild(indicator);
        });
        
        // Inicializar el carrusel de Bootstrap
        new bootstrap.Carousel(document.getElementById('productCarousel'), {
            interval: 3000 // Cambiar cada 3 segundos
        });
        
        // Agregar event listeners a los botones del carrusel
        attachAddToCartListeners();
        
    } catch (error) {
        console.error('Error initializing carousel:', error);
    }
}

/**
 * Obtiene y muestra los productos en la interfaz
 */
async function fetchProducts() {
    try {
        const products = await obtenerProductos();
        renderProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        showError('Error al cargar los productos. Por favor, intente más tarde.');
    }
}

/**
 * Renderiza los productos en el contenedor
 * @param {Array} products - Array de productos a mostrar
 */
function renderProducts(products) {
    const container = document.getElementById('productos-container');
    container.innerHTML = ''; 

    products.forEach(product => {
        const precioFinal = product.descuento?.activo 
            ? product.precio * (1 - (product.descuento.porcentaje / 100))
            : product.precio;

        const productCard = `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                <div class="card-body">
                    ${product.descuento?.activo ? 
                        `<div class="position-absolute top-0 end-0 p-2">
                            <span class="badge bg-danger">-${product.descuento.porcentaje}%</span>
                        </div>` : ''
                    }
                    <h5 class="card-title">${product.nombre}</h5>
                    <p class="card-text">${product.descripcion}</p>
                    <div class="precio-container mb-3">
                        ${product.descuento?.activo ? 
                            `<span class="text-decoration-line-through text-muted">$${product.precio}</span>` : ''
                        }
                        <h4 class="text-primary mb-0">$${precioFinal.toFixed(2)}</h4>
                    </div>
                    <p class="card-text">
                        <small class="text-muted">Stock disponible: ${product.stock}</small>
                    </p>
                    <button 
                        class="btn btn-primary add-to-cart" 
                        data-product-id="${product._id}"
                        ${product.stock <= 0 ? 'disabled' : ''}
                    >
                        ${product.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                    </button>
                </div>
            </div>
        </div>
    `;
        container.innerHTML += productCard;
    });

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
        await actualizarCarrito(); // Función que debe estar definida en carrito.js
    } catch (error) {
        console.error("Error al agregar producto:", error);
        showToast('Error al agregar producto al carrito', true);
    } finally {
        button.disabled = false;
    }
}

/**
 * Muestra un mensaje de error en la interfaz
 * @param {string} message - Mensaje de error
 */
function showError(message) {
    const container = document.getElementById('productos-container');
    if (container) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger" role="alert">
                    ${message}
                </div>
            </div>
        `;
    }
}

/**
 * Muestra un toast de notificación
 * @param {string} message - Mensaje a mostrar
 * @param {boolean} isError - Si es un mensaje de error
 */
function showToast(message, isError = false) {
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'bg-danger' : 'bg-success'} text-white`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="toast-body">
            ${message}
        </div>
    `;

    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();

    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    initializeCarousel();
});

// Exportar funciones que podrían necesitarse en otros módulos
export {
    fetchProducts,
    renderProducts,
    showToast
};