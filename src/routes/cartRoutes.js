const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// GET /api/carrito - Obtener el carrito
router.get('/', async (req, res) => {
 
  try {
   
    const cart = await Cart.findOne() || await new Cart().save();

      /* Desglose de funciones:
           1. await Cart.findOne() -> Busca el primer carrito en la base de datos
           2. Si no encuentra carrito (null), entonces ejecuta: await new Cart().save()
           3. new Cart() -> Crea una nueva instancia de carrito vacío
           4. .save() -> Guarda el nuevo carrito en la base de datos
           5. await -> Espera a que se complete la operación de guardado
        */

    res.json(cart); 
  } 
    catch (err) {
  
    res.status(500).json({ message: 'Error al obtener el carrito', error: err });
  }
});

// POST /api/carrito - Agregar producto al carrito
router.post('/', async (req, res) => {
    // Realiza las Verificaciones
    try {
    // 1. Datos recibidos
    const { productoId, cantidad } = req.body;  // Obtiene ID y cantidad
    const producto = await Product.findById(productoId); // Busca el producto
    
    // 2.¿Existe el producto?
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // 3. ¿Hay suficiente stock?
    if (producto.stock < cantidad) {
      return res.status(400).json({ message: 'Stock insuficiente' });
    }
    
    // 4.  ¿Existe un carrito?
    let cart = await Cart.findOne() || await new Cart().save();
    
    // 5.  ¿El producto ya está en el carrito?
    const existingProductIndex = cart.productos.findIndex(
      item => item.productoId.toString() === productoId
    );
    
    // 6. Decisión basada en si el producto ya existe en el carrito
    if (existingProductIndex > -1) {
        // Si el producto ya existe en el carrito
        // Actualiza la cantidad sumando la nueva cantidad
      cart.productos[existingProductIndex].cantidad += cantidad;
        // Si el producto NO existe en el carrito
        // Agrega el producto como nuevo item al carrito
    } else {
      cart.productos.push({
        productoId,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad
      });
    }
    
    await cart.save();  // Guarda los cambios en la base de datos
    res.json(cart);     // Devuelve el carrito actualizado
  } catch (err) {       // Si ocurre algún error, devuelve un error 500 (Error del servidor)
    res.status(500).json({ message: 'Error al agregar al carrito', error: err });
  }
});

// DELETE /api/carrito/:productoId - Eliminar producto del carrito
router.delete('/:productoId', async (req, res) => {
  
  try {
    const cart = await Cart.findOne();
    // Busca un carrito. simpre se cree que hay un carrito
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' }); // Si no hay carrito.
    }
    
      // Filtra los productos del carrito, eliminando aquel cuyo ID coincida con el proporcionado en la URL.
      // Se utiliza toString() para comparar los IDs, ya que pueden ser de tipo ObjectId.

    cart.productos = cart.productos.filter(
      item => item.productoId.toString() !== req.params.productoId
    );
    
    await cart.save();// Guarda los cambios 

    res.json(cart); // actualiza el carrito
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar del carrito', error: err });
  }
});

// POST /api/carrito/comprar - Realizar la compra
router.post('/comprar', async (req, res) => {

  try {
    // Verificar que el carrito no esté vacío
    const cart = await Cart.findOne();
    // Busca un carrito. simpre se cree que hay un carrito
    if (!cart || cart.productos.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío' });// Si no hay carrito, error.
    }
    
    // Actualizar stock de productos
    // Recorre los productos del carrito
    for (const item of cart.productos) {
      // busca el producto
      const producto = await Product.findById(item.productoId);
      // Busca el producto por ID
      if (!producto || producto.stock < item.cantidad) {
       
        // Devuelve el: no hay producto o no hay suficiente stock
        return res.status(400).json({ 
          message: `Stock insuficiente para ${item.nombre}`
        });
      }
      // Actualiza el stock del producto restando la cantidad comprada
      producto.stock -= item.cantidad;
      await producto.save();
    }
    
    // Limpiar el carrito
    cart.productos = [];
    await cart.save();
    res.json({ message: 'Compra realizada con éxito' });
  }
  catch (err) {
    res.status(500).json({ message: 'Error al procesar la compra', error: err });
  }
});

module.exports = router;