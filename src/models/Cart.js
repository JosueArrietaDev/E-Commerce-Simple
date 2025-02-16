const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    productos: [
        {
            productoId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            nombre: {
                type: String,
                required: true,
                trim: true
            },
            precio: {
                type: Number,
                required: true,
                min: 0
            },
            cantidad: {
                type: Number,
                required: true,
                min: 1  // 🔹 No permite cantidades negativas o 0
            }
        }
    ],
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;
