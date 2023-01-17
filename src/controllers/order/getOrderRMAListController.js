// All Requires
const { getOrderRMAList } = require("../../helpers/orderHelper");
const { singleResponse } = require("../../utils/response");


// GET CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Sending Request to Helper
    const data = await getOrderRMAList(req, db, user, isAuth, TENANTID);

    // Final Response
    return singleResponse(data);
}