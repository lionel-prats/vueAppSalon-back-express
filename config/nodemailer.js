import nodemailer from "nodemailer" // v440

export function createTransport(host, port, user, pass) { // v440
    return nodemailer.createTransport({
        host, // "sandbox.smtp.mailtrap.io",
        port, // 2525,
        auth: {
            user, // "f4aac21dea23fd",
            pass, // "0d31185cea38ef"
        }
    });
}