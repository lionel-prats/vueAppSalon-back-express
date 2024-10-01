// routing para la gestion de citas (turnos) de usuarios (creado en el v473)

import express from "express"
import { createAppoinment, getAppoinmentByDate, getAppoinmentById, updateAppoinment } from "../controllers/appoinmentController.js"
import authMiddleware from "../middleware/authMiddleware.js" // v474

const router = express.Router()

router.route("/")
    .post(authMiddleware, createAppoinment) // POST a http://localhost:4000/api/appoinments (v474)
    .get(authMiddleware, getAppoinmentByDate) // GET a http://localhost:4000/api/appoinments?date=dd/mm/yyyy (v478)
router.route("/:id")
    .get(authMiddleware, getAppoinmentById) // GET a http://localhost:4000/api/appoinments/:id_cita (v491)
    .put(authMiddleware, updateAppoinment) // PUT a http://localhost:4000/api/appoinments/:id_cita (v498)



export default router