// All Requires
const { getPOStatusList } = require("../../helpers/purchaseOrderHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (db, TENANTID) => {

    // Sending Request to Helper
    const data = await getPOStatusList(db, TENANTID);

    // Final Response
    return singleResponse(data);
}