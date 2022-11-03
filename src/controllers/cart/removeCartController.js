const { removeCart } = require("../../helpers/cartHelper");
const { singleResponse } = require("../../utils/response");

module.exports = async (req, db, user, isAuth, TENANTID) => {
    // CREATE COUPON
    const data = await removeCart(req, db, user, isAuth, TENANTID);
    return singleResponse(data);
}