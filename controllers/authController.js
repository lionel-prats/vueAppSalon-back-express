import User from "../models/User.js"
import { sendEmailVerification, sendEmailPasswordReset } from "../emails/authEmailService.js" // v440|v509
import { generateJWT, uniqueId } from "../utils/index.js" // v507

// Area Pública - rutas de autenticacion y registro de usuarios

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
        const error = new Error("Hubo un error, token no válido")
        return res.status(401).json({ msg: error.message })
    }
    
    // en este punto, el token existe en DB, por lo que se trata de una nueva cuenta pendiente de confirmacion, asi que confirmamos la cuenta UPDATEANDO el campo verified como true y el campo token como null (v443)
    try {
        user.verified = true
        user.token = ""
        await user.save()
        return res.status(200).json({ msg: "Usuario confirmado correctamente" })
    } catch (error) {
        console.log(error);
    }

}

// POST a http://localhost:4000/api/auth/login (autenticar usuario) (v444)
const login = async (req, res) => {

    // bloque para validar que no haya campos vacios en el body de la request
    if(Object.values(req.body).includes("")) {
        const error = new Error("Todos los campos son obligatorios")
        return res.status(400).json({ msg: error.message })
    }

    const { email, password } = req.body
    const user = await User.findOne({ email })

    // bloque para validar si el usuario existe en DB (v445)
    if(!user){
        const error = new Error("El usuario no existe")
        return res.status(401).json({ msg: error.message })
    }

    // el email existe en DB, bloque para validar si la cuenta esta confirmada (v445)
    if(!user.verified){
        const error = new Error("Tu cuenta no ha sido confirmada aún")
        return res.status(401).json({ msg: error.message })
    }
    
    // el email existe en DB y la cuenta esta confirmada, bloque para comparar el password que llegó en el body del request con el password hasheado en DB para el registro hallado, y verificar si coinciden (v445)
    // para esta comprobacion, ejecutamos el custom method checkPassword, definido en este mismo video en el modelo User (\models\User.js) (v445)
    if(!await user.checkPassword(password)){
        const error = new Error("El password es incorrecto")
        return res.status(401).json({ msg: error.message })
    } 

    const token = generateJWT(user._id) // v462
    return res.status(200).json({ token }) // v462
}

// POST a http://localhost:4000/api/auth/forgot-password (v507)
const forgotPassword = async (req, res) => {
    // valido que no haya campos vacios
    if(Object.values(req.body).includes("")) {
        const error = new Error("Todos los campos son obligatorios")
        return res.status(400).json({ msg: error.message })
    }

    // verifico si existe el usuario (v507)
    const { email } = req.body

    const user = await User.findOne({ email })
    if(!user){
        const error = new Error("El usuario no existe")
        return res.status(404).json({ msg: error.message })
    }

    try {
        user.token = uniqueId()
        const result = await user.save()

        // envío al usuario el email para recuperar password (v509)
        const { name, email, token } = result
        sendEmailPasswordReset({ name, email, token })
       
        return res.status(200).json({ msg: "Hemos enviado un email con las instrucciones" })
    
    } catch (error) {
        console.log(error);
    }
}

// GET a http://localhost:4000/api/auth/forgot-password/:token (verificar si existe usuario asociado al token recibido por URL para que pueda reestablecer su password) (v510)
const verifyPasswordResetToken = async (req, res) => {   
    const { token } = req.params
    const isValidToken = await User.findOne({ token })
    if(!isValidToken){
        const error = new Error("Hubo un error, token no válido")
        return res.status(400).json({ msg: error.message })
    }
    return res.status(200).json({ msg: "Token válido"})
}

// POST a http://localhost:4000/api/auth/forgot-password/:token (crea un nuevo password para un usuario, UPDATE user.password = req.body.password, user.token = "") (v512)
const updatePassword = async (req, res) => {

    const { token } = req.params
    const user = await User.findOne({ token })
    if(!user){
        const error = new Error("Hubo un error, token no válido")
        return res.status(400).json({ msg: error.message })
    }

    const { password } = req.body

    try {
        
        user.token = ""
        user.password = password

        await user.save() // UPDATE user SET ... WHERE token = token 
        
        res.status(200).json({
            msg: "Password modificado correctamente"
        })
    
    } catch (error) {
        console.log(error);
    }
}


// ------------------------------------------------------------------------------------

// Area Privada - endpoints que requieren recibir un JWT valido en la peticion

// GET a http://localhost:4000/api/auth/user (autenticar usuario) (v466)
const user = async (req, res) => {
    // cuando se ejecute este controlador, que es el de un endpoint protegido, significa que ya validamos en el middleware que antepusimmos en la ruta definida en authRoutes.js que el header de la request incluia un token valido (v469)  

    // obtenemos de la DB la data del usuario que hizo la peticion, accediendo a la clave user del objeto request, cargada en el middleware \middleware\authMiddleware.js->authMiddleware() antes del next() (v469)
    // esta data será una suerte de sesion de usuario (v469)
    const { user } = req

    return res.status(200).json(user)
}

// GET a http://localhost:4000/api/auth/admin (este endpoint valida tanto que el usuario este autenticado como que el usario sea admin) (v514)
const admin = async (req, res) => {
    const { user } = req
    if(!user.admin) {
        const error = new Error("Acción no válida")
        return res.status(403).json({ msg: error.message })
    }
    return res.status(200).json(user)
}


export {
    register,
    verifyAccount,
    login,
    forgotPassword,
    verifyPasswordResetToken,
    updatePassword,
    user,
    admin,
}