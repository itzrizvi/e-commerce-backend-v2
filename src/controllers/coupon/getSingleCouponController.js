// ALL REQUIRES=
const { getSingleCoupon } = require("../../helpers/couponHelper");
const { getSingleCouponRequest } = require("../../requests/couponRequests");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate GET SINGLE COUPON Request
    const validate = await getSingleCouponRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // SEND TO HELPER
    const data = await getSingleCoupon(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}