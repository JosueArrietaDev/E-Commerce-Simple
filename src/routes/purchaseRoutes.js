const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// POST  Procesar la compra con detalles
router.post('/', async (req, res) => {
  try {
      const cart = await Cart.findOne();
      
      if (!cart || cart.productos.length === 0) {
          return res.status(400).json({ message: 'El carrito está vacío' });
      }

      // Verificar stock y procesar la compra
      for (const item of cart.productos) {
          const producto = await Product.findById(item.productoId);
          if (!producto || producto.stock < item.cantidad) {
              return res.status(400).json({ 
                  message: `Stock insuficiente para ${item.nombre}` 
              });
          }
          producto.stock -= item.cantidad;
          await producto.save();
      }

      // Limpiar carrito después de la compra
      cart.productos = [];
      await cart.save();

      res.json({ message: 'Compra realizada con éxito' });
  } catch (err) {
      res.status(500).json({ message: 'Error al procesar la compra', error: err });
  }
});

module.exports = router;