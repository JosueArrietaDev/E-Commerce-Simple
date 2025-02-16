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
    const productosAActualizar = [];

    // Validar stock antes de procesar la compra
    for (const item of cart.productos) {
      const producto = await Product.findById(item.productoId);
      
      if (!producto) {
        return res.status(404).json({ message: `Producto no encontrado: ${item.nombre}` });
      }

      if (producto.stock < item.cantidad) {
        return res.status(400).json({ message: `Stock insuficiente para ${item.nombre}` });
      }

      // Almacenar para actualización posterior
      productosAActualizar.push({ producto, cantidad: item.cantidad });

      // Cálculos por producto
      const subtotalProducto = item.precio * item.cantidad;
      let descuentoProducto = 0;

      // Aplicar descuento si corresponde
      if (producto.rebaja) {
        descuentoProducto = subtotalProducto * 0.15; // 15% de descuento
      }

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

    // Ahora que la compra es válida, actualizar el stock de los productos
    for (const { producto, cantidad } of productosAActualizar) {
      producto.stock -= cantidad;
      await producto.save();
    }

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
    console.error("Error en la compra:", err);
    res.status(500).json({ message: 'Error al procesar la compra', error: err.message });
  }
});

module.exports = router;