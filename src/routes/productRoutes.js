const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/productos - Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await Product.find();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener productos', error: err });
  }
});

// POST /api/productos - Crear nuevo producto
router.post('/', async (req, res) => {
  try {
    const nuevoProducto = new Product(req.body);
    const productoGuardado = await nuevoProducto.save();
    res.status(201).json(productoGuardado);
  } catch (err) {
    res.status(400).json({ message: 'Error al crear producto', error: err });
  }
});

// PATCH /api/productos/:id/disminuir - Actualizar stock
router.patch('/:id/disminuir', async (req, res) => {
  try {
    const { cantidad = -1 } = req.body;  // Default to -1 if not specified
    const producto = await Product.findById(req.params.id);
    
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    // Check if stock would go negative
    if (producto.stock + cantidad < 0) {
      return res.status(400).json({ message: 'Stock insuficiente' });
    }
    
    producto.stock += cantidad;  // Now works with negative and positive values
    await producto.save();
    res.json(producto);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar stock', error: err });
  }
});

module.exports = router;