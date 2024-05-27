// Importaciones
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const expressFileUpload = require('express-fileupload');
const jwt = require("jsonwebtoken");
const path = require('path');
const fs = require('fs');

//configuro carpeta publica para imagenes

app.use(express.static(path.join(__dirname, "/assets/img")));


//defino la secret key
const secretKey = "elHuachimingo";



// importo funciones

const {agregaskater,listaSkaters,editaSkater,validaLogin, borraskater,estado, estadoSK} = require("./consultas/consultas.js") 


// Defino Puerto para el Servidor
const PORT = 3000;
//Arranco Servidor
app.listen(PORT, () => console.log(`SkatePark Server on port ${PORT} 🛹`));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static(__dirname + "/public"));

app.use(
    expressFileUpload({
        limits: {fileSize: 5000000},
        abortOnLimit: true,
        responseOnLimit: "El tamaño de la imagen supera el límite permitido",
    })
);
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main",
        layoutsDir: `${__dirname}/views/mainLayout`,
    })
);
app.set("view engine", "handlebars");



// Rutas asociadas a los handlebars
app.get("/", async (req, res) => {
    try {
        res.render("Home");
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});


app.get("/registro", (req, res) => {
    res.render("Registro");
});



app.get("/login", (req, res) => {
    res.render("Login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

 // Valido que el email y el password se ingresen
 if (!email || !password) {
    return res.status(400).send({
        error: "Debe proporcionar el correo electrónico y la contraseña.",
        code: 400,
      });
  }
  try {
    skater1 = await validaLogin(email, password); // Llamada a la función de consulta bd para validar usuario
    console.log("Skater1:", JSON.stringify(skater1));
    
    if (!skater1) {
      return res.status(401).send({
        error: "Debe proporcionar todos los valores correctamente para ingresar.",
        code: 401,
      });
    } else {
      const token = jwt.sign({
        skater: skater1}, secretKey); //Genero el token con los datos del skater
      //res.status(200).send(token);
      res.status(200).send(token);
    } //envío el token como respuesta
  } catch (e) {
    console.log(e);
    res.status(500).send({
      error: `Algo salió mal... ${e}`,
      code: 500,
    });
  }
});


app.get("/perfil", (req, res) => {
    const { token } = req.query
    jwt.verify(token, secretKey, (err, skater) => {
        if (err) {
            res.status(500).send({
                error: `Algo salió mal...`,
                message: err.message,
                code: 500
            })
        } else {
            res.render("Perfil", skater);
        }
    })
});


app.get("/Admin", async (req, res) => {
    try {
        res.render("Admin", {skaters});
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});


// ************************ API REST de Skaters *******************

// ******** Ruta GET /skaters para obtener el listado de todos los inscritos *************
let skaters;

app.get("/skaters", async (req, res) => {
    try {
        skaters = await listaSkaters();
        
        // Verificar si la lista de skaters está vacía
        if (skaters.length === 0) {
            res.status(204).json({message: "No existen Participantes en el registro; favor agregar y repetir la consulta."});
        } else {
            // Si hay skaters, devolver la lista como JSON
            console.log(skaters.length);
            res.status(200).json(skaters);
            return skaters;
            
        }
    } catch (e) {
        console.error(`Error al obtener la lista de skaters: ${e}`);
        return res.status(500).json({
            error: `Algo salió mal... ${e}`,
            code: 500
        });
    }
});

//*********** Ruta POST /skaters para registrar un nuevo participante ***********

app.post("/skaters", async (req, res) => {
    const { email, nombre, password, anos, esp } = req.body;

    // Validación de datos
    if (!email || !nombre || !password || !anos || !esp) {
        console.log("Debe proporcionar todos los valores correctamente para registrarse.");
        return res.status(401).send(`
            <script>
            alert("Debe proporcionar todos los valores correctamente para registrarse.");
            window.location.href = "/registro";
            </script>
        `);
    } else {
        // Manejo de la foto
        const foto = req.files && req.files.foto;
        if (!foto) {
            console.log("Debe proporcionar una foto.");
            return res.status(400).send(`
                <script>
                alert("Debe proporcionar una foto.");
                window.location.href = "/registro";
                </script>
            `);
        }
        
        const { name } = foto;
        const pathPhoto = `/uploads/${name}`;

        foto.mv(`${__dirname}/public${pathPhoto}`, async (err) => {
            if (err) {
                console.error("Error al subir la foto:", err);
                return res.status(500).send(`
                    <script>
                    alert("Error al subir la foto.");
                    window.location.href = "/registro";
                    </script>
                `);
            }

            console.log("Imagen cargada exitosamente.");
            try {
                // Agregar el skater a la base de datos
                const addSkater = await agregaskater(email, nombre, password, anos, esp, pathPhoto);
                return res.send(`
                <script>
                alert("${addSkater.message}");
                window.location.href = '${"/"}';
                </script>
            `);
            } catch (error) {
                console.error("Error al agregar el skater:", error);
                return res.status(500).send(`
                    <script>
                    alert("Error al agregar al participante");
                    window.location.href = '${"/"}';
                    </script>
                `);
            }
        });
    }
});
   

// **************** ruta PUT /Skaters para editar un participante

app.put("/skaters", async (req, res) => {
    const {id, nombre,anos_experiencia, especialidad} = req.body;
    console.log("Valor del body: ", id, nombre,anos_experiencia, especialidad);
    try {
        const skaterB = await editaSkater(id,nombre,anos_experiencia, especialidad);
        return res.send(`
                <script>
                alert("${skaterB.message}");
                window.location.href = '${"/"}';
                </script>
            `);
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});

//***************** Ruta Put /skaters/status para editar estado de skater */
app.put("/skaters/status/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    console.log("Valor de estado recibido por body: ",estado)
    try {
         const skaterB = estadoSK(id,estado);
         return res.send(`
                <script>
                alert("${skaterB.message}");
                window.location.href = '${"/"}';
                </script>
            `);
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});

//*************** Ruta Delete /skaters para eliminar participante ********/

app.delete("/skaters/:id", async (req, res) => {
    const { id } = req.params
    try {
        const skaterB = await borraskater(id);
        return res.send(`
        <script>
        alert("${skaterB.message}");
        window.location.href = '${"/"}';
        </script>
    `);
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal...1 ${e}`,
            code: 500
        })
    };
});

///****************** Ruta Generica uta genérica para manejar solicitudes a rutas no existentes ********/

app.get("*", (req, res) => {
    //res.status(404).send("La ruta solicitada no existe en el servidor.");
    res.status(404).sendFile(path.join(__dirname, "/404.html"));
  });