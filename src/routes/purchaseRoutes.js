const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// POST /api/purchase/checkout - Procesar la compra con detalles
router.post('/checkout', async (req, res) => {
  try {
    const cart = await Cart.findOne();
    
    if (!cart || cart.productos.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío' });
    }

    let subtotal = 0;
    let descuentoTotal = 0;
    const detalleCompra = [];

    // Procesar cada producto
    for (const item of cart.productos) {
      const producto = await Product.findById(item.productoId);
      
      if (!producto || producto.stock < item.cantidad) {
        return res.status(400).json({ 
          message: `Stock insuficiente para ${item.nombre}`
        });
      }

      // Cálculos por producto
      const subtotalProducto = item.precio * item.cantidad;
      let descuentoProducto = 0;

      // Aplicar descuento si corresponde
      if (producto.baje) {
        descuentoProducto = subtotalProducto * 0.15; // 15% descuento
      }

      // Actualizar stock
      producto.stock -= item.cantidad;
      await producto.save();

      // Agregar al detalle de compra
      detalleCompra.push({
        producto: item.nombre,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
        subtotal: subtotalProducto,
        descuento: descuentoProducto,
        total: subtotalProducto - descuentoProducto
      });

      subtotal += subtotalProducto;
      descuentoTotal += descuentoProducto;
    }

    const total = subtotal - descuentoTotal;

    // Limpiar el carrito
    cart.productos = [];
    await cart.save();

    // Generar resumen detallado
    const resumenCompra = {
      fecha: new Date(),
      detalleProductos: detalleCompra,
      resumenFinanciero: {
        subtotal,
        descuentoTotal,
        total
      },
      estadisticas: {
        cantidadProductos: detalleCompra.length,
        productosConDescuento: detalleCompra.filter(p => p.descuento > 0).length,
        ahorroTotal: descuentoTotal
      }
    };

    res.json({
      message: 'Compra realizada con éxito',
      resumen: resumenCompra
    });

  } catch (err) {
    res.status(500).json({ 
      message: 'Error al procesar la compra', 
      error: err 
    });
  }
});

module.exports = router;