const { getPurchaseOrderListController,
    getSinglePurchaseOrderController } = require("../../controllers");


// PO BASED QUERY
module.exports = {
    // PO LIST QUERIES
    getPurchaseOrderList: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getPurchaseOrderListController(db, user, isAuth, TENANTID);
    },
    // SINGLE PO QUERIY
    getSinglePurchaseOrder: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getSinglePurchaseOrderController(args.query, db, user, isAuth, TENANTID);
    },

}