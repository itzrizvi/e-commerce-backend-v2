// All Requires
const { getRecentViewProducts } = require("../../helpers/productHelper");
const { singleResponse } = require("../../utils/response");

module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Sending Request to Helper
    const data = await getRecentViewProducts(req, db, user, isAuth, TENANTID);

    // Final Response
    return singleResponse(data);
}