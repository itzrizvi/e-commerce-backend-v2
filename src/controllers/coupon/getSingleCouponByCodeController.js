// ALL REQUIRES
const { getSingleCouponByCode } = require("../../helpers/couponHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // SEND TO HELPER
    const data = await getSingleCouponByCode(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}