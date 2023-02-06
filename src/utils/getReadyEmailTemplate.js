const { Op } = require("sequelize");
const db = require("../db");
const logger = require("../../logger");


const getReadyEmailTemplate = async (alias, tenant_id) => {

    try {

        //
        if (!db.email_template_list.hasAlias("email_template") &&
            !db.email_template_list.hasAlias("emailteamplate")) {
            await db.email_template_list.hasOne(db.email_template, {
                sourceKey: "email_template_id",
                foreignKey: "id",
                as: "emailteamplate",
            });
        }

        //
        if (!db.email_template.hasAlias("email_header_footer") &&
            !db.email_template.hasAlias("templateHeader")) {
            await db.email_template.hasOne(db.email_header_footer, {
                sourceKey: "header_id",
                foreignKey: "id",
                as: "templateHeader",
            });
        }

        //
        if (!db.email_template.hasAlias("email_header_footer") &&
            !db.email_template.hasAlias("templateFooter")) {
            await db.email_template.hasOne(db.email_header_footer, {
                sourceKey: "footer_id",
                foreignKey: "id",
                as: "templateFooter",
            });
        }

        //
        const gettemplate = await db.email_template_list.findOne({
            include: [
                {
                    model: db.email_template,
                    as: "emailteamplate",
                    include: [
                        { model: db.email_header_footer, as: "templateHeader" },
                        { model: db.email_header_footer, as: "templateFooter" },
                    ],
                },
            ],
            where: {
                [Op.and]: [
                    {
                        slug: alias,
                        tenant_id,
                    },
                ],
            },
        });

        // CONCATE TEMPLATE
        const emailBody = gettemplate.emailteamplate.content;
        const emailHeader = gettemplate.emailteamplate.templateHeader.content;
        const emailFooter = gettemplate.emailteamplate.templateFooter.content;
        const emailTemplate = emailHeader.concat(emailBody).concat(emailFooter);

        return `${emailTemplate}`;

    } catch (error) {
        logger.crit("crit", error, { service: "getReadyEmailTemplate.js" });
        console.log(error);
        throw error;
    }

}


module.exports = {
    getReadyEmailTemplate
};
