// All Requires
const { Op } = require("sequelize");
const { default: slugify } = require("slugify");


// Email Template HELPER
module.exports = {
    // Add Email Template On List API
    addEmailTemplateOnList: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { name } = req;

            // Create Slug
            const slug = slugify(`${name}`, {
                replacement: '-',
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true,
                trim: true
            });

            // Check Existence
            const findEmailTemplateOnList = await db.email_template_list.findOne({
                where: {
                    [Op.and]: [{
                        slug,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (findEmailTemplateOnList) return { message: "Already Have This Email Template on The List!!!!", status: false }

            // Add TO DB
            const insertEmailTemplateOnList = await db.email_template_list.create({
                name,
                slug,
                tenant_id: TENANTID,
                created_by: user.id
            });

            // Return Formation
            if (insertEmailTemplateOnList) {
                return {
                    message: "Email Template Added On List Successfully!!!",
                    status: true,
                    tenant_id: TENANTID
                }
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },

}