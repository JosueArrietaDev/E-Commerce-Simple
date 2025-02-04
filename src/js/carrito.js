document.addEventListener('DOMContentLoaded', async () => {
    await actualizarCarrito();
});

async function actualizarCarrito() {
    const carritoContainer = document.getElementById('carrito-items');
    const totalElement = document.getElementById('carrito-total');
    const cantidadElement = document.getElementById('cantidad-carrito');
    
    const carrito = await obtenerCarrito();
    
    carritoContainer.innerHTML = carrito.map(item => `
        <div class="d-flex justify-content-between border-bottom py-2">
            <span>${item.nombre} (x${item.cantidad})</span>
            <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito('${item.productoId}')">🗑</button>
        </div>
    `).join('');
    
    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    totalElement.textContent = total;
    cantidadElement.textContent = carrito.length;
}

document.getElementById('btn-comprar').addEventListener('click', async () => {
    await comprarCarrito();
    await actualizarCarrito();
    alert('Compra realizada con éxito');
});
