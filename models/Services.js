import mongoose from "mongoose" // v392

const servicesSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        // default: "Nombre Servicio",
    },
    price: {
        type: Number,
        required: true,
        trim: true,
    },
})

const Services = mongoose.model("Services", servicesSchema)
export default Services