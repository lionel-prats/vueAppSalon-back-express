import User from "../models/User.js"
// import { validateObjectId, handleNotFoundError } from "../utils/index.js"

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
        await user.save()
        return res.status(200).json({ msg: "El Usuario se creó correctamente, revisa tu email" })
    } catch (error) {
        console.log(error);
    } 
   
}

export {
    register,
}