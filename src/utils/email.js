// All Requires
const { Op } = require("sequelize");
var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
const db = require("../db")
var fs = require('fs');
const logger = require("../../logger");

const Mail = async (mail_address, subject, data = {}, alias, tenant_id) => {

    try {


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
        if (!db.email_template_list.hasAlias('email_template') && !db.email_template_list.hasAlias('emailteamplate')) {
            await db.email_template_list.hasOne(db.email_template, {
                sourceKey: 'email_template_id',
                foreignKey: 'id',
                as: 'emailteamplate'
            });
        }

        // 
        if (!db.email_template.hasAlias('email_header_footer') && !db.email_template.hasAlias('templateHeader')) {
            await db.email_template.hasOne(db.email_header_footer, {
                sourceKey: 'header_id',
                foreignKey: 'id',
                as: 'templateHeader'
            });
        }

        // 
        if (!db.email_template.hasAlias('email_header_footer') && !db.email_template.hasAlias('templateFooter')) {
            await db.email_template.hasOne(db.email_header_footer, {
                sourceKey: 'footer_id',
                foreignKey: 'id',
                as: 'templateFooter'
            });
        }

        //
        const gettemplate = await db.email_template_list.findOne({
            include: [
                {
                    model: db.email_template, as: "emailteamplate",
                    include: [
                        { model: db.email_header_footer, as: "templateHeader" },
                        { model: db.email_header_footer, as: "templateFooter" },
                    ]
                }
            ],
            where: {
                [Op.and]: [{
                    slug: alias,
                    tenant_id: tenant_id
                }]
            }
        });

        // CONCATE TEMPLATE
        const emailBody = gettemplate.emailteamplate.content;
        const emailHeader = gettemplate.emailteamplate.templateHeader.content;
        const emailFooter = gettemplate.emailteamplate.templateFooter.content;
        const emailTemplate = emailHeader.concat(emailBody).concat(emailFooter);


        var template = handlebars.compile(emailTemplate);
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

    } catch (error) {
        logger.crit("crit", error, { service: 'email.js' });
        console.log(error)
        if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
    }

}

module.exports = {
    Mail
}