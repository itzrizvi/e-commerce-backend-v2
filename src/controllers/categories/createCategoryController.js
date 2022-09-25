// All Requires
const { createCategory } = require("../../helpers/categoryHelper");
const { createCategoryRequest } = require("../../requests/categoryRequests");
const { singleResponse } = require("../../utils/response");

// Create Category Controller
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Validate Create Role Request
    const validate = await createCategoryRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // Return If No Auth
    if (!user || !isAuth) return { message: "Not Authorized", status: false };
    if (user.role_no === '0') return { message: "Not Authorized", status: false };

    // Helper
    const data = await createCategory(req, db, user, isAuth, TENANTID);

    // Return Data
    return singleResponse(data);

}