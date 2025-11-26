⚠️ Disclaimer
Este proyecto, Zapa-Store-React, ha sido desarrollado exclusivamente con fines educativos y demostrativos. No está diseñado para entornos de producción. El código puede contener fallas de seguridad, lógica no optimizada y carece de validaciones exhaustivas y controles de acceso.
No se recomienda su uso en aplicaciones reales sin una auditoría completa, pruebas rigurosas y fortalecimiento de seguridad.

Sitio Web:

https://zapa-store-react.infinityfreeapp.com/


GitHub: 
https://github.com/adrianese/Zapa_Store_REACT_PHP



# Proyecto E-commerce con React

Este es el repositorio de un proyecto de E-commerce desarrollado con React. La aplicación simula una tienda en línea, permitiendo a los usuarios explorar un catálogo de productos, filtrarlos según sus necesidades, compararlos y gestionar un carrito de compras.

## Descripción General

La aplicación está diseñada para ser una plataforma de comercio electrónico robusta y moderna. Utiliza una arquitectura basada en componentes de React para crear una interfaz de usuario interactiva y reutilizable. El enfoque principal es ofrecer una experiencia de usuario fluida para la búsqueda y selección de productos.

## Características Principales

*   **Catálogo de Productos:** Muestra una lista de productos en un diseño de cuadrícula (grid) fácil de navegar.
*   **Búsqueda y Filtrado:** Incluye un componente de búsqueda que permite a los usuarios filtrar productos por:
    *   Marca
    *   Actividad o categoría
    *   Ordenar por precio (ascendente/descendente)
*   **Carrito de Compras:** Los usuarios pueden agregar productos a un carrito, ver un resumen de su selección y simular el proceso de compra.
*   **Páginas Estáticas:** Incluye secciones informativas como "Nosotros" y un formulario de "Contacto".
*   **Páginas Dinámicas:** Incluye secciones informativas con Detalles de Productos y un formulario de "Inicio de Sesión".
*   **Diseño Responsivo:** La interfaz se adapta a diferentes tamaños de pantalla, desde dispositivos móviles hasta computadoras de escritorio, gracias al uso de Media Queries.
```
src/
├── App.jsx
├── index.js
│
├── pages/
│   ├── Inicio.jsx
│   ├── Productos.jsx
│   ├── Nosotros.jsx
│   ├── Contacto.jsx
│   ├── Carrito.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Checkout.jsx
│   └── admin/
│       ├── Dashboard.jsx
│       ├── ProductosAdmin.jsx
│       ├── CrearProducto.jsx
│       ├── EditarProducto.jsx
│       ├── PedidosAdmin.jsx
├── components/
│   ├── ADMIN (components)
│   ├── Footer.jsx
│   ├── ProductoCard.jsx
│   ├── CarritoItem.jsx
│   ├── Buscador.jsx
│   ├── CarritoModal.jsx
│   ├── Header.jsx
│   └── SeccionProductos.jsx
├── context/
│   ├── AuthContext.jsx
│   ├── CarritoContext.jsx
│   ├── AuthProvider.jsx
│   └── CarritoProvider.jsx

************************************************************
Las siguientes secciones se agregaronen la segunda etapa:
************************************************************

PAGES/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Checkout.jsx
│   ├── MisCompras.jsx         # ← historial de compras del usuario
│   └── admin/
│       ├── Adminboard.jsx
│       ├── ProductosAdmin.jsx
│       ├── CrearProducto.jsx
│       ├── EditarProducto.jsx
│       ├── PedidosAdmin.jsx  
│       ├── AdminHeader.jsx    # ← navbar exclusivo para admin
│       ├── DarkModeToogle.jsx   # ← app de dark mode
│       └── AdminFooter.jsx    # ←  footer para admin
├── context/
│   ├── AuthContext.jsx
│   ├── AuthProvider.jsx
│   ├── CarritoContext.jsx
│   └── CarritoProvider.jsx
│   ├── UseAuth.js
│   
│
├── routes/
│   ├── PrivateRoute.jsx       # ←  protege rutas para usuarios logueados
│   └── AdminRoute.jsx         # ←  protege rutas para admin
```
Página Register:
Las opciones de Register  se realizaran con nombre, correo y password.
Páginas Login: Las opciones de login solo correo y password.
    Como funciona el sistema: Al cargar un producto o mas al carritoModal tenemos la opción de registrarse o loguearse.
    El Usuario o Cliente, se verificará en una base de datos de MySQL

   
    Que  tiene los datos del registrado , su pedido con id y a su vez factura y otros datos .cuando el usuario este registrado y logueado tendrá la posibilidad de ver sus compras anteriores si existieran podrá habilitar la compra actual mediante un form donde se enviará para procesar.
    
     Como Admin se ingresará a través de /admin con correo y password genérico. admin@correo.com y admin. Al ingresar ira a un dashboard, donde podrá:
     a- listar todos los productos , con la opción de borrar y actualizar datos desde la card del producto. 
     b- cargar un nuevo producto  y 
     c- ver todos los pedidos por id /factura/ usuario/ productos o pedidos historicos / fecha /total/ impuestos/ etc.
     d- Cargar y Modificar talles unitarios de cada producto.


---

Autenticación básica (Login y Registro)
Permitir que usuarios se registren, inicien sesión y se identifiquen para comprar.
Estructura de usuarios en MySQL
- Campos: id_usuario, nombre, correo, password, rol (usuario o admin)
Register.jsx
- Formulario con nombre, correo, password
- Validaciones visuales (SweetAlert2, campos obligatorios)
- POST a MySQL para crear usuario
Login.jsx
- Formulario con correo, password. Validación contra MySQL 
- Guardar sesión en localStorage o AuthContext
- Redirigir a /checkout si hay productos en el carrito
AuthContext.jsx
- Estado global: usuario, isLogged, login(), logout()
- Persistencia con localStorage

Checkout y gestión de pedidos
Procesamiento de compras y vínculo al usuario logueado.
Estructura de pedidos en MySQL: id_pedido, id_usuario, fecha, total, estado ENUM('pendiente','pagado','enviado','cancelado') DEFAULT 'pendiente', factura.

Checkout.jsx
- Mostrar resumen del carrito
- Formulario de envío (dirección, método de pago simulado)
- POST a /pedidos con los datos del usuario y productos
- Vaciar carrito y mostrar confirmación
Mis-compras.jsx
- Muestra cards con fecha, total, productos (Se reenvía luego de la confirmación)

Panel de administración
Control total sobre productos y pedidos.
Login de administrador
- Validar con correo admin@correo.com y password admin
- Redirigir a /admin/board
ProductosAdmin.jsx
- GET /products
- Muestra cards de productos con botón de editar y eliminar
- DELETE para eliminar
- Navegar a EditarProducto.jsx
- Formulario precargado con datos del producto
- PUT para actualizar
CrearProducto.jsx
- Formulario completo con imagen, nombre, precio, actividad, disponibilidad  POST a /products
PedidosAdmin.jsx 
- Muestra tabla con: ID, usuario, fecha, total, productos, estado
- Filtro por fecha o usuario
TallesCantidad.jsx
Permite Cargar /Modificar las cantidades de producto por talle.


Admin
- Implementado con DARKMode y Styled-Components
- AdminHeader.jsx, AdminFooter.jsx, PedidosAdmin.jsx, ProductForm.jsx etc.
- Uso de react-router-dom para proteger rutas: PrivateRoute para usuarios y AdminRoute para admin
- Lógica de carrito en un hook: useCarrito()
- Uso SweetAlert2 para feedback visual en formularios y acciones


📧 adrianseri@hotmail.com


