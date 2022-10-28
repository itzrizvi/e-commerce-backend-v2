// All Requires
const { deleteGalleryImage } = require("../../helpers/productHelper");
const { deleteGalleryImageRequest } = require("../../requests/productRequests");
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

    // Validate Add Product Request
    const validate = await deleteGalleryImageRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }
    // Sending Request to Helper
    const data = await deleteGalleryImage(req, db, TENANTID);

    // Final Response
    return singleResponse(data);
}