// All Requires

const { getProductsByCategory } = require("../../helpers/categoryHelper");
const { getProductByCategoryRequest } = require("../../requests/categoryRequests");
const { singleResponse } = require("../../utils/response");

// GET PERMISSION BY STAFF CONTROLLER
module.exports = async (req, db, TENANTID) => {

    // Validate Create Role Request
    const validate = await getProductByCategoryRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }
    // Sending Request to Helper
    const data = await getProductsByCategory(req, db, TENANTID);
    // Final Response
    return singleResponse(data);
}