// All Requires
const { updateCategory } = require("../../helpers/categoryHelper");
const { updateCategoryRequest } = require("../../requests/categoryRequests");
const { singleResponse } = require("../../utils/response");

// Create Category Controller
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Validate Update Category Request
    const validate = await updateCategoryRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // Helper
    const data = await updateCategory(req, db, user, isAuth, TENANTID);

    // Return Data
    return singleResponse(data);

}