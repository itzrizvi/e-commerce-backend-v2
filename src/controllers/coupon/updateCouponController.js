// ALL REQUIRES;
const { updateCoupon } = require("../../helpers/couponHelper");
const { updateCouponRequest } = require("../../requests/couponRequests");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate Update COUPON Request
    const validate = await updateCouponRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // UPDATE ATTR 
    const data = await updateCoupon(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}