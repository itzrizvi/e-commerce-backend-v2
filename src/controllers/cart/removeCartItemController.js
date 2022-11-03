const { removeCartItem } = require("../../helpers/cartHelper");
const { singleResponse } = require("../../utils/response");

module.exports = async (req, db, user, isAuth, TENANTID) => {
    // CREATE COUPON
    const data = await removeCartItem(req, db, user, isAuth, TENANTID);
    return singleResponse(data);
}