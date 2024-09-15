import { services } from "../data/beautyServices.js"
import Services from "../models/Services.js"
import mongoose from "mongoose" // v398
import { validateObjectId, handleNotFoundError } from "../utils/index.js"


const createService = async (req, res) => {
    if(Object.values(req.body).includes("")) {
        const error = new Error("Todos los campos son obligatorios")
        return res.status(400).json({
            msg: error.message
        })
    }
    try {
        const service = new Services(req.body) // instancia del modelo Services (v397)
        await service.save()
        return res.status(200).json({
            msg: "El Servicio se creó correctamente"
        })
    } catch (error) {
        console.log(error);
    }
}

const getServices = (req, res) => {
    res.json(services)
}

const getServiceById = async (req, res) => {
    const { id } = req.params

    // valido si el id recibido por URL es un ObjectId (tipo de ids de los registros o documentos en MongoDB) (v398) (funcionalidad movida a /utils/index.js en v400)
    // si no es valido el id retorno un 400 con el mensaje de error
    if(validateObjectId(id, res)) return
    
    // el id es valido, busco el regsitro o documento en la DB usando el modelo Services 
    const service = await Services.findById(id) // instancia del modelo Services
    
    // si no existe el registro retorno un 404 con el mensaje de error
    if(!service) return handleNotFoundError("El servicio no existe", res) 
    
    // el registro existe, retorno un 200 con la data del registro
    return res.json(service)
}

const updateService = async (req, res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("El id no es válido")
        return res.status(400).json({
            msg: error.message
        })
    }
    
    const service = await Services.findById(id) // instancia del modelo Services
    if(!service) {
        const error = new Error("El servicio no existe")
        return res.status(404).json({
            msg: error.message
        })
    }

    service.name = req.body.name || service.name
    service.price = req.body.price || service.price

    try {
        await service.save()
        return res.json({
            msg: "El servicio se actualizó correctamente"
        })
    } catch (error) {
        console.log(error);
    }
}

const deleteService = async (req, res) => {
    const { id } = req.params
    if(validateObjectId(id, res)) return
    const service = await Services.findById(id) // instancia del modelo Services
    if(!service) return handleNotFoundError("El servicio no existe", res) 
    try {
        await service.deleteOne()
        return res.json({
            msg: "El servicio se ha eliminado correctamente"
        })
    } catch (error) {
        console.log(error);
    }
}

export {
    createService,
    getServices,
    getServiceById,
    updateService,
    deleteService,
}