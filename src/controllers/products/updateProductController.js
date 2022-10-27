// All Requires
const { updateProduct } = require("../../helpers/productHelper");
const { updateProductRequest } = require("../../requests/productRequests");
const { checkPermission } = require("../../utils/permissionChecker");
const { singleResponse } = require("../../utils/response");

// Update Product Controller
module.exports = async (req, db, user, TENANTID) => {

    // Permission Name of this API
    const permissionName = "product";
    // Check Permission
    const checkPermissions = await checkPermission(db, user, TENANTID, permissionName);
    if (!checkPermissions.success) {
        return { message: "You dont have access to this route, please contact support to have you give this route permission!!!", status: false };
    }

    // Validate Create Role Request
    const validate = await updateProductRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // Return If No Auth
    if (user.has_role === '0') return { message: "Not Authorized", status: false };

    // Helper
    const data = await updateProduct(req, db, user, TENANTID);

    // Return Data
    return singleResponse(data);

}