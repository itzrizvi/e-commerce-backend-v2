// ALL REQUIRES
const { updateVendor } = require("../../helpers/vendorHelper");
const { updateVendorRequest } = require("../../requests/vendorRequests");
const { checkPermission } = require("../../utils/permissionChecker");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Permission Name of this API
    const permissionName = "vendor";
    // Check Permission
    const checkPermissions = await checkPermission(db, user, TENANTID, permissionName);
    if (!checkPermissions.success) {
        return { message: "You dont have access to this route, please contact support to have you give this route permission!!!", status: false };
    }

    // Validate Update Vendor Request
    const validate = await updateVendorRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // Update Vendor
    const data = await updateVendor(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}