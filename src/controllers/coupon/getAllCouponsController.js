// All Requires
const { getAllCoupons } = require("../../helpers/couponHelper");
const { singleResponse } = require("../../utils/response");


// GET ATTR CONTROLLER
module.exports = async (db, user, isAuth, TENANTID) => {
    const data = await getAllCoupons(db, user, isAuth, TENANTID);

    return singleResponse(data);
}