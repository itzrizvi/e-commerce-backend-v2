// ALL REQUIRES;
const { updatePOStatusPublic } = require("../../helpers/purchaseOrderHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, TENANTID, ip, headers) => {

    // HELPER
    const data = await updatePOStatusPublic(req, db, TENANTID, ip, headers);

    return singleResponse(data);

}