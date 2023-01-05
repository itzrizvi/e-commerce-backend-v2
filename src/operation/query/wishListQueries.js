const { getWishListController } = require("../../controllers");


// WISH LIST BASED QUERY
module.exports = {
    // GET WISH LIST QUERY
    getWishList: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getWishListController(db, user, TENANTID);
    },
}