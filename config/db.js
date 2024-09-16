import mongoose from "mongoose" // v388
import colors from "colors" // v391

export const db = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        const url = `${db.connection.host}:${db.connection.port}`
        console.log(colors.cyan("MongoDB se conectó correctamente: ", url));
    } catch (error) {
        console.log(`Error: ${error.message}`)
        
        // si falla la conexion a la DB cortamos la ejecucion de nuestra aplicacion al pasar 1 como argumento (v388)
        // con process.exit() finalizamos el proceso (es decir, la ejecucion del script) 
        // el argumento 0 es para un proceso que finalizó correctamente (valor por default, podríamos omitirlo)
        // el argumento 1 es para un proceso que finalizó por algun error
        process.exit(1) 
    }
}