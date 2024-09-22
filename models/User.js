// Modelo para la gestion de usuarios de la aplicacion. Creado a partir del v433

import mongoose from "mongoose"
import bcrypt from "bcrypt" // libreria para hashear strings (v438)
import { uniqueId } from "../utils/index.js"

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    token: { // campo con el token para verificacion de una nueva cuenta (v433)
        type: String,
        default: () => uniqueId() // seteamos el valor predeterminado del campo al momento de crearse un nuevo registro en la tabla users, haciendo uso del helper uniqueID() creado en el video actual (v433) 
    },
    verified: { // campo que indicará si el usuario ya verifico su cuenta (v433)
        type: Boolean,
        default: () => false // seteamos el valor predeterminado del campo al momento de crearse un nuevo registro en la tabla users
    },
    admin: { // campo que indicará si el usuario es administrador de la aplicacion (v433)
        type: Boolean,
        default: () => false // seteamos el valor predeterminado del campo al momento de crearse un nuevo registro en la tabla users
    },
})

// bloque para hashear el password antes del INSERT en users, cuando se hace un request al endpoint para registrar un nuevo usuario (POST a http://localhost:4000/api/auth/register) (v438)
// aca usamos el hook "pre" de mongoose para indicar que antes de ejecutar el metodo save() en controllers\authController.js (que hará el INSERT en la tabla users de la DB), queremos que se ejecute este codigo, donde hasheamos el password enviado por el usuario para que este dato se grabe hasheado (v438)
userSchema.pre("save", async function (next) {

    // a la hora de confirmar la cuenta, este hook "pre" tambien se va a ejecutar, entonces agregamos este if para que el hasheo del password se dé solo en la ejecucion del endpoint para registrar un nuevo usuario (POST a http://localhost:4000/api/auth/register) (v438)
    if(!this.isModified("password")) {
        next()
    }
    
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// creo el custom method checkPassword para verificar si el password pasado en el body de una request al endpoint de login de usuario (POST a http://localhost:4000/api/auth/login) coincide con el password registrado en DB para un usuario (v445) 
userSchema.methods.checkPassword = async function(inputPassword) {
    return await bcrypt.compare(inputPassword, this.password)
}

const User = mongoose.model("User", userSchema)
export default User