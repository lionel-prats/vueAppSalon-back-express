// controlador para acceder a las citas de un usuario (creado en el v484)

import Appoinment from "../models/Appoinment.js" // v485

const getUserAppoinments = async (req, res) => { // v484
    const user = req.params.user

    const role = "user" // demo de como habilitar el acceso al recurso para un administrador no propietario de las citas (v485)

    if(user !== req.user._id.toString() && role !== "admin") {
        const error = new Error("Acceso Denegado")
        return res.status(400).json({ msg: error.message })
    }

    try {
        
        // SELECT 
        // * FROM appoinmentes 
        // WHERE user = "66f219501fd96e1250825965" 
        // AND date >= NOW()
        const appoinments = await Appoinment.find({ // v485
            user,
            date: {
                $gte: new Date()
            } 
        })
        .populate("services") // agrego a la respuesta el detalle de cada uno de los servicios de una cita
        .sort({ date: "asc" }) // ordeno la respuesta por el campo date desde la la cita con fecha mas antigua a la cita con fecha mas reciente (v488)
        
        return res.status(200).json(appoinments)
    
    } catch (error) {
        console.log(error);
    }
}

export {
    getUserAppoinments,
}