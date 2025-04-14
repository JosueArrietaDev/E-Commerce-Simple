# E-Commerce Simple

Este es un proyecto de una tienda en línea simple, desarrollado con Node.js, Express, MongoDB y Bootstrap. El objetivo principal es proporcionar una base funcional para un sistema de comercio electrónico que incluye funcionalidades como carrito de compras, descuentos, y gestión de productos.

## Características

- **Frontend**:
  - Interfaz de usuario responsiva con Bootstrap.
  - Carrusel de productos destacados.
  - Visualización de productos con descuentos.
  - Carrito de compras interactivo con actualización en tiempo real.
  - Botón de contacto directo por WhatsApp.

- **Backend**:
  - API RESTful para la gestión de productos, carrito y compras.
  - Conexión a MongoDB para almacenamiento de datos.
  - Gestión de descuentos en productos.
  - Validación de stock antes de realizar compras.


## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/JosueArrietaDev/E-Commerce-Simple.git
   cd E-Commerce-Simple

2. Instala las dependencias:
   npm install

3. Configura las variables de entorno:

Crea un archivo .env en la carpeta config/ con el siguiente contenido:
MONGO_URI=tu_uri_de_mongodb
PORT=5000

4. Inserta productos en la base de datos (opcional):

node [insertProducts.js](http://_vscodecontentref_/5)

5. Inicia el servidor:

npm run dev

6.Abre tu navegador en http://localhost:5000 para ver la aplicación.

#Endpoints de la API
Productos:

GET /api/productos: Obtiene todos los productos.
POST /api/productos: Agrega un nuevo producto.
PATCH /api/productos/:id/disminuir: Disminuye el stock de un producto.

Carrito:

GET /api/carrito: Obtiene el carrito actual.
POST /api/carrito: Agrega un producto al carrito.
PUT /api/carrito/:id: Actualiza la cantidad de un producto en el carrito.
DELETE /api/carrito/:productoId: Elimina un producto del carrito.

Descuentos:

GET /api/productosConDescuento/ofertas: Obtiene productos con descuentos activos.
Compras:

POST /api/compras: Procesa la compra de los productos en el carrito.

Tecnologías Utilizadas:
Frontend:

HTML5, CSS3, Bootstrap 5
JavaScript (ES6+)
Backend:

Node.js, Express.js
MongoDB (Mongoose)

#Contribución
Si deseas contribuir a este proyecto, por favor sigue estos pasos:

Haz un fork del repositorio.
Crea una rama con tu nueva funcionalidad:
Realiza tus cambios y haz un commit:
Haz un push a tu rama:
Abre un Pull Request en GitHub.


Frontend:

HTML5, CSS3, Bootstrap 5
JavaScript (ES6+)
Backend:

Node.js, Express.js
MongoDB (Mongoose)
Contribución
Si deseas contribuir a este proyecto, por favor sigue estos pasos:

Haz un fork del repositorio.
Crea una rama con tu nueva funcionalidad:
Realiza tus cambios y haz un commit:
Haz un push a tu rama:
Abre un Pull Request en GitHub.

Licencia
Este proyecto está bajo la licencia ISC. Puedes usarlo y modificarlo libremente.

Autor
Desarrollado por JosueArrietaDev.

Frontend:

- HTML5, CSS3, Bootstrap 5
- JavaScript (ES6+)

Backend:

- Node.js, Express.js
- MongoDB (Mongoose)


Contribución
- Si deseas contribuir a este proyecto, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una rama con tu nueva funcionalidad:
git checkout -b nueva-funcionalidad
3. Realiza tus cambios y haz un commit:
git commit -m "Agrega nueva funcionalidad"
4. Haz un push a tu rama:
git push origin nueva-funcionalidad
5. Abre un Pull Request en GitHub

Licencia
Este proyecto está bajo la licencia ISC. Puedes usarlo y modificarlo libremente.

Autor
Desarrollado por JosueArrietaDev.
