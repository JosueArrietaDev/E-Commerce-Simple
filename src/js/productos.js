document.addEventListener('DOMContentLoaded', async () => {
    const productosContainer = document.getElementById('lista-productos');
    const ofertasContainer = document.getElementById('productos-oferta');
    
    const productos = await obtenerProductos();
    const ofertas = await obtenerOfertas();
    
    productosContainer.innerHTML = productos.map(producto => `
        <div class="col-md-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">${producto.descripcion}</p>
                    <p class="card-text">Precio: $${producto.precio}</p>
                    <button class="btn btn-primary" onclick="agregarAlCarrito('${producto._id}')">Agregar al carrito</button>
                </div>
            </div>
        </div>
    `).join('');
    
    ofertasContainer.innerHTML = ofertas.map(producto => `
        <div class="col-md-4">
            <div class="card border-danger">
                <div class="card-body">
                    <h5 class="card-title text-danger">${producto.nombre}</h5>
                    <p class="card-text">${producto.descripcion}</p>
                    <p class="card-text text-danger">Precio: $${producto.precio}</p>
                    <button class="btn btn-danger" onclick="agregarAlCarrito('${producto._id}')">Agregar al carrito</button>
                </div>
            </div>
        </div>
    `).join('');
});

