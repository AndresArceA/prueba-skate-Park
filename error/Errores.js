//importo pool para tener acceso a los datos de conexion y manejar errores de este tipo
const { pool } = require('../config/db.js');

//funcion para manejar errores
function errores(code, status, message) {
switch (code) {
    case '28000':
        status = 400;
        message = `Usuario '${pool.options.user}' no existe, revise sus datos de acceso.`;
        break;
   case '22P02':
        status = 400;
        message = "No existen registros de skaters para editar en el listado, favor agregue antes de editar.";
        break;
    case '23505':
        status= 400;
        message = "Ya existe el skater favor ingrese uno nuevo.";
        break;
    case '28P01':
        message = `Autenticación de contraseña falló, revise la contraseña para el usuario '${pool.options.user}'`;
        break;
    case '23505':
        status = 400;
        message = "Ya existe el ID a ingresar";
        break;
    case '42P01':
        status = 400;
        message = "No existe la tabla consultada";
        break;    
    case '3D000':
        status = 400;
        message = `No existe la BD '${pool.options.database}', revise los datos de conexión.`;
        break;
    case 'ENOTFOUND':
        status = 500;
        message = "El nombre del Host está incorrecto, corrija los datos de conexión.";
        break;
    case 'ENOENT':
        status = 500;
        message = "No se encuentra el archivo solicitado, favor revisar las rutas.";
        break;
    case 'ECONNREFUSED':
        status = 500;
        message = "Error en el puerto de conexion a BD";
        break;
    default:
        status = 500;
        message = "Error generico del Servidor";
        break;
}

  return {code, status, message}
}

module.exports = {errores};