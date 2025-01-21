const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Modelo de producto


// GET /api/productos - Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await Product.find();  // Busca todos los productos
    res.json(productos);    // Envía los productos como respuesta
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener productos', error: err });
  }
});

// POST /api/productos - Crear nuevo producto
router.post('/', async (req, res) => {
  try {
    const nuevoProducto = new Product(req.body); // Crea producto con datos recibidos
    const productoGuardado = await nuevoProducto.save(); // Guarda en la base de datos
    res.status(201).json(productoGuardado);    // Responde con el producto creado
  } catch (err) {
    res.status(400).json({ message: 'Error al crear producto', error: err });
  }
});

// PATCH /api/productos/:id/disminuir - Actualizar stock
router.patch('/:id/disminuir', async (req, res) => {
  try {
    const { cantidad = 1 } = req.body;  // Obtiene cantidad o usa 1 por defecto
    const producto = await Product.findById(req.params.id); // Busca producto por ID
    
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    if (producto.stock < cantidad) { // Verifica si hay suficiente stock
      return res.status(400).json({ message: 'Stock insuficiente' });
    }
    
    producto.stock -= cantidad;  // Disminuye el stock
    await producto.save();     // Guarda cambios
    res.json(producto);     // Responde con producto actualizado
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar stock', error: err });
  }
});

module.exports = router;

