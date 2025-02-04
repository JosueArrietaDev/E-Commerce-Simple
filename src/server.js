require('dotenv').config({ path: './config/.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');



const app = express();
const uri = process.env.MONGO_URI;
const productRoutes = require('../src/routes/productRoutes');
const cartRoutes = require('../src/routes/cartRoutes');
const quantityRoutes = require('../src/routes/quantityRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const discountRoutes = require('./routes/discountRoutes');

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use('/api/cantidad', quantityRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/carrito', cartRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/productosConDescuento', discountRoutes);


// Variables de entorno
const PORT = process.env.PORT || 5000;

// Conexión a MongoDB
mongoose.connect(uri)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch((err) => console.error('Error conectando a MongoDB:', err));

 // Ruta base
 app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
