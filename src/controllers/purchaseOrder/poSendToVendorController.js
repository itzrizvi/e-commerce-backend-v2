// ALL REQUIRES;
const { poSendToVendor } = require("../../helpers/purchaseOrderHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, TENANTID) => {

    // HELPER
    const data = await poSendToVendor(req, db, TENANTID);

    return singleResponse(data);

}