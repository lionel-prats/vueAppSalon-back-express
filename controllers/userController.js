// controlador para acceder a las citas de un usuario (creado en el v484)

import Appoinment from "../models/Appoinment.js" // v485

// GET a http://localhost:4000/api/users/:id_user/appoinments
const getUserAppoinments = async (req, res) => { // v484
    const user = req.params.user

    const role = "user" // demo de como habilitar el acceso al recurso para un administrador no propietario de las citas (v485)

    // bloque para permitir el acceso al recurso solo si el usuario esta autenticado (token en el header) y es el propietario de las citas (si el usuario autenticado es admin tambien tendra acceso al recurso, pero es una demo fake) (v486)
    if(user !== req.user._id.toString() && role !== "admin") {
        const error = new Error("Acceso Denegado")
        return res.status(400).json({ msg: error.message })
    }

    try {
        // armo la query con el filtro por user._id condicional dependiento de si el usuario autenticado es admin o no (v519)
        const query = req.user.admin ? { date: { $gte: new Date() } } : { user, date: { $gte: new Date() } } 

        // SELECT 
        // * FROM appoinmentes 
        // WHERE date >= NOW()
        // *** AND user._id = "66f219501fd96e1250825965" -- opcional, dependiendo de si el usuario autenticado es admin o no 
        const appoinments = await Appoinment
            .find(query)
            .populate("services") // agrego a la respuesta el detalle de cada uno de los servicios de una cita
            .populate({ path: "user", select: "name email" }) // enriquezco la respuesta con el name e email de owner de la cita (v521)
            .sort({ date: "asc" }) // ordeno la respuesta por el campo date desde la la cita con fecha mas antigua a la cita con fecha mas reciente (v488)
        
        return res.status(200).json(appoinments)
    
    } catch (error) {
        console.log(error);
    }
}

export {
    getUserAppoinments,
}