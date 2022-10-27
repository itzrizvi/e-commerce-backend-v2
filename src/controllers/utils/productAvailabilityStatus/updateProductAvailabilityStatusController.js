const { updateProductAvailabilityStatus } = require("../../../helpers/utils/productAvailabilityStatusHelper");
const { singleResponse } = require("../../../utils/response");

module.exports = async (req, db, TENANTID) => {
    const data = await updateProductAvailabilityStatus(req, db, TENANTID);
    return singleResponse(data);
}