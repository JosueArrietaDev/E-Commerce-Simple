const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  productos: [{     // Array de productos en el carrito
    productoId: {   // ID del producto (referencia)
      type: mongoose.Schema.Types.ObjectId,  // Tipo especial para IDs de MongoDB
      ref: 'Product',
      required: true
    },
    nombre: { type: String, required: true },   // Nombre
    precio: { type: Number, required: true },   // Precio
    cantidad: { type: Number, required: true, min: 1 } // Cantidad mínima 1
  }]
});

module.exports = mongoose.model('Cart', cartSchema);