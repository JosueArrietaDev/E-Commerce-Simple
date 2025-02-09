const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// POST - Crear producto con descuento
router.post('/', async (req, res) => {
  try {
    if (!req.body.nombre || !req.body.precio || !req.body.descripcion || !req.body.stock) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const nuevoProducto = new Product({
      nombre: req.body.nombre,
      precio: req.body.precio,
      descripcion: req.body.descripcion,
      stock: req.body.stock,
      rebaja: req.body.rebaja || false,
      descuento: {
        porcentaje: req.body.descuento?.porcentaje || 0,
        activo: req.body.descuento?.activo || false,
        descripcion: req.body.descuento?.descripcion || ''
      }
    });

    const productoGuardado = await nuevoProducto.save();
    res.status(201).json(productoGuardado);
  } catch (err) {
    res.status(400).json({ message: 'Error al crear producto', error: err.message });
  }
});

// GET - Obtener productos en oferta
router.get('/ofertas', async (req, res) => {
  try {
    const ofertas = await Product.find({
      'descuento.activo': true
    }).limit(30); // Limitar a 50 prodcutos
    res.json(ofertas);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener ofertas', error: err.message });
  }
});

// PATCH - Actualizar descuento
router.patch('/:id/descuento', async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    producto.descuento = {
      porcentaje: req.body.porcentaje || producto.descuento.porcentaje,
      activo: req.body.activo ?? producto.descuento.activo,
      descripcion: req.body.descripcion || producto.descuento.descripcion
    };

    await producto.save();
    res.json(producto);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar descuento', error: err.message });
  }
});

module.exports = router;