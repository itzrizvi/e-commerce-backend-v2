const { getSingleCart } = require("../../helpers/cartHelper");
const { singleResponse } = require("../../utils/response");

module.exports = async (req, db, user, isAuth, TENANTID) => {
    const data = await getSingleCart(req, db, user, isAuth, TENANTID);
    return singleResponse(data);
}