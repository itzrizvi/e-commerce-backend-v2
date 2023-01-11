// All Requires
const { getOrderUpdateAdminList } = require("../../helpers/orderHelper");
const { singleResponse } = require("../../utils/response");


// GET ORDER LIST CONTROLLER
module.exports = async (db, user, isAuth, TENANTID) => {

    // Sending Request to Helper
    const data = await getOrderUpdateAdminList(db, user, isAuth, TENANTID);

    // Final Response
    return singleResponse(data);
}