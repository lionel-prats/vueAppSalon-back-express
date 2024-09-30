// routing para la gestion de citas (turnos) de usuarios (creado en el v473)

import express from "express"
import { createAppoinment, getAppoinmentByDate, getAppoinmentById } from "../controllers/appoinmentController.js"
import authMiddleware from "../middleware/authMiddleware.js" // v474

const router = express.Router()

router.route("/")
    .post(authMiddleware, createAppoinment) // POST a http://localhost:4000/api/appoinment (v474)
    .get(authMiddleware, getAppoinmentByDate) // GET a http://localhost:4000/api/appoinment?date=dd/mm/yyyy (v478)
router.route("/:id")
    .get(authMiddleware, getAppoinmentById) // GET a http://localhost:4000/api/appoinment/:id_cita (v491)



export default router