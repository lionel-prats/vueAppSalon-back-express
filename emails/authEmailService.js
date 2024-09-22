import { createTransport } from "../config/nodemailer.js" // v440

export async function sendEmailVerification({ name, email, token }) { // v440
    const transporter = createTransport(
        "sandbox.smtp.mailtrap.io", // host (credencial provista por mailtrap)
        2525,                       // port (credencial provista por mailtrap)
        "f4aac21dea23fd",           // user (credencial provista por mailtrap)
        "0d31185cea38ef",           // pass (credencial provista por mailtrap)
    )

    // en este bloque se envia el email de verificacion de cuenta (v441)
    const info = await transporter.sendMail({
        from: "Salón de Belleza Mengueche",
        to: email,
        subject: "Felicitaciones. Has creado una cuenta en Salón de Belleza Mengueche!",
        text: "Ya has dado el primer paso. Solo deber confirmar tu cuenta siguiendo los siguientes pasos",
        html: `
            <p>Hola ${name}, confirma tu cuenta en Salón de Belleza Mengueche</p>
            <p>Tu cuenta está casi lista, solo debes confirmarla en el siguiente enlace</p>
            <a href="http://localhost:4000/api/auth/verify/${token}">Confirmar cuenta</a>
            <p>Si tu no creaste esta cuenta puedes ignorar este mensaje</p>
        `
    })
    // fin bloque

    console.log("Mensaje enviado ", info.messageId);
}