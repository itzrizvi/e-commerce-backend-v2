const { getDashboardAnalyticsController } = require("../../controllers");


// Dasboard BASED QUERY
module.exports = {
    // Dasboard Analytics QUERIES
    getDashboardAnalytics: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getDashboardAnalyticsController(db, user, isAuth, TENANTID);
    }

}