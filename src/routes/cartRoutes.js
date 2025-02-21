const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// GET /api/carrito - Obtener el carrito
router.get('/', async (req, res) => {
    try {
        const cart = await Cart.findOne() || await new Cart().save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el carrito', error: err });
    }
});

// POST /api/carrito - Agregar producto al carrito
router.post('/', async (req, res) => {
    const { productId, cantidad } = req.body;
    if (!productId || cantidad <= 0) {
        return res.status(400).json({ error: "Datos inválidos" });
    }
    try {
        let cart = await Cart.findOne();
        if (!cart) {
            cart = new Cart({ productos: [] });
        }
        
        const producto = await Product.findById(productId);
        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Verificar stock
        if (producto.stock < cantidad) {
            return res.status(400).json({ error: "Stock insuficiente" });
        }

        const productoEnCarrito = cart.productos.find(p => p.productoId.toString() === productId);
        
        if (productoEnCarrito) {
            productoEnCarrito.cantidad += cantidad;
        } else {
            cart.productos.push({
                productoId: producto._id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: cantidad
            });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error("Error en POST /carrito:", error);
        res.status(500).json({ error: "Error al agregar al carrito", details: error.message });
    }
});


// DELETE /api/carrito/:productoId - Eliminar producto del carrito
router.delete('/:productoId', async (req, res) => {
    try {
        const cart = await Cart.findOne();
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        cart.productos = cart.productos.filter(
            item => item.productoId.toString() !== req.params.productoId
        );

        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar del carrito', error: err });
    }
});

module.exports = router;