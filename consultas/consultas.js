//const { response } = require("express");
const { json } = require("express/lib/response.js");
const {pool} = require("../config/db.js");

// importo archivo para manejo de errores
const {errores} = require("../error/Errores.js");


//nombre de la tabla; se agrega tabla vacía y tabla no existente para manejar errores
const tabla = "skaters";
//const tabla = "skaters2";//tabla vacía
//const tabla = "ninguna";

//defino funcion para consultar si existe un usuario registrado
let existeSkater;


//agregar skater

// const agregaskater = async (email, nombre, password, anos, esp, pathPhoto) => {
//   try {
//     //Convierto parametros a minusculas para verificacion
//     const emailmin = email.trim().toLowerCase();
//     // const nombremin = nombre.trim().toLowerCase();
//     // const espmin = esp.trim().toLowerCase();

//     //Defino variable de estado en false por defecto
//     const estado = false;

//     //verifico si el skater ya existe en la tabla
//     existeSkater = await pool.query({
//       text: `SELECT * FROM ${tabla} WHERE LOWER(TRIM(email)) = LOWER(TRIM($1)) `, // AND LOWER(TRIM(artista)) = LOWER(TRIM($2)) AND LOWER(TRIM(tono)) = LOWER(TRIM($3))`,
//       values: [emailmin],
//     });
//     console.log(existeSkater.rowCount);
//     if (existeSkater.rowCount > 0) {
//       return response(401).send(`
//         <script>
//            alert('El Email ${email} ya se encuentra registrado, inicie sesión o registrese con otro email')
//            </script>`)      
//     }
//     //si no existe, agrego al skater
//     const result = await pool.query({
//       text: `INSERT INTO ${tabla} (email, nombre, password, anos_experiencia, especialidad, foto, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
//       values: [email, nombre, password, anos, esp, pathPhoto, estado],
//     });
//     console.log(`Usuari@ ${nombre} con ${email} registrad@ con éxito`);
//     console.log("Skater agregad@: ", result.rows[0]);
//     //console.log(result.rows[0])
//     res.status(200).send(`
//       <script>
//       alert('El participante ${nombre} con email: ${email} ha sido registrado con éxito.');// Devuelve los datos del participante registrado
//         </script>`)
//   } catch (error) {
//     console.log("Error al agregar el participante");
//     const EE = errores(error.code, error.status, error.message);
//     console.log(
//       "Status ",
//       EE.status,
//       " |Error Cod. ",
//       EE.code,
//       "|",
//       EE.message
//     );
//     res.status(500).send(`
//         <script>
//            alert(EE);          
//            </script>`)  
// };
// };

const agregaskater = async (email, nombre, password, anos, esp, pathPhoto) => {
  try {
    // Convierto parámetros a minúsculas para verificación
    const emailmin = email.trim().toLowerCase();

    // Defino variable de estado en false por defecto
    const estado = false;

    // Verifico si el skater ya existe en la tabla
    const existeSkater = await pool.query({
      text: `SELECT * FROM ${tabla} WHERE LOWER(TRIM(email)) = LOWER(TRIM($1))`,
      values: [emailmin],
    });

    if (existeSkater.rowCount > 0) {
      return { success: false, message: `El Email ${email} ya se encuentra registrado, inicie sesión o registrese con otro email` };
    }

    // Si no existe, agrego al skater
    const result = await pool.query({
      text: `INSERT INTO ${tabla} (email, nombre, password, anos_experiencia, especialidad, foto, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      values: [email, nombre, password, anos, esp, pathPhoto, estado],
    });

    return { success: true, message: `El participante ${nombre} con email: ${email} ha sido registrado con éxito.` };
  } catch (error) {
    console.log("Error al agregar el participante");
    console.error(error);
    return { success: false, message: "Error al agregar el participante." };
  }
};


//--------------------------------------------------------------

//lista todas los participantes

const listaSkaters = async () => {
  try {
    const res = await pool.query({
      // consulta para listar todas los skaters
           text: `SELECT * FROM ${tabla}`,
    });
    // bloque if para validar que la tabla está vacía
    if (res.rowCount == 0) {
      console.log(
        `No existen Participantes en el registro; favor agregar y repetir la consulta.`
      );
      return {statusCode: 204, message: "No existen Participantes en el registro; favor agregar y repetir la consulta." };
    } else {
      console.log(`Skaters registrados`, res.rows);
      // Devuelve los resultados de la consulta 
      return  res.rows;
    }
  } catch (error) {
    const EE = errores(error.code, error.status, error.message);
    console.log(
      "Status ",
      EE.status,
      " |Error Cod. ",
      EE.code,
      "|",
      EE.message
    );
    return EE;
  }
};


//----------------------------------------------------

//editar Skater

// const editaSkater = async (id,nombre, anos_experiencia, especialidad) => {
//   try {     
//     const result = await pool.query({
//       text: `UPDATE ${tabla} SET nombre = $2, anos_experiencia = $3, especialidad = $4 WHERE id = $1 RETURNING *;`,
//       values: [id, nombre, anos_experiencia, especialidad],
//     });
//     console.log(`Skater ${nombre} con ${especialidad} actualizado con éxito`);
//     console.log("Participante Editado: ", result.rows[0]);
//     //console.log(result.rows[0]);
//     return { success: true, message:`El participante ${email} ha actualizado sus datos correctamente.`}; // Devuelve respuesta de actualizacion
//   } catch (error) {
//     console.log("Error al editar el participante");
//     const EE = errores(error.code, error.status, error.message);
//     console.log(
//       "Status ",
//       EE.status,
//       " |Error Cod. ",
//       EE.code,
//       "|",
//       EE.message
//     );
//     return {EE:message};
//   }
// };

const editaSkater = async (id, nombre, anos_experiencia, especialidad) => {
  try {
    const result = await pool.query({
      text: `UPDATE ${tabla} SET nombre = $2, anos_experiencia = $3, especialidad = $4 WHERE id = $1 RETURNING *;`,
      values: [id, nombre, anos_experiencia, especialidad],
    });
    console.log(`Skater ${nombre} con especialidad ${especialidad} actualizado con éxito`);
    console.log("Participante Editado: ", result.rows[0]);
    return { success: true, message: `El participante ${nombre} ha actualizado sus datos correctamente.` }; // Devuelve respuesta de actualización
  } catch (error) {
    console.log("Error al editar el participante");
    const EE = errores(error.code, error.status, error.message);
    console.log(
      "Status ",
      EE.status,
      " | Error Cod. ",
      EE.code,
      " | ",
      EE.message
    );
    return { success: false, message: EE.message }; // Corrección del retorno de errores
  }
};

//---------------------------

//consulta email y password para validacion login
const validaLogin = async (email, password) => {
  try {
    const result = await pool.query({
      text: `SELECT id FROM ${tabla} WHERE email = $1 AND password = $2`,
      values: [email, password],
      });
      //console.log(result.rows[0]);
      if (result.rowCount === 0) {
        console.log('Datos de acceso inválidos, por favor reintente.');
        return null; 
        } else {
          const {id} = result.rows[0];
          return {id,email,password};
          }
          } catch (error) {
            console.log("Error al validar el usuario");
            const EE = errores(error.code, error.status, error.message);
            console.log(
              "Status ",
              EE.status,
              " |Error Cod. ",
              EE.code,
              "|",
              EE.message
              );
              throw EE;
              }
              };
             


//eliminar skater
// const borraskater = async (id) => {
//   try {
//       const result = await pool.query({
//       text: `DELETE FROM ${tabla} WHERE id = $1 RETURNING *;`,
//       values: [id]
//     });
//     const skat = result.rows[0];
//     console.log(`Participante ${skat.id} registrado con ${skat.email} eliminado con éxito`);
//     console.log("Participante Eliminado: ", cancion);
//     console.log(result.rows[0]);
//     return { success: true, message:`Participante ${skat.id} registrado con ${skat.email} eliminado con éxito`}; // Devuelve los datos del participante eliminado
//   } catch (error) {
//     console.log("Error al eliminar el registro");
//     const EE = errores(error.code, error.status, error.message);
//     console.log(
//       "Status ",
//       EE.status,
//       " |Error Cod. ",
//       EE.code,
//       "|",
//       EE.message
//     );
//     return { success: false, message: EE.message };
//   }
// };
const borraskater = async (id) => {
  try {
    const result = await pool.query({
      text: `DELETE FROM ${tabla} WHERE id = $1 RETURNING *;`,
      values: [id]
    });

    if (result.rowCount === 0) {
      // Maneja el caso cuando no se encuentra un registro con el ID proporcionado
      return { success: false, message: `No se encontró un participante con el ID ${id}` };
    }

    const skat = result.rows[0];
    console.log(`Participante ${skat.id} registrado con ${skat.email} eliminado con éxito`);
    console.log("Participante Eliminado: ", skat);
    return { success: true, message: `Participante ${skat.id} registrado con ${skat.email} eliminado con éxito` }; // Devuelve los datos del participante eliminado
  } catch (error) {
    console.log("Error al eliminar el registro");
    const EE = errores(error.code, error.status, error.message);
    console.log(
      "Status ",
      EE.status,
      " | Error Cod. ",
      EE.code,
      " | ",
      EE.message
    );
    return { success: false, message: EE.message };
  }
};

module.exports = {agregaskater,listaSkaters,editaSkater,validaLogin,borraskater};

console.log('Archivo de consultas cargado con éxito 👌');



