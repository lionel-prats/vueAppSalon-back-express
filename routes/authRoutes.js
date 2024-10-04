import express from "express"
import { register, verifyAccount, login, forgotPassword, user, admin, verifyPasswordResetToken, updatePassword } from "../controllers/authController.js"
import authMiddleware from "../middleware/authMiddleware.js" // v466

const router = express.Router()

// Area Pública - rutas de autenticacion y registro de usuarios (v434)
router.post("/register", register) // POST a http://localhost:4000/api/auth/register
router.get("/verify/:token", verifyAccount) // GET a http://localhost:4000/api/auth/verify/:token (v443)
router.post("/login", login) // POST a http://localhost:4000/api/auth/login
router.post("/forgot-password", forgotPassword) // POST a http://localhost:4000/api/auth/forgot-password (v507)

router.route("/forgot-password/:token") 
    .get(verifyPasswordResetToken) // GET a http://localhost:4000/api/auth/forgot-password/:token (verificar si existe usuario asociado al token recibido por URL para que pueda reestablecer su password) (v510)
    .post(updatePassword) // POST a http://localhost:4000/api/auth/forgot-password/:token (UPDATEAR el campo password del usuario que quiere reestablecer su contraseña) (v510)


// ---------------------------------------------------------------------------------------

// Area Privada - endpoints que requieren recibir un JWT valido en la peticion (v466)
router.get("/user", authMiddleware, user) // GET a http://localhost:4000/api/auth/user (v466)
router.get("/admin", authMiddleware, admin) // GET a http://localhost:4000/api/auth/admin (este endpoint valida si el usuario autenticado es admin) (v514)


export default router

/* 
{
    "email": "fake@correo.com"
}
{
    "email": "correo@correo.com"
}
*/