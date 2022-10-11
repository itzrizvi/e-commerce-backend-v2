const nodemailer = require('nodemailer'); // Node Mailer

exports.verifierEmail = async (data) => {
    // Transport Creator From Nodemailer
    const transport = nodemailer.createTransport({
        service: "Gmail",
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_PORT,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS
        }
    });

    // Message Data to Send Email
    const message = {
        from: process.env.NODEMAILER_FROM_EMAIL + "<" + process.env.NODEMAILER_FROM_EMAIL + ">",
        to: data.email,
        subject: data.subject,
        text: data.message
    }

    // Email Sender
    await transport.sendMail(message, (error, info) => {
        if (error) {
            console.log("NODE MAILER ERROR: ", error)
        } else {
            console.log("Email Sent: ", info.response);
        }
    })
}