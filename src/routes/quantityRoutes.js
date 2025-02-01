const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// PATCH /api/cantidad/:productoId/reducir - Reducir cantidad específica
router.patch('/:productoId/reducir', async (req, res) => {
  try {
    const { cantidad } = req.body;
    const cart = await Cart.findOne();
    
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    
    const productoIndex = cart.productos.findIndex(
      item => item.productoId.toString() === req.params.productoId
    );
    
    if (productoIndex === -1) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }
    
    const nuevaCantidad = cart.productos[productoIndex].cantidad - Math.abs(cantidad);
    
    if (nuevaCantidad > 0) {
      cart.productos[productoIndex].cantidad = nuevaCantidad;
    } else {
      cart.productos.splice(productoIndex, 1);
    }
    
    await cart.save();
    res.json({
      message: 'Cantidad reducida con éxito',
      cart: cart
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al reducir cantidad', error: err });
  }
});

// PATCH /api/cantidad/:productoId/aumentar - Aumentar cantidad específica
router.patch('/:productoId/aumentar', async (req, res) => {
  try {
    const { cantidad } = req.body;
    const cart = await Cart.findOne();
    
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    
    const productoIndex = cart.productos.findIndex(
      item => item.productoId.toString() === req.params.productoId
    );
    
    if (productoIndex === -1) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }
    
    // Verificar stock disponible
    const producto = await Product.findById(req.params.productoId);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado en inventario' });
    }
    
    if (producto.stock < cantidad) {
      return res.status(400).json({ message: 'Stock insuficiente' });
    }
    
    cart.productos[productoIndex].cantidad += Math.abs(cantidad);
    
    await cart.save();
    res.json({
      message: 'Cantidad aumentada con éxito',
      cart: cart
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al aumentar cantidad', error: err });
  }
});

// GET /api/cantidad/:productoId - Obtener cantidad actual de un producto
router.get('/:productoId', async (req, res) => {
  try {
    const cart = await Cart.findOne();
    
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    
    const producto = cart.productos.find(
      item => item.productoId.toString() === req.params.productoId
    );
    
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }
    
    res.json({
      productoId: producto.productoId,
      nombre: producto.nombre,
      cantidad: producto.cantidad
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener cantidad', error: err });
  }
});

module.exports = router;