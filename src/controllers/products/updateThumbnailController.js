// All Requires
const { updateThumbnail } = require("../../helpers/productHelper");
const { checkPermission } = require("../../utils/permissionChecker");
const { singleResponse } = require("../../utils/response");


// UPDATE PRODUCT THUMBNAIL CONTROLLER
module.exports = async (req, db, user, TENANTID) => {

    // Permission Name of this API
    const permissionName = "product";
    // Check Permission
    const checkPermissions = await checkPermission(db, user, TENANTID, permissionName);
    if (!checkPermissions.success) {
        return { message: "You dont have access to this route, please contact support to have you give this route permission!!!", status: false };
    }

    // Sending Request to Helper
    const data = await updateThumbnail(req, db, TENANTID);

    // Final Response
    return singleResponse(data);
}