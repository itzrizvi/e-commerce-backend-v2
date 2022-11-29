// All Requires
const { getReceivingProductList } = require("../../helpers/recevingProductHelper");
const { singleResponse } = require("../../utils/response");


// GET LIST CONTROLLER
module.exports = async (db, TENANTID) => {

    // Sending Request to Helper
    const data = await getReceivingProductList(db, TENANTID);

    // Final Response
    return singleResponse(data);
}