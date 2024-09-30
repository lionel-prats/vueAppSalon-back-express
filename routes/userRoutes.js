// routing a las citas de un usuario (creado en el v484)

import express from "express"
import { getUserAppoinments } from "../controllers/userController.js"
import authMiddleware from "../middleware/authMiddleware.js" // v484

const router = express.Router()

router.route("/:user/appoinments")
    .get(authMiddleware, getUserAppoinments) // GET a http://localhost:4000/api/users/:id_user/appoinments (v484)

export default router