// All Requires
const { createCouponController, updateCouponController } = require("../../controllers");


// Coupon BASED Mutation
module.exports = {
    // Create Coupon
    createCoupon: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };


        // Return To Controller
        return await createCouponController(args.data, db, user, isAuth, TENANTID);
    },
    // Update Coupon
    updateCoupon: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };


        // Return To Controller
        return await updateCouponController(args.data, db, user, isAuth, TENANTID);
    }
}