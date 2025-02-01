const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  baje: {
    type: Boolean,
    default: false
  },
  descuento: {
    porcentaje: {
      type: Number,
      default: 0
    },
    activo: {
      type: Boolean,
      default: false
    },
    descripcion: {
      type: String,
      default: ''
    }
  }
});

// Método para calcular precio con descuento
productSchema.methods.getPrecioFinal = function() {
  if (this.descuento.activo) {
    const descuento = this.precio * (this.descuento.porcentaje / 100);
    return this.precio - descuento;
  }
  return this.precio;
};

module.exports = mongoose.model('Product', productSchema);