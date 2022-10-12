// All Requires
const { getSingleCategory } = require("../../helpers/categoryHelper");
const { getSingleCategoryRequest } = require("../../requests/categoryRequests");
const { singleResponse } = require("../../utils/response");


// GET PERMISSION BY STAFF CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Validate Create Role Request
    const validate = await getSingleCategoryRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }
    // Sending Request to Helper
    const data = await getSingleCategory(req, db, user, isAuth, TENANTID);
    // Final Response
    return singleResponse(data);
}