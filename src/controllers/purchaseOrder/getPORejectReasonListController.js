// All Requires
const { getPORejectReasonList } = require("../../helpers/purchaseOrderHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (db, TENANTID) => {

    // Sending Request to Helper
    const data = await getPORejectReasonList(db, TENANTID);

    // Final Response
    return singleResponse(data);
}