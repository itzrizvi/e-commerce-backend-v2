const { getSinglePaymentMethodController,
    getPaymentMethodListAdminController,
    getPaymentMethodListPublicController } = require("../../controllers");


// Payment BASED QUERY
module.exports = {
    // GET SINGLE PAYMENT METHOD
    getSinglePaymentMethod: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getSinglePaymentMethodController(args.query, db, user, isAuth, TENANTID);
    },
    // GET PAYMENT METHOD LIST FOR ADMIN
    getPaymentMethodListAdmin: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getPaymentMethodListAdminController(db, TENANTID);
    },
    // GET PAYMENT METHOD LIST PUBLIC
    getPaymentMethodListPublic: async (root, args, { db, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return To Controller
        return await getPaymentMethodListPublicController(db, TENANTID);
    },
}