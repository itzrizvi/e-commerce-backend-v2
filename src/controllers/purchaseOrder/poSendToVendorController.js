// ALL REQUIRES;
const { poSendToVendor } = require("../../helpers/purchaseOrderHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // HELPER
    const data = await poSendToVendor(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}