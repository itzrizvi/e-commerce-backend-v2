var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
const db = require("../db")
var fs = require('fs');

const Mail = async (mail_address, subject, data = {}, alias) => {

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

    // 
    // const gettemplate = await db.

    var template = handlebars.compile(html);
    var htmlToSend = template(data);
    var mailOptions = {
        from: process.env.MAIL_ADDRESS,
        to: mail_address,
        subject: subject,
        html: htmlToSend
    };

    await transport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
        }
    });

}

module.exports = {
    Mail
}