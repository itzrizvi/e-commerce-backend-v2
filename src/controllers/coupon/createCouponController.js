// ALL REQUIRES;
const { createCoupon } = require("../../helpers/couponHelper");
const { createCouponRequest } = require("../../requests/couponRequests");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate Create Coupon Request
    const validate = await createCouponRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // CREATE COUPON
    const data = await createCoupon(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}