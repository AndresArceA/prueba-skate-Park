# prueba-skate-Park

![Skate Park](assets/skate-park.jpg)

Este repositorio contiene el código fuente para la prueba "Skate Park".
Consiste en Agregar participantes con su foto y datos relevantes  una base de datos, 
consultarla, editar participantes y su estado a la vez que tambien se pueden eliminar.


## Contenido

- **assets/**: Imágenes y recursos estáticos.
- **config/**: Archivos de configuración.
- **consultas/**: Consultas SQL.
- **error/**: Archivo para manejo de errores.
- **imagenes/**: Imágenes adicionales.
- **public/**: Archivos públicos.
- **views/**: Vistas de la aplicación.
- **.gitignore**: Archivos a ignorar por Git.
- **404.html**: Página de error 404.
- **estilos.css**: Estilos CSS.
- **index.html**: Página principal.
- **index.js: Scripts JavaScript con rutas para de servidor en NodeExpress.
- **package-lock.json, package.json**: Dependencias del proyecto.
- **skatepark.sql**: Base de datos SQL del proyecto.

## Tecnologías

- **JavaScript**: 68.7%
- **Handlebars**: 24.2%
- **HTML**: 5.1%
- **CSS**: 2.0%

## Instalación

1. Clonar el repositorio:
    ```sh
    git clone https://github.com/AndresArceA/prueba-skate-Park.git
    ```
2. Instalar dependencias:
    ```sh
    npm i
    ```
3. Configurar la base de datos utilizando el archivo `skatepark.sql`.

## Uso

Ejecutar la aplicación:
```sh
nodemon index

Archivos Clave
index.js
Este archivo contiene la lógica principal de la aplicación, gestionando las rutas y la conexión con la base de datos. Aquí se configuran los controladores y se definen las interacciones entre el frontend y el backend.

consultas.js
Este archivo maneja todas las consultas a la base de datos. Contiene las funciones necesarias para interactuar con la base de datos, realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) y obtener la información requerida por la aplicación.

Handlebars
Las vistas de la aplicación se manejan con Handlebars, un motor de plantillas que permite generar HTML dinámicamente. Los archivos de las vistas se encuentran en la carpeta views/ y se utilizan para renderizar las páginas con datos del servidor.

Autenticación con JWT
El sistema de autenticación de usuarios utiliza JSON Web Tokens (JWT). Los usuarios se autentican en la vista de login (Handlebars) y, si las credenciales son válidas, se genera un token JWT que se usa para acceder a áreas protegidas de la aplicación.

Contribuciones
Las contribuciones son bienvenidas. Por favor, realiza un fork del repositorio y crea un pull request con tus cambios.

Licencia
Este proyecto no tiene una licencia especificada.

Contacto
Para más información, contacta a AndresArceA.

