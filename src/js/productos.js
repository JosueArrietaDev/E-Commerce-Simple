
async function fetchProducts() {
    try {
        const response = await fetch('/api/productos');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        document.getElementById('productos-container').innerHTML = 
            '<p>Error loading products. Please try again later.</p>';
    }
};

function renderProducts(products) {
    const container = document.getElementById('productos-container');
    container.innerHTML = ''; 

    products.forEach(product => {
        const productCard = `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${product.nombre}</h5>
                        <p class="card-text">${product.descripcion}</p>
                        <p class="card-text">
                            <strong>Precio:</strong> $${product.precio}
                            <br>
                            <strong>Stock:</strong> ${product.stock}
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

    // Add event listeners for "Add to Cart" buttons
    attachAddToCartListeners();
};

function attachAddToCartListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.getAttribute('data-product-id');
            try {
                const response = await fetch("/api/carrito", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productoId: productId, cantidad: 1 })
                });
                
                if (!response.ok) {
                    throw new Error(`Error en la API: ${response.status}`);
                };
                
                const data = await response.json();
                console.log("Producto agregado al carrito:", data);
                
                // Llamar a actualizarCarrito después de agregar el producto
                await actualizarCarrito();
                
            } catch (err) {
                console.error("Error al agregar producto:", err);
                alert("Error al agregar producto al carrito. Inténtalo de nuevo.");
            }
        });
    });
};

// carrusel
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

// Modificar el event listener del DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    initializeCarousel();
});