// All Requires
const { viewPurchaseOrderPublic } = require("../../helpers/purchaseOrderHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, TENANTID, ip, headers) => {

    // Sending Request to Helper
    const data = await viewPurchaseOrderPublic(req, db, TENANTID, ip, headers);

    // Final Response
    return singleResponse(data);
}