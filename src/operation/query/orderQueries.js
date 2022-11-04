const { getSingleOrderStatusController,
    getOrderStatusListController,
    getPublicOrderStatusListController } = require("../../controllers");


// Order BASED QUERY
module.exports = {
    // GET SINGLE ORDER STATUS
    getSingleOrderStatus: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getSingleOrderStatusController(args.query, db, user, isAuth, TENANTID);
    },
    // GET ORDER STATUS LIST
    getOrderStatusList: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getOrderStatusListController(db, TENANTID);
    },
    // GET ORDER STATUS LIST PUBLIC
    getPublicOrderStatusList: async (root, args, { db, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return To Controller
        return await getPublicOrderStatusListController(db, TENANTID);
    },
}