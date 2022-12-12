// All Requires
const { Op } = require("sequelize");
var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
const db = require("../db")
var fs = require('fs');

const Mail = async (mail_address, subject, data = {}, alias, tenant_id) => {

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
    if (!db.email_template_list.hasAlias('email_template') && !db.email_template_list.hasAlias('templatelist')) {
        await db.email_template_list.hasOne(db.email_template, {
            sourceKey: 'email_template_id',
            foreignKey: 'id',
            as: 'templatelist'
        });
    }
    //
    const gettemplate = await db.email_template_list.findOne({
        where: {
            [Op.and]: [{
                slug: alias,
                tenant_id: tenant_id
            }]
        }
    });

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