// All Requires
const { changeProductIsSerial } = require("../../helpers/productHelper");
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

    // Helper
    const data = await changeProductIsSerial(req, db, user, TENANTID);

    // Return Data
    return singleResponse(data);

}