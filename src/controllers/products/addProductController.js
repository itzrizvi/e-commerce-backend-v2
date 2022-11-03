// All Requires
const { addProduct } = require("../../helpers/productHelper");
const { checkPermission } = require("../../utils/permissionChecker");
const { singleResponse } = require("../../utils/response");

// Add Product Controller
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Permission Name of this API
    const permissionName = "product";
    // Check Permission
    const checkPermissions = await checkPermission(db, user, TENANTID, permissionName);
    if (!checkPermissions.success) {
        return { message: "You dont have access to this route, please contact support to have you give this route permission!!!", status: false };
    }

    // Return If No Auth
    if (!user || !isAuth) return { message: "Not Authorized", status: false };
    if (user.has_role === '0') return { message: "Not Authorized", status: false };

    // Helper
    const data = await addProduct(req, db, user, isAuth, TENANTID);

    // Return Data
    return singleResponse(data);

}