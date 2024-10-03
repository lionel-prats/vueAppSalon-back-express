import { createTransport } from "../config/nodemailer.js" // v502

export async function sendEmailNewAppoinment({ date, time }) { // v502
    const transporter = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS,
    )

    // en este bloque se envia el email al admin de la app Vue con una notificacion de cita nueva (v502)
    const info = await transporter.sendMail({
        from: "AppSalon <citas@appsalon.com>",
        to: "admin@appsalon.com",
        subject: "AppSalon - Nueva Cita",
        text: "AppSalon - Nueva Cita 2",
        html: `
            <p>Hola: Admin, tienes una nueva cita</p>
            <p>La cita será el día: ${date} a las ${time} horas.</p>
        `
    })
    // fin bloque

    console.log("Mensaje de notificacion de cita enviado ", info.messageId);
}

export async function sendEmailUpdateAppoinment({ date, time }) { // v504
    const transporter = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS,
    )

    // en este bloque se envia el email al admin de la app Vue con una notificacion de cita editada (v504)
    const info = await transporter.sendMail({
        from: "AppSalon <citas@appsalon.com>",
        to: "admin@appsalon.com",
        subject: "AppSalon - Cita Actualizada",
        text: "AppSalon - Cita Actualizada 2",
        html: `
            <p>Hola: Admin, un usuario ha modificado una cita.</p>
            <p>La cita será el día: ${date} a las ${time} horas.</p>
        `
    })
    // fin bloque

    console.log("Mensaje de notificacion de cita enviado ", info.messageId);
}

export async function sendEmailCancelledAppoinment({ date, time }) { // v505
    const transporter = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS,
    )

    // en este bloque se envia el email al admin de la app Vue con una notificacion de cita editada (v505)
    const info = await transporter.sendMail({
        from: "AppSalon <citas@appsalon.com>",
        to: "admin@appsalon.com",
        subject: "AppSalon - Cita Cancelada",
        text: "AppSalon - Cita Cancelada 2",
        html: `
            <p>Hola: Admin, un usuario ha cancelado una cita.</p>
            <p>La cita estaba programada para: ${date} a las ${time} horas.</p>
        `
    })
    // fin bloque

    console.log("Mensaje de notificacion de cita enviado ", info.messageId);
}