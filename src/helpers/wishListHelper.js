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
            const { product_id } = req;

            // Check If the wish list is already there
            const checkExistWishList = await db.wishlist.findOne({
                where: {
                    [Op.and]: [{
                        user_id: user.id,
                        product_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (checkExistWishList) return { message: "You Already Have This Product on Your WishList!!!", status: false }

            // Insert Wish List
            const insertToWishlist = await db.wishlist.create({
                user_id: user.id,
                product_id,
                tenant_id: TENANTID,
                created_by: user.id
            });

            if (!insertToWishlist) return { message: "Wish List Couldn't Be Created!!!", status: false }

            return {
                message: "Successfully Added The Product To Your Wishlist!!!",
                status: true,
                tenant_id: TENANTID
            }



        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
}