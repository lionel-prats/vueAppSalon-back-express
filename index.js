// const express = require("express") // CommonJS (v384)
import express from "express" // ESM (b384)
import dotenv from "dotenv" // (dependencia para acceder a las variables de entorno del .env) v389
import colors from "colors" // v391
import cors from "cors" // v417
import { db } from "./config/db.js"
import servicesRoutes from "./routes/servicesRoutes.js"


// cargo las variobles de entorno (es como que este metodo de dotenv escanea las variables de entorno definidas en el .env) (v389)
dotenv.config()

// configurar la app (v382)
const app = express()

// habilito que mi app pueda leer la data que llegue en el body de peticiones POST, PUT, etc (v396)
app.use(express.json())

// conecto mi app al Cluster de MongoDB (v388)
db()

// Configurar CORS (v417)
const whitelist =  [process.env.FRONTEND_URL] // lista blanca (dominios con acceso permitido a mis endpoints) (v417)
if(process.argv[2] === "--postman") whitelist.push(undefined) // habilito poder seguir usando Postman y Thunder Client en desarrollo, no en produccion, asi que no hay peligro de que mi API quede expuesta (v417)
const corsOptions = {
    // origin -> nos da el dominio desde donde llega una peticion a cualquiera de mis endpoints
    origin: function(origin, callback) {
        if(whitelist.includes(origin)) {
            // permitir la conexion (v417)
            callback(null, true)
        } else {
            // NO permitir la conexion (v417)
            callback(new Error("Error de CORS"))
        }
        // console.log(origin);
    }
}
app.use(cors(corsOptions))
// fin configurar CORS

app.use("/api/services", servicesRoutes)
// definir una ruta (v382)
/* 
app.get("/", (req, res) => {
    const products = [
        {
            id: 1,
            name: "pantuflas",
            price: 6000,
        },
        {
            id: 2,
            name: "boxer",
            price: 8000,
        },
    ]
    // res.send(product)
    res.json(products)
}) 
*/

// definir puerto -> aca le asigno a PORT el valor de la variable de entorno PORT, y si esta no existe, le asigno el valor 4000 (v382)
const PORT = process.env.PORT || 4000

// arrancar la app (v382)
app.listen(PORT, () => {
    console.log(colors.blue("Server corriendo en el puerto:", colors.bold.blue(PORT)));
})