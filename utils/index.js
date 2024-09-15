import mongoose from "mongoose" // v400

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

function handleNotFoundError(message, res) {
    const error = new Error(message)
    return res.status(404).json({
        msg: error.message
    })
}

export {
    validateObjectId,
    handleNotFoundError,
}