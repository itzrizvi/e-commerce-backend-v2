// All Requires
const { getOrderRMALookupList } = require("../../helpers/orderHelper");
const { singleResponse } = require("../../utils/response");


// GET ORDER LIST CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Sending Request to Helper
    const data = await getOrderRMALookupList(req, db, user, isAuth, TENANTID);

    // Final Response
    return singleResponse(data);
}