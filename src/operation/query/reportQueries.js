const { getOrderListReportController,
    getSingleOrderReportController } = require("../../controllers");


// Report BASED QUERY
module.exports = {
    // GET ORDER LIST REPORT QUERIES
    getOrderListReport: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getOrderListReportController(db, user, isAuth, TENANTID);
    },
    // GET SINGLE ORDER REPORT QUERIES
    getSingleOrderReport: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getSingleOrderReportController(args.query, db, user, isAuth, TENANTID);
    },
}