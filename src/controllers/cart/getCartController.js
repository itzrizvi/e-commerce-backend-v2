const { getCart } = require("../../helpers/cartHelper");
const { singleResponse } = require("../../utils/response");

module.exports = async (req, db, user, isAuth, TENANTID) => {
    const data = await getCart(req, db, user, isAuth, TENANTID);
    return singleResponse(data);
}