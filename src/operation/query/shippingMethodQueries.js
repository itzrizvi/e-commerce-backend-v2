const { getSingleShippingMethodController,
    getShippingMethodListAdminController,
    getShippingMethodListPublicController } = require("../../controllers");


// Shipping Method BASED QUERY
module.exports = {
    // GET SINGLE Shipping METHOD
    getSingleShippingMethod: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getSingleShippingMethodController(args.query, db, user, isAuth, TENANTID);
    },
    // GET Shipping METHOD LIST FOR ADMIN
    getShippingMethodListAdmin: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getShippingMethodListAdminController(db, user, isAuth, TENANTID);
    },
    // GET SHIPPING METHOD LIST PUBLIC
    getShippingMethodListPublic: async (root, args, { db, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return To Controller
        return await getShippingMethodListPublicController(db, TENANTID);
    }
}