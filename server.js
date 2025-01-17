const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const uri = process.env.MONGO_URI;


// Middleware
app.use(express.json());
app.use(cors());

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
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
