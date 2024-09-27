import express from "express"
import { register, verifyAccount, login, user } from "../controllers/authController.js"
import authMiddleware from "../middleware/authMiddleware.js" // v466

const router = express.Router()

// rutas de autenticacion y registro de usuarios (v434)
router.post("/register", register) // POST a http://localhost:4000/api/auth/register
router.get("/verify/:token", verifyAccount) // GET a http://localhost:4000/api/auth/verify/:token (v443)
router.post("/login", login) // POST a http://localhost:4000/api/auth/login

// Area Privada - endpoints que requieren recibir un JWT valido en la peticion (v466)
router.get("/user", authMiddleware, user) // GET a http://localhost:4000/api/auth/user (v466)


export default router