import mongoose from "mongoose" // v388
import colors from "colors" // v391

export const db = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        const url = `${db.connection.host}:${db.connection.port}`
        console.log(colors.cyan("MongoDB se conectó correctamente: ", url));
    
    
    } catch (error) {
        console.log(`Error: ${error.message}`)
        process.exit(1) // si falla la conexion a la DB cortamos la ejecucion de nuestra aplicacion al pasar 1 como argumento (v388)
    }
}