// All Requires
const { getPOStatusList } = require("../../helpers/purchaseOrderHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (db, user, isAuth, TENANTID) => {

    // Sending Request to Helper
    const data = await getPOStatusList(db, user, isAuth, TENANTID);

    // Final Response
    return singleResponse(data);
}