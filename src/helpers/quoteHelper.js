// All Requires
const { Op } = require("sequelize");


// Quote HELPER
module.exports = {
    // Add To Quote API
    addToQuote: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {
            console.log(req)
            // Data From Request
            const { } = req;


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },

}