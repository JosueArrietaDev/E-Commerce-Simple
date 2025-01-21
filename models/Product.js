const mongoose = require('mongoose');

// Definir el esquema para los productos
const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },          // Nombre del producto
  precio: { type: Number, required: true },          // Precio del producto
  descripcion: { type: String, required: true },     // Descripción del producto
  stock: { type: Number, required: true },           // Cantidad disponible en inventario
  baje: { type: Boolean, default: false }            // Indica si tiene descuento
});

// Crear el modelo basado en el esquema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
