const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Obtener todos los productos
router.get('/', async (req, res, next) => {
    try {
        const productos = await Product.find();
        res.json(productos);
    } catch (err) {
        next(err); //  Pasa el error al middleware global
    }
});

// Agregar un nuevo producto
router.post('/', async (req, res, next) => {
    try {
        const { nombre, precio, descripcion, stock, rebaja } = req.body;
        if (!nombre || !precio || !descripcion || stock === undefined) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        const nuevoProducto = new Product({ nombre, precio, descripcion, stock, rebaja });
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (err) {
        next(err);
    }
});

// Disminuir el stock de un producto
router.patch('/:id/disminuir', async (req, res, next) => {
    try {
        const { id } = req.params;
        const producto = await Product.findById(id);

        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        if (producto.stock <= 0) {
            return res.status(400).json({ error: "Stock insuficiente" });
        }

        producto.stock -= 1;
        await producto.save();
        res.json({ message: "Stock actualizado", producto });
    } catch (err) {
        next(err);
    }
});

// Middleware de manejo de errores global
router.use((err, req, res, next) => {
    console.error("Error en la API:", err);
    res.status(500).json({ error: "Error interno del servidor" });
});

module.exports = router;
