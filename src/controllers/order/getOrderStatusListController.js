// All Requires
const { getOrderStatusList } = require("../../helpers/orderHelper");
const { singleResponse } = require("../../utils/response");


// GET ORDER LIST CONTROLLER
module.exports = async (db, TENANTID) => {

    // Sending Request to Helper
    const data = await getOrderStatusList(db, TENANTID);

    // Final Response
    return singleResponse(data);
}