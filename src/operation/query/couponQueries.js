// COUPON BASED QUERY
const { } = require("../../controllers");

// COUPON QUERIES
module.exports = {
    // GET SINGLE COUPON
    getSingleCoupon: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        // return await getSingleAttributeController(args.query, db, user, isAuth, TENANTID);
    },

}