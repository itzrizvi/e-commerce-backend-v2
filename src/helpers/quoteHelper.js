// All Requires
const { Op } = require("sequelize");


// Quote HELPER
module.exports = {
    // Add To Quote API
    addToQuote: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { user_id, product_id, quantity } = req;

            // Check If User Already Have Quote Data
            const findQuote = await db.quotes.findOne({
                where: {
                    [Op.and]: [{
                        user_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // IF QUOTE FOUND
            if (findQuote) {

            } else {

            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },

}