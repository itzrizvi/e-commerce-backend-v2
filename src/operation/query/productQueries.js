// All Requires
const { getSingleProductController, getProductListController } = require("../../controllers")


module.exports = {
    // GET Single Product Details
    getSingleProduct: async (root, args, { db, TENANTID }, info) => {
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false } // Return if No TENANT ID
        // Return to Controller
        return await getSingleProductController(args.query, db, TENANTID);
    },
    // GET Product List 
    getProductList: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false } // Return if No TENANT ID
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getProductListController(db, TENANTID);
    }
}