// COUPON BASED QUERY
const { getSingleCouponController, getSingleCouponByCodeController } = require("../../controllers");

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
        return await getSingleCouponController(args.query, db, user, isAuth, TENANTID);
    },
    // GET SINGLE COUPON BY CODE
    getSingleCouponByCode: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return To Controller
        return await getSingleCouponByCodeController(args.query, db, user, isAuth, TENANTID);
    }

}