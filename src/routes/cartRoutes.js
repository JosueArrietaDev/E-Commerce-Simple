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
        const { productoId, cantidad } = req.body;
        const producto = await Product.findById(productoId);

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        if (producto.stock < cantidad) {
            return res.status(400).json({ message: 'Stock insuficiente' });
        }

        let cart = await Cart.findOne() || await new Cart().save();

        const existingProductIndex = cart.productos.findIndex(
            item => item.productoId.toString() === productoId
        );

        if (existingProductIndex > -1) {
            cart.productos[existingProductIndex].cantidad += cantidad;
        } else {
            cart.productos.push({
                productoId,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad
            });
        }

        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Error al agregar al carrito', error: err });
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

// POST /api/carrito/comprar - Realizar la compra
router.post('/comprar', async (req, res) => {
    try {
        const cart = await Cart.findOne();
        if (!cart || cart.productos.length === 0) {
            return res.status(400).json({ message: 'El carrito está vacío' });
        }

        for (const item of cart.productos) {
            const producto = await Product.findById(item.productoId);
            if (!producto || producto.stock < item.cantidad) {
                return res.status(400).json({ message: `Stock insuficiente para ${item.nombre}` });
            }
            producto.stock -= item.cantidad;
            await producto.save();
        }

        cart.productos = [];
        await cart.save();
        res.json({ message: 'Compra realizada con éxito' });
    } catch (err) {
        res.status(500).json({ message: 'Error al procesar la compra', error: err });
    }
});

module.exports = router;