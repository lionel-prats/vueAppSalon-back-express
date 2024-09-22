import User from "../models/User.js"
import { sendEmailVerification } from "../emails/authEmailService.js" // v440
// import { validateObjectId, handleNotFoundError } from "../utils/index.js"

// POST a http://localhost:4000/api/auth/register (registrar usuario)
const register = async (req, res) => {

    // valido que no haya campos vacios
    if(Object.values(req.body).includes("")) {
        const error = new Error("Todos los campos son obligatorios")
        return res.status(400).json({ msg: error.message })
    }

    // bloque para validar si el email ya existe en DB, y en ese caso, retornar un mensaje de usuario ya existente (v436)
    const { name, email, password } = req.body
    const userExists = await User.findOne({ email })
    if(userExists){
        const error = new Error("Usuario ya registrado")
        return res.status(400).json({ msg: error.message })
    }

    // bloque para validar que la extension del password sea >= 8
    const MIN_PASSWORD_LENGTH = 8
    if(password.trim().length < MIN_PASSWORD_LENGTH){
        const error = new Error(`El password debe contener al menos ${MIN_PASSWORD_LENGTH} caracteres`)
        return res.status(400).json({ msg: error.message })
    }

    try {
        const user = new User(req.body) // instancia del modelo User (v435)
        const result = await user.save()
        
        // bloque que ejecuta la funcion que envía el mail de confirmacion de cuenta (v442)
        const { name, email, token } = result
        sendEmailVerification({ name, email, token })
        // fin bloque 

        return res.status(200).json(result)
        return res.status(200).json({ msg: "El Usuario se creó correctamente, revisa tu email" })
    
    } catch (error) {
        console.log(error);
    } 
   
}

// GET a http://localhost:4000/api/auth/verify/:token (verificar cuenta de usuario)
const verifyAccount = async (req, res) => {
    
    const { token } = req.params
    const user = await User.findOne({ token })

    // bloque para validar si el token que llega por URL existe en DB (v443)
    if(!user){
        const error = new Error("Huno un error, token no válido")
        return res.status(401).json({ msg: error.message })
    }
    

    // en este punto, el token existe en DB, por lo que se trada de una nueva cuenta pendiente de confirmacion, asi que vonfirmamos la cuenta UPDATEANDO el campo verified como true y el campo token como null (v443)
    try {
        user.verified = true
        user.token = null
        await user.save()
        return res.status(200).json({ msg: "Usuario confirmado correctamente" })
    } catch (error) {
        console.log(error);
    }

}


export {
    register,
    verifyAccount,
}