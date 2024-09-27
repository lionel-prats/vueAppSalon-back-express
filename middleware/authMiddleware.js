// la creacion y configuracion de este middleware empieza en el v466 y sigue en los videos subsiguientes

import jwt from "jsonwebtoken" // v468
import User from "../models/User.js" // v469

const authMiddleware = async(req, res, next) => {
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        // con req.headers.authorization accedemos al tipo de token y token que llegó en el header de la request (v467)

        try {
            const token = req.headers.authorization.split(" ")[1] // obtenemos el token (v468)
    
            // decodifico el token para poder realizar todas las validaciones necesarias (v468)
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            
            // intento encontar a un usuario en DB cuyo id coincida con el id que nos llegó en el token (nos llegó un id de usuario porque nosostros lo incluimos en el token de autenticacion que generamos desde /utils/index.js->generateJWT() y que retornamos desde el endpoint para autenticar a un usario) (v469)
            // si lo encuentro, con lo funcion select() de mongoose filtro los campos que NO quiero obtener del registro encontrado (en este caso el password, verified, token y __v), porque no quiero incluirlos en los datos de usuario que voy a agregar al objeto request (v469)
            // cargo la data del usuario encontrado a la request, para poder acceder a esta data desde el controlador (v469)
            req.user = await User.findById(decoded.id).select("-password -verified -token -__v")
            next()            
        } catch {
            const error = new Error("Token no válido")
            return res.status(403).json({ msg: error.message })
        }    
    } else {
        const error = new Error("Token no válido o inexistente")
        return res.status(403).json({ msg: error.message })
    }
}

export default authMiddleware