/*
*   INGRESAR PRODUCTOS EN CANTIDA
*   LA BASE DE DATOS DEL NEGOCIO
*  ejecutar con node y la ruta de este archivo
*/
const mongoose = require('mongoose');
const Product = require('../models/Product'); // Asegúrate de que la ruta al modelo sea correcta
require('dotenv').config({ path: './config/.env' }); // Cargar variables de entorno

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("📡 Conectado a MongoDB"))
.catch(err => console.error("❌ Error al conectar a MongoDB", err));

// Productos CELÍACOS (SIN T.A.C.C.)
const productosCeliacos = [
  { nombre: "Galletas de arroz", precio: 800, descripcion: "Galletas sin gluten", stock: 50 },
  { nombre: "Harina de almendras", precio: 1200, descripcion: "Ideal para repostería sin TACC", stock: 30 },
  { nombre: "Pan sin gluten", precio: 1500, descripcion: "Pan fresco sin TACC", stock: 20 },
  { nombre: "Fideos de arroz", precio: 1100, descripcion: "Fideos sin gluten para pastas", stock: 40 },
  { nombre: "Cereal sin TACC", precio: 950, descripcion: "Cereal apto para celíacos", stock: 35 },
  { nombre: "Premezcla sin gluten", precio: 1300, descripcion: "Mezcla especial para repostería", stock: 25 },
  { nombre: "Snacks de maíz", precio: 850, descripcion: "Chips crujientes sin gluten", stock: 50 },
  { nombre: "Tostadas sin TACC", precio: 900, descripcion: "Tostadas sin gluten", stock: 45 },
  { nombre: "Chocolate sin gluten", precio: 1400, descripcion: "Chocolate apto para celíacos", stock: 28 },
  { nombre: "Pizza sin gluten", precio: 1600, descripcion: "Masa de pizza sin TACC", stock: 15 }
].map(p => ({ ...p, rebaja: false })); // ❌ Sin descuento

// Productos con descuento
const productosConDescuento = [
  { nombre: "Queso Gouda", precio: 2000, descripcion: "Queso madurado", stock: 20, descuento: { porcentaje: 10, activo: true, descripcion: "Descuento del 10%" } },
  { nombre: "Aceite de oliva", precio: 2500, descripcion: "Aceite de oliva extra virgen", stock: 15, descuento: { porcentaje: 15, activo: true, descripcion: "Descuento del 15%" } },
  { nombre: "Leche de almendras", precio: 1800, descripcion: "Bebida vegetal sin lactosa", stock: 30, descuento: { porcentaje: 5, activo: true, descripcion: "Descuento del 5%" } },
  { nombre: "Atún en lata", precio: 1200, descripcion: "Atún en agua", stock: 50, descuento: { porcentaje: 20, activo: true, descripcion: "Descuento del 20%" } },
  { nombre: "Galletas integrales", precio: 900, descripcion: "Galletas con avena", stock: 25, descuento: { porcentaje: 10, activo: true, descripcion: "Descuento del 10%" } },
  { nombre: "Arroz Yamani", precio: 1400, descripcion: "Arroz integral orgánico", stock: 35, descuento: { porcentaje: 8, activo: true, descripcion: "Descuento del 8%" } },
  { nombre: "Café molido", precio: 2200, descripcion: "Café 100% arábica", stock: 40, descuento: { porcentaje: 12, activo: true, descripcion: "Descuento del 12%" } },
  { nombre: "Jugo natural", precio: 1300, descripcion: "Jugo de naranja exprimido", stock: 18, descuento: { porcentaje: 5, activo: true, descripcion: "Descuento del 5%" } },
  { nombre: "Frutos secos", precio: 2700, descripcion: "Mix de frutos secos", stock: 22, descuento: { porcentaje: 15, activo: true, descripcion: "Descuento del 15%" } },
  { nombre: "Mermelada sin azúcar", precio: 1700, descripcion: "Mermelada de frutilla sin azúcar", stock: 12, descuento: { porcentaje: 10, activo: true, descripcion: "Descuento del 10%" } }
].map(p => ({ ...p, rebaja: true })); // ✅ Con descuento

// Insertar productos en la base de datos
Product.insertMany([...productosCeliacos, ...productosConDescuento])
  .then(() => {
    console.log("✅ Productos agregados con éxito");
    mongoose.connection.close();
  })
  .catch(err => console.error("❌ Error al insertar productos", err));
