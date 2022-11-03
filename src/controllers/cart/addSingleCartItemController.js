const { addSingleCart } = require("../../helpers/cartHelper");
const { singleResponse } = require("../../utils/response");

module.exports = async (req, db, user, isAuth, TENANTID) => {
    // CREATE COUPON
    const data = await addSingleCart(req, db, user, isAuth, TENANTID);
    return singleResponse(data);
}