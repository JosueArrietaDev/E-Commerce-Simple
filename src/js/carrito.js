document.addEventListener('DOMContentLoaded', async () => {
    await actualizarCarrito();
});

document.getElementById('btn-comprar').addEventListener('click', async () => {
    await comprarCarrito();
    await actualizarCarrito();
    alert('Compra realizada con éxito');
});

async function actualizarCarrito() {
    const carritoContainer = document.getElementById('carrito-items');
    const totalElement = document.getElementById('carrito-total');
    const cantidadElement = document.getElementById('cantidad-carrito');
    
    if (!carritoContainer || !totalElement || !cantidadElement) {
        return;
    }

    try {
        const response = await obtenerCarrito();
        console.log('Respuesta del carrito:', response); // Para debug

        // Verificamos que tengamos la estructura correcta
        if (!response || !response._id || !Array.isArray(response.productos)) {
            console.error('Estructura inesperada del carrito:', response);
            return;
        }

        const productos = response.productos;

        // Limpia el contenido
        carritoContainer.innerHTML = "";

        if (productos.length === 0) {
            carritoContainer.innerHTML = `<p class="text-center">Tu carrito está vacío</p>`;
            totalElement.textContent = "0";
            cantidadElement.textContent = "0";
            return;
        }

        // Agrega los productos
        carritoContainer.innerHTML = productos.map(item => `
            <div class="d-flex justify-content-between border-bottom py-2">
                <span>${item.nombre} (x${item.cantidad}) - $${item.precio * item.cantidad}</span>
                <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito('${item.productoId}')">🗑</button>
            </div>
        `).join('');

        // Calcula el total
        const total = productos.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
        totalElement.textContent = total.toFixed(2);
        cantidadElement.textContent = productos.length;

    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        carritoContainer.innerHTML = `<p class="text-center text-danger">Error al cargar el carrito</p>`;
    }
}

async function obtenerCarrito() {
    try {
        const response = await fetch('/api/carrito');
        if (!response.ok) throw new Error('Error al obtener carrito');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function agregarAlCarrito(productoId) {
    try {
        const response = await fetch('/api/carrito', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productoId })
        });
        if (!response.ok) throw new Error('Error al agregar al carrito');
        await actualizarCarrito();
    } catch (error) {
        console.error('Error:', error);
    }
};

async function eliminarDelCarrito(productoId) {
    try {
        const response = await fetch(`/api/carrito/${productoId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar del carrito');
        await actualizarCarrito();
    } catch (error) {
        console.error('Error:', error);
    }
};

async function comprarCarrito() {
    try {
        const response = await fetch('/api/carrito/comprar', {
            method: 'POST'
        });
        if (!response.ok) throw new Error('Error al procesar la compra');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al procesar la compra. Inténtalo de nuevo.');
    }
};