// All Requires
const { addWishListController } = require("../../controllers");


// Wish List Mutation Start
module.exports = {
    // Add Wish List Mutation
    addWishList: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };

        // Send to Controller
        return await addWishListController(args.data, db, user, TENANTID);
    },

}
