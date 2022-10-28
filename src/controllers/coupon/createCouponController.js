// ALL REQUIRES;
const { createCoupon } = require("../../helpers/couponHelper");
const { createCouponRequest } = require("../../requests/couponRequests");
const { checkPermission } = require("../../utils/permissionChecker");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Permission Name of this API
    const permissionName = "coupon";
    // Check Permission
    const checkPermissions = await checkPermission(db, user, TENANTID, permissionName);
    if (!checkPermissions.success) {
        return { message: "You dont have access to this route, please contact support to have you give this route permission!!!", status: false };
    }

    // Validate Create Coupon Request
    const validate = await createCouponRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // CREATE COUPON
    const data = await createCoupon(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}