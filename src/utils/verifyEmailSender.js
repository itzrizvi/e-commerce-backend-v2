const nodemailer = require('nodemailer');

exports.verifierEmail = async (data) => {

    const transport = nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_PORT,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS
        }
    });

    const message = {
        from: "Prime Server Parts",
        to: data.email,
        subject: data.subject,
        text: data.message
    }

    await transport.sendMail(message, (error, info) => {
        if (error) {
            console.log("NODE MAILER ERROR: ", error)
        } else {
            console.log("Email Sent: ", info.response);
        }
    })
}