// controlador para la gestion de citas (turnos) de usuarios (creado en el v473)

import Appoinment from "../models/Appoinment.js"
import { parse, formatISO, startOfDay, endOfDay, isValid } from "date-fns" // funciones de la libreria date-fns, importada en v476 (v478)
import { validateObjectId, handleNotFoundError } from "../utils/index.js" // v492

const createAppoinment = async (req, res) => { // v474
    const appoinment = req.body
    appoinment.user = req.user._id.toString()
    try {
        const newAppoinment = new Appoinment(appoinment) // instancia del modelo Appoinment (v475)
        await newAppoinment.save()
        const msg = "Tu Reservación se realizó Correctamente"
        return res.status(200).json({ msg })
    } catch (error) {
        console.log(error);
    }
}

const getAppoinmentByDate = async (req, res) => { // v478
    const { date } = req.query // obtenemos la fecha "dd/mm/yyyy" de la URL

    // empezamos a formatearla con una de las funciones de date-fns
    const newDate = parse(date, "dd/MM/yyyy", new Date())
    
    // si la fecha en el queryString de la request no tiene el formato que esperamos, retonamos un error 400 (v479)
    if(!isValid(newDate)) { 
        const error = new Error("Fecha no válida")
        return res.status(400).json({ msg: error.message })
    }

    // bloque para buscar y retornar los horarios de las citas encontradas en la tabla appoinments segun la fecha recibida por queryString vvv
    
    // terminamos de formatear la fecha recibida a ISO, para que sea compatible con las fechas almacenadas en MongoDB
    const isoDate = formatISO(newDate) 

    // usamos las funciones startOfDay() y endOfDay() de date-fns para buscar todos los registros de la fecha recibida por queryString, sin importar la hora del dia en el campo en la DB 
    // de esta forma evitamos un conflicto por la incompatibilidad entre la fecha casteada a ISO con formatISO() en la constante isoDate, y el formato en como estan almacenadas las fechas en los registros de appoinments en la DB, ya que pese a que ambos formatos son ISO, hay una leve diferencia entre uno y otro dato
    // En este video Valdez lo explica con una demo, revisar el video si es necesario (v479)
    const appoinments = await Appoinment.find({ date: {
        $gte: startOfDay(new Date(isoDate)), // desde
        $lte: endOfDay(new Date(isoDate)), // hasta
    }}).select("time") 
    return res.json(appoinments)
}

const getAppoinmentById = async (req, res) => { // v491

    const { id } = req.params // obtengo el id de cita que vino en la URL
    
    // valido que el id de cita que vino en la URL sea un id valido en Mongo DB, caso contrario corto la ejecucion arrojando un error 400 (v492)
    if(validateObjectId(id, res)) return


    // en la DB, busco la cita por el id que vino en la URL (v492)
    const appoinment = await Appoinment.findById(id) 

    // si no existe la  cita retorno un 404 con el mensaje de error (v492)
    if(!appoinment) return handleNotFoundError("La cita no existe", res) 


    // retorno un 200 con la data de la cita (v492)
    return res.json(appoinment)
}

export {
    createAppoinment,
    getAppoinmentByDate,
    getAppoinmentById,
}