import { db } from "../config/db.js" // v404
import dotenv from "dotenv" // v404
import colors from "colors"
import Services from "../models/Services.js"
import { services } from "./beautyServices.js"

// cargo las variobles de entorno (es como que este metodo de dotenv escanea las variables de entorno definidas en el .env) (v404)
dotenv.config()

// conecto nuestro seeder al Cluster de MongoDB (v404)
// con el await hago que se detenga la ejecucion del resto del codigo de este script hasta que se resuelva esta linea (v404)
await db() 

async function seedDB() {
    try {
        
        await Services.insertMany(services) // INSERT masivo en la DB

        console.log(colors.green.bold("El INSERT masivo se realió correctamente"));
        
        // con process.exit() finalizo el proceso (es decir, la ejecucion del script) luego del INSERT masivo (v404)
        // el argumento 0 es para un proceso que finalizó correctamente (valor por default, podríamos omitirlo) (v404)
        process.exit(0)
        
    } catch (error) {
        console.log(error);
        process.exit(1) // v404
    }
}
async function clearDB() {
    try {
        await Services.deleteMany() // v405
        console.log(colors.red.bold("Se ha vaciado la tabla services correctamente"));
        process.exit(0)
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

// argv = argument vector (v403)
if(process.argv[2] === "--import") {
    seedDB()
} else {
    clearDB()
}