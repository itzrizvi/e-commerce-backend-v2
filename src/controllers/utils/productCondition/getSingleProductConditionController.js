const { getSingleProductCondition } = require("../../../helpers/utils/productConditionHelper");
const { singleResponse } = require("../../../utils/response");

// CONTROLLER
module.exports = async (req, db, TENANTID) => {
    // SEND TO HELPER
    const data = await getSingleProductCondition(req, db, TENANTID);
    return singleResponse(data);
}