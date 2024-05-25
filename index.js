// Importaciones
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const expressFileUpload = require('express-fileupload');
const jwt = require("jsonwebtoken");
const secretKey = "elhuachimingo";


// const skaters = [
//     {
//       id: 1,
//       email: 'kb@fbi.com',
//       nombre: 'Kill Bill',
//       password: 'me',
//       anos_experiencia: 4,
//       especialidad: "FullStack",
//       foto: "/uploads/Danny.jpg",
//       estado: false
//     },
//     {
//         id: 2,
//         email: 'fg@fbi.com',
//         nombre: 'Forrest Gump',
//         password: 'you',
//         anos_experiencia: 6,
//         especialidad: "DBA",
//         foto: "/uploads/Danny.jpg",
//         estado: true
//     },
//     {
//         id: 3,
//         email: 'jm@fbi.com',
//         nombre: 'Jonh Meyers',
//         password: 'he',
//         anos_experiencia: 8,
//         especialidad: "FrontEnd",
//         foto: "/uploads/Danny.jpg",
//         estado: true
//     },
//   ]

// importo funciones

const {agregaskater,listaSkaters,editaSkater} = require("./consultas/consultas.js") 


// Server
app.listen(3000, () => console.log("Servidor encendido PORT 3000!"));

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

// app.get("/", async (req, res) => {
//     try {
//         const skaters = await listaSkaters(); // llamo a la funcion listaskaters
//         res.render("Home", { skaters: skaters });
//     } catch (e) {
//         res.status(500).send({
//             error: `Algo salió mal... ${e}`,
//             code: 500
//         });
//     }
// });

app.get("/registro", (req, res) => {
    res.render("Registro");
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
            res.render("Perfil", { editaSkater });
        }
    })
});

app.get("/login", (req, res) => {
    res.render("Login");
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const skater = skaters.find((s) => s.email == email && 
                                         s.password == password);
        
        const token = jwt.sign(skater, secretKey)
        res.status(200).send(token)

    } catch (e) {

        console.log(e)
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
        
    };
});

app.get("/Admin", async (req, res) => {
    try {
        res.render("Admin", { skaters });
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});


// API REST de Skaters

// app.get("/skaters", async (req, res) => {
//     try {
//         const skaters = await listaSkaters();
//         //res.status(200).json(skaters);
//         return skaters;
//     } catch (e) {
//         console.error(`Error al obtener la lista de canciones: ${e}`);
//         res.status(500).json({
//             error: `Algo salió mal... ${e}`,
//             code: 500
//         })
//     };
// });

app.get("/skaters", async (req, res) => {
    try {
        const skaters = await listaSkaters();
        
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

// app.post("/skaters", async (req, res) => {
//     const { email, nombre, password, anos, esp} = req.body;
//     if (!email || !nombre || !password || !anos || !esp) {
//         //valida que se estén pasando los parametros para la consulta
//         console.log(
//           "Debe proporcionar todos los valores correctamente para registrarse."
//         );
//         res.status(401).send("Debe proporcionar todos los valores correctamente para registrarse.");
//         return;
//       }
//     const { foto } = req.files;
//     const { name } = foto;
//     const pathPhoto = `/uploads/${name}`;

//     console.log("Valor del req.body: ", req.body);
//     console.log("Nombre de imagen: ", name);
//     console.log("Ruta donde subir la imagen: ", pathPhoto);

//     foto.mv(`${__dirname}/public${pathPhoto}`, async (err) => {
//         res.send("Imagen Cargada con {exito");
//         });
//         try {
//             const addSkater = await agregaskater(email, nombre, password, anos, esp, pathPhoto);
//     res.json(addSkater);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({msg: "Error al agregar al participante"});
//   }
// });

// app.post("/skaters", async (req, res) => {
//     const { email, nombre, password, anos, esp } = req.body;

//     // Validación de datos
//     if (!email || !nombre || !password || !anos || !esp) {
//         console.log("Debe proporcionar todos los valores correctamente para registrarse.");
//        res.status(401).send(`
//        <script>
//        alert("Debe proporcionar todos los valores correctamente para registrarse.");
//        window.location.href = "/registro";
//        </script>
//        `);
//     }else{

//     // Manejo de la foto
//     const foto = req.files && req.files.foto;
//     if (!foto) {
//         console.log("Debe proporcionar una foto.");
//         res.status(400).send(`
//         <script>
//         alert("Debe proporcionar una foto.");
//         window.location.href = "/registro";
//         </script>
//     `);
//     }
// }   

//     const { name } = foto;
//     const pathPhoto = `/uploads/${name}`;

//     foto.mv(`${__dirname}/public${pathPhoto}`, async (err) => {
//         if (err) {
//             console.error("Error al subir la foto:", err);
//             res.status(500).send(`
//             <script>
//             alert("Error al subir la foto.");
//             window.location.href = "/registro";
//             </script>
//         `);
//         }

//         console.log("Imagen cargada exitosamente.");
//         try {
//             // Agregar el skater a la base de datos
//             const addSkater = await agregaskater(email, nombre, password, anos, esp, pathPhoto);
//             console.log("Skater agregado exitosamente.");
//             return (addSkater);
//         } catch (error) {
//             console.error("Error al agregar el skater:", error);
//             return res.status(500).send(`
//                 <script>
//                 alert("Error al agregar al participante");
//                 window.location.href = '${"/"}';
//                 </script>`)
//         }
//     });
// });

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
                window.location.href = "/registro";
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
    // foto.mv(`${__dirname}/public${pathPhoto}`, async (err) => {
    //     try {
    //         if (err) throw err
    //         skater.foto = pathPhoto
    //         skaters.push(skater);
    //         res.status(201).redirect("/");
    //     } catch (e) {
    //         console.log(e)
    //         res.status(500).send({
    //             error: `Algo salió mal... ${e}`,
    //             code: 500
    //         })
    //     };

    // });

app.put("/skaters", async (req, res) => {
    const {id, nombre,anos_experiencia, especialidad} = req.body;
    console.log("Valor del body: ", id, nombre,anos_experiencia, especialidad);
    try {
        const skaterB = skaters.findIndex((s) => s.id == id);
//        if (skaterB) {
           skaters[skaterB].nombre = nombre;
           skaters[skaterB].anos_experiencia =anos_experiencia;
           skaters[skaterB].especialidad = especialidad;
            res.status(200).send("Datos actualizados con éxito");
        // } else {
        //     res.status(400).send("No existe este Skater");
        // }
        
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});

app.put("/skaters/status/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    console.log("Valor de estado recibido por body: ",estado)
    try {
         const skaterB = skaters.findIndex((s) => s.id == id);

        //if (skaterB !== -1) {
            skaters[skaterB].estado = estado;
            res.status(200).send("Estado Actualizado con éxito");
        // } else {
        //     res.status(400).send("No existe este Skater");
        // }

    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});

app.delete("/skaters/:id", async (req, res) => {
    const { id } = req.params
    try {
        const skaterB = skaters.findIndex((s) => s.id == id);

        if (skaterB !==-1) {
            skaters.splice(skaterB, 1);
            res.status(200).send("Skater Eliminado con éxito");
        } else {
            res.status(400).send("No existe este Skater");
        }

    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});

