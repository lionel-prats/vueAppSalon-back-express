// modelo para la gestion de citas (turnos) de usuarios (creado en el v473)

import mongoose from "mongoose"

const appoinmentSchema = mongoose.Schema({
    
    services: [ // defino que el campo services va a ser un arreglo de objetos (v473)

        { // hacemos una especie de join con el modelo Services (v473)
            type: mongoose.Schema.Types.ObjectId,
            ref: "Services"
        }
    
    ],
    
    date: {
        type: Date,
    },
    
    time: {
        type: String,
    },
    
    totalAmount: {
        type: Number,
    }, 
    
    user: { // hacemos una especie de join con el modelo User (v473)
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

})

const Appoinment = mongoose.model("Appoinment", appoinmentSchema)
export default Appoinment
