// All Requires
const { Op } = require("sequelize");
const { default: slugify } = require("slugify");


// Wish List HELPER
module.exports = {
    // Add Wish List API
    addWishList: async (req, db, user, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            console.log(req)


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
}