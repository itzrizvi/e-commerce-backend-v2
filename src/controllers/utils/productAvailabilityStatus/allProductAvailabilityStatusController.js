const { getAllProductAvailabilityStatus } = require("../../../helpers/utils/productAvailabilityStatusHelper");
const { singleResponse } = require("../../../utils/response");

// GET Customer Group CONTROLLER
module.exports = async (db, TENANTID) => {
    const data = await getAllProductAvailabilityStatus(db, TENANTID);

    return singleResponse(data);
}