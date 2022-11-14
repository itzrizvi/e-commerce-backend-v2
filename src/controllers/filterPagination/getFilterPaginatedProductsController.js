// All Requires
const { getFilterPaginatedProducts } = require("../../helpers/filterPaginationHelper");
const { singleResponse } = require("../../utils/response");


//  CONTROLLER
module.exports = async (req, db, TENANTID) => {

    // Sending Request to Helper
    const data = await getFilterPaginatedProducts(req, db, TENANTID);

    // Final Response
    return singleResponse(data);
}