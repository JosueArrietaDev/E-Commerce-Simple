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
    try {
        const { productId, cantidad } = req.body;
        
        const producto = await Product.findById(productId);
        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        let cart = await Cart.findOne();
        if (!cart) {
            cart = new Cart({ productos: [] });
        }

        const productoEnCarrito = cart.productos.find(p => p.productoId.toString() === productId);
        
        if (productoEnCarrito) {
            productoEnCarrito.cantidad += cantidad;
        } else {
            cart.productos.push({
                productoId: producto._id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: cantidad,
                descuento: producto.descuento
            });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Error al agregar al carrito" });
    }
});

// PUT  /api/carrito/:id - Actualizar cantidad de un producto en el carrito
router.put('/:id', async (req, res) => {
    try {
        const { cantidad } = req.body;
        const cart = await Cart.findOne();
        
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const productoIndex = cart.productos.findIndex(
            p => p.productoId.toString() === req.params.id
        );

        if (productoIndex === -1) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }

        cart.productos[productoIndex].cantidad = cantidad;
        await cart.save();
        
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar cantidad', error: err });
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