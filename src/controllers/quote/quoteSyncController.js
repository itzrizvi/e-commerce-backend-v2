// ALL REQUIRES;
const { quoteSyncController } = require("../../helpers/quoteHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // SEND TO HELPER
    const data = await quoteSyncController(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}