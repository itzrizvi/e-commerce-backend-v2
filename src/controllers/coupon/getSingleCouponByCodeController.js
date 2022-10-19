// ALL REQUIRES
const { getSingleCouponByCode } = require("../../helpers/couponHelper");
const { getSingleCouponByCodeRequest } = require("../../requests/couponRequests");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate GET SINGLE COUPON BY CODE Request
    const validate = await getSingleCouponByCodeRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // SEND TO HELPER
    const data = await getSingleCouponByCode(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}