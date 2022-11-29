const { getSingleReceivingProductController,
    getReceivingProductListController } = require("../../controllers");


// Tax Class BASED QUERY
module.exports = {
    // GET SINGLE RECEIVING PRODUCT QUERY
    getSingleReceivingProduct: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getSingleReceivingProductController(args.query, db, user, isAuth, TENANTID);
    },
    // GET RECEVING PRODUCT LIST QUERY
    getReceivingProductList: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getReceivingProductListController(db, TENANTID);
    },

}