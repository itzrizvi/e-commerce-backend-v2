const { getSingleProductAvailabilityStatus } = require("../../../helpers/utils/productAvailabilityStatusHelper");
const { singleResponse } = require("../../../utils/response");

// CONTROLLER
module.exports = async (req, db, TENANTID) => {
    // SEND TO HELPER
    const data = await getSingleProductAvailabilityStatus(req, db, TENANTID);
    return singleResponse(data);
}