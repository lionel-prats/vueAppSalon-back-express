import { createTransport } from "../config/nodemailer.js" // v440

export async function sendEmailVerification({ name, email, token }) { // v440
    const transporter = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS,
    )

    // en este bloque se envia el email de verificacion de cuenta (v441)
    const info = await transporter.sendMail({
        from: "AppSalon <cuentas@appsalon.com>",
        to: email,
        subject: "AppSalon - Confirma tu cuenta",
        text: "AppSalon - Confirma tu cuenta 2",
        html: `
            <p>Hola ${name}, confirma tu cuenta en Salón de Belleza Mengueche</p>
            <p>Tu cuenta está casi lista, solo debes confirmarla en el siguiente enlace</p>
            <a href="${process.env.FRONTEND_URL}/auth/confirmar-cuenta/${token}">Confirmar cuenta</a>
            <p>Si tu no creaste esta cuenta puedes ignorar este mensaje</p>
        `
    })
    // fin bloque

    console.log("Mensaje enviado ", info.messageId);
}