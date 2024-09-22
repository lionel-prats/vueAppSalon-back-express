import express from "express"
import { register, verifyAccount, login } from "../controllers/authController.js"

const router = express.Router()

// rutas de autenticacion y registro de usuarios (v434)
router.post("/register", register) // POST a http://localhost:4000/api/auth/register
router.get("/verify/:token", verifyAccount) // GET a http://localhost:4000/api/auth/verify/:token (v443)
router.post("/login", login) // POST a http://localhost:4000/api/auth/login


export default router