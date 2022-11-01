// All Requires
const { updateCategory } = require("../../helpers/categoryHelper");
const { checkPermission } = require("../../utils/permissionChecker");
const { singleResponse } = require("../../utils/response");

// Create Category Controller
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Permission Name of this API
    const permissionName = "category";
    // Check Permission
    const checkPermissions = await checkPermission(db, user, TENANTID, permissionName);
    if (!checkPermissions.success) {
        return { message: "You dont have access to this route, please contact support to have you give this route permission!!!", status: false };
    }

    // Helper
    const data = await updateCategory(req, db, user, isAuth, TENANTID);

    // Return Data
    return singleResponse(data);

}