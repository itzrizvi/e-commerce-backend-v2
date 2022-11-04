// All Requires
const { Op } = require("sequelize");
const { default: slugify } = require("slugify");


// Payment HELPER
module.exports = {
    // Add Payment Method API
    addPaymentMethod: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { name, description, status } = req;

            // Payment Method Slug
            const slug = slugify(`${name}`, {
                replacement: '-',
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true,
                trim: true
            });

            // Check Existence
            const findPaymentMethod = await db.payment_method.findOne({
                where: {
                    [Op.and]: [{
                        slug,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (findPaymentMethod) return { message: "Already Have This Payment Method!!!!", status: false }

            // Add Payment Method TO DB
            const insertPaymentMethod = await db.payment_method.create({
                name,
                slug,
                description,
                status,
                tenant_id: TENANTID,
                created_by: user.id
            });

            // Return Formation
            if (insertPaymentMethod) {
                return {
                    message: "Payment Method Added Successfully!!!",
                    status: true,
                    tenant_id: TENANTID
                }
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    }
}