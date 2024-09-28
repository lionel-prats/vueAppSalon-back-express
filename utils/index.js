import mongoose from "mongoose" // v400
import jwt from "jsonwebtoken"


function validateObjectId(id, res) {
    // valido si el id recibido por URL es un ObjectId (tipo de ids de los registros o documentos en MongoDB) (v398)
    // tipos de id validos en MongoDB -> 66e747702d1b16da56eef509
    // si no es valido el id retorno un 400 con el mensaje de error
    if(!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("El id no es válido")
        return res.status(400).json({
            msg: error.message
        })
    }
}

/*
    - funcion para manejar la respuesta de un endpoint en caso de buscar un registro en DB y no encontrarlo
    - forma de ejecutar esta utilidad desde un controlador vvv 
        if(!service) return handleNotFoundError("El servicio no existe", res) 
*/
function handleNotFoundError(message, res) {
    const error = new Error(message)
    return res.status(404).json({
        msg: error.message
    })
}

// helper para generar un id unico (v433)
const uniqueId = () => Date.now().toString(32) + Math.random().toString(32).substring(2)

// helper para generar un JSON Web Token (v462)
const generateJWT = (id) => {
    const token = jwt.sign(
        { id },                // signature (firma) (objeto con el id del usuario)
        process.env.JWT_SECRET, // private key (llave privada definida en el .env)
        // { expiresIn: "30d" },   // tiempo de expiracion del token (30 dias)
        { expiresIn: "12h" },   // tiempo de expiracion del token (12 horas)
    )
    return token
}


export {
    validateObjectId,
    handleNotFoundError,
    uniqueId,
    generateJWT,
}