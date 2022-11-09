// ALL REQUIRES=
const { getSingleCoupon } = require("../../helpers/couponHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // SEND TO HELPER
    const data = await getSingleCoupon(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}