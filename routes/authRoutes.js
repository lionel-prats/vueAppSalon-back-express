import express from "express"
import { register } from "../controllers/authController.js"

const router = express.Router()

// rutas de autenticacion y registro de usuarios (v434)
router.post("/register", register) // POST a http://localhost:4000/api/auth/register

export default router